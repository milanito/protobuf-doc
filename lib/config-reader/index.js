'use strict';

var fs = require('fs-extra');
var Q = require('q');
var YAML = require('yamljs');
var path = require('path');

module.exports = {
    readConfigFile: function(file) {
        var deferred = Q.defer();
        fs.readFile(path.resolve(file), 'utf-8', function(err, data) {
            if (err) {
                deferred.reject(new Error('Config file not found. Please use a correct path or default protobuf-doc.yaml file'));
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
