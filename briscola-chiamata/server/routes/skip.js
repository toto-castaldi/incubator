const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.post('/skip', (req, res) => {
    const player = req.player;

    console.log('/skip', player.uid);

    const isPlayerCalling = match.isPlayerCalling(player);

    if (isPlayerCalling) {
        match.skip(player);
    }

    res.json({uid : player.uid, userState: {match: matchState(match), you : match.isPlayerCallingSeed(player)}});

});


module.exports = router;
