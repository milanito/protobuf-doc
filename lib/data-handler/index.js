'use strict';

var Q = require('q');
var _ = require('lodash');
var fs = require('fs-extra');
var path = require('path');

module.exports = {
    transformData: function(data) {
        return {
            src: data[0].src,
            dest: data[0].dest,
            data: _.map(data, function(item) {
                return item.parsed;
            })
        };
    },
    replaceInString: function(data) {
        var deferred = Q.defer();
        var res = data.template.replace('{%data%}', JSON.stringify(data.data));
        delete data.template;
        fs.outputFile(path.resolve([data.dest,'scripts', 'app.js'].join('/')), res, function(err) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(data);
        });
        return deferred.promise;
    }
};
