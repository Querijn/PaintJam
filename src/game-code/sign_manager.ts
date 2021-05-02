import * as PIXI from 'pixi.js';
import Camera from './camera';

import SignImage from 'game-code/assets/sign_marker.png';

// prettier-ignore
const SignStyle = new PIXI.TextStyle({
    fill: 'white',
    fontFamily: "\"pixeled\", Fallback, sans-serif",
    fontSize: 20
});

class Sign extends PIXI.Sprite {
    public text = new PIXI.Text('', SignStyle);

    constructor(texture: PIXI.Texture) {
        super(texture);

        this.text.rotation = -0.06;
        this.text.anchor.x = 0.5;
        this.text.anchor.y = 0.5;
        this.text.x = 40;
        this.text.y = 26;
        this.addChild(this.text);
    }
}

export default class SignManager {
    public signs: Sign[] = [];
    private scene: PIXI.Container;
    private canvas: HTMLCanvasElement;
    private camera: Camera;
    private nextSignOffset = 1000;

    constructor(scene: PIXI.Container, canvas: HTMLCanvasElement, camera: Camera) {
        this.canvas = canvas;
        this.camera = camera;

        this.scene = scene;

        for (let i = 0; i < 10; i++) {
            const obj = new Sign(PIXI.Texture.from(SignImage));
            this.signs.push(obj);
            this.scene.addChild(obj);
        }

        this.reset();
    }

    reset() {
        this.nextSignOffset = 1000;
        this.updateSigns(true);
    }

    updateSigns(force: boolean = false) {
        const minViewportX = this.camera.offset - this.canvas.width;

        for (let i = 0; i < 10; i++) {
            const obj = this.signs[i];
            obj.y = this.canvas.height - obj.height;
            if (obj.x > minViewportX && !force) {
                continue;
            }

            obj.x = this.nextSignOffset;
            obj.text.text = Math.round(this.nextSignOffset / 100).toString();
            console.log(`Placed sign ${i} at ${obj.x}.`);

            this.nextSignOffset += 1000;
        }
    }

    update(delta) {
        this.updateSigns();
    }
}
