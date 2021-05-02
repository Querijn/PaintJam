import * as PIXI from 'pixi.js';
import Camera from './camera';
import { lerp } from './math';
import Vec2 from './vec2';

import CanObjectImage from 'game-code/assets/can_object.png';

export default class CanObject {
    public object: PIXI.Sprite;
    private scene: PIXI.Container;
    private camera: Camera;

    private started = false;
    private hit = false;
    private needsReset = false;
    private rotDir = 0;
    private vel: Vec2 = new Vec2();
    private extraHits = 3;

    constructor(scene: PIXI.Container, camera: Camera) {
        const texture = PIXI.Texture.from(CanObjectImage);
        this.object = new PIXI.Sprite(texture);
        this.camera = camera;

        this.scene = scene;
        this.scene.addChild(this.object);

        this.scene.addChild(this.getDebugLineGraphics());

        document.addEventListener('keyup', (e) => this.onKey(e));
        this.reset();
    }

    getDebugLineGraphics() {
        let graphics = new PIXI.Graphics();

        // set a fill and line style
        graphics.beginFill(0xff0000);
        graphics.lineStyle(10, 0xff0000, 1);

        // draw a shape
        graphics.moveTo(0, this.minHitHeight);
        graphics.lineTo(500, this.minHitHeight);
        graphics.endFill();

        graphics.beginFill(0xff0000);
        graphics.lineStyle(10, 0xff0000, 1);

        // draw a shape
        graphics.moveTo(0, this.maxHitHeight);
        graphics.lineTo(500, this.maxHitHeight);
        graphics.endFill();

        graphics.beginFill(0x00ff00);
        graphics.lineStyle(10, 0x00ff00, 1);

        // draw a shape
        const size = (this.maxHitHeight + this.minHitHeight) / 2;
        graphics.moveTo(0, size);
        graphics.lineTo(500, size);
        graphics.endFill();

        return graphics;
    }

    update(delta) {
        // Ensure that the scale data is correct
        this.object.scale.x = 0.25;
        this.object.scale.y = 0.25;

        this.object.anchor.x = 0.5;
        this.object.anchor.y = 0.5;

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

        if (this.needsReset == false && this.hit && this.vel.x < 0.1 && this.vel.y < 1) {
            this.vel.reset();
            console.log(`Score: ${this.object.x / 100} meters`);
            this.needsReset = true;
        }
    }

    reset() {
        this.object.x = 230;
        this.object.y = window.innerHeight - 600;
        this.vel = new Vec2();
        this.hit = false;
        this.started = false;
        this.object.rotation = 0;
        this.object.zIndex = 999;
        this.needsReset = false;
        this.extraHits = 3;

        this.camera.reset();
    }

    setupRotDir() {
        const yInfluence = Math.abs(this.vel.y) / 40;
        const xInfluence = this.vel.x * 0.1;
        this.rotDir = Math.random() * this.upNormal * yInfluence * xInfluence;
    }

    updateFlight(delta) {
        const distToGround = Math.abs(this.object.y - this.groundHeight);
        if (this.object.y > this.groundHeight) {
            this.object.y = this.groundHeight;

            // Reset Y velocity
            if (Math.abs(this.vel.y) > 1) {
                this.vel.y = -Math.abs(this.vel.y) * 0.7;
            }

            // If we're not really bouncing anymore, force ourselves to the ground
            if (Math.abs(this.vel.y) < 1) {
                this.vel.y = 0;
            }

            this.setupRotDir();
        }

        if (this.hit && distToGround > 1) {
            this.object.rotation += this.rotDir * 0.4 * delta;
        }

        this.vel.y += delta;
        this.object.y += this.vel.y * delta;

        // If we missed, reset the can to its original position
        if (this.hit == false && this.object.y >= this.groundHeight) {
            this.reset();
        }
    }

    onKey(event) {
        if (event.code === 'Space') {
            if (this.needsReset) {
                this.reset();
            } else if (this.started === false) {
                this.started = true;
                this.hit = false;
            } else if (this.hit === false) {
                // If we weren't hit, check if we are now

                if (this.object.y > this.minHitHeight && this.object.y < this.maxHitHeight) {
                    // Determine the rotation angle in radians
                    const baseOffset = this.maxHitHeight - this.minHitHeight;
                    const distanceFromCenter = (this.object.y - this.minHitHeight) / baseOffset;
                    let rotAngle = lerp(0, Math.PI, distanceFromCenter);

                    // Calculate the direction vector (multiplied by 100) (base is x: 0, y: -1)
                    let cs = Math.cos(rotAngle);
                    let sn = Math.sin(rotAngle);
                    this.vel.x = 100 * sn;
                    this.vel.y = -100 * cs;

                    console.log(`Swing, hit: ${this.object.y} (${this.minHitHeight}, ${this.maxHitHeight}) => ${this.vel.x}, ${this.vel.y}`);
                    this.setupRotDir();

                    this.hit = true;
                } else {
                    console.log(`Swing, miss: ${this.object.y} (${this.minHitHeight}, ${this.maxHitHeight})`);
                }
            } else if (this.extraHits > 0) {
                // We're hitting it after launch
                if (this.vel.y > 0) {
                    // Invert without friction
                    this.vel.y *= -1;
                } else {
                    // Small boost if we were going up
                    this.vel.y *= 1.3;
                }
                this.extraHits--;
            }
        }
    }

    // Rotation as a value between -1 and 1
    get upNormal() {
        return Math.sin(this.object.rotation + Math.PI / 2);
    }

    get groundHeight() {
        const origHeight = window.innerHeight - this.object.height * 0.5;
        const distToGround = Math.abs(this.object.y - origHeight);
        if (this.hit == false || distToGround > 1 || this.vel.y > 1) {
            return origHeight;
        }

        // This means we landed.
        this.started = false;
        this.vel.y = 0;
        const height = lerp(this.object.width, this.object.height, Math.abs(this.upNormal) - 0.5 * 2);
        return window.innerHeight - height * 0.5;
    }

    get wasHit() {
        return this.hit;
    }

    get minHitHeight() {
        return window.innerHeight - 300;
    }

    get maxHitHeight() {
        return window.innerHeight - 100;
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
}
