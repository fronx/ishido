function Board () {
  this.cells = [];

  var y_max = 8;
  var x_max = 12;
  var n_fields = y_max * x_max;

  function flatten_xy (x, y) {
    return (y - 1) * x_max + (x - 1);
  }

  this.at = function (x, y) {
    if ((x >= 1) && (x <= x_max) && (y >= 1) && (y <= y_max))
      return this.cells[flatten_xy(x, y)]
    else
      return null;
  }

  this.set = function (x, y, value) {
    this.cells[flatten_xy(x, y)] = value;
  }

  this.draw = function () {
    for (i = 0; i < n_fields; i++) {
      if ((i > 0) && (i % x_max == 0)) process.stdout.write("\n");
      if (typeof this.cells[i] !== 'undefined')
        process.stdout.write(this.cells[i])
      else
        process.stdout.write('☐');
    }
    process.stdout.write("\n");
  }

  this.neighbours = function (x, y) {
    return [ this.at(x - 1, y)
           , this.at(x + 1, y)
           , this.at(x, y - 1)
           , this.at(x, y + 1)
           ].filter(function (cell) { return cell != null })
  }
}

Colors = []

b = new Board;
b.set( 1, 1, 'a');
b.set(12, 1, 'b');
b.set( 1, 8, 'c');
b.set(12, 8, 'd');
b.set( 1, 2, 'x');
b.draw();

console.log(b.neighbours(1,1))
console.log(b.neighbours(1,2))
console.log(b.neighbours(1,3))
console.log(b.neighbours(1,4))
