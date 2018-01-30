const sharedConstant    = require('../shared/shared.js').constant;
const Card              = require('./card.js').factory;

const playerEquality = (p1, p2) => {
    return p1.uid === p2.uid;
};

class Match {
    constructor() {
        this.players = [];
        this.cards = [];
        this.callerPlayerIndex = -1;
        this.callNumber = undefined;
        this.calledSeed = undefined;
        this.playingPlayerIndex = -1;
        this.outOfCall = [];
        this.hand = [];
        this.winningPlayerIndex = -1;

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

    isWaiting() {
        return this.players.length < 5;
    }

    isGivingCards() {
        return this.isFull() && !this.isMatchEnd() && !this.isPlaying() && !this.allPlayersHaveCards();
    }

    allPlayersHaveCards() {
        return this.players.reduce((allPlayersHaveCards, player) => {return allPlayersHaveCards && player.withAllCards()}, true)
    }

    join(player) {
        if (!this.isFull()) {
            this.players.push(player);
        }
    }

    hasPlayer(player) {
        return this.players.find(p => playerEquality(p, player));
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
          console.log(`validCall ${callNumber} vs ${this.callNumber} by ${player.uid}`);
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

    isPlaying() {
        //console.log('is playing', this.callerPlayerIndex, this.playingPlayerIndex , this.calledSeed , this.winningPlayerIndex );
        return this.callerPlayerIndex !== -1 && this.playingPlayerIndex !== -1 && this.calledSeed !== undefined && this.winningPlayerIndex === -1;
    }

    isPlayerPlaying(player) {
        if (this.isPlaying()) {
            return player.uid === this.players[this.playingPlayerIndex].uid;
        }
    }

    distributeHand() {
        //TODO
        return this.players[0];
    }

    resetHand(player) {
        this.playingPlayerIndex = this.players.indexOf(this.players.find(p => playerEquality(p, player)));
        this.hand = [];
    }

    nextPlayingPlayer() {
        this.playingPlayerIndex++;
        if (this.playingPlayerIndex === this.players.length) {
            this.playingPlayerIndex = 0;
        }
    }

    matchEnd() {
        //TODO
        this.winningPlayerIndex = 0;
    }

    isMatchEnd() {
        return this.winningPlayerIndex !== -1;
    }

    play(player, card) {
        if (this.isPlayerPlaying(player)) {
            const matchPlayer = this.players[this.playingPlayerIndex];
            if (matchPlayer.hasCard(card)) {
                matchPlayer.removeCard(card);
                this.hand.push({
                    uid : player.uid,
                    card
                });
                this.players[this.playingPlayerIndex] = matchPlayer;

                //console.log('player after play', matchPlayer);

                if (this.hand.length === 5) {
                    console.log('hand finished');

                    const winningPlayer = this.distributeHand();
                    if (matchPlayer.hasCards()) {
                        console.log('reset hand');
                        this.resetHand(winningPlayer);
                    } else {
                        console.log('match end');
                        this.matchEnd();
                    }
                } else {
                    //console.log('next player');
                    this.nextPlayingPlayer();
                }

            } else {
                console.log('player does not have card', card, matchPlayer);
            }
            return matchPlayer;
        } else {
            console.log('player can\'t play');
        }
    }
}

module.exports = {
    factory : Match,
    instance : new Match()
};
