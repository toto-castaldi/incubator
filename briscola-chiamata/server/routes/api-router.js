const sharedConstant    = require('../../shared/shared.js').constant;

const matchState = (match) => {
    if (!match.isFull()) return sharedConstant.MATCH.WAITING;
    if (!match.allPlayersHaveCards()) return sharedConstant.MATCH.GIVING_CARDS;
    if (match.calling()) return sharedConstant.MATCH.CALLING;
    if (match.isCallingSeed()) return sharedConstant.MATCH.CALLING_SEED;
    return sharedConstant.MATCH.UNKNOW;
};

module.exports = {
    matchState
};

