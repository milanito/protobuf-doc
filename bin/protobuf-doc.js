#!/usr/bin/env node

var cliArgs = require('command-line-args');

var protobufdoc = require('../lib/protobuf-doc.js');

var misc = require('../lib/misc');

// Define Options
var cli = cliArgs([
    { name: 'verbose', type: Boolean, alias: 'v', description: 'Display informations' },
    { name: 'theme', type: String, alias: 't', description: 'Theme to use' },
    { name: 'config', type: String, alias: 'f', description: 'Config file' },
    { name: 'connect', type: Boolean, alias: 'c', description: 'Open Server' },
    { name: 'help', type: Boolean, alias: 'h', description: 'Print usage instructions' },
]);

try {
    var usage = cli.getUsage({
        header: 'Protocol Buffer Documentation Generator',
        footer: 'For more information, visit https://github.com/milanito/protobuf-doc'
    });
    var argv = cli.parse();

    argv.verbose = argv.verbose || false;
    argv.connect = argv.connect || false;
    argv.theme = argv.theme || misc.DEFAULT_THEME;
    argv.config = argv.config || misc.DEFAULT_CONFIG;

    if (argv.help) {
        console.log(usage);
    } else {
        protobufdoc.withConfigFile(argv);
    }
} catch(e) {
    console.log(e)
    console.log('Error: Unexpected Option');
    console.log(usage);
}
