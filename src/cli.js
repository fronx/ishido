require('colors');
var Promise  = require('promise');
var readline = require('readline')
var Piece    = require('./piece');
var TileSet  = require('./tile_set');
var Game     = require('./game');

function Cli () {
    function print (x) {
        process.stdout.write(x);
    };

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

        draw_x_axis();

        board.each_cell(function (cell, index) {
            if (index % board.x_num == 0) {
                if (index > 0) print("\n"); // end of row
                // y-axis
                var y = (index / board.x_num) + 1;
                draw_num_cell(y);
            }
            draw_char_cell(piece_as_char(cell));
        });
        print("\n");
    }

    var empty_cell_char = '☐';

    function piece_as_char (piece) {
        if (piece instanceof Piece)
            // implicitly depends on package 'colors'
            return piece.symbol[piece.color]
        else
            return empty_cell_char;
    }

    // cli_ask :: String -> Promise String
    function cli_ask (question) {
        var rl = readline.createInterface({
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
        print("\ncurrent piece: " + piece_as_char(piece) + "\n");
        return cli_ask('x,y: ').then(function (input_string) {
            xy = input_string.split(/\s*,\s*/);
            return { x: parseInt(xy[0])
                   , y: parseInt(xy[1])
                   }
        });
    }

    function cli_completed (game) {
        print("COMPLETED\n");
    }

    var cli_tile_set =
        new TileSet(
            [ 'blue'
            , 'cyan'
            , 'green'
            , 'magenta'
            , 'red'
            , 'yellow'
            ],
            [ 'a'
            , 'b'
            , 'c'
            , 'd'
            , 'e'
            , 'f'
            ]
        );
    var cli_game = new Game(cli_tile_set);
    var cli_error = console.log;

    function cli_play () {
        return cli_game
            .loop(cli_user_turn, cli_error)
            .then(cli_completed);
    }

    return { draw:      cli_draw
           , ask:       cli_ask
           , user_turn: cli_user_turn
           , completed: cli_completed
           , game:      cli_game
           , play:      cli_play
           };
};

module.exports = Cli;
