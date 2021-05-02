import * as Pixi from 'pixi.js';
import Batter from './batter';

import Camera from './camera';
import CanObject from './can_object';
import extraHits from 'state/extraHits.state';
import { useRecoilState } from 'recoil';

export default function main(app: Pixi.Application, setRemainingHits) {
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
    canObject.onHitsLeftChanged = (hits) => {
        setRemainingHits(hits);
    };

    function update(delta) {
        canObject.update(delta);
        batter.update(delta);

        camera.enabled = canObject.wasHit;
        camera.moveTo(canObject.object.x, canObject.object.y);
        camera.update(delta);
    }
}
