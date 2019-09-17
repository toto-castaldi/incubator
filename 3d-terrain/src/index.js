import * as p5 from 'p5';
import * as sound from 'p5/lib/addons/p5.dom';
import './style.css';
import '../node_modules/github-fork-ribbon-css/gh-fork-ribbon.css';
import { saveAs } from 'file-saver';


new p5((s) => {


    let fpsParagraph;
    let resolutionX = 40;
    let resolutionY = 40;
    let flying = 0;
    let save = false;

    let terrain = [];

    s.keyPressed = () => {
        if (s.keyCode === 73) { //I
            save = true;
        }
    }

    s.setup = () => {
        let canvas = s.createCanvas(window.innerWidth - 8, window.innerHeight - 50, s.WEBGL);
        canvas.parent('sketch-holder');

        //init terrain z
        for (let y = 0; y < resolutionY; y++) {
            let row = [];
            for (let x = 0; x < resolutionX; x++) {
                row.push(0);
            }
            terrain.push(row);
        }

        fpsParagraph = s.createP('FPS');
    };

    s.draw = () => {
        flying -= 0.1;
        let yoff = flying;
        for (let y = 0; y < resolutionY; y++) {
            let xoff = 0;
            for (let x = 0; x < resolutionX; x++) {
                terrain[x][y] = s.map(s.noise(xoff, yoff), 0, 1, -100, 100);
                xoff += 0.2;
            }
            yoff += 0.2;
        }


        //reset
        s.background(255);

        s.translate(-s.width / 2 + s.width / 45, -s.height / 2 + s.height / 5.5);
        s.rotateX(0.30 * s.PI);
        s.fill(255);
        s.stroke(0);

        let vWidth = s.width - 10;
        let vHeight = s.height - 10;

        for (let y = 0; y < resolutionY; y++) {
            s.beginShape(s.TRIANGLE_STRIP);
            for (let x = 0; x < resolutionX; x++) {
                let px0 = x * vWidth / resolutionX + 5;
                let py0 = y * vHeight / resolutionY;
                let px1 = (x + 1) * vWidth / resolutionX + 5;
                let py1 = (y + 1) * vHeight / resolutionY;
                s.vertex(px0, py0, terrain[x][y]);
                s.vertex(px0, py1, terrain[x][y + 1]);
            }
            s.endShape();
        }


        fpsParagraph.html('FPS ' + s.frameRate().toFixed(2));

        if (save) {
            save = false;
            let canvas = document.getElementsByTagName('canvas')[0];
            canvas.toBlob(function(blob) {
                saveAs(blob, "sketch.png");
            });
        }
        

    };
});

