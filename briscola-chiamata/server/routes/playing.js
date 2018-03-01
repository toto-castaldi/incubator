const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.post('/playing', (req, res) => {
    const player = req.player;

    //console.log('/playing', player.uid);

    const you = match.isPlayerPlaying(player);
    const playerPlaying = match.playerPlaying();
    const hand = match.hand;

    res.json({match: matchState(match), you, playerPlaying, hand});

});

module.exports = router;
