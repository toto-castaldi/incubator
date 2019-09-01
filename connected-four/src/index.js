import * as p5 from 'p5';

const sketch = (s) => {

    let backgroundImage;
    const infoPlayingHeight = 20;
    const STATE_PLAYING = 'PLAYING';
    const STATE_DISC_FALLING = 'DISC_FALLING';
    let matchState = STATE_PLAYING;
    const PLAYER_RED = 'PLAYER_RED';
    const PLAYER_BLUE = 'PLAYER_BLUE';
    let player = PLAYER_RED;
    const grid = [
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '']
    ];
    let columnChoosen;
    let fallingStep;


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
        let canvas = s.createCanvas(backgroundImage.width, backgroundImage.height + infoPlayingHeight);
        canvas.parent('sketch-holder');
    };

    s.keyPressed = () => {
        if (s.keyCode >= 1 + 48 && s.keyCode <= 7 + 48) {
            let numberKK = s.keyCode - 48 - 1;
            if (columnChoosen !== numberKK) {
                columnChoosen = numberKK;
            }
        }
    }

    let isColumnAvailable = (columnChoosen) => grid[0][columnChoosen] === ''

    s.draw = () => {
        //reset
        s.background(255);
        

        if (matchState === STATE_PLAYING) {
            //info
            s.fill(0);
            s.textSize(10);
            s.noStroke();
            s.text('PLAYER ' + (player === PLAYER_BLUE ? 'RED' : 'BLUE'), s.width - 100, s.height - 10);

            if (columnChoosen !== undefined) {
                if (isColumnAvailable(columnChoosen)) {
                    console.log(columnChoosen);

                    matchState = STATE_DISC_FALLING;
                    fallingStep = 0;
                }
            }

            s.image(backgroundImage, 0, 0);
        } else if (matchState === STATE_DISC_FALLING) {
            //move to fallingStep
            if (player === PLAYER_BLUE) s.fill(0,0,255);
            if (player === PLAYER_RED) s.fill(255,0,0);
            s.noStroke();
            s.circle(columnChoosen * 90 + 50, fallingStep, 65); //40
            fallingStep += 3;

            s.image(backgroundImage, 0, 0);
        }

        printFrameRate({});
    };
}

let canvas = new p5(sketch);


