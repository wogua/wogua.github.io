"use strict";

const BUILD_TYPE_ENG = "eng";
const sysprop = require("sysprop/sysprop");
const DEBUG = sysprop.get("ro.yunos.build.type", "") === BUILD_TYPE_ENG;
const CHECK_IMPLEMENTS = DEBUG;
const logger = require("../utils/logger").getLogger("Interface");

/**
 * @description 接口工具类，用于定义接口
 * @author junli
 * @since 1
 * @public
 * @example
 * const Interface = require("utils/Interface");
 * module.exports = new Interface("IDataHelper", ["getData","putData"]);
 */
const Interface = function(name, methods) {
    if (arguments.length !== 2) {
        logger.e("constructor() called with " +
            arguments.length + "arguments, but expected exactly 2.");
        console.trace();
    }

    this.name = name;
    if (DEBUG) {
        logger.d("constructor() - name: " + name);
    }

    this.methods = [];
    for (var i = 0, len = methods.length; i < len; i++) {
        if (typeof methods[i] !== "string") {
            logger.e("constructor() expects method name " +
                "to be passed in as a string.");
            console.trace();
        }

        if (DEBUG) {
            logger.d("constructor() - method: " + methods[i]);
        }
        this.methods.push(methods[i]);
    }

    return this;
};

Interface.dumpMethods = function(iface) {
    if (iface.methods.length < 1) {
        logger.i("dumpMethods() - " + iface.name + " defined no method");
        return;
    }

    logger.i(iface.name + " defined below methods: ");
    for (var i = 0; i < iface.methods.length; i++) {
        logger.i("\t" + i + ": " + iface.methods[i]);
    }
};

// ensureImplements(object, InterfaceObject...);
Interface.ensureImplements = function(obj) {
    var i, len;
    if (!CHECK_IMPLEMENTS) {
        return;
    }

    if (arguments.length < 2) {
        logger.e("ensureImplements() called with " +
            arguments.length + " arguments, but expected at least 2.");
        console.trace();
        return;
    }

    len = arguments.length;
    for (i = 1; i < len; i++) {
        if (!this.instanceOf(obj, arguments[i])) {
            console.trace();
            return;
        }
    }
};

Interface.instanceOf = function(obj, iface) {
    var j, methodsLen;

    if (!CHECK_IMPLEMENTS) {
        return true;
    }

    if (iface.constructor !== Interface) {
        logger.e("instanceOf() expects arguments two" +
            " to be instances of Interface.");
        return false;
    }

    if (DEBUG) {
        logger.d("instanceOf() - checking Interface: " + iface.name +
            " method number: " + iface.methods.length);
    }

    methodsLen = iface.methods.length;
    for (j = 0; j < methodsLen; j++) {
        var method = iface.methods[j];
        if (DEBUG) {
            logger.d("instanceOf() - checking method: " + method);
        }

        if (!obj[method] || typeof obj[method] !== "function") {
            logger.e("instanceOf() does not implement" +
                " the " + iface.name + " interface. Method " + method +
                " was not found.");
            return false;
        }
    }

    return true;
};

Interface.dumpObject = function (obj) {
    function dumpStr(obj, deep) {
        if (deep > 2) {
            return "";
        }

        var methods = "",
            properties = "";

        for (var item in obj) {
            if (typeof obj[item] === "function") {
                methods += item;
                methods += "\n";
            } else {
                if (typeof obj[item] === "object") {
                    properties += "\n[dump of " + item + "]:\n";
                    properties += dumpStr(obj[item], deep + 1);
                } else {
                    properties += item;
                    properties += ": ";
                    properties += obj[item];
                    properties += "\n";
                }
            }
        }

        let output = "Methods:\n";
        output += methods;
        output += "\nProperties:\n";
        output += properties;

        return output;
    }

    var output = "## BEGIN DUMP ##\n";
    output += dumpStr(obj, 0);
    output += "\n## END DUMP ##";

    logger.i(output);
};

module.exports = Interface;
