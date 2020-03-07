"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var curry = function (f, l) {
    if (l === void 0) { l = f.length; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return l - args.length > 0
            ? curry(function () {
                var argsRest = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    argsRest[_i] = arguments[_i];
                }
                return f.call.apply(f, __spreadArrays([f], args, argsRest));
            }, l - args.length)
            : f.call.apply(f, __spreadArrays([f], args));
    };
};
exports.curry = curry;
var compose = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (x) { return args.reduceRight(function (acc, f) { return f(acc); }, x); };
};
exports.compose = compose;
