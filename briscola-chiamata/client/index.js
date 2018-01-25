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
                console.log(response);
                userState = response.userState;
                updateView();
            })
            .catch(error => console.error('Error:', error));

    };


    updateView();
    joinMatch();

})();