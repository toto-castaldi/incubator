const sharedObj = (() => {
    return {
        constant : {
            MATCH : {
                UNKNOW : 'UNKNOW',
                WAITING : 'WAITING',
                CANT_JOIN : 'CANT-JOIN',
                GIVING_CARDS : 'GIVING-CARDS'
            },
            CARD_SEED : {
                CUPS : 'CUPS',
                COINS : 'COINS',
                CLUBS : 'CLUBS',
                SWORDS : 'SWORDS'
            }
        }
    }
})();

try {
    module.exports = sharedObj;
} catch (ReferenceError) {
    window.sharedObj = sharedObj;
}