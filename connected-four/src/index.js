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
    let lastRowFreeFallingDisc;


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
        if (matchState === STATE_PLAYING) {
            if (s.keyCode >= 1 + 48 && s.keyCode <= 7 + 48) {
                let numberKK = s.keyCode - 48 - 1;
                if (columnChoosen !== numberKK) {
                    columnChoosen = numberKK;
                }
            }
        }
    }

    let lastRowFree = (columnChoosen) => {
        let row = 0;
        while (row < grid.length && grid[row][columnChoosen] === '') row++;
        return row - 1;
    }

    let isColumnAvailable = (columnChoosen) => grid[0][columnChoosen] === '';

    let rowToHeight = (r) => r * 80 + 40;

    let printGrid = () => {
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c] !== '') printDisc(c, rowToHeight(r), grid[r][c]);
            }
        }

        s.image(backgroundImage, 0, 0);
    }

    let printDisc = (c, y, player) => {
        if (player === PLAYER_BLUE) s.fill(0, 0, 255);
        if (player === PLAYER_RED) s.fill(255, 0, 0);
        s.noStroke();
        s.circle(c * 90 + 50, y, 65);

    }

    let printPlayerInfo = () => {
        s.fill(0);
        s.textSize(10);
        s.noStroke();
        s.text('PLAYER ' + (player === PLAYER_BLUE ? 'BLUE' : 'RED'), s.width - 100, s.height - 10);
    }

    s.draw = () => {
        //reset
        s.background(255);


        if (matchState === STATE_PLAYING) {
            //info
            printPlayerInfo();

            if (columnChoosen !== undefined) {
                if (isColumnAvailable(columnChoosen)) {


                    matchState = STATE_DISC_FALLING;
                    fallingStep = 0;
                    lastRowFreeFallingDisc = lastRowFree(columnChoosen);
                    console.log(columnChoosen, lastRowFreeFallingDisc);
                }
            }

            printGrid();
        } else if (matchState === STATE_DISC_FALLING) {

            printPlayerInfo();

            //move to fallingStep
            printDisc(columnChoosen, fallingStep, player);


            fallingStep += 5;

            if (fallingStep > rowToHeight(lastRowFreeFallingDisc)) {
                fallingStep = rowToHeight(lastRowFreeFallingDisc);

                //put disc on grid
                grid[lastRowFreeFallingDisc][columnChoosen] = player;

                //change player
                if (player === PLAYER_BLUE) {
                    player = PLAYER_RED;
                } else {
                    player = PLAYER_BLUE;
                }

                matchState = STATE_PLAYING;
                columnChoosen = undefined;
                fallingStep = undefined;
            }

            printGrid();
        }

        printFrameRate({});
    };
}

let canvas = new p5(sketch);


