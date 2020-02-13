/**
 * UtilBarn商城组件
 * 用于UtilBarn平台的商城组件,用于实现商城、商店、商品的管理
 * @author 温荣泉(201901)
 * @version 0.0.0.1 (2019年04月17日 14:35:06)
 * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn商城组件
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用组件
 *      UtilBarn.Request:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用请求授权组件
 *      UtilBarn.Prop:http://ndsdn.nd.com.cn/index.php?title=UtilBarn道具组件
 *      UtilBarn.Store:http://ndsdn.nd.com.cn/index.php?title=UtilBarn商城组件#.E5.95.86.E5.BA.97.E6.A8.A1.E5.9D.97
 *      UtilBarn.Commodity:http://ndsdn.nd.com.cn/index.php?title=UtilBarn商城组件#.E5.95.86.E5.93.81.E6.A8.A1.E5.9D.97
 * */
UtilBarn.Mall = function (obj) {
    var self = this;

    /**
     * 是否启用
     * Enable
     * Type : Boolean
     * Default Value : false
     */
    this.Enable = obj && obj.Enable || false;

    /**
     * 游戏内的唯一ID
     * Unique ID
     * Type : Text
     * Default Value : 
     */
    this.ID = obj && obj.ID || "";

    /**
     * 服务器上的唯一ID
     * Unique ID On Server
     * Type : Text
     * Default Value : 
     */
    this.GUID = obj && obj.GUID || "";

    /**
     * 商城名称
     * Mall Name
     * Type : Text
     * Default Value : 商店
     */
    this.MallName = obj && obj.MallName || "商店";

    /**
     * 商城入口图标
     * Mall Entrance Icon
     * Type : Image
     * Default Value : 
     */
    this.MallIcon = obj && obj.MallIcon || "";

    /**
     * 商城背景
     * Mall Background Image
     * Type : Image
     * Default Value : 
     */
    this.BackgroundImage = obj && obj.BackgroundImage || "";

    /**
     * 打开商城音效
     * Open Mall Audio
     * Type : Audio
     * Default Value : 
     */
    this.OpenAudio = obj && obj.OpenAudio || "";

    /**
     * 关闭商城音效
     * Close Mall Audio
     * Type : Audio
     * Default Value : 
     */
    this.CloseAudio = obj && obj.CloseAudio || "";

    /**
     * 商城广告文
     * Mall AD
     * Type : LongText
     * Default Value : 
     */
    this.MallAD = obj && obj.MallAD || "";

    /**
     * 商店列表
     * Store List
     * Type : Array
     * ArrayType : Store
     * Default Value : null
     */
    this.StoreList = obj && obj.StoreList || new Array();

    /**
     * 购买确认提示
     * Purchase Confirmation Prompt
     * Type : Array
     * ArrayType : Text
     * Default Value : null
     */
    this.PurchaseConfirmationPrompt = obj && obj.PurchaseConfirmationPrompt || new Array();

    /**
     * 购买成功提示
     * Purchase Success Prompt
     * Type : Array
     * ArrayType : Text
     * Default Value : null
     */
    this.PurchaseSuccessPrompt = obj && obj.PurchaseSuccessPrompt || new Array();

    /**
     * 购买失败提示
     * Purchase Failure Prompt
     * Type : Array
     * ArrayType : Text
     * Default Value : null
     */
    this.PurchaseFailurePrompt = obj && obj.PurchaseFailurePrompt || new Array();

    /**
     * 余额不足提示
     * Insufficient Balance Prompt
     * Type : Array
     * ArrayType : Text
     * Default Value : null
     */
    this.InsufficientBalancePrompt = obj && obj.InsufficientBalancePrompt || new Array();

    /**
     * 达到购买上限提示
     * Purchase Limit Prompt
     * Type : Array
     * ArrayType : Text
     * Default Value : null
     */
    this.PurchaseLimitPrompt = obj && obj.PurchaseLimitPrompt || new Array();

    /**
     * 购买按钮文字
     * Purchase Button Text
     * Type : Text
     * Default Value : 
     */
    this.PurchaseButtonText = obj && obj.PurchaseButtonText || "";

    /**
     * 提示框背景
     * Tip Box Background
     * Type : Image
     * Default Value : 
     */
    this.TipBoxBackground = obj && obj.TipBoxBackground || "";

    /**
     * 商品详情背景
     * Product Details Background
     * Type : Image
     * Default Value : 
     */
    this.CommodityDetailsBackground = obj && obj.CommodityDetailsBackground || "";

    /**
     * 商品底框
     * Commodity Bottom Frame
     * Type : Image
     * Default Value : 
     */
    this.CommodityBottomFrame = obj && obj.CommodityBottomFrame || "";

    /**
     * 关闭按钮图片
     * Close Button Image
     * Type : Image
     * Default Value : 
     */
    this.CloseButtonImage = obj && obj.CloseButtonImage || "";

    /**
     * 按钮底框
     * Button Bottom Frame
     * Type : Image
     * Default Value : 
     */
    this.ButtonBottomFrame = obj && obj.ButtonBottomFrame || "";

    /**
     * 按钮点击音效
     * Button Click Sound
     * Type : Audio
     * Default Value : 
     */
    this.ButtonClickSound = obj && obj.ButtonClickSound || "";

    return this;
};

