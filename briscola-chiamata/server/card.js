class Card {
    constructor(seed, number) {
        this.seed = seed;
        this.number = number;
    }

    beat(briscolaSeed, card) {
        if (this.seed === briscolaSeed && card.seed !== briscolaSeed) return true;
        if (this.seed !== briscolaSeed && card.seed === briscolaSeed) return false;
        if (this.seed === briscolaSeed && card.seed === briscolaSeed) return this.gt(this.number, card.number);
        if (this.seed !== briscolaSeed && card.seed !== briscolaSeed && this.seed !== card.seed) return true;
        if (this.seed !== briscolaSeed && card.seed !== briscolaSeed && this.seed === card.seed) return this.gt(this.number, card.number);
    }

    gt(n1, n2) {
        if (n1 === 1 && n2 !== 1) return true;
        if (n1 === 3 && n2 !== 1) return true;
        if (n1 === 3 && n2 === 1) return false;
        if (n2 === 1) return false;
        if (n2 === 3) return false;
        return n1 > n2;
    }

    static build (card) {
        return new Card(card.seed, card.number);
    }
}

module.exports = {
    factory : Card
};