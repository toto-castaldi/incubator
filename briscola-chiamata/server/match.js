const sharedConstant    = require('../shared/shared.js').constant;
const Card              = require('./card.js').factory;

class Match {
    constructor() {
        this.players = [];
        this.cards = [];

        for (let seed of Object.keys(sharedConstant.CARD_SEED)) {
            Array.from(Array(10)).forEach((x, i) => {
                this.cards.push(new Card(seed, i + 1));
            });
        }

        console.log(this.cards);

    }

    giveCards(player) {

        while (player.needCard()) {
            if (this.cards.length === 0) throw new Error('no card available for player !');
            const cardIndex = Math.floor(Math.random() * this.cards.length);
            const card = this.cards.splice(cardIndex, 1)[0];
            player.takeCard(card);
        }

    }

    isFull() {
        return this.players.length === 5;
    }

    allPlayersHaveCards() {
        return this.isFull() && this.players.reduce((allPlayersHaveCards, player) => {return allPlayersHaveCards && (player.cards.length > 0)}, true);
    }

    join(player) {
        if (!this.isFull()) {
            this.players.push(player);
        }
    }

    hasPlayer(player) {
        return this.players.find(p => p.uid === player.uid);
    }
}

module.exports = {
    factory : Match,
    instance : new Match()
};