/**
 * 通过服务器验证配置表的数据
 * Verify the data of the configuration table through the server
 * @param {Function} success 成功回调 , 带Function参数Mall , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Mall.prototype.Get = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/mall/mall/actions/get_mall_info_by_guid";
    var data = "guid=" + self.GUID;
    UtilBarn.Mall.ServerGet(subUrl, data, function (data) {
        self.GUID = data.guid;
        self.MallName = data.name;
        self.Enable = data.status === 0;
        if (success) success(self);
    }, error);
};

/**
 * 通过服务器保存数据
 * Save data through the server
 * @param {Function} success 成功回调 , 带Function参数Mall , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Mall.prototype.Set = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/mall/mall/actions/set_mall";
    var obj = {
        guid: self.GUID,
        name: self.MallName,
        status: self.Enable ? 0 : 1,
        res_id: UtilBarn.PackageGuid,
        person_guid: UtilBarn.GameId,
        person_version: UtilBarn.Version
    };
    UtilBarn.Mall.ServerPost(subUrl, obj, function (data) {
        if (data.guid)
            self.GUID = data.guid;
        if (success) success(self);
    }, error);
};

/**
 * 通过服务器删除数据
 * Delete data through the server
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Mall.prototype.Delete = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/mall/mall/actions/delete_mall";
    var obj = {
        guid: self.GUID
    };
    UtilBarn.Mall.ServerPost(subUrl, obj, function (data) {
        self.GUID = "";
        if (success) success();
    }, error);
};

/**
 * 创建商店
 * Create Store
 * @param {Function} success 成功回调 , 带Function参数Store , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Mall.prototype.CreateStore = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/mall/mall/actions/create_shop";
    var obj = {
        mall_guid: self.GUID,
        name: "New Store"
    };
    UtilBarn.Mall.ServerPost(subUrl, obj, function (data) {
        var store = new UtilBarn.Store({ GUID: data.guid });
        store.ID = store && store.ID || UtilBarn.GetGUID();

        store.StoreName = obj.name;
        store.Mall = self;
        UtilBarn.Array.Add(self.StoreList, store);
        if (success) success(store);
    }, error);
};

/**
 * 打开UI
 * Open UI
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Mall.prototype.Open = function (success, error) {
    var com = UtilBarn.Mall;

    // 发送消息
    function sendMessage(data) {
        com.UIFrame.contentWindow.postMessage(data, "*");
    }

    if (!com.UIFrame) {
        if (error) error("Uninitialized");
        return;
    }

    com.UIFrame.SuccessFunction = function (info) {
        success(info);
    };
    com.UIFrame.ErrorFunction = function (err) {
        error(err);
    };

    com.UIFrame.style.display = "block";

    var data = new Object();
    var json = UtilBarn.Mall.GetJson();
    data.Datas = JSON.parse(json).Mall;

    data.Page = "Mall";

    json = JSON.stringify(UtilBarn.Economic.CurrencyList);
    data.Economic = JSON.parse(json);

    console.log(data);

    sendMessage(data);
};

/**
 * 当前实例
 * Current Instance
 * Type : Mall
 * Default Value : null
 */
UtilBarn.Mall.Current = null;

