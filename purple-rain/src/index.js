import * as p5 from 'p5';
import * as sound from 'p5/lib/addons/p5.sound';
import './style.css';
import { Drop } from './drop.js';
import rainWave from './401276__inspectorj__rain-moderate-b.wav';

new p5((sketch) => {

    const drops = [];

    let rainSound;

    sketch.preload = () => {
        rainSound = sketch.loadSound(rainWave);
    }

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
        let canvas = sketch.createCanvas(window.innerWidth - 8, window.innerHeight - 8);
        canvas.parent('sketch-holder');

        for (let i = 0; i < 1000; i++) {
            drops.push(new Drop(sketch));
        }

        rainSound.loop();
    };

    sketch.draw = () => {
        if (!rainSound.isPlaying()) {
            rainSound.play();
        }

        //reset
        sketch.background(sketch.color(230, 230, 250));

        //show
        drops.forEach((drop) => {
            drop.fall();
            drop.show();
        });

        printFrameRate({});
    };
});

