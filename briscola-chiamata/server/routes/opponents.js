const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.get('/opponents', (req, res) => {
    const player = req.player;

    const opponents = match.opponentsOf(player);

    res.json({uid : player.uid, userState: {match: matchState(match), opponents}});

});

module.exports = router;
