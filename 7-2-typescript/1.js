var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var color;
(function (color) {
    color[color["green"] = 0] = "green";
    color[color["red"] = 1] = "red";
    color[color["yellow"] = 2] = "yellow";
})(color || (color = {}));
function h() {
    throw new Error('ahh');
}
var _a = { x: 1, y: 2, z: 3 }, x = _a.x, k = __rest(_a, ["x"]);
console.log(k);
console.log(color[1]);
console.log(color['red']);
var W = /** @class */ (function () {
    function W(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.cp = x + y + z;
    }
    return W;
}());
console.log(new W(1, 2, 3).cp);
var a = function (x) {
    console.log(x);
};
a({ x: '2', y: '3', z: '4' });
