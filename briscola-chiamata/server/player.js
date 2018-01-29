class Player {
    constructor(uid) {
        this.uid = uid;
        this.cards = [];
    }

    needCard() {
        return this.cards.length < 8;
    }

    takeCard(card) {
        this.cards.push(card);
    }

}

const players = [];

module.exports = {
    factory : uid => {
        const p = new Player(uid);
        players.push(p);
        return p;
    },
    get : uid => players.find(p => p.uid === uid)
};