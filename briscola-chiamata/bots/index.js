const rp        = require('request-promise');

const query = (prompt, callback) => {

    process.stdin.resume();
    process.stdout.write(prompt);
    process.stdin.once("data", function (data) {
        callback(data.toString().trim());
    });
};

const printLinesWaitForQuestions = (actions, someCallbackFunction) => {

    const continueProcessing = () => {
        if (actions.length) {
            printNextLine(actions.pop());
        } else {
            someCallbackFunction();
        }
    };

    const printNextLine = (action) => {

            query(action.prompt, function (response) {
                action.logic(response);
                process.stdin.pause();
                continueProcessing();
            });
    };

    continueProcessing();
};

const uids = [];
const server = 'http://localhost:3000/api';

const botsJoin = () => {

    const join = (index) => {
        if (index < 4) {
            rp({
                method: 'POST',
                uri: `${server}/join-match`,
                json: true // Automatically stringifies the body to JSON
            })
                .then(function (parsedBody) {
                    console.log('bot join', index, parsedBody);
                    uids.push(parsedBody.uid);
                    join(index + 1);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    };

    join(0);

};

const botsCards = () => {

    const card = (index) => {
        if (index == 0) {
            rp({
                method: 'POST',
                uri: `${server}/give-me-cards`,
                body: {
                    uid: uids[0]
                },
                json: true
            })
                .then(function (parsedBody) {
                    console.log('bot cards', index, parsedBody);
                    uids.push(parsedBody.uid);
                    card(index + 1);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    };

    card(0);

};

const actions = [
    {
        prompt : 'Press any key for bots cards ',
        logic : botsCards
    },
    {
        prompt : 'Press any key to join bots ',
        logic : botsJoin
    }

];

printLinesWaitForQuestions(actions, function () {
    console.log('Were done now');
});