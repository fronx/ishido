var Promise = require('promise');

function Piece (color, symbol) {
    var piece = this;
    piece.color = color;
    piece.symbol = symbol;

    piece.equal = function (other) {
        return (piece.match_color(other) && piece.match_symbol(other));
    }

    piece.toString = function () {
        // implicitly depends on package 'colors'
        return piece.symbol[piece.color];
    }

    // piece.match_color :: Piece -> Boolean
    piece.match_color = function (other) {
        return (other.color == piece.color);
    }

    // piece.match_symbol :: Piece -> Boolean
    piece.match_symbol = function (other) {
        return (other.symbol == piece.symbol);
    }

    // piece.matching :: Piece -> [ String ]
    piece.matching = function (other) {
        var result = [];
        if (piece.match_color(other))  result.push('color');
        if (piece.match_symbol(other)) result.push('symbol');
        return result;
    }
}

function Board () {
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

    board.n_fields = board.y_num * board.x_num;

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

    board.neighbours = function (x, y) {
        return [ board.at(x - 1, y)
               , board.at(x + 1, y)
               , board.at(x, y - 1)
               , board.at(x, y + 1)
               ].filter(function (cell) { return cell != null })
    }
}

function a_concat_b (a, b) { return a.concat(b); }

// cartesian_product :: [ [a] ] -> [ [a] ]
function cartesian_product (arrays) {
    return arrays.reduce(function (as, bs) {
        if (as.length == 0) // :( is there a better way?
            as = [ [] ];
        return (
            as.map(function (a) {
               return bs.map(function (b) {
                   return a.concat([ b ]);
               });
            }).reduce(a_concat_b)
        );
    }, [ [] ]);
};

Matches = (function () {
    // all :: Piece -> [ Piece ] -> [ [String] ]
    function all (piece, pieces) {
        var matches = pieces.map(function (p) {
            return p.matching(piece);
        });
        return cartesian_product(matches);
    }

    // grouped_counts :: Piece -> [ Piece ] -> [ Object String Integer ]
    function grouped_counts (piece, pieces) {
        return all(piece, pieces).map(function (matches) {
            // matches :: [String]
            return matches.reduce(function (acc, match) {
                // match :: String
                acc[match] = acc[match] + 1;
                return acc;
            }, { color: 0, symbol: 0 });
        });
    }

    // satisfies :: Piece -> [ Piece ] -> [ Object String Integer ] -> Boolean
    function satisfies (piece, pieces, predicates) {
        return grouped_counts(piece, pieces).some(function (grouped) {
            return predicates.some(function (pred_grouped) {
                var satisfied = true;
                [ 'color', 'symbol' ].forEach(function (match) {
                    // match :: String
                    if (pred_grouped[match]) {
                        if (grouped[match]) {
                            satisfied = satisfied && (grouped[match] >= pred_grouped[match])
                        } else {
                            satisfied = false;
                        }
                    }
                });
                return satisfied;
            });
        });
    }
    return { all:            all
           , grouped_counts: grouped_counts
           , satisfies:      satisfies
           };
})();

function Game () {
    var game = this;
    var turns = [];

    var colors =
        [ 'blue'
        , 'cyan'
        , 'green'
        , 'magenta'
        , 'red'
        , 'yellow'
        ];

    var symbols = [ 'a', 'b', 'c', 'd', 'e', 'f' ];

    var all_pieces = (function () {
        var pieces = [];
        colors.forEach(function (color) {
            symbols.forEach(function (symbol) {
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
        var shuffled_colors  = shuffle(colors);
        var shuffled_symbols = shuffle(symbols);
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

    // matching :: Piece -> [ Piece ] -> Boolean
    function matching(piece, neighbours) {
        if (neighbours.length == 0)
            return false;
        if (neighbours.length == 1) {
            return Matches.satisfies(piece, neighbours,
                [ { color:  1 }
                , { symbol: 1 }
                ]
            );
        }
        if (neighbours.length == 2) {
            return Matches.satisfies(piece, neighbours,
                [ { color: 1, symbol: 1 } ]
            );
        }
        if (neighbours.length == 3) {
            return Matches.satisfies(piece, neighbours,
                [ { color: 1, symbol: 2 }
                , { color: 2, symbol: 1 }
                ]
            );
        }
        if (neighbours.length == 4) {
            return Matches.satisfies(piece, neighbours,
                [ { color: 2, symbol: 2 } ]
            );
        }
        console.log("Something's up with the matching.");
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

function Cli (dependencies) {
    // shortcut
    function print (x) {
        process.stdout.write(x);
    };

    // implicitly depends on package 'colors'
    function cli_draw (board) {
        function draw_num_cell (num) {
            if (num < 10)
                print(' ' + num + ' ')
            else
                print('' + num + ' ');
        }

        function draw_char_cell (char) {
            print(' ' + char + ' ');
        }

        function draw_x_axis () {
            print('   '); // leave room for the y axis
            for (var x = 1; x <= board.x_max; x++)
                draw_num_cell(x);
            print("\n");
        }

        var empty_cell_char = '☐';
        draw_x_axis();

        for (var i = 0; i < board.n_fields; i++) {
            if (i % board.x_num == 0) {
                if (i > 0) print("\n"); // end of row
                // y-axis
                var y = (i / board.x_num) + 1;
                draw_num_cell(y);
            }
            if (board.cells[i] instanceof Piece)
                draw_char_cell(board.cells[i].toString())
            else
                draw_char_cell(empty_cell_char);
        }
        print("\n");
    }

    // cli_ask :: String -> Promise String
    function cli_ask (question) {
        var rl = dependencies.readline.createInterface({
            input:  process.stdin,
            output: process.stdout
        });
        return new Promise(function (resolve, reject) {
            rl.question(question, function (answer) {
                rl.close();
                resolve(answer);
            });

        });
    }

    // cli_user_turn :: Int -> Piece -> Board -> Promise Point
    function cli_user_turn (n_turn, piece, board) {
        print("\n== turn " + n_turn + " ==\n\n");
        cli_draw(board);
        print("\ncurrent piece: " + piece.toString() + "\n");
        return cli_ask('x,y: ').then(function (input_string) {
            xy = input_string.split(/\s*,\s*/);
            return { x: parseInt(xy[0])
                   , y: parseInt(xy[1])
                   }
        });
    }

    function cli_completed (game) {
        print("COMPLETED\n");
    };

    return { draw:      cli_draw
           , ask:       cli_ask
           , user_turn: cli_user_turn
           , completed: cli_completed
           };
};

function main (dependencies) {
    var cli = Cli(dependencies);
    (new Game)
        .loop(cli.user_turn, console.log)
        .then(cli.completed);
}

if (require.main === module) {
    main(
        { colors:   require('colors')
        , readline: require('readline')
        }
    );
} else {
    module.exports.Piece   = Piece;
    module.exports.Board   = Board;
    module.exports.Game    = Game;
    module.exports.Matches = Matches;
}
