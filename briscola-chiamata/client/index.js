(() => {

    const apiPath = '/api';
    let userState = {};

    const updateView = () => {
        const matchEl = $('#match');
        (matchEl.attr('class') || '').split(' ').forEach(clz => {
           if (clz.includes('state-')) matchEl.removeClass(clz.trim());
        });
        if (userState.match) {
            matchEl.addClass('state-' + userState.match.toLowerCase());
        }
    };
    const givingCards = () => {
        fetch(`${apiPath}/give-me-cards`, {
            method: 'POST',
            credentials: "same-origin",
            body: {},
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(res => res.json())
            .then(response => {
                console.log('/give-me-cards',response);

            })
            .catch(error => console.error('Error:', error));

    };

    const joinMatch = () => {
        fetch(`${apiPath}/join-match`, {
            method: 'POST',
            credentials: "same-origin",
            body: {},
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
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