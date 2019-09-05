import * as p5 from 'p5';
import { ConnectFour } from './connectFour';
import './style.css';
import img from './Connect4Board.png';

new p5((sketch) => {

    let backgroundImage;
    const infoPlayingHeight = 20;
    const STATE_PLAYING = 'PLAYING';
    const STATE_DISC_FALLING = 'DISC_FALLING';
    const STATE_MATCH_WON = 'MATCH_WON';
    let matchState = STATE_PLAYING;
    const PLAYER_RED = 'PLAYER_RED';
    const PLAYER_BLUE = 'PLAYER_BLUE';
    let player = PLAYER_RED;
    let connectFour = new ConnectFour();
    let columnChoosen;
    let fallingStep;
    let lastRowFreeFallingDisc;
    const COLUMN_WIDTH = 90; //it is possible to computate it from image ?


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
        backgroundImage = sketch.loadImage(img);
    }

    sketch.setup = () => {
        let canvas = sketch.createCanvas(backgroundImage.width, backgroundImage.height + infoPlayingHeight);
        canvas.parent('sketch-holder');
    };

    sketch.mousePressed = () => {
        let columnClicked = () => {
            for (let c = 0; c < 7; c++) {
                const widthColumn = widthColumnCenter(c);
                if (sketch.mouseX > widthColumn - 40 && sketch.mouseX < widthColumn + 40) {
                    return c;
                }
            }
        }
        if (matchState === STATE_PLAYING) {
            const cc = columnClicked();
            if (cc) {
                columnChoosen = cc;
            }
        } else if (matchState === STATE_DISC_FALLING) {
            const cc = columnClicked();
            if (columnChoosen === cc) {
                fallingStep = 10000;
            }
        }
    }

    sketch.keyPressed = () => {
        let numberKK = () => {
            if (sketch.keyCode >= 1 + 48 && sketch.keyCode <= 7 + 48) {
                return sketch.keyCode - 48 - 1;
            }
        }
        if (matchState === STATE_PLAYING) {
            const nkk = numberKK();
            if (nkk !== undefined && columnChoosen !== nkk) columnChoosen = nkk;
        } else if (matchState === STATE_DISC_FALLING) {
            const nkk = numberKK();
            if (nkk !== undefined && columnChoosen === nkk) fallingStep = 10000;

        } else if (matchState === STATE_MATCH_WON) {
            if (sketch.keyCode === 82) {
                changePlayer();
                connectFour = new ConnectFour();
                matchState = STATE_PLAYING;
            }
        }
    }

    let rowToHeight = (r) => r * 80 + 40;

    let printGrid = () => {
        connectFour.onGrid((r, c, cell) => {
            if (cell !== '') printDisc(c, rowToHeight(r), cell);
        })

        sketch.image(backgroundImage, 0, 0);
    }

    let printDisc = (c, y, player) => {
        if (player === PLAYER_BLUE) sketch.fill(0, 0, 255);
        if (player === PLAYER_RED) sketch.fill(255, 0, 0);
        sketch.noStroke();
        sketch.circle(widthColumnCenter(c), y, 65);
    }

    let widthColumnCenter = (columnIndex) => columnIndex * COLUMN_WIDTH + 50;

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
                if (connectFour.isColumnAvailable(columnChoosen)) {

                    matchState = STATE_DISC_FALLING;
                    fallingStep = 0;
                    lastRowFreeFallingDisc = connectFour.lastRowFree(columnChoosen);
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
                const mw = connectFour.play(columnChoosen, player);


                //console.log(connectFour.grid, lastRowFreeFallingDisc, columnChoosen, player, mw);
                if (mw) {
                    matchState = STATE_MATCH_WON;
                } else {
                    changePlayer();

                    matchState = STATE_PLAYING;
                }

                columnChoosen = undefined;
                fallingStep = undefined;
            }

        } else if (matchState === STATE_MATCH_WON) {
            printWonInfo();
        }

        printGrid();

        printFrameRate({});
    };
});

