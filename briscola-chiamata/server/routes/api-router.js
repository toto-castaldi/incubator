const router            = require('express').Router();
const match             = require('../match.js').instance;
const sharedConstant    = require('../../shared/shared.js').constant;

const matchState = (match) => {
    if (!match.isFull()) return sharedConstant.MATCH.WAITING;
    if (!match.allPlayersHaveCards()) return sharedConstant.MATCH.GIVING_CARDS;
    if (match.calling()) return sharedConstant.MATCH.CALLING
    return sharedConstant.MATCH.UNKNOW;
};

router.post('/join-match', (req, res) => {
    const player = req.player;

    console.log('/join-match', player);

    if (match.hasPlayer(player)) {
        res.json({uid : player.uid, joined: true, alreadyJoined: true, userState: {match: matchState(match)}});
    } else {
        if (match.isFull()) {
            res.json({uid : player.uid, joined : false, userState : { match : sharedConstant.MATCH.CANT_JOIN} });
        } else {
            match.join(player);
            res.json({uid : player.uid, joined : true, alreadyJoined: false, userState : { match : matchState(match)} });
        }
    }

});

router.post('/give-me-cards', (req, res) => {
    const player = req.player;

    console.log('/give-me-cards', player);

    match.giveCards(player);

    res.json({uid : player.uid, userState: {match: matchState(match), cards : player.cards}});

});

router.post('/calling', (req, res) => {
    const player = req.player;

    console.log('/calling', player);

    const isPlayerCalling = match.isPlayerCalling(player);

    if (isPlayerCalling !== undefined) {
      const lastCall = match.lastCall();

      res.json({uid : player.uid, userState: {match: matchState(match), youCall : isPlayerCalling, lastCall}});
    } else {
      res.json({uid : player.uid, userState: {match: matchState(match)}});
    }

});

router.post('/call', (req, res) => {
    const player = req.player;
    const callNumber = req.body.callNumber;

    console.log('/call', player, callNumber);

    const isPlayerCalling = match.isPlayerCalling(player);

    if (isPlayerCalling) {
      match.call(player, callNumber);
      const lastCall = match.lastCall();

      res.json({uid : player.uid, userState: {match: matchState(match), youCall : isPlayerCalling, lastCall}});
    } else {
      res.json({uid : player.uid, userState: {match: matchState(match)}});
    }

});


module.exports = router;
