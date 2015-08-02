'use strict';

var Q = require('q');
var _ = require('lodash');
var Tokenizer = require('../tokenizer');
var Lang = require('../lang');
var logger = require('../logger');

function mkId(value, mayBeNegative) {
    var id = -1,
        sign = 1;
    if (value.charAt(0) == '-') {
        sign = -1;
        value = value.substring(1);
    }
    if (Lang.NUMBER_DEC.test(value))
        id = parseInt(value);
    else if (Lang.NUMBER_HEX.test(value))
        id = parseInt(value.substring(2), 16);
    else if (Lang.NUMBER_OCT.test(value))
        id = parseInt(value.substring(1), 8);
    else
        throw Error("illegal id value: " + (sign < 0 ? '-' : '') + value);
    id = (sign*id)|0; // Force to 32bit
    if (!mayBeNegative && id < 0)
        throw Error("illegal id value: " + (sign < 0 ? '-' : '') + value);
    return id;
};

function mkNumber(val) {
    var sign = 1;
    if (val.charAt(0) == '-') {
        sign = -1;
        val = val.substring(1);
    }
    if (Lang.NUMBER_DEC.test(val))
        return sign * parseInt(val, 10);
    else if (Lang.NUMBER_HEX.test(val))
        return sign * parseInt(val.substring(2), 16);
    else if (Lang.NUMBER_OCT.test(val))
        return sign * parseInt(val.substring(1), 8);
    else if (val === 'inf')
        return sign * Infinity;
    else if (val === 'nan')
        return NaN;
    else if (Lang.NUMBER_FLT.test(val))
        return sign * parseFloat(val);
    throw Error("illegal number value: " + (sign < 0 ? '-' : '') + val);
};

var Parser = function(tokenizer) {
    this.tn = tokenizer;
};

Parser.prototype._parseMessage = function(parent, fld) {
    var isGroup = !!fld,
        token = this.tn.next();
    var msg = {
        'name': '',
        'fields': [],
        'enums': [],
        'messages': [],
        'options': {},
        'oneofs': {}
        // 'extensions': undefined
    };
    if (!Lang.NAME.test(token))
        throw Error('illegal '+(isGroup ? 'group' : 'message')+' name: '+token);
    msg['name'] = token;
    if (isGroup) {
        this.tn.skip('=');
        fld['id'] = mkId(this.tn.next());
        msg['isGroup'] = true;
    }
    token = this.tn.peek();
    if (token === '[' && fld)
        this._parseFieldOptions(fld);
    this.tn.skip('{');
    while ((token = this.tn.next()) !== '}') {
        if (Lang.RULE.test(token))
            this._parseMessageField(msg, token);
        else if (token === 'oneof')
            this._parseMessageOneOf(msg);
        else if (token === 'enum')
            this._parseEnum(msg);
        else if (token === 'message')
            this._parseMessage(msg);
        else if (token === 'option')
            this._parseOption(msg);
        else if (token === 'extensions')
            this._parseExtensions(msg);
        else if (token === 'extend')
            this._parseExtend(msg);
        else if (Lang.TYPEREF.test(token))
            this._parseMessageField(msg, 'optional', token);
        else
            throw Error('illegal message token: '+token);
    }
    this.tn.omit(';');
    parent['messages'].push(msg);
};

Parser.prototype._parseMessageField = function(msg, rule, type) {
    if (!Lang.RULE.test(rule))
        throw Error('illegal message field rule: '+rule);
    var fld = {
        'rule': rule,
        'type': '',
        'name': '',
        'options': {},
        'id': 0
    };
    var token;
    if (rule === 'map') {
        if (type)
            throw Error('illegal type: ' + type);
        this.tn.skip('<');
        token = this.tn.next();
        if (!Lang.TYPE.test(token) && !Lang.TYPEREF.test(token))
            throw Error('illegal message field type: ' + token);
        fld['keytype'] = token;
        this.tn.skip(',');
        token = this.tn.next();
        if (!Lang.TYPE.test(token) && !Lang.TYPEREF.test(token))
            throw Error('illegal message field: ' + token);
        fld['type'] = token;
        this.tn.skip('>');
        token = this.tn.next();
        if (!Lang.NAME.test(token))
            throw Error('illegal message field name: ' + token);
        fld['name'] = token;
        this.tn.skip('=');
        fld['id'] = mkId(this.tn.next());
        token = this.tn.peek();
        if (token === '[')
            this._parseFieldOptions(fld);
        this.tn.skip(';');
    } else {
        var type = typeof type !== 'undefined' ? type : this.tn.next();
        if (type === 'group') {
            var grp = this._parseMessage(msg, fld);
            if (!/^[A-Z]/.test(grp['name']))
                throw Error('illegal group name: '+grp['name']);
            fld['type'] = grp['name'];
            fld['name'] = grp['name'].toLowerCase();
            this.tn.omit(';');
        } else {
            if (!Lang.TYPE.test(type) && !Lang.TYPEREF.test(type))
                throw Error('illegal message field type: ' + type);
            fld['type'] = type;
            token = this.tn.next();
            if (!Lang.NAME.test(token))
                throw Error('illegal message field name: ' + token);
            fld['name'] = token;
            this.tn.skip('=');
            fld['id'] = mkId(this.tn.next());
            token = this.tn.peek();
            if (token === '[')
                this._parseFieldOptions(fld);
            this.tn.skip(';');
        }
    }
    msg['fields'].push(fld);
    return fld;
};

Parser.prototype._parseMessageOneOf = function(msg) {
    var token = this.tn.next();
    if (!Lang.NAME.test(token))
        throw Error('illegal oneof name: '+token);
    var name = token,
        fld;
    var fields = [];
    this.tn.skip('{');
    while ((token = this.tn.next()) !== '}') {
        fld = this._parseMessageField(msg, 'optional', token);
        fld['oneof'] = name;
        fields.push(fld['id']);
    }
    this.tn.omit(';');
    msg['oneofs'][name] = fields;
};

