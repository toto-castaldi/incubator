const sharedEqualities    = require('../shared/shared.js').equalities;

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

    hasCard(card) {
        return this.cards.find((c) => sharedEqualities.card(c, card));
    }

    removeCard(card) {
        if (this.hasCard(card)) {
            this.cards.splice(this.cards.indexOf(this.cards.find((c) => sharedEqualities.card(c, card))), 1);
        }
    }

    hasCards() {
        return this.cards.length > 0;
    }

    withAllCards() {
        return this.cards.length === 8;
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