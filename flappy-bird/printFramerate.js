const printFrameRate = ({ isVisible, posX, deltaPosY, fillColor }) => {
    const doPrintFrameRate = isVisible ? isVisible() : true;
    const x = posX ? posX() : 10;
    const deltaY = deltaPosY ? deltaPosY() : 10;
    const fillValue = fillColor ? fillColor() : 0;
    if (doPrintFrameRate) {
        let fps = frameRate();
        fill(fillValue);
        textSize(10);
        noStroke();
        text("FPS: " + fps.toFixed(2), x, height - deltaY);
    }
}