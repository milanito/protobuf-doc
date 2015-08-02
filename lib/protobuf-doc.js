
'use strict';

var configReader = require('./config-reader');
var fileReader = require('./files-reader');
var tokenizer = require('./tokenizer');
var parser = require('./parser');
var commentsExtractor = require('./comment-extractor');
var dataHandler = require('./data-handler');
var fileHandler = require('./file-handler');
var logger = require('./logger');

module.exports = {
    withConfigFile: function(path, verbose, theme) {
        if (verbose) {
            logger.headerInfo(path);
            logger.updateSteps(13);
        }
        configReader.readConfigFile({
            path: path,
            verbose: verbose,
            theme: theme
        })
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
        .catch(function(err) {
            console.log(err);
        })
        .done();
    },
    withConfigObject: function(config, verbose, theme) {
        if (verbose) {
            logger.headerInfo();
            logger.updateSteps(11);
        }
        config.verbose = verbose;
        config.theme = theme;
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
