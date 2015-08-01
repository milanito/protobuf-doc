'use strict';

var Q = require('q');
var _ = require('lodash');
var Lang = require('../lang');

var Tokenizer = function(file) {
    this.source = file;
    this.index = 0;
    this.line = 1;
    this.stack = [];
    this._stringOpen = null;
};

Tokenizer.prototype.next = function() {
    if (this.stack.length > 0)
        return this.stack.shift();
    if (this.index >= this.source.length)
        return null;
    if (this._stringOpen !== null)
        return this._readString();

    var repeat,
        prev,
        next;
    do {
        repeat = false;
        if (!this._stripWP(next)) {
            return null;
        }
        var strip = this._stripComments(repeat);
        if (strip != true) {
            return strip;
        }
    } while (repeat);

    if (this.index === this.source.length)
        return null;
    // Read the next token
    var end = this.index;
    Lang.DELIM.lastIndex = 0;
    var delim = Lang.DELIM.test(this.source.charAt(end++));
    if (!delim)
        while (end < this.source.length && !Lang.DELIM.test(this.source.charAt(end)))
            ++end;
    var token = this.source.substring(this.index, this.index = end);
    if (token === '"' || token === '\'')
        this._stringOpen = token;
    return token;
};

Tokenizer.prototype._stripWP = function(next) {
    // Strip white spaces
    while (Lang.WHITESPACE.test(next = this.source.charAt(this.index))) {
        if (next === '\n')
            ++this.line;
        if (++this.index === this.source.length)
            return false;
    }
    return true;
};

Tokenizer.prototype._stripComments = function(repeat) {
    // Strip comments
    if (this.source.charAt(this.index) === '/') {
        ++this.index;
        if (this.source.charAt(this.index) === '/') { // Line
            while (this.source.charAt(++this.index) !== '\n')
                if (this.index == this.source.length)
                    return null;
            ++this.index;
            ++this.line;
            repeat = true;
        } else if ((next = this.source.charAt(this.index)) === '*') { /* Block */
            do {
                if (next === '\n')
                    ++this.line;
                if (++this.index === this.source.length)
                    return null;
                prev = next;
                next = this.source.charAt(this.index);
            } while (prev !== '*' || next !== '/');
            ++this.index;
            repeat = true;
        } else
            return '/';
    }
    return true;
};

Tokenizer.prototype._readString = function() {
    var re = this._stringOpen === '"' ? Lang.STRING_DQ : Lang.STRING_SQ;
    re.lastIndex = this.index - 1; // Include the open quote
    var match = re.exec(this.source);
    if (!match)
        throw Error('unterminated string');
    this.index = re.lastIndex;
    this.stack.push(this._stringOpen);
    this._stringOpen = null;
    return match[1];
};

Tokenizer.prototype.peek = function() {
    if (this.stack.length === 0) {
        var token = this.next();
        if (token === null)
            return null;
        this.stack.push(token);
    }
    return this.stack[0];
};

Tokenizer.prototype.skip = function(expected) {
    var actual = this.next();
    if (actual !== expected)
        throw Error(['illegal:', actual, ', expected:', expected].join(' '));
};


Tokenizer.prototype.omit = function(expected) {
    if (this.peek() === expected) {
        this.next();
        return true;
    }
    return false;
};

Tokenizer.prototype.toString = function() {
    return ['Tokenizer (', this.index, '/', this.source.length, ' at line ', this.line, ')'].join('');
};

module.exports = exports = Tokenizer;
