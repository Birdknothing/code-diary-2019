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
var B = /** @class */ (function () {
    function B(x, _h) {
        this.w = x;
    }
    B.prototype.wSet = function (nval) {
        this.h = nval;
    };
    B.prototype.bark = function (msg) {
        console.log("father is barking " + msg + " !");
    };
    return B;
}());
var C = /** @class */ (function (_super) {
    __extends(C, _super);
    function C(y, w) {
        return _super.call(this, y, w) || this;
    }
    C.prototype.bark = function (msg) {
        _super.prototype.bark.call(this, msg);
        console.log("son is barking " + msg);
    };
    C.prototype.test = function () {
        this.h = 'var changed';
        console.log(this.h);
    };
    return C;
}(B));
var D = /** @class */ (function () {
    function D(x) {
        this.x = x;
    }
    D.prototype.console = function () {
        console.log(this.x);
    };
    Object.defineProperty(D.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (nval) {
            nval > 5 && (this._x = nval);
        },
        enumerable: true,
        configurable: true
    });
    return D;
}());
var exm = new C('123', 'B private');
exm.test();
exm.bark('wongwong');
var ww = new D(6);
ww.x = 4;
ww.console();
ww.x = 7;
ww.console();
ww.x = 2;
ww.console();
ww.x = 10;
ww.console();
