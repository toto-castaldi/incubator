const sharedConstant    = require('../../shared/shared.js').constant;

const matchState = (match) => {
    if (match.isWaiting()) return sharedConstant.MATCH.WAITING;
    if (match.isGivingCards()) return sharedConstant.MATCH.GIVING_CARDS;
    if (match.calling()) {
        //console.log('IS CALLING !');
        return sharedConstant.MATCH.CALLING;
    }
    if (match.isCallingSeed()) return sharedConstant.MATCH.CALLING_SEED;
    if (match.isPlaying()) return sharedConstant.MATCH.PLAYING;
    if (match.isMatchEnd()) return sharedConstant.MATCH.END;


    return sharedConstant.MATCH.UNKNOW;
};

module.exports = {
    matchState
};

