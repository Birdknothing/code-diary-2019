"use strict";
exports.__esModule = true;
// const a= new Promise(res =>)
var util_1 = require("../my-min-library/util");
util_1.curry(function (x, y) { return console.log(x + y); })(1)(2);
