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

    // satisfies :: Piece -> [ Piece ] -> Boolean
    function satisfies (piece, pieces) {
        if (pieces.length == 0)
            return false;

        if (pieces.length > 4){
            throw new Error('Something\'s up with "satisfies"');
        }

        var predicates = MATCH_CONDITION[pieces.length];

        return grouped_counts(piece, pieces).some(function (grouped) {
            return predicates.some(function (pred_grouped) {
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
           , satisfies:      satisfies
           };
})();

module.exports = Matches;
