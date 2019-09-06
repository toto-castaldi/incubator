class Drop {
    constructor(sketch) {
        this.sketch = sketch;
        this.x = this.sketch.random(this.sketch.width);
        this.z = this.sketch.random(1, 20);
        this.y = this.sketch.random(-100, this.sketch.height);
    }

    show () {
        let tick = this.sketch.map(this.z, 1, 20, 1, 2);
        let len = this.sketch.map(this.z, 1, 20, 10, 30);
        this.sketch.stroke(138, 43, 26);
        this.sketch.strokeWeight(tick);
        this.sketch.line(this.x, this.y, this.x, this.y + len);
    }

    fall () {
        let gravity = this.sketch.map(this.z, 1, 20, 10, 45);
        this.y += gravity;
        if (this.y > this.sketch.height) {
            this.y = this.sketch.random(-500, -100);
        }
    }

}

export {Drop};