const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.post('/give-me-cards', (req, res) => {
    const player = req.player;

    console.log('/give-me-cards', player);

    match.giveCards(player);

    res.json({uid : player.uid, userState: {match: matchState(match), cards : player.cards}});

});

module.exports = router;
