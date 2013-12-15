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

module.exports = Piece;
