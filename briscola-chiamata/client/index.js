(() => {

    const apiPath = '/api';
    let userState = {};
    let lastCaller;
    let lastCall;

    const updateClassCalling = (uid) => {
        if (lastCaller !== uid) {
            lastCaller = uid;
            removeClasses($(`.opponent`), `calling`);
            $(`.opponent.opponent-${lastCaller}`).addClass(`calling`);
        }
    };

    const f = (method, path, body) => {
        if (!body) body = {};
        body.uid = 'toto';
        const options = {
            method,
            //credentials: "same-origin",
            mode: 'cors', // no-cors, *same-origin
            redirect: 'follow', // *manual, error
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        };
        if (method === 'POST') {
            options.body = JSON.stringify(body);
        }

        return fetch(`${apiPath}${path}`, options);
    };

    const updateView = () => {
        const matchEl = $('#match');
        removeClasses(matchEl, `state-`);
        if (userState.match) {
            matchEl.addClass('state-' + userState.match.toLowerCase());
        }
    };

    const removeClasses = (elements, including) => {
        //jquery iteration
        elements.each((index, elem) => {
            const element = $(elem);
            (element.attr('class') || '').split(' ').forEach(clz => {
                if (clz.includes(including)) element.removeClass(clz.trim());
            });
        });

    };

    const skip = () => {
        f('POST', `/skip`)
            .then(res => res.json())
            .then(response => {
                console.log('/skip',response);
                userState = response.userState;
            })
            .catch(error => console.error('Error:', error));


    };

    const call = (callNumber) => {
        f('POST', `/call`, {
            callNumber
        })
            .then(res => res.json())
            .then(response => {
                console.log('/call',response);
                userState = response.userState;

                setTimeout(calling, 2000);


            })
            .catch(error => console.error('Error:', error));


    };

    const playing = (seed) => {
        f('POST', `/playing`, {
            seed
        })
            .then(res => res.json())
            .then(response => {
                console.log('/playing',response);
                userState = response.userState;

                switch (userState.match) {
                    case sharedObj.constant.MATCH.PLAYING : {
                        if (userState.you) {
                            console.log('PLAYYYYYYYYYY');
                        } else {
                            setTimeout(playing, 2000);
                        }
                        break;
                    }
                    default : {
                        break;
                    }
                }
            })
            .catch(error => console.error('Error:', error));

    };

    const seed = (seed) => {
        f('POST', `/seed`, {
                seed
            })
            .then(res => res.json())
            .then(response => {
                console.log('/seed',response);
                userState = response.userState;

                $(`#calling .card-seed`)[0].innerHTML = seed;

                playing();


            })
            .catch(error => console.error('Error:', error));


    };

    const calling = () => {
        f('POST', `/calling` )
            .then(res => res.json())
            .then(response => {
                console.log('/calling',response);
                userState = response.userState;

                if (userState && userState.lastCall) $(`#calling .card-number`)[0].innerHTML = userState.lastCall;
                if (userState && userState.opponentCalling && userState.opponentCalling.uid) updateClassCalling(userState.opponentCalling.uid);
                if (userState && userState.you) updateClassCalling(response.uid);


                switch (userState.match) {
                    case sharedObj.constant.MATCH.CALLING : {

                        if (userState.you) {
                            setTimeout(() => {
                                const numberToCall = window.prompt('call','');
                                if (numberToCall && numberToCall.length > 0) {
                                    call(numberToCall);
                                } else {
                                    skip();
                                }
                            },100);
                        } else {
                            if (userState.lastCall && lastCall != userState.lastCall) {
                                lastCall = userState.lastCall;

                            }
                            setTimeout(calling, 2000);
                        }

                        break;
                    }
                    case sharedObj.constant.MATCH.GIVING_CARDS: {
                        setTimeout(calling, 1000);
                        break;
                    }
                    case sharedObj.constant.MATCH.CALLING_SEED: {
                        if (userState.you) {
                            setTimeout(() => {
                                const seedToCall = window.prompt('seed','');
                                if (sharedObj.validSeed(seedToCall)) {
                                    seed(seedToCall);
                                }
                            }, 100);
                        } else {
                            setTimeout(calling, 2000);
                        }
                        break;
                    }
                    default : {
                        break;
                    }
                }


            })
            .catch(error => console.error('Error:', error));


    };


    const loadOpponents = () => {
        f('GET', `/opponents` )
            .then(res => res.json())
            .then(response => {
                console.log('/opponents',response);
                userState = response.userState;

                if (userState.opponents) {
                    userState.opponents.forEach((item, index) => {
                        $(`#opponent-${index} .opponent-uid`)[0].innerHTML=item.uid;
                        $(`#opponent-${index}`).addClass(`opponent-${item.uid}`);
                    });
                }

                calling();

            })
            .catch(error => console.error('Error:', error));

    };

    const givingCards = () => {
        f('POST', `/give-me-cards`)
            .then(res => res.json())
            .then(response => {
                console.log('/give-me-cards',response);
                userState = response.userState;

                if (userState.cards) {
                    userState.cards.forEach((item, index) => {
                        $(`#card-${index} .card-seed`)[0].innerHTML=item.seed;
                        $(`#card-${index} .card-number`)[0].innerHTML=item.number;
                    });
                }

                loadOpponents();

            })
            .catch(error => console.error('Error:', error));

    };

    const joinMatch = () => {
        f('POST', `/join-match`)
            .then(res => res.json())
            .then(response => {
                console.log('/join-match', response);
                userState = response.userState;
                updateView();

                switch (userState.match) {
                    case sharedObj.constant.MATCH.WAITING : {
                        setTimeout(joinMatch, 5000);
                        break;
                    }
                    case sharedObj.constant.MATCH.GIVING_CARDS: {
                        givingCards();
                        break;
                    }
                    default : {
                        break;
                    }
                }
            })
            .catch(error => console.error('Error:', error));

    };


    updateView();
    joinMatch();


})();