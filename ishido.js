var colors = require('colors');
var Promise = require('promise');
var readline = require('readline');

var Piece = function (color, symbol) {
    var piece = this;
    piece.color = color;
    piece.symbol = symbol;

    piece.toString = function () {
        return piece.symbol[piece.color];
    }

    piece.match_color = function (other) {
        return (other.color == piece.color);
    }

    piece.match_symbol = function (other) {
        return (other.symbol == piece.symbol);
    }
}

var Board = function () {
    var board = this;
    board.cells = [];
    board.y_min = board.x_min = 1;
    board.y_num = board.y_max = 8;
    board.x_num = board.x_max = 12;

    board.start_positions =
        [ { x: board.x_min,         y: board.y_min         }
        , { x: board.x_max,         y: board.y_min         }
        , { x: board.x_min,         y: board.y_max         }
        , { x: board.x_max,         y: board.y_max         }
        , { x: board.x_max / 2,     y: board.y_max / 2     }
        , { x: board.x_max / 2 + 1, y: board.y_max / 2 + 1 }
        ];

    var n_fields = board.y_num * board.x_num;

    function flatten_xy (x, y) {
        return (y - board.y_min) * board.x_num + (x - board.x_min);
    }

    board.valid_xy = function (x, y) {
        return (x >= board.x_min) && (x <= board.x_max) && (y >= board.y_min) && (y <= board.y_max);
    }

    board.at = function (x, y) {
        if (board.valid_xy(x, y))
            return board.cells[flatten_xy(x, y)]
        else
            return null;
    }

    board.free = function (x, y) {
        return (!(board.at(x, y) instanceof Piece));
    }

    board.set = function (x, y, value) {
        board.cells[flatten_xy(x, y)] = value;
    }

    board.draw = function () {
        var empty_cell_string = '☐';
        for (i = 0; i < n_fields; i++) {
            if ((i > 0) && (i % board.x_num == 0)) process.stdout.write("\n");
            if (board.cells[i] instanceof Piece)
                process.stdout.write(board.cells[i].toString())
            else
                process.stdout.write(empty_cell_string);
        }
        process.stdout.write("\n");
    }

    board.neighbours = function (x, y) {
        return [ board.at(x - 1, y)
               , board.at(x + 1, y)
               , board.at(x, y - 1)
               , board.at(x, y + 1)
               ].filter(function (cell) { return cell != null })
    }
}

var Game = function () {
    var game = this;
    var turns = [];

    var all_pieces = (function () {
        var colors =
            [ 'blue'
            , 'cyan'
            , 'green'
            , 'magenta'
            , 'red'
            , 'yellow'
            ]

        var symbols =
            [ 'a'
            , 'b'
            , 'c'
            , 'd'
            , 'e'
            , 'f'
            ]

        var pieces = []
        colors.forEach(function (color) {
            symbols.forEach(function (symbol) {
                pieces.push(new Piece(color, symbol));
            })
        })
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

    var pieces = shuffle(all_pieces);
    var board = new Board;

    function put (x, y, piece) {
        turns.push([ x, y, piece ]);
        board.set(x, y, piece);
    }

    function put_initial_pieces () {
        board.start_positions.forEach(function (point) {
            put(point.x, point.y, pieces.shift());
        });
    }

    function matching(piece, neighbours) {
        // TODO
        return true;
    }

    function valid_placing (x, y, piece) {
        return board.valid_xy(x, y) &&
               board.free(x, y) &&
               matching(piece, board.neighbours(x, y));
    }

    function turn () {
        return turns.length - board.start_positions.length + 1;
    }

    game.completed = function () {
        return (pieces.length == 0);
    }

    game.next = function (fn) {
        var promise = new Promise(function (resolve, reject) {
            var piece = pieces.shift();
            fn(turn(), piece, board). // must return a promise
                then(function (placing) {
                    var x = placing.x;
                    var y = placing.y;
                    if (valid_placing(x, y, piece)) {
                        put(x, y, piece);
                        resolve(game);
                    } else {
                        pieces.unshift(piece);
                        reject('invalid move');
                    }
                });
        });
        return promise;
    }

    put_initial_pieces();
}

var ask = function (prompt) {
    var rl = readline.createInterface({
        input:  process.stdin,
        output: process.stdout
    });
    var promise = new Promise(function (resolve, reject) {
        rl.question(prompt, function (answer) {
            rl.close();
            resolve(answer);
        });

    });
    return promise;
}

var loop = function (game) {
    if (!game.completed()) {
        return game.next(user_turn).then(loop, function (message) {
            console.log(message);
            loop(game);
        });
    } else {
        console.log('completed');
    }
}

var user_turn = function (n_turn, piece, board) {
    process.stdout.write("\n== turn " + n_turn + " ==\n\n");
    board.draw();
    console.log("\ncurrent piece: " + piece.toString());
    return ask('x,y: ').then(function (input_string) {
        xy = input_string.split(/\s*,\s*/);
        return { x: parseInt(xy[0])
               , y: parseInt(xy[1])
               }
    });
}

var main = function () {
    game = new Game;
    loop(game);
}

if (require.main === module) {
    main();
}
