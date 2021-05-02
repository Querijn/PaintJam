import * as Pixi from 'pixi.js';

import Camera from './camera';
import CanObject from './can_object';

export default function main(app: Pixi.Application) {
    const resources = Pixi.Loader;

    const renderer = Pixi.autoDetectRenderer({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const stage = app.stage;
    const scene = new Pixi.Container();

    const camera = new Camera(scene, app.stage, 0, 0);
    const canObject = new CanObject(scene, camera);
    stage.addChild(scene);

    app.ticker.add(update);

    function update(delta) {
        canObject.update(delta);

        camera.enabled = canObject.wasHit;
        camera.moveTo(canObject.object.x, canObject.object.y);
        camera.update(delta);
    }
}
