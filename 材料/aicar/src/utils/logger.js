"use strict";

/**
 * @description log打印封装类 logger.d("");
 * @author junli
 * @since 1
 * @public
 * @example
 * const logger = require("../utils/logger").getLogger("Interface");
 * logger.i(" test logger ");
 */

const GLOBAL_TAG = "AiCarApp";

/* const VERBOSE = 2; */
const DEBUG = 3;
const INFO = 4;
const WARN = 5;
const ERROR = 6;
/* const ASSERT = 7; */

var currentLvl = DEBUG;

function isLoggable(lvl) {
    return lvl >= currentLvl;
}

/*
 * func: output function
 * tag: sub tag
 * format: format string
 * args: parameters in the type of Array
 */
function formatOutput(func, tag, format, args) {
    format = "[%s] - " + format;
    args.unshift(GLOBAL_TAG, format, tag);
    func.apply(null, args);
}

var Logger = function(tag) {
    this.TAG = tag;
};

Logger.prototype.d = function(format, ...args) {
    if (isLoggable(DEBUG)) {
        formatOutput(global.log.D, this.TAG, format, args);
    }
};

Logger.prototype.i = function(format, ...args) {
    if (isLoggable(INFO)) {
        formatOutput(global.log.I, this.TAG, format, args);
    }
};

Logger.prototype.w = function(format, ...args) {
    if (isLoggable(WARN)) {
        formatOutput(global.log.W, this.TAG, format, args);
    }
};

Logger.prototype.e = function(format, ...args) {
    if (isLoggable(ERROR)) {
        formatOutput(global.log.E, this.TAG, format, args);
    }
};

module.exports = {
    getLogger: function(tag) {
        return new Logger(tag);
    }
};
