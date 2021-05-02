import * as Pixi from 'pixi.js';
import Batter from './batter';

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

    const camera = new Camera(scene, app.view, app.stage, 0, 0);
    const canObject = new CanObject(scene, app.view, camera);
    const batter = new Batter(scene, app.view, canObject);
    stage.addChild(scene);

    app.ticker.add(update);

    function update(delta) {
        canObject.update(delta);
        batter.update(delta);

        camera.enabled = canObject.wasHit;
        camera.moveTo(canObject.object.x, canObject.object.y);
        camera.update(delta);
    }
}
