import * as PIXI from 'pixi.js';

export default abstract class ScoreBoard {
    public static highScore;

    public static init() {
        ScoreBoard.highScore = parseFloat(window.localStorage.getItem('highscore') || '0');
    }

    public static updateHighscore(score: number) {
        if (score < ScoreBoard.highScore) {
            return;
        }

        ScoreBoard.highScore = score;
        window.localStorage.setItem('highscore', ScoreBoard.highScore.toString());

        if (ScoreBoard.onNewHighscore) {
            ScoreBoard.onNewHighscore(ScoreBoard.highScore);
        }
    }

    public static onNewHighscore: ((score: number) => void) | null;
}

export class ScoreResult {
    private text: PIXI.Text;
    private currentScore: number;
    private scene: PIXI.Container;
    private canvas: HTMLCanvasElement;

    constructor(scene: PIXI.Container, canvas: HTMLCanvasElement, score: number) {
        this.currentScore = score;
        this.scene = scene;
        this.canvas = canvas;

        ScoreBoard.updateHighscore(this.currentScore);

        // prettier-ignore
        const style = new PIXI.TextStyle({
            fill: '#0080ff',
            fontFamily: '\"Comic Sans MS\", cursive, sans-serif',
            fontSize: 72,
        });

        this.text = new PIXI.Text(`Score: ${this.currentScore.toFixed(0)} meters!`, style);
        this.text.x = this.canvas.width / 2;
        this.text.y = this.canvas.height / 2;
        this.text.anchor.x = 0.5;
        this.text.anchor.y = 0.5;
        this.scene.parent.addChild(this.text);
    }

    update(delta: number) {}

    hide() {
        this.text.visible = false;
    }
}
