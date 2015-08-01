#!/usr/bin/env node

var DEFAULT_CONFIG = './protobuf-doc.yaml';

var cliArgs = require("command-line-args");

var protobufdoc = require('../lib/protobuf-doc.js');

// Define Options
var cli = cliArgs([
    { name: 'config', type: String, alias: 'c', description: 'Config file' },
    { name: 'help', type: Boolean, alias: 'h', description: 'Print usage instructions' },
]);

try {
    var usage = cli.getUsage({
        header: 'Protocol Buffer Documentation Generator',
        footer: 'For more information, visit https://github.com/milanito/protobuf-doc'
    });
    var argv = cli.parse();

    if (argv.help) {
        console.log(usage);
    } else if (argv.config) {
        protobufdoc.withConfigFile(argv.config);
    } else {
        protobufdoc.withConfigFile(DEFAULT_CONFIG);
    }
} catch(e) {
    console.log(e)
    console.log('Error: Unexpected Option');
    console.log(usage);
}
