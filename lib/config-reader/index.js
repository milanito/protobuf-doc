'use strict';

var fs = require('fs-extra');
var Q = require('q');
var YAML = require('yamljs');
var path = require('path');

var logger = require('../logger');

module.exports = {
    readConfigFile: function(data) {
        if (data.verbose) {
            logger.displayStep('Reading configuration File');
        }
        var deferred = Q.defer();
        fs.readFile(path.resolve(data.config), 'utf-8', function(err, content) {
            if (err) {
                deferred.reject(new Error('Config file not found. Please use a correct path or default protobuf-doc.yaml file'));
            }
            data.content = content;
            deferred.resolve(data);
        })
        return deferred.promise;
    },

    parseYAML: function(data) {
        return Q.fcall(function() {
            if (data.verbose) {
                logger.displayStep('Parsing YAML File');
            }
            var config = YAML.parse(data.content);
            config.verbose = data.verbose;
            config.theme = data.theme;
            config.connect = data.connect;
            return config;
        });
    }
}
