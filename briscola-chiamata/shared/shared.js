const sharedObj = (() => {
    return {
        constant : {
            MATCH : {
                WAITING : 'WAITING',
                CANT_JOIN : 'CANT-JOIN',
                PLAYING : 'PLAYING'
            }
        }
    }
})();

try {
    module.exports = sharedObj;
} catch (ReferenceError) {
    window.sharedObj = sharedObj;
}