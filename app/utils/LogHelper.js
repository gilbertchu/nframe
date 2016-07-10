/*
 *	Module
 *	Name: LogHelper
 *	Export: Constructor function
 *	Description: Provides wrapper functions for default console
 *
 *	Example Usage
 *	Import (as new instance):
 *		const log = new require("LogHelper.js")(name);
 *	Import (as constructor):
 *		const LogHelper = require("LogHelper.js");
 *		const log = new LogHelper(name);
 */

var LogHelper = function(name) {
	this.name = name;
};

//Returns utc datetime string
LogHelper.prototype.utc = function() {
	var d = new Date();
	return d.toUTCString();
};

//Log a formatted header with optional placeholder text (for better visibility/searching)
LogHelper.prototype.header = function(placeholderText) {
	if (typeof placeholderText === "undefined") placeholderText = "DEBUG START";
	console.log("\n\n\n ***** <"+placeholderText.toString()+"> ["+this.name+"] ("+this.utc()+") ***** \n");
};

//Log with additional formatting
LogHelper.prototype.log = function() {
	var prefix = "> ["+this.name+"] ("+this.utc()+") - LOG:";
	var args = [prefix];
	for (var i = 0; i < arguments.length; ++i) {
		args[i+1] = arguments[i];
	}
	console.log.apply(null, args);
};

//Warn with additional formatting
LogHelper.prototype.warn = function() {
	var prefix = "* ["+this.name+"] ("+this.utc()+") - WARN:";
	var args = [prefix];
	for (var i = 0; i < arguments.length; ++i) {
		args[i+1] = arguments[i];
	}
	console.warn.apply(null, args);
};

//Error with additional formatting
LogHelper.prototype.error = function() {
	var prefix = "! ["+this.name+"] ("+this.utc()+") - ERROR:";
	var args = [prefix];
	for (var i = 0; i < arguments.length; ++i) {
		args[i+1] = arguments[i];
	}
	console.error.apply(null, args);
};

module.exports = LogHelper;