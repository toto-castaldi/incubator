const rp              = require('request-promise');
const sharedConstant  = require('../shared/shared.js').constant;

let uid ;
let cards;
const server = 'http://localhost:3000/api';
let callDelay = 15000;

const have = (number) => {
    return cards.find((c) => c.number === number);
};

const seed = () => {
    rp({
        method: 'POST',
        uri: `${server}/seed`,
        body: {
            uid,
            seed : sharedConstant.CARD_SEED.CUPS
        },
        json: true
    })
        .then(function (parsedBody) {
            console.log('seed', parsedBody);

            if (parsedBody.match === sharedConstant.MATCH.WAITING) {
                join();
                return;
            }

            playing();
        })
        .catch(function (err) {
            console.log(err);
        });
};

const play = () => {

    const card = cards[Math.floor(Math.random() * cards.length)];

    rp({
        method: 'POST',
        uri: `${server}/play`,
        body: {
            uid,
            card
        },
        json: true
    })
        .then(function (parsedBody) {
            console.log('play', parsedBody);

            if (parsedBody.match === sharedConstant.MATCH.WAITING) {
                join();
                return;
            }

            cards = parsedBody.cards;

            playing();
        })
        .catch(function (err) {
            console.log(err);
        });

};

const playing = () => {
    rp({
        method: 'POST',
        uri: `${server}/playing`,
        body: {
            uid
        },
        json: true
    })
        .then(function (parsedBody) {
            //console.log(parsedBody);

            if (parsedBody.match === sharedConstant.MATCH.WAITING) {
                join();
                return;
            }

            if (parsedBody.match === sharedConstant.MATCH.PLAYING && parsedBody.you) {
                play();
            } else {
                setTimeout(playing, 1000);
            }
        })
        .catch(function (err) {
            console.log(err);
        });

};

const skip = () => {
    rp({
        method: 'POST',
        uri: `${server}/skip`,
        body: {
            uid
        },
        json: true
    })
        .then(function (parsedBody) {
            console.log('skip', parsedBody);

            if (parsedBody.match === sharedConstant.MATCH.WAITING) {
                join();
                return;
            }
            if (parsedBody.match === sharedConstant.MATCH.CALLING_SEED && parsedBody.you) {
                seed();
            } else {
                playing();
            }
        })
        .catch(function (err) {
            console.log(err);
        });
};


const call = (lastCall) => {
    setTimeout(() => {
        let callNumber;
        if (!callNumber && !lastCall && !have(1) ) callNumber = 1;
        if (!callNumber && (lastCall === 1 || !lastCall) && !have(3)) callNumber = 3;
        if (!callNumber && (lastCall === 3 || !lastCall) && !have(10)) callNumber = 10;
        if (!callNumber && (lastCall === 10 || !lastCall) && !have(9)) callNumber = 9;
        if (!callNumber && (lastCall === 9 || !lastCall) && !have(8)) callNumber = 8;
        if (!callNumber && (lastCall === 8 || !lastCall) && !have(7)) callNumber = 7;
        if (!callNumber && (lastCall === 7 || !lastCall) && !have(6)) callNumber = 6;
        if (!callNumber && (lastCall === 6 || !lastCall) && !have(5)) callNumber = 5;
        if (!callNumber && (lastCall === 5 || !lastCall) && !have(4)) callNumber = 4;
        if (!callNumber && (lastCall === 4 || !lastCall) && !have(2)) callNumber = 2;

        if (callNumber) {
            rp({
                method: 'POST',
                uri: `${server}/call`,
                body: {
                    uid,
                    callNumber
                },
                json: true
            })
                .then(function (parsedBody) {
                    console.log('call', parsedBody);

                    if (parsedBody.match === sharedConstant.MATCH.WAITING) {
                        join();
                        return;
                    }

                    if (parsedBody.match === sharedConstant.MATCH.CALLING_SEED && parsedBody.you) {
                        seed();
                    } else {
                        setTimeout(calling, 1000);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        } else {
            skip();
        }
    }, callDelay);


};

const calling = () => {
    rp({
        method: 'POST',
        uri: `${server}/calling`,
        body: {
            uid
        },
        json: true
    })
        .then(function (parsedBody) {
            console.log('calling', parsedBody);

            if (parsedBody.match === sharedConstant.MATCH.WAITING) {
                join();
                return;
            }

            if (parsedBody.match === sharedConstant.MATCH.CALLING && parsedBody.you) {
                call(parsedBody.lastCall);
            } else if (parsedBody.match === sharedConstant.MATCH.CALLING_SEED && parsedBody.you) {
                seed();
            } else if (parsedBody.match === sharedConstant.MATCH.PLAYING) {
                playing();
            } else {
                setTimeout(calling, 1000);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
};


const requestCard = () => {
    rp({
        method: 'POST',
        uri: `${server}/give-me-cards`,
        body: {
            uid
        },
        json: true
    })
        .then(function (parsedBody) {
            console.log('give-me-cards', parsedBody);

            if (parsedBody.match === sharedConstant.MATCH.WAITING) {
                join();
                return;
            }
            cards = parsedBody.cards;
            calling();
        })
        .catch(function (err) {
            console.log(err);
        });
};

const join = () => {
    rp({
        method: 'POST',
        uri: `${server}/join-match`,
        body: {
            uid
        },
        json: true
    })
        .then(function (parsedBody) {
            console.log(parsedBody);
            uid = parsedBody.uid;
            if (parsedBody.match === sharedConstant.MATCH.WAITING) {
              setTimeout(join, 1000);
            }
            if (parsedBody.match === sharedConstant.MATCH.GIVING_CARDS) {
              requestCard();
            }
        })
        .catch(function (err) {
            console.log(err);
        });

};

const callDelayParam = process.argv.filter((arg) => arg.toLowerCase().startsWith('call-delay='));
if (callDelayParam.length >= 1) {
    callDelay = callDelayParam[0].substring('call-delay='.length);
    console.log(`callDelay : ${callDelay}`);
}

join();


/*
for i in {1..4} ;
do
    ( node bot/index.js call-delay=1000 & )
done
*/
