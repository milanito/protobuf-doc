'use strict';

var fs = require('fs-extra');
var Q = require('q');
var _ = require('lodash');
var path = require('path');
var logger = require('../logger');

module.exports = {
    readSrc: function(config) {
        if (config.verbose) {
            logger.displayStep('Reading Source Directory');
        }
        var deferred = Q.defer();
        fs.readdir(config.src, function(err, files) {
            if (err) {
                deferred.reject(err);
            }
            config.files = _.filter(files, function(file) {
                var re = /^[a-z\-0-9]*\.proto$/;
                return re.exec(file);
            });
            if (config.files.length == 0) {
                deferred.reject(new Error('No schema Files where found'));
            }
            deferred.resolve(config);
        })
        return deferred.promise;
    },
    readFiles: function(config) {
        if (config.verbose) {
            logger.displayStep('Reading Files');
        }
        return Q.all(_.map(config.files, function(file) {
            return (function() {
                var deferred = Q.defer();
                fs.readFile(path.resolve([config.src, file].join('/')), 'utf8', function(err, data) {
                    if (err) {
                        deferred.reject(err);
                    }
                    deferred.resolve({
                        src: config.src,
                        dest: config.dest,
                        file: file,
                        data: data,
                        verbose: config.verbose,
                        theme: config.theme,
                        connect: config.connect
                    });
                });
                return deferred.promise;
            })();
        }));
    },
    readTemplate: function(data) {
        if (data.verbose) {
            logger.displayStep('Reading Templates');
        }
        var deferred = Q.defer();
        fs.readFile(path.resolve([data.dest, 'scripts', 'app.js'].join('/')), 'utf-8', function(err, template) {
            if (err) {
                deferred.reject(err);
            }
            data.template = template
            deferred.resolve(data);
        });
        return deferred.promise
    }
};
