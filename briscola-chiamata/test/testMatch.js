const Match = require('../server/match.js').factory;
const Card = require('../server/card.js').factory;
const playerFactory = require('../server/player.js').factory;
const sharedConstant = require('../shared/shared.js').constant;
const assert = require('chai').assert;

const test = () => {

    const init = (assertionCallback)  => {

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
        match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CUPS, 10));
        match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CUPS, 9));
        match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CUPS, 8));
        match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CUPS, 7));
        match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CUPS, 6));
        match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CUPS, 5));
        match.giveCard(p0, new Card(sharedConstant.CARD_SEED.CUPS, 4));

        match.giveCard(p1, new Card(sharedConstant.CARD_SEED.CUPS, 1));

        match.giveCards(p0);
        match.giveCards(p1);
        match.giveCards(p2);
        match.giveCards(p3);
        match.giveCards(p4);


        match.call(p0, 1);
        match.skip(p1);
        match.skip(p2);
        match.skip(p3);
        match.skip(p4);

        match.seed(sharedConstant.CARD_SEED.CUPS);

        assertionCallback({
            match,
            p0,
            p1,
            p2,
            p3,
            p4
        });
    };

    init(({match, p0, p1, p2, p3, p4}) => {
        match.play(p0, new Card(sharedConstant.CARD_SEED.CUPS, 3));
        match.play(p1, p1.cards[1]);
        match.play(p2, p2.cards[0]);
        match.play(p3, p3.cards[0]);
        match.play(p4, p4.cards[0]);


        assert.lengthOf(match.winnedCards(p0), 5, 'first player wins with 3 of Briscola');
        assert.lengthOf(match.winnedCards(p1), 0, 'player can\'t beat the Briscola');
        assert.lengthOf(match.winnedCards(p2), 0, 'player can\'t beat the Briscola');
        assert.lengthOf(match.winnedCards(p3), 0, 'player can\'t beat the Briscola');
        assert.lengthOf(match.winnedCards(p4), 0, 'player can\'t beat the Briscola');
    });

};

module.exports = {
    test
};


