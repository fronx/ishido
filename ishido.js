var Game = require('./src/game');
var Cli = require('./src/cli');

function main (dependencies) {
    var cli = Cli(dependencies);
    (new Game)
        .loop(cli.user_turn, console.log)
        .then(cli.completed);
}

if (require.main === module) {
    main({
        colors:   require('colors'),
        readline: require('readline')
    });
};
