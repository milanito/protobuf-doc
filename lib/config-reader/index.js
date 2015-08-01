'use strict';

var fs = require('fs-extra');
var Q = require('q');
var YAML = require('yamljs');

module.exports = {
    readConfigFile: function() {
        var deferred = Q.defer();
        fs.readFile('./protobuf-doc.yaml', 'utf-8', function(err, data) {
            if (err) {
                deferred.reject(new Error('Config file not found'));
            }
            deferred.resolve(data);
        })
        return deferred.promise;
    },

    parseYAML: function(data) {
        return Q.fcall(function() {
            return YAML.parse(data);
        });
    }
}
