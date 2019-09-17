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
var _a;
var _this = this;
var superagent = require('superagent-charset')(require('superagent'));
// const iconv = require('iconv-lite');
var fs = require('fs');
var path = require('path');
var Cheerio = require('cheerio');
// const url = 'http://demo.16xiazai.com'; // 首页，入口页 gbk
var url = 'http://www.fesucai.com/index.html'; // 首页，入口页 utf-8
var website = 'http://www.fesucai.com';
var dirName = 'public2'; // 保存在的文件夹
var source = ['.js', '.css', '.jpg', '.png', '.gif']; // 要保存哪些除了js css外的静态资源
var links = ['/', '.html', '.php']; // 其他链接入口
var wrongFileNameCode = ['\\', '/', ':', '*', '?', '"', '<', '>', '|']; // 这些符号不能出现在windows新文件名中，最好用_代替，且'\'必须用双\\ 表示,encodeURIComponent才能转义'/',而encodeURI和escape都无法做到
var depth = 1;
var allAssets = [];
var allPages = [url];
var pagesDone = [];
// 生成的目录结构
var struct = (_a = {},
    _a['/' + dirName] = {
        // 不能叫assets，因为可能刚好和某个子文件夹重名
        $assets: {}
    },
    _a);
var curry = function (f, l) {
    if (l === void 0) { l = f.length; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (l - args.length > 0 ? curry(function () {
            var argsRest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                argsRest[_i] = arguments[_i];
            }
            return f.call.apply(f, __spreadArrays([f], args, argsRest));
        }, l - args.length) : f.call.apply(f, __spreadArrays([f], args)));
    };
};
var compose = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (x) { return args.reduceRight(function (acc, f) { return f(acc); }, x); };
};
var getHtml = function (url, form) {
    if (form === void 0) { form = 'utf-8'; }
    return new Promise(function (res) {
        superagent
            .get(encodeURI(url))
            .charset(form)
            .end(function (err, result) {
            if (err || !result || !('text' in result)) {
                console.error({ url: url, err: err });
                res('wrong');
                return;
            }
            var target = result.text;
            var preCheckForm = JSON.stringify(result.headers) + result.text;
            var matchForm = preCheckForm.match(/charset=([^'"]+)/);
            // charset不对（如gbk）则用对的charet再去请求一次
            if (matchForm && matchForm[1] && matchForm[1] !== form) {
                console.log(path.basename(url), matchForm[1]);
                getHtml(url, matchForm[1]).then(res);
                return;
            }
            res(target);
        });
    });
};
// url里面可能包含中文，要encodeURI
var getAssets = function (url) { return superagent.get(encodeURI(url)); };
// 拿$
var get$ = function (html) { return Cheerio.load(html); };
// 往assests内push资源文件名
var pushAsset = function (obj, type, filename, cb) {
    // 已包括此文件不操作
    if (obj['$assets'][type] && obj['$assets'][type].includes(filename)) {
        return;
    }
    // 已有资源项目新文件
    if (obj['$assets'][type] && !obj['$assets'][type].includes(filename)) {
        obj['$assets'][type].push(filename);
    }
    // 新资源项目
    if (!(type in obj['$assets'])) {
        (obj['$assets'][type] = []).push(filename);
    }
    cb();
};
// 根据文件名和内容写string文件
var writeFile = curry(function (name, content) {
    // 所有相关原网址自动删除
    content = content.replace(new RegExp(website, 'g'), '');
    fs.writeFileSync(path.join(dirName, name), content);
});
// 创建
var mkDir = function (targetDir, relativePath) {
    var location = path.resolve(targetDir, relativePath);
    fs.mkdirSync(location);
    // if (type === 'file') {
    //   fs.appendFileSync('./allfilename', location + '\n');
    //   fs.writeFileSync(location, content);
    // }
};
// 根据是否存在来创建文件夹或文件，同时创建记录
var mkAll = function (pathurl, store) {
    if (store === void 0) { store = struct['/' + dirName]; }
    // pathurl不能包括域名
    pathurl = pathurl.replace(/.*:\/\/[^/]*/g, '');
    var urlArr = pathurl.split('/');
    var nowPath = './';
    urlArr.reduce(function (acc, dirname) {
        // 空字符串不进入创建
        if (!dirname) {
            return acc;
        }
        // 文件创建记录和实际文件
        if (dirname.includes('.')) {
            // 考虑 a.min.b.js的情况
            pushAsset(acc, dirname.match(/.*(\.\w+)/)[1], dirname, function () {
                var assetPath = website + pathurl;
                // 写文件
                getAssets(assetPath).pipe(fs.createWriteStream(path.resolve(dirName, nowPath + dirname)));
            });
            return acc;
        }
        // 文件夹或记录已存在不创建
        if (!(dirname in acc)) {
            acc[dirname] = { $assets: {} };
            // 建文件夹
            mkDir(dirName, nowPath + dirname);
        }
        nowPath += dirname + '/';
        return acc[dirname];
    }, store);
};
// 写根据url爬到的文件
var writeHtml = function (url, name) { return getHtml(url).then(writeFile(name)); };
// 功能部分,爬取当前页所有资源类型文件,url必须包含网址和协议,同时将爬取过网页加以记录
var scratch = function (url) { return __awaiter(_this, void 0, void 0, function () {
    var html, pname, filename;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (pagesDone.includes(url)) {
                    return [2 /*return*/, 'yes'];
                }
                pagesDone.push(url);
                return [4 /*yield*/, getHtml(url)];
            case 1:
                html = _a.sent();
                if (html === 'wrong') {
                    return [2 /*return*/, 'no'];
                }
                pname = url.match(/http[s]?:\/\/[^/]+(.*)/)[1];
                filename = !pname || pname === '/' ? 'index.html' : encodeURIComponent(pname);
                // 创建当前页
                writeHtml(url, filename);
                return [4 /*yield*/, getAssetsLinks(source, html)];
            case 2:
                // 拿静态资源链接数组等
                (_a.sent()).forEach(function (pathurl) {
                    mkAll(pathurl);
                });
                getPageLinks(links, html);
                return [2 /*return*/, 'yes'];
        }
    });
}); };
var rmDupli = function (oarr) { return (oarr === null ? null : Array.from(new Set(oarr))); };
// 根据文本html和资源类别数组获取所有资源链接
var getAssetsLinks = function (source, content) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        source.forEach(function (extname) {
            // .jpg .png .gif 等 考虑到 background:url(/a/b/c.jpg)的情况,对于js，css必须是 /a/b/c.js 不能是a/b/c.js
            var exp = extname !== ('.css' || '.js') ? new RegExp('(?<=[("])/[^"(]+\\' + extname, 'g') : new RegExp('[^"]+\\' + extname, 'g');
            var result = rmDupli(content.match(exp));
            if (result) {
                allAssets = rmDupli(allAssets.concat(result));
            }
        });
        return [2 /*return*/, allAssets];
    });
}); };
// 根据文本html和页面特征数组获得所有页面链接
var getPageLinks = function (links, content) {
    links.forEach(function (feat) {
        var exp = new RegExp('(?<=href=")([^"]+\\' + feat + ')(?=")', 'g');
        // 去重
        var result = rmDupli(content.match(exp));
        if (result) {
            // 并且如果没有协议头加协议头
            allPages = rmDupli(allPages.concat(result.map(function (ele) { return ele.includes('://') ? ele : website + ele; })));
        }
    });
    return allPages;
};
(function () { return __awaiter(_this, void 0, void 0, function () {
    var i, _i, allPages_1, pageurl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i <= depth)) return [3 /*break*/, 6];
                _i = 0, allPages_1 = allPages;
                _a.label = 2;
            case 2:
                if (!(_i < allPages_1.length)) return [3 /*break*/, 5];
                pageurl = allPages_1[_i];
                return [4 /*yield*/, scratch(pageurl)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                i++;
                return [3 /*break*/, 1];
            case 6:
                console.log(allAssets.length);
                fs.writeFileSync('./Struct.js', 'module.exports = ' + JSON.stringify(struct, null, 4));
                fs.writeFileSync('./assets', allAssets.join('\n'));
                fs.writeFileSync('./pages', allPages.join('\n'));
                return [2 /*return*/];
        }
    });
}); })();
