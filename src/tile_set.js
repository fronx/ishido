function all_uniq (array) {
    // if item exists in the rest of the array: fail
    return !array.some(function (item, index) {
        var rest = array.slice(index + 1, array.length);
        return rest.indexOf(item) != -1;
    });
}

function TileSet (colors, symbols) {
    if ((colors.length  != 6) ||
        (symbols.length != 6) ||
        (!all_uniq(colors)) ||
        (!all_uniq(symbols))) {
        throw new Error('TileSet expects 6 unique colors and 6 unique symbols');
    }

    this.colors  = colors;
    this.symbols = symbols;
}

module.exports = TileSet;
