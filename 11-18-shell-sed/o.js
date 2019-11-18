(function() {
    // jquery依赖
    if ($ === undefined) {
        return;
    }

    // 去掉默认拖动样式
    document.onselectstart = function() {
        return false;
    };

    // 父子页面
    var parent = window.parent;
    var $window = $(window);

    /**
     * 更新可拖动边界
     * @param {Function} callback 回调
     */
    function WatchBorder(callback) {
        $window.on("resize", callback);
    }

    /**
     * 横竖屏监听
     * @param {Function} callback 回调
     */
    function WatchOrient(callback) {
        $window.on("orientationchange" in window ? "orientationchange" : "resize", callback);
    }

    // 屏幕(默认显示横屏)
    var screen = {
        _val: 2,
        isVertical: function() {
            return this._val === 1;
        },
        isHorizontal: function() {
            return this._val === 2;
        },
        setOrient: function() {
            var $doc = $(document);
            this._val = $doc.width() > $doc.height() ? 2 : 1;
            var delClass = this.isVertical() ? "hor" : "ver";
            var addClass = this.isVertical() ? "ver" : "hor";
            console.log(mode.isEdit());

            RenderBgPic("window");
            RenderBgPic("logBox");
            // vertical去掉背景图
            this.isVertical() && $("body").css({ background: "#fff" });
            $("body")
                .removeClass(delClass)
                .addClass(addClass);
        }
    };

    // 编辑模式 1，登录模式(默认) 2
    var mode = {
        _val: 2,
        isLog: function() {
            return this._val === 2;
        },
        isEdit: function() {
            return this._val === 1;
        },
        setMode: function(nv) {
            if (nv === "edit") {
                this._val = 1;
                $("body")
                    .removeClass("login")
                    .addClass("edit");
                this.setEventHandler();
            } else {
                this._val = 2;
                $("body")
                    .removeClass("edit")
                    .addClass("login");
                this.setEventHandler();
            }
        },
        setEventHandler: function() {
            this.eventHandler = this.isLog() ? this.loginHandler : this.editHandler;
        },
        eventHandler: function() {},
        loginHandler: function(e) {
            console.log("login mode receive :", e.data);
            var data = ExtractEvent(e);
            var type = data.type;
            var dataObj = data.dataObj;
            switch (type) {
                case "DatasConfig":
                    SearchAndHandleDatas(dataObj);
                    Init();
                    return;
                case "Language":
                    envr.setEnv(dataObj);
                    return;
                default:
                    return;
            }
        },
        editHandler: function(e) {
            console.log("edit mode receive :", e.data);
            var data = ExtractEvent(e);
            var type = data.type;
            var dataObj = data.dataObj;
            switch (type) {
                case "Init":
                    SearchAndHandleDatas(dataObj);
                    Init();
                    return;
                case "Language":
                    envr.setEnv(dataObj);
                    return;
                case "Tabclick":
                    /** */
                    return;
                case "Update":
                    UpdateBrands(dataObj);
                    return;
                default:
                    console.log("%c event not handled with type: " + type, "color:red");
                    return;
            }
        }
    };

    // 环境,默认国内
    var envr = {
        _val: 1,
        isEnvSet: false,
        isCN: function() {
            return this._val === 1;
        },
        isUS: function() {
            return this._val === 2;
        },
        setEnv: function(nv) {
            this.isEnvSet = true;

            nv = nv && nv.toString && nv.toString();
            switch (true) {
                // 策划默认非简体中文都显示英文页面
                case nv === "US" || nv.toLowerCase() !== "simplifiedchinese":
                    this._val = 2;
                    this.urlConfig.agreement = "//edbox.101.com/about/en/terms/?auto=0";
                    this.urlConfig.privacy = "//edbox.101.com/about/en/privacy/?auto=0";
                    this.urlConfig.help = "//help.edbox.101.com";
                    this.urlConfig.homepage = "//edbox.101.com";
                    this.txtConfig.guideLine = "Hi,choose a login mode~";
                    this.txtConfig.agreement = "User agreement";
                    this.txtConfig.privacy = "Private policy";
                    this.txtConfig.help = "Help manual";
                    break;

                default:
                    this._val = 1;
                    break;
            }

            // 底部链接更新
            RenderLinks(linkConfig);
        },
        getUrl: function(name) {
            return envr.urlConfig[name] || "";
        },
        getSetting: function(name) {
            return envr.txtConfig[name] || "";
        },
        urlConfig: {
            homepage: "//edbox.101.com/cn/",
            agreement: "//edbox.101.com/about/cn/terms/?auto=0",
            privacy: "//edbox.101.com/about/cn/privacy/?auto=0",
            help: "//help.edbox-cn.101.com"
        },
        txtConfig: {
            // 此项后台传值
            guideLine: "",
            agreement: "用户协议",
            privacy: "隐私政策",
            help: "帮助手册"
        }
    };

    // 默认配置
    // var defaultBgPic = "./img/login-bg.jpg";
    var defaultBgPic = "";
    var defaultWindowBgPic = "";
    var defaultIconPic = "./img/login-arrow.png";

    // 未配置部分
    var linkConfig = [{ name: "agreement" }, { name: "privacy" }, { name: "help" }];

    // 修改暂存
    var msgObj = {
        // ID: "113c93d0-401e-11e9-909c-ab890e471017",
        // Name: "Select04",
        // ShowName: "排序多选",
        // Type: "Select04",
        // Value: [
        //     { Name: "Edbox", ShowName: "Edbox", Image: "", ImageGUID: "" },
        //     { Name: "99U", ShowName: "99U", Image: "", ImageGUID: "" },
        //     { Name: "Edmodo", ShowName: "Edmodo", Image: "", ImageGUID: "" }
        // ],
        // Key: ["Edbox", "99U", "Edmodo"],
        // Items: [
        //     { Name: "Edbox", ShowName: "Edbox", Image: "", ImageGUID: "" },
        //     { Name: "99U", ShowName: "99U", Image: "", ImageGUID: "" },
        //     { Name: "Edmodo", ShowName: "Edmodo", Image: "", ImageGUID: "" }
        // ],
        // Keys: ["Edbox", "99U", "Edmodo"]
    };

    /**
     * 渲染背景图
     * @param {String} picSrc 背景图片地址
     */
    function RenderBgPic(target, picSrc) {
        var selector = "";
        switch (target) {
            case "window":
                if (picSrc) defaultWindowBgPic = picSrc;
                picSrc = picSrc || defaultWindowBgPic;
                selector = "body";
                break;
            default:
                if (picSrc) defaultBgPic = picSrc;
                picSrc = picSrc || defaultBgPic;
                selector = ".logBox";
                break;
        }
        if (picSrc) {
            $(selector).css({
                background: 'url("' + picSrc + '") no-repeat 50% 50% / 100% auto',
                backgroundSize: "cover"
            });
        }
    }

    var fontStyleList = {
        // 后台传值
        val: {
            align: "textAlign",
            name: "fontFamily",
            size: "fontSize",
            fontColor: "color"
        },
        // 后台传bool值
        bool: {
            bold: "fontWeight",
            italic: "fontStyle",
            underline: "textDecoration"
        }
    };

    /**
     * 递归遍历属性
     * @param {Object} obj 对象
     * @param {Function} cb 处理函数
     */
    function SearchProps(obj, cb) {
        if (typeof obj !== "object") {
            return;
        }
        for (var key in obj) {
            typeof obj[key] !== "object" ? cb(key, obj[key]) : SearchProps(obj[key], cb);
        }
    }

    /**
     * 渲染引导语
     * @param {Object} dataObj 引导语
     */
    function RenderGuide(dataObj) {
        var guideLine = dataObj.Value || envr.getSetting("guideLine");
        var $guide = $(".guideTxt");
        var cssObj = {};
        SearchProps(dataObj.Style, function(key, val) {
            switch (true) {
                case key in fontStyleList.val:
                    if (key === "size") {
                        val = parseInt(val);
                        cssObj["lineHeight"] = val + "px";
                        cssObj["height"] = val + "px";
                    }
                    cssObj[fontStyleList.val[key]] = val;
                    return;

                case key in fontStyleList.bool:
                    cssObj[fontStyleList.bool[key]] = val ? key : "";
                    return;

                default:
                    if (key === "endNum") {
                        cssObj["maxHeight"] = val;
                    } else {
                        console.log("%c props not handle" + key, "color:orange");
                    }
                    return;
            }
        });
        console.log("%c css" + JSON.stringify(cssObj), "color:green");
        $guide.html(guideLine).css(cssObj);
    }

    /**
     * 渲染logo
     */
    function RenderLogo() {
        var $logo = $(".logo");
        var logoHref = mode.isEdit() ? "" : ' target="_blank" href="' + envr.getUrl("homepage");
        var logFrag = "<a" + logoHref + '">' + '<img src="./img/login-edbox.png" alt="" />' + "</a>";
        $logo.html(logFrag);
    }

    /**
     * 【登录模式】绑定入口点击事件
     */
    function BindLogin() {
        $(".brand").click(function() {
            SendMsg("GoToLogin", $(this).attr("data-link"));
            // console.log("go entryName: ", $(this).attr("data-link"));
        });
    }

    /**
     * 根据brandConfig更新暂存的消息对象,小放大置大前，大放小置小前
     * @param {number} from 抓取下标
     * @param {number} to 放下的下标
     */
    function UpdateAndSendMsgObj(from, to) {
        // 两个可选项Value,Key
        if (!msgObj.Value || !msgObj.Value.length || msgObj.Value.length === 0) {
            msgObj.Value = msgObj.Items;
        }
        if (!msgObj.Key || !msgObj.Key.length || msgObj.Key.length === 0) {
            msgObj.Key = msgObj.Keys;
        }
        function insertBeforeByIndex(arr, from, to) {
            if (from < to) {
                if (from + 1 === to) {
                    return;
                }
                arr.splice(to, 0, arr[from]);
                arr.splice(from, 1);
            } else {
                arr.splice(to, 0, arr[from]);
                arr.splice(from + 1, 1);
            }
        }
        function sortKeysByKey(shortArr, longArr) {
            var res = [];
            var indexArr = [];
            for (var key in shortArr) {
                for (var skey in longArr) {
                    if (shortArr[key] === longArr[skey]) {
                        res.push(longArr[skey]);
                        indexArr.push(skey);
                        break;
                    }
                }
            }
            var sortArr = indexArr.sort();
            for (var n in sortArr) {
                longArr[sortArr[n]] = res[n];
            }
        }

        insertBeforeByIndex(msgObj.Value, from, to);
        insertBeforeByIndex(msgObj.Key, from, to);
        // wiki中Keys需要按顺序排列
        sortKeysByKey(msgObj.Key, msgObj.Keys);
        SendMsg("Update", msgObj);
    }

    /**
     * 渲染中间部分
     * @param {Array} brandConfig 渠道配置
     */
    function RenderBrands(brandConfig) {
        var $brandsDOM = $(".brands");
        var brandsFrag = "";
        var brandsNum = brandConfig.length;
        // 编辑
        if (mode.isEdit()) {
            for (var i = 0; i < brandsNum; i++) {
                brandsFrag +=
                    '<div class="brand"><div class="imgBox"><img src="' +
                    brandConfig[i].Image +
                    '" alt="" /></div><div class="nameBox bold">' +
                    brandConfig[i].ShowName +
                    "</div></div>";
            }
            // 登录
        } else {
            for (var j = 0; j < brandsNum; j++) {
                brandsFrag +=
                    '<div data-link="' +
                    brandConfig[j].Name +
                    '" class="brand"><div class="imgBox"><img src="' +
                    brandConfig[j].Image +
                    '" alt="" /></div><div class="nameBox bold">' +
                    brandConfig[j].ShowName +
                    "</div></div>";
            }
        }
        // 换行显示
        var extra = 6 - (brandsNum % 6);
        if (brandsNum > 2 && extra !== 0 && extra !== 6) {
            for (var k = 0; k < extra; k++) brandsFrag += '<div class="hollowBrand"></div>';
        }
        $brandsDOM.html(brandsFrag);
    }

    /**
     * 渲染底部链接
     * @param {Array} linkConfig 链接配置
     * @param {String} iconSrc 图片链接地址
     */
    function RenderLinks(linkConfig, iconSrc) {
        var $linksDOM = $(".links");
        var linkFrag = "";
        var linkHref = "";

        iconSrc = iconSrc || defaultIconPic;
        // 更新图片地址
        iconSrc && (defaultIconPic = iconSrc);
        for (var j = 0; j < linkConfig.length; j++) {
            linkHref = mode.isEdit() ? "" : ' target="_blank" href="' + envr.getUrl(linkConfig[j].name) + '"';
            linkFrag +=
                '<div class="link"><div class="arrow"><img src="' +
                iconSrc +
                '" /></div><div class="text"><a' +
                linkHref +
                '">' +
                envr.getSetting(linkConfig[j].name) +
                "</a></div></div>";
        }
        $linksDOM.html(linkFrag);
    }

    /**
     * 处理具体变动
     * @param {Object} dataObj 变动根对象
     * @param {String} name 变动对象的Name
     */
    function HandleWithName(dataObj, name) {
        function firstRenderOrUpdateBrands(dataObj) {
            msgObj = dataObj;
            var Key = dataObj.Key && dataObj.Key.length > 0 ? dataObj.Key : dataObj.Keys || [];
            var Value = dataObj.Value && dataObj.Value.length > 0 ? dataObj.Value : dataObj.Items || [];
            var newBrandConfig = new Array(Key.length || 0);
            function findItem(arr, name) {
                for (var k in arr) {
                    var val = arr[k];
                    if (val.Name === name) {
                        return val;
                    }
                }
                console.log("%c Key is not found in Value", "color:blue");
                return {};
            }

            for (var index in Key) {
                newBrandConfig[index] = findItem(Value, Key[index]);
            }
            RenderBrands(newBrandConfig);
        }

        switch (name) {
            case "Modes":
                firstRenderOrUpdateBrands(dataObj);
                return;

            case "Background":
                RenderBgPic("logBox", dataObj.Value);
                return;

            case "WindowBackground":
                RenderBgPic("window", dataObj.Value);
                return;

            case "LeadingWords":
                RenderGuide(dataObj);
                return;

            case "LeadingIcon":
                RenderLinks(linkConfig, dataObj.Value);
                return;

            default:
                console.log("%c object checked but not handle : " + name, "color:orange");
                return;
        }
    }

    /**
     * 解析收到的消息
     * @param {Event} e 事件对象
     * @return {Object} 消息主体
     */
    function ExtractEvent(e) {
        var data = e.data || {};
        if (data.length) {
            data = data[0] || {};
        }
        var type = data.Type;
        var name = data.Name;
        var cluss = data.Class;
        var datas = data.Datas || [];
        // dataObj可能为字符串
        var dataObj = datas[0] || {};
        return { type: type, dataObj: dataObj, name: name, cluss: cluss };
    }

    /**
     * 递归遍历所有Datas内的层级对象
     * @param {Object} target 数组中取出的消息主体
     */
    function SearchAndHandleDatas(target) {
        var name = target.Name;
        HandleWithName(target, name);
        for (var key in target) {
            var val = target[key] || {};
            if (key === "Datas" && val.length && val.length > 0) {
                for (var skey in val) {
                    SearchAndHandleDatas(val[skey]);
                }
                break;
            }
        }
    }

    /**
     * 【编辑模式】接收更新重新渲染
     * @param {Object} data 新的数据
     */
    function UpdateBrands(data) {
        // 递归寻找可更新对象
        SearchAndHandleDatas(data);
    }

    /**
     * 节流函数
     * @param {Function} f 节流的函数
     * @param {Number} time 节流时间
     * @return {Function} 已节流的函数
     */
    function Throttle(f, time) {
        var firstTime = true;
        var timeout = false;
        return function(e) {
            var self = this;
            if (firstTime || timeout) {
                timeout = false;
                f.call(self, e);
                var clock = setTimeout(function() {
                    timeout = true;
                    clearTimeout(clock);
                }, time);
                firstTime = false;
            }
        };
    }

    /**
     * 【编辑模式】使特定元素在范围内可拖动
     * @param {String} dragableDivSelector 可拖动元素选择器
     * @param {String} borderDivSelector 边界元素选择器
     */
    function MakeDragable(dragableDivSelector, borderDivSelector) {
        var $dragableDiv = $(dragableDivSelector);
        var $borderDiv = $(borderDivSelector);

        var config = {
            // 拖动阴影透明度
            moveOpacity: 0.4,
            // 点击拖动节流时间
            throttleTime: 600,
            // 不可选边界延伸
            borderTop: 30,
            borderBottom: 50,
            borderLeft: 50,
            borderRight: 50,
            // 鼠标左键
            mouseBtn: 0
        };

        var mouseObj = {
            // 拖动的div复制
            carryDiv: null,
            carryDivPos: -1,
            // 放下处所在div
            dropDivPos: -1,
            // 复制的div初始位置
            fixLeft: 0,
            fixTop: 0,
            // 鼠标初始锚点
            originMouseLeft: 0,
            originMouseTop: 0,
            // jquery对象
            $borderDiv: $borderDiv,
            $dragableDiv: $dragableDiv,
            // 可拖动div宽高,只取一次
            dragableDivWidth: $dragableDiv.width(),
            dragableDivHeight: $dragableDiv.height(),
            // 边界值
            borderLeft: 0,
            borderRight: 0,
            borderTop: 0,
            borderBottom: 0,
            // 是否已经放下div
            hasDropDiv: false,
            initCarryDiv: function($div, e) {
                // this.fixLeft = $div.offset().left;
                // this.fixTop = $div.offset().top;
                this.originMouseLeft = e.screenX;
                this.originMouseTop = e.screenY;
                this.carryDiv = $div
                    .clone()
                    .appendTo($div)
                    .css({
                        position: "absolute",
                        left: this.fixLeft,
                        top: this.fixTop,
                        margin: 0,
                        zIndex: 999,
                        opacity: config.moveOpacity
                    });
                this.carryDivPos = $div.index();
            },
            moveCarryDiv: function(e) {
                this.carryDiv.css({
                    left: this.fixLeft + e.screenX - this.originMouseLeft,
                    top: this.fixTop + e.screenY - this.originMouseTop
                });
            },
            dropCarryDiv: function() {
                // 松开时如果超过边界carryDiv也不插入
                if (!this.isCrossBorder()) {
                    this.hasDropDiv = true;
                }

                this.carryDiv.remove();
                this.carryDiv = null;
            },
            insertDiv: function() {
                console.log("insert div", this.carryDivPos, "before", this.dropDivPos);
                var from = this.carryDivPos;
                var to = this.dropDivPos;
                if (from === to) {
                    return;
                }
                // var noIncludeFirst = from !== 0;
                // 交换
                // if (this.carryDivPos - this.dropDivPos > 0) {
                //     from = this.dropDivPos;
                //     to = this.carryDivPos;
                // }
                // 数据部分
                // 采用交换
                // var tmp = brandConfig[to];
                // brandConfig[to] = brandConfig[from];
                // brandConfig[from] = tmp;

                // 发送消息
                UpdateAndSendMsgObj(from, to);

                // 数据验证
                // RenderBrands(brandConfig);
                // MakeDragable(".brand", ".brands");

                // 视图部分
                var $from = $(".brand").eq(from);
                var $to = $(".brand").eq(to);
                // 采用交换
                // var noIncludeFirst = from !== 0;
                // if (noIncludeFirst) {
                //     var $tmp = $from.prev();
                //     $from.detach().insertAfter($to);
                //     $to.detach().insertAfter($tmp);
                // } else {
                //     if (to === 1) {
                //         $from.detach().insertAfter($to);
                //     } else {
                //         var $tmp = $from.next();
                //         $from.detach().insertBefore($to);
                //         $to.detach().insertBefore($tmp);
                //     }
                // }
                // 采用插入
                $from.detach().insertBefore($to);

                this.carryDivPos = -1;
                this.dropDivPos = -1;
            },
            isCrossBorder: function() {
                var xyObj = this.carryDiv.offset();
                return (
                    xyObj.left <= this.borderLeft ||
                    xyObj.left >= this.borderRight ||
                    xyObj.top <= this.borderTop ||
                    xyObj.top >= this.borderBottom
                );
            },
            initBorder: function() {
                this.borderLeft = $borderDiv.offset().left - config.borderLeft;
                this.borderRight =
                    $borderDiv.width() +
                    this.borderLeft -
                    this.dragableDivWidth +
                    config.borderLeft +
                    config.borderRight;
                this.borderTop = $borderDiv.offset().top - config.borderTop;
                this.borderBottom =
                    $borderDiv.height() +
                    this.borderTop -
                    this.dragableDivHeight +
                    config.borderTop +
                    config.borderBottom;
            },
            updateBorder: function() {
                this.initBorder();
            },
            disableMouse: function() {
                $("body").css({ cursor: "no-drop" });
            }
        };

        function MousedownCallback(e) {
            if (e.button !== config.mouseBtn) {
                return;
            }
            var $target = $(this);
            mouseObj.initCarryDiv($target, e);
        }
        var ThrottleMousedownCallback = Throttle(MousedownCallback, config.throttleTime);
        function MousemoveCallback(e) {
            // 防止延迟触发视图操作
            if (mouseObj.hasDropDiv) {
                mouseObj.hasDropDiv = false;
            }
            if (mouseObj.carryDiv === null || e.button !== config.mouseBtn) {
                return;
            }
            mouseObj.moveCarryDiv(e);
            if (mouseObj.isCrossBorder(e)) {
                mouseObj.dropCarryDiv();
                mouseObj.disableMouse();
            }
        }
        function MouseupCallback(e) {
            // 取消拖动时的禁止样式
            $("body").css({ cursor: "default" });
            if (mouseObj.carryDiv === null || e.button !== config.mouseBtn) {
                return;
            }
            mouseObj.dropCarryDiv();
        }

        // 设置初始边界
        mouseObj.initBorder();

        // 功能开启
        mouseObj.$borderDiv
            .on("mousedown", dragableDivSelector, function(e) {
                ThrottleMousedownCallback.call(this, e);
            })
            .on("mouseover", dragableDivSelector, function() {
                // 触发视图操作
                if (mouseObj.hasDropDiv) {
                    mouseObj.dropDivPos = $(this).index();
                    mouseObj.insertDiv();
                    mouseObj.hasDropDiv = false;
                }
            });
        $(document)
            .on("mousemove", MousemoveCallback)
            .on("mouseup", MouseupCallback);

        // 监控边界改变
        WatchBorder(mouseObj.updateBorder.bind(mouseObj));
    }

    /**
     * 消息发送
     * @param {String} type 发送的消息类型
     * @param {any} datas 发送的消息
     */
    function SendMsg(type, data) {
        if (!parent) {
            return;
        }

        var Datas = [data || null];

        if (Object.prototype.toString.call(data).slice(-6, -1) === "Array") {
            Datas = data;
        }
        var dataMsg = {
            Type: type,
            Datas: Datas
        };
        parent.postMessage(dataMsg, "*");
    }

    /**
     * 开启收发消息
     */
    function MsgOnline() {
        /**
         * 消息接收
         * @param {Event} e 事件对象
         */
        function GetMsg(e) {
            if (!parent) {
                parent = e.source || null;
            }

            var data = ExtractEvent(e);
            var type = data.type;
            var dataObj = data.dataObj;
            var name = data.name;
            var cluss = data.cluss;

            // 父窗口握手
            if (type === "Connect") {
                SendMsg("Connect");
            }

            // 设置语言
            if (type === "Language") {
                envr.setEnv(dataObj);
            }

            // 编辑模式
            if ((name === "Login" && cluss === "Login") || type === "Init") {
                mode.setMode("edit");
                GetMsg = mode.eventHandler;
            }

            // 登录模式
            if (type === "DatasConfig") {
                mode.setMode("login");
                GetMsg = mode.eventHandler;
            }

            mode.eventHandler(e);
        }

        /**
         * 开启消息监听
         * @param {Function} callback 回调
         */
        function InitListenMsg(callback) {
            window.addEventListener("message", callback);
        }
        InitListenMsg(GetMsg);
    }

    // 启动消息监听
    MsgOnline();

    // 询问语言环境
    SendMsg("FunctionCall", ["Language", "return Edbox.Language"]);

    /**
     * 通用单次启动
     */
    function Init() {
        screen.setOrient();
        // 监听横竖屏
        WatchOrient(screen.setOrient.bind(screen));
        RenderLogo();
        // 登录模式
        if (mode.isLog()) {
            BindLogin();
        }
        // 编辑模式
        if (mode.isEdit()) {
            MakeDragable(".brand", ".brands");
        }
    }
    // 测试
    // envr.setEnv("US");
    // mode.setMode("login");
    // Init();
})();
