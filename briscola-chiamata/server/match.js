const sharedConstant    = require('../shared/shared.js').constant;
const Card              = require('./card.js').factory;

class Match {
    constructor() {
        this.players = [];
        this.cards = [];
        this.callerPlayerIndex = -1;
        this.callNumber = undefined;

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

        if (this.cards.length === 0) {
          console.log('all cards to players');
          //this.callerPlayerIndex = Math.floor(Math.random() * this.players.length);
          this.callerPlayerIndex = this.players.length -1;
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

    isPlayerCalling(player) {
      if (this.calling()) {
        console.log('isPlayerCalling', player.uid, this.players[this.callerPlayerIndex].uid);
        return player.uid === this.players[this.callerPlayerIndex].uid;
      }
    }

    calling() {
        return this.callerPlayerIndex !== -1;
    }

    validCall(callingNumber) {
      if (this.callNumber === 1 && this.callingNumber > 1) return true;
      if (this.callNumber === 3 && this.callingNumber !== 1) return true;
      return this.callingNumber < this.callNumber;
    }

    call(player, callNumber) {
      if (this.isPlayerCalling(player) && this.validCall(callNumber)) {
        this.callNumber = callNumber;
      }
    }

    lastCall() {
      return this.callNumber;
    }
}

module.exports = {
    factory : Match,
    instance : new Match()
};
