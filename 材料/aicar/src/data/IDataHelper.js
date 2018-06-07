"use strict";

const SRC_DIR = "../";
const Interface = require(SRC_DIR + "utils/Interface");

module.exports = new Interface("IDataHelper", [
    "getData",
    "putData"
]);
