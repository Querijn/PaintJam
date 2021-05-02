export default class Vec2 {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }
}
