function Board () {
  this.cells = [];

  var y_max = 8;
  var x_max = 12;
  var n_fields = y_max * x_max;

  function flatten_xy (x, y) {
    return (y - 1) * x_max + (x - 1);
  }
  this.at = function (x, y) {
    return cells[flatten_xy(x, y)];
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
  }
}

b = new Board;
b.set( 1, 1, 'a');
b.set(12, 1, 'b');
b.set( 1, 8, 'c');
b.set(12, 8, 'd');
b.draw();
