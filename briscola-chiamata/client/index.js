(() => {

    const apiPath = '/api';
    let userState = {};

    const f = (method, path, body) => {
        if (!body) body = {};
        body.uid = 'toto';
        return fetch(`${apiPath}${path}`, {
            method,
            body: JSON.stringify(body),
            mode: 'cors', // no-cors, *same-origin
            redirect: 'follow', // *manual, error
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
    };

    const updateView = () => {
        const matchEl = $('#match');
        removeClasses(matchEl, `state-`);
        if (userState.match) {
            matchEl.addClass('state-' + userState.match.toLowerCase());
        }
    };

    const removeClasses = (elements, including) => {
      (elements.attr('class') || '').split(' ').forEach(clz => {
          if (clz.includes(including)) elements.removeClass(clz.trim());
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

                setTimeout(calling, 200);


            })
            .catch(error => console.error('Error:', error));


    };

    const calling = () => {
        f('POST', `/calling` )
            .then(res => res.json())
            .then(response => {
                console.log('/calling',response);
                userState = response.userState;


                switch (userState.match) {
                    case sharedObj.constant.MATCH.CALLING : {
                        if (userState.you) {
                            const numberToCall = window.prompt('call','');
                            if (numberToCall.length > 0) {
                                call(numberToCall);
                            } else {
                                skip();
                            }
                        } else {
                            removeClasses($(`.opponent`), `calling`);
                            $(`#opponent-${userState.opponentCalling}`).addClass(`calling`);
                            $(`#calling .card-number`)[0].innerHTML=userState.lastCall;
                            setTimeout(calling, 200);
                        }
                        break;
                    }
                    case sharedObj.constant.MATCH.GIVING_CARDS: {
                        setTimeout(calling, 1000);
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