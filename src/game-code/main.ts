import * as Pixi from 'pixi.js';
import Batter from './batter';

import Camera from './camera';
import CanObject from './can_object';
import SignManager from './sign_manager';
import FloorManager from './floor_scenery';
import ScoreBoard from './score_board';

import BuildingImage from 'game-code/assets/buildingleft.png';

ScoreBoard.onNewHighscore = () => {
    console.log('Wow! Nice!');
};

export default function main(app: Pixi.Application, setRemainingHits, setHighscore, setScore) {
    const loader = new Pixi.Loader();
    loader.add('pixeled', 'assets/Pixeled.ttf');

    loader.load(() => {
        const stage = app.stage;
        const scene = new Pixi.Container();

        const camera = new Camera(scene, app.view, app.stage, 0, 0);
        const canObject = new CanObject(scene, app.view, camera);
        const batter = new Batter(scene, app.view, canObject);
        const floorManager = new FloorManager(scene, app.view, camera);
        const signManager = new SignManager(scene, app.view, camera);

        const building = new Pixi.Sprite(Pixi.Texture.from(BuildingImage));
        scene.addChild(building);

        stage.addChild(scene);
        ScoreBoard.init();

        ScoreBoard.onNewHighscore = (score) => {
            setHighscore(score.toFixed(0));
        };

        app.ticker.add(update);

        canObject.onHitsLeftChanged = (hits) => {
            setRemainingHits(hits);
        };

        function update(delta) {
            building.y = app.view.height - 611;

            canObject.update(delta);
            batter.update(delta);
            floorManager.update(delta);
            signManager.update(delta);

            camera.enabled = canObject.wasHit;
            camera.moveTo(canObject.object.x, canObject.object.y);
            camera.update(delta);
        }
    });
}
