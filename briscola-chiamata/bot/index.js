const rp              = require('request-promise');
const sharedConstant  = require('../shared/shared.js').constant;

let uid ;
let cards;
const server = 'http://localhost:3000/api';

const call = (lastCall) => {
  let callNumber;
  if (!callNumber && !lastCall && !have(1) ) callNumber = 1;
  if (!callNumber && lastCall === 1 && !have(3)) callNumber = 3;
  if (!callNumber && lastCall === 3 && !have(10)) callNumber = 10;
  if (!callNumber && lastCall === 10 && !have(9)) callNumber = 9;
  if (!callNumber && lastCall === 9 && !have(8)) callNumber = 8;
  if (!callNumber && lastCall === 8 && !have(7)) callNumber = 7;
  if (!callNumber && lastCall === 7 && !have(6)) callNumber = 6;
  if (!callNumber && lastCall === 6 && !have(5)) callNumber = 5;
  if (!callNumber && lastCall === 5 && !have(4)) callNumber = 4;
  if (!callNumber && lastCall === 4 && !have(2)) callNumber = 2;

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
            console.log(parsedBody);
            if (parsedBody.userState.match === sharedConstant.MATCH.CALLING && parsedBody.userState.youCall) {
                call(parsedBody.userState.lastCall);
            } else {
                setTimeout(calling, 3000);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
  } else {
    skip();
  }
}

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
            console.log(parsedBody);
            if (parsedBody.userState.match === sharedConstant.MATCH.CALLING && parsedBody.userState.youCall) {
                call(parsedBody.userState.lastCall);
            } else {
                setTimeout(calling, 3000);
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
            console.log(parsedBody);
            cards = parsedBody.userState.cards;
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
            if (parsedBody.userState.match === sharedConstant.MATCH.WAITING) {
              setTimeout(join, 3000);
            }
            if (parsedBody.userState.match === sharedConstant.MATCH.GIVING_CARDS) {
              requestCard();
            }
        })
        .catch(function (err) {
            console.log(err);
        });

};

join();


/*
for i in {1..4} ;
do
    ( node bot/index.js & )
; done
*/
