
'use strict';

var configReader = require('./config-reader');
var fileReader = require('./files-reader');
var tokenizer = require('./tokenizer');
var parser = require('./parser');
var commentsExtractor = require('./comment-extractor');
var dataHandler = require('./data-handler');
var fileHandler = require('./file-handler');
var logger = require('./logger');
var connect = require('./connect-step');

module.exports = {
    withConfigFile: function(argv) {
        if (argv.verbose) {
            logger.headerInfo(argv.path);
            logger.updateSteps(13);
        }
        configReader.readConfigFile(argv)
        .then(configReader.parseYAML)
        .then(fileReader.readSrc)
        .then(fileReader.readFiles)
        .then(parser.tokenizeItems)
        .then(parser.parseItems)
        .then(commentsExtractor.extract)
        .then(dataHandler.transformData)
        .then(fileHandler.rmDocFolder)
        .then(fileHandler.createDocFolder)
        .then(fileHandler.copyTemplates)
        .then(fileReader.readTemplate)
        .then(dataHandler.replaceInString)
        .then(connect.connectMaybe)
        .catch(function(err) {
            console.log(err);
        })
        .done();
    },
    withConfigObject: function(config) {
        if (config.verbose) {
            logger.headerInfo();
            logger.updateSteps(11);
        }
        fileReader.readSrc(config)
        .then(fileReader.readFiles)
        .then(parser.tokenizeItems)
        .then(parser.parseItems)
        .then(commentsExtractor.extract)
        .then(dataHandler.transformData)
        .then(fileHandler.rmDocFolder)
        .then(fileHandler.createDocFolder)
        .then(fileHandler.copyTemplates)
        .then(fileReader.readTemplate)
        .then(dataHandler.replaceInString)
        .catch(function(err) {
            console.log(err);
        })
        .done();
    }
}
