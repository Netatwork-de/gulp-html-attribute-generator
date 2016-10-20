'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var htmlParse = require('parse5');
var path = require('path');

var PluginError = gutil.PluginError;
var File = gutil.File;

var TreeAdapter = htmlParse.treeAdapters.default;

module.exports = function (rules) {

    if(!rules) rules = []

    function bufferContents(file, enc, cb) {

        if (file.isNull()) {
            cb();
            return;
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-html-attribute-generator', 'Streaming not supported'));
            cb();
            return;
        }

        if(rules && rules.length > 0) {
            var html = htmlParse.parseFragment(file.contents.toString());
            if (html) {
                processRules(html);
                file.contents = new Buffer(htmlParse.serialize(html));
            }
        }

        this.push(file);

        cb();
    }

    function processRules(element) {
        rules.forEach(rule => {
            // Check tag filters
            if(rule.tagFilter && rule.tagFilter.length > 0) {
                if(!rule.tagFilter.some(tag => tag === element.name)) return;
            }

            // Check attribute filters   
            if(rule.attributeFilter && rule.attributeFilter.length > 0) {
                if(!rule.attributeFilter.some(attrName => element.attrs && element.attrs.some(attr => attr.name === attrName))) return;
            }

            // Check if exists and override is enabled
            let targetAttribute = getAttribute(element, rule.targetAttribute);
            if(targetAttribute && !rule.overwrite) return;

            var valueParameters = [element];
            if(rule.readAttributes && rule.readAttributes.length > 0) {
                rule.readAttributes.forEach(x => {
                    var attr = getAttribute(element,x);
                    valueParameters.push(attr?attr.value:null);
                });
            }

            // Get new attribute value
            let newValue = (typeof rule.value === "function") ? rule.value.apply(rule,valueParameters) : rule.value;
            if(!newValue) return;   

            // Set attribute value
            if(targetAttribute) {
                targetAttribute.value = newValue;
            }
            else {
                element.attrs.push({ name: rule.targetAttribute, value: newValue });
            }
        });
                 
        // Process sub elements
        if (element.childNodes && element.childNodes.length > 0) {
            element.childNodes.forEach((x) => processRules(x));
        }
        else if (element.content) {
            processRules(element.content);
        }
    }

    function getAttribute(element, name) {
        if (!TreeAdapter.isElementNode(element) || !element.attrs) return null;

        return element.attrs.find((x) => x.name == name);
    }

    function endStream(cb) {
        cb();
    }

    return through.obj(bufferContents, endStream);
}