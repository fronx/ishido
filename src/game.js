var Piece = require('./piece');
var Board = require('./board');
var Matches = require('./matches');
var Promise = require('promise');

function Game (tile_set) {
    var game = this;
    var turns = [];

    var all_pieces = (function () {
        var pieces = [];
        tile_set.colors.forEach(function (color) {
            tile_set.symbols.forEach(function (symbol) {
                pieces.push(new Piece(color, symbol));
            });
        });
        return pieces.concat(pieces); // there's two of each
    })();


    /**
     * Randomize array element order in-place.
     * Using Fisher-Yates shuffle algorithm.
     * http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     */
    function shuffle (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    var initial_pieces = (function () {
        var shuffled_colors  = shuffle(tile_set.colors);
        var shuffled_symbols = shuffle(tile_set.symbols);
        return shuffled_colors.map(function (color, index) {
            return new Piece(color, shuffled_symbols[index]);
        });
    })();

    var pieces = initial_pieces.concat(
        shuffle(all_pieces).filter(function (piece) {
            return !initial_pieces.some(function (initial) {
                return initial.equal(piece);
            });
        })
    );

    var board = new Board;

    function put (x, y, piece) {
        turns.push([ x, y, piece ]);
        board.set(x, y, piece);
    }

    function valid_placing (x, y, piece) {
        return board.valid_xy(x, y) &&
               board.free(x, y) &&
               Matches.satisfies(piece, board.neighbours(x, y));
    }

    function turn () {
        return turns.length - board.start_positions.length + 1;
    }

    game.completed = function () {
        // TODO !or no more valid moves!
        return (pieces.length == 0);
    }

    // game.next :: (Int -> Piece -> Board -> Promise Point)
    //           -> Promise Game
    game.next = function (fn) {
        return new Promise(function (resolve, reject) {
            var piece = pieces.shift();
            fn(turn(), piece, board).
                then(function (point) {
                    if (valid_placing(point.x, point.y, piece)) {
                        put(point.x, point.y, piece);
                        resolve(game);
                    } else {
                        pieces.unshift(piece);
                        reject('invalid move');
                    }
                });
        });
    }

    // game.loop :: (Int -> Piece -> Board -> Promise Point)
    //           -> (String -> Void)
    //           -> Promise Game
    game.loop = function (user_turn, fn_error) {
        if (!game.completed()) {
            return game.next(user_turn).then(
                function (game) {
                    return game.loop(user_turn, fn_error);
                },
                function (message) {
                    fn_error(message);
                    return game.loop(user_turn, fn_error);
                });
        } else {
            return new Promise(function (resolve, reject) {
                resolve(game);
            });
        }
    }

    function put_initial_pieces () {
        board.start_positions.forEach(function (point) {
            put(point.x, point.y, pieces.shift());
        });
    }

    put_initial_pieces();
}

module.exports = Game;