/**
 * 购买回调
 * Buy Callback
 * Type : Function
 * FunctionType : [Commodity , Int]
 * Default Value : null
 */
UtilBarn.Mall.BuyCallback = null;

/**
 * 商品是否可以购买判断方法，返回是否
 * Whether the product can be purchased as a judgment method, return True or False
 * Type : Function
 * FunctionType : [Commodity , Int]
 * Function Return Type : Boolean
 * Default Value : null
 */
UtilBarn.Mall.CanBuyJudgeFunction = null;

/**
 * 根据配置表Json数据获取配置表初始化商城
 * According to the configuration table Json data acquisition configuration table initialization mall
 * @param {String} data 配置表Json数据 , 不允许为空
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Mall.Init = function (data, success, error) {
    UtilBarn.Mall.CanBuyJudgeFunction = function (commodity, count) {
        return true;
    };

    var com = UtilBarn.Mall;
    var obj = JSON.parse(data).Mall;

    var info = new UtilBarn.Mall(obj);
    info.ID = info && info.ID || UtilBarn.GetGUID();

    if (info.GUID) {
        info.Get(function (data) {
            HandleMallData(data, com, obj);
        }, error);
    }
    else {
        getGameMallGUID(function (data) {
            HandleMallData(data, com, obj);
        }, function () {
            info.Set(function (data) {
                HandleMallData(data, com, obj);
            }, error);
        });
    }

    function getGameMallGUID(success, error) {
        var subUrl = "/v0.1/api/mall/mall/actions/get_mall_info_by_personid_and_version";
        var data = "person_guid=" + UtilBarn.GameId + "&person_version=" + UtilBarn.Version;
        UtilBarn.Mall.ServerGet(subUrl, data, function (data) {
            info.GUID = data.guid;
            info.Enable = data.status === 0;
            if (success) success(info);
        }, error);
    }

    function HandleMallData(ans, com, obj) {
        com.Current = ans;
        ans.StoreList = new Array();
        if (!obj.StoreList) {
            if (success) success();
            return;
        }
        for (var i = 0; i < obj.StoreList.length; i++) {
            var store = obj.StoreList[i];
            var info = new UtilBarn.Store(store);
            console.log(store);
            info.Get(function (data) {
                console.log(obj.StoreList[i]);
                HandleStoreData(data, ans, store);
            }, error);
        }
        if (success) success();
    }

    function HandleStoreData(ans, com, obj) {
        UtilBarn.Array.Add(com.StoreList, ans);
        ans.CommodityList = new Array();
        for (var i = 0; i < obj.CommodityList.length; i++) {
            var commodity = obj.CommodityList[i];
            var info = new UtilBarn.Commodity(commodity);
            info.Get(function (data) {
                HandleCommodityData(data, ans, commodity);
            }, error);
        }
    }

    function HandleCommodityData(ans, com, obj) {
        UtilBarn.Array.Add(com.CommodityList, ans);
        var info = new UtilBarn.Prop(obj.BindingProp);
        info.Get(function (data) {
            ans.BindingProp = data;
        }, error);
    }
};

/**
 * 获取商城中的所有商店
 * Get all the items in the mall
 * @param {Function} success 成功回调 , 带Function参数Array , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Mall.GetList = function (success, error) {
    if (!UtilBarn.Mall.Current || !UtilBarn.Mall.Current.StoreList) {
        if (error) error("Uninitialized");
        return;
    }
    if (success) success(UtilBarn.Mall.Current.StoreList);
};

/**
 * 获取配置表Json
 * Get the configuration table Json
 * @returns {String} 配置表Json
 */
