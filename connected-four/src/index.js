import * as p5 from 'p5';
import { matchWon } from './connectFour';

new p5((sketch) => {

    let startGrid = () => [
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '']
    ];

    let backgroundImage;
    const infoPlayingHeight = 20;
    const STATE_PLAYING = 'PLAYING';
    const STATE_DISC_FALLING = 'DISC_FALLING';
    const STATE_MATCH_WON = 'MATCH_WON';
    let matchState = STATE_PLAYING;
    const PLAYER_RED = 'PLAYER_RED';
    const PLAYER_BLUE = 'PLAYER_BLUE';
    let player = PLAYER_RED;
    let grid = startGrid();
    let columnChoosen;
    let fallingStep;
    let lastRowFreeFallingDisc;


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





    sketch.preload = () => {
        backgroundImage = sketch.loadImage('Connect4Board.png');
    }

    sketch.setup = () => {
        let canvas = sketch.createCanvas(backgroundImage.width, backgroundImage.height + infoPlayingHeight);
        canvas.parent('sketch-holder');
    };

    sketch.keyPressed = () => {
        if (matchState === STATE_PLAYING) {
            if (sketch.keyCode >= 1 + 48 && sketch.keyCode <= 7 + 48) {
                let numberKK = sketch.keyCode - 48 - 1;
                if (columnChoosen !== numberKK) {
                    columnChoosen = numberKK;
                }
            }
        } else if (matchState === STATE_MATCH_WON) {
            if (sketch.keyCode === 82) {
                changePlayer();
                grid = startGrid();
                matchState = STATE_PLAYING;
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

        sketch.image(backgroundImage, 0, 0);
    }

    let printDisc = (c, y, player) => {
        if (player === PLAYER_BLUE) sketch.fill(0, 0, 255);
        if (player === PLAYER_RED) sketch.fill(255, 0, 0);
        sketch.noStroke();
        sketch.circle(c * 90 + 50, y, 65);

    }

    let printPlayerInfo = () => {
        sketch.fill(0);
        sketch.textSize(10);
        sketch.noStroke();
        sketch.text('PLAYER ' + (player === PLAYER_BLUE ? 'BLUE' : 'RED'), sketch.width - 100, sketch.height - 10);
    }

    let printWonInfo = () => {
        sketch.fill(0);
        sketch.textSize(10);
        sketch.noStroke();
        sketch.text('PLAYER ' + (player === PLAYER_BLUE ? 'BLUE' : 'RED') + ' WINS. Press "R" to Restart', sketch.width - 200, sketch.height - 10);
    }

    let changePlayer = () => {
        //change player
        if (player === PLAYER_BLUE) {
            player = PLAYER_RED;
        } else {
            player = PLAYER_BLUE;
        }
    }

    sketch.draw = () => {
        //reset
        sketch.background(255);


        if (matchState === STATE_PLAYING) {
            //info
            printPlayerInfo();

            if (columnChoosen !== undefined) {
                if (isColumnAvailable(columnChoosen)) {


                    matchState = STATE_DISC_FALLING;
                    fallingStep = 0;
                    lastRowFreeFallingDisc = lastRowFree(columnChoosen);
                    //console.log(columnChoosen, lastRowFreeFallingDisc);
                }
            }

        } else if (matchState === STATE_DISC_FALLING) {

            printPlayerInfo();

            //move to fallingStep
            printDisc(columnChoosen, fallingStep, player);


            fallingStep += 5;

            if (fallingStep > rowToHeight(lastRowFreeFallingDisc)) {
                fallingStep = rowToHeight(lastRowFreeFallingDisc);

                //put disc on grid
                grid[lastRowFreeFallingDisc][columnChoosen] = player;


                columnChoosen = undefined;
                fallingStep = undefined;

                const mw = matchWon(grid);
                if (mw) {
                    matchState = STATE_MATCH_WON;
                } else {
                    changePlayer();

                    matchState = STATE_PLAYING;
                }
            }

        } else if (matchState === STATE_MATCH_WON) {
            printWonInfo();
        }

        printGrid();

        printFrameRate({});
    };
});

