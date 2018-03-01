const Card = require('../server/card.js').factory;
const assert = require('chai').assert;
const sharedConstant = require('../shared/shared.js').constant;

const test = () => {

    assert.isTrue(new Card(sharedConstant.CARD_SEED.CUPS, 1).beat(sharedConstant.CARD_SEED.SWORDS, new Card(sharedConstant.CARD_SEED.COINS, 1)));
    assert.isTrue(new Card(sharedConstant.CARD_SEED.SWORDS, 3).beat(sharedConstant.CARD_SEED.CUPS, new Card(sharedConstant.CARD_SEED.COINS, 1)));
    assert.isTrue(new Card(sharedConstant.CARD_SEED.SWORDS, 10).beat(sharedConstant.CARD_SEED.CUPS, new Card(sharedConstant.CARD_SEED.COINS, 1)));
    assert.isTrue(new Card(sharedConstant.CARD_SEED.SWORDS, 1).beat(sharedConstant.CARD_SEED.CUPS, new Card(sharedConstant.CARD_SEED.SWORDS, 3)));
    assert.isTrue(new Card(sharedConstant.CARD_SEED.SWORDS, 1).beat(sharedConstant.CARD_SEED.SWORDS, new Card(sharedConstant.CARD_SEED.SWORDS, 3)));

};

module.exports = {
    test
};


