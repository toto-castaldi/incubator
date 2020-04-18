function Bird() {
    this.x = 20;
    this.y = height / 2;
    this.radius = 10;
    this.velocity = 0.4;
    this.gravity = 0.1;
    this.upForce = 2;

    this.update = () => {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (this.y > height) {
            this.y = height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
        }
    }

    this.up = () => {
        if (this.y > 0) {
            this.velocity -= this.upForce;
        }
    }

    this.show = () => {
        fill(255);
        ellipse(this.x, this.y, this.radius);
    }


}