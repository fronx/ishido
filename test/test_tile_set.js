var test    = require('tape');
var TileSet = require('../src/tile_set');

test('colors must be unique', function (t) {
  t.throws(function () {
    new TileSet(
      ['c1', 'c2', 'c3', 'c4', 'c5', 'c5'],
      ['s1', 's2', 's3', 's4', 's5', 's6']
    );
  });
  t.end();
});

test('symbols must be unique', function (t) {
  t.throws(function () {
    new TileSet(
      ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
      ['s1', 's2', 's3', 's4', 's5', 's5']
    );
  });
  t.end();
});

test('there must be 6 colors', function (t) {
  t.throws(function () {
    new TileSet(
      ['c1', 'c2', 'c3', 'c4', 'c5'],
      ['s1', 's2', 's3', 's4', 's5', 's5']
    );
  });
  t.end();
});

test('there must be 6 symbols', function (t) {
  t.throws(function () {
    new TileSet(
      ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
      ['s1', 's2', 's3', 's4', 's5']
    );
  });
  t.end();
});

test('it is possible to construct a valid instance', function (t) {
  t.doesNotThrow(function () {
    new TileSet(
      ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
      ['s1', 's2', 's3', 's4', 's5', 's6']
    );
  });
  t.end();
});
