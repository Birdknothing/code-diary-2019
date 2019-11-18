var Manager = {
    /**
     * 接口方法集
     */
    Functions: {
        /**
         * 获取到文件信息回调,带参数info{Name,Data}
         * @param {Object} info 文件信息
         */
        GetInfo: function(info) {
            var data = {
                Type: "GetInfo",
                Datas: [info]
            };
            Manager.PostMessage(data);
        },
        /**
         * 文件上传NDR过程,带两个参数msg, step
         * @param {String} msg 步骤提示信息
         * @param {Number} step 步骤
         */
        Progress: function(msg, step) {
            var data = {
                Type: "Progress",
                Datas: [msg, step]
            };
            Manager.PostMessage(data);
        },
        /**
         * 成功回调,带参数info{Name,Type,Guid,Url}
         * @param {Object} info 数据信息
         */
        Success: function(info) {
            var data = {
                Type: "Success",
                Datas: [info]
            };
            Manager.PostMessage(data);
        },
        /**
         * 出错回调
         * @param {Object} err 失败信息
         */
        Error: function(err) {
            var data = {
                Type: "Error",
                Datas: [err]
            };
            Manager.PostMessage(data);
        },
        /**
         * 重置回调
         */
        Reset: function() {
            Manager.OnlineImage.Reset();
            Manager.ImageCropper.Reset();
            Manager.Text2Image.Reset();
            var data = {
                Type: "Reset",
                Datas: []
            };
            Manager.PostMessage(data);
        },
        /**
         * 关闭组件
         */
        Cancel: function() {
            var data = {
                Type: "Cancel",
                Datas: []
            };
            Manager.PostMessage(data);
        },
        /**
         * 输入框失去焦点事件
         */
        InputBlur: function() {
            var data = {
                Type: "InputBlur",
                Datas: []
            };
            Manager.PostMessage(data);
        },
        /**
         * 前往在线图片页
         */
        Online: function() {
            window.location.hash = "#!/Online";
        },
        /**
         * 前往本地图片页
         */
        Local: function() {
            // window.location.hash = "#!/Local";
            Manager.SelectLocalImage();
        },
        /**
         * 前往文字转图片页
         */
        Text: function() {
            window.location.hash = "#!/Text";
        },
        /**
         * 前往图片裁剪页
         */
        ImageCropper: function() {
            window.location.hash = "#!/ImageCropper";
        },
        /**
         * 前往文本编辑页
         */
        EditText: function() {
            window.location.hash = "#!/EditText";
        },
        /**
         * 返回选择页
         */
        Back: function() {
            window.location.hash = "#!/Home";
        },
        /**
         * 确认按钮
         */
        OK: function() {},
    },

    /**
     * 向上一窗口提交数据
     * @param {Object} data 数据
     */
    PostMessage: function(data) {
        if (window.parent && window.parent.postMessage) {
            try {
                window.parent.postMessage(data, "*");
            } catch (e) {
                console.log(e);
            }
        }
    },

    /**
     * 提交数据到NDR
     * @param {Object} info 文件数据 info{Name,Data}
     */
    PostToNDR: function(info) {
        var func = Manager.Functions;
        if (func.GetInfo) func.GetInfo(info);
            UtilBarn.NDR.Post(info.Data, info.Name, func.Progress, func.Success, func.Error);
    },

    /**
     * 选择本地图片
     * 按原理来说可以不用appendChild,但是IOS如果不appendChild无法触发事件
     */
    SelectLocalImage: function() {
        var input = document.createElement("input");
        document.body.appendChild(input);
        input.type = "File";
        // input.style.visibility = "hidden";
        input.style.display = "none";
        input.accept = DataFunction.ImageCropper.GetAcceptFormats(); //"image/*";
        input.onchange = function() {
            if (!input.files || !input.files[0]) {
                Manager.Functions.Error("None Select");
                return;
            }
            function NameCheck(filename) {
                if (!filename) {
                    return false;
                }
    
                var list = new Array("&", " ", "#", ":", "?", "!", "/", "\\");
                for (var i = 0; i < list.length; i++) {
                    var key = list[i];
                    if (filename.indexOf(key) >= 0) {
                        return false;
                    }
                }
                return true;
            }
            var file = input.files[0]; 
            if(!NameCheck(file.name)){
                Manager.Functions.Error("Illegal File Name");
                return;
            }
            Manager.ImageCropper.ImageInput = input;
            window.location.hash = "#!/Local";
            document.body.removeChild(input);
            // Manager.ImageCropper.SelectImage(input);            
        };
        input.click();
    },

    /**
     * 检查当前支持格式    
     */
    CheckFormats: function(formats) {
        if (formats == null || formats.length == 0)
            return null;

        if (formats.length > 0 && formats.indexOf("*") > -1)
            return ["*"];

        let tempArrays = [];
        for (let i = 0, len = formats.length; i < len; i++) {
            switch (formats[i]) {
                case "bmp":
                case "png":
                case "gif":
                case "jpg":
                case "jpeg":
                    tempArrays.push(formats[i]);
                    break;
            }
        }

        return tempArrays;
    },

    /**
     * 初始化平台数据（大部分可以从UtilBarnSdk里获取）
     */
    InitPlatform: function() {
        var ua = navigator.userAgent;
        var platform = Manager.Platform;
        platform.IsAndroid = UtilBarn.Platform.IsAndroid;
        platform.IsIOS = UtilBarn.Platform.IsIOS;
        platform.IsPC = UtilBarn.Platform.IsPC;
        platform.IsUtilBarn = UtilBarn.Platform.IsUtilBarn;
        platform.IsOppoBrowser = ua.indexOf("OppoBrowser") != -1;
    },

    /**
     * 初始化缩放信息
     */
    InitScaleInfo: function() {
        Manager.ScaleInfo.DefaultWidth = window.screen.availWidth; // 屏宽
        Manager.ScaleInfo.DefaultHeight = window.screen.availHeight; // 屏高		
        Manager.ScaleInfo.InnerWidth = window.innerWidth;
        Manager.ScaleInfo.InnerHeight = window.innerHeight;
        Manager.ScaleInfo.XScale = Manager.ScaleInfo.DefaultWidth / Manager.ScaleInfo.BaseWidth;
        Manager.ScaleInfo.YScale = Manager.ScaleInfo.DefaultHeight / Manager.ScaleInfo.BaseHeight;
        Manager.ScaleInfo.DefaultScale = Manager.ScaleInfo.XScale < Manager.ScaleInfo.YScale ? Manager.ScaleInfo.XScale : Manager.ScaleInfo.YScale; // 缩放	
    },

    /**
     * 调整样式大小，传参第一个为样式字符串，后面的参数为需要调整大小的像素
     */
    ResizeStyleScale: function(...args) {
        if (args.length == 0)
            return "";

        if (args.length == 1)
            return args[0];

        for (let i = 1, len = args.length; i < len; i++) {
            args[i] = Manager.ResizeScale(args[i]);
        }
        return Utils.StringFormat(args);
    },

    /**
     * 调整像素内容缩放
     * 由于jquery和angular尽量是不要混合使用的，所以此处的做法并不妥当，如果要改最好改成style的属性绑定数据，通过改数据到达该目的
     */
    ResizeChildrenPXScale: function(selector, once) {
        var tempArray = Manager.ResizeFlags;
        var tempDefaultScale = Manager.ScaleInfo.DefaultScale;
        let tempSelector = Utils.IsNullOrEmpty(selector) ? "*[resize-flag]" : selector;
        if (tempDefaultScale > 0 && tempDefaultScale != 1) {
            $(tempSelector).each(function() {
                let tempThis = $(this);
                // console.log(tempThis[0].className);
                let tempResizeFlag = parseInt(tempThis.attr("resize-flag"));
                let tempFlag, tempCssName, tempCss, tempSize;
                for (let i = 0, len = tempArray.length; i < len; i++) {
                    if (i == 0)
                        tempFlag = 1;
                    else
                        tempFlag *= 2;

                    if (tempFlag > tempResizeFlag)
                        break;

                    if (tempFlag & tempResizeFlag) {
                        tempCssName = tempArray[i];
                        tempCss = tempThis.css(tempCssName); //不管是百分比还是px都会被转化成px
                        if (tempCss != null) {
                            tempSize = parseInt(tempCss);
                            if (tempSize != 0) {
                                tempSize *= tempDefaultScale;
                                if ((tempFlag & 3146304) && Math.abs(tempSize) < 0.5) //关于board-width相关进行处理,最小不得小于0.5                                    
                                    tempSize = Utils.GetNumberSign(tempSize) * 0.5;
                                tempThis.css(tempCssName, tempSize + "px");
                            }
                        }
                    }
                }

                if (once === true)
                    tempThis.attr("resize-flag", null);
            });
        }
    },


    /**
     * 获取缩放样式
     */
    GetScaleStyleByDom: function(dom) {
        if (dom == null)
            return "";

        let tempResizeFlag = dom.attr("resize-flag");
        if (Utils.IsNullOrEmpty(tempResizeFlag))
            return "";

        tempResizeFlag = parseInt(tempResizeFlag);
        let tempArray = Manager.ResizeFlags;
        let tempDefaultScale = Manager.ScaleInfo.DefaultScale;
        let tempFlag, tempCssName, tempCss, tempSize, tempStyle = "";
        for (let i = 0, len = tempArray.length; i < len; i++) {
            if (i == 0)
                tempFlag = 1;
            else
                tempFlag *= 2;

            if (tempFlag > tempResizeFlag)
                break;

            if (tempFlag & tempResizeFlag) {
                tempCssName = tempArray[i];
                tempCss = dom.css(tempCssName); //不管是百分比还是px都会被转化成px
                if (tempCss != null) {
                    tempSize = parseInt(tempCss);
                    if (tempSize != 0) {
                        // if (!Utils.IsNullOrEmpty(tempStyle))
                        //     tempStyle += "; "
                        tempStyle += tempCssName + ": " + (tempSize * tempDefaultScale) + "px; "
                    }
                }
            }
        }

        return tempStyle;
    },

    /**
     * 重置大小
     */
    ResizeScale: function(scale) {
        return scale * Manager.ScaleInfo.DefaultScale;
    },

    /**
     * 调整不支持百分比的Dom元素缩放
     */
    ResizeNonsupportPercentDomScale: function(selector, cssName) {
        $(selector).each(function() {
            var tempThis = $(this);
            if (tempThis != null) {
                var tempSize = parseInt(tempThis.css(cssName));
                tempThis.css(cssName, tempSize * Manager.ScaleInfo.DefaultScale);
            }
        });
    },

    /**
     * 本地图片页方法集
     */
    LocalImage: null,

    /**
     * 在线图片页方法集
     */
    OnlineImage: null,

    /**
     * 图片裁剪页方法集
     */
    ImageCropper: null,

    /**
     * 文本编辑页方法集
     */
    EditText: null,

    /**
     * 文本转图片页方法集
     */
    Text2Image: null,

    /**
     * 当前支持的平台
     */
    Platform: {
        IsAndroid: false, // 安卓手机、指示所有安卓系统的移动端
        IsIOS: false, // 苹果手机、指示所有苹果系统的移动端
        IsPC: false, // PC、指示电脑或其他非常用移动端手机类型
        IsUtilBarn: false, // UtilBarn内嵌浏览器
        IsOppoBrowser: false, // 是否OPPO浏览器
    },

    /**
     * 缩放信息
     */
    ScaleInfo: {
        DefaultWidth: 750, //默认宽度
        DefaultHeight: 1334, //默认高度
        BaseWidth: 750, //基础宽度
        BaseHeight: 1334, //基础宽度
        XScale: 1, //X缩放值
        YScale: 1, //Y缩放值
        DefaultScale: 1, //默认大小
    },

    /**
     * 调整大小标识位，用来处理HTML页面加载完成后的缩放
     */
    ResizeFlags: [
        "left", //1
        "top", //2
        "bottom", //4 
        "width", //8
        "height", //16
        "font-size", //32
        "border-top-width", //64
        "margin-top", //128
        "margin-left", //256
        "border-width", //512
        "border-radius", //1024
        "padding", //2048
        "padding-left", //4096
        "padding-right", //8192
        "padding-top", //16384
        "padding-bottom", //32768
        "margin-bottom", //65536
        "margin-right", //131072
        "line-height", //262144
        "flex-basis", //524288
        "border-bottom-width", //1048576
        "border-left-width", //2097152
    ],

    /**
     * 初始化
     */
    Init: function() {
        Manager.InitPlatform();
        Manager.InitScaleInfo();

        DataFunction.GetList = Manager.GetList;
        DataFunction.ResizeStyleScale = Manager.ResizeStyleScale;
        Datas.Functions = Manager.Functions;
        Manager.LocalImage = LocalImage;
        Manager.OnlineImage = OnlineImage;
        Manager.ImageCropper = ImageCropper;
        Manager.EditText = EditText;
        Manager.Text2Image = Text2Image;

        Manager.LocalImage.Init();
        Manager.OnlineImage.Init();
        // Manager.ImageCropper.Init(null, Manager.Functions.Home);
        Manager.ImageCropper.Init();
        Manager.EditText.Init();
        Manager.Text2Image.Init();

        UtilBarn.Start(); //必须重新Start一次，否则获取不到基础数据，上传NDR会报错

        function messageCallBack(data) {
            data = data.data;
            if (data && data.args) {
                var radio = data.args.radio;
                DataFunction.ImageCropper.SetDefaultAspectRatio(radio);
                DataFunction.Text2Image.SetDefaultAspectRatio(radio);
                var formats = Manager.CheckFormats(data.args.formats);
                DataFunction.ImageCropper.SetFormats(formats);
                DataFunction.Text2Image.SetFormats(formats);
                DataFunction.OnlineImage.SetFormats(formats);
                var limit = data.args.limit;
                DataFunction.OnlineImage.SetLimitCount(limit);
            }
        }

        window.addEventListener("message", messageCallBack, false);
    }
};

// UtilBarn.Language = "English";

DataFunction.Init("json/config.json", function() {
    Manager.Init();
});

// 路由配置
UtilBarnModule.config(["$routeProvider", function($routeProvider) {
    function setRoutes(route) {
        var url = "/" + route;
        var config = {
            templateUrl: "pages/" + route.toLowerCase() + ".html"
        };
        return $routeProvider.when(url, config), $routeProvider;
    }

    var routes = [
        "Home",
        "Online",
        "Local",
        "Text"
    ];

    routes.forEach(function(route) {
        setRoutes(route);
    });

    $routeProvider.when("/", {
        redirectTo: "/Home"
    }).when("/404", {
        redirectTo: "/Home"
    }).otherwise({
        redirectTo: "/Home"
    });
}]);