import * as PIXI from 'pixi.js';
import Camera from './camera';
import { lerp } from './math';
import Vec2 from './vec2';

import CanObjectImage from 'game-code/assets/can_object.png';
import HitMarker from 'game-code/assets/hit_marker.png';

export default class CanObject {
    public object: PIXI.Sprite;
    public hitMarker: PIXI.Sprite;
    private scene: PIXI.Container;
    private camera: Camera;
    private canvas: HTMLCanvasElement;
    private timeout = -1;

    private onHitCallback: ((remainingHits: number) => void) | null;

    private started = false;
    private hit = false;
    private needsReset = false;
    private rotDir = 0;
    private vel: Vec2 = new Vec2();
    private extraHits = 3;
    private y = 0;

    constructor(scene: PIXI.Container, canvas: HTMLCanvasElement, camera: Camera) {
        this.object = new PIXI.Sprite(PIXI.Texture.from(CanObjectImage));
        this.camera = camera;
        this.canvas = canvas;
        this.onHitCallback = null;

        this.scene = scene;
        this.scene.addChild(this.object);

        this.hitMarker = new PIXI.Sprite(PIXI.Texture.from(HitMarker));
        this.hitMarker.x = -40;
        this.hitMarker.y = 60;
        this.hitMarker.rotation = -Math.PI / 4;
        this.hitMarker.anchor.x = 0.5;
        this.hitMarker.anchor.y = 0.5;
        this.hitMarker.scale.x = 3.4;
        this.hitMarker.scale.y = 3.4;
        this.hitMarker.visible = false;
        this.object.addChild(this.hitMarker);

        document.addEventListener('keyup', (e) => this.onKey(e));
        this.reset();
    }

    reset() {
        this.object.x = 230;
        this.y = 600;
        this.vel = new Vec2();
        this.hit = false;
        this.started = false;
        this.object.rotation = 0;
        this.object.zIndex = 999;
        this.needsReset = false;
        this.extraHits = 3;

        if (this.timeout != -1) {
            window.clearTimeout(this.timeout);
            this.timeout = -1;
        }

        if (this.onHitCallback) {
            this.onHitCallback(this.remainingHits);
        }

        this.camera.reset();
    }

    setupRotDir() {
        const yInfluence = Math.abs(this.vel.y) / 40;
        const xInfluence = this.vel.x * 0.1;
        this.rotDir = Math.random() * this.upNormal * yInfluence * xInfluence;
    }

    update(delta) {
        // Ensure that the scale data is correct
        this.object.scale.x = 0.25 + Math.abs(this.vel.x + this.vel.y) / 800;
        this.object.scale.y = 0.25 + Math.abs(this.vel.x + this.vel.y) / 800;

        this.object.anchor.x = 0.5;
        this.object.anchor.y = 0.5;

        // Make sure we don't make infinitely small bounces
        if (this.hit && this.distToGround < 1 && this.vel.y < 1) {
            this.started = false;
            this.vel.y = 0;
        }

        // This means we landed.

        let frictionConstant = 1 - (this.started ? 0 : 0.01);
        if (this.started == true) {
            this.updateFlight(delta);
        } else if (this.hit && this.needsReset == false) {
            const rotationLeft = Math.abs(this.upNormal);

            if (rotationLeft > 0.01) {
                this.object.rotation += rotationLeft * delta * 0.1;
            }
        }

        this.vel.x = this.vel.x * frictionConstant;
        this.object.x += this.vel.x * delta;
        this.object.y = this.canvas.height - this.y;

        if (this.needsReset == false && this.hit && this.vel.x < 0.1 && this.vel.y < 1) {
            this.vel.reset();
            console.log(`Score: ${this.object.x / 100} meters`);
            this.needsReset = true;
        }
    }

    updateFlight(delta) {
        if (this.y + this.sizeToBottom < 0) {
            this.y = 0;

            // Reset Y velocity
            if (Math.abs(this.vel.y) > 1) {
                this.vel.y = Math.abs(this.vel.y) * 0.7;
            }

            // If we're not really bouncing anymore, force ourselves to the ground
            if (Math.abs(this.vel.y) < 1) {
                this.vel.y = 0;
            }

            this.setupRotDir();
        }

        if (this.hit && this.distToGround > 1) {
            this.object.rotation += this.rotDir * 0.4 * delta;
        }

        this.vel.y -= delta;
        this.y += this.vel.y * delta;

        // If we missed, reset the can to its original position
        if (this.hit == false && this.y <= 0) {
            this.reset();
        }
    }

    onKey(event) {
        if (event.code === 'Space') {
            if (this.needsReset) {
                this.reset();
            } else if (this.started === false) {
                this.started = true;
            } else if (this.hit === false) {
                // If we weren't hit, check if we are now

                if (this.y > this.minHitHeight && this.y < this.maxHitHeight) {
                    // Determine the rotation angle in radians
                    const baseOffset = this.maxHitHeight - this.minHitHeight;
                    const distanceFromCenter = (this.y - this.minHitHeight) / baseOffset;
                    let rotAngle = lerp(0, Math.PI, distanceFromCenter);

                    // Calculate the direction vector (multiplied by 100) (base is x: 0, y: -1)
                    let cs = Math.cos(rotAngle);
                    let sn = Math.sin(rotAngle);
                    this.vel.x = 100 * sn;
                    this.vel.y = -100 * cs;

                    console.log(`Swing, hit: ${this.y} (${this.minHitHeight}, ${this.maxHitHeight}) => ${this.vel.x}, ${this.vel.y}`);
                    this.setupRotDir();

                    this.hit = true;
                } else {
                    console.log(`Swing, miss: ${this.y} (${this.minHitHeight}, ${this.maxHitHeight})`);
                }
            } else if (this.extraHits > 0) {
                // We're hitting it after launch
                if (this.vel.y < 0) {
                    // Invert without friction
                    this.vel.y *= -1;
                } else {
                    // Small boost if we were going up
                    this.vel.y *= 1.3;
                }

                this.hitMarker.visible = true;
                this.timeout = window.setTimeout(() => (this.hitMarker.visible = false), 100);
                this.extraHits--;
                if (this.onHitCallback) {
                    this.onHitCallback(this.remainingHits);
                }
            }
        }
    }

    set onHitsLeftChanged(callback: (remainingHits: number) => void) {
        this.onHitCallback = callback;
    }

    // Rotation as a value between -1 and 1
    get upNormal() {
        return Math.sin(this.object.rotation + Math.PI / 2);
    }

    get wasHit() {
        return this.hit;
    }

    get minHitHeight() {
        return 100;
    }

    get maxHitHeight() {
        return 300;
    }

    get remainingHits() {
        return this.extraHits;
    }

    get currentScore() {
        return this.object.x / 100;
    }

    get isFalling() {
        return this.started && Math.abs(this.vel.y) > 1;
    }

    get sizeToBottom() {
        const xScale = this.object.width * 0.5 * this.object.scale.x;
        const yScale = this.object.height * 0.5 * this.object.scale.y;
        return lerp(yScale, xScale, Math.abs(this.upNormal) / 2 + 0.5);
    }

    get distToGround() {
        return Math.abs(this.y - this.sizeToBottom);
    }
}