UtilBarn.Mall.GetJson = function () {
    var current = UtilBarn.Mall.Current;
    var conf = new Object();
    conf.Mall = new Object();

    function SetKeys(current, conf, continuefunc) {
        var keys = Object.keys(current);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (continuefunc && continuefunc(key)) continue;
            conf[key] = current[key];
        }
    }

    function HandleCommodityList(current, conf) {
        var list = current.CommodityList;
        conf.CommodityList = new Array();

        for (var i = 0; i < list.length; i++) {
            var info = new Object();

            SetKeys(list[i], info, function (key) {
                if (key === "Store") return true;
                return false;
            });

            UtilBarn.Array.Add(conf.CommodityList, info);
        }
    }

    function HandleStoreList(current, conf) {
        var list = current.StoreList;
        conf.StoreList = new Array();

        for (i = 0; i < list.length; i++) {
            var info = new Object();

            SetKeys(list[i], info, function (key) {
                if (key === "CommodityList" || key === "Mall") return true;
                return false;
            });

            HandleCommodityList(list[i], info);

            UtilBarn.Array.Add(conf.StoreList, info);
        }
    }

    SetKeys(current, conf.Mall, function (key) {
        if (key === "StoreList") return true;
        return false;
    });
    HandleStoreList(current, conf.Mall);

    return JSON.stringify(conf);
};

/**
 * 打开商城UI
 * Open Mall UI
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Mall.OpenMall = function (success, error) {
    UtilBarn.Mall.Current.Open(success, error);
};

/**
 * UtilBarn商城组件商店模块
 * 用于UtilBarn平台的商城组件,用于实现商店的管理
 * @author 温荣泉(201901)
 * @version 0.0.0.1 (2019年04月17日 14:38:15)
 * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn商城组件#.E5.95.86.E5.BA.97.E6.A8.A1.E5.9D.97
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用组件
 *      UtilBarn.Request:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用请求授权组件
 *      UtilBarn.Prop:http://ndsdn.nd.com.cn/index.php?title=UtilBarn道具组件
 *      UtilBarn.Commodity:http://ndsdn.nd.com.cn/index.php?title=UtilBarn商城组件#.E5.95.86.E5.93.81.E6.A8.A1.E5.9D.97
 * */
UtilBarn.Store = function (obj) {
    var self = this;

    /**
     * 游戏内的唯一ID
     * Unique ID
     * Type : Text
     * Default Value : 
     */
    this.ID = obj && obj.ID || "";

    /**
     * 服务器上的唯一ID
     * Unique ID On Server
     * Type : Text
     * Default Value : 
     */
    this.GUID = obj && obj.GUID || "";

    /**
     * 商店名称
     * Store Name
     * Type : Text
     * Default Value : 
     */
    this.StoreName = obj && obj.StoreName || "";

    /**
     * 商品列表
     * Commodity List
     * Type : Array
     * ArrayType : Commodity
     * Default Value : 
     */
    this.CommodityList = obj && obj.CommodityList || new Array();

    return this;
};

