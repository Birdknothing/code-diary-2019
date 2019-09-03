var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
/////////////////////////////////开始
var interval = 6000;
var moveTime = 3000;
var pics = 4;
///////////////////////////////
var moveMode = {
    // t表示 已消耗动画的时间
    // b表示 小球的原始位置
    // c表示 小球经过的总路程
    // d表示 动画持续的总时间
    // 返回值表示 已过t时间的位置
    linear: function (timePassed, originPos, distance, wholeTime) {
        return (distance * timePassed) / wholeTime + originPos;
    },
    easeIn: function (t, b, c, d) {
        return c * t * (t /= d) + b;
    },
    strongEaseIn: function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    strongEaseOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    sineaseIn: function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    sineaseOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }
};
var Animate = /** @class */ (function () {
    function Animate(_a) {
        var _b = _a.unit, unit = _b === void 0 ? '%' : _b, div = _a.div, _c = _a.translateX, translateX = _c === void 0 ? 0 : _c;
        this.stepTime = 10;
        this.clocks = [];
        this.unit = unit;
        this.div = div;
        this.translateX = translateX;
    }
    Animate.prototype.move = function (propName, des, dur, mode) {
        var _this = this;
        if (mode === void 0) { mode = 'sineaseOut'; }
        return new Promise(function (res) {
            var clockIndex = _this.clocks.length;
            var startTime = Date.now();
            var self = _this;
            _this.clocks[clockIndex] = setInterval(function () {
                var nowTime = Date.now();
                var propInit = self[propName];
                self.update(propName, moveMode[mode](nowTime - startTime, propInit, des - propInit, dur).toFixed(2));
                if (nowTime >= startTime + dur) {
                    clearInterval(self.clocks[clockIndex]);
                    self.update(propName, des);
                    res();
                    // self.div.style.transform = des + self.unit;
                }
            }, _this.stepTime);
        });
    };
    Animate.prototype.update = function (prop, val) {
        this.div.style.transform = prop + "(" + val + this.unit + ")";
    };
    return Animate;
}());
var Slide = /** @class */ (function () {
    function Slide(_a) {
        var whole = _a.whole, nowIndex = _a.nowIndex, className = _a.className, width = _a.width, interval = _a.interval, unit = _a.unit;
        this.canClick = true;
        this.whole = whole;
        this.updateIndex(nowIndex);
        this.className = className;
        this.width = this.parseWidth(width);
        this.interval = interval;
        this.unit = unit;
    }
    Slide.prototype.parseWidth = function (width) {
        return typeof width === 'number' ? width : parseInt(width);
    };
    Slide.prototype.updateIndex = function (nowindex) {
        var whole = this.whole;
        this.nowIndex = nowindex % whole;
        this.nextIndex = (nowindex + 1) % whole;
        this.prevIndex = nowindex === 0 ? whole - 1 : nowindex - 1;
    };
    Slide.prototype.step = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, className, nextIndex, prevIndex, unit, nowIndex, width, interval, whichIndex, prev, now;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.canClick = false;
                        _a = this, className = _a.className, nextIndex = _a.nextIndex, prevIndex = _a.prevIndex, unit = _a.unit, nowIndex = _a.nowIndex, width = _a.width, interval = _a.interval;
                        whichIndex = direction === 1 ? nextIndex : prevIndex;
                        prev = $class(className)[whichIndex];
                        now = $class(className)[nowIndex];
                        this.updateIndex(whichIndex);
                        // -1左置 1右置
                        prev.style.transform = "translateX(" + direction * width + unit + ")";
                        prev.style.zIndex = 1;
                        // 移动
                        return [4 /*yield*/, Promise.all([
                                new Animate({ div: prev, unit: unit, translateX: direction * width }).move('translateX', 0, interval),
                                new Animate({ div: now, unit: unit, translateX: 0 }).move('translateX', -1 * direction * width, interval),
                            ]).then(function () {
                                now.style.zIndex = 0;
                                now.style.transform = "translateX(0" + unit + ")";
                                _this.canClick = true;
                            })];
                    case 1:
                        // 移动
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Slide;
}());
var lunboSlide = new Slide({
    whole: pics,
    nowIndex: 0,
    className: 'lunboItemBox',
    width: '100%',
    interval: moveTime,
    unit: '%'
});
$class('lunboItemBox')[0].style.zIndex = 1;
// 箭头点击
var leftClick = function () {
    if (lunboSlide.canClick) {
        lunboSlide.step(1);
    }
};
var rightClick = function () {
    if (lunboSlide.canClick) {
        lunboSlide.step(-1);
    }
};
$bind('click', leftClick, $class('arrowLeft'));
$bind('click', rightClick, $class('arrowRight'));
$class('tabHead').forEach(function (div) {
    $bind('click', function () {
        this.previousElementSibling.checked = true;
    }, div);
});
var cc = function () {
    var clock = setTimeout(function () {
        lunboSlide.step(1);
        clearTimeout(clock);
        cc();
    }, interval);
};
cc();
