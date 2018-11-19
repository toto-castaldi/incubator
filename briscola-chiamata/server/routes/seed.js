const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;
const validSeed         = require('../../shared/shared.js').validSeed;

router.post('/seed', (req, res) => {
    const player = req.player;
    const seed = req.body.seed;
    let seedCallResult = false;

    console.log('/seed', player.uid, seed);

    if (match.isPlayerCallingSeed(player)) {
        if (validSeed(seed)) {
            match.seed(seed);
            seedCallResult = true;
        } else {
            console.log(`wrong seed : ${seed}`);
        }
    } else {
        console.log('wrong caller');
    }

    res.json({match : matchState(match), seedCallResult});

});

module.exports = router;
