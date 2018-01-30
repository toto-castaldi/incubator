const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.post('/seed', (req, res) => {
    const player = req.player;
    const seed = req.body.seed;


    console.log('/seed', player.uid, seed);

    if (match.isPlayerCallingSeed(player)) {
        match.seed(seed);
    } else {
        console.log('wrong caller');
    }

    res.json({uid : player.uid, userState : { match : matchState(match)} });

});

module.exports = router;
