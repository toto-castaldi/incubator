import * as p5 from 'p5';

const sketch = (s) => {

    let backgroundImage;

    let printFrameRate = ({ isVisible, posX, deltaPosY, fill }) => {
        const doPrintFrameRate = isVisible ? isVisible() : true;
        const x = posX ? posX() : 10;
        const deltaY = deltaPosY ? deltaPosY() : 10;
        const fillValue = fill ? fill() : 0;
        if (doPrintFrameRate) {
            let fps = s.frameRate();
            s.fill(fillValue);
            s.textSize(10);
            s.noStroke();
            s.text("FPS: " + fps.toFixed(2), x, s.height - deltaY);
        }
    }

    
    s.preload = () => {
        backgroundImage = s.loadImage('Connect4Board.png');
    }

    s.setup = () => {
        let canvas = s.createCanvas(backgroundImage.width, backgroundImage.height);
        canvas.parent('sketch-holder');
    };

    s.draw = () => {
        //reset
        s.background(255);
        s.background(backgroundImage);

        printFrameRate({});
    };
}

let canvas = new p5(sketch);


