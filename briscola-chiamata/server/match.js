class Match {
    constructor() {
        //this.playersCount = 0;
        this.playersCount = 3; //fake
    }

    isNotFull() {
        return this.playersCount < 5;
    }

    isPlaying() {
        return this.playersCount === 5;
    }

    join() {
        if (this.isNotFull()) {
            this.playersCount ++;
            return this.playersCount;
        } else {
            return -1;
        }
    }
}

module.exports = new Match();