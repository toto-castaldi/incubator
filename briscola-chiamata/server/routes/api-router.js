const router            = require('express').Router();
const match             = require('../match.js');
const sharedConstant    = require('../../shared/shared.js').constant;

const matchState = (match) => {
  if (match.isPlaying()) return sharedConstant.MATCH.PLAYING;
  if (match.isNotFull()) return sharedConstant.MATCH.WAITING;
};

router.post('/join-match', (req, res) => {

    if (req.session.joinId) {
        res.json({ joined : true, alreadyJoined: true, joinId : req.session.joinId, userState : { match : matchState(match)} });
    } else {
        if (match.isNotFull()) {
            const joinId = match.join();
            req.session.joinId = joinId;
            res.json({ joined : true, alreadyJoined: false, joinId, userState : { match : matchState(match)} });
        } else {
            res.json({ joined : false, userState : { match : sharedConstant.MATCH.CANT_JOIN} });
        }
    }
});

module.exports = router;