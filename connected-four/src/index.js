import * as p5 from 'p5';

const sketch = (s) => {

    let printFrameRate = ({ isVisible, posX, deltaPosY }) => {
        const doPrintFrameRate = isVisible ? isVisible() : true;
        const x = posX ? posX() : 10;
        const deltaY = deltaPosY ? deltaPosY() : 10;
        if (doPrintFrameRate) {
            let fps = s.frameRate();
            s.fill(255);
            s.textSize(10);
            s.text("FPS: " + fps.toFixed(2), x, s.height - deltaY);
        }
    }

    
    s.preload = () => {
        // preload code
    }

    s.setup = () => {
        let canvas = s.createCanvas(300, 300);
        canvas.parent('sketch-holder');
    };

    s.draw = () => {
        //reset
        s.background(51);

        s.circle(150,150,10);

        printFrameRate({});
    };
}

let canvas = new p5(sketch);