/**
 * 通过服务器验证配置表的数据
 * Verify the data of the configuration table through the server
 * @param {Function} success 成功回调 , 带Function参数Store , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Store.prototype.Get = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/mall/mall/actions/get_mall_shop_list";
    var obj = {
        guids: [self.GUID]
    };
    UtilBarn.Mall.ServerPost(subUrl, obj, function (data) {
        if (!data.items || data.items.length < 1) {
            if (error) error(data);
            return;
        }
        var info = data.items[0];
        self.GUID = info.guid;
        self.StoreName = info.name;
        if (success) success(self);
    }, error);
};

/**
 * 通过服务器保存数据
 * Save data through the server
 * @param {Function} success 成功回调 , 带Function参数Store , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Store.prototype.Set = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/mall/mall/actions/update_shop";
    var obj = {
        guid: self.GUID,
        name: self.StoreName
    };
    UtilBarn.Mall.ServerPost(subUrl, obj, function (data) {
        if (success) success(self);
    }, error);
};

/**
 * 通过服务器删除数据
 * Delete data through the server
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Store.prototype.Delete = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/mall/mall/actions/delete_shop";
    var obj = {
        guid: self.GUID
    };

    UtilBarn.Mall.ServerPost(subUrl, obj, function (data) {
        UtilBarn.Array.Remove(self.Mall.StoreList, self);
        if (success) success();
    }, error);
};

/**
 * 创建商品
 * Create Commodity
 * @param {Function} success 成功回调 , 带Function参数Commodity , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Store.prototype.CreateCommodity = function (success, error) {
    var self = this;

    var commodity = new UtilBarn.Commodity({
        ID: UtilBarn.GetGUID(),
        CommodityName: "New Commodity"
    });
    commodity.Store = self;

    commodity.Set(function () {
        UtilBarn.Array.Add(self.CommodityList, commodity);
        if (success) success(commodity);
    }, error);
};

/**
 * 打开UI
 * Open UI
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Store.prototype.Open = function (success, error) {
    var self = this;

    var com = UtilBarn.Mall;

    // 发送消息
    function sendMessage(data) {
        com.UIFrame.contentWindow.postMessage(data, "*");
    }

    if (!com.UIFrame) {
        if (error) error("Uninitialized");
        return;
    }

    com.UIFrame.SuccessFunction = function (info) {
        success(info);
    };
    com.UIFrame.ErrorFunction = function (err) {
        error(err);
    };

    com.UIFrame.style.display = "block";

    var data = new Object();
    var json = UtilBarn.Mall.GetJson();
    data.Datas = JSON.parse(json);

    data.Page = "Store";
    data.StoreGUID = self.GUID;

    json = JSON.stringify(UtilBarn.Economic.CurrencyList);
    data.Economic = JSON.parse(json);

    console.log(data);

    sendMessage(data);
};

/**
 * 获取商店根据商店GUID
 * Get Store based on Store GUID
 * @param {String} guid GUID值 , 不允许为空
 * @param {Function} success 成功回调 , 带Function参数Store , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Store.GetByGUID = function (guid, success, error) {
    UtilBarn.Mall.GetList(function (list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].GUID === guid) {
                if (success) success(list[i]);
                return;
            }
        }
        if (error) error("Invalid GUID");
    }, error);
};

/**
 * UtilBarn商城组件商品模块
 * 用于UtilBarn平台的商城组件,用于实现商品的管理
 * @author 温荣泉(201901)
 * @version 0.0.0.1 (2019年04月17日 14:38:15)
 * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn商城组件#.E5.95.86.E5.93.81.E6.A8.A1.E5.9D.97
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用组件
 *      UtilBarn.Request:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用请求授权组件
 *      UtilBarn.Prop:http://ndsdn.nd.com.cn/index.php?title=UtilBarn道具组件
 *      UtilBarn.Currency:http://ndsdn.nd.com.cn/index.php?title=UtilBarn经济组件#.E8.B4.A7.E5.B8.81.E6.A8.A1.E5.9D.97
 * */
UtilBarn.Commodity = function (obj) {
    var self = this;

    /**
     * 游戏内的唯一ID
     * Unique ID
     * Type : Text
     * Default Value : 
     */
    this.ID = obj && obj.ID || "";

    /**
     * 服务器上的唯一ID
     * Unique ID On Server
     * Type : Text
     * Default Value : 
     */
    this.GUID = obj && obj.GUID || "";

    /**
     * 位置
     * Index
     * Type : Int
     * Default Value : 0
     */
    this.Index = obj && obj.Index || 0;

    /**
     * 商品名称
     * Commodity Name
     * Type : Text
     * Default Value : 
     */
    this.CommodityName = obj && obj.CommodityName || "";

    /**
     * 商品图片
     * Commodity Image
     * Type : Image
     * Default Value : 
     */
    this.Image = obj && obj.Image || "";

    /**
     * 商品介绍
     * Commodity Description
     * Type : Text
     * Default Value : 
     */
    this.Description = obj && obj.Description || "";

    /**
     * 开始出售时间
     * Start Sale Time
     * Type : DateTime
     * Default Value : null
     */
    this.StartSaleTime = obj && obj.StartSaleTime || null;

    /**
     * 结束出售时间
     * End Sale Time
     * Type : DateTime
     * Default Value : null
     */
    this.EndSaleTime = obj && obj.EndSaleTime || null;

    /**
     * 是否库存限制
     * Is Inventory Limit
     * Type : Boolean
     * Default Value : true
     */
    this.IsInventoryLimit = obj && obj.IsInventoryLimit || true;

    /**
     * 库存限制
     * Inventory Limit
     * Type : Int
     * Default Value : 0
     */
    this.InventoryLimit = obj && obj.InventoryLimit || 0;

    /**
     * 是否商品限购
     * Is Purchase Limit
     * Type : Boolean
     * Default Value : true
     */
    this.IsPurchaseLimit = obj && obj.IsPurchaseLimit || true;

    /**
     * 商品限购类型枚举
     * Purchase Limit Type Enum
     */
    var PurchaseLimitTypeEnum = {
        /**
         * Day
         */
        Day: 0,
        /**
         * Week
         */
        Week: 1,
        /**
         * Total
         */
        Total: 2
    };

    /**
     * 商品限购类型
     * Purchase Limit Type
     * Type : Enum
     * EnumType : [Day , Week , Total]
     * Default Value : 0
     */
    this.PurchaseLimitType = obj && obj.PurchaseLimitType || PurchaseLimitTypeEnum.Day;

    /**
     * 商品限购
     * Purchase Limit
     * Type : Int
     * Default Value : 0
     */
    this.PurchaseLimit = obj && obj.PurchaseLimit || 0;

    /**
     * 绑定道具
     * Binding Prop
     * Type : Prop
     * Default Value : null
     */
    this.BindingProp = obj && obj.BindingProp || null;

    /**
     * 绑定道具数量
     * Binding Prop Count
     * Type : Int
     * Default Value : 1
     */
    this.BindingPropCount = obj && obj.BindingPropCount || 1;

    /**
     * 商品价格
     * Commodity Price
     * Type : Map
     * MapType : [Currency , Int]
     * Default Value : null
     */
    this.Price = obj && obj.Price || new Dictionary();

    return this;
};

