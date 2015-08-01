#!/usr/bin/env node

'use strict';

var configReader = require('../lib/config-reader');
var fileReader = require('../lib/files-reader');
var tokenizer = require('../lib/tokenizer');
var parser = require('../lib/parser');
var commentsExtractor = require('../lib/comment-extractor');
var dataHandler = require('../lib/data-handler');
var fileHandler = require('../lib/file-handler');

configReader.readConfigFile()
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
