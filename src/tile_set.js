Util = require('./util');

function TileSet (colors, symbols) {
    if ((colors.length  != 6) ||
        (symbols.length != 6) ||
        (!Util.all_uniq(colors)) ||
        (!Util.all_uniq(symbols))) {
        throw new Error('TileSet expects 6 unique colors and 6 unique symbols');
    }

    this.colors  = colors;
    this.symbols = symbols;
}

module.exports = TileSet;
