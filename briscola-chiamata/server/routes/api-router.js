const router            = require('express').Router();
const match             = require('../match.js').instance;
const sharedConstant    = require('../../shared/shared.js').constant;

const matchState = (match) => {
    if (!match.isFull()) return sharedConstant.MATCH.WAITING;
    if (!match.allPlayersHaveCards()) return sharedConstant.MATCH.GIVING_CARDS;
    return sharedConstant.MATCH.UNKNOW;
};

router.post('/join-match', (req, res) => {
    const player = req.player;

    console.log('/join-match', 'player', player);

    if (match.hasPlayer(player)) {
        res.json({uid : player.uid, joined: true, alreadyJoined: true, userState: {match: matchState(match)}});
    } else {
        if (match.isFull()) {
            res.json({uid : player.uid, joined : false, userState : { match : sharedConstant.MATCH.CANT_JOIN} });
        } else {
            match.join(player);
            res.json({uid : player.uid, joined : true, alreadyJoined: false, userState : { match : matchState(match)} });
        }
    }

});

router.post('/give-me-cards', (req, res) => {
    const player = req.player;

    console.log('/give-me-cards', 'player', player);

    match.giveCards(player);

    res.json({uid : player.uid, userState: {match: matchState(match)}});

});

module.exports = router;