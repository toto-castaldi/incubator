const Match = require('../server/match.js').factory;
const Card = require('../server/card.js').factory;
const playerFactory = require('../server/player.js').factory;
const sharedConstant = require('../shared/shared.js').constant;
const equalities = require('../shared/shared.js').equalities;
const assert = require('chai').assert;

const test = () => {

    const match = new Match();
    const p0 = playerFactory('toto');
    const p1 = playerFactory('samuele');
    const p2 = playerFactory('ivan');
    const p3 = playerFactory('ermanno');
    const p4 = playerFactory('marco');

    console.log(match);

    match.join(p0);
    match.join(p1);
    match.join(p2);
    match.join(p3);
    match.join(p4);

    match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CUPS, 3));
    match.giveCard(p0, new Card(sharedConstant.CARD_SEED.SWORDS, 2));
    match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CLUBS, 9));
    match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CUPS, 8));
    match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CLUBS, 7));
    match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CUPS, 6));
    match.giveCard(p0, new Card(sharedConstant.CARD_SEED.COINS, 2));
    match.giveCard(p0, new Card(sharedConstant.CARD_SEED.COINS, 1));

    match.giveCard(p1, new Card(sharedConstant.CARD_SEED.CUPS, 1));
    match.giveCard(p1, new Card(sharedConstant.CARD_SEED.SWORDS, 1));

    match.giveCard(p2, new Card(sharedConstant.CARD_SEED.SWORDS, 3));
    match.giveCard(p2, new Card(sharedConstant.CARD_SEED.COINS, 8));

    match.giveCard(p3, new Card(sharedConstant.CARD_SEED.SWORDS, 10));
    match.giveCard(p3, new Card(sharedConstant.CARD_SEED.CUPS, 2));
    match.giveCard(p3, new Card(sharedConstant.CARD_SEED.CUPS, 9));

    match.giveCard(p4, new Card(sharedConstant.CARD_SEED.SWORDS, 9));
    match.giveCard(p4, new Card(sharedConstant.CARD_SEED.COINS, 5));
    match.giveCard(p4, new Card(sharedConstant.CARD_SEED.CUPS, 7));

    match.giveCards(p0);
    match.giveCards(p1);
    match.giveCards(p2);
    match.giveCards(p3);
    match.giveCards(p4);



    let callerPlayer = match.callerPlayer();
    assert.isDefined(callerPlayer);
    assert.isOk(equalities.player(p0, callerPlayer));

    match.call(p0, 1);
    callerPlayer = match.callerPlayer();
    assert.isDefined(callerPlayer);
    assert.isOk(equalities.player(p1, callerPlayer));


};

module.exports = {
    test
};


