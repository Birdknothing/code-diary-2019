(function(root, factory, undef) {
    if (typeof exports === "object") {
        module.exports = exports = factory({ test: 1 });
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.test = factory({ test: 1 });
    }
})(this, function(x) {
    return x;
});
// module.exports = {
// }
