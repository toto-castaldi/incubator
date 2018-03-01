const router            = require('express').Router();
const match             = require('../match.js').instance;
const sharedConstant    = require('../../shared/shared.js').constant;
const matchState        = require('./api-router.js').matchState;

router.post('/join-match', (req, res) => {
    const player = req.player;

    console.log('/join-match', player);

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

module.exports = router;
