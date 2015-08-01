'use strict';

var fs = require('fs-extra');
var Q = require('q');
var path = require('path');
var ncp = require('ncp').ncp;
ncp.limit = 16;

module.exports = {
    rmDocFolder: function(data) {
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
        var deferred = Q.defer();
        ncp(path.resolve([__dirname, '../..', 'templates'].join('/')), data.dest, function(err) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(data);
        })
        return deferred.promise;
    }
}
