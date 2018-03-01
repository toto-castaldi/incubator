const router            = require('express').Router();
const match             = require('../match.js').instance;
const sharedConstant    = require('../../shared/shared.js').constant;
const matchState        = require('./api-router.js').matchState;

router.post('/join-match', (req, res) => {
    const player = req.player;
    const uid = player.uid;

    console.log('/join-match', player);

    if (match.hasPlayer(player)) {
        res.json({uid, joined: true, alreadyJoined: true, match: matchState(match)});
    } else {
        if (match.isFull()) {
            res.json({uid, joined : false, match : sharedConstant.MATCH.CANT_JOIN});
        } else {
            match.join(player);
            res.json({uid, joined : true, alreadyJoined: false, match : matchState(match)});
        }
    }

});

module.exports = router;
