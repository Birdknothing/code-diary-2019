var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var curry = function (f, length) {
    if (length === void 0) { length = f.length; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return length - args.length > 0
            ? curry(function () {
                var argsRest = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    argsRest[_i] = arguments[_i];
                }
                return f.call.apply(f, __spreadArrays([f], args, argsRest));
            }, length - args.length)
            : f.apply(null, args);
    };
};
var $bind = curry(function (ename, f, dom) {
    dom.addEventListener(ename, f.bind(dom));
    return dom;
});
var $class = function (className) {
    var tmp = document.getElementsByClassName(className);
    return tmp.length === 1 ? tmp[0] : Array.from(tmp);
};
$class('tabHead').forEach(function (div) {
    $bind('click', function () {
        this.previousElementSibling.checked = true;
    }, div);
});
