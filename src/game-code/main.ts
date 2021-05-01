import * as Pixi from 'pixi.js';

import TestBackground from 'assets/test-background.png';

``;
export default function main(app: Pixi.Application) {
    const background = Pixi.Sprite.from(TestBackground);

    background.height = app.screen.height;
    background.width = app.screen.width;

    app.stage.addChild(background);
}
