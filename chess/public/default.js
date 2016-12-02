var board;
var game;

window.onload = function () {
    initGame();
};

var initGame = function() {
    var cfg = {
        draggable: true,
        position: 'start',
        onDrop: handleMove,
    };

    board = new ChessBoard('gameBoard', cfg);
    game = new Chess();
};

// setup my socket client
var socket = io();

// called when a player makes a move on the board UI
var handleMove = function(source, target) {
    var move = game.move({from: source, to: target});

    //console.log(move);

    if (move === null)  return 'snapback';
    else {
        console.log('move', move);
        socket.emit('move', move);
    }

};

socket.on('move', function(msg) {
    game.move(msg);
    board.position(game.fen());
});