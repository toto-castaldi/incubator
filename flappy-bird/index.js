let bird;
const pipes = [];
let maxFrequency = 150;
let frequency = maxFrequency;

setup = () => {
    const canvas = createCanvas(400, 300);
    canvas.parent('sketch-holder');

    bird = new Bird();

}

draw = () => {
    if (frameCount % frequency == 0) {
        pipes.push(new Pipe({ birdHeight : bird.radius }));
        frequency --;
    }


    background(0);

    bird.update();
    bird.show();

    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.update({velocity : 2});
        pipe.show();
        if (pipe.isOutside()) {
            pipes.splice(i, 1);
        }
    }

    printFrameRate({ fillColor: () => 255 });
}

keyPressed = ({ keyCode }) => {
    if (keyCode === 32) {
        bird.up();
    }
}

mouseClicked = () => {
    bird.up();
}