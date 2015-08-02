'use strict';

var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var Q = require('q');

var misc = require('../misc');

module.exports = {
    connectMaybe: function(data) {
        return Q.fcall(function() {
            if (data.connect) {
                console.log('===================');
                console.log([
                    'Starting up Documentation server,',
                    ' serving ',
                    data.dest,
                    ' on: http://0.0.0.0:',
                    misc.DEFAULT_PORT
                ].join(''))
                var serve = serveStatic(data.dest);
                http.createServer(function(req, res) {
                    var done = finalhandler(req, res);
                    serve(req, res, done);
                })
                .listen(misc.DEFAULT_PORT);
            } else {
                return data;
            }
        });
    }
}
