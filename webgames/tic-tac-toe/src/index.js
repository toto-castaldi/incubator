import * as p5 from 'p5';

const sketch = (s) => {

    const matchHeight = 600;
    const matchWidth = 600;
    const infoBorder = 20;
    const lineDepth = 1;
    let match;
    let textSizeValue;
    let player;
    let matchState; //PLAYING, END_MATCH
    const lastWon = [];

    let reset = () => {
        match = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9']
        ];
        player = 'O';
        matchState = 'PLAYING';
    }

    let matchWon = () => {
        //row
        for (let i = 0; i < 3; i++) {
            const row = match[i];
            if (row[0] === row[1] && row[1] === row[2]) return row[2];
        }
        //column
        for (let i = 0; i < 3; i++) {
            if (match[0][i] === match[1][i] && match[1][i] === match[2][i]) return match[2][i];
        }
        //diags
        if (match[0][0] === match[1][1] && match[1][1] === match[2][2]) return match[1][1];
        if (match[0][2] === match[1][1] && match[1][1] === match[2][0]) return match[1][1];

        return undefined;
    }

    let onGrid = (callback) => {
        for (let rowIndex = 0; rowIndex < match[0].length; rowIndex++) {
            const row = match[rowIndex];
            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                const element = row[columnIndex];
                callback(element, rowIndex, columnIndex);
            }
        }
    }

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
        let canvas = s.createCanvas(matchWidth + infoBorder, matchHeight + infoBorder);
        canvas.parent('sketch-holder');
        textSizeValue = s.min([matchWidth / 3, matchHeight / 3]);
        reset();
    };

    s.draw = () => {
        //reset
        s.background(51);

        if (matchState === 'PLAYING') {
            let mw = matchWon();
            if (mw) {
                matchState = 'END_GAME';
                lastWon.unshift(mw);
                if (lastWon.length > 60) lastWon.splice(60, lastWon.length - 60);
            }

            //playing info
            s.fill(255);
            s.textSize(10);
            s.text(`PLAYING: ${player}`, matchWidth - 200, s.height - 8);



            //play
            if (s.keyCode >= 1 + 48 && s.keyCode <= 9 + 48) {
                const move = s.keyCode - 48;
                onGrid((element, rowIndex, columnIndex) => {
                    if (element == move) {
                        match[rowIndex][columnIndex] = player;
                        //change turn
                        if (player === 'O') {
                            player = 'X';
                        } else {
                            player = 'O';
                        }
                    }
                });
            }
        }

        if (matchState == 'END_GAME') {
            s.fill(255);
            s.textSize(10);
            const mw = matchWon();
            s.text(`WINNER IS : ${mw}. Press R to restart`, matchWidth - 200, s.height - 8);

            if (s.keyCode === 82) {
                reset();
            }
        }

        //winning infos
        s.fill(255);
        s.textSize(10);
        lastWon.forEach((lw, index) => {
            s.text(`${lw}`, matchWidth + 10, index * 10 + 10);
        });

        //fill grid
        onGrid((element, rowIndex, columnIndex) => {
            s.textSize(textSizeValue);
            let textX = columnIndex * matchWidth / 3 + textSizeValue / 4;
            let textY = (rowIndex + 1) * matchHeight / 3 - textSizeValue / 5;
            //graphical details
            if (element == 'O') {
                textX -= 25;
                textY += 4;
            }
            if (element == 'X') {
                textX -= 15;
                textY += 4;
            }
            s.text(element, textX, textY);
        });

        //grid
        s.fill(s.color('white'));
        s.noStroke();
        s.rect(matchWidth / 3, 0, lineDepth, matchHeight);
        s.rect(matchWidth / 3 * 2, 0, lineDepth, matchHeight);
        s.rect(0, matchHeight / 3, matchWidth, lineDepth);
        s.rect(0, matchHeight / 3 * 2, matchWidth, lineDepth);
        //borders
        s.rect(0, matchHeight, matchWidth, lineDepth);
        s.rect(matchWidth, 0, lineDepth, matchHeight);

        printFrameRate({ isVisible: () => true, deltaPosY: () => 7 });
    };
}

let canvas = new p5(sketch);


