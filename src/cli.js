var Promise = require('promise');
var Piece = require('./piece');

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

module.exports = Cli;
