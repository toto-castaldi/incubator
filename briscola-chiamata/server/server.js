const express           = require('express');
const app               = express();
const port              = process.env.PORT || 3000;
const path              = require('path');
const serveStatic       = require('serve-static');
const expressSession    = require('express-session');
const apiRouter         = require('./routes/api-router.js');
const player            = require('./player.js');
const uid               = require('uid');
const bodyParser        = require('body-parser');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(expressSession({
    secret: uid(6),
    cookie: {
        maxAge: 60000
    },
    resave: true,
    saveUninitialized: true
}));


app.use('/', (req, res, next) => {
    let p = undefined;
    const reqUid = req.session.uid || (req.body && req.body.uid);
    if (reqUid) {
        p = player.get(reqUid);
        //console.log(`player info already present ${reqUid}`, p);
    }

    if (p === undefined) {
        let playerUid = uid(10);
        p = player.factory(playerUid);
        req.session.uid = playerUid;
        console.log(`new player ${playerUid}`);
    }
    
    req.player = p;
    next();
});

app.use('/', serveStatic(path.resolve(__dirname, '../client'))); //home page
app.use('/shared', serveStatic(path.resolve(__dirname, '../shared'))); //shared js

app.use('/api', apiRouter);


app.listen(port, () =>  {
    console.log(`server listening on port ${port}`);
});
