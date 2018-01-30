const sharedObj = (() => {
    return {
        constant : {
            MATCH : {
                UNKNOW : 'UNKNOW',
                WAITING : 'WAITING',
                CANT_JOIN : 'CANT-JOIN',
                GIVING_CARDS : 'GIVING-CARDS',
                CALLING : 'CALLING',
                PLAYING : 'PLAYING',
                CALLING_SEED : 'CALLING-SEED',
                END : 'END'
            },
            CARD_SEED : {
                CUPS : 'CUPS',
                COINS : 'COINS',
                CLUBS : 'CLUBS',
                SWORDS : 'SWORDS'
            }
        },
        equalities : {
            player : (p1, p2) => {
                return p1.uid === p2.uid;
            },
            card : (c1, c2) => {
                return c1.seed === c2.seed && c1.number === c2.number;
            }
        }
    }
})();

try {
    module.exports = sharedObj;
} catch (ReferenceError) {
    window.sharedObj = sharedObj;
}
