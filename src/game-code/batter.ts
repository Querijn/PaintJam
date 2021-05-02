import * as PIXI from 'pixi.js';

import BatterFrame1 from 'game-code/assets/warhol_1.png';
import BatterFrame2 from 'game-code/assets/warhol_2.png';
import BatterFrame3 from 'game-code/assets/warhol_3.png';
import BatterFrame4 from 'game-code/assets/warhol_4.png';
import BatterFrame5 from 'game-code/assets/warhol_5.png';
import BatterFrame6 from 'game-code/assets/warhol_6.png';
import BatterFrame7 from 'game-code/assets/warhol_7.png';
import CanObject from './can_object';

export default class Batter {
    private object: PIXI.AnimatedSprite;
    private canObject: CanObject;
    private canvas: HTMLCanvasElement;

    constructor(scene: PIXI.Container, canvas: HTMLCanvasElement, canObject: CanObject) {
        this.canObject = canObject;
        this.canvas = canvas;

        let textureArray: PIXI.Texture[] = [
            PIXI.Texture.from(BatterFrame1),
            PIXI.Texture.from(BatterFrame2),
            PIXI.Texture.from(BatterFrame3),
            PIXI.Texture.from(BatterFrame4),
            PIXI.Texture.from(BatterFrame5),
            PIXI.Texture.from(BatterFrame6),
            PIXI.Texture.from(BatterFrame7),
            PIXI.Texture.from(BatterFrame5),
            PIXI.Texture.from(BatterFrame4),
            PIXI.Texture.from(BatterFrame3),
            PIXI.Texture.from(BatterFrame2),
            PIXI.Texture.from(BatterFrame1),
        ];

        this.object = new PIXI.AnimatedSprite(textureArray);
        scene.addChild(this.object);

        this.object.loop = false;

        const play = (e) => {
            if (this.canObject.isFalling) {
                this.play();
            }
        };
        document.addEventListener('keyup', (e) => this.onKey(e));
        document.addEventListener('click', play);
    }

    onKey(event) {
        if (event.code === 'Space') {
            this.play();
        }
    }

    update(delta) {
        this.object.y = this.canvas.height - 335;
    }

    play(onDone?: () => void) {
        // Call callback when done
        if (onDone) {
            this.object.onComplete = () => {
                onDone();
                this.object.onComplete = undefined;
            };
        }

        this.object.gotoAndPlay(0);
    }
}
