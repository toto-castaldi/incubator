const sharedConstant    = require('../shared/shared.js').constant;
const Card              = require('./card.js').factory;

class Match {
    constructor() {
        this.players = [];
        this.cards = [];
        this.callerPlayerIndex = -1;
        this.callNumber = undefined;
        this.calledSeed = undefined;
        this.playingPlayerIndex = -1;
        this.outOfCall = [];

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
        //console.log('isPlayerCalling', player.uid, this.players[this.callerPlayerIndex].uid);
        return player.uid === this.players[this.callerPlayerIndex].uid;
      }
    }

    isPlayerCallingSeed(player) {
        if (this.isCallingSeed()) {
            return player.uid === this.players[this.callerPlayerIndex].uid;
        }
    }

    calling() {
        return this.callerPlayerIndex !== -1 && this.playingPlayerIndex === -1;
    }

    validCall(callingNumber) {
        if (!this.callNumber) return true;
      if (this.callNumber === 1 && callingNumber > 1) return true;
      if (this.callNumber === 3 && callingNumber !== 1) return true;
      return callingNumber < this.callNumber;
    }

    rotateCall() {
        if (this.outOfCall.length === 5) {
          this.playingPlayerIndex = this.players.length -1;
          console.log('let\'s choose seed !', this.players[this.callerPlayerIndex].uid, this.callNumber);
        } else {
            const inc = () => {
                //console.log('next caller');
                this.callerPlayerIndex++;
                if (this.callerPlayerIndex === this.players.length) {
                    this.callerPlayerIndex = 0;
                }
            };
            if (this.outOfCall.length === 0) {
                inc();
            } else {
                while (this.outOfCall.find(p => p.uid === this.players[this.callerPlayerIndex].uid)) {
                    inc();
                }
            }
        }
    }

    call(player, callNumber) {

      if (this.isPlayerCalling(player) && this.validCall(callNumber)) {
          console.log('validCall', callNumber, this.callNumber, this.validCall(callNumber), player.uid);
        this.callNumber = callNumber;
        this.rotateCall();
        console.log(this.callNumber, this.players[this.callerPlayerIndex].uid);
        return true;
      }
    }

    skip(player) {
        if (this.isPlayerCalling(player)) {
            this.outOfCall.push(player);
            this.rotateCall();
        }
    }

    lastCall() {
      return this.callNumber;
    }

    isCallingSeed() {
        return this.callerPlayerIndex !== -1 && this.playingPlayerIndex !== -1 && this.calledSeed === undefined;
    }

    seed(seed) {
        if (this.isCallingSeed()) {
            this.calledSeed = seed;
            console.log('let\'s play !', this.players[this.playingPlayerIndex].uid, this.calledSeed, this.callNumber);
        } else {
            console.log('no calling seed now');
        }
    }
}

module.exports = {
    factory : Match,
    instance : new Match()
};