/**
 * 通过服务器验证配置表的数据
 * Verify the data of the configuration table through the server
 * @param {Function} success 成功回调 , 带Function参数Commodity , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Commodity.prototype.Get = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/mall/mall/actions/get_shop_item_list_by_itemids";
    var obj = {
        guids: [self.GUID]
    };

    UtilBarn.Mall.ServerPost(subUrl, obj, function (data) {
        if (data && data.items && data.items.length > 0) {
            // 货品
            self.ID = data.items[0].item_id;
            self.CommodityName = data.items[0].item_name;
            self.BindingPropCount = data.items[0].item_amount;

            // 库存限制
            self.IsInventoryLimit = data.items[0].limit_amount_off === 1;
            self.InventoryLimit = data.items[0].limit_sell_amount;

            // 商品限购
            self.IsPurchaseLimit = data.items[0].limit_date_off === 1;
            self.PurchaseLimitType = data.items[0].limit_date_type === 0 ? 2 : self.PurchaseLimitType === 2 ? 1 : 0;
            self.PurchaseLimit = data.items[0].limit_date_amount;

            self.StartSaleTime = UtilBarn.Mall.GetTime(data.items[0].start_time_sell);
            self.EndSaleTime = UtilBarn.Mall.GetTime(data.items[0].end_time_sell);

            self.Price = UtilBarn.Mall.ParsePriceArray(data.items[0].item_payment_list);
        }
        if (success) success(self);
    }, error);
};

/**
 * 通过服务器保存数据
 * Save data through the server
 * @param {Function} success 成功回调 , 带Function参数Commodity , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Commodity.prototype.Set = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/mall/mall/actions/set_shop_item_info";
    var obj = {
        guid: self.GUID,
        shop_guid: self.Store.GUID,

        // 货品
        item_id: self.BindingProp ? self.BindingProp.GUID : self.ID,
        item_name: self.CommodityName,
        item_amount: self.BindingPropCount,

        // 库存限制
        limit_amount_off: self.IsInventoryLimit ? 1 : 0,
        limit_sell_amount: self.InventoryLimit,

        // 商品限购
        limit_date_off: self.IsPurchaseLimit ? 1 : 0,
        limit_date_type: self.PurchaseLimitType >= 2 ? 0 : self.PurchaseLimitType === 1 ? 2 : 1,
        limit_date_amount: self.PurchaseLimit,

        // 限购时间
        start_time_sell: self.StartSaleTime ? UtilBarn.Mall.GetTimeNumber(self.StartSaleTime) : 0,
        end_time_sell: self.EndSaleTime ? UtilBarn.Mall.GetTimeNumber(self.EndSaleTime) : 0,

        payment_arr: UtilBarn.Mall.GetPriceArray(self.Price)
    };

    UtilBarn.Mall.ServerPost(subUrl, obj, function (data) {
        self.GUID = data.guid;
        if (success) success(self);
    }, error);
};

/**
 * 通过服务器删除数据
 * Delete data through the server
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Commodity.prototype.Delete = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/mall/mall/actions/delete_shop_item";
    var obj = {
        guid: self.GUID
    };

    UtilBarn.Mall.ServerPost(subUrl, obj, function (data) {
        UtilBarn.Array.Remove(self.Store.CommodityList, self);
        if (success) success();
    }, error);
};

/**
 * 购买
 * Buy
 * @param {Object} Currency 支付货币类型 , 不允许为空
 * @param {Number} Count 购买数量 , 允许为空
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Commodity.prototype.Buy = function (Currency, Count, success, error) {
    var self = this;
    var subUrl = "/v0.1/api/mall/mall/actions/item_payment";
    var obj = {
        shop_item_guid: self.GUID,
        money_type: 0,
        amount: Count || 1
    };

    var price = self.Price.Get(Currency);
    if (price) {
        obj.pay_item_id = UtilBarn.Currency.GetGoldType(Currency.Index);
        obj.pay_gold_amount = price * Count;
    }
    else {
        if (error) error("Currency Error");
        return;
    }

    if (!UtilBarn.Mall.CanBuyJudgeFunction(self, Count)) {
        if (error) error("Can Buy Judge Failed");
        return;
    }

    UtilBarn.Mall.ServerPost(subUrl, obj, function (data) {
        if (UtilBarn.Backpack) {
            UtilBarn.Backpack.GainPropByMall(self.BindingProp, self.BindingPropCount * Count);
        }
        UtilBarn.Economic.UseCurrencyByMall(Currency, Count);

        if (success) success(data);
    }, error);
};

/**
 * 打开UI
 * Open UI
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Commodity.prototype.Open = function (success, error) {
    var self = this;

    var com = UtilBarn.Mall;

    // 发送消息
    function sendMessage(data) {
        com.UIFrame.contentWindow.postMessage(data, "*");
    }

    if (!com.UIFrame) {
        if (error) error("Uninitialized");
        return;
    }

    com.UIFrame.SuccessFunction = function (info) {
        success(info);
    };
    com.UIFrame.ErrorFunction = function (err) {
        error(err);
    };

    com.UIFrame.style.display = "block";

    var data = new Object();
    var json = UtilBarn.Mall.GetJson();
    data.Datas = JSON.parse(json);

    data.Page = "Commodity";
    data.CommodityGUID = self.GUID;

    json = JSON.stringify(UtilBarn.Economic.CurrencyList);
    data.Economic = JSON.parse(json);

    console.log(data);

    sendMessage(data);
};

/**
 * 获取商品根据商品GUID
 * Get Commodity based on Commodity GUID
 * @param {String} guid GUID值 , 不允许为空
 * @param {Function} success 成功回调 , 带Function参数Commodity , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Commodity.GetByGUID = function (guid, success, error) {
    UtilBarn.Mall.GetList(function (list) {
        for (var i = 0; i < list.length; i++) {
            if (!list[i].CommodityList) continue;
            for (var j = 0; j < list[i].CommodityList.length; j++) {
                if (list[i].CommodityList[j].GUID === guid) {
                    if (success) success(list[i].CommodityList[j]);
                    return;
                }
            }
        }
        if (error) error("Invalid GUID");
    }, error);
};

// 获取时间数字
UtilBarn.Mall.GetTimeNumber = function (date) {
    var year = date.getFullYear();

    if (year < 2000) return 0;

    var mon = date.getMonth();
    var day = date.getDay();
    var hour = date.getHours();
    var min = date.getMinutes();
    return min + hour * 100 + day * 10000 + mon * 1000000 + year * 100000000;
};

// 时间数字转时间
UtilBarn.Mall.GetTime = function (num) {
    if (num === 0) return null;
    var year = Math.floor(num / 100000000);
    num -= year * 100000000;
    var mon = Math.floor(num / 1000000);
    num -= mon * 1000000;
    var day = Math.floor(num / 10000);
    num -= day * 10000;
    var hour = Math.floor(num / 10000);
    num -= hour * 100;
    var min = num;
    var date = new Date(year, mon, day, hour, min, 0, 0);
    return date;
};

// 获取价格数组
UtilBarn.Mall.GetPriceArray = function (prices) {
    var array = new Array();
    var keys = prices.Keys;

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var obj = {
            pay_item_id: UtilBarn.Currency.GetGoldType(key.Index),
            money_type: 0,
            price: prices.Get(key)
        };
        UtilBarn.Array.Add(array, obj);
    }
    return array;
};

// 价格数组转化
UtilBarn.Mall.ParsePriceArray = function (arr) {
    var map = new Dictionary();
    for (var i = 0; i < arr.length; i++) {
        map.Set(UtilBarn.Currency.GetByGUID(arr[i].payItemId), arr.price);
    }
    return map;
};

// Get请求方式
UtilBarn.Mall.ServerGet = function (subUrl, data, success, error) {
    UtilBarn.Request.GetWithEnv(UtilBarn.GetHost("MMO"), subUrl, data, success, error);
};

// Post请求方式
UtilBarn.Mall.ServerPost = function (subUrl, obj, success, error) {
    UtilBarn.Request.PostWithEnv(UtilBarn.GetHost("MMO"), subUrl, JSON.stringify(obj), success, error);
};

// 初始化组件路径
UtilBarn.InitPath(UtilBarn.Mall);

// 初始化需求组件
UtilBarn.InitRequire(UtilBarn.ComponentRootPath + "UtilBarn_Prop/js/UtilBarn_Prop.js", "undefined" === typeof UtilBarn.Prop);
UtilBarn.InitRequire(UtilBarn.ComponentRootPath + "UtilBarn_Economic/js/UtilBarn_Economic.js", "undefined" === typeof UtilBarn.Economic);

// 初始化UI绘制
UtilBarn.Mall.InitFrame = function () {
    var com = UtilBarn.Mall;

    // 创建
    function create() {
        var dom = document.createElement("iframe");
        dom.style.overflow = "hidden";
        dom.style.position = "fixed";
        dom.style.top = "0";
        dom.style.left = "0";
        dom.style.height = "100%";
        dom.style.width = "100%";
        dom.style.margin = "0";
        dom.style.padding = "0";
        dom.style.border = "0";
        dom.style.zIndex = "1000";
        dom.style.display = "none";
        document.body.appendChild(dom);
        return dom;
    }

    // 隐藏
    function hide() {
        com.UIFrame.style.display = "none";
    }

    // 成功
    function success(info) {
        if (com.UIFrame.SuccessFunction) {
            com.UIFrame.SuccessFunction(info);
        }
    }

    // 出错
    function error(err) {
        if (com.UIFrame.ErrorFunction) {
            com.UIFrame.ErrorFunction(err);
        }
    }

    // 方法集
    var Functions = {
        // 购买
        Buy: function (datas) {
            var guid = datas[0].GUID;
            var currencyguid = datas[1].GUID;
            var count = datas[2];
            if (!guid) return;
            UtilBarn.Commodity.GetByGUID(guid, function (data) {
                UtilBarn.Currency.GetByGUID(currencyguid, function (currency) {
                    data.Buy(currency, count, function () {
                        success("购买成功");
                    }, error);
                }, error);
            }, error);
        },
        // 关闭组件
        Close: function (datas) {
            hide();
        },
        // 异常
        Error: function (datas) {
            var err = datas[0];
            com.UIFrame.ErrorFunction(err);
        }
    };

    // 消息回调
    function messageCallBack(data) {
        data = data.data;
        if (data && data.Type && Functions[data.Type]) {
            Functions[data.Type](data.Datas);
        }
    }

    // 发送消息
    function sendMessage(data) {
        com.UIFrame.contentWindow.postMessage(data, "*");
    }

    function init() {
        var pageurl = com.ComponentPath + "page/";
        pageurl = UtilBarn.SetQueryString("UtilBarnArgs", UtilBarn.GetLoginInfo(), pageurl);

        com.UIFrame = create();
        com.UIFrame.setAttribute("src", pageurl);

        com.UIFrame.SuccessFunction = function (info) {
            console.log(info);
        };
        com.UIFrame.ErrorFunction = function (err) {
            console.log(err);
        };

        window.addEventListener("message", messageCallBack, false);
    }

    var int = setInterval(function () {
        if (!UtilBarn.IsLogin) return;
        init();
        clearInterval(int);
    }, 100);
};
UtilBarn.Mall.InitFrame();
