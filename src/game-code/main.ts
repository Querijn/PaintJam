import * as Pixi from 'pixi.js';
import Batter from './batter';

import Camera from './camera';
import CanObject from './can_object';
import extraHits from 'state/extraHits.state';
import { useRecoilState } from 'recoil';
import SignManager from './sign_manager';

export default function main(app: Pixi.Application, setRemainingHits) {
    const stage = app.stage;
    const scene = new Pixi.Container();

    const camera = new Camera(scene, app.view, app.stage, 0, 0);
    const canObject = new CanObject(scene, app.view, camera);
    const batter = new Batter(scene, app.view, canObject);
    const signManager = new SignManager(scene, app.view, camera);
    stage.addChild(scene);

    app.ticker.add(update);
    canObject.onHitsLeftChanged = (hits) => {
        setRemainingHits(hits);
    };

    function update(delta) {
        canObject.update(delta);
        batter.update(delta);
        signManager.update(delta);

        camera.enabled = canObject.wasHit;
        camera.moveTo(canObject.object.x, canObject.object.y);
        camera.update(delta);
    }
}
