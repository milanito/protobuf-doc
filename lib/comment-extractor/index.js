'use strict';

var Q = require('q');
var _ = require('lodash');

module.exports = {
    extract: function(data) {
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
