'use strict';

var console = require('better-console');

var misc = require('../misc');

var loggingData = {
    step: 0,
    total: 0
};

module.exports = {
    updateSteps: function(steps) {
        loggingData.total = steps;
    },
    headerInfo: function(path) {
        console.log('============================================================');
        console.log('Protocol Buffer Documentation Generator');
        console.log(['Version:', misc.VERSION].join((' ')));
        if (typeof path == 'string' && path == misc.DEFAULT_CONFIG) {
            console.info(['Using Default File', misc.DEFAULT_CONFIG].join(': '));
        } else if (typeof path == 'string') {
            console.info(['Using Custom File', path].join(': '));
        } else {
            console.info('Using Javascript Object');
        }
        console.log('============================================================');
    },
    displayStep: function(title) {
        console.info(['[', ++loggingData.step, '/', loggingData.total, ']:', title].join(''))
    }
}
