const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.post('/playing', (req, res) => {
    const player = req.player;

    //console.log('/playing', player.uid);

    const isPlayerPlaying = match.isPlayerPlaying(player);

    if (isPlayerPlaying !== undefined) {
      res.json({uid : player.uid, userState: {match: matchState(match), you : isPlayerPlaying}});
    } else {
      res.json({uid : player.uid, userState: {match: matchState(match)}});
    }

});

module.exports = router;
