const fs = require("fs");
const { promisify } = require("util");
const promiseLibs = {};
Reflect.ownKeys(fs).forEach(mt => {
    typeof fs[mt] === "function" && (promiseLibs[mt] = promisify(fs[mt]));
});
module.exports = promiseLibs;
