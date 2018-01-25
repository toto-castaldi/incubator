const express           = require('express');
const app               = express();
const port              = process.env.PORT || 3000;
const path              = require('path');
const serveStatic       = require('serve-static');
const expressSession    = require('express-session');
const apiRouter         = require('./routes/api-router.js');

app.use('/', serveStatic(path.resolve(__dirname, '../client'))); //home page
app.use('/shared', serveStatic(path.resolve(__dirname, '../shared'))); //shared js

app.use(expressSession({
    secret: '6jCam8Id',
    cookie: {
        maxAge: 60000
    }
}));

app.use('/api', apiRouter);

app.listen(port, () =>  {
    console.log(`server listening on port ${port}`);
});