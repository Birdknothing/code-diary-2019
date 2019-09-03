var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function Test(arg) {
    console.log(arg.length);
}
Test([1, 2]);
Test({ length: 2 });
var F = /** @class */ (function () {
    function F(n) {
        this.x = n;
    }
    F.prototype.move = function (t) {
        console.log('f', t);
    };
    return F;
}());
var N = /** @class */ (function (_super) {
    __extends(N, _super);
    function N(n) {
        return _super.call(this, n) || this;
    }
    N.prototype.move = function (w) {
        _super.prototype.move.call(this, w);
    };
    N.prototype.smove = function (w) {
        this.move(w);
    };
    return N;
}(F));
var K = /** @class */ (function () {
    function K() {
    }
    K.prototype.move = function () {
        console.log('k');
    };
    return K;
}());
new N('2').smove('sonson');
var wf = function (x, y) { return x > y; };
// let wf: SearchFunc = (x, y) => x > y;
// wf('2', '3');]
var yf = function (x, arr) { return arr.includes(x); };
console.log(yf('1', [2, 3]));
function db(x) {
    return x === 1 ? '1' : 2;
}
console.log(db('1'));
var kkk = function (x) { return (x === 1 ? '1' : 2); };
console.log(kkk(1));
var tft = /** @class */ (function () {
    function class_1() {
    }
    return class_1;
}());
var GenericNumber = /** @class */ (function () {
    function GenericNumber() {
    }
    return GenericNumber;
}());
var myGenericNumber = new GenericNumber();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
    return x + y;
};
function mmm(y) {
    console.log(y.x);
}
mmm({ x: 2 });
// interface bbb
