const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.post('/calling', (req, res) => {
    const player = req.player;

    //console.log('/calling', player.uid);

    const isPlayerCalling = match.isPlayerCalling(player);

    if (isPlayerCalling !== undefined) {
      const lastCall = match.lastCall();

      res.json({uid : player.uid, userState: {match: matchState(match), you : isPlayerCalling, lastCall}});
    } else {
      res.json({uid : player.uid, userState: {match: matchState(match)}});
    }

});

module.exports = router;
