#! /usr/bin/env node

if (require.main === module) {
    var cli = require('../src/cli');
    cli().play();
} else {
    throw new Error('run via: ./bin/ishido_cli.js');
}
