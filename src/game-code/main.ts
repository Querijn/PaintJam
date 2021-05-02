import * as Pixi from 'pixi.js';

import TestBackground from 'game-code/assets/test-background.png';

const yOffset = -75;

export default function main(app: Pixi.Application) {
    console.log('hi there');
    const resources = Pixi.Loader;

    const renderer = Pixi.autoDetectRenderer({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const login = document.getElementById('parallax');
    const stage = app.stage;

    const loader = new Pixi.Loader();

    login?.appendChild(renderer.view);

    let farthest, mid, close: Pixi.TilingSprite;

    loader.load(setup);

    function setup() {
        close = new Pixi.TilingSprite(Pixi.Texture.from('assets/layer_1.png'), window.innerWidth, window.innerHeight);
        mid = new Pixi.TilingSprite(Pixi.Texture.from('assets/layer_2.png'), window.innerWidth, window.innerHeight);
        farthest = new Pixi.TilingSprite(
            Pixi.Texture.from('assets/layer_3.png'),
            window.innerWidth,
            window.innerHeight,
        );

        farthest.position.x = 0;
        farthest.position.y = window.innerHeight - 720 + 73;
        farthest.scale.y = 1;
        farthest.tilePosition.x = 0;
        farthest.tilePosition.y = yOffset;
        farthest.uvRespectAnchor = true;

        stage.addChild(farthest);

        mid.position.x = 0;
        mid.position.y = window.innerHeight - 720 + 73;
        mid.tilePosition.x = 0;
        mid.tilePosition.y = yOffset;
        mid.scale.y = 1;

        stage.addChild(mid);

        close.position.x = 0;
        close.position.y = window.innerHeight - 720 + 73;
        close.tilePosition.x = 0 - 100;
        close.tilePosition.y = yOffset;

        stage.addChild(close);

        requestAnimationFrame(update);
    }

    function update() {
        close.tilePosition.x -= 0.32;
        mid.tilePosition.x -= 0.128;
        farthest.tilePosition.x -= 0.0512;

        requestAnimationFrame(update);
    }
}
