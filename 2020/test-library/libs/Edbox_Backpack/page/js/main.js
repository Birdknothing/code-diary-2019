var Manager = {
    /**
     * 接口方法集
     */
    Functions: {
        /**
         * 道具丢弃
         * @param {Object} prop 背包道具信息
         */
        Drop: function (prop) {
            var data = {
                Type: "Drop",
                Datas: [prop]
            };
            Manager.PostMessage(data);
        },
        /**
         * 道具使用
         * @param {Object} prop 背包道具信息
         * @param {Number} count 数量
         */
        Use: function (prop, count) {
            var data = {
                Type: "Use",
                Datas: [prop, count]
            };
            Manager.PostMessage(data);
        },
        /**
         * 关闭组件
         */
        Close: function () {
            var data = {
                Type: "Close",
                Datas: []
            };
            Manager.PostMessage(data);
        },
        /**
         * 异常
         * @param {String} err 异常内容
         */
        Error: function (err) {
            var data = {
                Type: "Error",
                Datas: [err]
            };
            Manager.PostMessage(data);
        }
    },

    /**
     * 数据集
     */
    Datas: {},

    /**
     * 向上一窗口提交数据
     * @param {Object} data 数据
     */
    PostMessage: function (data) {
        if (window.parent && window.parent.postMessage) {
            try {
                window.parent.postMessage(data, "*");
            } catch (e) {
                console.log(e);
            }
        }
    },

    /**
     * 获取图片
     * @param {Object} data 对象
     * @param {String} key 关键字
     */
    GetNDRImage: function (data, key) {
        if (!data[key] || data[key].trim().length < 10) {
            if (Manager.Functions.Error) Manager.Functions.Error("'" + key + "' is Not a valid GUID");
            data[key + "URL"] = "";
            return;
        }
        Edbox.Resource.GetImage(data[key], function (url) {
            data[key + "URL"] = url;
        }, Manager.Functions.Error, null, true);
    },

    /**
     * 背包页方法集
     */
    Bag: {
        /**
         * 空数据
         */
        EmptyDatas: [],

        /**
         * 当前数据
         */
        CurrentData: null,

        GetLeft: function () {
            return (screen.availWidth - 120) % 75 / 2 + 60;
        },

        // 展示详情
        ShowItemDetail: function (data) {
            console.log(data);
            $(".BagTipBox").css("display", "block");
            Manager.Bag.CurrentData = data;
            return;
        },

        // 隐藏详情
        HideItemDetail: function () {
            $(".BagTipBox").css("display", "none");
        },

        // 使用道具
        UseProp: function () {
            DataFunction.Bag.HideItemDetail();
            Datas.Functions.Use(DataFunction.Bag.CurrentData, 1);
        },

        // 0 -> 100
        ScrollTo: function (num) {
            if (num < 0) num = 0;
            if (num > 100) num = 100;
            var scrollHeight = $(".ScrollLayer")[0].scrollHeight;
            var clientHeight = $(".ScrollLayer")[0].clientHeight;
            var len = (scrollHeight - clientHeight) * num / 100;
            $(".ScrollLayer")[0].scrollTop = len;
        },

        // 0 -> 100
        SetScrollBar: function (num) {
            if (num < 0) num = 0;
            if (num > 100) num = 100;
            var scrollHeight = $(".ScrollbarLine")[0].offsetHeight;
            var clientHeight = $(".ScrollbarHandle")[0].offsetHeight;
            $(".ScrollbarHandle").css("top", (scrollHeight - clientHeight) * num / 100 + "px");
        },

        // 滑块初始化
        ScrollInit: function () {
            var scrollHeight = $(".ScrollLayer")[0].scrollHeight;
            var clientHeight = $(".ScrollLayer")[0].clientHeight;

            if (scrollHeight <= clientHeight) {
                $(".ScrollBar").css("display", "none");
            }
            else {
                $(".ScrollBar").css("display", "block");
            }

            $(".ScrollLayer").scroll(function () {
                //滚动条距离顶部的高度
                var scrollTop = $(this).scrollTop();
                //当前页面的总高度
                var scrollHeight = $(".ScrollLayer")[0].scrollHeight;
                //当前可视的页面高度
                var clientHeight = $(this).height();

                var len = scrollTop / (scrollHeight - clientHeight) * 100;
                Manager.Bag.SetScrollBar(len);
            });
        },

        LastTouchY: 0,

        ScrollbarStart: function (e) {
            if (e.touches && e.touches.length > 0) {
                var clientY = e.touches[0].clientY;
                Manager.Bag.LastTouchY = clientY;
            }
        },

        ScrollbarMove: function (e) {
            var oScroll = $(".ScrollBarLine")[0];
            var oBar = $(".ScrollbarHandle")[0];
            if (e.touches && e.touches.length > 0) {
                var clientY = e.touches[0].clientY;
                var currentY = Manager.Bag.LastTouchY;
                var deltaY = clientY - currentY;
                Manager.Bag.LastTouchY = clientY;
                var top = oBar.style.top.replace(/px/g, "") - 0;
                top += deltaY;
                var scrollHeight = $(".ScrollbarLine")[0].offsetHeight;
                var clientHeight = $(".ScrollbarHandle")[0].offsetHeight;

                var len = top / (scrollHeight - clientHeight) * 100;
                Manager.Bag.SetScrollBar(len);
                Manager.Bag.ScrollTo(len);
            }
        },

        /**
         * 初始化
         */
        Init: function () {
            DataFunction.Bag = Manager.Bag;

            window.addEventListener("resize", function () {
                Manager.Bag.ScrollInit();
                DataFunction.Apply();
            });
        }
    },

    /**
     * 初始化
     */
    Init: function () {
        Datas.Functions = Manager.Functions;
        DataFunction.Bag = Manager.Bag;

        DataFunction.GetNDRImage = Manager.GetNDRImage;

        Edbox.Start(function () {
            Manager.Bag.Init();
        });

        function messageCallBack(data) {
            console.log(data);
            data = data.data;
            if (data && data.Datas && typeof data.Datas.ID) {
                Manager.Datas = data.Datas;
                Manager.Bag.EmptyDatas = new Array();

                DataFunction.Datas = Manager.Datas;

                for (var i = 0; i < Manager.Datas.PropList.length; i++) {
                    DataFunction.GetNDRImage(Manager.Datas.PropList[i].Prop, "Icon");
                }

                for (; i < Manager.Datas.Total; i++) {
                    Manager.Bag.EmptyDatas.push(new Object());
                }

                DataFunction.Apply();

                console.log(Manager.Datas);
            }
        }

        window.addEventListener('message', messageCallBack, false);

        /**
         * 伪造数据
         */
        //var backpack = new Object();
        //backpack.Total = 200;
        //backpack.PropList = new Array();

        //for (var i = 0; i < 51; i++) {
        //    var backpackProp = new Object();
        //    backpackProp.ID = i;
        //    var id = i;
        //    backpackProp.GUID = "abc-123-anc-31294931-" + id;
        //    var prop = new Object();
        //    prop.GUID = "abc-123-anc-31294932-" + id;
        //    prop.Name = "测试" + i;
        //    prop.Icon = "5fa90699-075c-46b7-853f-7ef3536f1486";
        //    prop.Description = "测试商品描述测试商品描述" + i;
        //    backpackProp.Prop = prop;
        //    backpack.PropList.push(backpackProp);
        //}

        //Manager.Bag.CurrentData = backpack.PropList[0];

        //var data = new Object();
        //data.Datas = backpack;

        //setTimeout(function () {
        //    window.postMessage(data, "*");
        //}, 100);
    }
};

DataFunction.Init("json/config.json", function () {
    Manager.Init();
});

// 路由配置
EdboxModule.config(["$routeProvider", function ($routeProvider) {
    function setRoutes(route) {
        var url = "/" + route;
        var config = {
            templateUrl: "pages/" + route.toLowerCase() + ".html"
        };
        return $routeProvider.when(url, config), $routeProvider;
    }

    var routes = [
        "Bag"
    ];

    routes.forEach(function (route) {
        setRoutes(route);
    });

    $routeProvider.when("/", {
        redirectTo: "/Bag"
    }).when("/404", {
        redirectTo: "/Bag"
    }).otherwise({
        redirectTo: "/Bag"
    });
}]);