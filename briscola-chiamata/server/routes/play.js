const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.post('/play', (req, res) => {
    const player = req.player;
    const card = req.body.card;

    console.log('/play', player.uid, card);

    const playerAfterPlay = match.play(player, card);


    if (playerAfterPlay) {
        res.json({match: matchState(match), cards : playerAfterPlay.cards});
    } else {
        res.json({match: matchState(match)});
    }



});

module.exports = router;
