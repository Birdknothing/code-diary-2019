var Manager = {
    /**
     * 接口方法集
     */
    Functions: {
        /**
         * 购买商品
         * @param {Object} commodity 购买的商品
         * @param {Object} currency 使用的货币
         * @param {Number} count 购买数量
         */
        Buy: function (commodity, currency, count) {
            var data = {
                Type: "Buy",
                Datas: [commodity, currency, count]
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
     * 在线页方法集
     */
    Shop: {
        /**
         * 三级标签栏是否打开
         */
        ThirdTabOpen: false,

        /**
         * 搜索关键字
         */
        Keyword: "",

        /**
         * 加载页数
         */
        Page: 1,

        /**
         * 每页加载数据数
         */
        Size: 5,

        /**
         * 搜索到数据数
         */
        Total: 0,

        /**
         * 列表数据
         */
        ListDatas: [],

		/**
		 * 选中的商店
		 */
        StoreSelect: 0,

        /**
         * 无声数据
         */
        EmptyData: {
            Name: "无声音",
            Type: "audio/mp3",
            Guid: "",
            Url: ""
        },

        /**
         * 选中数据
         */
        Datas: null,

        /**
         * 播放音频使用的Audio
         */
        Audio: null,

        /**
         * 音频是否在播放
         */
        OnPlay: false,

        /**
         * 是否在搜索音频
         */
        OnSearch: true,

		/**
		 * 滚动条初始化位置
		 */
        ScrollbarOriClientY: 0,
		/**
		 * 滚动条位移
		 */
        ScrollbarOh: 0,

		/**
		 * Viewport初始化位置
		 */
        PageOriClientY: 0,
		/**
		 * Viewport位移
		 */
        PagebarOh: 0,

        CurScrollbarTop: '',

        CurViewPortMarginTop: '',

		/**
		 * 当前商品
		 */
        CurCommodity: {},

        /**
         * 获取时间String
         * @param {Number} time 时间值
         * @returns {String} 时间String
         */
        GetTime: function (time) {
            time = Math.round(time / 1000);
            var m = Math.floor(time / 60);
            var s = time - m * 60;
            return (m > 9 ? m : "0" + m) + ":" + (s > 9 ? s : "0" + s);
        },

        /**
         * 选择一级标签栏
         * @param {Number} index 序号
         */
        SelectFirstTab: function (index) {
            var shop = Datas.Shop;
            if (index >= shop.FirstTab.Datas.length || index < 0) return;
            shop.FirstTab.Select = index;
            shop.SecondTab.Datas = [];
            shop.ThirdTab.Datas = [];
            shop.SecondTab.Select = -1;
            shop.ThirdTab.Select = -1;
            var tag = shop.FirstTab.Datas[index].Guid;
        },

        /**
         * 选择二级标签栏
         * @param {Number} index 序号
         */
        SelectSecondTab: function (index) {
            var shop = Datas.Shop;
            if (index >= shop.SecondTab.Datas.length || index < -1) return;
            shop.SecondTab.Select = index;
            shop.ThirdTab.Datas = [];
            shop.ThirdTab.Select = -1;
            if (index < 0) {
                DataFunction.Shop.Search();
                return;
            }
            var tag = shop.SecondTab.Datas[index].Guid;
        },

        /**
         * 选择三级标签栏
         * @param {Number} index 序号
         */
        SelectThirdTab: function (index) {
            var shop = Datas.Shop;
            if (index >= shop.SecondTab.Datas.length || index < -1) return;
            shop.ThirdTab.Select = index;
            DataFunction.Shop.Search();
        },

        /**
         * 选择数据
         * @param {Object} data 数据对象
         */
        SelectData: function (data) {
            var shop = DataFunction.Shop;
            if (shop.Datas.Guid === data.Guid) return;
            shop.Datas = data;
            if (!data.Url || data.Url.length < 1) {
                shop.Stop();
            }
            else if (shop.OnPlay) {
                shop.Play(data);
            }
        },

        ScrollbarStart: function (e) {
            var oBar = document.getElementById("ShopScrollbarHandle");
            if (e.touches && e.touches.length > 0) {
                var clientY = e.touches[0].clientY;
                ScrollbarOriClientY = clientY;
                ScrollbarOh = oBar.offsetTop;
            }
        },

        ScrollbarMove: function (e) {
            var oBox = document.getElementById("ShopViewPortBox");
            var oCon = document.getElementById("ShopViewPort");
            var oScroll = document.getElementById("ShopScrollbar");
            var oBar = document.getElementById("ShopScrollbarHandle");
            if (e.touches && e.touches.length > 0) {
                var cY = ScrollbarOriClientY;
                var oH = ScrollbarOh;
                var spaceY = cY - oH;
                var clientY = e.touches[0].clientY;
                // var nowX = e.clientX;
                var nowY = clientY;
                // var x = nowX - spaceX;
                var y = nowY - spaceY;
                // oBar.style.left = x + "px";
                //比例问题：bar的移动距离/bar的可以移动的距离 = content的移动距离 / content可以移动的距离
                //content的移动距离 = y/bar的可以移动的距离 * content可以移动的距离
                var baHeight = oScroll.offsetHeight - oBar.offsetHeight;

                y = y < 0 ? y = 0 : y;
                y = y > baHeight ? baHeight : y;

                var conHeight = oCon.offsetHeight - oBox.offsetHeight;

                var conY = y * conHeight / baHeight;
                var barY = y + 20;
                oBar.style.top = barY + "px";
                oCon.style.marginTop = -conY + "px";
                DataFunction.Shop.CurScrollbarTop = barY + "px";
                DataFunction.Shop.CurViewPortMarginTop = -conY + "px";
            }
        },

        PageTouchStart: function (e) {
            if (e.target.tagName === 'a' || e.target.tagName === 'A') {
                var id = e.target.attributes.data.value;
                DataFunction.Shop.GoToDetailPage(id);
                return;
            }
            var oCon = document.getElementById("ShopViewPort");
            var oBar = document.getElementById("ShopScrollbarHandle");
            if (e.touches && e.touches.length > 0) {
                PageOriClientY = e.touches[0].clientY;
                if (oCon.style.marginTop === "") {
                    PagebarOh = 0;
                } else {
                    PagebarOh = parseInt(oCon.style.marginTop);
                }
                ScrollbarOh = oBar.offsetTop;
            }
        },

        PageTouchMove: function (e) {
            if (e.target.tagName === 'a' || e.target.tagName === 'A')
                return;
            var oBox = document.getElementById("ShopViewPortBox");
            var oCon = document.getElementById("ShopViewPort");
            var oScroll = document.getElementById("ShopScrollbar");
            var oBar = document.getElementById("ShopScrollbarHandle");
            if (e.touches && e.touches.length > 0) {
                var cY = PageOriClientY;
                var clientY = e.touches[0].clientY;
                // var nowX = e.clientX;
                var nowY = clientY;
                // var x = nowX - spaceX;
                var y = cY - nowY;
                // oBar.style.left = x + "px";
                //比例问题：bar的移动距离/bar的可以移动的距离 = content的移动距离 / content可以移动的距离
                //content的移动距离 = y/bar的可以移动的距离 * content可以移动的距离
                var baHeight = oScroll.offsetHeight - oBar.offsetHeight;

                var conHeight = oCon.offsetHeight - oBox.offsetHeight;
                var conY = -PagebarOh + y;
                if (conY < -10)
                    return;
                if (conY > conHeight)
                    return;
                var fixedBarY = y * baHeight / conHeight;
                var barY = ScrollbarOh + fixedBarY;
                oBar.style.top = barY + "px";
                oCon.style.marginTop = -conY + "px";
            }
        },

        RefreashScrollbar: function () {
            var oBox = document.getElementById("ShopViewPortBox");
            var oCon = document.getElementById("ShopViewPort");
            var oScroll = document.getElementById("ShopScrollbar");
            var oBar = document.getElementById("ShopScrollbarHandle");
            var shopScrollView = document.getElementById("ShopScrollView");
            if (oCon && shopScrollView && oCon.offsetHeight > 0) {
                if (oBox.offsetHeight / oCon.offsetHeight >= 1) {
                    shopScrollView.style.display = "none";
                } else {
                    shopScrollView.style.display = "block";
                }
                oBar.style.top = "20px";
                oCon.style.marginTop = "0px";
                console.log("oCon.offsetHeight :" + oCon.offsetHeight)
                var height = parseInt(oBox.offsetHeight * oScroll.offsetHeight) / parseInt(oCon.offsetHeight);
                oBar.style.height = height + "px";
            } else {
                setTimeout(DataFunction.Shop.RefreashScrollbar, 300);
            }
        },

        //详情页回到商城页调用
        ResetScrollbar: function () {
            var oBox = document.getElementById("ShopViewPortBox");
            var oCon = document.getElementById("ShopViewPort");
            var oScroll = document.getElementById("ShopScrollbar");
            var oBar = document.getElementById("ShopScrollbarHandle");
            var shopScrollView = document.getElementById("ShopScrollView");
            if (oCon && shopScrollView && oCon.offsetHeight > 0) {
                if (oBox.offsetHeight / oCon.offsetHeight >= 1) {
                    shopScrollView.style.display = "none";
                } else {
                    shopScrollView.style.display = "block";
                }
                console.log("oCon.offsetHeight :" + oCon.offsetHeight)
                var height = parseInt(oBox.offsetHeight * oScroll.offsetHeight) / parseInt(oCon.offsetHeight);
                oBar.style.height = height + "px";
            } else {
                setTimeout(DataFunction.Shop.ResetScrollbar, 300);
            }
        },

        GetMallAdText: function () {
            var result = '';
            var mallObj = Manager.Datas.Mall;
            if (mallObj && mallObj.MallAD) {
                result = mallObj.MallAD;
            }
            return result;
        },
        GetStores: function () {
            var stores = new Array();
            var mallObj = Manager.Datas.Mall;
            if (mallObj && mallObj.StoreList) {
                for (let [k, v] of mallObj.StoreList) {
                    stores.push(v);
                }
            }
            return stores;
        },
        SelectStore: function (index) {
            console.log("SelectStore index :" + index);
            DataFunction.Shop.StoreSelect = index;
            var stores = DataFunction.Shop.GetStores();
            if (stores.length > index) {
                var store = stores[index];

                DataFunction.Shop.ListDatas = [];

                if (store.CommodityList) {
                    for (let [k, v] of store.CommodityList) {
                        DataFunction.Shop.ListDatas.push(v);
                    }
                }

                setTimeout(DataFunction.Shop.RefreshStoreImages, 50)

                setTimeout(DataFunction.Shop.RefreashScrollbar, 300);
            }
        },
        RefreshStoreImages: function () {
            for (var i = 0; i < DataFunction.Shop.ListDatas.length; i++) {
                Edbox.Resource.GetImage(DataFunction.Shop.ListDatas[i].Image, function (url) {
                    DataFunction.Shop.ListDatas[i].ImgSource = url;
                }, function (error) {
                    Console.error(error);
                });
            };
            DataFunction.Apply();
        },
        GetRemainTime: function (remainTime) {
            var remainTimeStr = "";
            var curTime = new Date();
            var timeSpan = remainTime.getTime() - curTime.getTime();
            if (remainTime && timeSpan > 0) {
                var day = Math.floor(timeSpan / (24 * 3600 * 1000));
                var dayLeave = timeSpan % (24 * 3600 * 1000);
                var hours = Math.floor(dayLeave / (3600 * 1000));
                if (day > 0) {
                    remainTimeStr = day + "天" + hours + "小时";
                } else {
                    var hourLeave = dayLeave % (3600 * 1000);
                    var minutes = Math.floor(hourLeave / (60 * 1000));
                    remainTimeStr = hours + "小时" + minutes + "分钟";
                }
            }
            return remainTimeStr;
        },
        GetDiamonPrice: function (priceMap) {
            var price = 0;
            if (priceMap) {
                for (let [k, v] of priceMap) {
                    if (k.ID === "Diamond") {
                        price = v;
                    }
                }
            }
            return price;
        },
        GetCoinPrice: function (priceMap) {
            var price = 0;
            if (priceMap) {
                for (let [k, v] of priceMap) {
                    if (k.ID === "Coin") {
                        price = v;
                    }
                }
            }
            return price;
        },
        GoToDetailPage: function (id) {
            DataFunction.Shop.CurCommodity = null;
            var commoditys = DataFunction.Shop.ListDatas;
            if (id && commoditys) {
                for (var i = 0; i < commoditys.length; i++) {
                    var commodity = commoditys[i];
                    if (commodity.GUID === id) {
                        DataFunction.Shop.CurCommodity = commodity;
                        if (commodity.ImgSource && commodity.ImgSource == "") {
                            DataFunction.Shop.CurCommodity.ImgSource = "";
                            Edbox.Resource.GetImage(commodity.Image, function (url) {
                                DataFunction.Shop.CurCommodity.ImgSource = url;
                            }, function (error) {
                                Console.error(error);
                            })
                        }

                        location.hash = "#!/Itemdetail";
                        return;
                    }
                }
            }
            console.error("commodity no found!");
        },
        Close: function () {
            Manager.Functions.Dispose();
        },
        ReturnToMall: function () {
            location.hash = "#!/Mall";
            DataFunction.Shop.ResetScrollbar();
        },
        /**
         * 初始化
         */
        Init: function () {
            DataFunction.Shop = Manager.Shop;
            var shop = DataFunction.Shop;
            shop.Datas = shop.EmptyData;

			/**
			 * 伪造数据
			 */
            //var mall = new Object();
            //mall.MallAD = "健康大吉史凯乐大家了肯德基啊刻录机的刻录机开了接口来旧考虑1金坷垃1健康路就考虑金坷垃1旧林凯旧1会计考虑加考虑旧考虑2考虑";
            //mall.GameCurrencyList = new Map();
            //mall.StoreList = new Map();
            //var propObj1 = new Object();
            //propObj1.ID = "Diamond";
            //propObj1.PropName = "钻石";
            //propObj1.Icon = "";
            //propObj1.Description = "";
            //propObj1.ExpireTime = new Date(2019, 3, 1);
            //propObj1.IsGameCurrency = false;
            //var prop1 = propObj1;
            //var propObj2 = new Object();
            //propObj2.ID = "Coin";
            //propObj2.PropName = "金币";
            //propObj2.Icon = "";
            //propObj2.Description = "";
            //propObj2.ExpireTime = new Date(2019, 3, 1);
            //propObj2.IsGameCurrency = true;
            //var prop2 = propObj2;
            //mall.GameCurrencyList.set("prop1", prop1);
            //mall.GameCurrencyList.set("prop2", prop2);
            //for (var i = 0; i < 10; i++) {
            //    var store = new Object();
            //    store.StoreName = "商店" + i;
            //    store.CommodityList = new Map();
            //    var count = i + 1;
            //    for (var j = 0; j < 10 * count; j++) {
            //        var commodity = new Object();
            //        var id = count * 1000 + j;
            //        commodity.GUID = "abc-123-anc-31294932-" + id;
            //        commodity.CommodityName = "测试" + j;
            //        commodity.Image = "5fa90699-075c-46b7-853f-7ef3536f1486";
            //        commodity.Description = "测试商品描述" + i + " , 测试商品描述" + j + ", 测试商品描述" + i + " , 测试商品描述" + j + ", 测试商品描述" + i + " , 测试商品描述" + j + ", 测试商品描述" + i + " , 测试商品描述" + j + ", 测试商品描述" + i + " , 测试商品描述" + j;
            //        commodity.EndSaleTime = new Date(2019, 3, 1);
            //        commodity.Price = new Map();
            //        commodity.Price.set(prop1, count);
            //        commodity.Price.set(prop2, j);
            //        store.CommodityList.set(count * j + '', commodity);
            //    }
            //    mall.StoreList.set(i + '', store);
            //}

            //Manager.Datas = mall;
            //DataFunction.Shop.SelectStore(0);

            Edbox.Start(function () {
                shop.SelectFirstTab(0);
            });
        }
    },

    /**
     * 初始化
     */
    Init: function () {
        Datas.Functions = Manager.Functions;
        DataFunction.ScrollInit = function () {
            $(".Content").scroll(function () {
                var scrollTop = $(this).scrollTop();    			//滚动条距离顶部的高度
                var scrollHeight = $(".Content")[0].scrollHeight * 0.8;   	//当前页面的总高度
                var clientHeight = $(this).height();    			//当前可视的页面高度
                if (scrollTop > 10 && scrollTop + clientHeight >= scrollHeight) {   //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 
                    DataFunction.Apply();
                }
            });
        };

        Manager.Shop.Init();

        function messageCallBack(data) {
            data = data.data;
            if (data && data.Datas && data.Page) {
                Manager.Datas = data.Datas;
                var page = data.Page;
                var id = data[data.Page + "GUID"];
            }
        }

        window.addEventListener('message', messageCallBack, false);
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
        "Mall",
        "Itemdetail"
    ];

    routes.forEach(function (route) {
        setRoutes(route);
    });

    $routeProvider.when("/", {
        redirectTo: "/Mall"
    }).when("/404", {
        redirectTo: "/Mall"
    }).otherwise({
        redirectTo: "/Mall"
    });
}]);