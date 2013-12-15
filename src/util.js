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

function all_uniq (array) {
    // if item exists in the rest of the array: fail
    return !array.some(function (item, index) {
        var rest = array.slice(index + 1, array.length);
        return rest.indexOf(item) != -1;
    });
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

module.exports.shuffle           = shuffle;
module.exports.all_uniq          = all_uniq;
module.exports.cartesian_product = cartesian_product;
