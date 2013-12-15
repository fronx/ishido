var Util = require('./util');

Matches = (function () {
    var MATCH_CONDITION = {
        '1': [{ color: 1 }, { symbol: 1 }],
        '2': [{ color: 1, symbol: 1 }],
        '3': [{ color: 1, symbol: 2 }, { color: 2, symbol: 1 }],
        '4': [{ color: 2, symbol: 2 }]
    };

    // all :: Piece -> [ Piece ] -> [ [String] ]
    function all (piece, pieces) {
        var matches = pieces.map(function (p) {
            return p.matching(piece);
        });
        return Util.cartesian_product(matches);
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

    // satisfy :: Piece -> [ Piece ] -> Boolean
    function satisfy (piece, pieces) {
        if (pieces.length == 0)
            return false;

        if (pieces.length > 4)
            throw new Error('Something\'s up with "satisfy"');

        var match_condition = MATCH_CONDITION[pieces.length];

        return grouped_counts(piece, pieces).some(function (grouped) {
            return match_condition.some(function (pred_grouped) {
                var satisfied = true;
                [ 'color', 'symbol' ].forEach(function (match) {
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
           , satisfy:        satisfy
           };
})();

module.exports = Matches;
