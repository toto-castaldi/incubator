var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/default.html');
});

http.listen(port, function() {
    console.log('listening on *: ' + port);
});


// setup my socket server
var io = require('socket.io')(http);

io.on('connection', function(socket) {
    console.log('new connection');

    // Called when the client calls socket.emit('move')
    socket.on('move', function(msg) {
        console.log("move received", msg);
        socket.broadcast.emit('move', msg);
    });
});