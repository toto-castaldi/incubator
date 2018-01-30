const Card = require('../server/card.js').factory;
const assert = require('chai').assert;
const sharedConstant = require('../shared/shared.js').constant;

const test = () => {

    assert.isFalse(new Card(sharedConstant.CARD_SEED.CUPS, 1).better(sharedConstant.CARD_SEED.SWORDS, new Card(sharedConstant.CARD_SEED.COINS, 1)));
    assert.isFalse(new Card(sharedConstant.CARD_SEED.SWORDS, 3).better(sharedConstant.CARD_SEED.CUPS, new Card(sharedConstant.CARD_SEED.COINS, 1)));
    assert.isFalse(new Card(sharedConstant.CARD_SEED.SWORDS, 10).better(sharedConstant.CARD_SEED.CUPS, new Card(sharedConstant.CARD_SEED.COINS, 1)));

};

module.exports = {
    test
};


