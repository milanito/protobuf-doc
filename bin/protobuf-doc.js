#!/usr/bin/env node

var cliArgs = require('command-line-args');

var protobufdoc = require('../lib/protobuf-doc.js');

var misc = require('../lib/misc');

// Define Options
var cli = cliArgs([
    { name: 'verbose', type: Boolean, alias: 'v', description: 'Display informations' },
    { name: 'theme', type: String, alias: 't', description: 'Theme to use' },
    { name: 'config', type: String, alias: 'c', description: 'Config file' },
    { name: 'help', type: Boolean, alias: 'h', description: 'Print usage instructions' },
]);

try {
    var usage = cli.getUsage({
        header: 'Protocol Buffer Documentation Generator',
        footer: 'For more information, visit https://github.com/milanito/protobuf-doc'
    });
    var argv = cli.parse();

    argv.verbose = argv.verbose || false;
    argv.theme = argv.theme || misc.DEFAULT_THEME;

    if (argv.help) {
        console.log(usage);
    } else if (argv.config) {
        protobufdoc.withConfigFile(argv.config, argv.verbose, argv.theme);
    } else {
        protobufdoc.withConfigFile(misc.DEFAULT_CONFIG, argv.verbose, argv.theme);
    }
} catch(e) {
    console.log(e)
    console.log('Error: Unexpected Option');
    console.log(usage);
}
