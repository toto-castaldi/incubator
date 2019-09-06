import * as p5 from 'p5';
import './style.css';

new p5((sketch) => {

    let printFrameRate = ({ isVisible, posX, deltaPosY, fill }) => {
        const doPrintFrameRate = isVisible ? isVisible() : true;
        const x = posX ? posX() : 10;
        const deltaY = deltaPosY ? deltaPosY() : 10;
        const fillValue = fill ? fill() : 0;
        if (doPrintFrameRate) {
            let fps = sketch.frameRate();
            sketch.fill(fillValue);
            sketch.textSize(10);
            sketch.noStroke();
            sketch.text("FPS: " + fps.toFixed(2), x, sketch.height - deltaY);
        }
    }

    sketch.setup = () => {
        let canvas = sketch.createCanvas(100, 100);
        canvas.parent('sketch-holder');
    };

    sketch.draw = () => {
        //reset
        sketch.background(255);

        printFrameRate({});
    };
});