Parser.prototype._parseFieldOptions = function(fld) {
    this.tn.skip('[');
    var token,
        first = true;
    while ((token = this.tn.peek()) !== ']') {
        if (!first)
            this.tn.skip(',');
        this._parseOption(fld, true);
        first = false;
    }
    this.tn.next();
};

Parser.prototype._parseEnum = function(msg) {
    var enm = {
        'name': '',
        'values': [],
        'options': {}
    };
    var token = this.tn.next();
    if (!Lang.NAME.test(token))
        throw Error('illegal name: '+token);
    enm['name'] = token;
    this.tn.skip('{');
    while ((token = this.tn.next()) !== '}') {
        if (token === 'option')
            this._parseOption(enm);
        else {
            if (!Lang.NAME.test(token))
                throw Error('illegal name: '+token);
            this.tn.skip('=');
            var val = {
                'name': token,
                'id': mkId(this.tn.next(), true)
            };
            token = this.tn.peek();
            if (token === '[')
                this._parseFieldOptions({ 'options': {} });
            this.tn.skip(';');
            enm['values'].push(val);
        }
    }
    this.tn.omit(';');
    msg['enums'].push(enm);
};

Parser.prototype._parseExtensions = function(msg) {
    var token = this.tn.next(),
        range = [];
    if (token === 'min')
        range.push(ProtoBuf.ID_MIN);
    else if (token === 'max')
        range.push(ProtoBuf.ID_MAX);
    else
        range.push(mkNumber(token));
    this.tn.skip('to');
    token = this.tn.next();
    if (token === 'min')
        range.push(ProtoBuf.ID_MIN);
    else if (token === 'max')
        range.push(ProtoBuf.ID_MAX);
    else
        range.push(mkNumber(token));
    this.tn.skip(';');
    msg['extensions'] = range;
};

Parser.prototype._parseExtend = function(parent) {
    var token = this.tn.next();
    if (!Lang.TYPEREF.test(token))
        throw Error('illegal extend reference: '+token);
    var ext = {
        'ref': token,
        'fields': []
    };
    this.tn.skip('{');
    while ((token = this.tn.next()) !== '}') {
        if (Lang.RULE.test(token))
            this._parseMessageField(ext, token);
        else if (Lang.TYPEREF.test(token))
            this._parseMessageField(ext, 'optional', token);
        else
            throw Error('illegal extend token: '+token);
    }
    this.tn.omit(';');
    parent['messages'].push(ext);
    return ext;
};

Parser.prototype.parse = function() {
    var topLevel = {
        'name': '[ROOT]', // temporary
        'package': null,
        'messages': [],
        'enums': [],
        'imports': [],
        'options': {},
        'services': [],
        'comments': []
        // "syntax": undefined
    };

    var token,
        head = true;
    try {
        while (token = this.tn.next()) {
            switch (token) {
                case 'package':
                    if (!head || topLevel['package'] !== null)
                        throw Error('unexpected package');
                    token = this.tn.next();
                    if (!Lang.TYPEREF.test(token))
                        throw Error('illegal package name: ' + token);
                    this.tn.skip(';');
                    topLevel['package'] = token;
                    break;
                case 'import':
                    if (!head)
                        throw Error('unexpected import');
                    token = this.tn.peek();
                    if (token === 'public') // ignored
                        this.tn.next();
                    token = this._readString();
                    this.tn.skip(';');
                    topLevel['imports'].push(token);
                    break;
                case 'syntax':
                    if (!head)
                        throw Error('unexpected syntax');
                    this.tn.skip('=');
                    topLevel['syntax'] = this._readString();
                    this.tn.skip(';');
                    break;
                case 'message':
                    this._parseMessage(topLevel, null);
                    head = false;
                    break;
                case 'enum':
                    this._parseEnum(topLevel);
                    head = false;
                    break;
                case 'option':
                    this._parseOption(topLevel);
                    break;
                case 'service':
                    this._parseService(topLevel);
                    break;
                case 'extend':
                    this._parseExtend(topLevel);
                    break;
                default:
                    throw Error('unexpected \'' + token + '\'');
            }
        }
    } catch (e) {
        e.message = 'Parse error at line '+this.tn.line+': ' + e.message;
        throw e;
    }
    delete topLevel['name'];
    return topLevel;
};

Parser.prototype.toString = function() {
    return ['Parser at line', this.tn.line].join(' ');
};

module.exports = {
    parseItems: function(items) {
        if (items[0].verbose) {
            logger.displayStep('Parsing Items');
        }
        return Q.all(_.map(items, function(item) {
            return (function() {
                return Q.fcall(function() {
                    var parser = new Parser(item.tn);
                    var parsed = parser.parse();
                    return {
                        src: item.src,
                        dest: item.dest,
                        file: item.file,
                        data: item.data,
                        tn: item.tn,
                        parsed: parsed,
                        verbose: items[0].verbose,
                        theme: items[0].theme
                    };
                });
            })();
        }));
    },
    tokenizeItems: function(data) {
        if (data[0].verbose) {
            logger.displayStep('Extracting Tokens');
        }
        return Q.all(_.map(data, function(item) {
            return (function() {
                return Q.fcall(function() {
                    var tn = new Tokenizer(item.data);
                    return {
                        src: item.src,
                        dest: item.dest,
                        file: item.file,
                        data: item.data,
                        tn: tn,
                        verbose: item.verbose,
                        theme: item.theme
                    };
                });
            })()
        }));
    }
};
