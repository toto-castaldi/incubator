const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.post('/give-me-cards', (req, res) => {
    const player = req.player;

    console.log('/give-me-cards', player);

    match.giveCards(player);

    res.json({match: matchState(match), cards : player.cards});

});

module.exports = router;
