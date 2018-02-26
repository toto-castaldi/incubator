const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.post('/calling', (req, res) => {
    const player = req.player;

    const you = match.isPlayerCalling(player) || match.isPlayerCallingSeed(player);
    const opponentCalling = match.callerPlayer(player);
    const lastCall = match.lastCall();
    const mathState = matchState(match);

    console.log('/calling', player.uid, mathState, you, lastCall, opponentCalling);

    res.json({uid : player.uid, userState: {match: mathState, you , lastCall, opponentCalling }});

});

module.exports = router;
