const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;
const validSeed         = require('../../shared/shared.js').validSeed;

router.post('/seed', (req, res) => {
    const player = req.player;
    const seed = req.body.seed;

    console.log('/seed', player.uid, seed);

    if (match.isPlayerCallingSeed(player)) {
        if (validSeed(seed)) {
            match.seed(seed);
        } else {
            console.log(`wrong seed : ${seed}`);
        }
    } else {
        console.log('wrong caller');
    }

    res.json({uid : player.uid, userState : { match : matchState(match)} });

});

module.exports = router;
