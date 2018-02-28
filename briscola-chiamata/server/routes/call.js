const router            = require('express').Router();
const match             = require('../match.js').instance;
const matchState        = require('./api-router.js').matchState;

router.post('/call', (req, res) => {
    const player = req.player;
    const callNumber = req.body.callNumber;

    console.log('/call', player.uid, callNumber);

    const isPlayerCalling = match.isPlayerCalling(player);

    if (isPlayerCalling) {
      const callValid = match.call(player, callNumber);
      const lastCall = match.lastCall();

      res.json({uid : player.uid, userState: {match: matchState(match), lastCall, callValid}});
    } else {
      res.json({uid : player.uid, userState: {match: matchState(match)}});
    }

});

module.exports = router;
