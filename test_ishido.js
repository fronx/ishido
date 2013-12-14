var test = require('tape');
var Promise = require('promise');
var ishido = require('./ishido');

function nothing () {}
function rand_between (a, b) {
  return Math.floor(Math.random() * (b + 1 - a) + a);
}

function test_turn (n_turn, piece, board) {
  return new Promise(function (resolve, reject) {
    resolve({ x: rand_between(board.x_min, board.x_max)
            , y: rand_between(board.y_min, board.y_max)
            })
  });
}

test('play the whole game, randomly', function (t) {
    t.plan(1);

    (new ishido.Game)
        .loop(test_turn, nothing)
        .then(function (game) {
            t.equal(true, game.completed())
        });
});
