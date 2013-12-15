var test    = require('tape');
var Promise = require('promise');
var Game    = require('./src/game');
var Piece   = require('./src/piece');
var Matches = require('./src/matches');

function nothing () {}
function rand_between (a, b) {
  return Math.floor(Math.random() * (b + 1 - a) + a);
}

function test_turn (n_turn, piece, board) {
  return new Promise(function (resolve, reject) {
    resolve({ x: rand_between(board.x_min, board.x_max)
            , y: rand_between(board.y_min, board.y_max)
            });
  });
}

// This test doesn't work anymore, because some games
// are impossible to play until all pieces have been
// used up.
//
// test('play the whole game, randomly', function (t) {
//     t.plan(1);
//     (new Game)
//         .loop(test_turn, nothing)
//         .then(function (game) {
//             t.equal(game.completed(), true);
//         });
// });

test('match interpretations', function (t) {
    t.plan(1);
    t.equal(
        JSON.stringify(
            Matches.all(
                new Piece('red', 'f')
            ,   [ new Piece('red',    'f')
                , new Piece('red',    'b')
                , new Piece('yellow', 'f')
                ]
            )
        )
    ,   JSON.stringify(
            [ [ 'color', 'color', 'symbol' ]
            , [ 'symbol', 'color', 'symbol' ]
            ])
    );
});

test('grouped match counts', function (t) {
    t.plan(1);
    t.equal(
        JSON.stringify(
            Matches.grouped_counts(
                new Piece('red', 'f')
            ,   [ new Piece('red',    'f')
                , new Piece('red',    'b')
                , new Piece('yellow', 'f')
                ]
            )
        )
    ,   JSON.stringify(
            [ { 'color': 2, 'symbol': 1 }
            , { 'color': 1, 'symbol': 2 }
            ])
    );
});

test('satisfy match predicate', function (t) {
    t.plan(4);
    var neighbours =
        [ new Piece('red',    'f')
        , new Piece('red',    'b')
        , new Piece('yellow', 'f')
        ];
    var bad_neighbours =
        [ new Piece('yellow', 'b')
        , new Piece('yellow', 'c')
        ]

    t.equal(
        Matches.satisfy(
            new Piece('red', 'f')
        ,   neighbours
        ,   [ { 'color': 2, 'symbol': 1 }
            , { 'color': 1, 'symbol': 2 }
            ]
        )
    ,   true
    );

    t.equal(
        Matches.satisfy(
            new Piece('red', 'f')
        ,   neighbours
        ,   [ { 'color': 1, 'symbol': 1 } ]
        )
    ,   true
    );

    t.equal(
        Matches.satisfy(
            new Piece('red', 'b')
        ,   neighbours
        ,   [ { 'symbol': 2 } ]
        )
    ,   false
    );

    t.equal(
        Matches.satisfy(
            new Piece('red', 'f')
        ,   bad_neighbours
        ,   [ { 'color':  1 }
            , { 'symbol': 1 }
            ]
        )
    ,   false
    );
});
