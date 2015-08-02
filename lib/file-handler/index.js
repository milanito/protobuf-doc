'use strict';

var fs = require('fs-extra');
var Q = require('q');
var path = require('path');
var ncp = require('ncp').ncp;
var logger = require('../logger');
ncp.limit = 16;

module.exports = {
    rmDocFolder: function(data) {
        if (data.verbose) {
            logger.displayStep('Removing existing Documentation Folder');
        }
        var deferred = Q.defer();
        fs.remove(data.dest, function(err) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(data);
        });
        return deferred.promise;
    },
    createDocFolder: function(data) {
        if (data.verbose) {
            logger.displayStep('Creating new Documentation Folder');
        }
        var deferred = Q.defer();
        fs.ensureDir(data.dest, function(err) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(data);
        })
        return deferred.promise;
    },
    copyTemplates: function(data) {
        if (data.verbose) {
            logger.displayStep('Copying Templates');
        }
        var deferred = Q.defer();
        ncp(path.resolve([__dirname, '../..', 'templates', data.theme].join('/')), data.dest, function(err) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(data);
        })
        return deferred.promise;
    }
}
