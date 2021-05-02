import * as Pixi from 'pixi.js';

const yOffset = 75;

export default class Camera {
    public enabled: boolean;
    private canvas: HTMLCanvasElement;

    private x: number = 0;
    private y: number = 0;
    private prevX: number = 0;
    private prevY: number = 0;

    private scene: Pixi.Container;

    private farthest: Pixi.TilingSprite;
    private mid: Pixi.TilingSprite;
    private close: Pixi.TilingSprite;
    private ground: Pixi.TilingSprite;

    constructor(scene: Pixi.Container, canvas: HTMLCanvasElement, stage: Pixi.Container, x: number, y: number) {
        this.moveTo(x, y);
        this.enabled = false;
        this.scene = scene;
        this.canvas = canvas;

        // Setup background
        this.close = new Pixi.TilingSprite(Pixi.Texture.from('assets/layer_1.png'), this.canvas.width, this.canvas.height);
        this.mid = new Pixi.TilingSprite(Pixi.Texture.from('assets/layer_2.png'), this.canvas.width, this.canvas.height);
        this.farthest = new Pixi.TilingSprite(Pixi.Texture.from('assets/layer_3.png'), this.canvas.width, this.canvas.height);
        this.ground = new Pixi.TilingSprite(Pixi.Texture.from('assets/ground.png'), this.canvas.width, 4);

        this.farthest.position.x = 0;
        this.farthest.position.y = this.canvas.height - 720 + yOffset;
        this.farthest.scale.y = 1;
        this.farthest.tilePosition.x = 0;
        this.farthest.tilePosition.y = -yOffset;
        this.farthest.uvRespectAnchor = true;
        this.farthest.zIndex = -3;
        stage.addChild(this.farthest);

        this.mid.position.x = 0;
        this.mid.position.y = this.canvas.height - 720 + yOffset;
        this.mid.tilePosition.x = 0;
        this.mid.tilePosition.y = -yOffset;
        this.mid.scale.y = 1;
        this.mid.zIndex = -2;
        stage.addChild(this.mid);

        this.close.position.x = 0;
        this.close.position.y = this.canvas.height - 720 + yOffset;
        this.close.tilePosition.x = 0;
        this.close.tilePosition.y = -yOffset;
        this.close.zIndex = -1;
        stage.addChild(this.close);

        this.ground.position.x = 0;
        this.ground.position.y = this.canvas.height;
        this.ground.tilePosition.x = 0;
        this.ground.tilePosition.y = -yOffset;
        this.ground.zIndex = 0;
        stage.addChild(this.ground);
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
        this.farthest.position.y = this.canvas.height - 720 + yOffset;
        this.mid.position.y = this.canvas.height - 720 + yOffset;
        this.close.position.y = this.canvas.height - 720 + yOffset;
        this.ground.position.y = this.canvas.height - 4;

        this.farthest.width = this.canvas.width;
        this.mid.width = this.canvas.width;
        this.close.width = this.canvas.width;
        this.ground.width = this.canvas.width;

        this.farthest.height = this.canvas.height;
        this.mid.height = this.canvas.height;
        this.close.height = this.canvas.height;
        this.ground.height = this.canvas.height;

        const offset = this.x - this.prevX;
        this.prevX = this.x;
        this.prevY = this.y;

        if (this.enabled === false || this.x < this.canvas.width / 2) {
            return;
        }

        this.close.tilePosition.x -= 1.0 * offset;
        this.mid.tilePosition.x -= 0.7 * offset;
        this.farthest.tilePosition.x -= 0.3 * offset;
        this.ground.tilePosition.x -= offset;

        const targetX = this.canvas.width / 2 - this.x;
        const targetY = this.canvas.height * 0.75 - this.y;

        const distX = this.scene.x - targetX;
        const distY = this.scene.y - targetY;

        this.scene.x -= distX * delta;
        // this.scene.y -= distY * delta;
    }

    get offset() {
        return -this.scene.x;
    }
}
