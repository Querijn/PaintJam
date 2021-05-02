import * as PIXI from 'pixi.js';
import Camera from './camera';

import GroundImage1 from 'game-code/assets/ground_obj_1.png';
import GroundImage2 from 'game-code/assets/ground_obj_2.png';
import GroundImage3 from 'game-code/assets/ground_obj_3.png';
import GroundImage4 from 'game-code/assets/ground_obj_4.png';
import GroundImage5 from 'game-code/assets/ground_obj_5.png';
import GroundImage6 from 'game-code/assets/ground_obj_6.png';
import GroundImage7 from 'game-code/assets/ground_obj_7.png';

export default class FloorManager {
    public signs: PIXI.Sprite[] = [];
    private scene: PIXI.Container;
    private canvas: HTMLCanvasElement;
    private camera: Camera;
    private nextSignOffset = 1000;

    constructor(scene: PIXI.Container, canvas: HTMLCanvasElement, camera: Camera) {
        this.canvas = canvas;
        this.camera = camera;

        this.scene = scene;

        const images = [GroundImage1, GroundImage2, GroundImage3, GroundImage4, GroundImage5, GroundImage6, GroundImage7];

        for (let i = 0; i < 7; i++) {
            const obj = new PIXI.Sprite(PIXI.Texture.from(images[i]));
            this.signs.push(obj);
            this.scene.addChild(obj);
        }

        this.reset();
    }

    reset() {
        this.nextSignOffset = 0;
        this.updateSigns(true);
    }

    updateSigns(force: boolean = false) {
        const minViewportX = this.camera.offset - this.canvas.width;

        for (let i = 0; i < 7; i++) {
            const obj = this.signs[i];
            obj.y = this.canvas.height - obj.height;
            if (obj.x > minViewportX && !force) {
                continue;
            }

            obj.x = this.nextSignOffset;

            this.nextSignOffset += 100 + Math.random() * 400 + this.canvas.width;
        }
    }

    update(delta) {
        this.updateSigns();
    }
}
