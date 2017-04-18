function Ball() {
  this.x = width / 2;
  this.y = height / 2;
  this.r = 20;
  this.velocity = p5.Vector.random2D();
  this.velocity.setMag(2);
  this.position = createVector(this.x, this.y);

  this.update = () => {
    //console.log(this.position, this.v);
    this.position.add(this.velocity);
    if (this.position.x < 0 || this.position.x > width) {
      this.velocity.x *= -1;
    }
    if (this.position.y > height ||  this.position.y < 0) {
      this.velocity.y *= -1;
    }
  }

  this.show = () => {
    ellipse(this.position.x,this.position.y,this.r,this.r);
  }
}


var ball;

var setup = () => {
  createCanvas(720, 400);
  ball = new Ball();
}

var draw = () => {
  background(0);
  ball.update();
  ball.show();
}
