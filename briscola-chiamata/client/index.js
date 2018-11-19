(() => {

    const apiPath = '/api';
    let lastCaller;
    let lastPlayer;
    let uid;

    const updateClassCalling = (uid) => {
        if (lastCaller !== uid) {
            lastCaller = uid;
            removeClasses($(`.opponent`), `calling`);
            $(`.opponent.opponent-${lastCaller}`).addClass(`calling`);
        }
    };

    const updateClassPlaying = (uid) => {
      if (lastPlayer !== uid) {
        lastPlayer = uid;
        removeClasses($(`.opponent`), `playing`);
        $(`.opponent.opponent-${lastPlayer}`).addClass(`playing`);
      }
    };

    const updateHand = (hand) => {
      hand.forEach(({card, player}) => {
        $(`.opponent.opponent-${player.uid} .hand .card-seed`)[0].innerHTML = card.seed;
        $(`.opponent.opponent-${player.uid} .hand .card-number`)[0].innerHTML = card.number;
        //$(`.opponent.opponent-${player.uid}`)
      });
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

    const updateView = (userState) => {
        const matchEl = $('#match');
        removeClasses(matchEl, `state-`);
        if (userState && userState.match) {
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
            })
            .catch(error => console.error('Error:', error));


    };

    const call = (callNumber) => {
        f('POST', `/call`, {
            callNumber
        })
            .then(res => res.json())
            .then(response => {
                console.log('/call',response, response.callValid);

                if (response.lastCall) $(`#calling .card-number`)[0].innerHTML = response.lastCall;

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

              if (response.playerPlaying && response.playerPlaying.uid) updateClassPlaying(response.playerPlaying.uid);
              if (response.hand) updateHand(response.hand);


              switch (response.match) {
                    case sharedObj.constant.MATCH.PLAYING : {
                        if (response.you) {
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

                if (response.seedCallResult) {
                  $(`#calling .card-seed`)[0].innerHTML = seed;
                  playing();
                } else {
                  calling();
                }

            })
            .catch(error => console.error('Error:', error));


    };

    const calling = () => {
        f('POST', `/calling` )
            .then(res => res.json())
            .then(response => {
                console.log('/calling',response, response.lastCall);

                if (response.lastCall) $(`#calling .card-number`)[0].innerHTML = response.lastCall;
                if (response.opponentCalling && response.opponentCalling.uid) updateClassCalling(response.opponentCalling.uid);
                if (response.you) updateClassCalling(uid);


                switch (response.match) {
                    case sharedObj.constant.MATCH.CALLING : {

                        if (response.you) {
                            setTimeout(() => {
                                const numberToCall = parseInt(window.prompt('call',''));
                                if (numberToCall !== NaN) {
                                  if (response.lastCall) $(`#calling .card-number`)[0].innerHTML = numberToCall;
                                    call(numberToCall);
                                } else {
                                    skip();
                                }

                            },100);
                        } else {
                            setTimeout(calling, 2000);
                        }

                        break;
                    }
                    case sharedObj.constant.MATCH.GIVING_CARDS: {
                        setTimeout(calling, 1000);
                        break;
                    }
                    case sharedObj.constant.MATCH.CALLING_SEED: {
                        if (response.you) {
                            setTimeout(() => {
                              seed(window.prompt('seed',''));
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

                if (response.opponents) {
                  response.opponents.forEach((item, index) => {
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

                if (response.cards) {
                  response.cards.forEach((item, index) => {
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
                uid = response.uid;
                updateView(response);

                switch (response.match) {
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