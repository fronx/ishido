var Cli = require('./src/cli');

function main (dependencies) {
    Cli(dependencies).play();
}

if (require.main === module) {
    main({
        readline: require('readline')
    });
};
