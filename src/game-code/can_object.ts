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
    private rotDir = 0;
    private vel: Vec2 = new Vec2();

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

        if (this.started == true) {
            this.updateFlight(delta);
        } else if (this.hit) {
            // Make the can fall over on the floor.
            this.vel.y = 0;
            const rotation = this.object.rotation % (Math.PI * 2);
            const distRight = Math.abs(rotation - (Math.PI + Math.PI * 0.5));
            this.object.rotation += distRight * delta;
        }
    }

    reset() {
        this.object.x = 200;
        this.object.y = 200;
        this.vel = { x: 0, y: 0 };
        this.hit = false;
        this.started = false;
        this.object.rotation = 0;
        this.object.zIndex = 999;

        this.camera.reset();
    }

    updateFlight(delta) {
        const distToGround = Math.abs(this.object.y - this.groundHeight);
        if (this.object.y > this.groundHeight) {
            this.object.y = this.groundHeight;
            this.vel.y *= -0.7;
            this.rotDir = (Math.random() - 0.5) * this.vel.x * 0.1;
            console.log(`Bouncing at ${this.object.x}, ${this.object.y} => new vel = ${this.vel.y}`);
        }

        if (this.hit && distToGround > 1) {
            this.object.rotation += this.rotDir * 0.4 * delta;
        }

        const frictionConstant = distToGround > 1 ? 0 : -0.1;
        this.vel.x += this.vel.x * frictionConstant * delta;
        this.vel.y += delta;

        this.object.x += this.vel.x * delta;
        this.object.y += this.vel.y * delta;

        if (this.hit == false && this.object.y >= this.groundHeight) {
            this.reset();
        }
    }

    onKey(event) {
        if (event.code === 'Space') {
            if (this.started === false) {
                this.reset();

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
                    this.rotDir = (Math.random() - 0.5) * 2 * this.vel.x;

                    this.hit = true;
                } else {
                    console.log(`Swing, miss: ${this.object.y} (${this.minHitHeight}, ${this.maxHitHeight})`);
                }
            }
        }
    }

    // Rotation as a value between -1 and 1
    get upNormal() {
        let rot = this.object.rotation;
        rot %= Math.PI * 2;
        rot /= Math.PI * 2;
        return rot;
    }

    get groundHeight() {
        const origHeight = window.innerHeight - this.object.height * 0.5;
        const distToGround = Math.abs(this.object.y - origHeight);
        if (this.hit == false || distToGround > 1) {
            return origHeight;
        }

        // This means we landed.
        console.log(`Score: ${this.object.x / 100} meters`);
        this.started = false;
        this.vel.y = 0;
        const height = lerp(this.object.width, this.object.height, Math.abs(this.upNormal) - 0.5 * 2);
        return window.innerHeight - height * 0.5;
    }

    get wasHit() {
        return this.hit;
    }

    get minHitHeight() {
        return 400;
    }

    get maxHitHeight() {
        return 600;
    }
}
