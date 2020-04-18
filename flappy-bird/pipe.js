function Pipe({birdHeight}) {
    this.x = width;
    this.y = height / 2;
    this.depth = 10;
    this.gap = random(100) + birdHeight * 2;
    this.start = random(height - this.gap) + width / 10;

    this.update = ({velocity}) => {
        this.x -= velocity;
    }

    this.show = () => {
        fill(255);
        rect(this.x, 0, this.depth, this.start);
        rect(this.x, this.start + this.gap, this.depth, height);
    }

    this.isOutside = () => this.x < 0;

}