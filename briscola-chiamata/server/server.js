const express           = require('express');
const app               = express();
const port              = process.env.PORT || 3000;
const path              = require('path');
const serveStatic       = require('serve-static');
const expressSession    = require('express-session');
const player            = require('./player.js');
const uid               = require('uid');
const bodyParser        = require('body-parser');
const apiPrefix         = '/api';

app.use(bodyParser.json());

app.use(expressSession({
    secret: uid(6),
    cookie: {
        maxAge: 60000
    },
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use((req, res, next) => {

    console.log(req.url);

    if (req.url.startsWith(apiPrefix)) {
        let p = undefined;
        const reqUid = (req.body && req.body.uid) || (req.session && req.session.uid);

        if (reqUid) {
            p = player.get(reqUid);
        }

        if (p === undefined) {
            let playerUid = reqUid || uid(10);
            p = player.factory(playerUid);
            req.session.uid = playerUid;
            console.log(`new player ${playerUid}`);
        }

        req.player = p;
    }

    next();
});


app.use('/', serveStatic(path.resolve(__dirname, '../client'))); //home page
app.use('/shared', serveStatic(path.resolve(__dirname, '../shared'))); //shared js

app.use(apiPrefix, require('./routes/info.js'));
app.use(apiPrefix, require('./routes/call.js'));
app.use(apiPrefix, require('./routes/calling.js'));
app.use(apiPrefix, require('./routes/give-me-cards.js'));
app.use(apiPrefix, require('./routes/join-match.js'));
app.use(apiPrefix, require('./routes/skip.js'));
app.use(apiPrefix, require('./routes/seed.js'));
app.use(apiPrefix, require('./routes/playing.js'));
app.use(apiPrefix, require('./routes/play.js'));
app.use(apiPrefix, require('./routes/opponents.js'));


app.listen(port, () =>  {
    console.log(`server listening on port ${port}`);
});
