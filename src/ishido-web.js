var ishido = require('./ishido');

window.Ishido = function (element) {
    var tile_set = new ishido.TileSet(
            [ 'c1', 'c2', 'c3', 'c4', 'c5', 'c6' ],
            [ 's1', 's2', 's3', 's4', 's5', 's6' ]
        );

    var game = new ishido.Game(tile_set);

    function make_elem (tag, css_class) {
        var elem = document.createElement(tag);
        elem.setAttribute('class', css_class);
        return elem;
    }
    function make_row () {
        return make_elem('div', 'ishido-row');
    }
    function make_cell () {
        return make_elem('div', 'ishido-cell');
    }
    function make_piece (piece) {
        var elem = make_elem('div', 'ishido-piece');
        set_piece(elem, piece);
        return elem;
    }
    function class_color (color) {
        return 'ishido-color-' + color;
    }
    function class_symbol (symbol) {
        return 'ishido-symbol-' + symbol;
    }
    function set_piece (elem, piece) {
        tile_set.colors.forEach(function (color) {
            elem.classList.remove(class_color(color));
        })
        tile_set.symbols.forEach(function (symbol) {
            elem.classList.remove(class_symbol(symbol));
        })
        if (piece instanceof ishido.Piece) {
            [ class_color(piece.color)
            , class_symbol(piece.symbol)
            ].forEach(function (css_class) {
                elem.classList.add(css_class);
            });
        }
    }
    // n starts at 1
    function row_elem(n) {
        return element.children[n - 1];
    }
    function elem_at(x, y) {
        return row_elem(y).children[x - 1];
    }
    function refresh (x, y, board) {
        var elem = elem_at(x, y);
        set_piece(elem, board.at(x, y));
    }
    function initial_render (board) {
        element.innerHTML = '';
        var row;
        board.each_cell(function (cell, x, y) {
            if (x == 1) {
                if (row) element.appendChild(row);
                row = make_row();
            }
            row.appendChild(make_cell(cell));
        });
        element.appendChild(row);
    }
    function completed () {
        console.log('completed.');
    }
    function draw (board, current_piece) {
        initial_render(board);
        board.each_cell(function (cell, x, y) {
            refresh(x, y, board);
        });
    }
    // user_turn :: Int -> Piece -> Board -> Promise Point
    function user_turn (n_turn, piece, board) {
        console.log(board);
        console.log('turn', n_turn);
        console.log('piece', piece);
        draw(board, piece);
        return new ishido.Promise(function (resolve, reject) {
            resolve({ x: 1, y: 1});
        });
    }
    function play () {
        return game
            .loop(user_turn, console.log)
            .then(completed);
    }

    return { play: play };
};
