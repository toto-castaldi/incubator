const height = screen.height * 0.3;
const width = height; //screen.width * 0.6;
let maxRadious;

const elements = [];

function Element () {
  this.x = 0;
  this.radious = 0;
  this.reverseVelocity = 10;
  this.centerx = width / 2;
  this.centery;
  this.sibling = false;

  this.show = () => {
    ellipse(this.centerx, this.centery, this.radious);
  }


  this.update = () => {
    this.x += 1;
    this.radious += 1
    const r = (PI * this.x) * (1/this.reverseVelocity);

    const c = cos(r);
    let rv = c* (0.2 * this.radious / maxRadious); //default less than 0
    if (c > 0) {
      rv = c * 0.3 + (2 * this.radious / maxRadious);
    }
    this.radious += rv;

    this.centery = height / 2 + sin(r) * 5;

    if (this.radious > 20 && !this.sibling) {
      this.sibling = true;
      elements.unshift(new Element());
    }

    //console.log(this.radious, rv, maxRadious);
  }

}

setup = () => {
 createCanvas(width, height);
 colorMode(RGB);
 noFill();
 strokeWeight(3);
 stroke(256,256,256,256);
 maxRadious = dist(width / 2, height /2, width, height) * 2;
 elements.push(new Element());
}

draw = () => {
  background(0);

  for (i = elements.length; i > 0; i--) {
    const el = elements[i-1];
    el.update();
    el.show();
    if (el.radious > maxRadious) {
      elements.splice(i - 1 ,1);
    }
  }
}
