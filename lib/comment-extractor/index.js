'use strict';

var Q = require('q');
var _ = require('lodash');
var logger = require('../logger');

module.exports = {
    extract: function(data) {
        if (data[0].verbose) {
            logger.displayStep('Extracting Comments');
        }
        return Q.all(_.map(data, function(item) {
            return (function() {
                return Q.fcall(function() {
                    var re = /(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\w\s\']*)|(\<![\-\-\s\w\>\/]*\>)/g
                    item.parsed.comments = item.data.match(re);
                    return item;
                });
            })();
        }));
    }
};
