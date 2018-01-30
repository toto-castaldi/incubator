const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.post('/call', (req, res) => {
    const player = req.player;
    const callNumber = req.body.callNumber;

    console.log('/call', player, callNumber);

    const isPlayerCalling = match.isPlayerCalling(player);

    if (isPlayerCalling) {
      match.call(player, callNumber);
      const lastCall = match.lastCall();

      res.json({uid : player.uid, userState: {match: matchState(match), lastCall}});
    } else {
      res.json({uid : player.uid, userState: {match: matchState(match)}});
    }

});

module.exports = router;
