/*!
 * cloud-atlas-web-sdk v1.7.2
 * (c) 2017-2019 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.CloudAtlas = factory());
}(this, (function () {
    'use strict';

    // 打印前打的码
    var sLogPrefix = '[CloudAtlas] ';
    // 设置sdk存储cookie的键

    // 设置存储的devide_id
    var KEY_DEVICE_INFO = 'device_id';
    // 设置storage
    var storage = localStorage;
    //     // AppInfoResolver
    /**
       * 异常类型
       */
    var TYPE_USER_SUBMIT_MSG = 0;
    /**
       * 自定义事件的通用参数在MAP中存储的key
       * 事件标签
       */
    var KEY_EVENT_LABEL = 'ca_label';

    /**
       * 自定义事件的通用参数在MAP中存储的key
       * 整数值
       */
    var KEY_EVENT_INT_VALUE = 'ca_int_value';

    /**
       * 页面信息存储key
       */
    var KEY_LEAVE_PAGE_INFO = 'leave_page_info';

    /**
     * 所有可实例化类，均通过function XX(...){}的方式定义，通过var bb = new XX(...)的方式实例化
     * 所有工具类及只含静态调用的类，均通过类名_方法名的方式定义方法，静态成员变量以var的方式定义在CloudAtlas作用域内
     * 如function 类名_方法名(...){...}
     * 判断一个参数是否为对象，统一使用typeof xxx === 'object'，因为constructor会返回具体的类名
     */
    // data包
    /**
     * 采集的数据
     * @constructor
     */
    function CollectedData() {
        this.sessionList = [];
        this.eventList = [];
        this.errorList = [];
        /**
         * 合并两个数据采集对象
         * @param toBeMerged 待合并的数据
         */
        this.merge = function (toBeMerged) {
            if (toBeMerged) {
                // 合并会话信息
                if (toBeMerged.sessionList.length > 0) {
                    var len = toBeMerged.sessionList.length;
                    for (var i = 0; i < len; i++) {
                        var session = toBeMerged.sessionList[i];
                        if (session && session.id) {
                            var sameSession = findSameSession.apply(this, [session]);
                            if (sameSession === null) {
                                // 没有相同会话，直接加入
                                this.sessionList.push(session);
                            } else {
                                // 有相同会话，去掉旧的
                                if (session.end > sameSession.end) {
                                    sameSession.end = session.end;
                                }
                            }
                        }
                    }
                }
                // 合并自定义事件
                if (toBeMerged.eventList && toBeMerged.eventList.length > 0) {
                    this.eventList = this.eventList.concat(toBeMerged.eventList);
                }
                // 合并异常
                if (toBeMerged.errorList && toBeMerged.errorList.length > 0) {
                    this.errorList = this.errorList.concat(toBeMerged.errorList);
                }
            }
        };
        /**
           * 在当前会话列表中查找相同会话
           *
           * @param toBeMatched 待匹配的会话
           * @return 若不为空，则为当前列表中会话id相同的会话
           */
        function findSameSession(toBeMatched) {
            var len = this.sessionList.length;
            for (var i = 0; i < len; i++) {
                var session = this.sessionList[i];
                if (toBeMatched.id === session.id) {
                    return session;
                }
            }
            return null;
        }
        /**
           * 是否有有效数据，用于辅助判断是否需要上传
           * @returns {boolean},true-有，false-没有
           */
        this.hasValidData = function () {
            return this.sessionList.length > 0 || this.eventList.length > 0 || this.errorList.length > 0;
        };
    }
    /**
       * 会话类
       * @param id 会话id
       * @param start 开始时间
       * @param end 结束时间
       * @param userId 用户id
       * @param appVer 应用版本
       * @param ip 用户ip
       * @constructor
       */
    function Session(id, start, end, userId, appVer, ip, activityId) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.userId = userId;
        this.appVer = appVer;
        this.ip = ip;
        this.activityId = activityId;
        this.equals = function (session) {
            if (this === session) return true;
            if (session === null || this.constructor !== session.constructor) return false;

            if (this.id !== session.id) return false;
            if (this.start !== session.start) return false;
            if (this.end !== session.end) return false;
            if (this.userId !== session.userId) return false;
            if (this.appVer !== session.appVer) return false;
            if (this.activityId !== session.activityId) return false;
            return this.ip === session.ip;
        };
    }
    /**
       * 运行环境
       * @param appVer 应用版本
       * @param userId 用户Id
       * @param sessionId 会话id
       * @param ip 用户IP
       * @constructor
       */
    function RunningEnv(appVer, userId, sessionId, ip) {
        this.appVer = appVer;
        this.userId = userId;
        this.sessionId = sessionId;
        this.ip = ip;
    }
    /**
       * 自定义事件
       * @param id 自定义事件ID
       * @param value 自定义事件参数对象
       * @param time 事件发生时间
       * @param userId 用户ID
       * @param appVer 应用版本
       * @constructor
       */
    function Event(id, value, time, userId, appVer, activityId, sessionId) {
        this.id = id;
        this.value = value;
        this.time = time;
        this.userId = userId;
        this.appVer = appVer;
        this.activityId = activityId;
        this.sessionId = sessionId;
        this.equals = function (event) {
            if (this === event) return true;
            if (event === null || this.constructor !== event.constructor) return false;
            if (this.id !== event.id) return false;
            if (this.value !== event.value) return false;
            if (this.time !== event.time) return false;
            if (this.userId !== event.userId) return false;
            if (this.activityId !== event.activityId) return false;
            if (this.sessionId !== event.sessionId) return false;
            return this.appVer !== event.appVer;
        };
    }
    /**
       * 异常
       * @param type 异常类型
       * @param msg 异常信息
       * @param time 发生异常的时间
       * @param appVer 应用版本
       */

    function Error$1(type, msg, time, appVer, activityId) {
        this.type = type;
        this.msg = msg;
        this.time = time;
        this.appVer = appVer;
        this.activityId = activityId;
        this.equals = function (error) {
            if (this === error) return true;
            if (error === null || this.constructor !== error.constructor) return false;
            if (this.type !== error.type) return false;
            if (this.msg !== error.msg) return false;
            if (this.time !== error.time) return false;
            if (this.activityId !== error.activityId) return false;
            return this.appVer !== event.appVer;
        };
    }

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





    function createCommonjsModule(fn, module) {
        return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var fingerprint2_min = createCommonjsModule(function (module) {
        !function (e, t, i) { "function" == typeof undefined && undefined.amd ? undefined(i) : "undefined" != 'object' && module.exports ? module.exports = i() : t.exports ? t.exports = i() : t[e] = i(); }("Fingerprint2", commonjsGlobal, function () {
            var e = function (t) { if (!(this instanceof e)) return new e(t); var i = { swfContainerId: "fingerprintjs2", swfPath: "flash/compiled/FontList.swf", detectScreenOrientation: !0, sortPluginsFor: [/palemoon/i], userDefinedFonts: [] }; this.options = this.extend(t, i), this.nativeForEach = Array.prototype.forEach, this.nativeMap = Array.prototype.map; }; return e.prototype = {
                extend: function (e, t) { if (null == e) return t; for (var i in e) null != e[i] && t[i] !== e[i] && (t[i] = e[i]); return t }, get: function (e) { var t = this, i = { data: [], push: function (e) { var i = e.key, a = e.value; "function" == typeof t.options.preprocessor && (a = t.options.preprocessor(i, a)), this.data.push({ key: i, value: a }); } }; i = this.userAgentKey(i), i = this.languageKey(i), i = this.colorDepthKey(i), i = this.pixelRatioKey(i), i = this.hardwareConcurrencyKey(i), i = this.screenResolutionKey(i), i = this.availableScreenResolutionKey(i), i = this.timezoneOffsetKey(i), i = this.sessionStorageKey(i), i = this.localStorageKey(i), i = this.indexedDbKey(i), i = this.addBehaviorKey(i), i = this.openDatabaseKey(i), i = this.cpuClassKey(i), i = this.platformKey(i), i = this.doNotTrackKey(i), i = this.pluginsKey(i), i = this.canvasKey(i), i = this.webglKey(i), i = this.adBlockKey(i), i = this.hasLiedLanguagesKey(i), i = this.hasLiedResolutionKey(i), i = this.hasLiedOsKey(i), i = this.hasLiedBrowserKey(i), i = this.touchSupportKey(i), i = this.customEntropyFunction(i), this.fontsKey(i, function (i) { var a = []; t.each(i.data, function (e) { var t = e.value; "undefined" != typeof e.value.join && (t = e.value.join(";")), a.push(t); }); var r = t.x64hash128(a.join("~~~"), 31); return e(r, i.data) }); }, customEntropyFunction: function (e) { return "function" == typeof this.options.customFunction && e.push({ key: "custom", value: this.options.customFunction() }), e }, userAgentKey: function (e) { return this.options.excludeUserAgent || e.push({ key: "user_agent", value: this.getUserAgent() }), e }, getUserAgent: function () { return navigator.userAgent }, languageKey: function (e) { return this.options.excludeLanguage || e.push({ key: "language", value: navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || "" }), e }, colorDepthKey: function (e) { return this.options.excludeColorDepth || e.push({ key: "color_depth", value: screen.colorDepth || -1 }), e }, pixelRatioKey: function (e) { return this.options.excludePixelRatio || e.push({ key: "pixel_ratio", value: this.getPixelRatio() }), e }, getPixelRatio: function () { return window.devicePixelRatio || "" }, screenResolutionKey: function (e) { return this.options.excludeScreenResolution ? e : this.getScreenResolution(e) }, getScreenResolution: function (e) { var t; return t = this.options.detectScreenOrientation && screen.height > screen.width ? [screen.height, screen.width] : [screen.width, screen.height], "undefined" != typeof t && e.push({ key: "resolution", value: t }), e }, availableScreenResolutionKey: function (e) { return this.options.excludeAvailableScreenResolution ? e : this.getAvailableScreenResolution(e) }, getAvailableScreenResolution: function (e) { var t; return screen.availWidth && screen.availHeight && (t = this.options.detectScreenOrientation ? screen.availHeight > screen.availWidth ? [screen.availHeight, screen.availWidth] : [screen.availWidth, screen.availHeight] : [screen.availHeight, screen.availWidth]), "undefined" != typeof t && e.push({ key: "available_resolution", value: t }), e }, timezoneOffsetKey: function (e) { return this.options.excludeTimezoneOffset || e.push({ key: "timezone_offset", value: (new Date).getTimezoneOffset() }), e }, sessionStorageKey: function (e) { return !this.options.excludeSessionStorage && this.hasSessionStorage() && e.push({ key: "session_storage", value: 1 }), e }, localStorageKey: function (e) { return !this.options.excludeSessionStorage && this.hasLocalStorage() && e.push({ key: "local_storage", value: 1 }), e }, indexedDbKey: function (e) { return !this.options.excludeIndexedDB && this.hasIndexedDB() && e.push({ key: "indexed_db", value: 1 }), e }, addBehaviorKey: function (e) { return document.body && !this.options.excludeAddBehavior && document.body.addBehavior && e.push({ key: "add_behavior", value: 1 }), e }, openDatabaseKey: function (e) { return !this.options.excludeOpenDatabase && window.openDatabase && e.push({ key: "open_database", value: 1 }), e }, cpuClassKey: function (e) { return this.options.excludeCpuClass || e.push({ key: "cpu_class", value: this.getNavigatorCpuClass() }), e }, platformKey: function (e) { return this.options.excludePlatform || e.push({ key: "navigator_platform", value: this.getNavigatorPlatform() }), e }, doNotTrackKey: function (e) { return this.options.excludeDoNotTrack || e.push({ key: "do_not_track", value: this.getDoNotTrack() }), e }, canvasKey: function (e) { return !this.options.excludeCanvas && this.isCanvasSupported() && e.push({ key: "canvas", value: this.getCanvasFp() }), e }, webglKey: function (e) { return this.options.excludeWebGL ? e : this.isWebGlSupported() ? (e.push({ key: "webgl", value: this.getWebglFp() }), e) : e }, adBlockKey: function (e) { return this.options.excludeAdBlock || e.push({ key: "adblock", value: this.getAdBlock() }), e }, hasLiedLanguagesKey: function (e) { return this.options.excludeHasLiedLanguages || e.push({ key: "has_lied_languages", value: this.getHasLiedLanguages() }), e }, hasLiedResolutionKey: function (e) { return this.options.excludeHasLiedResolution || e.push({ key: "has_lied_resolution", value: this.getHasLiedResolution() }), e }, hasLiedOsKey: function (e) { return this.options.excludeHasLiedOs || e.push({ key: "has_lied_os", value: this.getHasLiedOs() }), e }, hasLiedBrowserKey: function (e) { return this.options.excludeHasLiedBrowser || e.push({ key: "has_lied_browser", value: this.getHasLiedBrowser() }), e }, fontsKey: function (e, t) { return this.options.excludeJsFonts ? this.flashFontsKey(e, t) : this.jsFontsKey(e, t) }, flashFontsKey: function (e, t) { return this.options.excludeFlashFonts ? t(e) : this.hasSwfObjectLoaded() && this.hasMinFlashInstalled() ? "undefined" == typeof this.options.swfPath ? t(e) : void this.loadSwfAndDetectFonts(function (i) { e.push({ key: "swf_fonts", value: i.join(";") }), t(e); }) : t(e) }, jsFontsKey: function (e, t) { var i = this; return setTimeout(function () { var a = ["monospace", "sans-serif", "serif"], r = ["Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style", "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New", "Garamond", "Geneva", "Georgia", "Helvetica", "Helvetica Neue", "Impact", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO", "Palatino", "Palatino Linotype", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS", "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"], n = ["Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter", "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER", "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville", "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD", "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed", "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara", "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer", "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold", "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark", "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC", "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte", "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER", "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT", "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD", "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV", "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT", "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN", "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island", "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic", "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti", "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli", "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN", "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB", "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla", "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood", "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket", "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC", "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold", "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin", "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"]; i.options.extendedJsFonts && (r = r.concat(n)), r = r.concat(i.options.userDefinedFonts); var o = "mmmmmmmmmmlli", s = "72px", l = document.getElementsByTagName("body")[0], h = document.createElement("div"), u = document.createElement("div"), c = {}, d = {}, g = function () { var e = document.createElement("span"); return e.style.position = "absolute", e.style.left = "-9999px", e.style.fontSize = s, e.style.lineHeight = "normal", e.innerHTML = o, e }, p = function (e, t) { var i = g(); return i.style.fontFamily = "'" + e + "'," + t, i }, f = function () { for (var e = [], t = 0, i = a.length; t < i; t++) { var r = g(); r.style.fontFamily = a[t], h.appendChild(r), e.push(r); } return e }, m = function () { for (var e = {}, t = 0, i = r.length; t < i; t++) { for (var n = [], o = 0, s = a.length; o < s; o++) { var l = p(r[t], a[o]); u.appendChild(l), n.push(l); } e[r[t]] = n; } return e }, T = function (e) { for (var t = !1, i = 0; i < a.length; i++)if (t = e[i].offsetWidth !== c[a[i]] || e[i].offsetHeight !== d[a[i]]) return t; return t }, S = f(); l.appendChild(h); for (var x = 0, v = a.length; x < v; x++)c[a[x]] = S[x].offsetWidth, d[a[x]] = S[x].offsetHeight; var E = m(); l.appendChild(u); for (var M = [], A = 0, y = r.length; A < y; A++)T(E[r[A]]) && M.push(r[A]); l.removeChild(u), l.removeChild(h), e.push({ key: "js_fonts", value: M }), t(e); }, 1) }, pluginsKey: function (e) { return this.options.excludePlugins || (this.isIE() ? this.options.excludeIEPlugins || e.push({ key: "ie_plugins", value: this.getIEPlugins() }) : e.push({ key: "regular_plugins", value: this.getRegularPlugins() })), e }, getRegularPlugins: function () { for (var e = [], t = 0, i = navigator.plugins.length; t < i; t++)e.push(navigator.plugins[t]); return this.pluginsShouldBeSorted() && (e = e.sort(function (e, t) { return e.name > t.name ? 1 : e.name < t.name ? -1 : 0 })), this.map(e, function (e) { var t = this.map(e, function (e) { return [e.type, e.suffixes].join("~") }).join(","); return [e.name, e.description, t].join("::") }, this) }, getIEPlugins: function () { var e = []; if (Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, "ActiveXObject") || "ActiveXObject" in window) { var t = ["AcroPDF.PDF", "Adodb.Stream", "AgControl.AgControl", "DevalVRXCtrl.DevalVRXCtrl.1", "MacromediaFlashPaper.MacromediaFlashPaper", "Msxml2.DOMDocument", "Msxml2.XMLHTTP", "PDF.PdfCtrl", "QuickTime.QuickTime", "QuickTimeCheckObject.QuickTimeCheck.1", "RealPlayer", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "Scripting.Dictionary", "SWCtl.SWCtl", "Shell.UIHelper", "ShockwaveFlash.ShockwaveFlash", "Skype.Detection", "TDCCtl.TDCCtl", "WMPlayer.OCX", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1"]; e = this.map(t, function (e) { try { return new ActiveXObject(e), e } catch (t) { return null } }); } return navigator.plugins && (e = e.concat(this.getRegularPlugins())), e }, pluginsShouldBeSorted: function () { for (var e = !1, t = 0, i = this.options.sortPluginsFor.length; t < i; t++) { var a = this.options.sortPluginsFor[t]; if (navigator.userAgent.match(a)) { e = !0; break } } return e }, touchSupportKey: function (e) { return this.options.excludeTouchSupport || e.push({ key: "touch_support", value: this.getTouchSupport() }), e }, hardwareConcurrencyKey: function (e) { return this.options.excludeHardwareConcurrency || e.push({ key: "hardware_concurrency", value: this.getHardwareConcurrency() }), e }, hasSessionStorage: function () { try { return !!window.sessionStorage } catch (e) { return !0 } }, hasLocalStorage: function () { try { return !!window.localStorage } catch (e) { return !0 } }, hasIndexedDB: function () { try { return !!window.indexedDB } catch (e) { return !0 } }, getHardwareConcurrency: function () { return navigator.hardwareConcurrency ? navigator.hardwareConcurrency : "unknown" }, getNavigatorCpuClass: function () { return navigator.cpuClass ? navigator.cpuClass : "unknown" }, getNavigatorPlatform: function () { return navigator.platform ? navigator.platform : "unknown" }, getDoNotTrack: function () { return navigator.doNotTrack ? navigator.doNotTrack : navigator.msDoNotTrack ? navigator.msDoNotTrack : window.doNotTrack ? window.doNotTrack : "unknown" }, getTouchSupport: function () { var e = 0, t = !1; "undefined" != typeof navigator.maxTouchPoints ? e = navigator.maxTouchPoints : "undefined" != typeof navigator.msMaxTouchPoints && (e = navigator.msMaxTouchPoints); try { document.createEvent("TouchEvent"), t = !0; } catch (i) { } var a = "ontouchstart" in window; return [e, t, a] }, getCanvasFp: function () { var e = [], t = document.createElement("canvas"); t.width = 2e3, t.height = 200, t.style.display = "inline"; var i = t.getContext("2d"); return i.rect(0, 0, 10, 10), i.rect(2, 2, 6, 6), e.push("canvas winding:" + (i.isPointInPath(5, 5, "evenodd") === !1 ? "yes" : "no")), i.textBaseline = "alphabetic", i.fillStyle = "#f60", i.fillRect(125, 1, 62, 20), i.fillStyle = "#069", this.options.dontUseFakeFontInCanvas ? i.font = "11pt Arial" : i.font = "11pt no-real-font-123", i.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15), i.fillStyle = "rgba(102, 204, 0, 0.2)", i.font = "18pt Arial", i.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45), i.globalCompositeOperation = "multiply", i.fillStyle = "rgb(255,0,255)", i.beginPath(), i.arc(50, 50, 50, 0, 2 * Math.PI, !0), i.closePath(), i.fill(), i.fillStyle = "rgb(0,255,255)", i.beginPath(), i.arc(100, 50, 50, 0, 2 * Math.PI, !0), i.closePath(), i.fill(), i.fillStyle = "rgb(255,255,0)", i.beginPath(), i.arc(75, 100, 50, 0, 2 * Math.PI, !0), i.closePath(), i.fill(), i.fillStyle = "rgb(255,0,255)", i.arc(75, 75, 75, 0, 2 * Math.PI, !0), i.arc(75, 75, 25, 0, 2 * Math.PI, !0), i.fill("evenodd"), e.push("canvas fp:" + t.toDataURL()), e.join("~") }, getWebglFp: function () { var e, t = function (t) { return e.clearColor(0, 0, 0, 1), e.enable(e.DEPTH_TEST), e.depthFunc(e.LEQUAL), e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT), "[" + t[0] + ", " + t[1] + "]" }, i = function (e) { var t, i = e.getExtension("EXT_texture_filter_anisotropic") || e.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || e.getExtension("MOZ_EXT_texture_filter_anisotropic"); return i ? (t = e.getParameter(i.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === t && (t = 2), t) : null }; if (e = this.getWebglCanvas(), !e) return null; var a = [], r = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}", n = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}", o = e.createBuffer(); e.bindBuffer(e.ARRAY_BUFFER, o); var s = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]); e.bufferData(e.ARRAY_BUFFER, s, e.STATIC_DRAW), o.itemSize = 3, o.numItems = 3; var l = e.createProgram(), h = e.createShader(e.VERTEX_SHADER); e.shaderSource(h, r), e.compileShader(h); var u = e.createShader(e.FRAGMENT_SHADER); e.shaderSource(u, n), e.compileShader(u), e.attachShader(l, h), e.attachShader(l, u), e.linkProgram(l), e.useProgram(l), l.vertexPosAttrib = e.getAttribLocation(l, "attrVertex"), l.offsetUniform = e.getUniformLocation(l, "uniformOffset"), e.enableVertexAttribArray(l.vertexPosArray), e.vertexAttribPointer(l.vertexPosAttrib, o.itemSize, e.FLOAT, !1, 0, 0), e.uniform2f(l.offsetUniform, 1, 1), e.drawArrays(e.TRIANGLE_STRIP, 0, o.numItems), null != e.canvas && a.push(e.canvas.toDataURL()), a.push("extensions:" + e.getSupportedExtensions().join(";")), a.push("webgl aliased line width range:" + t(e.getParameter(e.ALIASED_LINE_WIDTH_RANGE))), a.push("webgl aliased point size range:" + t(e.getParameter(e.ALIASED_POINT_SIZE_RANGE))), a.push("webgl alpha bits:" + e.getParameter(e.ALPHA_BITS)), a.push("webgl antialiasing:" + (e.getContextAttributes().antialias ? "yes" : "no")), a.push("webgl blue bits:" + e.getParameter(e.BLUE_BITS)), a.push("webgl depth bits:" + e.getParameter(e.DEPTH_BITS)), a.push("webgl green bits:" + e.getParameter(e.GREEN_BITS)), a.push("webgl max anisotropy:" + i(e)), a.push("webgl max combined texture image units:" + e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS)), a.push("webgl max cube map texture size:" + e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE)), a.push("webgl max fragment uniform vectors:" + e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS)), a.push("webgl max render buffer size:" + e.getParameter(e.MAX_RENDERBUFFER_SIZE)), a.push("webgl max texture image units:" + e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS)), a.push("webgl max texture size:" + e.getParameter(e.MAX_TEXTURE_SIZE)), a.push("webgl max varying vectors:" + e.getParameter(e.MAX_VARYING_VECTORS)), a.push("webgl max vertex attribs:" + e.getParameter(e.MAX_VERTEX_ATTRIBS)), a.push("webgl max vertex texture image units:" + e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)), a.push("webgl max vertex uniform vectors:" + e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS)), a.push("webgl max viewport dims:" + t(e.getParameter(e.MAX_VIEWPORT_DIMS))), a.push("webgl red bits:" + e.getParameter(e.RED_BITS)), a.push("webgl renderer:" + e.getParameter(e.RENDERER)), a.push("webgl shading language version:" + e.getParameter(e.SHADING_LANGUAGE_VERSION)), a.push("webgl stencil bits:" + e.getParameter(e.STENCIL_BITS)), a.push("webgl vendor:" + e.getParameter(e.VENDOR)), a.push("webgl version:" + e.getParameter(e.VERSION)); try { var c = e.getExtension("WEBGL_debug_renderer_info"); c && (a.push("webgl unmasked vendor:" + e.getParameter(c.UNMASKED_VENDOR_WEBGL)), a.push("webgl unmasked renderer:" + e.getParameter(c.UNMASKED_RENDERER_WEBGL))); } catch (d) { } return e.getShaderPrecisionFormat ? (a.push("webgl vertex shader high float precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).precision), a.push("webgl vertex shader high float precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).rangeMin), a.push("webgl vertex shader high float precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).rangeMax), a.push("webgl vertex shader medium float precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).precision), a.push("webgl vertex shader medium float precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).rangeMin), a.push("webgl vertex shader medium float precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).rangeMax), a.push("webgl vertex shader low float precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_FLOAT).precision), a.push("webgl vertex shader low float precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_FLOAT).rangeMin), a.push("webgl vertex shader low float precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_FLOAT).rangeMax), a.push("webgl fragment shader high float precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision), a.push("webgl fragment shader high float precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).rangeMin), a.push("webgl fragment shader high float precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).rangeMax), a.push("webgl fragment shader medium float precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).precision), a.push("webgl fragment shader medium float precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).rangeMin), a.push("webgl fragment shader medium float precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).rangeMax), a.push("webgl fragment shader low float precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_FLOAT).precision), a.push("webgl fragment shader low float precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_FLOAT).rangeMin), a.push("webgl fragment shader low float precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_FLOAT).rangeMax), a.push("webgl vertex shader high int precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_INT).precision), a.push("webgl vertex shader high int precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_INT).rangeMin), a.push("webgl vertex shader high int precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_INT).rangeMax), a.push("webgl vertex shader medium int precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_INT).precision), a.push("webgl vertex shader medium int precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_INT).rangeMin), a.push("webgl vertex shader medium int precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_INT).rangeMax), a.push("webgl vertex shader low int precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_INT).precision), a.push("webgl vertex shader low int precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_INT).rangeMin), a.push("webgl vertex shader low int precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_INT).rangeMax), a.push("webgl fragment shader high int precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_INT).precision), a.push("webgl fragment shader high int precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_INT).rangeMin), a.push("webgl fragment shader high int precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_INT).rangeMax), a.push("webgl fragment shader medium int precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_INT).precision), a.push("webgl fragment shader medium int precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_INT).rangeMin), a.push("webgl fragment shader medium int precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_INT).rangeMax), a.push("webgl fragment shader low int precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_INT).precision), a.push("webgl fragment shader low int precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_INT).rangeMin), a.push("webgl fragment shader low int precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_INT).rangeMax), a.join("~")) : a.join("~") }, getAdBlock: function () { var e = document.createElement("div"); e.innerHTML = "&nbsp;", e.className = "adsbox"; var t = !1; try { document.body.appendChild(e), t = 0 === document.getElementsByClassName("adsbox")[0].offsetHeight, document.body.removeChild(e); } catch (i) { t = !1; } return t }, getHasLiedLanguages: function () { if ("undefined" != typeof navigator.languages) try { var e = navigator.languages[0].substr(0, 2); if (e !== navigator.language.substr(0, 2)) return !0 } catch (t) { return !0 } return !1 }, getHasLiedResolution: function () { return screen.width < screen.availWidth || screen.height < screen.availHeight }, getHasLiedOs: function () { var e, t = navigator.userAgent.toLowerCase(), i = navigator.oscpu, a = navigator.platform.toLowerCase(); e = t.indexOf("windows phone") >= 0 ? "Windows Phone" : t.indexOf("win") >= 0 ? "Windows" : t.indexOf("android") >= 0 ? "Android" : t.indexOf("linux") >= 0 ? "Linux" : t.indexOf("iphone") >= 0 || t.indexOf("ipad") >= 0 ? "iOS" : t.indexOf("mac") >= 0 ? "Mac" : "Other"; var r; if (r = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0, r && "Windows Phone" !== e && "Android" !== e && "iOS" !== e && "Other" !== e) return !0; if ("undefined" != typeof i) { if (i = i.toLowerCase(), i.indexOf("win") >= 0 && "Windows" !== e && "Windows Phone" !== e) return !0; if (i.indexOf("linux") >= 0 && "Linux" !== e && "Android" !== e) return !0; if (i.indexOf("mac") >= 0 && "Mac" !== e && "iOS" !== e) return !0; if (0 === i.indexOf("win") && 0 === i.indexOf("linux") && i.indexOf("mac") >= 0 && "other" !== e) return !0 } return a.indexOf("win") >= 0 && "Windows" !== e && "Windows Phone" !== e || ((a.indexOf("linux") >= 0 || a.indexOf("android") >= 0 || a.indexOf("pike") >= 0) && "Linux" !== e && "Android" !== e || ((a.indexOf("mac") >= 0 || a.indexOf("ipad") >= 0 || a.indexOf("ipod") >= 0 || a.indexOf("iphone") >= 0) && "Mac" !== e && "iOS" !== e || (0 === a.indexOf("win") && 0 === a.indexOf("linux") && a.indexOf("mac") >= 0 && "other" !== e || "undefined" == typeof navigator.plugins && "Windows" !== e && "Windows Phone" !== e))) }, getHasLiedBrowser: function () { var e, t = navigator.userAgent.toLowerCase(), i = navigator.productSub; if (e = t.indexOf("firefox") >= 0 ? "Firefox" : t.indexOf("opera") >= 0 || t.indexOf("opr") >= 0 ? "Opera" : t.indexOf("chrome") >= 0 ? "Chrome" : t.indexOf("safari") >= 0 ? "Safari" : t.indexOf("trident") >= 0 ? "Internet Explorer" : "Other", ("Chrome" === e || "Safari" === e || "Opera" === e) && "20030107" !== i) return !0; var a = eval.toString().length; if (37 === a && "Safari" !== e && "Firefox" !== e && "Other" !== e) return !0; if (39 === a && "Internet Explorer" !== e && "Other" !== e) return !0; if (33 === a && "Chrome" !== e && "Opera" !== e && "Other" !== e) return !0; var r; try { throw "a" } catch (n) { try { n.toSource(), r = !0; } catch (o) { r = !1; } } return !(!r || "Firefox" === e || "Other" === e) }, isCanvasSupported: function () { var e = document.createElement("canvas"); return !(!e.getContext || !e.getContext("2d")) }, isWebGlSupported: function () { if (!this.isCanvasSupported()) return !1; var e, t = document.createElement("canvas"); try { e = t.getContext && (t.getContext("webgl") || t.getContext("experimental-webgl")); } catch (i) { e = !1; } return !!window.WebGLRenderingContext && !!e }, isIE: function () { return "Microsoft Internet Explorer" === navigator.appName || !("Netscape" !== navigator.appName || !/Trident/.test(navigator.userAgent)) }, hasSwfObjectLoaded: function () { return "undefined" != typeof window.swfobject }, hasMinFlashInstalled: function () { return swfobject.hasFlashPlayerVersion("9.0.0") }, addFlashDivNode: function () { var e = document.createElement("div"); e.setAttribute("id", this.options.swfContainerId), document.body.appendChild(e); }, loadSwfAndDetectFonts: function (e) { var t = "___fp_swf_loaded"; window[t] = function (t) { e(t); }; var i = this.options.swfContainerId; this.addFlashDivNode(); var a = { onReady: t }, r = { allowScriptAccess: "always", menu: "false" }; swfobject.embedSWF(this.options.swfPath, i, "1", "1", "9.0.0", !1, a, r, {}); }, getWebglCanvas: function () { var e = document.createElement("canvas"), t = null; try { t = e.getContext("webgl") || e.getContext("experimental-webgl"); } catch (i) { } return t || (t = null), t }, each: function (e, t, i) { if (null !== e) if (this.nativeForEach && e.forEach === this.nativeForEach) e.forEach(t, i); else if (e.length === +e.length) { for (var a = 0, r = e.length; a < r; a++)if (t.call(i, e[a], a, e) === {}) return } else for (var n in e) if (e.hasOwnProperty(n) && t.call(i, e[n], n, e) === {}) return }, map: function (e, t, i) { var a = []; return null == e ? a : this.nativeMap && e.map === this.nativeMap ? e.map(t, i) : (this.each(e, function (e, r, n) { a[a.length] = t.call(i, e, r, n); }), a) }, x64Add: function (e, t) { e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]], t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]]; var i = [0, 0, 0, 0]; return i[3] += e[3] + t[3], i[2] += i[3] >>> 16, i[3] &= 65535, i[2] += e[2] + t[2], i[1] += i[2] >>> 16, i[2] &= 65535, i[1] += e[1] + t[1], i[0] += i[1] >>> 16, i[1] &= 65535, i[0] += e[0] + t[0], i[0] &= 65535, [i[0] << 16 | i[1], i[2] << 16 | i[3]] }, x64Multiply: function (e, t) { e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]], t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]]; var i = [0, 0, 0, 0]; return i[3] += e[3] * t[3], i[2] += i[3] >>> 16, i[3] &= 65535, i[2] += e[2] * t[3], i[1] += i[2] >>> 16, i[2] &= 65535, i[2] += e[3] * t[2], i[1] += i[2] >>> 16, i[2] &= 65535, i[1] += e[1] * t[3], i[0] += i[1] >>> 16, i[1] &= 65535, i[1] += e[2] * t[2], i[0] += i[1] >>> 16, i[1] &= 65535, i[1] += e[3] * t[1], i[0] += i[1] >>> 16, i[1] &= 65535, i[0] += e[0] * t[3] + e[1] * t[2] + e[2] * t[1] + e[3] * t[0], i[0] &= 65535, [i[0] << 16 | i[1], i[2] << 16 | i[3]] }, x64Rotl: function (e, t) { return t %= 64, 32 === t ? [e[1], e[0]] : t < 32 ? [e[0] << t | e[1] >>> 32 - t, e[1] << t | e[0] >>> 32 - t] : (t -= 32, [e[1] << t | e[0] >>> 32 - t, e[0] << t | e[1] >>> 32 - t]) }, x64LeftShift: function (e, t) { return t %= 64, 0 === t ? e : t < 32 ? [e[0] << t | e[1] >>> 32 - t, e[1] << t] : [e[1] << t - 32, 0] }, x64Xor: function (e, t) { return [e[0] ^ t[0], e[1] ^ t[1]] }, x64Fmix: function (e) { return e = this.x64Xor(e, [0, e[0] >>> 1]), e = this.x64Multiply(e, [4283543511, 3981806797]), e = this.x64Xor(e, [0, e[0] >>> 1]), e = this.x64Multiply(e, [3301882366, 444984403]), e = this.x64Xor(e, [0, e[0] >>> 1]) }, x64hash128: function (e, t) {
                    e = e || "", t = t || 0; for (var i = e.length % 16, a = e.length - i, r = [0, t], n = [0, t], o = [0, 0], s = [0, 0], l = [2277735313, 289559509], h = [1291169091, 658871167], u = 0; u < a; u += 16)o = [255 & e.charCodeAt(u + 4) | (255 & e.charCodeAt(u + 5)) << 8 | (255 & e.charCodeAt(u + 6)) << 16 | (255 & e.charCodeAt(u + 7)) << 24, 255 & e.charCodeAt(u) | (255 & e.charCodeAt(u + 1)) << 8 | (255 & e.charCodeAt(u + 2)) << 16 | (255 & e.charCodeAt(u + 3)) << 24], s = [255 & e.charCodeAt(u + 12) | (255 & e.charCodeAt(u + 13)) << 8 | (255 & e.charCodeAt(u + 14)) << 16 | (255 & e.charCodeAt(u + 15)) << 24, 255 & e.charCodeAt(u + 8) | (255 & e.charCodeAt(u + 9)) << 8 | (255 & e.charCodeAt(u + 10)) << 16 | (255 & e.charCodeAt(u + 11)) << 24], o = this.x64Multiply(o, l), o = this.x64Rotl(o, 31), o = this.x64Multiply(o, h), r = this.x64Xor(r, o), r = this.x64Rotl(r, 27), r = this.x64Add(r, n), r = this.x64Add(this.x64Multiply(r, [0, 5]), [0, 1390208809]), s = this.x64Multiply(s, h), s = this.x64Rotl(s, 33), s = this.x64Multiply(s, l), n = this.x64Xor(n, s), n = this.x64Rotl(n, 31), n = this.x64Add(n, r), n = this.x64Add(this.x64Multiply(n, [0, 5]), [0, 944331445]); switch (o = [0, 0], s = [0, 0], i) { case 15: s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 14)], 48)); case 14: s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 13)], 40)); case 13: s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 12)], 32)); case 12: s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 11)], 24)); case 11: s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 10)], 16)); case 10: s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 9)], 8)); case 9: s = this.x64Xor(s, [0, e.charCodeAt(u + 8)]), s = this.x64Multiply(s, h), s = this.x64Rotl(s, 33), s = this.x64Multiply(s, l), n = this.x64Xor(n, s); case 8: o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(u + 7)], 56)); case 7: o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(u + 6)], 48)); case 6: o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(u + 5)], 40)); case 5: o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(u + 4)], 32)); case 4: o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(u + 3)], 24)); case 3: o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(u + 2)], 16)); case 2: o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(u + 1)], 8)); case 1: o = this.x64Xor(o, [0, e.charCodeAt(u)]), o = this.x64Multiply(o, l), o = this.x64Rotl(o, 31), o = this.x64Multiply(o, h), r = this.x64Xor(r, o); }return r = this.x64Xor(r, [0, e.length]), n = this.x64Xor(n, [0, e.length]), r = this.x64Add(r, n), n = this.x64Add(n, r), r = this.x64Fmix(r), n = this.x64Fmix(n), r = this.x64Add(r, n), n = this.x64Add(n, r), ("00000000" + (r[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (r[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (n[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (n[1] >>> 0).toString(16)).slice(-8)
                }
            }, e.VERSION = "1.5.1", e
        });
    });

    /**
     * @this {Promise}
     */
    function finallyConstructor(callback) {
        var constructor = this.constructor;
        return this.then(
            function (value) {
                return constructor.resolve(callback()).then(function () {
                    return value;
                });
            },
            function (reason) {
                return constructor.resolve(callback()).then(function () {
                    return constructor.reject(reason);
                });
            }
        );
    }

    // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var setTimeoutFunc = setTimeout;

    function noop() { }

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
        return function () {
            fn.apply(thisArg, arguments);
        };
    }

    /**
     * @constructor
     * @param {Function} fn
     */
    function Promise$1(fn) {
        if (!(this instanceof Promise$1))
            throw new TypeError('Promises must be constructed via new');
        if (typeof fn !== 'function') throw new TypeError('not a function');
        /** @type {!number} */
        this._state = 0;
        /** @type {!boolean} */
        this._handled = false;
        /** @type {Promise|undefined} */
        this._value = undefined;
        /** @type {!Array<!Function>} */
        this._deferreds = [];

        doResolve(fn, this);
    }

    function handle(self, deferred) {
        while (self._state === 3) {
            self = self._value;
        }
        if (self._state === 0) {
            self._deferreds.push(deferred);
            return;
        }
        self._handled = true;
        Promise$1._immediateFn(function () {
            var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
                (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                return;
            }
            var ret;
            try {
                ret = cb(self._value);
            } catch (e) {
                reject(deferred.promise, e);
                return;
            }
            resolve(deferred.promise, ret);
        });
    }

    function resolve(self, newValue) {
        try {
            // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
            if (newValue === self)
                throw new TypeError('A promise cannot be resolved with itself.');
            if (
                newValue &&
                (typeof newValue === 'object' || typeof newValue === 'function')
            ) {
                var then = newValue.then;
                if (newValue instanceof Promise$1) {
                    self._state = 3;
                    self._value = newValue;
                    finale(self);
                    return;
                } else if (typeof then === 'function') {
                    doResolve(bind(then, newValue), self);
                    return;
                }
            }
            self._state = 1;
            self._value = newValue;
            finale(self);
        } catch (e) {
            reject(self, e);
        }
    }

    function reject(self, newValue) {
        self._state = 2;
        self._value = newValue;
        finale(self);
    }

    function finale(self) {
        if (self._state === 2 && self._deferreds.length === 0) {
            Promise$1._immediateFn(function () {
                if (!self._handled) {
                    Promise$1._unhandledRejectionFn(self._value);
                }
            });
        }

        for (var i = 0, len = self._deferreds.length; i < len; i++) {
            handle(self, self._deferreds[i]);
        }
        self._deferreds = null;
    }

    /**
     * @constructor
     */
    function Handler(onFulfilled, onRejected, promise) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.promise = promise;
    }

    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, self) {
        var done = false;
        try {
            fn(
                function (value) {
                    if (done) return;
                    done = true;
                    resolve(self, value);
                },
                function (reason) {
                    if (done) return;
                    done = true;
                    reject(self, reason);
                }
            );
        } catch (ex) {
            if (done) return;
            done = true;
            reject(self, ex);
        }
    }

    Promise$1.prototype['catch'] = function (onRejected) {
        return this.then(null, onRejected);
    };

    Promise$1.prototype.then = function (onFulfilled, onRejected) {
        // @ts-ignore
        var prom = new this.constructor(noop);

        handle(this, new Handler(onFulfilled, onRejected, prom));
        return prom;
    };

    Promise$1.prototype['finally'] = finallyConstructor;

    Promise$1.all = function (arr) {
        return new Promise$1(function (resolve, reject) {
            if (!arr || typeof arr.length === 'undefined')
                throw new TypeError('Promise.all accepts an array');
            var args = Array.prototype.slice.call(arr);
            if (args.length === 0) return resolve([]);
            var remaining = args.length;

            function res(i, val) {
                try {
                    if (val && (typeof val === 'object' || typeof val === 'function')) {
                        var then = val.then;
                        if (typeof then === 'function') {
                            then.call(
                                val,
                                function (val) {
                                    res(i, val);
                                },
                                reject
                            );
                            return;
                        }
                    }
                    args[i] = val;
                    if (--remaining === 0) {
                        resolve(args);
                    }
                } catch (ex) {
                    reject(ex);
                }
            }

            for (var i = 0; i < args.length; i++) {
                res(i, args[i]);
            }
        });
    };

    Promise$1.resolve = function (value) {
        if (value && typeof value === 'object' && value.constructor === Promise$1) {
            return value;
        }

        return new Promise$1(function (resolve) {
            resolve(value);
        });
    };

    Promise$1.reject = function (value) {
        return new Promise$1(function (resolve, reject) {
            reject(value);
        });
    };

    Promise$1.race = function (values) {
        return new Promise$1(function (resolve, reject) {
            for (var i = 0, len = values.length; i < len; i++) {
                values[i].then(resolve, reject);
            }
        });
    };

    // Use polyfill for setImmediate for performance gains
    Promise$1._immediateFn =
        (typeof setImmediate === 'function' &&
            function (fn) {
                setImmediate(fn);
            }) ||
        function (fn) {
            setTimeoutFunc(fn, 0);
        };

    Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
        if (typeof console !== 'undefined' && console) {
            console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
        }
    };

    /** @suppress {undefinedVars} */
    var globalNS = (function () {
        // the only reliable means to get the global object is
        // `Function('return this')()`
        // However, this causes CSP violations in Chrome apps.
        if (typeof self !== 'undefined') {
            return self;
        }
        if (typeof window !== 'undefined') {
            return window;
        }
        if (typeof global !== 'undefined') {
            return global;
        }
        throw new Error('unable to locate global object');
    })();

    if (!('Promise' in globalNS)) {
        globalNS['Promise'] = Promise$1;
    } else if (!globalNS.Promise.prototype['finally']) {
        globalNS.Promise.prototype['finally'] = finallyConstructor;
    }

    // network包
    // -----------------------------------------

    var sDeviceId = void 0; // 设备Id
    fingerprint2_min().get(function (result, components) {
        sDeviceId = result;
    });
    /**
     * 是否支持localstorage 和是否支持localstorage 存储删除数据
     */
    function isLocalStorageSupport() {
        try {
            var isSupport = 'localStorage' in window && window['localStorage'] !== null;
            if (isSupport) {
                // 防止无痕模式下，假装支持localstorage 调用setItem就会报错的情况
                storage.setItem('___testSetItem__', '___testSetItem__');
                storage.removeItem('___testSetItem__');
            }
            return isSupport;
        } catch (error) {
            LogProxy_e('您的浏览器版本不支持localstorage');
            return false;
        }
    }
    /**
     * Fingerprintjs2生产deviceID
     */
    function getDeviceId() {
        return new Promise(function (resolve) {
            fingerprint2_min().get(function (result, components) {
                resolve(result);
            });
        });
    }
    /**
     * 保存设备信息
     * @param info
     */
    function LocalStoragePersist_saveDeviceInfo(info) {
        if (isLocalStorageSupport()) {
            storage.setItem(KEY_DEVICE_INFO, info);
        }
    }
    /**
     * 获取设备信息
     * @returns {string|null}
     */
    function LocalStoragePersist_queryDeviceInfo() {
        if (isLocalStorageSupport()) {
            return storage.getItem(KEY_DEVICE_INFO);
        }
        return null;
    }
    /**
     * 读取收集数据 ---locasStorage
     */
    function LocalStoragePersist_queryCollecteData() {
        if (isLocalStorageSupport()) {
            var count = 0;
            var data = new CollectedData();
            var keyArr = [];
            for (var i = 0; i < storage.length; i++) {
                var key = storage.key(i);
                if (/^atlas_data/.test(key)) {
                    count++;
                    keyArr.push(key);
                    var temp = storage.getItem(key);
                    if (window.atob) {
                        try {
                            temp = decodeURIComponent(window.atob(temp));
                        } catch (error) {
                            LogProxy_e('解析localstorage失败');
                        }
                    }
                    var item = temp;
                    try {
                        item = JSON.parse(temp);
                    } catch (error) {
                        continue;
                    }
                    switch (key.split('_')[2]) {// 数据类型 0：会话数据 1：事件数据 2：错误数据
                        case '0':
                            data.sessionList.push(item);
                            break;
                        case '1':
                            data.eventList.push(item);
                            break;
                        case '2':
                            data.errorList.push(item);
                            break;
                    }
                }
                if (count >= LIMIT_TIMES) {
                    count = 0;
                    break;
                }
            }
            return {
                data: data,
                keys: keyArr
            };
        }
        return null;
    }
    /**
     * 保持收集数据 ---locasStorage
     */
    function LocalStoragePersist_saveCollectedData() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var data = arguments[1];

        if (!isLocalStorageSupport()) return;
        var key = 'atlas_data_' + type + '_' + guid();
        var temp = JSON.stringify(data);
        if (window.btoa) {
            temp = window.btoa(encodeURIComponent(temp));
        }
        storage.setItem(key, temp);
    }
    /**
     * 清空收集数据 ---locasStorage
     */
    function LocalStoragePersist_clearCollectedData(storageKey) {
        if (!isLocalStorageSupport() || storageKey === undefined || storageKey === null) return;
        for (var i = 0; i < storageKey.length; i++) {
            var key = storageKey[i];
            storage.removeItem(key);
        }
    }
    /**
     * Object.assign Polyfill
     * @param {*} target
     * @param  {...any} sources
     */
    function assign(target) {
        for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            sources[_key - 1] = arguments[_key];
        }

        // Object.assign Polyfill
        if (typeof Object.assign !== 'function') {
            // Must be writable: true, enumerable: false, configurable: true
            Object.defineProperty(Object, 'assign', {
                value: function assign(target, varArgs) {
                    // .length of function is 2
                    if (target == null) {
                        // TypeError if undefined or null
                        throw new TypeError('Cannot convert undefined or null to object');
                    }
                    var to = Object(target);
                    for (var index = 1; index < arguments.length; index++) {
                        var nextSource = arguments[index];
                        if (nextSource != null) {
                            // Skip over if undefined or null
                            for (var nextKey in nextSource) {
                                // Avoid bugs when hasOwnProperty is shadowed
                                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                    to[nextKey] = nextSource[nextKey];
                                }
                            }
                        }
                    }
                    return to;
                },
                writable: true,
                configurable: true
            });
        }
        return Object.assign.apply(Object, [target].concat(sources));
    }

    // -----------------------------------------
    // utils包
    // + v1.6 activity_id概念
    // ActivityIdResolver
    // AppInfoResolver
    var sAppKey = void 0;
    var sVersionName = void 0;
    var sChannelId = void 0;
    /**
     * 保存AppKey与应用版本
     * @param appKey
     * @param appVer 应用版本
     */
    function AppInfoResolver_saveInfo(appKey, appVer, channelId) {
        sAppKey = appKey;
        sVersionName = appVer;
        sChannelId = channelId;
    }
    /**
     * 获取应用版本号
     * @returns {*} 版本号
     */
    function AppInfoResolver_getVersionName() {
        return sVersionName;
    }
    /**
     * 获取AppKey
     * @returns {*} AppKey
     */
    function AppInfoResolver_getAppKey() {
        return sAppKey;
    }
    /**
     * 获取渠道
     * @returns {*} AppKey
     */
    function AppInfoResolver_getChannelId() {
        return sChannelId;
    }
    // guid
    /**
     * 生成唯一标识
     * @returns {string}
     */
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    }
    /**
     * 字符串转成二进制
     * @param str
     * @returns {*}
     */
    function string2buf(str) {
        var i = void 0;
        var c = void 0;
        var c2 = void 0;
        var buf = void 0;
        var m_pos = void 0;
        var buf_len = 0;
        var str_len = str.length;
        // count binary size
        for (m_pos = 0; m_pos < str_len; m_pos++) {
            c = str.charCodeAt(m_pos);
            if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
                c2 = str.charCodeAt(m_pos + 1);
                if ((c2 & 0xfc00) === 0xdc00) {
                    c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
                    m_pos++;
                }
            }
            buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
        }
        // allocate buffer
        buf = new Uint8Array(buf_len);
        // convert
        for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
            c = str.charCodeAt(m_pos);
            if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
                c2 = str.charCodeAt(m_pos + 1);
                if ((c2 & 0xfc00) === 0xdc00) {
                    c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
                    m_pos++;
                }
            }
            if (c < 0x80) {
                /* one byte */
                buf[i++] = c;
            } else if (c < 0x800) {
                /* two bytes */
                buf[i++] = 0xC0 | c >>> 6;
                buf[i++] = 0x80 | c & 0x3f;
            } else if (c < 0x10000) {
                /* three bytes */
                buf[i++] = 0xE0 | c >>> 12;
                buf[i++] = 0x80 | c >>> 6 & 0x3f;
                buf[i++] = 0x80 | c & 0x3f;
            } else {
                /* four bytes */
                buf[i++] = 0xf0 | c >>> 18;
                buf[i++] = 0x80 | c >>> 12 & 0x3f;
                buf[i++] = 0x80 | c >>> 6 & 0x3f;
                buf[i++] = 0x80 | c & 0x3f;
            }
        }
        return buf;
    }
    /**
     * 获取设备id
     * @returns {*}
     */
    function DeviceInfoResolver_getDeviceId() {
        return sDeviceId;
    }
    function DeviceInfoResolver_setDeviceId() {
        return new Promise(function (resolve) {
            if (sDeviceId) {
                resolve(sDeviceId);
            } else {
                fingerprint2_min().get(function (result, components) {
                    sDeviceId = result;
                    resolve(result);
                });
            }
        });
    }
    /**
     * 解析设备信息（如果有已保存的设备信息，则取出，否则重新生成）
     */
    function DeviceInfoResolver_resolveDeviceInfo() {
        var deviceInfoStr = LocalStoragePersist_queryDeviceInfo() || '{}';
        var deviceInfo = void 0;
        try {
            deviceInfo = JSON.parse(deviceInfoStr);
        } catch (e) {
            LogProxy_e('Resolve deviceInfo failed', e);
        }
        if (deviceInfo && deviceInfo.deviceId) {
            sDeviceId = deviceInfo.deviceId;
            LogProxy_d('Resolve exist deviceId : ' + sDeviceId);
        } else {
            getDeviceId().then(function (deviceId) {
                sDeviceId = deviceId;
                LocalStoragePersist_saveDeviceInfo(JSON.stringify({
                    deviceId: sDeviceId
                }));
                LogProxy_d('No exist deviceId, generate one : ' + sDeviceId);
            });
        }
    }
    // CurrentTimeHelper
    /**
     * 获取当前时间毫秒数
     * @returns {number}
     */
    function CurrentTimeHelper_currentTimeMillis() {
        var myDate = new Date();
        return myDate.getTime();
    }
    /**
     * 给时间增加格式化支持
     * @param date 日期对象
     * @returns {*} 格式化后的字符串
     */
    function CurrentTimeHelper_formatDate(date) {
        function pad(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        }
        function calculateTimezone(offset) {
            var tzo = -offset;
            var dif = tzo >= 0 ? '+' : '-';
            return dif + pad(offset / 60) + pad(offset % 60);
        }
        return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.' + pad(date.getMilliseconds()) + calculateTimezone(date.getTimezoneOffset());
    }
    /**
     * @export
     * @param {*} url:string
     * @param {*} attr: [index: string]: string;
     * @param {*} el: string; link / script
     * @returns
     */
    function loadFile(url, elType, attr) {
        var elements = {
            'link': {
                src: 'href',
                defaultAttr: 'rel',
                textType: 'stylesheet'
            },
            'script': {
                src: 'src',
                defaultAttr: 'type',
                textType: 'text/javascript'
            }
        };
        var element = elements[elType];
        return new Promise(function (resolve, reject) {
            var el = document.createElement(elType);
            el.addEventListener('load', function (e) {
                document.body.appendChild(el);
                resolve(e);
            }, false);
            el.addEventListener('error', function (e) {
                document.body.removeChild(el);
                reject(e);
            }, false);
            if (attr) {
                var _iterator = Object.keys(attr);
                var _isArray = Array.isArray(_iterator);
                var _i = 0;
                _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
                while (true) {
                    var _ref;

                    if (_isArray) {
                        if (_i >= _iterator.length) break;
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if (_i.done) break;
                        _ref = _i.value;
                    }

                    var val = _ref;

                    el.setAttribute(val, attr[val]);
                }
            }
            el[element.src] = url;
            el[element.defaultAttr] = element.textType;
            document.head.appendChild(el);
        });
    }

    // debug包
    var sIsDebugMode = false; // 是否为调试模式
    // log包
    // LogProxy
    var sIsLogEnabled = false; // 是否输出日志

    var sActivityId = null; //

    var sIsImmediately = true; // 是否为立即上传模式
    //  设置是否为立即上传模式
    function setImmediately(isImmediately) {
        sIsImmediately = isImmediately;
    }

    // TODO sendtrack方法
    var Constant_HOST = 'http://cloud-atlas-collection.oth.web.sdp.101.com/';

    // 更新次数上限，达到则触发上传机制
    var LIMIT_TIMES = 5;

    var autoURL = 'http://cloud-atlas-server.pre1.web.nd/';
    /**
     * 更新次数上限，达到则触发上传机制
     * @param limitTime 上传限制次数
     */
    function setLimitTime(limitTime) {
        LIMIT_TIMES = limitTime;
    }
    /**
     *设置是否为调试模式
     * @param isDebugMode true-是，false-否
     */
    function DebugHelper_setIsDebugMode(isDebugMode) {
        sIsDebugMode = isDebugMode;
    }
    /**
     * 设置是否启用日志输出
     * @param isLogEnabled true-启用，false-不启用
     *
     */
    function LogProxy_setLogEnabled(isLogEnabled) {
        sIsLogEnabled = isLogEnabled;
    }
    /**
     * 获取活动ID
     */

    /**
     * 创建活动ID
     */
    function ActivityIdResolver_createActivityId() {
        sActivityId = guid();
    }
    function setUploadEnv(env, useHttps) {
        var host = void 0;
        switch (env) {
            case 'PRODUCTION':
                // 生产
                {
                    if (useHttps) {
                        host = 'cloud-atlas-collection.sdp.101.com/';
                    } else {
                        host = 'cloud-atlas-collection.oth.web.sdp.101.com/';
                    }
                    break;
                }
            case 'PREPRODUCTION':
                // 预生产
                {
                    if (useHttps) {
                        host = 'cloud-atlas-collection.beta.101.com/';
                    } else {
                        host = 'cloud-atlas-collection.beta.web.sdp.101.com/';
                    }
                    break;
                }
            case 'DEVELOPMENT':
                // 开发
                {
                    host = 'cloud-atlas-collection.dev.web.nd/';
                    break;
                }
            case 'DEBUG':
                // 测试（未使用）
                {
                    host = 'cloud-atlas-collection.debug.web.nd/';
                    break;
                }
            case 'INTEGRATION':
                // 集成
                {
                    host = 'cloud-atlas-collection.pre1.web.nd/';
                    break;
                }
            default:
                {
                    host = 'cloud-atlas-collection.oth.web.sdp.101.com/';
                }
        }
        if (useHttps) {
            Constant_HOST = 'https://' + host;
        } else {
            Constant_HOST = 'http://' + host;
        }
    }
    function setAutoTrackEnv(env, useHttps) {
        switch (env) {
            case 'DEVELOPMENT':
                // 开发
                {
                    autoURL = 'http://cloud-atlas-server.dev.web.nd/';
                    break;
                }
            case 'DEBUG':
                // 测试（未使用）
                {
                    autoURL = 'http://cloud-atlas-server.debug.web.nd/';
                    break;
                }
            case 'INTEGRATION':
                // 集成
                {
                    autoURL = 'http://cloud-atlas-server.pre1.web.nd/';
                    break;
                }
            case 'PREPRODUCTION':
                // 预生产
                {
                    if (useHttps) {
                        autoURL = 'https://cloud-atlas-server.beta.101.com/';
                    } else {
                        autoURL = 'http://cloud-atlas-server.beta.101.com/';
                    }
                    break;
                }
            case 'PRODUCTION':
                // 生产
                {
                    if (useHttps) {
                        autoURL = 'https://cloud-atlas-server.sdp.101.com/';
                    } else {
                        autoURL = 'http://cloud-atlas-server.sdp.101.com/';
                    }
                    // host = '192.168.252.79:8088/'
                    break;
                }
            default:
                {
                    autoURL = 'http://cloud-atlas-server.pre1.web.nd/';
                }
        }
    }
    var fileUrl = function () {
        var env = '__ENV';
        var revert = {
            'vendorCss': '',
            'modalJs': '',
            'vendorJs': ''
        };
        var PRODUCT_HOST = 'https://cdncs.101.com/v0.1/static/cloudatlas_cs/websdk';
        switch (env) {
            case 'development':
                revert.vendorCss = 'http://127.0.0.1:8000/lib/vendor.css?t=' + Date.now();
                revert.vendorJs = 'http://127.0.0.1:8000/lib/vendor.js?t=' + Date.now();
                break;
            default:
                // 线上cdn地址
                revert.vendorCss = PRODUCT_HOST + '/v1.7.2/vendor.css';
                revert.vendorJs = PRODUCT_HOST + '/v1.7.2/vendor.js';
        }
        return revert;
    }();
    function setVisualEnv(env) {
        var visualURL = void 0;
        switch (env) {
            case 'DEVELOPMENT':
                {
                    // 开发
                    visualURL = ' http://cloud-atlas-server.dev.web.nd/';
                    break;
                }
            case 'DEBUG':
                {
                    // 测试
                    visualURL = 'http://cloud-atlas-server.debug.web.nd/';
                    break;
                }
            case 'INTEGRATION':
                {
                    // 集成
                    visualURL = 'http://cloud-atlas-server.pre1.web.nd/';
                    break;
                }
            case 'PREPRODUCTION':
                {
                    // 预生产
                    visualURL = 'https://cloud-atlas-server.beta.101.com/';
                    break;
                }
            case 'PRODUCTION':
                {
                    // 生产
                    visualURL = 'https://cloud-atlas-server.sdp.101.com/';
                    break;
                }
            default:
                {
                    visualURL = 'https://cloud-atlas-server.sdp.101.com/';
                }
        }
        return visualURL;
    }

    var sLogger = window.console || function () {
        var c = {};
        c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function (msg) { };
        return c;
    }();
    // 日志输出对象，默认为console
    /**
       * 输出调试日志
       * @param msg 日志内容
       */
    function LogProxy_d(msg) {
        // 兼容IE8
        if (sIsLogEnabled && sLogger.log) {
            sLogger.log(sLogPrefix + msg);
        }
    }
    /**
     * 输出警告日志
     * @param msg 日志内容
     */
    function LogProxy_w(msg) {
        // 兼容IE8
        if (sIsLogEnabled && sLogger.warn) {
            sLogger.warn(sLogPrefix + msg);
        }
    }
    /**
     * 输出错误日志
     * @param msg 日志内容
     * @param error 异常对象
     */
    function LogProxy_e(msg, error) {
        // 兼容IE8
        if (sLogger.error) {
            sLogger.error(sLogPrefix + msg + (error ? '\nerror = ' + error : ''));
        }
    }

    /**
     * 注册公共事件
     * @param callback 回调函数 popstate事件是url改变的时候，或者hashchange事件
     */
    function addHashEvent(callback) {
        var hashEvent = 'onhashchange' in window ? 'hashchange' : 'popstate';
        addEvent(window, hashEvent, callback);
    }
    /**
     * 注册页面不可见时公共事件
     * @param {*} callback
     */
    function addPageViewEvent(callback) {
        var visProp = getHiddenProp();
        if (visProp) {
            var evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
            addEvent(document, evtname, callback);
        } else {
            LogProxy_e('浏览器不支持visibilitychange监听事件');
        }
    }
    // 获取页面隐藏属性
    function getHiddenProp() {
        var prefixes = ['webkit', 'moz', 'ms', 'o'];
        // if 'hidden' is natively supported just return it
        if ('hidden' in document) return 'hidden';
        // otherwise loop over all the known prefixes until we find one
        for (var i = 0; i < prefixes.length; i++) {
            if (prefixes[i] + 'Hidden' in document) {
                return prefixes[i] + 'Hidden';
            }
        }
        // otherwise it's not supported
        return null;
    }
    // 注册事件。可以能浏览器不识别addEventListener，需要用on来注册两个事件。
    function addEvent() {
        function fixEvent(event) {
            if (event) {
                event.preventDefault = fixEvent.preventDefault;
                event.stopPropagation = fixEvent.stopPropagation;
                event._getPath = fixEvent._getPath;
            }
            return event;
        }
        // 元素所在的组成 返回元素事件监听器被触发的一序列的EventTarget对象
        fixEvent._getPath = function () {
            var ev = this;
            var polyfill = function polyfill() {
                try {
                    var element = ev.target;
                    var pathArr = [element];
                    if (element === null || element.parentElement === null) {
                        return [];
                    }
                    while (element.parentElement !== null) {
                        element = element.parentElement;
                        pathArr.unshift(element);
                    }
                    return pathArr;
                } catch (err) {
                    return [];
                }
            };
            return this.path || this.composedPath && this.composedPath() || polyfill();
        };
        fixEvent.preventDefault = function () {
            this.returnValue = false;
        };
        fixEvent.stopPropagation = function () {
            this.cancelBubble = true;
        };
        // 注册事件
        var register_event = function register_event(element, type, handler) {
            if (element && element.addEventListener) {
                element.addEventListener(type, function (e) {
                    e._getPath = fixEvent._getPath;
                    handler.call(this, e);
                }, false);
            } else {
                var ontype = 'on' + type;
                var old_handler = element[ontype];
                element[ontype] = makeHandler(element, handler, old_handler);
            }
        };
        function makeHandler(element, new_handler, old_handlers) {
            var handler = function handler(event) {
                event = event || fixEvent(window.event);
                if (!event) {
                    return undefined;
                }
                event.target = event.srcElement;

                var ret = true;
                var old_result = void 0;
                if (typeof old_handlers === 'function') {
                    old_result = old_handlers(event);
                }
                var new_result = new_handler.call(element, event);
                if (old_result === false || new_result === false) {
                    ret = false;
                }
                return ret;
            };
            return handler;
        }
        register_event.apply(null, arguments);
    }

    /**
     * 获取浏览器的属性信息
     * @author RenZhuo
     */

    /** ***********  设备信息  *************/
    /**
     * 浏览器正在运行操作系统
      */
    function getBrowserOS() {
        var result = {};
        result['os_system'] = browserOs();
        return result;
    }
    /**
     * 浏览器版本
      */
    function getBrowserVersion() {
        var result = {};
        var browser = browserBrand();
        result['system_version'] = browser.version;
        return result;
    }
    /**
     * 浏览器屏幕高度
      */
    function getBrowserHeight() {
        var result = {};
        result['screen_height'] = document.documentElement.clientHeight;
        return result;
    }
    /**
     * 浏览器屏幕宽度
      */
    function getBrowserWidtth() {
        var result = {};
        result['screen_width'] = document.documentElement.clientWidth;
        return result;
    }
    /**
     * 获取浏览器品牌
     */
    function getBrowserBrand() {
        var result = {};
        var browser = browserBrand();
        result['brand'] = browser.name;
        return result;
    }
    /** ***********  设备信息扩展属性  *************/
    var BROWSER = 'browser_'; // 浏览器
    /**
     * 浏览器代码名称
      */
    function getBrowserCodeName() {
        var result = {};
        result[BROWSER + 'codeName'] = navigator.appCodeName;
        return result;
    }
    /**
     * 获取浏览器内核
     */
    function getBrowserCore() {
        var result = {};
        var browser = isBroswer();
        result['kernel'] = browser.name;
        return result;
    }
    /**
     * 浏览器属性信息
      */
    function getBrowserUserAgent() {
        var result = {};
        result[BROWSER + 'userAgent'] = navigator.userAgent;
        return result;
    }
    /**
     * 屏幕分辨率
      */
    function getBrowserResolution() {
        var result = {};
        result[BROWSER + 'resolution'] = window.screen.width + '*' + window.screen.height;
        return result;
    }
    /**
     * 屏幕尺寸
      */
    function getBrowserSize() {
        var result = {};
        var dom = document.createElement('div');
        dom.style.width = '1cm';
        document.body.appendChild(dom);
        var ww = dom.offsetWidth;
        var w = window.screen.width / ww;
        var h = window.screen.height / ww;
        var r = Math.round(Math.sqrt(w * w + h * h) / 2.54);
        result[BROWSER + 'screen_size'] = r;
        document.body.removeChild(dom);
        return result;
    }
    /**
     * 浏览器支持语言
      */
    function getBrowserLanguage() {
        var result = {};
        result[BROWSER + 'language'] = navigator.language;
        return result;
    }
    /**
     * 浏览器是否启用cookie
      */
    function getBrowserCookieEnabled() {
        var result = {};
        result[BROWSER + 'cookieEnabled'] = navigator.cookieEnabled;
        return result;
    }
    /** ********************          浏览器内核和品牌  ***********************/
    /**
     * 检测浏览器内核--返回的是两个key，name：浏览器内核的名称---version：浏览器的版本号
      */
    function isBroswer() {
        // 检测浏览器内核--返回的是两个key，name：浏览器内核的名称---version：浏览器的版本号
        var _broswer = {};
        var sUserAgent = navigator.userAgent;
        var isOpera = sUserAgent.indexOf('Opera') > -1;
        if (isOpera) {
            // 首先检测Opera是否进行了伪装
            if (navigator.appName === 'Opera') {
                // 如果没有进行伪装，则直接后去版本号
                _broswer.version = parseFloat(navigator.appVersion);
            } else {
                var reOperaVersion = new RegExp('Opera (\\d+.\\d+)');
                // 使用正则表达式的test方法测试并将版本号保存在RegExp.$1中
                reOperaVersion.test(sUserAgent);
                _broswer.version = parseFloat(RegExp['$1']);
            }
            _broswer.opera = true;
            _broswer.name = 'opera';
        }
        var isChrome = sUserAgent.indexOf('Chrome') > -1;
        if (isChrome) {
            var reChorme = new RegExp('Chrome/(\\d+\\.\\d+(?:\\.\\d+\\.\\d+))?');
            reChorme.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
            _broswer.chrome = true;
            _broswer.name = 'chrome';
        }
        // 排除Chrome信息，因为在Chrome的user-agent字符串中会出现Konqueror/Safari的关键字
        var isKHTML = (sUserAgent.indexOf('KHTML') > -1 || sUserAgent.indexOf('Konqueror') > -1 || sUserAgent.indexOf('AppleWebKit') > -1) && !isChrome;
        if (isKHTML) {
            // 判断是否基于KHTML，如果时的话在继续判断属于何种KHTML浏览器
            var isSafari = sUserAgent.indexOf('AppleWebKit') > -1;
            var isKonq = sUserAgent.indexOf('Konqueror') > -1;
            if (isSafari) {
                var reAppleWebKit = new RegExp('Version/(\\d+(?:\\.\\d*)?)');
                reAppleWebKit.test(sUserAgent);
                _broswer.version = parseFloat(RegExp['$1']);
                _broswer.safari = true;
                _broswer.name = 'safari';
            } else if (isKonq) {
                var reKong = new RegExp('Konqueror\\/(\\d+(?:\\.\\d+(?:\\.\\d)?)?)');
                reKong.test(sUserAgent);
                _broswer.version = parseFloat(RegExp['$1']);
                _broswer.konqueror = true;
                _broswer.name = 'konqueror';
            }
        }
        // !isOpera 避免是由Opera伪装成的IE
        var isIE = sUserAgent.indexOf('compatible') > -1 && sUserAgent.indexOf('MSIE') > -1 && !isOpera || sUserAgent.indexOf('Trident') > -1 && sUserAgent.indexOf('rv:11.0') > -1 && !isOpera;
        if (isIE) {
            var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
            reIE.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
            _broswer.msie = true;
            // _broswer.name = 'msie'
            _broswer.name = 'Trident';
        }
        // 排除Chrome 及 Konqueror/Safari 的伪装
        var isMoz = sUserAgent.indexOf('Gecko') > -1 && !isChrome && !isKHTML;
        if (isMoz) {
            var reMoz = new RegExp('rv:(\\d+\\.\\d+(?:\\.\\d+)?)');
            reMoz.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
            _broswer.mozilla = true;
            _broswer.name = 'mozilla';
        }
        // Edge浏览器
        var isEdge = sUserAgent.indexOf('Edge') > -1;
        if (isEdge) {
            var _reIE = new RegExp('Edge (\\d+\\.\\d+);');
            _reIE.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
            _broswer.edge = true;
            // _broswer.name = 'msie'
            _broswer.name = 'Edge';
        }
        return _broswer;
    }
    /**
     * 获取浏览器类型以及版本号
     * 支持国产浏览器:猎豹浏览器、搜狗浏览器、傲游浏览器、360极速浏览器、360安全浏览器、
     * QQ浏览器、百度浏览器等.
     * 支持国外浏览器:IE,Firefox,Chrome,safari,Opera等.
     * 使用方法:
     * 获取浏览器版本:Browser.client.version
     * 获取浏览器名称(外壳):Browser.client.name
     **/
    function browserBrand() {
        var document = window.document;
        var navigator = window.navigator;
        var agent = navigator.userAgent.toLowerCase();
        // IE8+支持.返回浏览器渲染当前文档所用的模式
        // IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
        // IE10:10(兼容模式7||8||9)
        var IEMode = document.documentMode;
        // chrome
        var chrome = window.chrome || false;
        var System = {
            // user-agent
            agent: agent,
            // 是否为Edge
            isEdge: /edge/.test(agent),
            // 是否为IE
            isIE: /msie/.test(agent) || /trident/.test(agent) && /rv:11.0/.test(agent),
            // Gecko内核
            isGecko: agent.indexOf('gecko') > 0 && agent.indexOf('like gecko') < 0,
            // webkit内核
            isWebkit: agent.indexOf('webkit') > 0,
            // 是否为标准模式
            isStrict: document.compatMode === 'CSS1Compat',
            // 是否支持subtitle
            supportSubTitle: function supportSubTitle() {
                return 'track' in document.createElement('track');
            },
            // 是否支持scoped
            supportScope: function supportScope() {
                return 'scoped' in document.createElement('style');
            },
            // 获取IE的版本号
            ieVersion: function ieVersion() {
                try {
                    return agent.match(/msie ([\d.]+)/)[1] || agent.match(/rv: ([\d.]+)/)[1] || 0;
                } catch (e) {
                    LogProxy_d('error');
                    return IEMode;
                }
            },
            edgeVersion: function edgeVersion() {
                try {
                    return agent.match(/edge\/([\d.]+)/)[1] || 0;
                } catch (e) {
                    LogProxy_d('error');
                    return IEMode;
                }
            },
            // Opera版本号
            operaVersion: function operaVersion() {
                try {
                    if (window.opera) {
                        return agent.match(/opera.([\d.]+)/)[1];
                    } else if (agent.indexOf('opr') > 0) {
                        return agent.match(/opr\/([\d.]+)/)[1];
                    }
                } catch (e) {
                    LogProxy_d('error');
                    return 0;
                }
            },
            // 描述:version过滤.如31.0.252.152 只保留31.0
            versionFilter: function versionFilter() {
                if (arguments.length === 1 && typeof arguments[0] === 'string') {
                    var version = arguments[0];
                    var start = version.indexOf('.');
                    if (start > 0) {
                        var end = version.indexOf('.', start + 1);
                        if (end !== -1) {
                            return version.substr(0, end);
                        }
                    }
                    return version;
                } else if (arguments.length === 1) {
                    return arguments[0];
                }
                return 0;
            }
        };
        try {
            // 浏览器类型(IE、Opera、Chrome、Safari、Firefox)
            System.type = System.isEdge ? 'Edge' : System.isIE ? 'IE' : window.opera || agent.indexOf('opr') > 0 ? 'Opera' : agent.indexOf('chrome') > 0 ? 'Chrome'
                // safari也提供了专门的判定方式
                : window.openDatabase ? 'Safari' : agent.indexOf('firefox') > 0 ? 'Firefox' : 'unkonw';
            // 版本号
            System.version = System.type === 'Edge' ? System.edgeVersion() : System.type === 'IE' ? System.ieVersion() : System.type === 'Firefox' ? agent.match(/firefox\/([\d.]+)/)[1] : System.type === 'Chrome' ? agent.match(/chrome\/([\d.]+)/)[1] : System.type === 'Opera' ? System.operaVersion() : System.type === 'Safari' ? agent.match(/version\/([\d.]+)/)[1] : '0';
            // 浏览器外壳
            System.shell = function () {
                // 遨游浏览器
                if (agent.indexOf('maxthon') > 0) {
                    System.version = agent.match(/maxthon\/([\d.]+)/)[1] || System.version;
                    return '傲游浏览器';
                }
                // QQ浏览器
                if (agent.indexOf('qqbrowser') > 0) {
                    System.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || System.version;
                    return 'QQ浏览器';
                }
                // 搜狗浏览器
                if (agent.indexOf('se 2.x') > 0) {
                    return '搜狗浏览器';
                }
                // Chrome:也可以使用window.chrome && window.chrome.webstore判断
                if (chrome && System.type !== 'Opera') {
                    var external = window.external;
                    var clientInfo = window.clientInformation;
                    // 客户端语言:zh-cn,zh.360下面会返回undefined
                    var clientLanguage = clientInfo.languages;
                    // 猎豹浏览器:或者agent.indexOf('lbbrowser')>0
                    if (external && 'LiebaoGetVersion' in external) {
                        return '猎豹浏览器';
                    }
                    // 百度浏览器
                    if (agent.indexOf('bidubrowser') > 0) {
                        System.version = agent.match(/bidubrowser\/([\d.]+)/)[1] || agent.match(/chrome\/([\d.]+)/)[1];
                        return '百度浏览器';
                    }
                    // 360极速浏览器和360安全浏览器
                    if (System.supportSubTitle() && typeof clientLanguage === 'undefined') {
                        // object.key()返回一个数组.包含可枚举属性和方法名称
                        var storeKeyLen = Object.keys(chrome.webstore).length;
                        return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器';
                    }
                    return 'Chrome';
                }
                return System.type;
            };
            // 浏览器名称(如果是壳浏览器,则返回壳名称)
            System.name = System.shell();
            // 对版本号进行过滤过处理
            // System.version = System.versionFilter(System.version)
        } catch (e) {
            LogProxy_d('error');
        }
        return System;
    }
    /**
     * 获取操作系统
     */
    function browserOs() {
        var userAgent = navigator.userAgent;
        var isWin = navigator.platform == 'Win32' || navigator.platform == 'Win64' || navigator.platform == 'Windows';
        var isMac = navigator.platform == 'Mac68K' || navigator.platform == 'MacPPC' || navigator.platform == 'Macintosh' || navigator.platform == 'MacIntel';
        if (isMac) return 'Mac';
        var isUnix = navigator.platform == 'X11' && !isWin && !isMac;
        if (isUnix) return 'Unix';
        var isLinux = String(navigator.platform).indexOf('Linux') > -1;
        var bIsAndroid = userAgent.toLowerCase().match(/android/i) == 'android';
        if (isLinux) {
            if (bIsAndroid) return 'Android';
            return 'Linux';
        }
        if (isWin) {
            var isWin2K = userAgent.indexOf('Windows NT 5.0') > -1 || userAgent.indexOf('Windows 2000') > -1;
            if (isWin2K) return 'Win2000';
            var isWinXP = userAgent.indexOf('Windows NT 5.1') > -1 || userAgent.indexOf('Windows XP') > -1;
            if (isWinXP) return 'WinXP';
            var isWin2003 = userAgent.indexOf('Windows NT 5.2') > -1 || userAgent.indexOf('Windows 2003') > -1;
            if (isWin2003) return 'Win2003';
            var isWinVista = userAgent.indexOf('Windows NT 6.0') > -1 || userAgent.indexOf('Windows Vista') > -1;
            if (isWinVista) return 'WinVista';
            var isWin7 = userAgent.indexOf('Windows NT 6.1') > -1 || userAgent.indexOf('Windows 7') > -1;
            if (isWin7) return 'Win7';
            var isWin8 = userAgent.indexOf('Windows NT 6.2') > -1 || userAgent.indexOf('Windows 8') > -1;
            if (isWin8) return 'Win8';
            var isWin81 = userAgent.indexOf('Windows NT 6.3') > -1 || userAgent.indexOf('Windows 8.1') > -1;
            if (isWin81) return 'Win8.1';
            var isWin10 = userAgent.indexOf('Windows NT 6.4') > -1 || userAgent.indexOf('Windows NT 10.0') > -1 || userAgent.indexOf('Windows 10') > -1;
            if (isWin10) return 'Win10';
            return 'other';
        }
    }

    /**
     * 获取浏览器属性
     * @author RenZhuo
     */

    /**
     * 获取通用属性
     */
    function getGeneralAttribute() {
        var result = {};
        assign(result, getBrowserOS(), getBrowserVersion(), getBrowserBrand(), getBrowserHeight(), getBrowserWidtth());
        return result;
    }

    /**
     * 获取扩展属性
     */
    function getExtProperties() {
        var result = {};
        assign(result, getBrowserCodeName(), getBrowserCore(), getBrowserResolution(), getBrowserSize(), getBrowserLanguage(), getBrowserUserAgent(), getBrowserCookieEnabled());
        return result;
    }

    // LegacyConvertor
    var BUSINESS_TYPE = 'bussiness_type';
    var PROPERTIES = 'properties';
    var USER_ID = 'user_id';
    var DEVICE_ID = 'device_id';
    var CREATE_TIME = 'create_time';
    var SESSION_IP = 'session_ip';
    var FUNCTION_ID = 'function_id';
    var APP_VER = 'app_ver';
    var LOGIN = 'login';
    var GZIP_VALID_ORIGIN = 'cloud-atlas-web-sdk';
    // 压缩对象
    var sGzipFun = null;
    /**
     * 比较两个二进制数组
     * @param buf1
     * @param buf2
     * @returns {boolean}
     * @constructor
     */
    function LegacyConvertor_CompareBufArray(buf1, buf2) {
        var len1 = buf1.length;
        var len2 = buf2.length;
        if (len1 !== len2) {
            return false;
        }
        for (var i = 0; i < len1; i++) {
            if (buf1[i] !== buf2[i]) {
                return false;
            }
        }
        return true;
    }
    function LegacyConvertor_initGzipFun(gzipFun) {
        // 如果不支持Uint8Array 则不需要压缩
        if (window.Uint8Array) {
            var gzipValid = new Uint8Array([31, 139, 8, 0, 0, 0, 0, 0, 0, 3, 75, 206, 201, 47, 77, 209, 77, 44, 201, 73, 44, 214, 45, 79, 77, 210, 45, 78, 201, 6, 0, 249, 255, 225, 61, 19, 0, 0, 0]);
            if (gzipFun) {
                var buf = string2buf(GZIP_VALID_ORIGIN);
                var res = gzipFun(buf);
                if (LegacyConvertor_CompareBufArray(gzipValid, res)) {
                    sGzipFun = gzipFun;
                } else {
                    throw 'Invalid gzip function';
                }
            } else {
                LogProxy_d('Not to use gzip compress');
            }
        } else {
            LogProxy_d('Browser does not support the Unit8Array , will not to use gzip compress');
        }
    }
    /**
     * 是否进行压缩
     */
    function LegacyConvertor_isCompress() {
        if (sGzipFun) {
            return true;
        }
        return false;
    }
    function LegacyConvertor_convert4IE8(body) {
        var data = {};
        data['body'] = JSON.parse(body); // body
        var head = {};
        head['Content-type'] = 'application/json';
        data['head'] = head;
        return JSON.stringify(data);
    }
    function LegacyConvertor_gzipCompress(rawBody) {
        var rawLen = rawBody.length;
        var bufBody = string2buf(rawBody);
        var buf = sGzipFun(bufBody);
        var bufLen = buf.length;
        LogProxy_d('origin: ' + rawLen + '，after compress：' + bufLen);
        return buf;
    }
    function LegacyConvertor_convert(collectedData) {
        // const activityId = ActivityIdResolver_getActivityId();
        var deviceId = DeviceInfoResolver_getDeviceId();
        var data = [];
        var result = { data: data };
        // 会话数据
        var len = collectedData.sessionList.length;
        for (var i = 0; i < len; i++) {
            var session = collectedData.sessionList[i];
            // 会话开始
            var loginData = {};
            loginData[BUSINESS_TYPE] = LOGIN;
            var prop = {};
            prop[FUNCTION_ID] = 21;
            prop[CREATE_TIME] = CurrentTimeHelper_formatDate(new Date(session.start));
            if (session.userId) {
                prop[USER_ID] = session.userId;
            }
            prop[APP_VER] = session.appVer;
            prop[DEVICE_ID] = deviceId;
            prop['session_id'] = session.id;
            if (session.ip) {
                prop[SESSION_IP] = session.ip;
            }
            loginData[PROPERTIES] = prop;
            data.push(loginData);

            // 会话结束
            if (session.end > 0) {
                var logoutData = {};
                logoutData[BUSINESS_TYPE] = LOGIN;
                prop = {};
                prop[FUNCTION_ID] = 22;
                prop[CREATE_TIME] = CurrentTimeHelper_formatDate(new Date(session.end));
                if (session.userId) {
                    prop[USER_ID] = session.userId;
                }
                prop[APP_VER] = session.appVer;
                prop['session_id'] = session.id;
                prop[DEVICE_ID] = deviceId;
                logoutData[PROPERTIES] = prop;
                data.push(logoutData);
            }
        }
        len = collectedData.eventList.length;
        for (var _i = 0; _i < len; _i++) {
            var event = collectedData.eventList[_i];
            var eventData = {};
            // 事件类型
            eventData[BUSINESS_TYPE] = 'custom_event_log';
            var _prop = {};
            _prop['event_tag'] = event.id;
            _prop['event_time'] = CurrentTimeHelper_formatDate(new Date(event.time));
            _prop[USER_ID] = event.userId;
            _prop[DEVICE_ID] = deviceId;
            _prop['session_id'] = event.sessionId;
            if (event.appVer) {
                _prop['app_ver'] = event.appVer;
            }
            if (event.value) {
                if (event.value[KEY_EVENT_LABEL]) {
                    _prop['event_label'] = event.value[KEY_EVENT_LABEL];
                    delete event.value[KEY_EVENT_LABEL];
                }
                if (event.value[KEY_EVENT_INT_VALUE]) {
                    _prop['event_value'] = event.value[KEY_EVENT_INT_VALUE];
                    delete event.value[KEY_EVENT_INT_VALUE];
                }
                var hasProp = false;
                for (var propValue in event.value) {
                    // 判断event.value对象是否为空，相较于Object.keys[9+] 能兼容更低版本的ie 6+
                    hasProp = true;
                    break;
                }
                if (hasProp) {
                    eventData['ext_properties'] = event.value;
                }
            }
            eventData[PROPERTIES] = _prop;
            data.push(eventData);
        }
        len = collectedData.errorList.length;
        for (var _i2 = 0; _i2 < len; _i2++) {
            var error = collectedData.errorList[_i2];
            var _eventData = {};
            _eventData[BUSINESS_TYPE] = 'exception_log';
            var _prop2 = {};
            _prop2['ex_type'] = error.type;
            _prop2['ex_time'] = CurrentTimeHelper_formatDate(new Date(error.time));
            _prop2['ex_msg'] = error.msg;
            // prop[ACTIVITY_ID] = error.activityId;
            if (error.appVer) {
                _prop2['app_ver'] = error.appVer;
            }
            _eventData[PROPERTIES] = _prop2;
            data.push(_eventData);
        }
        // 渠道信息
        var sessionLen = collectedData.sessionList.length;
        if (sessionLen > 0) {
            var deviceData = {};
            deviceData[BUSINESS_TYPE] = 'device';
            var deviceProp = getGeneralAttribute();
            deviceProp['channel_id'] = AppInfoResolver_getChannelId();
            deviceProp[DEVICE_ID] = deviceId;
            deviceProp[CREATE_TIME] = CurrentTimeHelper_formatDate(new Date());
            deviceData[PROPERTIES] = deviceProp;
            deviceData['ext_properties'] = getExtProperties();
            data.push(deviceData);
        }
        if (data.length === 0) {
            return null;
        }
        return JSON.stringify(result);
    }

    /**
      * 发送异步Post请求，使用方式如下
      * @param url 服务端Url
      * @param data Post数据
      * @param callback 回调（object，可选，需要带onFail(msg)与onSuccess()两个方法）
      * @param isAsync 是否异步上传，可选，默认为异步上传
      */
    function UploadUtils_postAsyncRequest(url, data, callback, isAsync) {
        originAjax('post', url, data, callback, isAsync);
    }
    function UploadUtils_getAsyncRequest(url, data, callback, isAsync) {
        originAjax('get', url, data, callback, isAsync);
    }
    function UploadUtils_ie8OnError(sCallBack) {
        if (sCallBack && sCallBack.onFail && typeof sCallBack.onFail === 'function') {
            sCallBack.onFail('Unknown error');
        }
    }
    function UploadUtils_ie8OnTimeout(sCallBack) {
        if (sCallBack && sCallBack.onFail && typeof sCallBack.onFail === 'function') {
            sCallBack.onFail('Time out');
        }
    }
    function getAutoTrack(url, callback, isAsync) {
        originAjax('get', url, '', callback, isAsync);
    }
    function originAjax(methods, url, data, callback, isAsync) {
        var sXmlHttp = null;
        var sCallBack = callback;
        if (window.XMLHttpRequest) {
            // Mozilla 浏览器（将XMLHttpRequest对象作为本地浏览器对象来创建）
            sXmlHttp = new XMLHttpRequest();
            if (!('withCredentials' in sXmlHttp) && window.XDomainRequest) {
                // IE8 IE9
                if (window.location.protocol !== 'http:') {
                    LogProxy_d('sdk just support http protocol');
                    return false;
                }
                sXmlHttp = new XDomainRequest();
            }
        } else if (window.ActiveXObject) {
            // IE浏览器（将XMLHttpRequest对象作为ActiveX对象来创建）
            try {
                sXmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {
                try {
                    sXmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
                } catch (e) { }
            }
        }
        if (sXmlHttp == null) {
            LogProxy_e('Can not create XMLHttpRequest object');
            return false;
        }
        if (isAsync === undefined || isAsync === null || isAsync.constructor !== Boolean) {
            isAsync = true;
        }
        if (methods === 'post') {
            if (window.XDomainRequest && sXmlHttp.constructor === XDomainRequest) {
                // IE8
                data = LegacyConvertor_convert4IE8(data);
                sXmlHttp.onerror = function () {
                    UploadUtils_ie8OnError(sCallBack);
                };
                sXmlHttp.ontimeout = function () {
                    UploadUtils_ie8OnTimeout(sCallBack);
                };
                sXmlHttp.onload = function () {
                    if (typeof sXmlHttp.responseText === 'string' && sXmlHttp.responseText !== '') {
                        LogProxy_d('Upload result = ' + sXmlHttp.responseText);
                    }
                    if (sCallBack && sCallBack.onSuccess && typeof sCallBack.onSuccess === 'function') {
                        sCallBack.onSuccess();
                    }
                };
                sXmlHttp.open(methods, url);
            } else {
                sXmlHttp.open(methods, url, isAsync);
                if (LegacyConvertor_isCompress()) {
                    data = LegacyConvertor_gzipCompress(data);
                    sXmlHttp.setRequestHeader('Content-Type', 'application/gzip;');
                } else {
                    sXmlHttp.setRequestHeader('Content-Type', 'application/json;');
                }
                sXmlHttp.onreadystatechange = function () {
                    // sXmlHttp.readyState
                    // 0 － （未初始化）还没有调用send()方法
                    // 1 － （载入）已调用send()方法，正在发送请求
                    // 2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
                    // 3 － （交互）正在解析响应内容
                    // 4 － （完成）响应内容解析完成，可以在客户端调用了
                    if (sXmlHttp.readyState == 4) {
                        if (sXmlHttp.status == 200) {
                            if (typeof sXmlHttp.responseText === 'string' && sXmlHttp.responseText !== '') {
                                LogProxy_d('Upload result = ' + sXmlHttp.responseText);
                            }
                            if (sCallBack && sCallBack.onSuccess && typeof sCallBack.onSuccess === 'function') {
                                sCallBack.onSuccess();
                            }
                        } else {
                            if (sCallBack && sCallBack.onFail && typeof sCallBack.onFail === 'function') {
                                sCallBack.onFail(sXmlHttp.responseText);
                            }
                        }
                    } else {
                        LogProxy_d('Upload processed, status = ' + sXmlHttp.readyState);
                    }
                };
            }
            sXmlHttp.send(data);
        } else {
            if (window.XDomainRequest && sXmlHttp.constructor === XDomainRequest) {
                // IE8
                sXmlHttp.onerror = function () {
                    UploadUtils_ie8OnError(sCallBack);
                };
                sXmlHttp.ontimeout = function () {
                    UploadUtils_ie8OnTimeout(sCallBack);
                };
                sXmlHttp.onload = function () {
                    if (typeof sXmlHttp.responseText === 'string' && sXmlHttp.responseText !== '') {
                        LogProxy_d('Upload result = ' + sXmlHttp.responseText);
                    }
                    if (sCallBack && sCallBack.onSuccess && typeof sCallBack.onSuccess === 'function') {
                        sCallBack.onSuccess(sXmlHttp.responseText);
                    }
                };
                sXmlHttp.open(methods, url);
            } else {
                sXmlHttp.open(methods, url, isAsync);
                sXmlHttp.onreadystatechange = function () {
                    // sXmlHttp.readyState
                    // 0 － （未初始化）还没有调用send()方法
                    // 1 － （载入）已调用send()方法，正在发送请求
                    // 2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
                    // 3 － （交互）正在解析响应内容
                    // 4 － （完成）响应内容解析完成，可以在客户端调用了
                    if (sXmlHttp.readyState == 4) {
                        if (sXmlHttp.status == 200) {
                            if (typeof sXmlHttp.responseText === 'string' && sXmlHttp.responseText !== '') {
                                LogProxy_d('Upload result = ' + sXmlHttp.responseText);
                            }
                            if (sCallBack && sCallBack.onSuccess && typeof sCallBack.onSuccess === 'function') {
                                sCallBack.onSuccess(sXmlHttp.responseText);
                            }
                        } else {
                            if (sCallBack && sCallBack.onFail && typeof sCallBack.onFail === 'function') {
                                sCallBack.onFail(sXmlHttp.responseText);
                            }
                        }
                    } else {
                        LogProxy_d('Upload processed, status = ' + sXmlHttp.readyState);
                    }
                };
            }
            sXmlHttp.send(null);
        }
    }

    /**
         * 获取元素信息
         * @param {*object} obj 元素对象
         */
    function getEleInfo(obj) {
        if (!obj.target) {
            return false;
        }
        var target = obj.target;
        var tagName = target.tagName.toLowerCase();
        var props = {};
        props.element_id = target.getAttribute('id');
        props.element_name = target.getAttribute('name');
        props.element_class_name = typeof target.className === 'string' ? target.className : '';
        props.element_type = tagName;
        props.element_target_url = target.getAttribute('href');
        // 获取内容
        var textContent = '';
        if (target.textContent) {
            textContent = trim(target.textContent);
        } else if (target.innerText) {
            textContent = trim(target.innerText);
        }
        if (textContent) {
            textContent = textContent.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ').substring(0, 255);
        }
        props.element_content = textContent || '';

        // 针对inut默认只采集button和submit非名感的词汇。可以自定义（银联提）
        if (tagName === 'input') {
            if (target.type === 'button' || target.type === 'submit') {
                props.element_content = target.value || '';
            }
        }
        props = stripEmptyProperties(props);
        props.url = location.href;
        props.url_path = location.pathname;
        props.title = document.title;
        return props;
    }
    // 去掉对象中undefined和null
    function stripEmptyProperties(p) {
        var ret = {};
        for (var k in p) {
            if (p[k] != null) {
                ret[k] = p[k];
            }
        }
        return ret;
    }
    /**
         *
         * @param {*} el 元素
         * @param {*} arr dom选择器数组
         */
    function getDomSelector(el, arr) {
        if (!el || !el.parentNode || !el.parentNode.children) {
            return false;
        }
        arr = arr && arr.join ? arr : [];
        var name = el.nodeName.toLowerCase();
        if (!el || name === 'body' || el.nodeType != 1) {
            arr.unshift('body');
            return arr.join(' > ');
        }
        arr.unshift(selector(el));
        if (el.id) return arr.join(' > ');
        return getDomSelector(el.parentNode, arr);
    }
    // dom在兄弟标签中的下标。
    function getDomIndex(el) {
        var indexof = [].indexOf;
        if (!el.parentNode) return -1;
        var list = el.parentNode.children;
        if (!list) return -1;
        var len = list.length;
        if (indexof) return indexof.call(list, el);
        for (var i = 0; i < len; ++i) {
            if (el == list[i]) return i;
        }
        return -1;
    }
    // 选择器
    function selector(el) {
        // var classname = _.trim(el.className.baseVal ? el.className.baseVal : el.className);
        var i = el.parentNode && el.parentNode.nodeType == 9 ? -1 : getDomIndex(el);
        if (el.id) {
            return '#' + el.id;
        }
        return el.tagName.toLowerCase() + ( // + (classname ? classname.replace(/^| +/g, '.') : '')
            ~i ? ':nth-child(' + (i + 1) + ')' : '');
    }
    // 去空格
    function trim(str) {
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };











    var classCallCheck = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    };

    function event$1(options) {
        if (options === undefined || options === null || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
            LogProxy_e('Invalid params for onEvent, type = ' + (typeof options === 'undefined' ? 'undefined' : _typeof(options)) + ', value = ' + options);
            return;
        }
        var eventId = options.eventId;
        if (eventId === undefined || eventId === null || eventId.constructor !== String) {
            LogProxy_e('Invalid params for onEvent, eventId type = ' + (typeof eventId === 'undefined' ? 'undefined' : _typeof(eventId)) + ', value = ' + eventId);
            return;
        }
        var label = options.label;
        if (label !== undefined && label !== null && label.constructor !== String) {
            LogProxy_e('Invalid params for onEvent, label type = ' + (typeof label === 'undefined' ? 'undefined' : _typeof(label)) + ', value = ' + label);
            return;
        }
        var info = options.info;
        if (info !== undefined && info !== null) {
            if ((typeof info === 'undefined' ? 'undefined' : _typeof(info)) !== 'object') {
                LogProxy_e('Invalid params for onEvent, info type = ' + (typeof info === 'undefined' ? 'undefined' : _typeof(info)) + ', value = ' + info);
                return;
            }
            // info中只支持字符串
            for (var prop in info) {
                if (info[prop] === undefined || info[prop] === null || info[prop].constructor !== String) {
                    LogProxy_e('Invalid params for onEvent, type of info.' + prop + ' = ' + _typeof(info[prop]) + ', value = ' + info[prop]);
                    return;
                }
            }
        }
        var value = options.value;
        if (value !== undefined && value !== null) {
            if (value.constructor !== Number) {
                LogProxy_e('Invalid params for onEvent, value type = ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + ', value = ' + value);
                return;
            }
            // 是否为整数
            if (parseInt(value) !== value) {
                LogProxy_e('Invalid params for onEvent, value is not int : ' + value);
                return;
            }
        }
        if (!CloudAtlasImpl_isSessionExist()) {
            CloudAtlasImpl_onOpen();
        }
        if (options.callback) {
            options.callback();
            delete options.callback();
        }
        CloudAtlasImpl_onEvent(options);
    }

    function trackLink(obj, event_prop) {
        obj = obj || {};
        var link = null;
        if (obj.ele) {
            link = obj.ele;
        }
        if (obj.event) {
            if (obj.target) {
                link = obj.target;
            } else {
                link = obj.event.target;
            }
        }
        event_prop = event_prop || {};
        if (!link || (typeof link === 'undefined' ? 'undefined' : _typeof(link)) !== 'object') {
            return false;
        }
        // 如果是非当前页面会跳转的链接，直接track
        if (!link.href || /^javascript/.test(link.href) || link.target || link.download || link.onclick) {
            sendTrack(event_prop);
            return false;
        }
        function linkFunc(e) {
            e.stopPropagation();
            e.preventDefault(); // 阻止默认跳转
            var hasCalled = false;
            function track_a_click() {
                if (!hasCalled) {
                    hasCalled = true;
                    location.href = link.href; // 把 A 链接的点击跳转,改成 location 的方式跳转
                }
            }
            setTimeout(track_a_click, 1000); // 如果没有回调成功，设置超时回调
            // TODO 发送数据
            sendTrack(event_prop, track_a_click); // 把跳转操作加在callback里
        }
        if (obj.event) {
            linkFunc(obj.event);
        }
        if (obj.ele) {
            addEvent(obj.ele, 'click', function (e) {
                linkFunc(e);
            });
        }
    }
    // 触发页面点击事件。获取这个标签的信息。
    function start(ev, target, tagName) {
        var selector = getDomSelector(target);
        var prop = getEleInfo({ target: target });
        //  先不采集，置空
        //   prop.element_selector = selector ? selector : '';
        // prop.element_selector = '';
        if (tagName === 'a') {
            // TODO
            trackLink({ event: ev, target: target }, prop);
        } else {
            // TODO 如何发送。
            sendTrack(prop);
        }
    }
    function sendTrack(prop, callback) {
        if (callback) {
            event$1({ eventId: 'AutoPageview', info: prop, callback: callback });
        } else {
            event$1({ eventId: 'AutoPageview', info: prop });
        }
    }

    // -----------------------------------------
    // CollectedDataPersister
    var sCurrentEnv = null;
    var sCurrentData = null;
    var sDataPending = null;

    var sUpdateTimes = 0; // 更新次数, 当前localStorage存在多少条数据
    var storageKey = []; // localstorage的key值数组
    var failedNumber = 0; // 上传失败次数
    var uploadData = void 0; // 上传数据

    function CollectedDataPersister_init() {
        // TODO (后续考虑)从持久化中初始化
        sCurrentEnv = new RunningEnv();
        // 退出页面时持久化登出信息
        var temp = window.onbeforeunload;
        window.onbeforeunload = function () {
            if (sCurrentData.sessionList && sCurrentData.sessionList.length > 0) {
                var currentTime = CurrentTimeHelper_currentTimeMillis();
                // 获取session列表中最后一条的会话数据
                var last = sCurrentData.sessionList[sCurrentData.sessionList.length - 1];
                last.end = currentTime;
                LocalStoragePersist_saveCollectedData(0, last);
            }

            if (temp)
                return temp();
        };
    }
    function CollectedDataPersister_setUploadData(data, type) {
        sDataPending = null;
        sDataPending = new CollectedData();
        sDataPending[type].push(data);
    }
    function CollectedDataPersister_setDataPengdData(data) {
        sDataPending = data;
    }

    /**
       * 获取正在采集中的数据
       *
       * @return 数据对象
       */
    function CollectedDataPersister_getCurrentData() {
        if (sCurrentData == null) {
            sCurrentData = new CollectedData();
        }
        return sCurrentData;
    }

    /**
       * 获取当前运行环境
       * @returns {*}当前运行环境对象，不会为空
       */
    function CollectedDataPersister_getCurrentEnv() {
        return sCurrentEnv;
    }

    /**
     * 清空发送中数据（在发送成功后调用）
     */
    function CollectedDataPersister_clearSendingData() {
        LocalStoragePersist_clearCollectedData(storageKey);
        storageKey = null;
    }

    /**
     * 通知更新
     */
    function CollectedDataPersister_notifyUpdate() {
        sUpdateTimes++;
        if (sUpdateTimes >= LIMIT_TIMES) {
            CollectedDataUploader_triggerDataUpload();
            sUpdateTimes = 0;
        }
    }

    // CollectedDataUploader
    var sWaitingForResult = false; // 是否正在等待发送结果
    var CollectedDataUploader_sendCallback = {
        onSuccess: function onSuccess() {
            if (sIsLogEnabled) {
                LogProxy_d('Upload success');
            }
            if (!sIsImmediately && isLocalStorageSupport()) {
                CollectedDataPersister_clearSendingData();
                sWaitingForResult = false;
                failedNumber = 0;
                CollectedDataPersister_traversalStorage();
            }
        },
        onFail: function onFail(msg) {
            LogProxy_w('Upload failed, reason = ' + (msg || 'unknown reason'));
            if (!sIsImmediately && isLocalStorageSupport()) {
                failedNumber++;
                sWaitingForResult = false;
                if (failedNumber >= 3) {
                    CollectedDataPersister_clearSendingData();
                    failedNumber = 0;
                    CollectedDataPersister_traversalStorage();
                }
                CollectedDataUploader_triggerDataUpload();
            }
        }
    };

    // 遍历localStroage 判断当前的埋点数据是否存在会话数据或大于限制的条数，存在该情况触发上传数据
    function CollectedDataPersister_traversalStorage() {
        var StorageData = {
            count: 0,
            isExistSession: false
        };
        if (isLocalStorageSupport()) {
            for (var i = 0; i < storage.length; i++) {
                var key = storage.key(i);
                if (/^atlas_data/.test(key)) {
                    StorageData.count++;
                }
                if (/^atlas_data_0/.test(key)) {
                    StorageData.isExistSession = true;
                }
            }
            if (StorageData.count >= LIMIT_TIMES || StorageData.isExistSession) {
                CollectedDataUploader_sendPendingData();
            } else if (!StorageData.isExistSession && StorageData.count <= LIMIT_TIMES) {
                sUpdateTimes = StorageData.count;
            }
        }
    }

    /**
     * 将待发送数据进行转换并触发发送
     * @param isAsync 是否异步上传，可选，默认为异步上传
     */
    function CollectedDataUploader_sendPendingData(isAsync) {
        var dataToSend = void 0;
        if (sIsImmediately || !isLocalStorageSupport()) {
            // 立即上传
            dataToSend = sDataPending;
        } else {
            if (failedNumber === 0) {
                // 失败次数为0
                var storageData = LocalStoragePersist_queryCollecteData();
                storageKey = storageData.keys;
                uploadData = storageData.data;
                dataToSend = storageData.data;
            } else {
                // 上传失败
                dataToSend = uploadData;
            }
        }
        if (dataToSend !== null && dataToSend.hasValidData()) {
            sWaitingForResult = true; // 有数据可发送，则置为等待结果返回。
            var dataStr = LegacyConvertor_convert(dataToSend);
            if (dataStr !== null) {
                if (sIsLogEnabled) {
                    LogProxy_d('Upload = ' + dataStr);
                }
                UploadUtils_postAsyncRequest(Constant_HOST + 'v0.1/' + AppInfoResolver_getAppKey() + '/action/collect', dataStr, CollectedDataUploader_sendCallback, isAsync);
            } else {
                CollectedDataUploader_sendCallback.onSuccess();
            }
        }
    }

    /**
     * 触发待发送数据上传
     * @param isAsync 是否异步上传，可选，默认为异步上传
     */
    function CollectedDataUploader_triggerDataUpload(isAsync) {
        // 检测当前队列及执行状态，若不在等待返回，则直接执行
        if (!sWaitingForResult) {
            CollectedDataUploader_sendPendingData(isAsync);
        }
    }
    /**
     * 立即上传数据
     * @param isAsync 是否异步上传，可选，默认为异步上传
     */
    function CollectedDataUploader_uploadImmediately() {
        CollectedDataUploader_sendPendingData();
    }

    //   全埋点，由于回调
    function addAutoTrack() {
        addEvent(document, 'click', function (e) {
            var ev = e || window.event;
            if (!ev) {
                return false;
            }
            var target = ev.target || ev.srcElement;
            if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
                return false;
            }
            if (typeof target.tagName !== 'string') {
                return false;
            }
            var tagName = target.tagName.toLowerCase();
            if (tagName.toLowerCase() === 'body' || tagName.toLowerCase() === 'html') {
                return false;
            }
            if (!target || !target.parentNode || !target.parentNode.children) {
                return false;
            }
            var parent_ele = target.parentNode.tagName.toLowerCase();
            if (parent_ele === 'a' || parent_ele === 'button' || parent_ele === 'input') {
                start(ev, target.parentNode, target.parentNode.tagName.toLowerCase());
            } else if (tagName === 'a' || tagName === 'button' || tagName === 'input') {
                start(ev, target, tagName);
            }
        });
    }
    var autoTrack_sendCallback = {
        onSuccess: function onSuccess(data) {
            LogProxy_d('Upload success');
            data = JSON.parse(data);
            if (data.available) {
                addAutoTrack();
            }
        },
        onFail: function onFail(msg) {
            LogProxy_w('Upload failed, reason = ' + (msg || 'unknown reason'));
        }
    };

    var sHasInit = false; // 是否已初始化
    function CloudAtlasImpl_init(appKey, appVer, gzipFun) {
        CloudAtlasImpl_initChannel(appKey, appVer, 'default', gzipFun);
    }
    function CloudAtlasImpl_initChannel(appKey, appVer, channelId, gzipFun) {
        try {
            if (sHasInit) {
                LogProxy_w('Init too many times');
            } else {
                DeviceInfoResolver_resolveDeviceInfo(); // 解析设备ID
                ActivityIdResolver_createActivityId(); // 创建活动ID
                AppInfoResolver_saveInfo(appKey, appVer, channelId); // 保存appKey，app版本和渠道ID
                CollectedDataPersister_init();
                LegacyConvertor_initGzipFun(gzipFun); // 压缩
                sHasInit = true;
            }
        } catch (e) {
            LogProxy_e('Failed to init', e);
            if (sIsDebugMode) {
                throw e;
            }
        }
    }
    function CloudAtlasImpl_onOpen() {
        try {
            if (sHasInit) {
                DeviceInfoResolver_setDeviceId().then(function (result) {
                    var currentTime = CurrentTimeHelper_currentTimeMillis();
                    CloudAtlasImpl_createNewSessionIfNeededByTime(currentTime);
                });
            } else {
                LogProxy_e('Not allowed to open session before init');
            }
        } catch (e) {
            LogProxy_e('Failed to open session', e);
            if (sIsDebugMode) {
                throw e;
            }
        }
    }
    function CloudAtlasImpl_isSessionExist() {
        var current = CollectedDataPersister_getCurrentData();
        if (current.sessionList && current.sessionList.length > 0) {
            return true;
        }
        return false;
    }
    function CloudAtlasImpl_onClose() {
        try {
            if (sHasInit) {
                DeviceInfoResolver_setDeviceId().then(function (result) {
                    LogProxy_d('Close the page');
                    var current = CollectedDataPersister_getCurrentData();
                    if (current.sessionList && current.sessionList.length > 0) {
                        var currentTime = CurrentTimeHelper_currentTimeMillis();
                        var last = current.sessionList[current.sessionList.length - 1];
                        last.end = currentTime;
                        if (sIsImmediately || !isLocalStorageSupport()) {
                            CollectedDataPersister_setUploadData(last, 'sessionList');
                            CollectedDataUploader_sendPendingData();
                        } else {
                            LocalStoragePersist_saveCollectedData(0, last);
                            CollectedDataUploader_uploadImmediately();
                        }
                    } else {
                        // 异常调用，没有会话存在
                        LogProxy_w('No session when page close');
                    }
                });
            } else {
                LogProxy_e('Not allowed to close session before init');
            }
        } catch (e) {
            LogProxy_e('Failed to close session', e);
            if (sIsDebugMode) {
                throw e;
            }
        }
    }
    /**
     * 根据会话结束时间判断是否需要创建新的会话，如果需要，创建并触发发送
     * @param currentTime 当前系统时间（单位：毫秒）
     */
    function CloudAtlasImpl_createNewSessionIfNeededByTime(currentTime) {
        var current = CollectedDataPersister_getCurrentData();
        var runningEnv = CollectedDataPersister_getCurrentEnv();
        // 对于Web端，没有后台前台切换的说法，只要是调用onOpen，都是一个新会话
        CloudAtlasImpl_createNewSession(currentTime, current, runningEnv, true);
    }
    /**
     *创建新会话
     * @param currentTime 当前时间
     * @param currentData 当前数据
     * @param runningEnv  当前运行环境
     * @param byTime      true-由于会话时间超时导致的，false-由于切换用户导致的
     */
    function CloudAtlasImpl_createNewSession(currentTime, currentData, runningEnv, byTime) {
        // 创建新会话前，要保证版本与用户id是最新的！
        var appVer = AppInfoResolver_getVersionName();
        runningEnv.appVer = appVer;
        var userId = runningEnv.userId;

        var newSessionId = guid();
        var ip = runningEnv.ip;
        if (!byTime) {
            // 切换用户
            // 创建新会话前先结束当前会话
            if (runningEnv.sessionId && currentData.sessionList.length > 0) {
                var currentSession = null;
                var len = currentData.sessionList.length;
                for (var i = 0; i < len; i++) {
                    var session = currentData.sessionList[i];
                    if (session.id === runningEnv.sessionId) {
                        currentSession = session;
                        break;
                    }
                }
                if (currentSession != null) {
                    currentSession.end = currentTime;
                    if (sIsImmediately || !isLocalStorageSupport()) {
                        CollectedDataPersister_setUploadData(currentSession, 'sessionList');
                        CollectedDataUploader_sendPendingData();
                    } else {
                        LocalStoragePersist_saveCollectedData(0, currentSession);
                    }
                } else {
                    LogProxy_e('No current session object found for sessionId ' + runningEnv.sessionId);
                }
            }
            // 更新activity
            ActivityIdResolver_createActivityId();
        }
        // 将当前启动信息加入到会话列表，以便立即能上传活跃数据
        var tempSession = new Session(newSessionId, currentTime, 0, userId, appVer, ip, sActivityId);
        currentData.sessionList.push(tempSession);
        // 将会话数据存入localstorage中
        if (sIsImmediately || !isLocalStorageSupport()) {
            CollectedDataPersister_setUploadData(currentData.sessionList[currentData.sessionList.length - 1], 'sessionList');
            CollectedDataUploader_sendPendingData();
        } else {
            LocalStoragePersist_saveCollectedData(0, currentData.sessionList[currentData.sessionList.length - 1]);
            // 触发立即发送
            CollectedDataUploader_uploadImmediately();
        }
        // 更新运行环境
        runningEnv.sessionId = newSessionId;
        var localData = LocalStoragePersist_queryCollecteData();
        if (sIsImmediately && localData && localData.data && localData.data.hasValidData()) {
            CollectedDataPersister_setDataPengdData(localData.data);
            CollectedDataUploader_sendPendingData();
            LocalStoragePersist_clearCollectedData(localData.keys);
        }
    }
    function CloudAtlasImpl_onProfileSignIn(userId) {
        try {
            if (sHasInit) {
                DeviceInfoResolver_setDeviceId().then(function (result) {
                    var currentTime = CurrentTimeHelper_currentTimeMillis();
                    var runningEnv = CollectedDataPersister_getCurrentEnv();
                    var oldUserId = runningEnv.userId;
                    if (oldUserId === userId) {
                        // 相同用户，没有登出，不重复记录
                        LogProxy_w('Same user, no need to login again');
                        return;
                    }
                    // 前一个用户退出
                    if (oldUserId) {
                        CloudAtlasImpl_onProfileSignOff();
                    }
                    // 更新当前环境
                    runningEnv.userId = userId;
                    // 创建新会话
                    var currentData = CollectedDataPersister_getCurrentData();
                    CloudAtlasImpl_createNewSession(currentTime, currentData, runningEnv, false);
                });
            } else {
                LogProxy_e('Not allowed to sign in before init');
            }
        } catch (e) {
            LogProxy_e('Failed to sign in', e);
            if (sIsDebugMode) {
                throw e;
            }
        }
    }
    function CloudAtlasImpl_onProfileSignOff() {
        try {
            if (sHasInit) {
                DeviceInfoResolver_setDeviceId().then(function (result) {
                    var runningEnv = CollectedDataPersister_getCurrentEnv();
                    var oldUserId = runningEnv.userId;
                    // 前一个用户退出
                    if (oldUserId) {
                        // 更新当前环境
                        runningEnv.userId = null;
                        var currentTime = CurrentTimeHelper_currentTimeMillis();
                        // 创建新会话
                        var currentData = CollectedDataPersister_getCurrentData();
                        CloudAtlasImpl_createNewSession(currentTime, currentData, runningEnv, false);
                    } else {
                        LogProxy_w('No user is login now, no need to logout, maybe something wrong with app');
                    }
                });
            } else {
                LogProxy_e('Not allowed to sign off before init');
            }
        } catch (e) {
            LogProxy_e('Failed to sign off', e);
            if (sIsDebugMode) {
                throw e;
            }
        }
    }
    function CloudAtlasImpl_onEvent(options) {
        DeviceInfoResolver_setDeviceId().then(function (result) {
            var eventId = options.eventId;
            var value = {};
            if (options.info) {
                for (var prop in options.info) {
                    value[prop] = options.info[prop];
                }
            }
            if (options.label) {
                value[KEY_EVENT_LABEL] = options.label;
            }
            if (options.value) {
                value[KEY_EVENT_INT_VALUE] = options.value;
            }
            var time = CurrentTimeHelper_currentTimeMillis();
            var runningEnv = CollectedDataPersister_getCurrentEnv();
            var userId = runningEnv.userId,
                appVer = runningEnv.appVer,
                sessionId = runningEnv.sessionId;

            var event = new Event(eventId, value, time, userId, appVer, sActivityId, sessionId);
            if (sIsImmediately || !isLocalStorageSupport()) {
                CollectedDataPersister_setUploadData(event, 'eventList');
                CollectedDataUploader_sendPendingData();
            } else {
                LocalStoragePersist_saveCollectedData(1, event);
                // 通知更新了数据
                CollectedDataPersister_notifyUpdate();
            }
        });
    }
    function CloudAtlasImpl_reportError(message) {
        DeviceInfoResolver_setDeviceId().then(function (result) {
            var time = CurrentTimeHelper_currentTimeMillis();
            var runningEnv = CollectedDataPersister_getCurrentEnv();
            var appVer = runningEnv.appVer;

            var error = new Error$1(TYPE_USER_SUBMIT_MSG, message, time, appVer, sActivityId);
            if (sIsImmediately || !isLocalStorageSupport()) {
                CollectedDataPersister_setUploadData(error, 'errorList');
                CollectedDataUploader_sendPendingData();
            } else {
                LocalStoragePersist_saveCollectedData(1, error);
                CollectedDataPersister_notifyUpdate();
            }
        });
    }

    // url 解析
    var js_url = function () {
        function _t() {
            return new RegExp(/(.*?)\.?([^\.]*?)\.(com|net|org|biz|ws|in|me|co\.uk|co|org\.uk|ltd\.uk|plc\.uk|me\.uk|edu|mil|br\.com|cn\.com|eu\.com|hu\.com|no\.com|qc\.com|sa\.com|se\.com|se\.net|us\.com|uy\.com|ac|co\.ac|gv\.ac|or\.ac|ac\.ac|af|am|as|at|ac\.at|co\.at|gv\.at|or\.at|asn\.au|com\.au|edu\.au|org\.au|net\.au|id\.au|be|ac\.be|adm\.br|adv\.br|am\.br|arq\.br|art\.br|bio\.br|cng\.br|cnt\.br|com\.br|ecn\.br|eng\.br|esp\.br|etc\.br|eti\.br|fm\.br|fot\.br|fst\.br|g12\.br|gov\.br|ind\.br|inf\.br|jor\.br|lel\.br|med\.br|mil\.br|net\.br|nom\.br|ntr\.br|odo\.br|org\.br|ppg\.br|pro\.br|psc\.br|psi\.br|rec\.br|slg\.br|tmp\.br|tur\.br|tv\.br|vet\.br|zlg\.br|br|ab\.ca|bc\.ca|mb\.ca|nb\.ca|nf\.ca|ns\.ca|nt\.ca|on\.ca|pe\.ca|qc\.ca|sk\.ca|yk\.ca|ca|cc|ac\.cn|net\.cn|com\.cn|edu\.cn|gov\.cn|org\.cn|bj\.cn|sh\.cn|tj\.cn|cq\.cn|he\.cn|nm\.cn|ln\.cn|jl\.cn|hl\.cn|js\.cn|zj\.cn|ah\.cn|gd\.cn|gx\.cn|hi\.cn|sc\.cn|gz\.cn|yn\.cn|xz\.cn|sn\.cn|gs\.cn|qh\.cn|nx\.cn|xj\.cn|tw\.cn|hk\.cn|mo\.cn|cn|cx|cz|de|dk|fo|com\.ec|tm\.fr|com\.fr|asso\.fr|presse\.fr|fr|gf|gs|co\.il|net\.il|ac\.il|k12\.il|gov\.il|muni\.il|ac\.in|co\.in|org\.in|ernet\.in|gov\.in|net\.in|res\.in|is|it|ac\.jp|co\.jp|go\.jp|or\.jp|ne\.jp|ac\.kr|co\.kr|go\.kr|ne\.kr|nm\.kr|or\.kr|li|lt|lu|asso\.mc|tm\.mc|com\.mm|org\.mm|net\.mm|edu\.mm|gov\.mm|ms|nl|no|nu|pl|ro|org\.ro|store\.ro|tm\.ro|firm\.ro|www\.ro|arts\.ro|rec\.ro|info\.ro|nom\.ro|nt\.ro|se|si|com\.sg|org\.sg|net\.sg|gov\.sg|sk|st|tf|ac\.th|co\.th|go\.th|mi\.th|net\.th|or\.th|tm|to|com\.tr|edu\.tr|gov\.tr|k12\.tr|net\.tr|org\.tr|com\.tw|org\.tw|net\.tw|ac\.uk|uk\.com|uk\.net|gb\.com|gb\.net|vg|sh|kz|ch|info|ua|gov|name|pro|ie|hk|com\.hk|org\.hk|net\.hk|edu\.hk|us|tk|cd|by|ad|lv|eu\.lv|bz|es|jp|cl|ag|mobi|eu|co\.nz|org\.nz|net\.nz|maori\.nz|iwi\.nz|io|la|md|sc|sg|vc|tw|travel|my|se|tv|pt|com\.pt|edu\.pt|asia|fi|com\.ve|net\.ve|fi|org\.ve|web\.ve|info\.ve|co\.ve|tel|im|gr|ru|net\.ru|org\.ru|hr|com\.hr|ly|xyz)$/);
        }

        function _d(s) {
            return _.decodeURIComponent(s.replace(/\+/g, ' '));
        }

        function _i(arg, str) {
            var sptr = arg.charAt(0),
                split = str.split(sptr);

            if (sptr === arg) {
                return split;
            }

            arg = parseInt(arg.substring(1), 10);

            return split[arg < 0 ? split.length + arg : arg - 1];
        }

        function _f(arg, str) {
            var sptr = arg.charAt(0),
                split = str.split('&'),
                field = [],
                params = {},
                tmp = [],
                arg2 = arg.substring(1);

            for (var i = 0, ii = split.length; i < ii; i++) {
                field = split[i].match(/(.*?)=(.*)/);

                // TODO: regex should be able to handle this.
                if (!field) {
                    field = [split[i], split[i], ''];
                }

                if (field[1].replace(/\s/g, '') !== '') {
                    field[2] = _d(field[2] || '');

                    // If we have a match just return it right away.
                    if (arg2 === field[1]) {
                        return field[2];
                    }

                    // Check for array pattern.
                    tmp = field[1].match(/(.*)\[([0-9]+)\]/);

                    if (tmp) {
                        params[tmp[1]] = params[tmp[1]] || [];

                        params[tmp[1]][tmp[2]] = field[2];
                    } else {
                        params[field[1]] = field[2];
                    }
                }
            }

            if (sptr === arg) {
                return params;
            }

            return params[arg2];
        }

        return function (arg, url) {
            var _l = {},
                tmp = void 0;

            if (arg === 'tld?') {
                return _t();
            }

            url = url || window.location.toString();

            if (!arg) {
                return url;
            }

            arg = arg.toString();

            if (tmp = url.match(/^mailto:([^\/].+)/)) {
                _l.protocol = 'mailto';
                _l.email = tmp[1];
            } else {
                // Ignore Hashbangs.
                if (tmp = url.match(/(.*?)\/#\!(.*)/)) {
                    url = tmp[1] + tmp[2];
                }

                // Hash.
                if (tmp = url.match(/(.*?)#(.*)/)) {
                    _l.hash = tmp[2];
                    url = tmp[1];
                }

                // Return hash parts.
                if (_l.hash && arg.match(/^#/)) {
                    return _f(arg, _l.hash);
                }

                // Query
                if (tmp = url.match(/(.*?)\?(.*)/)) {
                    _l.query = tmp[2];
                    url = tmp[1];
                }

                // Return query parts.
                if (_l.query && arg.match(/^\?/)) {
                    return _f(arg, _l.query);
                }

                // Protocol.
                if (tmp = url.match(/(.*?)\:?\/\/(.*)/)) {
                    _l.protocol = tmp[1].toLowerCase();
                    url = tmp[2];
                }

                // Path.
                if (tmp = url.match(/(.*?)(\/.*)/)) {
                    _l.path = tmp[2];
                    url = tmp[1];
                }

                // Clean up path.
                _l.path = (_l.path || '').replace(/^([^\/])/, '/$1').replace(/\/$/, '');

                // Return path parts.
                if (arg.match(/^[\-0-9]+$/)) {
                    arg = arg.replace(/^([^\/])/, '/$1');
                }
                if (arg.match(/^\//)) {
                    return _i(arg, _l.path.substring(1));
                }

                // File.
                tmp = _i('/-1', _l.path.substring(1));

                if (tmp && (tmp = tmp.match(/(.*?)\.(.*)/))) {
                    _l.file = tmp[0];
                    _l.filename = tmp[1];
                    _l.fileext = tmp[2];
                }

                // Port.
                if (tmp = url.match(/(.*)\:([0-9]+)$/)) {
                    _l.port = tmp[2];
                    url = tmp[1];
                }

                // Auth.
                if (tmp = url.match(/(.*?)@(.*)/)) {
                    _l.auth = tmp[1];
                    url = tmp[2];
                }

                // User and pass.
                if (_l.auth) {
                    tmp = _l.auth.match(/(.*)\:(.*)/);

                    _l.user = tmp ? tmp[1] : _l.auth;
                    _l.pass = tmp ? tmp[2] : undefined;
                }

                // Hostname.
                _l.hostname = url.toLowerCase();

                // Return hostname parts.
                if (arg.charAt(0) === '.') {
                    return _i(arg, _l.hostname);
                }

                // Domain, tld and sub domain.
                if (_t()) {
                    tmp = _l.hostname.match(_t());

                    if (tmp) {
                        _l.tld = tmp[3];
                        _l.domain = tmp[2] ? tmp[2] + '.' + tmp[3] : undefined;
                        _l.sub = tmp[1] || undefined;
                    }
                }

                // Set port and protocol defaults if not set.
                _l.port = _l.port || (_l.protocol === 'https' ? '443' : '80');
                _l.protocol = _l.protocol || (_l.port === '443' ? 'https' : 'http');
            }

            // Return arg.
            if (arg in _l) {
                return _l[arg];
            }

            // Return everything.
            if (arg === '{}') {
                return _l;
            }

            // Default to undefined for no match.
            return '';
        };
    }();

    // referrer字符串截取
    var MAX_REFERRER_STRING_LENGTH = 200;
    // 返回载入当前文档的文档的 URL，来源
    function getReferrer(referrer) {
        var referrer = referrer || document.referrer;
        if (typeof referrer !== 'string') {
            return '取值异常_referrer异常_' + String(referrer);
        }
        if (referrer.indexOf('https://www.baidu.com/') === 0) {
            referrer = referrer.split('?')[0];
        }
        referrer = referrer.slice(0, MAX_REFERRER_STRING_LENGTH);
        return typeof referrer === 'string' ? referrer : '';
    }
    // 获取页面信息。
    function getPageInfo() {
        var referrer = getReferrer();
        var title = document.title;
        var referrer_host = referrer ? js_url(referrer, 'hostname') : referrer;
        var url = location.href;
        var url_path = location.pathname;
        var pageProp = {
            referrer: referrer,
            referrer_host: referrer_host,
            title: title,
            url: url,
            url_path: url_path
        };
        event$1({ eventId: 'ca_pageview_enter', info: { referrer: referrer, referrer_host: referrer_host, title: title, url: url, url_path: url_path } });
        sessionStorage.setItem(KEY_LEAVE_PAGE_INFO, JSON.stringify(pageProp));
    }
    // 获取离开页面信息
    function getLeavrPageInfo() {
        var strPageInfo = sessionStorage.getItem(KEY_LEAVE_PAGE_INFO);
        if (strPageInfo) {
            var pageInfo = JSON.parse(strPageInfo);
            if (pageInfo.url !== location.href) {
                event$1({ eventId: 'ca_pageview_leave', info: pageInfo });
            }
        }
    }
    function sendPageInfo(eventName) {
        if (eventName === 'ca_pageview_enter') {
            getPageInfo();
        } else if (eventName === 'ca_pageview_leave') {
            getLeavrPageInfo();
        }
    }

    var common = createCommonjsModule(function (module, exports) {
        var TYPED_OK = (typeof Uint8Array !== 'undefined') &&
            (typeof Uint16Array !== 'undefined') &&
            (typeof Int32Array !== 'undefined');

        function _has(obj, key) {
            return Object.prototype.hasOwnProperty.call(obj, key);
        }

        exports.assign = function (obj /*from1, from2, from3, ...*/) {
            var sources = Array.prototype.slice.call(arguments, 1);
            while (sources.length) {
                var source = sources.shift();
                if (!source) { continue; }

                if (typeof source !== 'object') {
                    throw new TypeError(source + 'must be non-object');
                }

                for (var p in source) {
                    if (_has(source, p)) {
                        obj[p] = source[p];
                    }
                }
            }

            return obj;
        };


        // reduce buffer size, avoiding mem copy
        exports.shrinkBuf = function (buf, size) {
            if (buf.length === size) { return buf; }
            if (buf.subarray) { return buf.subarray(0, size); }
            buf.length = size;
            return buf;
        };


        var fnTyped = {
            arraySet: function (dest, src, src_offs, len, dest_offs) {
                if (src.subarray && dest.subarray) {
                    dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
                    return;
                }
                // Fallback to ordinary array
                for (var i = 0; i < len; i++) {
                    dest[dest_offs + i] = src[src_offs + i];
                }
            },
            // Join array of chunks to single array.
            flattenChunks: function (chunks) {
                var i, l, len, pos, chunk, result;

                // calculate data length
                len = 0;
                for (i = 0, l = chunks.length; i < l; i++) {
                    len += chunks[i].length;
                }

                // join chunks
                result = new Uint8Array(len);
                pos = 0;
                for (i = 0, l = chunks.length; i < l; i++) {
                    chunk = chunks[i];
                    result.set(chunk, pos);
                    pos += chunk.length;
                }

                return result;
            }
        };

        var fnUntyped = {
            arraySet: function (dest, src, src_offs, len, dest_offs) {
                for (var i = 0; i < len; i++) {
                    dest[dest_offs + i] = src[src_offs + i];
                }
            },
            // Join array of chunks to single array.
            flattenChunks: function (chunks) {
                return [].concat.apply([], chunks);
            }
        };


        // Enable/Disable typed arrays use, for testing
        //
        exports.setTyped = function (on) {
            if (on) {
                exports.Buf8 = Uint8Array;
                exports.Buf16 = Uint16Array;
                exports.Buf32 = Int32Array;
                exports.assign(exports, fnTyped);
            } else {
                exports.Buf8 = Array;
                exports.Buf16 = Array;
                exports.Buf32 = Array;
                exports.assign(exports, fnUntyped);
            }
        };

        exports.setTyped(TYPED_OK);
    });

    var common_1 = common.assign;
    var common_2 = common.shrinkBuf;
    var common_3 = common.setTyped;
    var common_4 = common.Buf8;
    var common_5 = common.Buf16;
    var common_6 = common.Buf32;

    // (C) 1995-2013 Jean-loup Gailly and Mark Adler
    // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
    //
    // This software is provided 'as-is', without any express or implied
    // warranty. In no event will the authors be held liable for any damages
    // arising from the use of this software.
    //
    // Permission is granted to anyone to use this software for any purpose,
    // including commercial applications, and to alter it and redistribute it
    // freely, subject to the following restrictions:
    //
    // 1. The origin of this software must not be misrepresented; you must not
    //   claim that you wrote the original software. If you use this software
    //   in a product, an acknowledgment in the product documentation would be
    //   appreciated but is not required.
    // 2. Altered source versions must be plainly marked as such, and must not be
    //   misrepresented as being the original software.
    // 3. This notice may not be removed or altered from any source distribution.



    /* Public constants ==========================================================*/
    /* ===========================================================================*/


    //var Z_FILTERED          = 1;
    //var Z_HUFFMAN_ONLY      = 2;
    //var Z_RLE               = 3;
    var Z_FIXED = 4;
    //var Z_DEFAULT_STRATEGY  = 0;

    /* Possible values of the data_type field (though see inflate()) */
    var Z_BINARY = 0;
    var Z_TEXT = 1;
    //var Z_ASCII             = 1; // = Z_TEXT
    var Z_UNKNOWN = 2;

    /*============================================================================*/


    function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }

    // From zutil.h

    var STORED_BLOCK = 0;
    var STATIC_TREES = 1;
    var DYN_TREES = 2;
    /* The three kinds of block type */

    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    /* The minimum and maximum match lengths */

    // From deflate.h
    /* ===========================================================================
     * Internal compression state.
     */

    var LENGTH_CODES = 29;
    /* number of length codes, not counting the special END_BLOCK code */

    var LITERALS = 256;
    /* number of literal bytes 0..255 */

    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    /* number of Literal or Length codes, including the END_BLOCK code */

    var D_CODES = 30;
    /* number of distance codes */

    var BL_CODES = 19;
    /* number of codes used to transfer the bit lengths */

    var HEAP_SIZE = 2 * L_CODES + 1;
    /* maximum heap size */

    var MAX_BITS = 15;
    /* All codes must not exceed MAX_BITS bits */

    var Buf_size = 16;
    /* size of bit buffer in bi_buf */


    /* ===========================================================================
     * Constants
     */

    var MAX_BL_BITS = 7;
    /* Bit length codes must not exceed MAX_BL_BITS bits */

    var END_BLOCK = 256;
    /* end of block literal code */

    var REP_3_6 = 16;
    /* repeat previous bit length 3-6 times (2 bits of repeat count) */

    var REPZ_3_10 = 17;
    /* repeat a zero length 3-10 times  (3 bits of repeat count) */

    var REPZ_11_138 = 18;
    /* repeat a zero length 11-138 times  (7 bits of repeat count) */

    /* eslint-disable comma-spacing,array-bracket-spacing */
    var extra_lbits =   /* extra bits for each length code */
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];

    var extra_dbits =   /* extra bits for each distance code */
        [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];

    var extra_blbits =  /* extra bits for each bit length code */
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];

    var bl_order =
        [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    /* eslint-enable comma-spacing,array-bracket-spacing */

    /* The lengths of the bit length codes are sent in order of decreasing
     * probability, to avoid transmitting the lengths for unused bit length codes.
     */

    /* ===========================================================================
     * Local data. These are initialized only once.
     */

    // We pre-fill arrays with 0 to avoid uninitialized gaps

    var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

    // !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
    var static_ltree = new Array((L_CODES + 2) * 2);
    zero(static_ltree);
    /* The static literal tree. Since the bit lengths are imposed, there is no
     * need for the L_CODES extra codes used during heap construction. However
     * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
     * below).
     */

    var static_dtree = new Array(D_CODES * 2);
    zero(static_dtree);
    /* The static distance tree. (Actually a trivial tree since all codes use
     * 5 bits.)
     */

    var _dist_code = new Array(DIST_CODE_LEN);
    zero(_dist_code);
    /* Distance codes. The first 256 values correspond to the distances
     * 3 .. 258, the last 256 values correspond to the top 8 bits of
     * the 15 bit distances.
     */

    var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
    zero(_length_code);
    /* length code for each normalized match length (0 == MIN_MATCH) */

    var base_length = new Array(LENGTH_CODES);
    zero(base_length);
    /* First normalized length for each code (0 = MIN_MATCH) */

    var base_dist = new Array(D_CODES);
    zero(base_dist);
    /* First normalized distance for each code (0 = distance of 1) */


    function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

        this.static_tree = static_tree;  /* static tree or NULL */
        this.extra_bits = extra_bits;   /* extra bits for each code or NULL */
        this.extra_base = extra_base;   /* base index for extra_bits */
        this.elems = elems;        /* max number of elements in the tree */
        this.max_length = max_length;   /* max bit length for the codes */

        // show if `static_tree` has data or dummy - needed for monomorphic objects
        this.has_stree = static_tree && static_tree.length;
    }


    var static_l_desc;
    var static_d_desc;
    var static_bl_desc;


    function TreeDesc(dyn_tree, stat_desc) {
        this.dyn_tree = dyn_tree;     /* the dynamic tree */
        this.max_code = 0;            /* largest code with non zero frequency */
        this.stat_desc = stat_desc;   /* the corresponding static tree */
    }



    function d_code(dist) {
        return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
    }


    /* ===========================================================================
     * Output a short LSB first on the stream.
     * IN assertion: there is enough room in pendingBuf.
     */
    function put_short(s, w) {
        //    put_byte(s, (uch)((w) & 0xff));
        //    put_byte(s, (uch)((ush)(w) >> 8));
        s.pending_buf[s.pending++] = (w) & 0xff;
        s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
    }


    /* ===========================================================================
     * Send a value on a given number of bits.
     * IN assertion: length <= 16 and value fits in length bits.
     */
    function send_bits(s, value, length) {
        if (s.bi_valid > (Buf_size - length)) {
            s.bi_buf |= (value << s.bi_valid) & 0xffff;
            put_short(s, s.bi_buf);
            s.bi_buf = value >> (Buf_size - s.bi_valid);
            s.bi_valid += length - Buf_size;
        } else {
            s.bi_buf |= (value << s.bi_valid) & 0xffff;
            s.bi_valid += length;
        }
    }


    function send_code(s, c, tree) {
        send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
    }


    /* ===========================================================================
     * Reverse the first len bits of a code, using straightforward code (a faster
     * method would use a table)
     * IN assertion: 1 <= len <= 15
     */
    function bi_reverse(code, len) {
        var res = 0;
        do {
            res |= code & 1;
            code >>>= 1;
            res <<= 1;
        } while (--len > 0);
        return res >>> 1;
    }


    /* ===========================================================================
     * Flush the bit buffer, keeping at most 7 bits in it.
     */
    function bi_flush(s) {
        if (s.bi_valid === 16) {
            put_short(s, s.bi_buf);
            s.bi_buf = 0;
            s.bi_valid = 0;

        } else if (s.bi_valid >= 8) {
            s.pending_buf[s.pending++] = s.bi_buf & 0xff;
            s.bi_buf >>= 8;
            s.bi_valid -= 8;
        }
    }


    /* ===========================================================================
     * Compute the optimal bit lengths for a tree and update the total bit length
     * for the current block.
     * IN assertion: the fields freq and dad are set, heap[heap_max] and
     *    above are the tree nodes sorted by increasing frequency.
     * OUT assertions: the field len is set to the optimal bit length, the
     *     array bl_count contains the frequencies for each bit length.
     *     The length opt_len is updated; static_len is also updated if stree is
     *     not null.
     */
    function gen_bitlen(s, desc)
    //    deflate_state *s;
    //    tree_desc *desc;    /* the tree descriptor */
    {
        var tree = desc.dyn_tree;
        var max_code = desc.max_code;
        var stree = desc.stat_desc.static_tree;
        var has_stree = desc.stat_desc.has_stree;
        var extra = desc.stat_desc.extra_bits;
        var base = desc.stat_desc.extra_base;
        var max_length = desc.stat_desc.max_length;
        var h;              /* heap index */
        var n, m;           /* iterate over the tree elements */
        var bits;           /* bit length */
        var xbits;          /* extra bits */
        var f;              /* frequency */
        var overflow = 0;   /* number of elements with bit length too large */

        for (bits = 0; bits <= MAX_BITS; bits++) {
            s.bl_count[bits] = 0;
        }

        /* In a first pass, compute the optimal bit lengths (which may
         * overflow in the case of the bit length tree).
         */
        tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

        for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
            n = s.heap[h];
            bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
            if (bits > max_length) {
                bits = max_length;
                overflow++;
            }
            tree[n * 2 + 1]/*.Len*/ = bits;
            /* We overwrite tree[n].Dad which is no longer needed */

            if (n > max_code) { continue; } /* not a leaf node */

            s.bl_count[bits]++;
            xbits = 0;
            if (n >= base) {
                xbits = extra[n - base];
            }
            f = tree[n * 2]/*.Freq*/;
            s.opt_len += f * (bits + xbits);
            if (has_stree) {
                s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
            }
        }
        if (overflow === 0) { return; }

        // Trace((stderr,"\nbit length overflow\n"));
        /* This happens for example on obj2 and pic of the Calgary corpus */

        /* Find the first bit length which could increase: */
        do {
            bits = max_length - 1;
            while (s.bl_count[bits] === 0) { bits--; }
            s.bl_count[bits]--;      /* move one leaf down the tree */
            s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
            s.bl_count[max_length]--;
            /* The brother of the overflow item also moves one step up,
             * but this does not affect bl_count[max_length]
             */
            overflow -= 2;
        } while (overflow > 0);

        /* Now recompute all bit lengths, scanning in increasing frequency.
         * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
         * lengths instead of fixing only the wrong ones. This idea is taken
         * from 'ar' written by Haruhiko Okumura.)
         */
        for (bits = max_length; bits !== 0; bits--) {
            n = s.bl_count[bits];
            while (n !== 0) {
                m = s.heap[--h];
                if (m > max_code) { continue; }
                if (tree[m * 2 + 1]/*.Len*/ !== bits) {
                    // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
                    s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
                    tree[m * 2 + 1]/*.Len*/ = bits;
                }
                n--;
            }
        }
    }


    /* ===========================================================================
     * Generate the codes for a given tree and bit counts (which need not be
     * optimal).
     * IN assertion: the array bl_count contains the bit length statistics for
     * the given tree and the field len is set for all tree elements.
     * OUT assertion: the field code is set for all tree elements of non
     *     zero code length.
     */
    function gen_codes(tree, max_code, bl_count)
    //    ct_data *tree;             /* the tree to decorate */
    //    int max_code;              /* largest code with non zero frequency */
    //    ushf *bl_count;            /* number of codes at each bit length */
    {
        var next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
        var code = 0;              /* running code value */
        var bits;                  /* bit index */
        var n;                     /* code index */

        /* The distribution counts are first used to generate the code values
         * without bit reversal.
         */
        for (bits = 1; bits <= MAX_BITS; bits++) {
            next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
        }
        /* Check that the bit counts in bl_count are consistent. The last code
         * must be all ones.
         */
        //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
        //        "inconsistent bit counts");
        //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

        for (n = 0; n <= max_code; n++) {
            var len = tree[n * 2 + 1];
            if (len === 0) { continue; }
            /* Now reverse the bits */
            tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

            //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
            //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
        }
    }


    /* ===========================================================================
     * Initialize the various 'constant' tables.
     */
    function tr_static_init() {
        var n;        /* iterates over tree elements */
        var bits;     /* bit counter */
        var length;   /* length value */
        var code;     /* code value */
        var dist;     /* distance index */
        var bl_count = new Array(MAX_BITS + 1);
        /* number of codes at each bit length for an optimal tree */

        // do check in _tr_init()
        //if (static_init_done) return;

        /* For some embedded targets, global variables are not initialized: */
        /*#ifdef NO_INIT_GLOBAL_POINTERS
          static_l_desc.static_tree = static_ltree;
          static_l_desc.extra_bits = extra_lbits;
          static_d_desc.static_tree = static_dtree;
          static_d_desc.extra_bits = extra_dbits;
          static_bl_desc.extra_bits = extra_blbits;
        #endif*/

        /* Initialize the mapping length (0..255) -> length code (0..28) */
        length = 0;
        for (code = 0; code < LENGTH_CODES - 1; code++) {
            base_length[code] = length;
            for (n = 0; n < (1 << extra_lbits[code]); n++) {
                _length_code[length++] = code;
            }
        }
        //Assert (length == 256, "tr_static_init: length != 256");
        /* Note that the length 255 (match length 258) can be represented
         * in two different ways: code 284 + 5 bits or code 285, so we
         * overwrite length_code[255] to use the best encoding:
         */
        _length_code[length - 1] = code;

        /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
        dist = 0;
        for (code = 0; code < 16; code++) {
            base_dist[code] = dist;
            for (n = 0; n < (1 << extra_dbits[code]); n++) {
                _dist_code[dist++] = code;
            }
        }
        //Assert (dist == 256, "tr_static_init: dist != 256");
        dist >>= 7; /* from now on, all distances are divided by 128 */
        for (; code < D_CODES; code++) {
            base_dist[code] = dist << 7;
            for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
                _dist_code[256 + dist++] = code;
            }
        }
        //Assert (dist == 256, "tr_static_init: 256+dist != 512");

        /* Construct the codes of the static literal tree */
        for (bits = 0; bits <= MAX_BITS; bits++) {
            bl_count[bits] = 0;
        }

        n = 0;
        while (n <= 143) {
            static_ltree[n * 2 + 1]/*.Len*/ = 8;
            n++;
            bl_count[8]++;
        }
        while (n <= 255) {
            static_ltree[n * 2 + 1]/*.Len*/ = 9;
            n++;
            bl_count[9]++;
        }
        while (n <= 279) {
            static_ltree[n * 2 + 1]/*.Len*/ = 7;
            n++;
            bl_count[7]++;
        }
        while (n <= 287) {
            static_ltree[n * 2 + 1]/*.Len*/ = 8;
            n++;
            bl_count[8]++;
        }
        /* Codes 286 and 287 do not exist, but we must include them in the
         * tree construction to get a canonical Huffman tree (longest code
         * all ones)
         */
        gen_codes(static_ltree, L_CODES + 1, bl_count);

        /* The static distance tree is trivial: */
        for (n = 0; n < D_CODES; n++) {
            static_dtree[n * 2 + 1]/*.Len*/ = 5;
            static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
        }

        // Now data ready and we can init static trees
        static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
        static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
        static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);

        //static_init_done = true;
    }


    /* ===========================================================================
     * Initialize a new block.
     */
    function init_block(s) {
        var n; /* iterates over tree elements */

        /* Initialize the trees. */
        for (n = 0; n < L_CODES; n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
        for (n = 0; n < D_CODES; n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
        for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

        s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
        s.opt_len = s.static_len = 0;
        s.last_lit = s.matches = 0;
    }


    /* ===========================================================================
     * Flush the bit buffer and align the output on a byte boundary
     */
    function bi_windup(s) {
        if (s.bi_valid > 8) {
            put_short(s, s.bi_buf);
        } else if (s.bi_valid > 0) {
            //put_byte(s, (Byte)s->bi_buf);
            s.pending_buf[s.pending++] = s.bi_buf;
        }
        s.bi_buf = 0;
        s.bi_valid = 0;
    }

    /* ===========================================================================
     * Copy a stored block, storing first the length and its
     * one's complement if requested.
     */
    function copy_block(s, buf, len, header)
    //DeflateState *s;
    //charf    *buf;    /* the input data */
    //unsigned len;     /* its length */
    //int      header;  /* true if block header must be written */
    {
        bi_windup(s);        /* align on byte boundary */

        if (header) {
            put_short(s, len);
            put_short(s, ~len);
        }
        //  while (len--) {
        //    put_byte(s, *buf++);
        //  }
        common.arraySet(s.pending_buf, s.window, buf, len, s.pending);
        s.pending += len;
    }

    /* ===========================================================================
     * Compares to subtrees, using the tree depth as tie breaker when
     * the subtrees have equal frequency. This minimizes the worst case length.
     */
    function smaller(tree, n, m, depth) {
        var _n2 = n * 2;
        var _m2 = m * 2;
        return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
            (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
    }

    /* ===========================================================================
     * Restore the heap property by moving down the tree starting at node k,
     * exchanging a node with the smallest of its two sons if necessary, stopping
     * when the heap property is re-established (each father smaller than its
     * two sons).
     */
    function pqdownheap(s, tree, k)
    //    deflate_state *s;
    //    ct_data *tree;  /* the tree to restore */
    //    int k;               /* node to move down */
    {
        var v = s.heap[k];
        var j = k << 1;  /* left son of k */
        while (j <= s.heap_len) {
            /* Set j to the smallest of the two sons: */
            if (j < s.heap_len &&
                smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
                j++;
            }
            /* Exit if v is smaller than both sons */
            if (smaller(tree, v, s.heap[j], s.depth)) { break; }

            /* Exchange v with the smallest son */
            s.heap[k] = s.heap[j];
            k = j;

            /* And continue down the tree, setting j to the left son of k */
            j <<= 1;
        }
        s.heap[k] = v;
    }


    // inlined manually
    // var SMALLEST = 1;

    /* ===========================================================================
     * Send the block data compressed using the given Huffman trees
     */
    function compress_block(s, ltree, dtree)
    //    deflate_state *s;
    //    const ct_data *ltree; /* literal tree */
    //    const ct_data *dtree; /* distance tree */
    {
        var dist;           /* distance of matched string */
        var lc;             /* match length or unmatched char (if dist == 0) */
        var lx = 0;         /* running index in l_buf */
        var code;           /* the code to send */
        var extra;          /* number of extra bits to send */

        if (s.last_lit !== 0) {
            do {
                dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
                lc = s.pending_buf[s.l_buf + lx];
                lx++;

                if (dist === 0) {
                    send_code(s, lc, ltree); /* send a literal byte */
                    //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
                } else {
                    /* Here, lc is the match length - MIN_MATCH */
                    code = _length_code[lc];
                    send_code(s, code + LITERALS + 1, ltree); /* send the length code */
                    extra = extra_lbits[code];
                    if (extra !== 0) {
                        lc -= base_length[code];
                        send_bits(s, lc, extra);       /* send the extra length bits */
                    }
                    dist--; /* dist is now the match distance - 1 */
                    code = d_code(dist);
                    //Assert (code < D_CODES, "bad d_code");

                    send_code(s, code, dtree);       /* send the distance code */
                    extra = extra_dbits[code];
                    if (extra !== 0) {
                        dist -= base_dist[code];
                        send_bits(s, dist, extra);   /* send the extra distance bits */
                    }
                } /* literal or match pair ? */

                /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
                //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
                //       "pendingBuf overflow");

            } while (lx < s.last_lit);
        }

        send_code(s, END_BLOCK, ltree);
    }


    /* ===========================================================================
     * Construct one Huffman tree and assigns the code bit strings and lengths.
     * Update the total bit length for the current block.
     * IN assertion: the field freq is set for all tree elements.
     * OUT assertions: the fields len and code are set to the optimal bit length
     *     and corresponding code. The length opt_len is updated; static_len is
     *     also updated if stree is not null. The field max_code is set.
     */
    function build_tree(s, desc)
    //    deflate_state *s;
    //    tree_desc *desc; /* the tree descriptor */
    {
        var tree = desc.dyn_tree;
        var stree = desc.stat_desc.static_tree;
        var has_stree = desc.stat_desc.has_stree;
        var elems = desc.stat_desc.elems;
        var n, m;          /* iterate over heap elements */
        var max_code = -1; /* largest code with non zero frequency */
        var node;          /* new node being created */

        /* Construct the initial heap, with least frequent element in
         * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
         * heap[0] is not used.
         */
        s.heap_len = 0;
        s.heap_max = HEAP_SIZE;

        for (n = 0; n < elems; n++) {
            if (tree[n * 2]/*.Freq*/ !== 0) {
                s.heap[++s.heap_len] = max_code = n;
                s.depth[n] = 0;

            } else {
                tree[n * 2 + 1]/*.Len*/ = 0;
            }
        }

        /* The pkzip format requires that at least one distance code exists,
         * and that at least one bit should be sent even if there is only one
         * possible code. So to avoid special checks later on we force at least
         * two codes of non zero frequency.
         */
        while (s.heap_len < 2) {
            node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
            tree[node * 2]/*.Freq*/ = 1;
            s.depth[node] = 0;
            s.opt_len--;

            if (has_stree) {
                s.static_len -= stree[node * 2 + 1]/*.Len*/;
            }
            /* node is 0 or 1 so it does not have extra bits */
        }
        desc.max_code = max_code;

        /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
         * establish sub-heaps of increasing lengths:
         */
        for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

        /* Construct the Huffman tree by repeatedly combining the least two
         * frequent nodes.
         */
        node = elems;              /* next internal node of the tree */
        do {
            //pqremove(s, tree, n);  /* n = node of least frequency */
            /*** pqremove ***/
            n = s.heap[1/*SMALLEST*/];
            s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
            pqdownheap(s, tree, 1/*SMALLEST*/);
            /***/

            m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

            s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
            s.heap[--s.heap_max] = m;

            /* Create a new node father of n and m */
            tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
            s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
            tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

            /* and insert the new node in the heap */
            s.heap[1/*SMALLEST*/] = node++;
            pqdownheap(s, tree, 1/*SMALLEST*/);

        } while (s.heap_len >= 2);

        s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

        /* At this point, the fields freq and dad are set. We can now
         * generate the bit lengths.
         */
        gen_bitlen(s, desc);

        /* The field len is now set, we can generate the bit codes */
        gen_codes(tree, max_code, s.bl_count);
    }


    /* ===========================================================================
     * Scan a literal or distance tree to determine the frequencies of the codes
     * in the bit length tree.
     */
    function scan_tree(s, tree, max_code)
    //    deflate_state *s;
    //    ct_data *tree;   /* the tree to be scanned */
    //    int max_code;    /* and its largest code of non zero frequency */
    {
        var n;                     /* iterates over all tree elements */
        var prevlen = -1;          /* last emitted length */
        var curlen;                /* length of current code */

        var nextlen = tree[0 * 2 + 1]; /* length of next code */

        var count = 0;             /* repeat count of the current code */
        var max_count = 7;         /* max repeat count */
        var min_count = 4;         /* min repeat count */

        if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
        }
        tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

        for (n = 0; n <= max_code; n++) {
            curlen = nextlen;
            nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

            if (++count < max_count && curlen === nextlen) {
                continue;

            } else if (count < min_count) {
                s.bl_tree[curlen * 2]/*.Freq*/ += count;

            } else if (curlen !== 0) {

                if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
                s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

            } else if (count <= 10) {
                s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

            } else {
                s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
            }

            count = 0;
            prevlen = curlen;

            if (nextlen === 0) {
                max_count = 138;
                min_count = 3;

            } else if (curlen === nextlen) {
                max_count = 6;
                min_count = 3;

            } else {
                max_count = 7;
                min_count = 4;
            }
        }
    }


    /* ===========================================================================
     * Send a literal or distance tree in compressed form, using the codes in
     * bl_tree.
     */
    function send_tree(s, tree, max_code)
    //    deflate_state *s;
    //    ct_data *tree; /* the tree to be scanned */
    //    int max_code;       /* and its largest code of non zero frequency */
    {
        var n;                     /* iterates over all tree elements */
        var prevlen = -1;          /* last emitted length */
        var curlen;                /* length of current code */

        var nextlen = tree[0 * 2 + 1]; /* length of next code */

        var count = 0;             /* repeat count of the current code */
        var max_count = 7;         /* max repeat count */
        var min_count = 4;         /* min repeat count */

        /* tree[max_code+1].Len = -1; */  /* guard already set */
        if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
        }

        for (n = 0; n <= max_code; n++) {
            curlen = nextlen;
            nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

            if (++count < max_count && curlen === nextlen) {
                continue;

            } else if (count < min_count) {
                do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

            } else if (curlen !== 0) {
                if (curlen !== prevlen) {
                    send_code(s, curlen, s.bl_tree);
                    count--;
                }
                //Assert(count >= 3 && count <= 6, " 3_6?");
                send_code(s, REP_3_6, s.bl_tree);
                send_bits(s, count - 3, 2);

            } else if (count <= 10) {
                send_code(s, REPZ_3_10, s.bl_tree);
                send_bits(s, count - 3, 3);

            } else {
                send_code(s, REPZ_11_138, s.bl_tree);
                send_bits(s, count - 11, 7);
            }

            count = 0;
            prevlen = curlen;
            if (nextlen === 0) {
                max_count = 138;
                min_count = 3;

            } else if (curlen === nextlen) {
                max_count = 6;
                min_count = 3;

            } else {
                max_count = 7;
                min_count = 4;
            }
        }
    }


    /* ===========================================================================
     * Construct the Huffman tree for the bit lengths and return the index in
     * bl_order of the last bit length code to send.
     */
    function build_bl_tree(s) {
        var max_blindex;  /* index of last bit length code of non zero freq */

        /* Determine the bit length frequencies for literal and distance trees */
        scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
        scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

        /* Build the bit length tree: */
        build_tree(s, s.bl_desc);
        /* opt_len now includes the length of the tree representations, except
         * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
         */

        /* Determine the number of bit length codes to send. The pkzip format
         * requires that at least 4 bit length codes be sent. (appnote.txt says
         * 3 but the actual value used is 4.)
         */
        for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
            if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
                break;
            }
        }
        /* Update opt_len to include the bit length tree and counts */
        s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
        //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
        //        s->opt_len, s->static_len));

        return max_blindex;
    }


    /* ===========================================================================
     * Send the header for a block using dynamic Huffman trees: the counts, the
     * lengths of the bit length codes, the literal tree and the distance tree.
     * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
     */
    function send_all_trees(s, lcodes, dcodes, blcodes)
    //    deflate_state *s;
    //    int lcodes, dcodes, blcodes; /* number of codes for each tree */
    {
        var rank;                    /* index in bl_order */

        //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
        //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
        //        "too many codes");
        //Tracev((stderr, "\nbl counts: "));
        send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
        send_bits(s, dcodes - 1, 5);
        send_bits(s, blcodes - 4, 4); /* not -3 as stated in appnote.txt */
        for (rank = 0; rank < blcodes; rank++) {
            //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
            send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
        }
        //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

        send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
        //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

        send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
        //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
    }


    /* ===========================================================================
     * Check if the data type is TEXT or BINARY, using the following algorithm:
     * - TEXT if the two conditions below are satisfied:
     *    a) There are no non-portable control characters belonging to the
     *       "black list" (0..6, 14..25, 28..31).
     *    b) There is at least one printable character belonging to the
     *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
     * - BINARY otherwise.
     * - The following partially-portable control characters form a
     *   "gray list" that is ignored in this detection algorithm:
     *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
     * IN assertion: the fields Freq of dyn_ltree are set.
     */
    function detect_data_type(s) {
        /* black_mask is the bit mask of black-listed bytes
         * set bits 0..6, 14..25, and 28..31
         * 0xf3ffc07f = binary 11110011111111111100000001111111
         */
        var black_mask = 0xf3ffc07f;
        var n;

        /* Check for non-textual ("black-listed") bytes. */
        for (n = 0; n <= 31; n++ , black_mask >>>= 1) {
            if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
                return Z_BINARY;
            }
        }

        /* Check for textual ("white-listed") bytes. */
        if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
            s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
            return Z_TEXT;
        }
        for (n = 32; n < LITERALS; n++) {
            if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
                return Z_TEXT;
            }
        }

        /* There are no "black-listed" or "white-listed" bytes:
         * this stream either is empty or has tolerated ("gray-listed") bytes only.
         */
        return Z_BINARY;
    }


    var static_init_done = false;

    /* ===========================================================================
     * Initialize the tree data structures for a new zlib stream.
     */
    function _tr_init(s) {

        if (!static_init_done) {
            tr_static_init();
            static_init_done = true;
        }

        s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
        s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
        s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

        s.bi_buf = 0;
        s.bi_valid = 0;

        /* Initialize the first block of the first file: */
        init_block(s);
    }


    /* ===========================================================================
     * Send a stored block
     */
    function _tr_stored_block(s, buf, stored_len, last)
    //DeflateState *s;
    //charf *buf;       /* input block */
    //ulg stored_len;   /* length of input block */
    //int last;         /* one if this is the last block for a file */
    {
        send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
        copy_block(s, buf, stored_len, true); /* with header */
    }


    /* ===========================================================================
     * Send one empty static block to give enough lookahead for inflate.
     * This takes 10 bits, of which 7 may remain in the bit buffer.
     */
    function _tr_align(s) {
        send_bits(s, STATIC_TREES << 1, 3);
        send_code(s, END_BLOCK, static_ltree);
        bi_flush(s);
    }


    /* ===========================================================================
     * Determine the best encoding for the current block: dynamic trees, static
     * trees or store, and output the encoded block to the zip file.
     */
    function _tr_flush_block(s, buf, stored_len, last)
    //DeflateState *s;
    //charf *buf;       /* input block, or NULL if too old */
    //ulg stored_len;   /* length of input block */
    //int last;         /* one if this is the last block for a file */
    {
        var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
        var max_blindex = 0;        /* index of last bit length code of non zero freq */

        /* Build the Huffman trees unless a stored block is forced */
        if (s.level > 0) {

            /* Check if the file is binary or text */
            if (s.strm.data_type === Z_UNKNOWN) {
                s.strm.data_type = detect_data_type(s);
            }

            /* Construct the literal and distance trees */
            build_tree(s, s.l_desc);
            // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
            //        s->static_len));

            build_tree(s, s.d_desc);
            // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
            //        s->static_len));
            /* At this point, opt_len and static_len are the total bit lengths of
             * the compressed block data, excluding the tree representations.
             */

            /* Build the bit length tree for the above two trees, and get the index
             * in bl_order of the last bit length code to send.
             */
            max_blindex = build_bl_tree(s);

            /* Determine the best encoding. Compute the block lengths in bytes. */
            opt_lenb = (s.opt_len + 3 + 7) >>> 3;
            static_lenb = (s.static_len + 3 + 7) >>> 3;

            // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
            //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
            //        s->last_lit));

            if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

        } else {
            // Assert(buf != (char*)0, "lost buf");
            opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
        }

        if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
            /* 4: two words for the lengths */

            /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
             * Otherwise we can't have processed more than WSIZE input bytes since
             * the last block flush, because compression would have been
             * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
             * transform a block into a stored block.
             */
            _tr_stored_block(s, buf, stored_len, last);

        } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

            send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
            compress_block(s, static_ltree, static_dtree);

        } else {
            send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
            send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
            compress_block(s, s.dyn_ltree, s.dyn_dtree);
        }
        // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
        /* The above check is made mod 2^32, for files larger than 512 MB
         * and uLong implemented on 32 bits.
         */
        init_block(s);

        if (last) {
            bi_windup(s);
        }
        // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
        //       s->compressed_len-7*last));
    }

    /* ===========================================================================
     * Save the match info and tally the frequency counts. Return true if
     * the current block must be flushed.
     */
    function _tr_tally(s, dist, lc)
    //    deflate_state *s;
    //    unsigned dist;  /* distance of matched string */
    //    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
    {
        //var out_length, in_length, dcode;

        s.pending_buf[s.d_buf + s.last_lit * 2] = (dist >>> 8) & 0xff;
        s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

        s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
        s.last_lit++;

        if (dist === 0) {
            /* lc is the unmatched char */
            s.dyn_ltree[lc * 2]/*.Freq*/++;
        } else {
            s.matches++;
            /* Here, lc is the match length - MIN_MATCH */
            dist--;             /* dist = match distance - 1 */
            //Assert((ush)dist < (ush)MAX_DIST(s) &&
            //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
            //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

            s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
            s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
        }

        // (!) This block is disabled in zlib defaults,
        // don't enable it for binary compatibility

        //#ifdef TRUNCATE_BLOCK
        //  /* Try to guess if it is profitable to stop the current block here */
        //  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
        //    /* Compute an upper bound for the compressed length */
        //    out_length = s.last_lit*8;
        //    in_length = s.strstart - s.block_start;
        //
        //    for (dcode = 0; dcode < D_CODES; dcode++) {
        //      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
        //    }
        //    out_length >>>= 3;
        //    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
        //    //       s->last_lit, in_length, out_length,
        //    //       100L - out_length*100L/in_length));
        //    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
        //      return true;
        //    }
        //  }
        //#endif

        return (s.last_lit === s.lit_bufsize - 1);
        /* We avoid equality with lit_bufsize because of wraparound at 64K
         * on 16 bit machines and because stored blocks are restricted to
         * 64K-1 bytes.
         */
    }

    var _tr_init_1 = _tr_init;
    var _tr_stored_block_1 = _tr_stored_block;
    var _tr_flush_block_1 = _tr_flush_block;
    var _tr_tally_1 = _tr_tally;
    var _tr_align_1 = _tr_align;

    var trees = {
        _tr_init: _tr_init_1,
        _tr_stored_block: _tr_stored_block_1,
        _tr_flush_block: _tr_flush_block_1,
        _tr_tally: _tr_tally_1,
        _tr_align: _tr_align_1
    };

    // Note: adler32 takes 12% for level 0 and 2% for level 6.
    // It isn't worth it to make additional optimizations as in original.
    // Small size is preferable.

    // (C) 1995-2013 Jean-loup Gailly and Mark Adler
    // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
    //
    // This software is provided 'as-is', without any express or implied
    // warranty. In no event will the authors be held liable for any damages
    // arising from the use of this software.
    //
    // Permission is granted to anyone to use this software for any purpose,
    // including commercial applications, and to alter it and redistribute it
    // freely, subject to the following restrictions:
    //
    // 1. The origin of this software must not be misrepresented; you must not
    //   claim that you wrote the original software. If you use this software
    //   in a product, an acknowledgment in the product documentation would be
    //   appreciated but is not required.
    // 2. Altered source versions must be plainly marked as such, and must not be
    //   misrepresented as being the original software.
    // 3. This notice may not be removed or altered from any source distribution.

    function adler32(adler, buf, len, pos) {
        var s1 = (adler & 0xffff) | 0,
            s2 = ((adler >>> 16) & 0xffff) | 0,
            n = 0;

        while (len !== 0) {
            // Set limit ~ twice less than 5552, to keep
            // s2 in 31-bits, because we force signed ints.
            // in other case %= will fail.
            n = len > 2000 ? 2000 : len;
            len -= n;

            do {
                s1 = (s1 + buf[pos++]) | 0;
                s2 = (s2 + s1) | 0;
            } while (--n);

            s1 %= 65521;
            s2 %= 65521;
        }

        return (s1 | (s2 << 16)) | 0;
    }


    var adler32_1 = adler32;

    // Note: we can't get significant speed boost here.
    // So write code to minimize size - no pregenerated tables
    // and array tools dependencies.

    // (C) 1995-2013 Jean-loup Gailly and Mark Adler
    // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
    //
    // This software is provided 'as-is', without any express or implied
    // warranty. In no event will the authors be held liable for any damages
    // arising from the use of this software.
    //
    // Permission is granted to anyone to use this software for any purpose,
    // including commercial applications, and to alter it and redistribute it
    // freely, subject to the following restrictions:
    //
    // 1. The origin of this software must not be misrepresented; you must not
    //   claim that you wrote the original software. If you use this software
    //   in a product, an acknowledgment in the product documentation would be
    //   appreciated but is not required.
    // 2. Altered source versions must be plainly marked as such, and must not be
    //   misrepresented as being the original software.
    // 3. This notice may not be removed or altered from any source distribution.

    // Use ordinary array, since untyped makes no boost here
    function makeTable() {
        var c, table = [];

        for (var n = 0; n < 256; n++) {
            c = n;
            for (var k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            table[n] = c;
        }

        return table;
    }

    // Create table on load. Just 255 signed longs. Not a problem.
    var crcTable = makeTable();


    function crc32(crc, buf, len, pos) {
        var t = crcTable,
            end = pos + len;

        crc ^= -1;

        for (var i = pos; i < end; i++) {
            crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
        }

        return (crc ^ (-1)); // >>> 0;
    }


    var crc32_1 = crc32;

    // (C) 1995-2013 Jean-loup Gailly and Mark Adler
    // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
    //
    // This software is provided 'as-is', without any express or implied
    // warranty. In no event will the authors be held liable for any damages
    // arising from the use of this software.
    //
    // Permission is granted to anyone to use this software for any purpose,
    // including commercial applications, and to alter it and redistribute it
    // freely, subject to the following restrictions:
    //
    // 1. The origin of this software must not be misrepresented; you must not
    //   claim that you wrote the original software. If you use this software
    //   in a product, an acknowledgment in the product documentation would be
    //   appreciated but is not required.
    // 2. Altered source versions must be plainly marked as such, and must not be
    //   misrepresented as being the original software.
    // 3. This notice may not be removed or altered from any source distribution.

    var messages = {
        2: 'need dictionary',     /* Z_NEED_DICT       2  */
        1: 'stream end',          /* Z_STREAM_END      1  */
        0: '',                    /* Z_OK              0  */
        '-1': 'file error',          /* Z_ERRNO         (-1) */
        '-2': 'stream error',        /* Z_STREAM_ERROR  (-2) */
        '-3': 'data error',          /* Z_DATA_ERROR    (-3) */
        '-4': 'insufficient memory', /* Z_MEM_ERROR     (-4) */
        '-5': 'buffer error',        /* Z_BUF_ERROR     (-5) */
        '-6': 'incompatible version' /* Z_VERSION_ERROR (-6) */
    };

    // (C) 1995-2013 Jean-loup Gailly and Mark Adler
    // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
    //
    // This software is provided 'as-is', without any express or implied
    // warranty. In no event will the authors be held liable for any damages
    // arising from the use of this software.
    //
    // Permission is granted to anyone to use this software for any purpose,
    // including commercial applications, and to alter it and redistribute it
    // freely, subject to the following restrictions:
    //
    // 1. The origin of this software must not be misrepresented; you must not
    //   claim that you wrote the original software. If you use this software
    //   in a product, an acknowledgment in the product documentation would be
    //   appreciated but is not required.
    // 2. Altered source versions must be plainly marked as such, and must not be
    //   misrepresented as being the original software.
    // 3. This notice may not be removed or altered from any source distribution.







    /* Public constants ==========================================================*/
    /* ===========================================================================*/


    /* Allowed flush values; see deflate() and inflate() below for details */
    var Z_NO_FLUSH = 0;
    var Z_PARTIAL_FLUSH = 1;
    //var Z_SYNC_FLUSH    = 2;
    var Z_FULL_FLUSH = 3;
    var Z_FINISH = 4;
    var Z_BLOCK = 5;
    //var Z_TREES         = 6;


    /* Return codes for the compression/decompression functions. Negative values
     * are errors, positive values are used for special but normal events.
     */
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    //var Z_NEED_DICT     = 2;
    //var Z_ERRNO         = -1;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    //var Z_MEM_ERROR     = -4;
    var Z_BUF_ERROR = -5;
    //var Z_VERSION_ERROR = -6;


    /* compression levels */
    //var Z_NO_COMPRESSION      = 0;
    //var Z_BEST_SPEED          = 1;
    //var Z_BEST_COMPRESSION    = 9;
    var Z_DEFAULT_COMPRESSION = -1;


    var Z_FILTERED = 1;
    var Z_HUFFMAN_ONLY = 2;
    var Z_RLE = 3;
    var Z_FIXED$1 = 4;
    var Z_DEFAULT_STRATEGY = 0;

    /* Possible values of the data_type field (though see inflate()) */
    //var Z_BINARY              = 0;
    //var Z_TEXT                = 1;
    //var Z_ASCII               = 1; // = Z_TEXT
    var Z_UNKNOWN$1 = 2;


    /* The deflate compression method */
    var Z_DEFLATED = 8;

    /*============================================================================*/


    var MAX_MEM_LEVEL = 9;
    /* Maximum value for memLevel in deflateInit2 */
    var MAX_WBITS = 15;
    /* 32K LZ77 window */
    var DEF_MEM_LEVEL = 8;


    var LENGTH_CODES$1 = 29;
    /* number of length codes, not counting the special END_BLOCK code */
    var LITERALS$1 = 256;
    /* number of literal bytes 0..255 */
    var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
    /* number of Literal or Length codes, including the END_BLOCK code */
    var D_CODES$1 = 30;
    /* number of distance codes */
    var BL_CODES$1 = 19;
    /* number of codes used to transfer the bit lengths */
    var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
    /* maximum heap size */
    var MAX_BITS$1 = 15;
    /* All codes must not exceed MAX_BITS bits */

    var MIN_MATCH$1 = 3;
    var MAX_MATCH$1 = 258;
    var MIN_LOOKAHEAD = (MAX_MATCH$1 + MIN_MATCH$1 + 1);

    var PRESET_DICT = 0x20;

    var INIT_STATE = 42;
    var EXTRA_STATE = 69;
    var NAME_STATE = 73;
    var COMMENT_STATE = 91;
    var HCRC_STATE = 103;
    var BUSY_STATE = 113;
    var FINISH_STATE = 666;

    var BS_NEED_MORE = 1; /* block not completed, need more input or more output */
    var BS_BLOCK_DONE = 2; /* block flush performed */
    var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
    var BS_FINISH_DONE = 4; /* finish done, accept no more input or output */

    var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

    function err(strm, errorCode) {
        strm.msg = messages[errorCode];
        return errorCode;
    }

    function rank(f) {
        return ((f) << 1) - ((f) > 4 ? 9 : 0);
    }

    function zero$1(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


    /* =========================================================================
     * Flush as much pending output as possible. All deflate() output goes
     * through this function so some applications may wish to modify it
     * to avoid allocating a large strm->output buffer and copying into it.
     * (See also read_buf()).
     */
    function flush_pending(strm) {
        var s = strm.state;

        //_tr_flush_bits(s);
        var len = s.pending;
        if (len > strm.avail_out) {
            len = strm.avail_out;
        }
        if (len === 0) { return; }

        common.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
        strm.next_out += len;
        s.pending_out += len;
        strm.total_out += len;
        strm.avail_out -= len;
        s.pending -= len;
        if (s.pending === 0) {
            s.pending_out = 0;
        }
    }


    function flush_block_only(s, last) {
        trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
        s.block_start = s.strstart;
        flush_pending(s.strm);
    }


    function put_byte(s, b) {
        s.pending_buf[s.pending++] = b;
    }


    /* =========================================================================
     * Put a short in the pending buffer. The 16-bit value is put in MSB order.
     * IN assertion: the stream state is correct and there is enough room in
     * pending_buf.
     */
    function putShortMSB(s, b) {
        //  put_byte(s, (Byte)(b >> 8));
        //  put_byte(s, (Byte)(b & 0xff));
        s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
        s.pending_buf[s.pending++] = b & 0xff;
    }


    /* ===========================================================================
     * Read a new buffer from the current input stream, update the adler32
     * and total number of bytes read.  All deflate() input goes through
     * this function so some applications may wish to modify it to avoid
     * allocating a large strm->input buffer and copying from it.
     * (See also flush_pending()).
     */
    function read_buf(strm, buf, start, size) {
        var len = strm.avail_in;

        if (len > size) { len = size; }
        if (len === 0) { return 0; }

        strm.avail_in -= len;

        // zmemcpy(buf, strm->next_in, len);
        common.arraySet(buf, strm.input, strm.next_in, len, start);
        if (strm.state.wrap === 1) {
            strm.adler = adler32_1(strm.adler, buf, len, start);
        }

        else if (strm.state.wrap === 2) {
            strm.adler = crc32_1(strm.adler, buf, len, start);
        }

        strm.next_in += len;
        strm.total_in += len;

        return len;
    }


    /* ===========================================================================
     * Set match_start to the longest match starting at the given string and
     * return its length. Matches shorter or equal to prev_length are discarded,
     * in which case the result is equal to prev_length and match_start is
     * garbage.
     * IN assertions: cur_match is the head of the hash chain for the current
     *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
     * OUT assertion: the match length is not greater than s->lookahead.
     */
    function longest_match(s, cur_match) {
        var chain_length = s.max_chain_length;      /* max hash chain length */
        var scan = s.strstart; /* current string */
        var match;                       /* matched string */
        var len;                           /* length of current match */
        var best_len = s.prev_length;              /* best match length so far */
        var nice_match = s.nice_match;             /* stop if match long enough */
        var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
            s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;

        var _win = s.window; // shortcut

        var wmask = s.w_mask;
        var prev = s.prev;

        /* Stop when cur_match becomes <= limit. To simplify the code,
         * we prevent matches with the string of window index 0.
         */

        var strend = s.strstart + MAX_MATCH$1;
        var scan_end1 = _win[scan + best_len - 1];
        var scan_end = _win[scan + best_len];

        /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
         * It is easy to get rid of this optimization if necessary.
         */
        // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

        /* Do not waste too much time if we already have a good match: */
        if (s.prev_length >= s.good_match) {
            chain_length >>= 2;
        }
        /* Do not look for matches beyond the end of the input. This is necessary
         * to make deflate deterministic.
         */
        if (nice_match > s.lookahead) { nice_match = s.lookahead; }

        // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

        do {
            // Assert(cur_match < s->strstart, "no future");
            match = cur_match;

            /* Skip to next match if the match length cannot increase
             * or if the match length is less than 2.  Note that the checks below
             * for insufficient lookahead only occur occasionally for performance
             * reasons.  Therefore uninitialized memory will be accessed, and
             * conditional jumps will be made that depend on those values.
             * However the length of the match is limited to the lookahead, so
             * the output of deflate is not affected by the uninitialized values.
             */

            if (_win[match + best_len] !== scan_end ||
                _win[match + best_len - 1] !== scan_end1 ||
                _win[match] !== _win[scan] ||
                _win[++match] !== _win[scan + 1]) {
                continue;
            }

            /* The check at best_len-1 can be removed because it will be made
             * again later. (This heuristic is not always a win.)
             * It is not necessary to compare scan[2] and match[2] since they
             * are always equal when the other bytes match, given that
             * the hash keys are equal and that HASH_BITS >= 8.
             */
            scan += 2;
            match++;
            // Assert(*scan == *match, "match[2]?");

            /* We check for insufficient lookahead only every 8th comparison;
             * the 256th check will be made at strstart+258.
             */
            do {
                /*jshint noempty:false*/
            } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
            _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
            _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
            _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
                scan < strend);

            // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

            len = MAX_MATCH$1 - (strend - scan);
            scan = strend - MAX_MATCH$1;

            if (len > best_len) {
                s.match_start = cur_match;
                best_len = len;
                if (len >= nice_match) {
                    break;
                }
                scan_end1 = _win[scan + best_len - 1];
                scan_end = _win[scan + best_len];
            }
        } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

        if (best_len <= s.lookahead) {
            return best_len;
        }
        return s.lookahead;
    }


    /* ===========================================================================
     * Fill the window when the lookahead becomes insufficient.
     * Updates strstart and lookahead.
     *
     * IN assertion: lookahead < MIN_LOOKAHEAD
     * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
     *    At least one byte has been read, or avail_in == 0; reads are
     *    performed for at least two bytes (required for the zip translate_eol
     *    option -- not supported here).
     */
    function fill_window(s) {
        var _w_size = s.w_size;
        var p, n, m, more, str;

        //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

        do {
            more = s.window_size - s.lookahead - s.strstart;

            // JS ints have 32 bit, block below not needed
            /* Deal with !@#$% 64K limit: */
            //if (sizeof(int) <= 2) {
            //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
            //        more = wsize;
            //
            //  } else if (more == (unsigned)(-1)) {
            //        /* Very unlikely, but possible on 16 bit machine if
            //         * strstart == 0 && lookahead == 1 (input done a byte at time)
            //         */
            //        more--;
            //    }
            //}


            /* If the window is almost full and there is insufficient lookahead,
             * move the upper half to the lower one to make room in the upper half.
             */
            if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

                common.arraySet(s.window, s.window, _w_size, _w_size, 0);
                s.match_start -= _w_size;
                s.strstart -= _w_size;
                /* we now have strstart >= MAX_DIST */
                s.block_start -= _w_size;

                /* Slide the hash table (could be avoided with 32 bit values
                 at the expense of memory usage). We slide even when level == 0
                 to keep the hash table consistent if we switch back to level > 0
                 later. (Using level 0 permanently is not an optimal usage of
                 zlib, so we don't care about this pathological case.)
                 */

                n = s.hash_size;
                p = n;
                do {
                    m = s.head[--p];
                    s.head[p] = (m >= _w_size ? m - _w_size : 0);
                } while (--n);

                n = _w_size;
                p = n;
                do {
                    m = s.prev[--p];
                    s.prev[p] = (m >= _w_size ? m - _w_size : 0);
                    /* If n is not on any hash chain, prev[n] is garbage but
                     * its value will never be used.
                     */
                } while (--n);

                more += _w_size;
            }
            if (s.strm.avail_in === 0) {
                break;
            }

            /* If there was no sliding:
             *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
             *    more == window_size - lookahead - strstart
             * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
             * => more >= window_size - 2*WSIZE + 2
             * In the BIG_MEM or MMAP case (not yet supported),
             *   window_size == input_size + MIN_LOOKAHEAD  &&
             *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
             * Otherwise, window_size == 2*WSIZE so more >= 2.
             * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
             */
            //Assert(more >= 2, "more < 2");
            n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
            s.lookahead += n;

            /* Initialize the hash value now that we have some input: */
            if (s.lookahead + s.insert >= MIN_MATCH$1) {
                str = s.strstart - s.insert;
                s.ins_h = s.window[str];

                /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
                s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
                //#if MIN_MATCH != 3
                //        Call update_hash() MIN_MATCH-3 more times
                //#endif
                while (s.insert) {
                    /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
                    s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH$1 - 1]) & s.hash_mask;

                    s.prev[str & s.w_mask] = s.head[s.ins_h];
                    s.head[s.ins_h] = str;
                    str++;
                    s.insert--;
                    if (s.lookahead + s.insert < MIN_MATCH$1) {
                        break;
                    }
                }
            }
            /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
             * but this is not important since only literal bytes will be emitted.
             */

        } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

        /* If the WIN_INIT bytes after the end of the current data have never been
         * written, then zero those bytes in order to avoid memory check reports of
         * the use of uninitialized (or uninitialised as Julian writes) bytes by
         * the longest match routines.  Update the high water mark for the next
         * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
         * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
         */
        //  if (s.high_water < s.window_size) {
        //    var curr = s.strstart + s.lookahead;
        //    var init = 0;
        //
        //    if (s.high_water < curr) {
        //      /* Previous high water mark below current data -- zero WIN_INIT
        //       * bytes or up to end of window, whichever is less.
        //       */
        //      init = s.window_size - curr;
        //      if (init > WIN_INIT)
        //        init = WIN_INIT;
        //      zmemzero(s->window + curr, (unsigned)init);
        //      s->high_water = curr + init;
        //    }
        //    else if (s->high_water < (ulg)curr + WIN_INIT) {
        //      /* High water mark at or above current data, but below current data
        //       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
        //       * to end of window, whichever is less.
        //       */
        //      init = (ulg)curr + WIN_INIT - s->high_water;
        //      if (init > s->window_size - s->high_water)
        //        init = s->window_size - s->high_water;
        //      zmemzero(s->window + s->high_water, (unsigned)init);
        //      s->high_water += init;
        //    }
        //  }
        //
        //  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
        //    "not enough room for search");
    }

    /* ===========================================================================
     * Copy without compression as much as possible from the input stream, return
     * the current block state.
     * This function does not insert new strings in the dictionary since
     * uncompressible data is probably not useful. This function is used
     * only for the level=0 compression option.
     * NOTE: this function should be optimized to avoid extra copying from
     * window to pending_buf.
     */
    function deflate_stored(s, flush) {
        /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
         * to pending_buf_size, and each stored block has a 5 byte header:
         */
        var max_block_size = 0xffff;

        if (max_block_size > s.pending_buf_size - 5) {
            max_block_size = s.pending_buf_size - 5;
        }

        /* Copy as much as possible from input to output: */
        for (; ;) {
            /* Fill the window as much as possible: */
            if (s.lookahead <= 1) {

                //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
                //  s->block_start >= (long)s->w_size, "slide too late");
                //      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
                //        s.block_start >= s.w_size)) {
                //        throw  new Error("slide too late");
                //      }

                fill_window(s);
                if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
                    return BS_NEED_MORE;
                }

                if (s.lookahead === 0) {
                    break;
                }
                /* flush the current block */
            }
            //Assert(s->block_start >= 0L, "block gone");
            //    if (s.block_start < 0) throw new Error("block gone");

            s.strstart += s.lookahead;
            s.lookahead = 0;

            /* Emit a stored block if pending_buf will be full: */
            var max_start = s.block_start + max_block_size;

            if (s.strstart === 0 || s.strstart >= max_start) {
                /* strstart == 0 is possible when wraparound on 16-bit machine */
                s.lookahead = s.strstart - max_start;
                s.strstart = max_start;
                /*** FLUSH_BLOCK(s, 0); ***/
                flush_block_only(s, false);
                if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                }
                /***/


            }
            /* Flush if we may have to slide, otherwise block_start may become
             * negative and the data will be gone:
             */
            if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
                /*** FLUSH_BLOCK(s, 0); ***/
                flush_block_only(s, false);
                if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                }
                /***/
            }
        }

        s.insert = 0;

        if (flush === Z_FINISH) {
            /*** FLUSH_BLOCK(s, 1); ***/
            flush_block_only(s, true);
            if (s.strm.avail_out === 0) {
                return BS_FINISH_STARTED;
            }
            /***/
            return BS_FINISH_DONE;
        }

        if (s.strstart > s.block_start) {
            /*** FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
                return BS_NEED_MORE;
            }
            /***/
        }

        return BS_NEED_MORE;
    }

    /* ===========================================================================
     * Compress as much as possible from the input stream, return the current
     * block state.
     * This function does not perform lazy evaluation of matches and inserts
     * new strings in the dictionary only for unmatched strings or for short
     * matches. It is used only for the fast compression options.
     */
    function deflate_fast(s, flush) {
        var hash_head;        /* head of the hash chain */
        var bflush;           /* set if current block must be flushed */

        for (; ;) {
            /* Make sure that we always have enough lookahead, except
             * at the end of the input file. We need MAX_MATCH bytes
             * for the next match, plus MIN_MATCH bytes to insert the
             * string following the next match.
             */
            if (s.lookahead < MIN_LOOKAHEAD) {
                fill_window(s);
                if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
                    return BS_NEED_MORE;
                }
                if (s.lookahead === 0) {
                    break; /* flush the current block */
                }
            }

            /* Insert the string window[strstart .. strstart+2] in the
             * dictionary, and set hash_head to the head of the hash chain:
             */
            hash_head = 0/*NIL*/;
            if (s.lookahead >= MIN_MATCH$1) {
                /*** INSERT_STRING(s, s.strstart, hash_head); ***/
                s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH$1 - 1]) & s.hash_mask;
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
                /***/
            }

            /* Find the longest match, discarding those <= prev_length.
             * At this point we have always match_length < MIN_MATCH
             */
            if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
                /* To simplify the code, we prevent matches with the string
                 * of window index 0 (in particular we have to avoid a match
                 * of the string with itself at the start of the input file).
                 */
                s.match_length = longest_match(s, hash_head);
                /* longest_match() sets match_start */
            }
            if (s.match_length >= MIN_MATCH$1) {
                // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

                /*** _tr_tally_dist(s, s.strstart - s.match_start,
                               s.match_length - MIN_MATCH, bflush); ***/
                bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH$1);

                s.lookahead -= s.match_length;

                /* Insert new strings in the hash table only if the match length
                 * is not too large. This saves time but degrades compression.
                 */
                if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH$1) {
                    s.match_length--; /* string at strstart already in table */
                    do {
                        s.strstart++;
                        /*** INSERT_STRING(s, s.strstart, hash_head); ***/
                        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH$1 - 1]) & s.hash_mask;
                        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                        s.head[s.ins_h] = s.strstart;
                        /***/
                        /* strstart never exceeds WSIZE-MAX_MATCH, so there are
                         * always MIN_MATCH bytes ahead.
                         */
                    } while (--s.match_length !== 0);
                    s.strstart++;
                } else {
                    s.strstart += s.match_length;
                    s.match_length = 0;
                    s.ins_h = s.window[s.strstart];
                    /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
                    s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

                    //#if MIN_MATCH != 3
                    //                Call UPDATE_HASH() MIN_MATCH-3 more times
                    //#endif
                    /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
                     * matter since it will be recomputed at next deflate call.
                     */
                }
            } else {
                /* No match, output a literal byte */
                //Tracevv((stderr,"%c", s.window[s.strstart]));
                /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
                bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

                s.lookahead--;
                s.strstart++;
            }
            if (bflush) {
                /*** FLUSH_BLOCK(s, 0); ***/
                flush_block_only(s, false);
                if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                }
                /***/
            }
        }
        s.insert = ((s.strstart < (MIN_MATCH$1 - 1)) ? s.strstart : MIN_MATCH$1 - 1);
        if (flush === Z_FINISH) {
            /*** FLUSH_BLOCK(s, 1); ***/
            flush_block_only(s, true);
            if (s.strm.avail_out === 0) {
                return BS_FINISH_STARTED;
            }
            /***/
            return BS_FINISH_DONE;
        }
        if (s.last_lit) {
            /*** FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
                return BS_NEED_MORE;
            }
            /***/
        }
        return BS_BLOCK_DONE;
    }

    /* ===========================================================================
     * Same as above, but achieves better compression. We use a lazy
     * evaluation for matches: a match is finally adopted only if there is
     * no better match at the next window position.
     */
    function deflate_slow(s, flush) {
        var hash_head;          /* head of hash chain */
        var bflush;              /* set if current block must be flushed */

        var max_insert;

        /* Process the input block. */
        for (; ;) {
            /* Make sure that we always have enough lookahead, except
             * at the end of the input file. We need MAX_MATCH bytes
             * for the next match, plus MIN_MATCH bytes to insert the
             * string following the next match.
             */
            if (s.lookahead < MIN_LOOKAHEAD) {
                fill_window(s);
                if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
                    return BS_NEED_MORE;
                }
                if (s.lookahead === 0) { break; } /* flush the current block */
            }

            /* Insert the string window[strstart .. strstart+2] in the
             * dictionary, and set hash_head to the head of the hash chain:
             */
            hash_head = 0/*NIL*/;
            if (s.lookahead >= MIN_MATCH$1) {
                /*** INSERT_STRING(s, s.strstart, hash_head); ***/
                s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH$1 - 1]) & s.hash_mask;
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
                /***/
            }

            /* Find the longest match, discarding those <= prev_length.
             */
            s.prev_length = s.match_length;
            s.prev_match = s.match_start;
            s.match_length = MIN_MATCH$1 - 1;

            if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
                s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
                /* To simplify the code, we prevent matches with the string
                 * of window index 0 (in particular we have to avoid a match
                 * of the string with itself at the start of the input file).
                 */
                s.match_length = longest_match(s, hash_head);
                /* longest_match() sets match_start */

                if (s.match_length <= 5 &&
                    (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH$1 && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

                    /* If prev_match is also MIN_MATCH, match_start is garbage
                     * but we will ignore the current match anyway.
                     */
                    s.match_length = MIN_MATCH$1 - 1;
                }
            }
            /* If there was a match at the previous step and the current
             * match is not better, output the previous match:
             */
            if (s.prev_length >= MIN_MATCH$1 && s.match_length <= s.prev_length) {
                max_insert = s.strstart + s.lookahead - MIN_MATCH$1;
                /* Do not insert strings in hash table beyond this. */

                //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

                /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                               s.prev_length - MIN_MATCH, bflush);***/
                bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH$1);
                /* Insert in hash table all strings up to the end of the match.
                 * strstart-1 and strstart are already inserted. If there is not
                 * enough lookahead, the last two strings are not inserted in
                 * the hash table.
                 */
                s.lookahead -= s.prev_length - 1;
                s.prev_length -= 2;
                do {
                    if (++s.strstart <= max_insert) {
                        /*** INSERT_STRING(s, s.strstart, hash_head); ***/
                        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH$1 - 1]) & s.hash_mask;
                        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                        s.head[s.ins_h] = s.strstart;
                        /***/
                    }
                } while (--s.prev_length !== 0);
                s.match_available = 0;
                s.match_length = MIN_MATCH$1 - 1;
                s.strstart++;

                if (bflush) {
                    /*** FLUSH_BLOCK(s, 0); ***/
                    flush_block_only(s, false);
                    if (s.strm.avail_out === 0) {
                        return BS_NEED_MORE;
                    }
                    /***/
                }

            } else if (s.match_available) {
                /* If there was no match at the previous position, output a
                 * single literal. If there was a match but the current match
                 * is longer, truncate the previous match to a single literal.
                 */
                //Tracevv((stderr,"%c", s->window[s->strstart-1]));
                /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
                bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

                if (bflush) {
                    /*** FLUSH_BLOCK_ONLY(s, 0) ***/
                    flush_block_only(s, false);
                    /***/
                }
                s.strstart++;
                s.lookahead--;
                if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                }
            } else {
                /* There is no previous match to compare with, wait for
                 * the next step to decide.
                 */
                s.match_available = 1;
                s.strstart++;
                s.lookahead--;
            }
        }
        //Assert (flush != Z_NO_FLUSH, "no flush?");
        if (s.match_available) {
            //Tracevv((stderr,"%c", s->window[s->strstart-1]));
            /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
            bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

            s.match_available = 0;
        }
        s.insert = s.strstart < MIN_MATCH$1 - 1 ? s.strstart : MIN_MATCH$1 - 1;
        if (flush === Z_FINISH) {
            /*** FLUSH_BLOCK(s, 1); ***/
            flush_block_only(s, true);
            if (s.strm.avail_out === 0) {
                return BS_FINISH_STARTED;
            }
            /***/
            return BS_FINISH_DONE;
        }
        if (s.last_lit) {
            /*** FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
                return BS_NEED_MORE;
            }
            /***/
        }

        return BS_BLOCK_DONE;
    }


    /* ===========================================================================
     * For Z_RLE, simply look for runs of bytes, generate matches only of distance
     * one.  Do not maintain a hash table.  (It will be regenerated if this run of
     * deflate switches away from Z_RLE.)
     */
    function deflate_rle(s, flush) {
        var bflush;            /* set if current block must be flushed */
        var prev;              /* byte at distance one to match */
        var scan, strend;      /* scan goes up to strend for length of run */

        var _win = s.window;

        for (; ;) {
            /* Make sure that we always have enough lookahead, except
             * at the end of the input file. We need MAX_MATCH bytes
             * for the longest run, plus one for the unrolled loop.
             */
            if (s.lookahead <= MAX_MATCH$1) {
                fill_window(s);
                if (s.lookahead <= MAX_MATCH$1 && flush === Z_NO_FLUSH) {
                    return BS_NEED_MORE;
                }
                if (s.lookahead === 0) { break; } /* flush the current block */
            }

            /* See how many times the previous byte repeats */
            s.match_length = 0;
            if (s.lookahead >= MIN_MATCH$1 && s.strstart > 0) {
                scan = s.strstart - 1;
                prev = _win[scan];
                if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
                    strend = s.strstart + MAX_MATCH$1;
                    do {
                        /*jshint noempty:false*/
                    } while (prev === _win[++scan] && prev === _win[++scan] &&
                    prev === _win[++scan] && prev === _win[++scan] &&
                    prev === _win[++scan] && prev === _win[++scan] &&
                    prev === _win[++scan] && prev === _win[++scan] &&
                        scan < strend);
                    s.match_length = MAX_MATCH$1 - (strend - scan);
                    if (s.match_length > s.lookahead) {
                        s.match_length = s.lookahead;
                    }
                }
                //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
            }

            /* Emit match if have run of MIN_MATCH or longer, else emit literal */
            if (s.match_length >= MIN_MATCH$1) {
                //check_match(s, s.strstart, s.strstart - 1, s.match_length);

                /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
                bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH$1);

                s.lookahead -= s.match_length;
                s.strstart += s.match_length;
                s.match_length = 0;
            } else {
                /* No match, output a literal byte */
                //Tracevv((stderr,"%c", s->window[s->strstart]));
                /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
                bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

                s.lookahead--;
                s.strstart++;
            }
            if (bflush) {
                /*** FLUSH_BLOCK(s, 0); ***/
                flush_block_only(s, false);
                if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                }
                /***/
            }
        }
        s.insert = 0;
        if (flush === Z_FINISH) {
            /*** FLUSH_BLOCK(s, 1); ***/
            flush_block_only(s, true);
            if (s.strm.avail_out === 0) {
                return BS_FINISH_STARTED;
            }
            /***/
            return BS_FINISH_DONE;
        }
        if (s.last_lit) {
            /*** FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
                return BS_NEED_MORE;
            }
            /***/
        }
        return BS_BLOCK_DONE;
    }

    /* ===========================================================================
     * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
     * (It will be regenerated if this run of deflate switches away from Huffman.)
     */
    function deflate_huff(s, flush) {
        var bflush;             /* set if current block must be flushed */

        for (; ;) {
            /* Make sure that we have a literal to write. */
            if (s.lookahead === 0) {
                fill_window(s);
                if (s.lookahead === 0) {
                    if (flush === Z_NO_FLUSH) {
                        return BS_NEED_MORE;
                    }
                    break;      /* flush the current block */
                }
            }

            /* Output a literal byte */
            s.match_length = 0;
            //Tracevv((stderr,"%c", s->window[s->strstart]));
            /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
            bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
            s.lookahead--;
            s.strstart++;
            if (bflush) {
                /*** FLUSH_BLOCK(s, 0); ***/
                flush_block_only(s, false);
                if (s.strm.avail_out === 0) {
                    return BS_NEED_MORE;
                }
                /***/
            }
        }
        s.insert = 0;
        if (flush === Z_FINISH) {
            /*** FLUSH_BLOCK(s, 1); ***/
            flush_block_only(s, true);
            if (s.strm.avail_out === 0) {
                return BS_FINISH_STARTED;
            }
            /***/
            return BS_FINISH_DONE;
        }
        if (s.last_lit) {
            /*** FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
                return BS_NEED_MORE;
            }
            /***/
        }
        return BS_BLOCK_DONE;
    }

    /* Values for max_lazy_match, good_match and max_chain_length, depending on
     * the desired pack level (0..9). The values given below have been tuned to
     * exclude worst case performance for pathological files. Better values may be
     * found for specific files.
     */
    function Config(good_length, max_lazy, nice_length, max_chain, func) {
        this.good_length = good_length;
        this.max_lazy = max_lazy;
        this.nice_length = nice_length;
        this.max_chain = max_chain;
        this.func = func;
    }

    var configuration_table;

    configuration_table = [
        /*      good lazy nice chain */
        new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
        new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
        new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
        new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

        new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
        new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
        new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
        new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
        new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
        new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
    ];


    /* ===========================================================================
     * Initialize the "longest match" routines for a new zlib stream
     */
    function lm_init(s) {
        s.window_size = 2 * s.w_size;

        /*** CLEAR_HASH(s); ***/
        zero$1(s.head); // Fill with NIL (= 0);

        /* Set the default configuration parameters:
         */
        s.max_lazy_match = configuration_table[s.level].max_lazy;
        s.good_match = configuration_table[s.level].good_length;
        s.nice_match = configuration_table[s.level].nice_length;
        s.max_chain_length = configuration_table[s.level].max_chain;

        s.strstart = 0;
        s.block_start = 0;
        s.lookahead = 0;
        s.insert = 0;
        s.match_length = s.prev_length = MIN_MATCH$1 - 1;
        s.match_available = 0;
        s.ins_h = 0;
    }


    function DeflateState() {
        this.strm = null;            /* pointer back to this zlib stream */
        this.status = 0;            /* as the name implies */
        this.pending_buf = null;      /* output still pending */
        this.pending_buf_size = 0;  /* size of pending_buf */
        this.pending_out = 0;       /* next pending byte to output to the stream */
        this.pending = 0;           /* nb of bytes in the pending buffer */
        this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
        this.gzhead = null;         /* gzip header information to write */
        this.gzindex = 0;           /* where in extra, name, or comment */
        this.method = Z_DEFLATED; /* can only be DEFLATED */
        this.last_flush = -1;   /* value of flush param for previous deflate call */

        this.w_size = 0;  /* LZ77 window size (32K by default) */
        this.w_bits = 0;  /* log2(w_size)  (8..16) */
        this.w_mask = 0;  /* w_size - 1 */

        this.window = null;
        /* Sliding window. Input bytes are read into the second half of the window,
         * and move to the first half later to keep a dictionary of at least wSize
         * bytes. With this organization, matches are limited to a distance of
         * wSize-MAX_MATCH bytes, but this ensures that IO is always
         * performed with a length multiple of the block size.
         */

        this.window_size = 0;
        /* Actual size of window: 2*wSize, except when the user input buffer
         * is directly used as sliding window.
         */

        this.prev = null;
        /* Link to older string with same hash index. To limit the size of this
         * array to 64K, this link is maintained only for the last 32K strings.
         * An index in this array is thus a window index modulo 32K.
         */

        this.head = null;   /* Heads of the hash chains or NIL. */

        this.ins_h = 0;       /* hash index of string to be inserted */
        this.hash_size = 0;   /* number of elements in hash table */
        this.hash_bits = 0;   /* log2(hash_size) */
        this.hash_mask = 0;   /* hash_size-1 */

        this.hash_shift = 0;
        /* Number of bits by which ins_h must be shifted at each input
         * step. It must be such that after MIN_MATCH steps, the oldest
         * byte no longer takes part in the hash key, that is:
         *   hash_shift * MIN_MATCH >= hash_bits
         */

        this.block_start = 0;
        /* Window position at the beginning of the current output block. Gets
         * negative when the window is moved backwards.
         */

        this.match_length = 0;      /* length of best match */
        this.prev_match = 0;        /* previous match */
        this.match_available = 0;   /* set if previous match exists */
        this.strstart = 0;          /* start of string to insert */
        this.match_start = 0;       /* start of matching string */
        this.lookahead = 0;         /* number of valid bytes ahead in window */

        this.prev_length = 0;
        /* Length of the best match at previous step. Matches not greater than this
         * are discarded. This is used in the lazy match evaluation.
         */

        this.max_chain_length = 0;
        /* To speed up deflation, hash chains are never searched beyond this
         * length.  A higher limit improves compression ratio but degrades the
         * speed.
         */

        this.max_lazy_match = 0;
        /* Attempt to find a better match only when the current match is strictly
         * smaller than this value. This mechanism is used only for compression
         * levels >= 4.
         */
        // That's alias to max_lazy_match, don't use directly
        //this.max_insert_length = 0;
        /* Insert new strings in the hash table only if the match length is not
         * greater than this length. This saves time but degrades compression.
         * max_insert_length is used only for compression levels <= 3.
         */

        this.level = 0;     /* compression level (1..9) */
        this.strategy = 0;  /* favor or force Huffman coding*/

        this.good_match = 0;
        /* Use a faster search when the previous match is longer than this */

        this.nice_match = 0; /* Stop searching when current match exceeds this */

        /* used by trees.c: */

        /* Didn't use ct_data typedef below to suppress compiler warning */

        // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
        // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
        // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

        // Use flat array of DOUBLE size, with interleaved fata,
        // because JS does not support effective
        this.dyn_ltree = new common.Buf16(HEAP_SIZE$1 * 2);
        this.dyn_dtree = new common.Buf16((2 * D_CODES$1 + 1) * 2);
        this.bl_tree = new common.Buf16((2 * BL_CODES$1 + 1) * 2);
        zero$1(this.dyn_ltree);
        zero$1(this.dyn_dtree);
        zero$1(this.bl_tree);

        this.l_desc = null;         /* desc. for literal tree */
        this.d_desc = null;         /* desc. for distance tree */
        this.bl_desc = null;         /* desc. for bit length tree */

        //ush bl_count[MAX_BITS+1];
        this.bl_count = new common.Buf16(MAX_BITS$1 + 1);
        /* number of codes at each bit length for an optimal tree */

        //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
        this.heap = new common.Buf16(2 * L_CODES$1 + 1);  /* heap used to build the Huffman trees */
        zero$1(this.heap);

        this.heap_len = 0;               /* number of elements in the heap */
        this.heap_max = 0;               /* element of largest frequency */
        /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
         * The same heap array is used to build all trees.
         */

        this.depth = new common.Buf16(2 * L_CODES$1 + 1); //uch depth[2*L_CODES+1];
        zero$1(this.depth);
        /* Depth of each subtree used as tie breaker for trees of equal frequency
         */

        this.l_buf = 0;          /* buffer index for literals or lengths */

        this.lit_bufsize = 0;
        /* Size of match buffer for literals/lengths.  There are 4 reasons for
         * limiting lit_bufsize to 64K:
         *   - frequencies can be kept in 16 bit counters
         *   - if compression is not successful for the first block, all input
         *     data is still in the window so we can still emit a stored block even
         *     when input comes from standard input.  (This can also be done for
         *     all blocks if lit_bufsize is not greater than 32K.)
         *   - if compression is not successful for a file smaller than 64K, we can
         *     even emit a stored file instead of a stored block (saving 5 bytes).
         *     This is applicable only for zip (not gzip or zlib).
         *   - creating new Huffman trees less frequently may not provide fast
         *     adaptation to changes in the input data statistics. (Take for
         *     example a binary file with poorly compressible code followed by
         *     a highly compressible string table.) Smaller buffer sizes give
         *     fast adaptation but have of course the overhead of transmitting
         *     trees more frequently.
         *   - I can't count above 4
         */

        this.last_lit = 0;      /* running index in l_buf */

        this.d_buf = 0;
        /* Buffer index for distances. To simplify the code, d_buf and l_buf have
         * the same number of elements. To use different lengths, an extra flag
         * array would be necessary.
         */

        this.opt_len = 0;       /* bit length of current block with optimal trees */
        this.static_len = 0;    /* bit length of current block with static trees */
        this.matches = 0;       /* number of string matches in current block */
        this.insert = 0;        /* bytes at end of window left to insert */


        this.bi_buf = 0;
        /* Output buffer. bits are inserted starting at the bottom (least
         * significant bits).
         */
        this.bi_valid = 0;
        /* Number of valid bits in bi_buf.  All bits above the last valid bit
         * are always zero.
         */

        // Used for window memory init. We safely ignore it for JS. That makes
        // sense only for pointers and memory check tools.
        //this.high_water = 0;
        /* High water mark offset in window for initialized bytes -- bytes above
         * this are set to zero in order to avoid memory check warnings when
         * longest match routines access bytes past the input.  This is then
         * updated to the new high water mark.
         */
    }


    function deflateResetKeep(strm) {
        var s;

        if (!strm || !strm.state) {
            return err(strm, Z_STREAM_ERROR);
        }

        strm.total_in = strm.total_out = 0;
        strm.data_type = Z_UNKNOWN$1;

        s = strm.state;
        s.pending = 0;
        s.pending_out = 0;

        if (s.wrap < 0) {
            s.wrap = -s.wrap;
            /* was made negative by deflate(..., Z_FINISH); */
        }
        s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
        strm.adler = (s.wrap === 2) ?
            0  // crc32(0, Z_NULL, 0)
            :
            1; // adler32(0, Z_NULL, 0)
        s.last_flush = Z_NO_FLUSH;
        trees._tr_init(s);
        return Z_OK;
    }


    function deflateReset(strm) {
        var ret = deflateResetKeep(strm);
        if (ret === Z_OK) {
            lm_init(strm.state);
        }
        return ret;
    }


    function deflateSetHeader(strm, head) {
        if (!strm || !strm.state) { return Z_STREAM_ERROR; }
        if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
        strm.state.gzhead = head;
        return Z_OK;
    }


    function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
        if (!strm) { // === Z_NULL
            return Z_STREAM_ERROR;
        }
        var wrap = 1;

        if (level === Z_DEFAULT_COMPRESSION) {
            level = 6;
        }

        if (windowBits < 0) { /* suppress zlib wrapper */
            wrap = 0;
            windowBits = -windowBits;
        }

        else if (windowBits > 15) {
            wrap = 2;           /* write gzip wrapper instead */
            windowBits -= 16;
        }


        if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
            windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
            strategy < 0 || strategy > Z_FIXED$1) {
            return err(strm, Z_STREAM_ERROR);
        }


        if (windowBits === 8) {
            windowBits = 9;
        }
        /* until 256-byte window bug fixed */

        var s = new DeflateState();

        strm.state = s;
        s.strm = strm;

        s.wrap = wrap;
        s.gzhead = null;
        s.w_bits = windowBits;
        s.w_size = 1 << s.w_bits;
        s.w_mask = s.w_size - 1;

        s.hash_bits = memLevel + 7;
        s.hash_size = 1 << s.hash_bits;
        s.hash_mask = s.hash_size - 1;
        s.hash_shift = ~~((s.hash_bits + MIN_MATCH$1 - 1) / MIN_MATCH$1);

        s.window = new common.Buf8(s.w_size * 2);
        s.head = new common.Buf16(s.hash_size);
        s.prev = new common.Buf16(s.w_size);

        // Don't need mem init magic for JS.
        //s.high_water = 0;  /* nothing written to s->window yet */

        s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

        s.pending_buf_size = s.lit_bufsize * 4;

        //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
        //s->pending_buf = (uchf *) overlay;
        s.pending_buf = new common.Buf8(s.pending_buf_size);

        // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
        //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
        s.d_buf = 1 * s.lit_bufsize;

        //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
        s.l_buf = (1 + 2) * s.lit_bufsize;

        s.level = level;
        s.strategy = strategy;
        s.method = method;

        return deflateReset(strm);
    }

    function deflateInit(strm, level) {
        return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
    }


    function deflate(strm, flush) {
        var old_flush, s;
        var beg, val; // for gzip header write only

        if (!strm || !strm.state ||
            flush > Z_BLOCK || flush < 0) {
            return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
        }

        s = strm.state;

        if (!strm.output ||
            (!strm.input && strm.avail_in !== 0) ||
            (s.status === FINISH_STATE && flush !== Z_FINISH)) {
            return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
        }

        s.strm = strm; /* just in case */
        old_flush = s.last_flush;
        s.last_flush = flush;

        /* Write the header */
        if (s.status === INIT_STATE) {

            if (s.wrap === 2) { // GZIP header
                strm.adler = 0;  //crc32(0L, Z_NULL, 0);
                put_byte(s, 31);
                put_byte(s, 139);
                put_byte(s, 8);
                if (!s.gzhead) { // s->gzhead == Z_NULL
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(s, s.level === 9 ? 2 :
                        (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                            4 : 0));
                    put_byte(s, OS_CODE);
                    s.status = BUSY_STATE;
                }
                else {
                    put_byte(s, (s.gzhead.text ? 1 : 0) +
                        (s.gzhead.hcrc ? 2 : 0) +
                        (!s.gzhead.extra ? 0 : 4) +
                        (!s.gzhead.name ? 0 : 8) +
                        (!s.gzhead.comment ? 0 : 16)
                    );
                    put_byte(s, s.gzhead.time & 0xff);
                    put_byte(s, (s.gzhead.time >> 8) & 0xff);
                    put_byte(s, (s.gzhead.time >> 16) & 0xff);
                    put_byte(s, (s.gzhead.time >> 24) & 0xff);
                    put_byte(s, s.level === 9 ? 2 :
                        (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                            4 : 0));
                    put_byte(s, s.gzhead.os & 0xff);
                    if (s.gzhead.extra && s.gzhead.extra.length) {
                        put_byte(s, s.gzhead.extra.length & 0xff);
                        put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
                    }
                    if (s.gzhead.hcrc) {
                        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
                    }
                    s.gzindex = 0;
                    s.status = EXTRA_STATE;
                }
            }
            else // DEFLATE header
            {
                var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
                var level_flags = -1;

                if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
                    level_flags = 0;
                } else if (s.level < 6) {
                    level_flags = 1;
                } else if (s.level === 6) {
                    level_flags = 2;
                } else {
                    level_flags = 3;
                }
                header |= (level_flags << 6);
                if (s.strstart !== 0) { header |= PRESET_DICT; }
                header += 31 - (header % 31);

                s.status = BUSY_STATE;
                putShortMSB(s, header);

                /* Save the adler32 of the preset dictionary: */
                if (s.strstart !== 0) {
                    putShortMSB(s, strm.adler >>> 16);
                    putShortMSB(s, strm.adler & 0xffff);
                }
                strm.adler = 1; // adler32(0L, Z_NULL, 0);
            }
        }

        //#ifdef GZIP
        if (s.status === EXTRA_STATE) {
            if (s.gzhead.extra/* != Z_NULL*/) {
                beg = s.pending;  /* start of bytes to update crc */

                while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
                    if (s.pending === s.pending_buf_size) {
                        if (s.gzhead.hcrc && s.pending > beg) {
                            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                        }
                        flush_pending(strm);
                        beg = s.pending;
                        if (s.pending === s.pending_buf_size) {
                            break;
                        }
                    }
                    put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
                    s.gzindex++;
                }
                if (s.gzhead.hcrc && s.pending > beg) {
                    strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                }
                if (s.gzindex === s.gzhead.extra.length) {
                    s.gzindex = 0;
                    s.status = NAME_STATE;
                }
            }
            else {
                s.status = NAME_STATE;
            }
        }
        if (s.status === NAME_STATE) {
            if (s.gzhead.name/* != Z_NULL*/) {
                beg = s.pending;  /* start of bytes to update crc */
                //int val;

                do {
                    if (s.pending === s.pending_buf_size) {
                        if (s.gzhead.hcrc && s.pending > beg) {
                            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                        }
                        flush_pending(strm);
                        beg = s.pending;
                        if (s.pending === s.pending_buf_size) {
                            val = 1;
                            break;
                        }
                    }
                    // JS specific: little magic to add zero terminator to end of string
                    if (s.gzindex < s.gzhead.name.length) {
                        val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
                    } else {
                        val = 0;
                    }
                    put_byte(s, val);
                } while (val !== 0);

                if (s.gzhead.hcrc && s.pending > beg) {
                    strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                }
                if (val === 0) {
                    s.gzindex = 0;
                    s.status = COMMENT_STATE;
                }
            }
            else {
                s.status = COMMENT_STATE;
            }
        }
        if (s.status === COMMENT_STATE) {
            if (s.gzhead.comment/* != Z_NULL*/) {
                beg = s.pending;  /* start of bytes to update crc */
                //int val;

                do {
                    if (s.pending === s.pending_buf_size) {
                        if (s.gzhead.hcrc && s.pending > beg) {
                            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                        }
                        flush_pending(strm);
                        beg = s.pending;
                        if (s.pending === s.pending_buf_size) {
                            val = 1;
                            break;
                        }
                    }
                    // JS specific: little magic to add zero terminator to end of string
                    if (s.gzindex < s.gzhead.comment.length) {
                        val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
                    } else {
                        val = 0;
                    }
                    put_byte(s, val);
                } while (val !== 0);

                if (s.gzhead.hcrc && s.pending > beg) {
                    strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                }
                if (val === 0) {
                    s.status = HCRC_STATE;
                }
            }
            else {
                s.status = HCRC_STATE;
            }
        }
        if (s.status === HCRC_STATE) {
            if (s.gzhead.hcrc) {
                if (s.pending + 2 > s.pending_buf_size) {
                    flush_pending(strm);
                }
                if (s.pending + 2 <= s.pending_buf_size) {
                    put_byte(s, strm.adler & 0xff);
                    put_byte(s, (strm.adler >> 8) & 0xff);
                    strm.adler = 0; //crc32(0L, Z_NULL, 0);
                    s.status = BUSY_STATE;
                }
            }
            else {
                s.status = BUSY_STATE;
            }
        }
        //#endif

        /* Flush as much pending output as possible */
        if (s.pending !== 0) {
            flush_pending(strm);
            if (strm.avail_out === 0) {
                /* Since avail_out is 0, deflate will be called again with
                 * more output space, but possibly with both pending and
                 * avail_in equal to zero. There won't be anything to do,
                 * but this is not an error situation so make sure we
                 * return OK instead of BUF_ERROR at next call of deflate:
                 */
                s.last_flush = -1;
                return Z_OK;
            }

            /* Make sure there is something to do and avoid duplicate consecutive
             * flushes. For repeated and useless calls with Z_FINISH, we keep
             * returning Z_STREAM_END instead of Z_BUF_ERROR.
             */
        } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
            flush !== Z_FINISH) {
            return err(strm, Z_BUF_ERROR);
        }

        /* User must not provide more input after the first FINISH: */
        if (s.status === FINISH_STATE && strm.avail_in !== 0) {
            return err(strm, Z_BUF_ERROR);
        }

        /* Start a new block or continue the current one.
         */
        if (strm.avail_in !== 0 || s.lookahead !== 0 ||
            (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
            var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
                (s.strategy === Z_RLE ? deflate_rle(s, flush) :
                    configuration_table[s.level].func(s, flush));

            if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
                s.status = FINISH_STATE;
            }
            if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
                if (strm.avail_out === 0) {
                    s.last_flush = -1;
                    /* avoid BUF_ERROR next call, see above */
                }
                return Z_OK;
                /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
                 * of deflate should use the same flush parameter to make sure
                 * that the flush is complete. So we don't have to output an
                 * empty block here, this will be done at next call. This also
                 * ensures that for a very small output buffer, we emit at most
                 * one empty block.
                 */
            }
            if (bstate === BS_BLOCK_DONE) {
                if (flush === Z_PARTIAL_FLUSH) {
                    trees._tr_align(s);
                }
                else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

                    trees._tr_stored_block(s, 0, 0, false);
                    /* For a full flush, this empty block will be recognized
                     * as a special marker by inflate_sync().
                     */
                    if (flush === Z_FULL_FLUSH) {
                        /*** CLEAR_HASH(s); ***/             /* forget history */
                        zero$1(s.head); // Fill with NIL (= 0);

                        if (s.lookahead === 0) {
                            s.strstart = 0;
                            s.block_start = 0;
                            s.insert = 0;
                        }
                    }
                }
                flush_pending(strm);
                if (strm.avail_out === 0) {
                    s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
                    return Z_OK;
                }
            }
        }
        //Assert(strm->avail_out > 0, "bug2");
        //if (strm.avail_out <= 0) { throw new Error("bug2");}

        if (flush !== Z_FINISH) { return Z_OK; }
        if (s.wrap <= 0) { return Z_STREAM_END; }

        /* Write the trailer */
        if (s.wrap === 2) {
            put_byte(s, strm.adler & 0xff);
            put_byte(s, (strm.adler >> 8) & 0xff);
            put_byte(s, (strm.adler >> 16) & 0xff);
            put_byte(s, (strm.adler >> 24) & 0xff);
            put_byte(s, strm.total_in & 0xff);
            put_byte(s, (strm.total_in >> 8) & 0xff);
            put_byte(s, (strm.total_in >> 16) & 0xff);
            put_byte(s, (strm.total_in >> 24) & 0xff);
        }
        else {
            putShortMSB(s, strm.adler >>> 16);
            putShortMSB(s, strm.adler & 0xffff);
        }

        flush_pending(strm);
        /* If avail_out is zero, the application will call deflate again
         * to flush the rest.
         */
        if (s.wrap > 0) { s.wrap = -s.wrap; }
        /* write the trailer only once! */
        return s.pending !== 0 ? Z_OK : Z_STREAM_END;
    }

    function deflateEnd(strm) {
        var status;

        if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
            return Z_STREAM_ERROR;
        }

        status = strm.state.status;
        if (status !== INIT_STATE &&
            status !== EXTRA_STATE &&
            status !== NAME_STATE &&
            status !== COMMENT_STATE &&
            status !== HCRC_STATE &&
            status !== BUSY_STATE &&
            status !== FINISH_STATE
        ) {
            return err(strm, Z_STREAM_ERROR);
        }

        strm.state = null;

        return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
    }


    /* =========================================================================
     * Initializes the compression dictionary from the given byte
     * sequence without producing any compressed output.
     */
    function deflateSetDictionary(strm, dictionary) {
        var dictLength = dictionary.length;

        var s;
        var str, n;
        var wrap;
        var avail;
        var next;
        var input;
        var tmpDict;

        if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
            return Z_STREAM_ERROR;
        }

        s = strm.state;
        wrap = s.wrap;

        if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
            return Z_STREAM_ERROR;
        }

        /* when using zlib wrappers, compute Adler-32 for provided dictionary */
        if (wrap === 1) {
            /* adler32(strm->adler, dictionary, dictLength); */
            strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
        }

        s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

        /* if dictionary would fill window, just replace the history */
        if (dictLength >= s.w_size) {
            if (wrap === 0) {            /* already empty otherwise */
                /*** CLEAR_HASH(s); ***/
                zero$1(s.head); // Fill with NIL (= 0);
                s.strstart = 0;
                s.block_start = 0;
                s.insert = 0;
            }
            /* use the tail */
            // dictionary = dictionary.slice(dictLength - s.w_size);
            tmpDict = new common.Buf8(s.w_size);
            common.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
            dictionary = tmpDict;
            dictLength = s.w_size;
        }
        /* insert dictionary into window and hash */
        avail = strm.avail_in;
        next = strm.next_in;
        input = strm.input;
        strm.avail_in = dictLength;
        strm.next_in = 0;
        strm.input = dictionary;
        fill_window(s);
        while (s.lookahead >= MIN_MATCH$1) {
            str = s.strstart;
            n = s.lookahead - (MIN_MATCH$1 - 1);
            do {
                /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
                s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH$1 - 1]) & s.hash_mask;

                s.prev[str & s.w_mask] = s.head[s.ins_h];

                s.head[s.ins_h] = str;
                str++;
            } while (--n);
            s.strstart = str;
            s.lookahead = MIN_MATCH$1 - 1;
            fill_window(s);
        }
        s.strstart += s.lookahead;
        s.block_start = s.strstart;
        s.insert = s.lookahead;
        s.lookahead = 0;
        s.match_length = s.prev_length = MIN_MATCH$1 - 1;
        s.match_available = 0;
        strm.next_in = next;
        strm.input = input;
        strm.avail_in = avail;
        s.wrap = wrap;
        return Z_OK;
    }


    var deflateInit_1 = deflateInit;
    var deflateInit2_1 = deflateInit2;
    var deflateReset_1 = deflateReset;
    var deflateResetKeep_1 = deflateResetKeep;
    var deflateSetHeader_1 = deflateSetHeader;
    var deflate_2 = deflate;
    var deflateEnd_1 = deflateEnd;
    var deflateSetDictionary_1 = deflateSetDictionary;
    var deflateInfo = 'pako deflate (from Nodeca project)';

    /* Not implemented
    exports.deflateBound = deflateBound;
    exports.deflateCopy = deflateCopy;
    exports.deflateParams = deflateParams;
    exports.deflatePending = deflatePending;
    exports.deflatePrime = deflatePrime;
    exports.deflateTune = deflateTune;
    */

    var deflate_1 = {
        deflateInit: deflateInit_1,
        deflateInit2: deflateInit2_1,
        deflateReset: deflateReset_1,
        deflateResetKeep: deflateResetKeep_1,
        deflateSetHeader: deflateSetHeader_1,
        deflate: deflate_2,
        deflateEnd: deflateEnd_1,
        deflateSetDictionary: deflateSetDictionary_1,
        deflateInfo: deflateInfo
    };

    // Quick check if we can use fast array to bin string conversion
    //
    // - apply(Array) can fail on Android 2.2
    // - apply(Uint8Array) can fail on iOS 5.1 Safari
    //
    var STR_APPLY_OK = true;
    var STR_APPLY_UIA_OK = true;

    try { String.fromCharCode.apply(null, [0]); } catch (__) { STR_APPLY_OK = false; }
    try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


    // Table with utf8 lengths (calculated by first byte of sequence)
    // Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
    // because max possible codepoint is 0x10ffff
    var _utf8len = new common.Buf8(256);
    for (var q = 0; q < 256; q++) {
        _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
    }
    _utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


    // convert string to array (typed, when possible)
    var string2buf$1 = function (str) {
        var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

        // count binary size
        for (m_pos = 0; m_pos < str_len; m_pos++) {
            c = str.charCodeAt(m_pos);
            if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
                c2 = str.charCodeAt(m_pos + 1);
                if ((c2 & 0xfc00) === 0xdc00) {
                    c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
                    m_pos++;
                }
            }
            buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
        }

        // allocate buffer
        buf = new common.Buf8(buf_len);

        // convert
        for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
            c = str.charCodeAt(m_pos);
            if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
                c2 = str.charCodeAt(m_pos + 1);
                if ((c2 & 0xfc00) === 0xdc00) {
                    c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
                    m_pos++;
                }
            }
            if (c < 0x80) {
                /* one byte */
                buf[i++] = c;
            } else if (c < 0x800) {
                /* two bytes */
                buf[i++] = 0xC0 | (c >>> 6);
                buf[i++] = 0x80 | (c & 0x3f);
            } else if (c < 0x10000) {
                /* three bytes */
                buf[i++] = 0xE0 | (c >>> 12);
                buf[i++] = 0x80 | (c >>> 6 & 0x3f);
                buf[i++] = 0x80 | (c & 0x3f);
            } else {
                /* four bytes */
                buf[i++] = 0xf0 | (c >>> 18);
                buf[i++] = 0x80 | (c >>> 12 & 0x3f);
                buf[i++] = 0x80 | (c >>> 6 & 0x3f);
                buf[i++] = 0x80 | (c & 0x3f);
            }
        }

        return buf;
    };

    // Helper (used in 2 places)
    function buf2binstring(buf, len) {
        // On Chrome, the arguments in a function call that are allowed is `65534`.
        // If the length of the buffer is smaller than that, we can use this optimization,
        // otherwise we will take a slower path.
        if (len < 65534) {
            if ((buf.subarray && STR_APPLY_UIA_OK) || (!buf.subarray && STR_APPLY_OK)) {
                return String.fromCharCode.apply(null, common.shrinkBuf(buf, len));
            }
        }

        var result = '';
        for (var i = 0; i < len; i++) {
            result += String.fromCharCode(buf[i]);
        }
        return result;
    }


    // Convert byte array to binary string
    var buf2binstring_1 = function (buf) {
        return buf2binstring(buf, buf.length);
    };


    // Convert binary string (typed, when possible)
    var binstring2buf = function (str) {
        var buf = new common.Buf8(str.length);
        for (var i = 0, len = buf.length; i < len; i++) {
            buf[i] = str.charCodeAt(i);
        }
        return buf;
    };


    // convert array to string
    var buf2string = function (buf, max) {
        var i, out, c, c_len;
        var len = max || buf.length;

        // Reserve max possible length (2 words per char)
        // NB: by unknown reasons, Array is significantly faster for
        //     String.fromCharCode.apply than Uint16Array.
        var utf16buf = new Array(len * 2);

        for (out = 0, i = 0; i < len;) {
            c = buf[i++];
            // quick process ascii
            if (c < 0x80) { utf16buf[out++] = c; continue; }

            c_len = _utf8len[c];
            // skip 5 & 6 byte codes
            if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

            // apply mask on first byte
            c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
            // join the rest
            while (c_len > 1 && i < len) {
                c = (c << 6) | (buf[i++] & 0x3f);
                c_len--;
            }

            // terminated by end of string?
            if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

            if (c < 0x10000) {
                utf16buf[out++] = c;
            } else {
                c -= 0x10000;
                utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
                utf16buf[out++] = 0xdc00 | (c & 0x3ff);
            }
        }

        return buf2binstring(utf16buf, out);
    };


    // Calculate max possible position in utf8 buffer,
    // that will not break sequence. If that's not possible
    // - (very small limits) return max size as is.
    //
    // buf[] - utf8 bytes array
    // max   - length limit (mandatory);
    var utf8border = function (buf, max) {
        var pos;

        max = max || buf.length;
        if (max > buf.length) { max = buf.length; }

        // go back from last position, until start of sequence found
        pos = max - 1;
        while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

        // Very small and broken sequence,
        // return max, because we should return something anyway.
        if (pos < 0) { return max; }

        // If we came to start of buffer - that means buffer is too small,
        // return max too.
        if (pos === 0) { return max; }

        return (pos + _utf8len[buf[pos]] > max) ? pos : max;
    };

    var strings = {
        string2buf: string2buf$1,
        buf2binstring: buf2binstring_1,
        binstring2buf: binstring2buf,
        buf2string: buf2string,
        utf8border: utf8border
    };

    // (C) 1995-2013 Jean-loup Gailly and Mark Adler
    // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
    //
    // This software is provided 'as-is', without any express or implied
    // warranty. In no event will the authors be held liable for any damages
    // arising from the use of this software.
    //
    // Permission is granted to anyone to use this software for any purpose,
    // including commercial applications, and to alter it and redistribute it
    // freely, subject to the following restrictions:
    //
    // 1. The origin of this software must not be misrepresented; you must not
    //   claim that you wrote the original software. If you use this software
    //   in a product, an acknowledgment in the product documentation would be
    //   appreciated but is not required.
    // 2. Altered source versions must be plainly marked as such, and must not be
    //   misrepresented as being the original software.
    // 3. This notice may not be removed or altered from any source distribution.

    function ZStream() {
        /* next input byte */
        this.input = null; // JS specific, because we have no pointers
        this.next_in = 0;
        /* number of bytes available at input */
        this.avail_in = 0;
        /* total number of input bytes read so far */
        this.total_in = 0;
        /* next output byte should be put there */
        this.output = null; // JS specific, because we have no pointers
        this.next_out = 0;
        /* remaining free space at output */
        this.avail_out = 0;
        /* total number of bytes output so far */
        this.total_out = 0;
        /* last error message, NULL if no error */
        this.msg = ''/*Z_NULL*/;
        /* not visible by applications */
        this.state = null;
        /* best guess about the data type: binary or text */
        this.data_type = 2/*Z_UNKNOWN*/;
        /* adler32 value of the uncompressed data */
        this.adler = 0;
    }

    var zstream = ZStream;

    var toString = Object.prototype.toString;

    /* Public constants ==========================================================*/
    /* ===========================================================================*/

    var Z_NO_FLUSH$1 = 0;
    var Z_FINISH$1 = 4;

    var Z_OK$1 = 0;
    var Z_STREAM_END$1 = 1;
    var Z_SYNC_FLUSH = 2;

    var Z_DEFAULT_COMPRESSION$1 = -1;

    var Z_DEFAULT_STRATEGY$1 = 0;

    var Z_DEFLATED$1 = 8;

    /* ===========================================================================*/


    /**
     * class Deflate
     *
     * Generic JS-style wrapper for zlib calls. If you don't need
     * streaming behaviour - use more simple functions: [[deflate]],
     * [[deflateRaw]] and [[gzip]].
     **/

    /* internal
     * Deflate.chunks -> Array
     *
     * Chunks of output data, if [[Deflate#onData]] not overridden.
     **/

    /**
     * Deflate.result -> Uint8Array|Array
     *
     * Compressed result, generated by default [[Deflate#onData]]
     * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
     * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
     * push a chunk with explicit flush (call [[Deflate#push]] with
     * `Z_SYNC_FLUSH` param).
     **/

    /**
     * Deflate.err -> Number
     *
     * Error code after deflate finished. 0 (Z_OK) on success.
     * You will not need it in real life, because deflate errors
     * are possible only on wrong options or bad `onData` / `onEnd`
     * custom handlers.
     **/

    /**
     * Deflate.msg -> String
     *
     * Error message, if [[Deflate.err]] != 0
     **/


    /**
     * new Deflate(options)
     * - options (Object): zlib deflate options.
     *
     * Creates new deflator instance with specified params. Throws exception
     * on bad params. Supported options:
     *
     * - `level`
     * - `windowBits`
     * - `memLevel`
     * - `strategy`
     * - `dictionary`
     *
     * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
     * for more information on these.
     *
     * Additional options, for internal needs:
     *
     * - `chunkSize` - size of generated data chunks (16K by default)
     * - `raw` (Boolean) - do raw deflate
     * - `gzip` (Boolean) - create gzip wrapper
     * - `to` (String) - if equal to 'string', then result will be "binary string"
     *    (each char code [0..255])
     * - `header` (Object) - custom header for gzip
     *   - `text` (Boolean) - true if compressed data believed to be text
     *   - `time` (Number) - modification time, unix timestamp
     *   - `os` (Number) - operation system code
     *   - `extra` (Array) - array of bytes with extra data (max 65536)
     *   - `name` (String) - file name (binary string)
     *   - `comment` (String) - comment (binary string)
     *   - `hcrc` (Boolean) - true if header crc should be added
     *
     * ##### Example:
     *
     * ```javascript
     * var pako = require('pako')
     *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
     *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
     *
     * var deflate = new pako.Deflate({ level: 3});
     *
     * deflate.push(chunk1, false);
     * deflate.push(chunk2, true);  // true -> last chunk
     *
     * if (deflate.err) { throw new Error(deflate.err); }
     *
     * console.log(deflate.result);
     * ```
     **/
    function Deflate(options) {
        if (!(this instanceof Deflate)) return new Deflate(options);

        this.options = common.assign({
            level: Z_DEFAULT_COMPRESSION$1,
            method: Z_DEFLATED$1,
            chunkSize: 16384,
            windowBits: 15,
            memLevel: 8,
            strategy: Z_DEFAULT_STRATEGY$1,
            to: ''
        }, options || {});

        var opt = this.options;

        if (opt.raw && (opt.windowBits > 0)) {
            opt.windowBits = -opt.windowBits;
        }

        else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
            opt.windowBits += 16;
        }

        this.err = 0;      // error code, if happens (0 = Z_OK)
        this.msg = '';     // error message
        this.ended = false;  // used to avoid multiple onEnd() calls
        this.chunks = [];     // chunks of compressed data

        this.strm = new zstream();
        this.strm.avail_out = 0;

        var status = deflate_1.deflateInit2(
            this.strm,
            opt.level,
            opt.method,
            opt.windowBits,
            opt.memLevel,
            opt.strategy
        );

        if (status !== Z_OK$1) {
            throw new Error(messages[status]);
        }

        if (opt.header) {
            deflate_1.deflateSetHeader(this.strm, opt.header);
        }

        if (opt.dictionary) {
            var dict;
            // Convert data if needed
            if (typeof opt.dictionary === 'string') {
                // If we need to compress text, change encoding to utf8.
                dict = strings.string2buf(opt.dictionary);
            } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
                dict = new Uint8Array(opt.dictionary);
            } else {
                dict = opt.dictionary;
            }

            status = deflate_1.deflateSetDictionary(this.strm, dict);

            if (status !== Z_OK$1) {
                throw new Error(messages[status]);
            }

            this._dict_set = true;
        }
    }

    /**
     * Deflate#push(data[, mode]) -> Boolean
     * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
     *   converted to utf8 byte sequence.
     * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
     *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
     *
     * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
     * new compressed chunks. Returns `true` on success. The last data block must have
     * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
     * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
     * can use mode Z_SYNC_FLUSH, keeping the compression context.
     *
     * On fail call [[Deflate#onEnd]] with error code and return false.
     *
     * We strongly recommend to use `Uint8Array` on input for best speed (output
     * array format is detected automatically). Also, don't skip last param and always
     * use the same type in your code (boolean or number). That will improve JS speed.
     *
     * For regular `Array`-s make sure all elements are [0..255].
     *
     * ##### Example
     *
     * ```javascript
     * push(chunk, false); // push one of data chunks
     * ...
     * push(chunk, true);  // push last chunk
     * ```
     **/
    Deflate.prototype.push = function (data, mode) {
        var strm = this.strm;
        var chunkSize = this.options.chunkSize;
        var status, _mode;

        if (this.ended) { return false; }

        _mode = (mode === ~~mode) ? mode : ((mode === true) ? Z_FINISH$1 : Z_NO_FLUSH$1);

        // Convert data if needed
        if (typeof data === 'string') {
            // If we need to compress text, change encoding to utf8.
            strm.input = strings.string2buf(data);
        } else if (toString.call(data) === '[object ArrayBuffer]') {
            strm.input = new Uint8Array(data);
        } else {
            strm.input = data;
        }

        strm.next_in = 0;
        strm.avail_in = strm.input.length;

        do {
            if (strm.avail_out === 0) {
                strm.output = new common.Buf8(chunkSize);
                strm.next_out = 0;
                strm.avail_out = chunkSize;
            }
            status = deflate_1.deflate(strm, _mode);    /* no bad return value */

            if (status !== Z_STREAM_END$1 && status !== Z_OK$1) {
                this.onEnd(status);
                this.ended = true;
                return false;
            }
            if (strm.avail_out === 0 || (strm.avail_in === 0 && (_mode === Z_FINISH$1 || _mode === Z_SYNC_FLUSH))) {
                if (this.options.to === 'string') {
                    this.onData(strings.buf2binstring(common.shrinkBuf(strm.output, strm.next_out)));
                } else {
                    this.onData(common.shrinkBuf(strm.output, strm.next_out));
                }
            }
        } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END$1);

        // Finalize on the last chunk.
        if (_mode === Z_FINISH$1) {
            status = deflate_1.deflateEnd(this.strm);
            this.onEnd(status);
            this.ended = true;
            return status === Z_OK$1;
        }

        // callback interim results if Z_SYNC_FLUSH.
        if (_mode === Z_SYNC_FLUSH) {
            this.onEnd(Z_OK$1);
            strm.avail_out = 0;
            return true;
        }

        return true;
    };


    /**
     * Deflate#onData(chunk) -> Void
     * - chunk (Uint8Array|Array|String): output data. Type of array depends
     *   on js engine support. When string output requested, each chunk
     *   will be string.
     *
     * By default, stores data blocks in `chunks[]` property and glue
     * those in `onEnd`. Override this handler, if you need another behaviour.
     **/
    Deflate.prototype.onData = function (chunk) {
        this.chunks.push(chunk);
    };


    /**
     * Deflate#onEnd(status) -> Void
     * - status (Number): deflate status. 0 (Z_OK) on success,
     *   other if not.
     *
     * Called once after you tell deflate that the input stream is
     * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
     * or if an error happened. By default - join collected chunks,
     * free memory and fill `results` / `err` properties.
     **/
    Deflate.prototype.onEnd = function (status) {
        // On success - join
        if (status === Z_OK$1) {
            if (this.options.to === 'string') {
                this.result = this.chunks.join('');
            } else {
                this.result = common.flattenChunks(this.chunks);
            }
        }
        this.chunks = [];
        this.err = status;
        this.msg = this.strm.msg;
    };


    /**
     * deflate(data[, options]) -> Uint8Array|Array|String
     * - data (Uint8Array|Array|String): input data to compress.
     * - options (Object): zlib deflate options.
     *
     * Compress `data` with deflate algorithm and `options`.
     *
     * Supported options are:
     *
     * - level
     * - windowBits
     * - memLevel
     * - strategy
     * - dictionary
     *
     * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
     * for more information on these.
     *
     * Sugar (options):
     *
     * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
     *   negative windowBits implicitly.
     * - `to` (String) - if equal to 'string', then result will be "binary string"
     *    (each char code [0..255])
     *
     * ##### Example:
     *
     * ```javascript
     * var pako = require('pako')
     *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
     *
     * console.log(pako.deflate(data));
     * ```
     **/
    function deflate$1(input, options) {
        var deflator = new Deflate(options);

        deflator.push(input, true);

        // That will never happens, if you don't cheat with options :)
        if (deflator.err) { throw deflator.msg || messages[deflator.err]; }

        return deflator.result;
    }


    /**
     * deflateRaw(data[, options]) -> Uint8Array|Array|String
     * - data (Uint8Array|Array|String): input data to compress.
     * - options (Object): zlib deflate options.
     *
     * The same as [[deflate]], but creates raw data, without wrapper
     * (header and adler32 crc).
     **/
    function deflateRaw(input, options) {
        options = options || {};
        options.raw = true;
        return deflate$1(input, options);
    }


    /**
     * gzip(data[, options]) -> Uint8Array|Array|String
     * - data (Uint8Array|Array|String): input data to compress.
     * - options (Object): zlib deflate options.
     *
     * The same as [[deflate]], but create gzip wrapper instead of
     * deflate one.
     **/
    function gzip(input, options) {
        options = options || {};
        options.gzip = true;
        return deflate$1(input, options);
    }


    var Deflate_1 = Deflate;
    var deflate_2$1 = deflate$1;
    var deflateRaw_1 = deflateRaw;
    var gzip_1 = gzip;

    var deflate_1$2 = {
        Deflate: Deflate_1,
        deflate: deflate_2$1,
        deflateRaw: deflateRaw_1,
        gzip: gzip_1
    };

    // (C) 1995-2013 Jean-loup Gailly and Mark Adler
    // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
    //
    // This software is provided 'as-is', without any express or implied
    // warranty. In no event will the authors be held liable for any damages
    // arising from the use of this software.
    //
    // Permission is granted to anyone to use this software for any purpose,
    // including commercial applications, and to alter it and redistribute it
    // freely, subject to the following restrictions:
    //
    // 1. The origin of this software must not be misrepresented; you must not
    //   claim that you wrote the original software. If you use this software
    //   in a product, an acknowledgment in the product documentation would be
    //   appreciated but is not required.
    // 2. Altered source versions must be plainly marked as such, and must not be
    //   misrepresented as being the original software.
    // 3. This notice may not be removed or altered from any source distribution.

    // See state defs from inflate.js
    var BAD = 30;       /* got a data error -- remain here until reset */
    var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */

    /*
       Decode literal, length, and distance codes and write out the resulting
       literal and match bytes until either not enough input or output is
       available, an end-of-block is encountered, or a data error is encountered.
       When large enough input and output buffers are supplied to inflate(), for
       example, a 16K input buffer and a 64K output buffer, more than 95% of the
       inflate execution time is spent in this routine.
    
       Entry assumptions:
    
            state.mode === LEN
            strm.avail_in >= 6
            strm.avail_out >= 258
            start >= strm.avail_out
            state.bits < 8
    
       On return, state.mode is one of:
    
            LEN -- ran out of enough output space or enough available input
            TYPE -- reached end of block code, inflate() to interpret next block
            BAD -- error in block data
    
       Notes:
    
        - The maximum input bits used by a length/distance pair is 15 bits for the
          length code, 5 bits for the length extra, 15 bits for the distance code,
          and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
          Therefore if strm.avail_in >= 6, then there is enough input to avoid
          checking for available input while decoding.
    
        - The maximum bytes that a single length/distance pair can output is 258
          bytes, which is the maximum length that can be coded.  inflate_fast()
          requires strm.avail_out >= 258 for each loop to avoid checking for
          output space.
     */
    var inffast = function inflate_fast(strm, start) {
        var state;
        var _in;                    /* local strm.input */
        var last;                   /* have enough input while in < last */
        var _out;                   /* local strm.output */
        var beg;                    /* inflate()'s initial strm.output */
        var end;                    /* while out < end, enough space available */
        //#ifdef INFLATE_STRICT
        var dmax;                   /* maximum distance from zlib header */
        //#endif
        var wsize;                  /* window size or zero if not using window */
        var whave;                  /* valid bytes in the window */
        var wnext;                  /* window write index */
        // Use `s_window` instead `window`, avoid conflict with instrumentation tools
        var s_window;               /* allocated sliding window, if wsize != 0 */
        var hold;                   /* local strm.hold */
        var bits;                   /* local strm.bits */
        var lcode;                  /* local strm.lencode */
        var dcode;                  /* local strm.distcode */
        var lmask;                  /* mask for first level of length codes */
        var dmask;                  /* mask for first level of distance codes */
        var here;                   /* retrieved table entry */
        var op;                     /* code bits, operation, extra bits, or */
        /*  window position, window bytes to copy */
        var len;                    /* match length, unused bytes */
        var dist;                   /* match distance */
        var from;                   /* where to copy match from */
        var from_source;


        var input, output; // JS specific, because we have no pointers

        /* copy state to local variables */
        state = strm.state;
        //here = state.here;
        _in = strm.next_in;
        input = strm.input;
        last = _in + (strm.avail_in - 5);
        _out = strm.next_out;
        output = strm.output;
        beg = _out - (start - strm.avail_out);
        end = _out + (strm.avail_out - 257);
        //#ifdef INFLATE_STRICT
        dmax = state.dmax;
        //#endif
        wsize = state.wsize;
        whave = state.whave;
        wnext = state.wnext;
        s_window = state.window;
        hold = state.hold;
        bits = state.bits;
        lcode = state.lencode;
        dcode = state.distcode;
        lmask = (1 << state.lenbits) - 1;
        dmask = (1 << state.distbits) - 1;


        /* decode literals and length/distances until end-of-block or not enough
           input data or output space */

        top:
        do {
            if (bits < 15) {
                hold += input[_in++] << bits;
                bits += 8;
                hold += input[_in++] << bits;
                bits += 8;
            }

            here = lcode[hold & lmask];

            dolen:
            for (; ;) { // Goto emulation
                op = here >>> 24/*here.bits*/;
                hold >>>= op;
                bits -= op;
                op = (here >>> 16) & 0xff/*here.op*/;
                if (op === 0) {                          /* literal */
                    //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
                    //        "inflate:         literal '%c'\n" :
                    //        "inflate:         literal 0x%02x\n", here.val));
                    output[_out++] = here & 0xffff/*here.val*/;
                }
                else if (op & 16) {                     /* length base */
                    len = here & 0xffff/*here.val*/;
                    op &= 15;                           /* number of extra bits */
                    if (op) {
                        if (bits < op) {
                            hold += input[_in++] << bits;
                            bits += 8;
                        }
                        len += hold & ((1 << op) - 1);
                        hold >>>= op;
                        bits -= op;
                    }
                    //Tracevv((stderr, "inflate:         length %u\n", len));
                    if (bits < 15) {
                        hold += input[_in++] << bits;
                        bits += 8;
                        hold += input[_in++] << bits;
                        bits += 8;
                    }
                    here = dcode[hold & dmask];

                    dodist:
                    for (; ;) { // goto emulation
                        op = here >>> 24/*here.bits*/;
                        hold >>>= op;
                        bits -= op;
                        op = (here >>> 16) & 0xff/*here.op*/;

                        if (op & 16) {                      /* distance base */
                            dist = here & 0xffff/*here.val*/;
                            op &= 15;                       /* number of extra bits */
                            if (bits < op) {
                                hold += input[_in++] << bits;
                                bits += 8;
                                if (bits < op) {
                                    hold += input[_in++] << bits;
                                    bits += 8;
                                }
                            }
                            dist += hold & ((1 << op) - 1);
                            //#ifdef INFLATE_STRICT
                            if (dist > dmax) {
                                strm.msg = 'invalid distance too far back';
                                state.mode = BAD;
                                break top;
                            }
                            //#endif
                            hold >>>= op;
                            bits -= op;
                            //Tracevv((stderr, "inflate:         distance %u\n", dist));
                            op = _out - beg;                /* max distance in output */
                            if (dist > op) {                /* see if copy from window */
                                op = dist - op;               /* distance back in window */
                                if (op > whave) {
                                    if (state.sane) {
                                        strm.msg = 'invalid distance too far back';
                                        state.mode = BAD;
                                        break top;
                                    }

                                    // (!) This block is disabled in zlib defaults,
                                    // don't enable it for binary compatibility
                                    //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
                                    //                if (len <= op - whave) {
                                    //                  do {
                                    //                    output[_out++] = 0;
                                    //                  } while (--len);
                                    //                  continue top;
                                    //                }
                                    //                len -= op - whave;
                                    //                do {
                                    //                  output[_out++] = 0;
                                    //                } while (--op > whave);
                                    //                if (op === 0) {
                                    //                  from = _out - dist;
                                    //                  do {
                                    //                    output[_out++] = output[from++];
                                    //                  } while (--len);
                                    //                  continue top;
                                    //                }
                                    //#endif
                                }
                                from = 0; // window index
                                from_source = s_window;
                                if (wnext === 0) {           /* very common case */
                                    from += wsize - op;
                                    if (op < len) {         /* some from window */
                                        len -= op;
                                        do {
                                            output[_out++] = s_window[from++];
                                        } while (--op);
                                        from = _out - dist;  /* rest from output */
                                        from_source = output;
                                    }
                                }
                                else if (wnext < op) {      /* wrap around window */
                                    from += wsize + wnext - op;
                                    op -= wnext;
                                    if (op < len) {         /* some from end of window */
                                        len -= op;
                                        do {
                                            output[_out++] = s_window[from++];
                                        } while (--op);
                                        from = 0;
                                        if (wnext < len) {  /* some from start of window */
                                            op = wnext;
                                            len -= op;
                                            do {
                                                output[_out++] = s_window[from++];
                                            } while (--op);
                                            from = _out - dist;      /* rest from output */
                                            from_source = output;
                                        }
                                    }
                                }
                                else {                      /* contiguous in window */
                                    from += wnext - op;
                                    if (op < len) {         /* some from window */
                                        len -= op;
                                        do {
                                            output[_out++] = s_window[from++];
                                        } while (--op);
                                        from = _out - dist;  /* rest from output */
                                        from_source = output;
                                    }
                                }
                                while (len > 2) {
                                    output[_out++] = from_source[from++];
                                    output[_out++] = from_source[from++];
                                    output[_out++] = from_source[from++];
                                    len -= 3;
                                }
                                if (len) {
                                    output[_out++] = from_source[from++];
                                    if (len > 1) {
                                        output[_out++] = from_source[from++];
                                    }
                                }
                            }
                            else {
                                from = _out - dist;          /* copy direct from output */
                                do {                        /* minimum length is three */
                                    output[_out++] = output[from++];
                                    output[_out++] = output[from++];
                                    output[_out++] = output[from++];
                                    len -= 3;
                                } while (len > 2);
                                if (len) {
                                    output[_out++] = output[from++];
                                    if (len > 1) {
                                        output[_out++] = output[from++];
                                    }
                                }
                            }
                        }
                        else if ((op & 64) === 0) {          /* 2nd level distance code */
                            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
                            continue dodist;
                        }
                        else {
                            strm.msg = 'invalid distance code';
                            state.mode = BAD;
                            break top;
                        }

                        break; // need to emulate goto via "continue"
                    }
                }
                else if ((op & 64) === 0) {              /* 2nd level length code */
                    here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
                    continue dolen;
                }
                else if (op & 32) {                     /* end-of-block */
                    //Tracevv((stderr, "inflate:         end of block\n"));
                    state.mode = TYPE;
                    break top;
                }
                else {
                    strm.msg = 'invalid literal/length code';
                    state.mode = BAD;
                    break top;
                }

                break; // need to emulate goto via "continue"
            }
        } while (_in < last && _out < end);

        /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
        len = bits >> 3;
        _in -= len;
        bits -= len << 3;
        hold &= (1 << bits) - 1;

        /* update state and return */
        strm.next_in = _in;
        strm.next_out = _out;
        strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
        strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
        state.hold = hold;
        state.bits = bits;
        return;
    };

    // (C) 1995-2013 Jean-loup Gailly and Mark Adler
    // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
    //
    // This software is provided 'as-is', without any express or implied
    // warranty. In no event will the authors be held liable for any damages
    // arising from the use of this software.
    //
    // Permission is granted to anyone to use this software for any purpose,
    // including commercial applications, and to alter it and redistribute it
    // freely, subject to the following restrictions:
    //
    // 1. The origin of this software must not be misrepresented; you must not
    //   claim that you wrote the original software. If you use this software
    //   in a product, an acknowledgment in the product documentation would be
    //   appreciated but is not required.
    // 2. Altered source versions must be plainly marked as such, and must not be
    //   misrepresented as being the original software.
    // 3. This notice may not be removed or altered from any source distribution.



    var MAXBITS = 15;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    //var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;

    var lbase = [ /* Length codes 257..285 base */
        3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
        35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
    ];

    var lext = [ /* Length codes 257..285 extra */
        16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
        19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
    ];

    var dbase = [ /* Distance codes 0..29 base */
        1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
        257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
        8193, 12289, 16385, 24577, 0, 0
    ];

    var dext = [ /* Distance codes 0..29 extra */
        16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
        23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
        28, 28, 29, 29, 64, 64
    ];

    var inftrees = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
        var bits = opts.bits;
        //here = opts.here; /* table entry for duplication */

        var len = 0;               /* a code's length in bits */
        var sym = 0;               /* index of code symbols */
        var min = 0, max = 0;          /* minimum and maximum code lengths */
        var root = 0;              /* number of index bits for root table */
        var curr = 0;              /* number of index bits for current table */
        var drop = 0;              /* code bits to drop for sub-table */
        var left = 0;                   /* number of prefix codes available */
        var used = 0;              /* code entries in table used */
        var huff = 0;              /* Huffman code */
        var incr;              /* for incrementing code, index */
        var fill;              /* index for replicating entries */
        var low;               /* low bits for current root entry */
        var mask;              /* mask for low root bits */
        var next;             /* next available space in table */
        var base = null;     /* base value table to use */
        var base_index = 0;
        //  var shoextra;    /* extra bits table to use */
        var end;                    /* use base and extra for symbol > end */
        var count = new common.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
        var offs = new common.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
        var extra = null;
        var extra_index = 0;

        var here_bits, here_op, here_val;

        /*
         Process a set of code lengths to create a canonical Huffman code.  The
         code lengths are lens[0..codes-1].  Each length corresponds to the
         symbols 0..codes-1.  The Huffman code is generated by first sorting the
         symbols by length from short to long, and retaining the symbol order
         for codes with equal lengths.  Then the code starts with all zero bits
         for the first code of the shortest length, and the codes are integer
         increments for the same length, and zeros are appended as the length
         increases.  For the deflate format, these bits are stored backwards
         from their more natural integer increment ordering, and so when the
         decoding tables are built in the large loop below, the integer codes
         are incremented backwards.
      
         This routine assumes, but does not check, that all of the entries in
         lens[] are in the range 0..MAXBITS.  The caller must assure this.
         1..MAXBITS is interpreted as that code length.  zero means that that
         symbol does not occur in this code.
      
         The codes are sorted by computing a count of codes for each length,
         creating from that a table of starting indices for each length in the
         sorted table, and then entering the symbols in order in the sorted
         table.  The sorted table is work[], with that space being provided by
         the caller.
      
         The length counts are used for other purposes as well, i.e. finding
         the minimum and maximum length codes, determining if there are any
         codes at all, checking for a valid set of lengths, and looking ahead
         at length counts to determine sub-table sizes when building the
         decoding tables.
         */

        /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
        for (len = 0; len <= MAXBITS; len++) {
            count[len] = 0;
        }
        for (sym = 0; sym < codes; sym++) {
            count[lens[lens_index + sym]]++;
        }

        /* bound code lengths, force root to be within code lengths */
        root = bits;
        for (max = MAXBITS; max >= 1; max--) {
            if (count[max] !== 0) { break; }
        }
        if (root > max) {
            root = max;
        }
        if (max === 0) {                     /* no symbols to code at all */
            //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
            //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
            //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
            table[table_index++] = (1 << 24) | (64 << 16) | 0;


            //table.op[opts.table_index] = 64;
            //table.bits[opts.table_index] = 1;
            //table.val[opts.table_index++] = 0;
            table[table_index++] = (1 << 24) | (64 << 16) | 0;

            opts.bits = 1;
            return 0;     /* no symbols, but wait for decoding to report error */
        }
        for (min = 1; min < max; min++) {
            if (count[min] !== 0) { break; }
        }
        if (root < min) {
            root = min;
        }

        /* check for an over-subscribed or incomplete set of lengths */
        left = 1;
        for (len = 1; len <= MAXBITS; len++) {
            left <<= 1;
            left -= count[len];
            if (left < 0) {
                return -1;
            }        /* over-subscribed */
        }
        if (left > 0 && (type === CODES || max !== 1)) {
            return -1;                      /* incomplete set */
        }

        /* generate offsets into symbol table for each length for sorting */
        offs[1] = 0;
        for (len = 1; len < MAXBITS; len++) {
            offs[len + 1] = offs[len] + count[len];
        }

        /* sort symbols by length, by symbol order within each length */
        for (sym = 0; sym < codes; sym++) {
            if (lens[lens_index + sym] !== 0) {
                work[offs[lens[lens_index + sym]]++] = sym;
            }
        }

        /*
         Create and fill in decoding tables.  In this loop, the table being
         filled is at next and has curr index bits.  The code being used is huff
         with length len.  That code is converted to an index by dropping drop
         bits off of the bottom.  For codes where len is less than drop + curr,
         those top drop + curr - len bits are incremented through all values to
         fill the table with replicated entries.
      
         root is the number of index bits for the root table.  When len exceeds
         root, sub-tables are created pointed to by the root entry with an index
         of the low root bits of huff.  This is saved in low to check for when a
         new sub-table should be started.  drop is zero when the root table is
         being filled, and drop is root when sub-tables are being filled.
      
         When a new sub-table is needed, it is necessary to look ahead in the
         code lengths to determine what size sub-table is needed.  The length
         counts are used for this, and so count[] is decremented as codes are
         entered in the tables.
      
         used keeps track of how many table entries have been allocated from the
         provided *table space.  It is checked for LENS and DIST tables against
         the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
         the initial root table size constants.  See the comments in inftrees.h
         for more information.
      
         sym increments through all symbols, and the loop terminates when
         all codes of length max, i.e. all codes, have been processed.  This
         routine permits incomplete codes, so another loop after this one fills
         in the rest of the decoding tables with invalid code markers.
         */

        /* set up for code type */
        // poor man optimization - use if-else instead of switch,
        // to avoid deopts in old v8
        if (type === CODES) {
            base = extra = work;    /* dummy value--not used */
            end = 19;

        } else if (type === LENS) {
            base = lbase;
            base_index -= 257;
            extra = lext;
            extra_index -= 257;
            end = 256;

        } else {                    /* DISTS */
            base = dbase;
            extra = dext;
            end = -1;
        }

        /* initialize opts for loop */
        huff = 0;                   /* starting code */
        sym = 0;                    /* starting code symbol */
        len = min;                  /* starting code length */
        next = table_index;              /* current table to fill in */
        curr = root;                /* current table index bits */
        drop = 0;                   /* current bits to drop from code for index */
        low = -1;                   /* trigger new sub-table when len > root */
        used = 1 << root;          /* use root table entries */
        mask = used - 1;            /* mask for comparing low */

        /* check available table space */
        if ((type === LENS && used > ENOUGH_LENS) ||
            (type === DISTS && used > ENOUGH_DISTS)) {
            return 1;
        }

        /* process all codes and make table entries */
        for (; ;) {
            /* create table entry */
            here_bits = len - drop;
            if (work[sym] < end) {
                here_op = 0;
                here_val = work[sym];
            }
            else if (work[sym] > end) {
                here_op = extra[extra_index + work[sym]];
                here_val = base[base_index + work[sym]];
            }
            else {
                here_op = 32 + 64;         /* end of block */
                here_val = 0;
            }

            /* replicate for those indices with low len bits equal to huff */
            incr = 1 << (len - drop);
            fill = 1 << curr;
            min = fill;                 /* save offset to next table */
            do {
                fill -= incr;
                table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val | 0;
            } while (fill !== 0);

            /* backwards increment the len-bit code huff */
            incr = 1 << (len - 1);
            while (huff & incr) {
                incr >>= 1;
            }
            if (incr !== 0) {
                huff &= incr - 1;
                huff += incr;
            } else {
                huff = 0;
            }

            /* go to next symbol, update count, len */
            sym++;
            if (--count[len] === 0) {
                if (len === max) { break; }
                len = lens[lens_index + work[sym]];
            }

            /* create new sub-table if needed */
            if (len > root && (huff & mask) !== low) {
                /* if first time, transition to sub-tables */
                if (drop === 0) {
                    drop = root;
                }

                /* increment past last table */
                next += min;            /* here min is 1 << curr */

                /* determine length of next table */
                curr = len - drop;
                left = 1 << curr;
                while (curr + drop < max) {
                    left -= count[curr + drop];
                    if (left <= 0) { break; }
                    curr++;
                    left <<= 1;
                }

                /* check for enough space */
                used += 1 << curr;
                if ((type === LENS && used > ENOUGH_LENS) ||
                    (type === DISTS && used > ENOUGH_DISTS)) {
                    return 1;
                }

                /* point entry in root table to sub-table */
                low = huff & mask;
                /*table.op[low] = curr;
                table.bits[low] = root;
                table.val[low] = next - opts.table_index;*/
                table[low] = (root << 24) | (curr << 16) | (next - table_index) | 0;
            }
        }

        /* fill in remaining table entry if code is incomplete (guaranteed to have
         at most one remaining entry, since if the code is incomplete, the
         maximum code length that was allowed to get this far is one bit) */
        if (huff !== 0) {
            //table.op[next + huff] = 64;            /* invalid code marker */
            //table.bits[next + huff] = len - drop;
            //table.val[next + huff] = 0;
            table[next + huff] = ((len - drop) << 24) | (64 << 16) | 0;
        }

        /* set return parameters */
        //opts.table_index += used;
        opts.bits = root;
        return 0;
    };

    // (C) 1995-2013 Jean-loup Gailly and Mark Adler
    // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
    //
    // This software is provided 'as-is', without any express or implied
    // warranty. In no event will the authors be held liable for any damages
    // arising from the use of this software.
    //
    // Permission is granted to anyone to use this software for any purpose,
    // including commercial applications, and to alter it and redistribute it
    // freely, subject to the following restrictions:
    //
    // 1. The origin of this software must not be misrepresented; you must not
    //   claim that you wrote the original software. If you use this software
    //   in a product, an acknowledgment in the product documentation would be
    //   appreciated but is not required.
    // 2. Altered source versions must be plainly marked as such, and must not be
    //   misrepresented as being the original software.
    // 3. This notice may not be removed or altered from any source distribution.







    var CODES$1 = 0;
    var LENS$1 = 1;
    var DISTS$1 = 2;

    /* Public constants ==========================================================*/
    /* ===========================================================================*/


    /* Allowed flush values; see deflate() and inflate() below for details */
    //var Z_NO_FLUSH      = 0;
    //var Z_PARTIAL_FLUSH = 1;
    //var Z_SYNC_FLUSH    = 2;
    //var Z_FULL_FLUSH    = 3;
    var Z_FINISH$2 = 4;
    var Z_BLOCK$1 = 5;
    var Z_TREES = 6;


    /* Return codes for the compression/decompression functions. Negative values
     * are errors, positive values are used for special but normal events.
     */
    var Z_OK$2 = 0;
    var Z_STREAM_END$2 = 1;
    var Z_NEED_DICT = 2;
    //var Z_ERRNO         = -1;
    var Z_STREAM_ERROR$1 = -2;
    var Z_DATA_ERROR$1 = -3;
    var Z_MEM_ERROR = -4;
    var Z_BUF_ERROR$1 = -5;
    //var Z_VERSION_ERROR = -6;

    /* The deflate compression method */
    var Z_DEFLATED$2 = 8;


    /* STATES ====================================================================*/
    /* ===========================================================================*/


    var HEAD = 1;       /* i: waiting for magic header */
    var FLAGS = 2;      /* i: waiting for method and flags (gzip) */
    var TIME = 3;       /* i: waiting for modification time (gzip) */
    var OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
    var EXLEN = 5;      /* i: waiting for extra length (gzip) */
    var EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
    var NAME = 7;       /* i: waiting for end of file name (gzip) */
    var COMMENT = 8;    /* i: waiting for end of comment (gzip) */
    var HCRC = 9;       /* i: waiting for header crc (gzip) */
    var DICTID = 10;    /* i: waiting for dictionary check value */
    var DICT = 11;      /* waiting for inflateSetDictionary() call */
    var TYPE$1 = 12;      /* i: waiting for type bits, including last-flag bit */
    var TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
    var STORED = 14;    /* i: waiting for stored size (length and complement) */
    var COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
    var COPY = 16;      /* i/o: waiting for input or output to copy stored block */
    var TABLE = 17;     /* i: waiting for dynamic block table lengths */
    var LENLENS = 18;   /* i: waiting for code length code lengths */
    var CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
    var LEN_ = 20;      /* i: same as LEN below, but only first time in */
    var LEN = 21;       /* i: waiting for length/lit/eob code */
    var LENEXT = 22;    /* i: waiting for length extra bits */
    var DIST = 23;      /* i: waiting for distance code */
    var DISTEXT = 24;   /* i: waiting for distance extra bits */
    var MATCH = 25;     /* o: waiting for output space to copy string */
    var LIT = 26;       /* o: waiting for output space to write literal */
    var CHECK = 27;     /* i: waiting for 32-bit check value */
    var LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
    var DONE = 29;      /* finished check, done -- remain here until reset */
    var BAD$1 = 30;       /* got a data error -- remain here until reset */
    var MEM = 31;       /* got an inflate() memory error -- remain here until reset */
    var SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

    /* ===========================================================================*/



    var ENOUGH_LENS$1 = 852;
    var ENOUGH_DISTS$1 = 592;
    //var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

    var MAX_WBITS$1 = 15;
    /* 32K LZ77 window */
    var DEF_WBITS = MAX_WBITS$1;


    function zswap32(q) {
        return (((q >>> 24) & 0xff) +
            ((q >>> 8) & 0xff00) +
            ((q & 0xff00) << 8) +
            ((q & 0xff) << 24));
    }


    function InflateState() {
        this.mode = 0;             /* current inflate mode */
        this.last = false;          /* true if processing last block */
        this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
        this.havedict = false;      /* true if dictionary provided */
        this.flags = 0;             /* gzip header method and flags (0 if zlib) */
        this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
        this.check = 0;             /* protected copy of check value */
        this.total = 0;             /* protected copy of output count */
        // TODO: may be {}
        this.head = null;           /* where to save gzip header information */

        /* sliding window */
        this.wbits = 0;             /* log base 2 of requested window size */
        this.wsize = 0;             /* window size or zero if not using window */
        this.whave = 0;             /* valid bytes in the window */
        this.wnext = 0;             /* window write index */
        this.window = null;         /* allocated sliding window, if needed */

        /* bit accumulator */
        this.hold = 0;              /* input bit accumulator */
        this.bits = 0;              /* number of bits in "in" */

        /* for string and stored block copying */
        this.length = 0;            /* literal or length of data to copy */
        this.offset = 0;            /* distance back to copy string from */

        /* for table and code decoding */
        this.extra = 0;             /* extra bits needed */

        /* fixed and dynamic code tables */
        this.lencode = null;          /* starting table for length/literal codes */
        this.distcode = null;         /* starting table for distance codes */
        this.lenbits = 0;           /* index bits for lencode */
        this.distbits = 0;          /* index bits for distcode */

        /* dynamic table building */
        this.ncode = 0;             /* number of code length code lengths */
        this.nlen = 0;              /* number of length code lengths */
        this.ndist = 0;             /* number of distance code lengths */
        this.have = 0;              /* number of code lengths in lens[] */
        this.next = null;              /* next available space in codes[] */

        this.lens = new common.Buf16(320); /* temporary storage for code lengths */
        this.work = new common.Buf16(288); /* work area for code table building */

        /*
         because we don't have pointers in js, we use lencode and distcode directly
         as buffers so we don't need codes
        */
        //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
        this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
        this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
        this.sane = 0;                   /* if false, allow invalid distance too far */
        this.back = 0;                   /* bits back of last unprocessed length/lit */
        this.was = 0;                    /* initial length of match */
    }

    function inflateResetKeep(strm) {
        var state;

        if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
        state = strm.state;
        strm.total_in = strm.total_out = state.total = 0;
        strm.msg = ''; /*Z_NULL*/
        if (state.wrap) {       /* to support ill-conceived Java test suite */
            strm.adler = state.wrap & 1;
        }
        state.mode = HEAD;
        state.last = 0;
        state.havedict = 0;
        state.dmax = 32768;
        state.head = null/*Z_NULL*/;
        state.hold = 0;
        state.bits = 0;
        //state.lencode = state.distcode = state.next = state.codes;
        state.lencode = state.lendyn = new common.Buf32(ENOUGH_LENS$1);
        state.distcode = state.distdyn = new common.Buf32(ENOUGH_DISTS$1);

        state.sane = 1;
        state.back = -1;
        //Tracev((stderr, "inflate: reset\n"));
        return Z_OK$2;
    }

    function inflateReset(strm) {
        var state;

        if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
        state = strm.state;
        state.wsize = 0;
        state.whave = 0;
        state.wnext = 0;
        return inflateResetKeep(strm);

    }

    function inflateReset2(strm, windowBits) {
        var wrap;
        var state;

        /* get the state */
        if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
        state = strm.state;

        /* extract wrap request from windowBits parameter */
        if (windowBits < 0) {
            wrap = 0;
            windowBits = -windowBits;
        }
        else {
            wrap = (windowBits >> 4) + 1;
            if (windowBits < 48) {
                windowBits &= 15;
            }
        }

        /* set number of window bits, free window if different */
        if (windowBits && (windowBits < 8 || windowBits > 15)) {
            return Z_STREAM_ERROR$1;
        }
        if (state.window !== null && state.wbits !== windowBits) {
            state.window = null;
        }

        /* update state and reset the rest of it */
        state.wrap = wrap;
        state.wbits = windowBits;
        return inflateReset(strm);
    }

    function inflateInit2(strm, windowBits) {
        var ret;
        var state;

        if (!strm) { return Z_STREAM_ERROR$1; }
        //strm.msg = Z_NULL;                 /* in case we return an error */

        state = new InflateState();

        //if (state === Z_NULL) return Z_MEM_ERROR;
        //Tracev((stderr, "inflate: allocated\n"));
        strm.state = state;
        state.window = null/*Z_NULL*/;
        ret = inflateReset2(strm, windowBits);
        if (ret !== Z_OK$2) {
            strm.state = null/*Z_NULL*/;
        }
        return ret;
    }

    function inflateInit(strm) {
        return inflateInit2(strm, DEF_WBITS);
    }


    /*
     Return state with length and distance decoding tables and index sizes set to
     fixed code decoding.  Normally this returns fixed tables from inffixed.h.
     If BUILDFIXED is defined, then instead this routine builds the tables the
     first time it's called, and returns those tables the first time and
     thereafter.  This reduces the size of the code by about 2K bytes, in
     exchange for a little execution time.  However, BUILDFIXED should not be
     used for threaded applications, since the rewriting of the tables and virgin
     may not be thread-safe.
     */
    var virgin = true;

    var lenfix;
    var distfix; // We have no pointers in JS, so keep tables separate

    function fixedtables(state) {
        /* build fixed huffman tables if first call (may not be thread safe) */
        if (virgin) {
            var sym;

            lenfix = new common.Buf32(512);
            distfix = new common.Buf32(32);

            /* literal/length table */
            sym = 0;
            while (sym < 144) { state.lens[sym++] = 8; }
            while (sym < 256) { state.lens[sym++] = 9; }
            while (sym < 280) { state.lens[sym++] = 7; }
            while (sym < 288) { state.lens[sym++] = 8; }

            inftrees(LENS$1, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });

            /* distance table */
            sym = 0;
            while (sym < 32) { state.lens[sym++] = 5; }

            inftrees(DISTS$1, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });

            /* do this just once */
            virgin = false;
        }

        state.lencode = lenfix;
        state.lenbits = 9;
        state.distcode = distfix;
        state.distbits = 5;
    }


    /*
     Update the window with the last wsize (normally 32K) bytes written before
     returning.  If window does not exist yet, create it.  This is only called
     when a window is already in use, or when output has been written during this
     inflate call, but the end of the deflate stream has not been reached yet.
     It is also called to create a window for dictionary data when a dictionary
     is loaded.
    
     Providing output buffers larger than 32K to inflate() should provide a speed
     advantage, since only the last 32K of output is copied to the sliding window
     upon return from inflate(), and since all distances after the first 32K of
     output will fall in the output data, making match copies simpler and faster.
     The advantage may be dependent on the size of the processor's data caches.
     */
    function updatewindow(strm, src, end, copy) {
        var dist;
        var state = strm.state;

        /* if it hasn't been done already, allocate space for the window */
        if (state.window === null) {
            state.wsize = 1 << state.wbits;
            state.wnext = 0;
            state.whave = 0;

            state.window = new common.Buf8(state.wsize);
        }

        /* copy state->wsize or less output bytes into the circular window */
        if (copy >= state.wsize) {
            common.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
            state.wnext = 0;
            state.whave = state.wsize;
        }
        else {
            dist = state.wsize - state.wnext;
            if (dist > copy) {
                dist = copy;
            }
            //zmemcpy(state->window + state->wnext, end - copy, dist);
            common.arraySet(state.window, src, end - copy, dist, state.wnext);
            copy -= dist;
            if (copy) {
                //zmemcpy(state->window, end - copy, copy);
                common.arraySet(state.window, src, end - copy, copy, 0);
                state.wnext = copy;
                state.whave = state.wsize;
            }
            else {
                state.wnext += dist;
                if (state.wnext === state.wsize) { state.wnext = 0; }
                if (state.whave < state.wsize) { state.whave += dist; }
            }
        }
        return 0;
    }

    function inflate(strm, flush) {
        var state;
        var input, output;          // input/output buffers
        var next;                   /* next input INDEX */
        var put;                    /* next output INDEX */
        var have, left;             /* available input and output */
        var hold;                   /* bit buffer */
        var bits;                   /* bits in bit buffer */
        var _in, _out;              /* save starting available input and output */
        var copy;                   /* number of stored or match bytes to copy */
        var from;                   /* where to copy match bytes from */
        var from_source;
        var here = 0;               /* current decoding table entry */
        var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
        //var last;                   /* parent table entry */
        var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
        var len;                    /* length to copy for repeats, bits to drop */
        var ret;                    /* return code */
        var hbuf = new common.Buf8(4);    /* buffer for gzip header crc calculation */
        var opts;

        var n; // temporary var for NEED_BITS

        var order = /* permutation of code lengths */
            [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];


        if (!strm || !strm.state || !strm.output ||
            (!strm.input && strm.avail_in !== 0)) {
            return Z_STREAM_ERROR$1;
        }

        state = strm.state;
        if (state.mode === TYPE$1) { state.mode = TYPEDO; }    /* skip check */


        //--- LOAD() ---
        put = strm.next_out;
        output = strm.output;
        left = strm.avail_out;
        next = strm.next_in;
        input = strm.input;
        have = strm.avail_in;
        hold = state.hold;
        bits = state.bits;
        //---

        _in = have;
        _out = left;
        ret = Z_OK$2;

        inf_leave: // goto emulation
        for (; ;) {
            switch (state.mode) {
                case HEAD:
                    if (state.wrap === 0) {
                        state.mode = TYPEDO;
                        break;
                    }
                    //=== NEEDBITS(16);
                    while (bits < 16) {
                        if (have === 0) { break inf_leave; }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    //===//
                    if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
                        state.check = 0/*crc32(0L, Z_NULL, 0)*/;
                        //=== CRC2(state.check, hold);
                        hbuf[0] = hold & 0xff;
                        hbuf[1] = (hold >>> 8) & 0xff;
                        state.check = crc32_1(state.check, hbuf, 2, 0);
                        //===//

                        //=== INITBITS();
                        hold = 0;
                        bits = 0;
                        //===//
                        state.mode = FLAGS;
                        break;
                    }
                    state.flags = 0;           /* expect zlib header */
                    if (state.head) {
                        state.head.done = false;
                    }
                    if (!(state.wrap & 1) ||   /* check if zlib header allowed */
                        (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
                        strm.msg = 'incorrect header check';
                        state.mode = BAD$1;
                        break;
                    }
                    if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED$2) {
                        strm.msg = 'unknown compression method';
                        state.mode = BAD$1;
                        break;
                    }
                    //--- DROPBITS(4) ---//
                    hold >>>= 4;
                    bits -= 4;
                    //---//
                    len = (hold & 0x0f)/*BITS(4)*/ + 8;
                    if (state.wbits === 0) {
                        state.wbits = len;
                    }
                    else if (len > state.wbits) {
                        strm.msg = 'invalid window size';
                        state.mode = BAD$1;
                        break;
                    }
                    state.dmax = 1 << len;
                    //Tracev((stderr, "inflate:   zlib header ok\n"));
                    strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
                    state.mode = hold & 0x200 ? DICTID : TYPE$1;
                    //=== INITBITS();
                    hold = 0;
                    bits = 0;
                    //===//
                    break;
                case FLAGS:
                    //=== NEEDBITS(16); */
                    while (bits < 16) {
                        if (have === 0) { break inf_leave; }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    //===//
                    state.flags = hold;
                    if ((state.flags & 0xff) !== Z_DEFLATED$2) {
                        strm.msg = 'unknown compression method';
                        state.mode = BAD$1;
                        break;
                    }
                    if (state.flags & 0xe000) {
                        strm.msg = 'unknown header flags set';
                        state.mode = BAD$1;
                        break;
                    }
                    if (state.head) {
                        state.head.text = ((hold >> 8) & 1);
                    }
                    if (state.flags & 0x0200) {
                        //=== CRC2(state.check, hold);
                        hbuf[0] = hold & 0xff;
                        hbuf[1] = (hold >>> 8) & 0xff;
                        state.check = crc32_1(state.check, hbuf, 2, 0);
                        //===//
                    }
                    //=== INITBITS();
                    hold = 0;
                    bits = 0;
                    //===//
                    state.mode = TIME;
                /* falls through */
                case TIME:
                    //=== NEEDBITS(32); */
                    while (bits < 32) {
                        if (have === 0) { break inf_leave; }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    //===//
                    if (state.head) {
                        state.head.time = hold;
                    }
                    if (state.flags & 0x0200) {
                        //=== CRC4(state.check, hold)
                        hbuf[0] = hold & 0xff;
                        hbuf[1] = (hold >>> 8) & 0xff;
                        hbuf[2] = (hold >>> 16) & 0xff;
                        hbuf[3] = (hold >>> 24) & 0xff;
                        state.check = crc32_1(state.check, hbuf, 4, 0);
                        //===
                    }
                    //=== INITBITS();
                    hold = 0;
                    bits = 0;
                    //===//
                    state.mode = OS;
                /* falls through */
                case OS:
                    //=== NEEDBITS(16); */
                    while (bits < 16) {
                        if (have === 0) { break inf_leave; }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    //===//
                    if (state.head) {
                        state.head.xflags = (hold & 0xff);
                        state.head.os = (hold >> 8);
                    }
                    if (state.flags & 0x0200) {
                        //=== CRC2(state.check, hold);
                        hbuf[0] = hold & 0xff;
                        hbuf[1] = (hold >>> 8) & 0xff;
                        state.check = crc32_1(state.check, hbuf, 2, 0);
                        //===//
                    }
                    //=== INITBITS();
                    hold = 0;
                    bits = 0;
                    //===//
                    state.mode = EXLEN;
                /* falls through */
                case EXLEN:
                    if (state.flags & 0x0400) {
                        //=== NEEDBITS(16); */
                        while (bits < 16) {
                            if (have === 0) { break inf_leave; }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        state.length = hold;
                        if (state.head) {
                            state.head.extra_len = hold;
                        }
                        if (state.flags & 0x0200) {
                            //=== CRC2(state.check, hold);
                            hbuf[0] = hold & 0xff;
                            hbuf[1] = (hold >>> 8) & 0xff;
                            state.check = crc32_1(state.check, hbuf, 2, 0);
                            //===//
                        }
                        //=== INITBITS();
                        hold = 0;
                        bits = 0;
                        //===//
                    }
                    else if (state.head) {
                        state.head.extra = null/*Z_NULL*/;
                    }
                    state.mode = EXTRA;
                /* falls through */
                case EXTRA:
                    if (state.flags & 0x0400) {
                        copy = state.length;
                        if (copy > have) { copy = have; }
                        if (copy) {
                            if (state.head) {
                                len = state.head.extra_len - state.length;
                                if (!state.head.extra) {
                                    // Use untyped array for more convenient processing later
                                    state.head.extra = new Array(state.head.extra_len);
                                }
                                common.arraySet(
                                    state.head.extra,
                                    input,
                                    next,
                                    // extra field is limited to 65536 bytes
                                    // - no need for additional size check
                                    copy,
                                    /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                                    len
                                );
                                //zmemcpy(state.head.extra + len, next,
                                //        len + copy > state.head.extra_max ?
                                //        state.head.extra_max - len : copy);
                            }
                            if (state.flags & 0x0200) {
                                state.check = crc32_1(state.check, input, copy, next);
                            }
                            have -= copy;
                            next += copy;
                            state.length -= copy;
                        }
                        if (state.length) { break inf_leave; }
                    }
                    state.length = 0;
                    state.mode = NAME;
                /* falls through */
                case NAME:
                    if (state.flags & 0x0800) {
                        if (have === 0) { break inf_leave; }
                        copy = 0;
                        do {
                            // TODO: 2 or 1 bytes?
                            len = input[next + copy++];
                            /* use constant limit because in js we should not preallocate memory */
                            if (state.head && len &&
                                (state.length < 65536 /*state.head.name_max*/)) {
                                state.head.name += String.fromCharCode(len);
                            }
                        } while (len && copy < have);

                        if (state.flags & 0x0200) {
                            state.check = crc32_1(state.check, input, copy, next);
                        }
                        have -= copy;
                        next += copy;
                        if (len) { break inf_leave; }
                    }
                    else if (state.head) {
                        state.head.name = null;
                    }
                    state.length = 0;
                    state.mode = COMMENT;
                /* falls through */
                case COMMENT:
                    if (state.flags & 0x1000) {
                        if (have === 0) { break inf_leave; }
                        copy = 0;
                        do {
                            len = input[next + copy++];
                            /* use constant limit because in js we should not preallocate memory */
                            if (state.head && len &&
                                (state.length < 65536 /*state.head.comm_max*/)) {
                                state.head.comment += String.fromCharCode(len);
                            }
                        } while (len && copy < have);
                        if (state.flags & 0x0200) {
                            state.check = crc32_1(state.check, input, copy, next);
                        }
                        have -= copy;
                        next += copy;
                        if (len) { break inf_leave; }
                    }
                    else if (state.head) {
                        state.head.comment = null;
                    }
                    state.mode = HCRC;
                /* falls through */
                case HCRC:
                    if (state.flags & 0x0200) {
                        //=== NEEDBITS(16); */
                        while (bits < 16) {
                            if (have === 0) { break inf_leave; }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        if (hold !== (state.check & 0xffff)) {
                            strm.msg = 'header crc mismatch';
                            state.mode = BAD$1;
                            break;
                        }
                        //=== INITBITS();
                        hold = 0;
                        bits = 0;
                        //===//
                    }
                    if (state.head) {
                        state.head.hcrc = ((state.flags >> 9) & 1);
                        state.head.done = true;
                    }
                    strm.adler = state.check = 0;
                    state.mode = TYPE$1;
                    break;
                case DICTID:
                    //=== NEEDBITS(32); */
                    while (bits < 32) {
                        if (have === 0) { break inf_leave; }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    //===//
                    strm.adler = state.check = zswap32(hold);
                    //=== INITBITS();
                    hold = 0;
                    bits = 0;
                    //===//
                    state.mode = DICT;
                /* falls through */
                case DICT:
                    if (state.havedict === 0) {
                        //--- RESTORE() ---
                        strm.next_out = put;
                        strm.avail_out = left;
                        strm.next_in = next;
                        strm.avail_in = have;
                        state.hold = hold;
                        state.bits = bits;
                        //---
                        return Z_NEED_DICT;
                    }
                    strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
                    state.mode = TYPE$1;
                /* falls through */
                case TYPE$1:
                    if (flush === Z_BLOCK$1 || flush === Z_TREES) { break inf_leave; }
                /* falls through */
                case TYPEDO:
                    if (state.last) {
                        //--- BYTEBITS() ---//
                        hold >>>= bits & 7;
                        bits -= bits & 7;
                        //---//
                        state.mode = CHECK;
                        break;
                    }
                    //=== NEEDBITS(3); */
                    while (bits < 3) {
                        if (have === 0) { break inf_leave; }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    //===//
                    state.last = (hold & 0x01)/*BITS(1)*/;
                    //--- DROPBITS(1) ---//
                    hold >>>= 1;
                    bits -= 1;
                    //---//

                    switch ((hold & 0x03)/*BITS(2)*/) {
                        case 0:                             /* stored block */
                            //Tracev((stderr, "inflate:     stored block%s\n",
                            //        state.last ? " (last)" : ""));
                            state.mode = STORED;
                            break;
                        case 1:                             /* fixed block */
                            fixedtables(state);
                            //Tracev((stderr, "inflate:     fixed codes block%s\n",
                            //        state.last ? " (last)" : ""));
                            state.mode = LEN_;             /* decode codes */
                            if (flush === Z_TREES) {
                                //--- DROPBITS(2) ---//
                                hold >>>= 2;
                                bits -= 2;
                                //---//
                                break inf_leave;
                            }
                            break;
                        case 2:                             /* dynamic block */
                            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
                            //        state.last ? " (last)" : ""));
                            state.mode = TABLE;
                            break;
                        case 3:
                            strm.msg = 'invalid block type';
                            state.mode = BAD$1;
                    }
                    //--- DROPBITS(2) ---//
                    hold >>>= 2;
                    bits -= 2;
                    //---//
                    break;
                case STORED:
                    //--- BYTEBITS() ---// /* go to byte boundary */
                    hold >>>= bits & 7;
                    bits -= bits & 7;
                    //---//
                    //=== NEEDBITS(32); */
                    while (bits < 32) {
                        if (have === 0) { break inf_leave; }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    //===//
                    if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
                        strm.msg = 'invalid stored block lengths';
                        state.mode = BAD$1;
                        break;
                    }
                    state.length = hold & 0xffff;
                    //Tracev((stderr, "inflate:       stored length %u\n",
                    //        state.length));
                    //=== INITBITS();
                    hold = 0;
                    bits = 0;
                    //===//
                    state.mode = COPY_;
                    if (flush === Z_TREES) { break inf_leave; }
                /* falls through */
                case COPY_:
                    state.mode = COPY;
                /* falls through */
                case COPY:
                    copy = state.length;
                    if (copy) {
                        if (copy > have) { copy = have; }
                        if (copy > left) { copy = left; }
                        if (copy === 0) { break inf_leave; }
                        //--- zmemcpy(put, next, copy); ---
                        common.arraySet(output, input, next, copy, put);
                        //---//
                        have -= copy;
                        next += copy;
                        left -= copy;
                        put += copy;
                        state.length -= copy;
                        break;
                    }
                    //Tracev((stderr, "inflate:       stored end\n"));
                    state.mode = TYPE$1;
                    break;
                case TABLE:
                    //=== NEEDBITS(14); */
                    while (bits < 14) {
                        if (have === 0) { break inf_leave; }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    //===//
                    state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
                    //--- DROPBITS(5) ---//
                    hold >>>= 5;
                    bits -= 5;
                    //---//
                    state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
                    //--- DROPBITS(5) ---//
                    hold >>>= 5;
                    bits -= 5;
                    //---//
                    state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
                    //--- DROPBITS(4) ---//
                    hold >>>= 4;
                    bits -= 4;
                    //---//
                    //#ifndef PKZIP_BUG_WORKAROUND
                    if (state.nlen > 286 || state.ndist > 30) {
                        strm.msg = 'too many length or distance symbols';
                        state.mode = BAD$1;
                        break;
                    }
                    //#endif
                    //Tracev((stderr, "inflate:       table sizes ok\n"));
                    state.have = 0;
                    state.mode = LENLENS;
                /* falls through */
                case LENLENS:
                    while (state.have < state.ncode) {
                        //=== NEEDBITS(3);
                        while (bits < 3) {
                            if (have === 0) { break inf_leave; }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
                        //--- DROPBITS(3) ---//
                        hold >>>= 3;
                        bits -= 3;
                        //---//
                    }
                    while (state.have < 19) {
                        state.lens[order[state.have++]] = 0;
                    }
                    // We have separate tables & no pointers. 2 commented lines below not needed.
                    //state.next = state.codes;
                    //state.lencode = state.next;
                    // Switch to use dynamic table
                    state.lencode = state.lendyn;
                    state.lenbits = 7;

                    opts = { bits: state.lenbits };
                    ret = inftrees(CODES$1, state.lens, 0, 19, state.lencode, 0, state.work, opts);
                    state.lenbits = opts.bits;

                    if (ret) {
                        strm.msg = 'invalid code lengths set';
                        state.mode = BAD$1;
                        break;
                    }
                    //Tracev((stderr, "inflate:       code lengths ok\n"));
                    state.have = 0;
                    state.mode = CODELENS;
                /* falls through */
                case CODELENS:
                    while (state.have < state.nlen + state.ndist) {
                        for (; ;) {
                            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
                            here_bits = here >>> 24;
                            here_op = (here >>> 16) & 0xff;
                            here_val = here & 0xffff;

                            if ((here_bits) <= bits) { break; }
                            //--- PULLBYTE() ---//
                            if (have === 0) { break inf_leave; }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                            //---//
                        }
                        if (here_val < 16) {
                            //--- DROPBITS(here.bits) ---//
                            hold >>>= here_bits;
                            bits -= here_bits;
                            //---//
                            state.lens[state.have++] = here_val;
                        }
                        else {
                            if (here_val === 16) {
                                //=== NEEDBITS(here.bits + 2);
                                n = here_bits + 2;
                                while (bits < n) {
                                    if (have === 0) { break inf_leave; }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                //===//
                                //--- DROPBITS(here.bits) ---//
                                hold >>>= here_bits;
                                bits -= here_bits;
                                //---//
                                if (state.have === 0) {
                                    strm.msg = 'invalid bit length repeat';
                                    state.mode = BAD$1;
                                    break;
                                }
                                len = state.lens[state.have - 1];
                                copy = 3 + (hold & 0x03);//BITS(2);
                                //--- DROPBITS(2) ---//
                                hold >>>= 2;
                                bits -= 2;
                                //---//
                            }
                            else if (here_val === 17) {
                                //=== NEEDBITS(here.bits + 3);
                                n = here_bits + 3;
                                while (bits < n) {
                                    if (have === 0) { break inf_leave; }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                //===//
                                //--- DROPBITS(here.bits) ---//
                                hold >>>= here_bits;
                                bits -= here_bits;
                                //---//
                                len = 0;
                                copy = 3 + (hold & 0x07);//BITS(3);
                                //--- DROPBITS(3) ---//
                                hold >>>= 3;
                                bits -= 3;
                                //---//
                            }
                            else {
                                //=== NEEDBITS(here.bits + 7);
                                n = here_bits + 7;
                                while (bits < n) {
                                    if (have === 0) { break inf_leave; }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                //===//
                                //--- DROPBITS(here.bits) ---//
                                hold >>>= here_bits;
                                bits -= here_bits;
                                //---//
                                len = 0;
                                copy = 11 + (hold & 0x7f);//BITS(7);
                                //--- DROPBITS(7) ---//
                                hold >>>= 7;
                                bits -= 7;
                                //---//
                            }
                            if (state.have + copy > state.nlen + state.ndist) {
                                strm.msg = 'invalid bit length repeat';
                                state.mode = BAD$1;
                                break;
                            }
                            while (copy--) {
                                state.lens[state.have++] = len;
                            }
                        }
                    }

                    /* handle error breaks in while */
                    if (state.mode === BAD$1) { break; }

                    /* check for end-of-block code (better have one) */
                    if (state.lens[256] === 0) {
                        strm.msg = 'invalid code -- missing end-of-block';
                        state.mode = BAD$1;
                        break;
                    }

                    /* build code tables -- note: do not change the lenbits or distbits
                       values here (9 and 6) without reading the comments in inftrees.h
                       concerning the ENOUGH constants, which depend on those values */
                    state.lenbits = 9;

                    opts = { bits: state.lenbits };
                    ret = inftrees(LENS$1, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
                    // We have separate tables & no pointers. 2 commented lines below not needed.
                    // state.next_index = opts.table_index;
                    state.lenbits = opts.bits;
                    // state.lencode = state.next;

                    if (ret) {
                        strm.msg = 'invalid literal/lengths set';
                        state.mode = BAD$1;
                        break;
                    }

                    state.distbits = 6;
                    //state.distcode.copy(state.codes);
                    // Switch to use dynamic table
                    state.distcode = state.distdyn;
                    opts = { bits: state.distbits };
                    ret = inftrees(DISTS$1, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
                    // We have separate tables & no pointers. 2 commented lines below not needed.
                    // state.next_index = opts.table_index;
                    state.distbits = opts.bits;
                    // state.distcode = state.next;

                    if (ret) {
                        strm.msg = 'invalid distances set';
                        state.mode = BAD$1;
                        break;
                    }
                    //Tracev((stderr, 'inflate:       codes ok\n'));
                    state.mode = LEN_;
                    if (flush === Z_TREES) { break inf_leave; }
                /* falls through */
                case LEN_:
                    state.mode = LEN;
                /* falls through */
                case LEN:
                    if (have >= 6 && left >= 258) {
                        //--- RESTORE() ---
                        strm.next_out = put;
                        strm.avail_out = left;
                        strm.next_in = next;
                        strm.avail_in = have;
                        state.hold = hold;
                        state.bits = bits;
                        //---
                        inffast(strm, _out);
                        //--- LOAD() ---
                        put = strm.next_out;
                        output = strm.output;
                        left = strm.avail_out;
                        next = strm.next_in;
                        input = strm.input;
                        have = strm.avail_in;
                        hold = state.hold;
                        bits = state.bits;
                        //---

                        if (state.mode === TYPE$1) {
                            state.back = -1;
                        }
                        break;
                    }
                    state.back = 0;
                    for (; ;) {
                        here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
                        here_bits = here >>> 24;
                        here_op = (here >>> 16) & 0xff;
                        here_val = here & 0xffff;

                        if (here_bits <= bits) { break; }
                        //--- PULLBYTE() ---//
                        if (have === 0) { break inf_leave; }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                        //---//
                    }
                    if (here_op && (here_op & 0xf0) === 0) {
                        last_bits = here_bits;
                        last_op = here_op;
                        last_val = here_val;
                        for (; ;) {
                            here = state.lencode[last_val +
                                ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
                            here_bits = here >>> 24;
                            here_op = (here >>> 16) & 0xff;
                            here_val = here & 0xffff;

                            if ((last_bits + here_bits) <= bits) { break; }
                            //--- PULLBYTE() ---//
                            if (have === 0) { break inf_leave; }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                            //---//
                        }
                        //--- DROPBITS(last.bits) ---//
                        hold >>>= last_bits;
                        bits -= last_bits;
                        //---//
                        state.back += last_bits;
                    }
                    //--- DROPBITS(here.bits) ---//
                    hold >>>= here_bits;
                    bits -= here_bits;
                    //---//
                    state.back += here_bits;
                    state.length = here_val;
                    if (here_op === 0) {
                        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
                        //        "inflate:         literal '%c'\n" :
                        //        "inflate:         literal 0x%02x\n", here.val));
                        state.mode = LIT;
                        break;
                    }
                    if (here_op & 32) {
                        //Tracevv((stderr, "inflate:         end of block\n"));
                        state.back = -1;
                        state.mode = TYPE$1;
                        break;
                    }
                    if (here_op & 64) {
                        strm.msg = 'invalid literal/length code';
                        state.mode = BAD$1;
                        break;
                    }
                    state.extra = here_op & 15;
                    state.mode = LENEXT;
                /* falls through */
                case LENEXT:
                    if (state.extra) {
                        //=== NEEDBITS(state.extra);
                        n = state.extra;
                        while (bits < n) {
                            if (have === 0) { break inf_leave; }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
                        //--- DROPBITS(state.extra) ---//
                        hold >>>= state.extra;
                        bits -= state.extra;
                        //---//
                        state.back += state.extra;
                    }
                    //Tracevv((stderr, "inflate:         length %u\n", state.length));
                    state.was = state.length;
                    state.mode = DIST;
                /* falls through */
                case DIST:
                    for (; ;) {
                        here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
                        here_bits = here >>> 24;
                        here_op = (here >>> 16) & 0xff;
                        here_val = here & 0xffff;

                        if ((here_bits) <= bits) { break; }
                        //--- PULLBYTE() ---//
                        if (have === 0) { break inf_leave; }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                        //---//
                    }
                    if ((here_op & 0xf0) === 0) {
                        last_bits = here_bits;
                        last_op = here_op;
                        last_val = here_val;
                        for (; ;) {
                            here = state.distcode[last_val +
                                ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
                            here_bits = here >>> 24;
                            here_op = (here >>> 16) & 0xff;
                            here_val = here & 0xffff;

                            if ((last_bits + here_bits) <= bits) { break; }
                            //--- PULLBYTE() ---//
                            if (have === 0) { break inf_leave; }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                            //---//
                        }
                        //--- DROPBITS(last.bits) ---//
                        hold >>>= last_bits;
                        bits -= last_bits;
                        //---//
                        state.back += last_bits;
                    }
                    //--- DROPBITS(here.bits) ---//
                    hold >>>= here_bits;
                    bits -= here_bits;
                    //---//
                    state.back += here_bits;
                    if (here_op & 64) {
                        strm.msg = 'invalid distance code';
                        state.mode = BAD$1;
                        break;
                    }
                    state.offset = here_val;
                    state.extra = (here_op) & 15;
                    state.mode = DISTEXT;
                /* falls through */
                case DISTEXT:
                    if (state.extra) {
                        //=== NEEDBITS(state.extra);
                        n = state.extra;
                        while (bits < n) {
                            if (have === 0) { break inf_leave; }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
                        //--- DROPBITS(state.extra) ---//
                        hold >>>= state.extra;
                        bits -= state.extra;
                        //---//
                        state.back += state.extra;
                    }
                    //#ifdef INFLATE_STRICT
                    if (state.offset > state.dmax) {
                        strm.msg = 'invalid distance too far back';
                        state.mode = BAD$1;
                        break;
                    }
                    //#endif
                    //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
                    state.mode = MATCH;
                /* falls through */
                case MATCH:
                    if (left === 0) { break inf_leave; }
                    copy = _out - left;
                    if (state.offset > copy) {         /* copy from window */
                        copy = state.offset - copy;
                        if (copy > state.whave) {
                            if (state.sane) {
                                strm.msg = 'invalid distance too far back';
                                state.mode = BAD$1;
                                break;
                            }
                            // (!) This block is disabled in zlib defaults,
                            // don't enable it for binary compatibility
                            //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
                            //          Trace((stderr, "inflate.c too far\n"));
                            //          copy -= state.whave;
                            //          if (copy > state.length) { copy = state.length; }
                            //          if (copy > left) { copy = left; }
                            //          left -= copy;
                            //          state.length -= copy;
                            //          do {
                            //            output[put++] = 0;
                            //          } while (--copy);
                            //          if (state.length === 0) { state.mode = LEN; }
                            //          break;
                            //#endif
                        }
                        if (copy > state.wnext) {
                            copy -= state.wnext;
                            from = state.wsize - copy;
                        }
                        else {
                            from = state.wnext - copy;
                        }
                        if (copy > state.length) { copy = state.length; }
                        from_source = state.window;
                    }
                    else {                              /* copy from output */
                        from_source = output;
                        from = put - state.offset;
                        copy = state.length;
                    }
                    if (copy > left) { copy = left; }
                    left -= copy;
                    state.length -= copy;
                    do {
                        output[put++] = from_source[from++];
                    } while (--copy);
                    if (state.length === 0) { state.mode = LEN; }
                    break;
                case LIT:
                    if (left === 0) { break inf_leave; }
                    output[put++] = state.length;
                    left--;
                    state.mode = LEN;
                    break;
                case CHECK:
                    if (state.wrap) {
                        //=== NEEDBITS(32);
                        while (bits < 32) {
                            if (have === 0) { break inf_leave; }
                            have--;
                            // Use '|' instead of '+' to make sure that result is signed
                            hold |= input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        _out -= left;
                        strm.total_out += _out;
                        state.total += _out;
                        if (_out) {
                            strm.adler = state.check =
                                /*UPDATE(state.check, put - _out, _out);*/
                                (state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out));

                        }
                        _out = left;
                        // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
                        if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                            strm.msg = 'incorrect data check';
                            state.mode = BAD$1;
                            break;
                        }
                        //=== INITBITS();
                        hold = 0;
                        bits = 0;
                        //===//
                        //Tracev((stderr, "inflate:   check matches trailer\n"));
                    }
                    state.mode = LENGTH;
                /* falls through */
                case LENGTH:
                    if (state.wrap && state.flags) {
                        //=== NEEDBITS(32);
                        while (bits < 32) {
                            if (have === 0) { break inf_leave; }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        if (hold !== (state.total & 0xffffffff)) {
                            strm.msg = 'incorrect length check';
                            state.mode = BAD$1;
                            break;
                        }
                        //=== INITBITS();
                        hold = 0;
                        bits = 0;
                        //===//
                        //Tracev((stderr, "inflate:   length matches trailer\n"));
                    }
                    state.mode = DONE;
                /* falls through */
                case DONE:
                    ret = Z_STREAM_END$2;
                    break inf_leave;
                case BAD$1:
                    ret = Z_DATA_ERROR$1;
                    break inf_leave;
                case MEM:
                    return Z_MEM_ERROR;
                case SYNC:
                /* falls through */
                default:
                    return Z_STREAM_ERROR$1;
            }
        }

        // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

        /*
           Return from inflate(), updating the total counts and the check value.
           If there was no progress during the inflate() call, return a buffer
           error.  Call updatewindow() to create and/or update the window state.
           Note: a memory error from inflate() is non-recoverable.
         */

        //--- RESTORE() ---
        strm.next_out = put;
        strm.avail_out = left;
        strm.next_in = next;
        strm.avail_in = have;
        state.hold = hold;
        state.bits = bits;
        //---

        if (state.wsize || (_out !== strm.avail_out && state.mode < BAD$1 &&
            (state.mode < CHECK || flush !== Z_FINISH$2))) {
            if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
                state.mode = MEM;
                return Z_MEM_ERROR;
            }
        }
        _in -= strm.avail_in;
        _out -= strm.avail_out;
        strm.total_in += _in;
        strm.total_out += _out;
        state.total += _out;
        if (state.wrap && _out) {
            strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
                (state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out));
        }
        strm.data_type = state.bits + (state.last ? 64 : 0) +
            (state.mode === TYPE$1 ? 128 : 0) +
            (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
        if (((_in === 0 && _out === 0) || flush === Z_FINISH$2) && ret === Z_OK$2) {
            ret = Z_BUF_ERROR$1;
        }
        return ret;
    }

    function inflateEnd(strm) {

        if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
            return Z_STREAM_ERROR$1;
        }

        var state = strm.state;
        if (state.window) {
            state.window = null;
        }
        strm.state = null;
        return Z_OK$2;
    }

    function inflateGetHeader(strm, head) {
        var state;

        /* check state */
        if (!strm || !strm.state) { return Z_STREAM_ERROR$1; }
        state = strm.state;
        if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR$1; }

        /* save header structure */
        state.head = head;
        head.done = false;
        return Z_OK$2;
    }

    function inflateSetDictionary(strm, dictionary) {
        var dictLength = dictionary.length;

        var state;
        var dictid;
        var ret;

        /* check state */
        if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR$1; }
        state = strm.state;

        if (state.wrap !== 0 && state.mode !== DICT) {
            return Z_STREAM_ERROR$1;
        }

        /* check for correct dictionary identifier */
        if (state.mode === DICT) {
            dictid = 1; /* adler32(0, null, 0)*/
            /* dictid = adler32(dictid, dictionary, dictLength); */
            dictid = adler32_1(dictid, dictionary, dictLength, 0);
            if (dictid !== state.check) {
                return Z_DATA_ERROR$1;
            }
        }
        /* copy dictionary to window using updatewindow(), which will amend the
         existing dictionary if appropriate */
        ret = updatewindow(strm, dictionary, dictLength, dictLength);
        if (ret) {
            state.mode = MEM;
            return Z_MEM_ERROR;
        }
        state.havedict = 1;
        // Tracev((stderr, "inflate:   dictionary set\n"));
        return Z_OK$2;
    }

    var inflateReset_1 = inflateReset;
    var inflateReset2_1 = inflateReset2;
    var inflateResetKeep_1 = inflateResetKeep;
    var inflateInit_1 = inflateInit;
    var inflateInit2_1 = inflateInit2;
    var inflate_2 = inflate;
    var inflateEnd_1 = inflateEnd;
    var inflateGetHeader_1 = inflateGetHeader;
    var inflateSetDictionary_1 = inflateSetDictionary;
    var inflateInfo = 'pako inflate (from Nodeca project)';

    /* Not implemented
    exports.inflateCopy = inflateCopy;
    exports.inflateGetDictionary = inflateGetDictionary;
    exports.inflateMark = inflateMark;
    exports.inflatePrime = inflatePrime;
    exports.inflateSync = inflateSync;
    exports.inflateSyncPoint = inflateSyncPoint;
    exports.inflateUndermine = inflateUndermine;
    */

    var inflate_1 = {
        inflateReset: inflateReset_1,
        inflateReset2: inflateReset2_1,
        inflateResetKeep: inflateResetKeep_1,
        inflateInit: inflateInit_1,
        inflateInit2: inflateInit2_1,
        inflate: inflate_2,
        inflateEnd: inflateEnd_1,
        inflateGetHeader: inflateGetHeader_1,
        inflateSetDictionary: inflateSetDictionary_1,
        inflateInfo: inflateInfo
    };

    // (C) 1995-2013 Jean-loup Gailly and Mark Adler
    // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
    //
    // This software is provided 'as-is', without any express or implied
    // warranty. In no event will the authors be held liable for any damages
    // arising from the use of this software.
    //
    // Permission is granted to anyone to use this software for any purpose,
    // including commercial applications, and to alter it and redistribute it
    // freely, subject to the following restrictions:
    //
    // 1. The origin of this software must not be misrepresented; you must not
    //   claim that you wrote the original software. If you use this software
    //   in a product, an acknowledgment in the product documentation would be
    //   appreciated but is not required.
    // 2. Altered source versions must be plainly marked as such, and must not be
    //   misrepresented as being the original software.
    // 3. This notice may not be removed or altered from any source distribution.

    var constants = {

        /* Allowed flush values; see deflate() and inflate() below for details */
        Z_NO_FLUSH: 0,
        Z_PARTIAL_FLUSH: 1,
        Z_SYNC_FLUSH: 2,
        Z_FULL_FLUSH: 3,
        Z_FINISH: 4,
        Z_BLOCK: 5,
        Z_TREES: 6,

        /* Return codes for the compression/decompression functions. Negative values
        * are errors, positive values are used for special but normal events.
        */
        Z_OK: 0,
        Z_STREAM_END: 1,
        Z_NEED_DICT: 2,
        Z_ERRNO: -1,
        Z_STREAM_ERROR: -2,
        Z_DATA_ERROR: -3,
        //Z_MEM_ERROR:     -4,
        Z_BUF_ERROR: -5,
        //Z_VERSION_ERROR: -6,

        /* compression levels */
        Z_NO_COMPRESSION: 0,
        Z_BEST_SPEED: 1,
        Z_BEST_COMPRESSION: 9,
        Z_DEFAULT_COMPRESSION: -1,


        Z_FILTERED: 1,
        Z_HUFFMAN_ONLY: 2,
        Z_RLE: 3,
        Z_FIXED: 4,
        Z_DEFAULT_STRATEGY: 0,

        /* Possible values of the data_type field (though see inflate()) */
        Z_BINARY: 0,
        Z_TEXT: 1,
        //Z_ASCII:                1, // = Z_TEXT (deprecated)
        Z_UNKNOWN: 2,

        /* The deflate compression method */
        Z_DEFLATED: 8
        //Z_NULL:                 null // Use -1 or null inline, depending on var type
    };

    // (C) 1995-2013 Jean-loup Gailly and Mark Adler
    // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
    //
    // This software is provided 'as-is', without any express or implied
    // warranty. In no event will the authors be held liable for any damages
    // arising from the use of this software.
    //
    // Permission is granted to anyone to use this software for any purpose,
    // including commercial applications, and to alter it and redistribute it
    // freely, subject to the following restrictions:
    //
    // 1. The origin of this software must not be misrepresented; you must not
    //   claim that you wrote the original software. If you use this software
    //   in a product, an acknowledgment in the product documentation would be
    //   appreciated but is not required.
    // 2. Altered source versions must be plainly marked as such, and must not be
    //   misrepresented as being the original software.
    // 3. This notice may not be removed or altered from any source distribution.

    function GZheader() {
        /* true if compressed data believed to be text */
        this.text = 0;
        /* modification time */
        this.time = 0;
        /* extra flags (not used when writing a gzip file) */
        this.xflags = 0;
        /* operating system */
        this.os = 0;
        /* pointer to extra field or Z_NULL if none */
        this.extra = null;
        /* extra field length (valid if extra != Z_NULL) */
        this.extra_len = 0; // Actually, we don't need it in JS,
        // but leave for few code modifications

        //
        // Setup limits is not necessary because in js we should not preallocate memory
        // for inflate use constant limit in 65536 bytes
        //

        /* space at extra (only when reading header) */
        // this.extra_max  = 0;
        /* pointer to zero-terminated file name or Z_NULL */
        this.name = '';
        /* space at name (only when reading header) */
        // this.name_max   = 0;
        /* pointer to zero-terminated comment or Z_NULL */
        this.comment = '';
        /* space at comment (only when reading header) */
        // this.comm_max   = 0;
        /* true if there was or will be a header crc */
        this.hcrc = 0;
        /* true when done reading gzip header (not used when writing a gzip file) */
        this.done = false;
    }

    var gzheader = GZheader;

    var toString$1 = Object.prototype.toString;

    /**
     * class Inflate
     *
     * Generic JS-style wrapper for zlib calls. If you don't need
     * streaming behaviour - use more simple functions: [[inflate]]
     * and [[inflateRaw]].
     **/

    /* internal
     * inflate.chunks -> Array
     *
     * Chunks of output data, if [[Inflate#onData]] not overridden.
     **/

    /**
     * Inflate.result -> Uint8Array|Array|String
     *
     * Uncompressed result, generated by default [[Inflate#onData]]
     * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
     * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
     * push a chunk with explicit flush (call [[Inflate#push]] with
     * `Z_SYNC_FLUSH` param).
     **/

    /**
     * Inflate.err -> Number
     *
     * Error code after inflate finished. 0 (Z_OK) on success.
     * Should be checked if broken data possible.
     **/

    /**
     * Inflate.msg -> String
     *
     * Error message, if [[Inflate.err]] != 0
     **/


    /**
     * new Inflate(options)
     * - options (Object): zlib inflate options.
     *
     * Creates new inflator instance with specified params. Throws exception
     * on bad params. Supported options:
     *
     * - `windowBits`
     * - `dictionary`
     *
     * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
     * for more information on these.
     *
     * Additional options, for internal needs:
     *
     * - `chunkSize` - size of generated data chunks (16K by default)
     * - `raw` (Boolean) - do raw inflate
     * - `to` (String) - if equal to 'string', then result will be converted
     *   from utf8 to utf16 (javascript) string. When string output requested,
     *   chunk length can differ from `chunkSize`, depending on content.
     *
     * By default, when no options set, autodetect deflate/gzip data format via
     * wrapper header.
     *
     * ##### Example:
     *
     * ```javascript
     * var pako = require('pako')
     *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
     *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
     *
     * var inflate = new pako.Inflate({ level: 3});
     *
     * inflate.push(chunk1, false);
     * inflate.push(chunk2, true);  // true -> last chunk
     *
     * if (inflate.err) { throw new Error(inflate.err); }
     *
     * console.log(inflate.result);
     * ```
     **/
    function Inflate(options) {
        if (!(this instanceof Inflate)) return new Inflate(options);

        this.options = common.assign({
            chunkSize: 16384,
            windowBits: 0,
            to: ''
        }, options || {});

        var opt = this.options;

        // Force window size for `raw` data, if not set directly,
        // because we have no header for autodetect.
        if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
            opt.windowBits = -opt.windowBits;
            if (opt.windowBits === 0) { opt.windowBits = -15; }
        }

        // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
        if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
            !(options && options.windowBits)) {
            opt.windowBits += 32;
        }

        // Gzip header has no info about windows size, we can do autodetect only
        // for deflate. So, if window size not set, force it to max when gzip possible
        if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
            // bit 3 (16) -> gzipped data
            // bit 4 (32) -> autodetect gzip/deflate
            if ((opt.windowBits & 15) === 0) {
                opt.windowBits |= 15;
            }
        }

        this.err = 0;      // error code, if happens (0 = Z_OK)
        this.msg = '';     // error message
        this.ended = false;  // used to avoid multiple onEnd() calls
        this.chunks = [];     // chunks of compressed data

        this.strm = new zstream();
        this.strm.avail_out = 0;

        var status = inflate_1.inflateInit2(
            this.strm,
            opt.windowBits
        );

        if (status !== constants.Z_OK) {
            throw new Error(messages[status]);
        }

        this.header = new gzheader();

        inflate_1.inflateGetHeader(this.strm, this.header);
    }

    /**
     * Inflate#push(data[, mode]) -> Boolean
     * - data (Uint8Array|Array|ArrayBuffer|String): input data
     * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
     *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
     *
     * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
     * new output chunks. Returns `true` on success. The last data block must have
     * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
     * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
     * can use mode Z_SYNC_FLUSH, keeping the decompression context.
     *
     * On fail call [[Inflate#onEnd]] with error code and return false.
     *
     * We strongly recommend to use `Uint8Array` on input for best speed (output
     * format is detected automatically). Also, don't skip last param and always
     * use the same type in your code (boolean or number). That will improve JS speed.
     *
     * For regular `Array`-s make sure all elements are [0..255].
     *
     * ##### Example
     *
     * ```javascript
     * push(chunk, false); // push one of data chunks
     * ...
     * push(chunk, true);  // push last chunk
     * ```
     **/
    Inflate.prototype.push = function (data, mode) {
        var strm = this.strm;
        var chunkSize = this.options.chunkSize;
        var dictionary = this.options.dictionary;
        var status, _mode;
        var next_out_utf8, tail, utf8str;
        var dict;

        // Flag to properly process Z_BUF_ERROR on testing inflate call
        // when we check that all output data was flushed.
        var allowBufError = false;

        if (this.ended) { return false; }
        _mode = (mode === ~~mode) ? mode : ((mode === true) ? constants.Z_FINISH : constants.Z_NO_FLUSH);

        // Convert data if needed
        if (typeof data === 'string') {
            // Only binary strings can be decompressed on practice
            strm.input = strings.binstring2buf(data);
        } else if (toString$1.call(data) === '[object ArrayBuffer]') {
            strm.input = new Uint8Array(data);
        } else {
            strm.input = data;
        }

        strm.next_in = 0;
        strm.avail_in = strm.input.length;

        do {
            if (strm.avail_out === 0) {
                strm.output = new common.Buf8(chunkSize);
                strm.next_out = 0;
                strm.avail_out = chunkSize;
            }

            status = inflate_1.inflate(strm, constants.Z_NO_FLUSH);    /* no bad return value */

            if (status === constants.Z_NEED_DICT && dictionary) {
                // Convert data if needed
                if (typeof dictionary === 'string') {
                    dict = strings.string2buf(dictionary);
                } else if (toString$1.call(dictionary) === '[object ArrayBuffer]') {
                    dict = new Uint8Array(dictionary);
                } else {
                    dict = dictionary;
                }

                status = inflate_1.inflateSetDictionary(this.strm, dict);

            }

            if (status === constants.Z_BUF_ERROR && allowBufError === true) {
                status = constants.Z_OK;
                allowBufError = false;
            }

            if (status !== constants.Z_STREAM_END && status !== constants.Z_OK) {
                this.onEnd(status);
                this.ended = true;
                return false;
            }

            if (strm.next_out) {
                if (strm.avail_out === 0 || status === constants.Z_STREAM_END || (strm.avail_in === 0 && (_mode === constants.Z_FINISH || _mode === constants.Z_SYNC_FLUSH))) {

                    if (this.options.to === 'string') {

                        next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

                        tail = strm.next_out - next_out_utf8;
                        utf8str = strings.buf2string(strm.output, next_out_utf8);

                        // move tail
                        strm.next_out = tail;
                        strm.avail_out = chunkSize - tail;
                        if (tail) { common.arraySet(strm.output, strm.output, next_out_utf8, tail, 0); }

                        this.onData(utf8str);

                    } else {
                        this.onData(common.shrinkBuf(strm.output, strm.next_out));
                    }
                }
            }

            // When no more input data, we should check that internal inflate buffers
            // are flushed. The only way to do it when avail_out = 0 - run one more
            // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
            // Here we set flag to process this error properly.
            //
            // NOTE. Deflate does not return error in this case and does not needs such
            // logic.
            if (strm.avail_in === 0 && strm.avail_out === 0) {
                allowBufError = true;
            }

        } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== constants.Z_STREAM_END);

        if (status === constants.Z_STREAM_END) {
            _mode = constants.Z_FINISH;
        }

        // Finalize on the last chunk.
        if (_mode === constants.Z_FINISH) {
            status = inflate_1.inflateEnd(this.strm);
            this.onEnd(status);
            this.ended = true;
            return status === constants.Z_OK;
        }

        // callback interim results if Z_SYNC_FLUSH.
        if (_mode === constants.Z_SYNC_FLUSH) {
            this.onEnd(constants.Z_OK);
            strm.avail_out = 0;
            return true;
        }

        return true;
    };


    /**
     * Inflate#onData(chunk) -> Void
     * - chunk (Uint8Array|Array|String): output data. Type of array depends
     *   on js engine support. When string output requested, each chunk
     *   will be string.
     *
     * By default, stores data blocks in `chunks[]` property and glue
     * those in `onEnd`. Override this handler, if you need another behaviour.
     **/
    Inflate.prototype.onData = function (chunk) {
        this.chunks.push(chunk);
    };


    /**
     * Inflate#onEnd(status) -> Void
     * - status (Number): inflate status. 0 (Z_OK) on success,
     *   other if not.
     *
     * Called either after you tell inflate that the input stream is
     * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
     * or if an error happened. By default - join collected chunks,
     * free memory and fill `results` / `err` properties.
     **/
    Inflate.prototype.onEnd = function (status) {
        // On success - join
        if (status === constants.Z_OK) {
            if (this.options.to === 'string') {
                // Glue & convert here, until we teach pako to send
                // utf8 aligned strings to onData
                this.result = this.chunks.join('');
            } else {
                this.result = common.flattenChunks(this.chunks);
            }
        }
        this.chunks = [];
        this.err = status;
        this.msg = this.strm.msg;
    };


    /**
     * inflate(data[, options]) -> Uint8Array|Array|String
     * - data (Uint8Array|Array|String): input data to decompress.
     * - options (Object): zlib inflate options.
     *
     * Decompress `data` with inflate/ungzip and `options`. Autodetect
     * format via wrapper header by default. That's why we don't provide
     * separate `ungzip` method.
     *
     * Supported options are:
     *
     * - windowBits
     *
     * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
     * for more information.
     *
     * Sugar (options):
     *
     * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
     *   negative windowBits implicitly.
     * - `to` (String) - if equal to 'string', then result will be converted
     *   from utf8 to utf16 (javascript) string. When string output requested,
     *   chunk length can differ from `chunkSize`, depending on content.
     *
     *
     * ##### Example:
     *
     * ```javascript
     * var pako = require('pako')
     *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
     *   , output;
     *
     * try {
     *   output = pako.inflate(input);
     * } catch (err)
     *   console.log(err);
     * }
     * ```
     **/
    function inflate$1(input, options) {
        var inflator = new Inflate(options);

        inflator.push(input, true);

        // That will never happens, if you don't cheat with options :)
        if (inflator.err) { throw inflator.msg || messages[inflator.err]; }

        return inflator.result;
    }


    /**
     * inflateRaw(data[, options]) -> Uint8Array|Array|String
     * - data (Uint8Array|Array|String): input data to decompress.
     * - options (Object): zlib inflate options.
     *
     * The same as [[inflate]], but creates raw data, without wrapper
     * (header and adler32 crc).
     **/
    function inflateRaw(input, options) {
        options = options || {};
        options.raw = true;
        return inflate$1(input, options);
    }


    /**
     * ungzip(data[, options]) -> Uint8Array|Array|String
     * - data (Uint8Array|Array|String): input data to decompress.
     * - options (Object): zlib inflate options.
     *
     * Just shortcut to [[inflate]], because it autodetects format
     * by header.content. Done for convenience.
     **/


    var Inflate_1 = Inflate;
    var inflate_2$1 = inflate$1;
    var inflateRaw_1 = inflateRaw;
    var ungzip = inflate$1;

    var inflate_1$2 = {
        Inflate: Inflate_1,
        inflate: inflate_2$1,
        inflateRaw: inflateRaw_1,
        ungzip: ungzip
    };

    var assign$1 = common.assign;





    var pako = {};

    assign$1(pako, deflate_1$2, inflate_1$2, constants);

    var _pako_1_0_7_pako = pako;

    var CloudAtlasVisual = function () {
        function CloudAtlasVisual(options) {
            classCallCheck(this, CloudAtlasVisual);

            this.has_load_sdk = false;
            this.visualSearchName = '?ca_show_visual';
            // 设置加载cdn上js和css状态
            this.loadVendorCss = false;
            this.loadVendorJs = false;
            // 判断app_key
            if (options.appKey === undefined || options.appKey === null || options.appKey.constructor !== String) {
                LogProxy_e('Invalid appKey, type = ' + _typeof(options.appKey) + ', value = ' + options.appKey);
                return;
            }
            // 设置当前变量
            this.app_key = options.appKey;
            this.env = options.env || 'INTEGRATION';
            // 设置请求URL
            this.HOST = setVisualEnv(options.env);
            this.init(options);
        }

        CloudAtlasVisual.prototype.init = function init() {
            this.isShowVisual();
        };
        /**
         * 判断是否支持localstorage和sessionStorage
         */


        CloudAtlasVisual.prototype.browserIsSupport = function browserIsSupport() {
            if (_typeof(window.localStorage) === 'object' && window.localStorage.setItem && _typeof(window.sessionStorage) === 'object' && window.sessionStorage.setItem) {
                return true;
            }
            return false;
        };
        /**
         * 展示错误
         * @param {*} obj
         */


        CloudAtlasVisual.prototype.showErrorTip = function showErrorTip(obj) {
            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
                return false;
            }
            var errorTip = document.createElement('div');
            var myText = document.createTextNode(obj.tip);
            errorTip.appendChild(myText);
            errorTip.style.cssText = 'background:#e55b41;border:none;border-radius:8px;color:#fff;font-size:18px;left:50%;margin-left:-300px;padding:15px;position: fixed;text-align: center;top: 0;width:600px;z-index:9999;';
            document.body.appendChild(errorTip);
            setTimeout(function () {
                obj.func && obj.func();
                errorTip.parentNode.removeChild(errorTip);
            }, obj.time);
        };
        /**
         * 判断展示哪种状态
         */


        CloudAtlasVisual.prototype.isShowVisual = function isShowVisual() {
            var url = location.href;
            var me = this;
            function isSupportBrowser() {
                if (!me.browserIsSupport()) {
                    me.showErrorTip({
                        tip: '对不起，可视化埋点暂不支持你当前的浏览器，请升级至ie10以上，推荐使用chrome，firefox，safari等浏览器',
                        time: 10000
                    });
                    return false;
                }
                return true;
            }
            var reg = /ca_show_visual$/;
            if (reg.test(url) && url.split('ca_show_visual').length === 2) {
                if (!isSupportBrowser()) {
                    return false;
                }
                me.enterVisibleMode();
            } else {
                this.enterNormalMode();
            }
        };
        /**
         * 进入可视化状态
         */


        CloudAtlasVisual.prototype.enterVisibleMode = function enterVisibleMode() {
            this.has_load_sdk = true; // 标志是visual模式
            var visual_status = this.app_key + ':/' + this.env + ':/';
            storage.setItem('visual_status', visual_status + this.has_load_sdk);
            var me = this;
            this.currentUrl = location.href.split('?')[0].replace('ca_show_visual', '');
            var data = {
                'app_key': this.app_key,
                'page_identify': this.app_key + this.currentUrl,
                'page_uri': this.currentUrl,
                'page_title': document.title
            };
            var url = this.HOST + 'v0.1/tracking/web/tracking_page';
            UploadUtils_postAsyncRequest(url, JSON.stringify(data), {
                onSuccess: function onSuccess(data) {
                    me.loadFiles();
                },
                onFail: function onFail(message) {
                    try {
                        var error = JSON.parse(message);
                        me.showErrorTip(error.message);
                    } catch (e) {
                        me.showErrorTip({
                            tip: '进入可视化埋点失败',
                            time: 1000
                        });
                    }
                }
            });
        };

        CloudAtlasVisual.prototype.loadFiles = function loadFiles() {
            var loadVendorCss = this.loadVendorCss,
                loadVendorJs = this.loadVendorJs;
            var vendorCss = fileUrl.vendorCss,
                vendorJs = fileUrl.vendorJs;

            var me = this;
            if (!loadVendorCss) {
                loadFile(vendorCss, 'link').then(function (loadVendorCss) {
                    if (!loadVendorCss) {
                        me.showErrorTip({
                            tip: 'vendor.css加载失败',
                            time: 10000
                        });
                    }
                });
            }
            if (!loadVendorJs) {
                loadFile(vendorJs, 'script').then(function (loadVendorJs) {
                    if (!loadVendorJs) {
                        me.showErrorTip({
                            tip: 'vendor.js加载失败',
                            time: 10000
                        });
                    }
                });
            }
        };
        /**
         * 进入正常模式
         */


        CloudAtlasVisual.prototype.enterNormalMode = function enterNormalMode() {
            // 标志是正常模式
            this.has_load_sdk = false;
            var visual_status = this.app_key + ':/' + this.env + ':/';
            storage.setItem('visual_status', visual_status + this.has_load_sdk);
            this.getDeployData();
        };
        /**
         * 获取已部署埋点数据
         */


        CloudAtlasVisual.prototype.getDeployData = function getDeployData() {
            var me = this;
            var appKey = storage.getItem('visual_status').split(':/')[0];
            var HOST = storage.getItem('visual_status').split(':/')[1];
            var url = setVisualEnv(HOST) + ('v0.1/tracking/web/tracking_event/event_list?app_key=' + encodeURIComponent(appKey) + '&is_deployed=true');
            UploadUtils_getAsyncRequest(url, null, {
                onSuccess: function onSuccess(JSONdata) {
                    var data = JSON.parse(JSONdata);
                    if (data && data.content && data.content.length) {
                        me.listenEvents(data.content);
                    }
                },
                onFail: function onFail(message) {
                    try {
                        var error = JSON.parse(message);
                        me.showErrorTip(error.message);
                    } catch (e) {
                        me.showErrorTip({
                            tip: '获取已部署埋点数据失败',
                            time: 1000
                        });
                    }
                }
            });
        };
        /**
         * 普通模式下，监听事件,给已埋点元素绑定监听事件
         * @param {*} data 服务端返回埋点列表数据
         */


        CloudAtlasVisual.prototype.listenEvents = function listenEvents(data) {
            var me = this;
            document.addEventListener('click', function (e) {
                var nodeName = e.target.tagName;
                if (nodeName === 'BODY' || nodeName === 'HTML') {
                    return false;
                }
                var eventDefine = new EventDefine();
                var selector = eventDefine.toAllSelector(e.target);
                var gloablePageData = data.filter(function (t) {
                    return t.type;
                });
                var currentPageData = data.filter(function (t) {
                    return t.edit_url === location.href.split('?')[0].replace('ca_show_visual', '') && !t.type;
                });
                var isGloableTrack = gloablePageData.some(function (item) {
                    var isTrack = me.trackPoint(item, selector);
                    return isTrack;
                });
                if (!isGloableTrack) {
                    currentPageData.some(function (item) {
                        var isTrack = me.trackPoint(item, selector);
                        return isTrack;
                    });
                }
            }, true);
        };
        /**
         * 触发埋点上传
         * @param {*} data
         * @param {*} selector
         */


        CloudAtlasVisual.prototype.trackPoint = function trackPoint(data, selector) {
            var text = selector.selfAttr ? selector.selfAttr.text ? selector.selfAttr.text : '' : '';
            if (data.dom_value === selector.nthEle && data.control_name === text) {
                var options = {
                    eventId: data.event_name
                };
                if (data.event_label) {
                    options.label = data.event_label;
                }
                event$1(options);
                return true;
            }
            return false;
        };

        return CloudAtlasVisual;
    }();

    var EventDefine = function () {
        function EventDefine() {
            classCallCheck(this, EventDefine);
        }

        EventDefine.prototype.getSelfAttr = function getSelfAttr(target) {
            var selector = {};
            var text = target.textContent;
            if (text) {
                selector.text = text;
            }
            return selector;
        };

        EventDefine.prototype.toSelector = function toSelector(target) {
            var isValidAttr = function isValidAttr(attr) {
                return (/^[\w-]+$/g.test(attr)
                );
            };
            var classes = void 0;
            var finalSelector = void 0;
            var produceSelector = void 0;
            var selector = void 0;
            var _ref = void 0;
            var tag = target.tagName.toLowerCase();
            var id = target.getAttribute('id');
            _ref = target.className;
            if (_ref != null) {
                _ref = ' ' + target.className + ' ';
                _ref = _ref.replace(/^\s+/, '').replace(/\s+$/, '');
                if (_ref === '') {
                    classes = [];
                } else {
                    classes = _ref.split(' ');
                }
            } else {
                classes = [];
            }
            selector = tag;
            if (id) {
                selector += '#' + id;
            }
            produceSelector = function produceSelector(classes) {
                var newClasses = classes.filter(function (cls) {
                    return cls !== '';
                });
                if (newClasses.length) {
                    return '' + selector + '.' + newClasses.join('.');
                }
                return selector;
            };
            try {
                finalSelector = produceSelector(classes);
            } catch (_error) {
                classes = classes.filter(isValidAttr);
                finalSelector = produceSelector(classes);
            }
            return finalSelector;
        };

        EventDefine.prototype.toAllSelector = function toAllSelector(target, outDocuemnt) {
            outDocuemnt = outDocuemnt || document;
            var parent = void 0,
                newSelSize = void 0,
                newSelector = void 0,
                selSize = void 0,
                selector = void 0;
            selector = this.toSelector(target, outDocuemnt);
            parent = target.parentNode;
            selSize = outDocuemnt.querySelectorAll(selector).length;
            while (parent.tagName !== 'BODY' && selSize !== 1) {
                newSelector = '' + this.toSelector(parent) + ' ' + selector;
                newSelSize = outDocuemnt.querySelectorAll(newSelector).length;
                if (newSelSize < selSize) {
                    selSize = newSelSize;
                }
                selector = newSelector;
                parent = parent.parentNode;
            }
            var nthEle = selector;
            var selfAttr = this.getSelfAttr(target);

            return {
                nthEle: nthEle,
                selfAttr: selfAttr
            };
        };

        return EventDefine;
    }();

    // 对外暴露的接口，只做参数校验，直接调内部实现

    var CloudAtlas = function () {
        function CloudAtlas(options) {
            classCallCheck(this, CloudAtlas);

            if (navigator.appName === 'Microsoft Internet Explorer' && parseInt(navigator.appVersion.split(';')[1].replace(/[ ]/g, '').replace('MSIE', '')) < 9) {
                LogProxy_e('您的浏览器版本过低，不支持web-sdk,请下载IE9+浏览器！');
                return;
            }
            this.init(options);
        }
        /**
         * 初始化
         * @param options 初始化参数对象
         *  appKey 应用标识码（String，必选）
         *  appVer 应用版本号（String，必选）
         *  channelId 渠道ID （String, 可选，默认值为default）
         *  isLog 是否开启日志打印 （Boolean， 可选，默认值为false）
         *  env 上传环境设置（String, 必选，默认为INTEGRATION 集成环境）
         *  isHttps 是否上传接口协议为https (Boolean, 可甜，默认为false)
         *  isDebugMode 是否为调试模式（Boolean，可选，默认值为false）
         *  isVTrack 是否开启可视化埋点 （Boolean, 可选，默认值为false）
         *  limitNumber 限制上传条数 （Number, 可选，默认值为5）
         *  isImmediately 是否开启立即上传 （Boolean， 可选， 默认为false）
         */


        CloudAtlas.prototype.init = function init(options) {
            try {
                if (options === undefined || options === null || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
                    LogProxy_e('Invalid params for init, type = ' + (typeof options === 'undefined' ? 'undefined' : _typeof(options)) + ', value = ' + options);
                    return;
                }
                var appKey = options.appKey,
                    limitNumber = options.limitNumber,
                    isVTrack = options.isVTrack;
                var appVer = options.appVer,
                    channelId = options.channelId,
                    isDebugMode = options.isDebugMode,
                    env = options.env,
                    isLog = options.isLog,
                    isHttps = options.isHttps,
                    isImmediately = options.isImmediately;

                if (appKey === undefined || appKey === null || appKey.constructor !== String) {
                    LogProxy_e('Invalid appKey, type = ' + (typeof appKey === 'undefined' ? 'undefined' : _typeof(appKey)) + ', value = ' + appKey);
                    return;
                }
                if (appVer === undefined || appVer === null || appVer.constructor !== String) {
                    LogProxy_e('Invalid appVer, type = ' + (typeof appVer === 'undefined' ? 'undefined' : _typeof(appVer)) + ', value = ' + appVer);
                    return;
                }
                if (appVer.length > 255) {
                    appVer = appVer.substring(0, 255);
                }
                var temp = appVer.replace(/[^a-zA-Z0-9\u4E00-\u9FA5._-]/g, '');
                if (temp !== appVer) {
                    LogProxy_w('版本号仅支持中文，英文字母、数字、中划线（-）、下划线（_）和点号（.），其他符号将会自动被过滤');
                }
                appVer = temp;
                if (limitNumber !== undefined && limitNumber !== null && limitNumber.constructor === Number) {
                    if (limitNumber < 1) {
                        LogProxy_w('限制条数最小条数为1条，默认为5条');
                    } else if (limitNumber > 100) {
                        LogProxy_w('限制条数最大不能超过100条，超过设置为100条');
                        setLimitTime(100);
                    } else {
                        setLimitTime(Math.round(limitNumber)); // 默认限制条数四舍五入取整
                    }
                }
                if (channelId !== undefined && channelId !== null) {
                    if (channelId.constructor !== String) {
                        LogProxy_e('Invalid channelId, type = ' + (typeof channelId === 'undefined' ? 'undefined' : _typeof(channelId)) + ', value = ' + channelId);
                    } else {
                        if (channelId.length > 201) {
                            channelId = channelId.substring(0, 201);
                        }
                        var tempchannelId = channelId.replace(/[^a-zA-Z0-9\u4E00-\u9FA5._-]/g, '');
                        if (tempchannelId !== channelId) {
                            LogProxy_w('渠道仅支持中文，英文字母、数字、中划线（-）、下划线（_）和点号（.），其他符号将会自动被过滤');
                        }
                        channelId = tempchannelId;
                    }
                }
                if (isDebugMode !== undefined && isDebugMode !== null && isDebugMode.constructor !== Boolean) {
                    LogProxy_e('Invalid isDebugMode, type = ' + (typeof isDebugMode === 'undefined' ? 'undefined' : _typeof(isDebugMode)) + ', value = ' + isDebugMode);
                    return;
                }
                var gzipFun = _pako_1_0_7_pako.gzip; // 默认开启gzip压缩
                env = env || 'INTEGRATION';
                if (env.constructor !== String) {
                    LogProxy_e('Invalid env, type = ' + _typeof(options.env) + ', value = ' + options.env);
                    return;
                }
                if (isLog !== undefined && isLog !== null && isLog.constructor !== Boolean) {
                    LogProxy_e('Invalid isLog, type = ' + (typeof isLog === 'undefined' ? 'undefined' : _typeof(isLog)) + ', value = ' + isLog);
                    return;
                }
                if (isHttps !== undefined && isHttps !== null && isHttps.constructor !== Boolean) {
                    LogProxy_e('Invalid isLog, type = ' + (typeof isHttps === 'undefined' ? 'undefined' : _typeof(isHttps)) + ', value = ' + isHttps);
                    return;
                }
                if (isImmediately !== undefined && isImmediately !== null && isImmediately.constructor !== Boolean) {
                    LogProxy_e('Invalid isLog, type = ' + (typeof isImmediately === 'undefined' ? 'undefined' : _typeof(isImmediately)) + ', value = ' + isImmediately);
                    return;
                }
                isImmediately = isImmediately === false ? false : true;
                isLog = isLog || false;
                isHttps = isHttps || false;
                LogProxy_setLogEnabled(isLog); // 设置是否开启日志打印
                this.setEnv(env, isHttps); // 是指上传接口协议是否为https
                setImmediately(isImmediately);
                isDebugMode = isDebugMode || false; // 为undefined与null附上默认值
                if (isDebugMode) {
                    DebugHelper_setIsDebugMode(isDebugMode);
                }
                // 可视化埋点
                if (isVTrack && isLocalStorageSupport()) {
                    var visualData = {
                        appKey: options.appKey,
                        env: options.env
                    };
                    this.CloudAtlasVisual = new CloudAtlasVisual(visualData);
                }
                // 目前全埋点有云图后台控制打开 设置全埋点， 获取服务端请求，该应用是否开启全埋点
                getAutoTrack(autoURL + 'v0.1/config/tracking/' + appKey, autoTrack_sendCallback, true);
                if (channelId === undefined || channelId === null || channelId.constructor !== String || channelId === '') {
                    CloudAtlasImpl_init(appKey, appVer, gzipFun);
                } else {
                    CloudAtlasImpl_initChannel(appKey, appVer, channelId, gzipFun);
                }
                // 增加监听的方法： 进入页面，离开页面，页面可见性事件
                addHashEvent(this.leavePage);
                addHashEvent(this.sendPage);
                addPageViewEvent(this.visibilityState);
                this.sendPage(); // 初始化调用进入页面方法
            } catch (error) {
                LogProxy_e(error);
            }
        };
        /**
         * 浏览器可见性事件 v1.7.0新增 ie10以上可用
         */


        CloudAtlas.prototype.visibilityState = function visibilityState() {
            var visibilityState = void 0;
            var prefixes = ['webkit', 'moz', 'ms', 'o'];
            if ('visibilityState' in document) {
                visibilityState = 'visibilityState';
            }
            for (var i = 0; i < prefixes.length; i++) {
                if (prefixes[i] + 'VisibilityState' in document) {
                    visibilityState = prefixes[i] + 'VisibilityState';
                    break;
                }
            }
            if (document[visibilityState] === 'hidden') {
                var sCurrentData = CollectedDataPersister_getCurrentData();
                if (sCurrentData.sessionList && sCurrentData.sessionList.length > 0) {
                    var currentTime = CurrentTimeHelper_currentTimeMillis();
                    var last = sCurrentData.sessionList[sCurrentData.sessionList.length - 1];
                    last.end = currentTime;
                    if (sIsImmediately || !isLocalStorageSupport()) {
                        CollectedDataPersister_setUploadData(last, 'sessionList');
                        CollectedDataUploader_sendPendingData();
                    } else {
                        LocalStoragePersist_saveCollectedData(0, last);
                    }
                }
            }
            if (document[visibilityState] === 'visible') {
                CloudAtlasImpl_onOpen();
            }
        };
        /**
         * 应用打开，辅助标识会话开始，
         */


        CloudAtlas.onOpen = function onOpen() {
            CloudAtlasImpl_onOpen();
        };
        /**
         * 应用关闭，辅助标识会话结束
         */


        CloudAtlas.onClose = function onClose() {
            CloudAtlasImpl_onClose();
        };
        /**
         * 用户登录
         * @param userId 用户id（数字类型的String，必选）
         */


        CloudAtlas.onProfileSignIn = function onProfileSignIn(userId) {
            if (userId === undefined || userId === null || userId.constructor !== String || !/^[0-9]*$/.test(userId)) {
                LogProxy_e('Invalid params for onProfileSignIn, type = ' + (typeof userId === 'undefined' ? 'undefined' : _typeof(userId)) + ', value = ' + userId);
                return;
            }
            CloudAtlasImpl_onProfileSignIn(userId);
        };
        /**
         * 用户退出
         */


        CloudAtlas.onProfileSignOff = function onProfileSignOff() {
            CloudAtlasImpl_onProfileSignOff();
        };
        /**
         * 自定义事件
         * 使用方式：onEvent({eventId: xxx, label: xxx})或onEvent({eventId: xxx, info: {a:aa,b:bb}, value: 20})
         * eventId 事件Id（String，必选）
         * label 事件属性（String，可选）
         * info 事件属性集（Object，不支持嵌套，value为String，可选）
         * value 特殊属性值（int，可选）
         * @param options 事件对象（Object，必选），支持eventId、label、info、value等属性
         */


        CloudAtlas.onEvent = function onEvent(options) {
            event$1(options);
        };

        CloudAtlas.prototype.onEvent = function onEvent(options) {
            /*
            * // TODO 之前宝光采用静态方法，导致实例化的对象无法调用event事件
            */
            event$1(options);
        };
        /**
         * 应用错误日志主动上报
         * @param message 错误消息内容（String，必选）
         */


        CloudAtlas.reportError = function reportError(message) {
            if (message === undefined || message === null || message.constructor !== String) {
                LogProxy_e('Invalid params for reportError, type = ' + (typeof message === 'undefined' ? 'undefined' : _typeof(message)) + ', value = ' + message);
                return;
            }
            if (!CloudAtlasImpl_isSessionExist()) {
                CloudAtlasImpl_onOpen();
            }
            CloudAtlasImpl_reportError(message);
        };
        // 设置环境


        CloudAtlas.prototype.setEnv = function setEnv(env, useHttps) {
            setUploadEnv(env, useHttps);
            setAutoTrackEnv(env, useHttps);
        };

        CloudAtlas.prototype.sendPage = function sendPage() {
            sendPageInfo('ca_pageview_enter');
        };

        CloudAtlas.prototype.leavePage = function leavePage() {
            sendPageInfo('ca_pageview_leave');
        };
        /**
         * 立即上传当前数据。
         */


        CloudAtlas.freshUpdata = function freshUpdata() {
            CollectedDataUploader_uploadImmediately();
        };

        return CloudAtlas;
    }();

    return CloudAtlas;

})));