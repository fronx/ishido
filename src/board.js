var Piece = require('./piece');

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

module.exports = Board;
