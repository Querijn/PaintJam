import * as Pixi from 'pixi.js';

export default class Camera {
    public enabled: boolean;

    private x: number = 0;
    private y: number = 0;
    private prevX: number = 0;
    private prevY: number = 0;

    private scene: Pixi.Container;

    private farthest: Pixi.TilingSprite;
    private mid: Pixi.TilingSprite;
    private close: Pixi.TilingSprite;

    constructor(scene: Pixi.Container, stage: Pixi.Container, x: number, y: number) {
        const yOffset = 75;

        this.moveTo(x, y);
        this.enabled = false;
        this.scene = scene;

        // Setup background
        this.close = new Pixi.TilingSprite(Pixi.Texture.from('assets/layer_1.png'), window.innerWidth, window.innerHeight);
        this.mid = new Pixi.TilingSprite(Pixi.Texture.from('assets/layer_2.png'), window.innerWidth, window.innerHeight);
        this.farthest = new Pixi.TilingSprite(Pixi.Texture.from('assets/layer_3.png'), window.innerWidth, window.innerHeight);

        this.farthest.position.x = 0;
        this.farthest.position.y = window.innerHeight - 720 + yOffset;
        this.farthest.scale.y = 1;
        this.farthest.tilePosition.x = 0;
        this.farthest.tilePosition.y = -yOffset;
        this.farthest.uvRespectAnchor = true;
        this.farthest.zIndex = -3;
        stage.addChild(this.farthest);

        this.mid.position.x = 0;
        this.mid.position.y = window.innerHeight - 720 + yOffset;
        this.mid.tilePosition.x = 0;
        this.mid.tilePosition.y = -yOffset;
        this.mid.scale.y = 1;
        this.mid.zIndex = -2;
        stage.addChild(this.mid);

        this.close.position.x = 0;
        this.close.position.y = window.innerHeight - 720 + yOffset;
        this.close.tilePosition.x = 0;
        this.close.tilePosition.y = -yOffset;
        this.close.zIndex = -1;
        stage.addChild(this.close);
    }

    moveTo(x: number, y: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    reset() {
        this.x = 0;
        this.y = 0;

        this.scene.x = 0;
        this.scene.y = 0;
        this.scene.scale.x = 1;
        this.scene.scale.y = 1;
        this.enabled = false;
    }

    // Frame update
    update(delta) {
        const offset = this.x - this.prevX;
        this.close.tilePosition.x -= 1.0 * offset;
        this.mid.tilePosition.x -= 0.7 * offset;
        this.farthest.tilePosition.x -= 0.3 * offset;

        this.prevX = this.x;
        this.prevY = this.y;

        if (this.enabled === false || this.x < window.innerWidth / 2) {
            return;
        }

        const targetX = window.innerWidth / 2 - this.x;
        const targetY = window.innerHeight * 0.75 - this.y;

        const distX = this.scene.x - targetX;
        const distY = this.scene.y - targetY;

        this.scene.x -= distX * delta;
        // this.scene.y -= distY * delta;
    }
}
