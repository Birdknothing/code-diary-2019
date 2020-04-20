/**
 * Edbox经济组件
 * 用于Edbox平台的经济组件,用于实现经济系统中货币的管理
 * @author 温荣泉(201901)
 * @version 0.0.0.1 (2019年04月15日 00:20:45)
 * @see http://ndsdn.nd.com.cn/index.php?title=Edbox经济组件
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
 *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
 *      Edbox.Currency:http://ndsdn.nd.com.cn/index.php?title=Edbox经济组件#.E8.B4.A7.E5.B8.81.E6.A8.A1.E5.9D.97
 * */
Edbox.Economic = function (obj) {
    var self = this;


    return this;
};

/**
 * 货币列表
 * Currency List
 * Type : Map
 * MapType : [Currency , Int]
 * Default Value : null
 */
Edbox.Economic.CurrencyList = new Dictionary();

/**
 * 当前角色ID
 * Current Role ID
 * Type : Text
 * Default Value : 
 */
Edbox.Economic.RoleID = "";

/**
 * 货币数量变化回调
 * Currency change callback
 * Type : Function
 * FunctionType : [Currency , Int]
 * Default Value : null
 */
Edbox.Economic.ChangeCallBack = null;

/**
 * 根据配置表Json数据获取配置表初始化
 * According to the configuration table Json data acquisition configuration table initialization
 * @param {String} data 配置表Json数据 , 不允许为空
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Economic.Init = function (data, success, error) {
    Edbox.Economic.CurrencyList = new Dictionary();

    function GetCurrencyList() {
        var subUrl = "/v0.1/api/role/role/actions/select_game_role_by_id";
        var data = "game_role_id=" + Edbox.Economic.RoleID;

        Edbox.Economic.ServerGet(subUrl, data, function (data) {
            var list = Edbox.Currency.CurrencyList;

            for (var i = 0; i < list.length; i++) {
                var type = Edbox.Currency.GetGoldType(list[i].Index);
                Edbox.Economic.CurrencyList.Set(list[i], data[type] || 0);
            }

            if (success) success();
        }, error);
    }

    Edbox.Currency.Init(data, GetCurrencyList, error);
};

/**
 * 获取货币数量
 * Get the amount of money
 * @param {Object} Currency 货币类型 , 不允许为空
 * @returns {Number} 货币数量
 */
Edbox.Economic.GetCurrencyCount = function (Currency) {
    if (!CurrencyList.ContainsKey(Currency)) return 0;
    return CurrencyList.Get(Currency);
};

/**
 * 游戏内获得货币
 * Get currency in the game
 * @param {Object} Currency 货币类型 , 不允许为空
 * @param {Number} Count 数量 , 不允许为空
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Economic.GainCurrency = function (Currency, Count, success, error) {
    var subUrl = "/v0.1/api/role/role/actions/add_gold";
    var obj = {
        game_role_id: Edbox.Economic.RoleID,
        add_data: [{
            gold_key: Edbox.Currency.GetGoldType(Currency.Index),
            value: Count
        }]
    };

    Edbox.Economic.ServerPost(subUrl, obj, function (data) {
        var cnt = Edbox.Economic.CurrencyList.Get(Currency) + Count;
        Edbox.Economic.CurrencyList.Set(Currency, cnt);
        if (success) success();
    }, error);
};

/**
 * 游戏内使用货币
 * Use currency in the game
 * @param {Object} Currency 货币类型 , 不允许为空
 * @param {Number} Count 数量 , 不允许为空
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Economic.UseCurrency = function (Currency, Count, success, error) {
    var subUrl = "/v0.1/api/role/role/actions/deduct_gold";
    var obj = {
        game_role_id: Edbox.Economic.RoleID,
        deduct_data: [{
            gold_key: Edbox.Currency.GetGoldType(Currency.Index),
            value: Count
        }]
    };

    Edbox.Economic.ServerPost(subUrl, obj, function (data) {
        var cnt = Edbox.Economic.CurrencyList.Get(Currency) - Count;
        Edbox.Economic.CurrencyList.Set(Currency, cnt);
        if (success) success();
    }, error);
};

/**
 * 在商城获得货币
 * Gain currency in the mall
 * @param {Object} Currency 货币类型 , 不允许为空
 * @param {Number} Count 数量 , 不允许为空
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Economic.GainCurrencyByMall = function (Currency, Count, success, error) {
    if (Edbox.Economic.CurrencyList.ContainsKey(Currency)) {
        var cnt = Edbox.Economic.CurrencyList.Get(Currency);
        Count += cnt;
    }
    Edbox.Economic.CurrencyList.Set(Currency, Count);
    if (Edbox.Economic.ChangeCallBack) Edbox.Economic.ChangeCallBack(Currency, Count);
    if (success) success();
};

/**
 * 在商城使用货币
 * Use currency in the mall
 * @param {Object} Currency 货币类型 , 不允许为空
 * @param {Number} Count 数量 , 不允许为空
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Economic.UseCurrencyByMall = function (Currency, Count, success, error) {
    if (!Edbox.Economic.CurrencyList.ContainsKey(Currency)) {
        if (error) {
            error("Use Currency Error");
        }
        return;
    }
    var cnt = Edbox.Economic.CurrencyList.Get(Currency);
    cnt -= Count;
    if (cnt < 0) {
        if (error) {
            error("Use Currency Error");
        }
        return;
    }
    Edbox.Economic.CurrencyList.Set(Currency, cnt);
    if (Edbox.Economic.ChangeCallBack) Edbox.Economic.ChangeCallBack(Currency, cnt);
    if (success) success();
};

/**
 * Edbox经济组件货币模块
 * 用于Edbox平台的经济组件,用于实现经济系统中货币的管理
 * @author 温荣泉(201901)
 * @version 0.0.0.1 (2019年04月15日 00:31:43)
 * @see http://ndsdn.nd.com.cn/index.php?title=Edbox经济组件#.E8.B4.A7.E5.B8.81.E6.A8.A1.E5.9D.97
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
 *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
 * */
Edbox.Currency = function (obj) {
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
     * 服务器记录的货币类型(1-10)
     * Currency type recorded by the server(1-10)
     * Type : Int
     * Default Value : 
     */
    this.Index = obj && obj.Index || 0;

    /**
     * 名称
     * Name
     * Type : Text
     * Default Value : 
     */
    this.Name = obj && obj.Name || "";

    /**
     * 图标
     * Icon
     * Type : Image
     * Default Value : 
     */
    this.Icon = obj && obj.Icon || "";

    /**
     * 描述
     * Description
     * Type : LongText
     * Default Value : 
     */
    this.Description = obj && obj.Description || "";

    /**
     * 属性
     * Attribute
     * Type : Json
     * Default Value : 
     */
    this.Attribute = obj && obj.Attribute || null;

    return this;
};

/**
 * 通过服务器验证配置表的数据
 * Verify the data of the configuration table through the server
 * @param {Function} success 成功回调 , 带Function参数Currency , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Currency.prototype.Get = function (success, error) {
    var self = this;
    var list = Edbox.Currency.ServerList;
    for (var i = 0; i < list.length; i++) {
        var key = list[i];
        if (key.id === self.GUID) {
            self.ID = key.res_guid;
            self.Index = Edbox.Currency.GetGoldIndex(key.gold_type);

            if (success) success(self);
            return;
        }
    }
    if (error) error("No Data On Server");
};

/**
 * 通过服务器保存数据
 * Save data through the server
 * @param {Function} success 成功回调 , 带Function参数Currency , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Currency.prototype.Set = function (success, error) {
    var self = this;
    if (success) success(self);
};

/**
 * 通过服务器删除数据
 * Delete data through the server
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Currency.prototype.Delete = function (success, error) {
    var self = this;
    var list = Edbox.Currency.CurrencyList;
    Edbox.Array.Remove(list, self);
    if (success) success();
};

/**
 * 货币列表
 * Currency List
 * Type : Array
 * ArrayType : Currency
 * Default Value : 
 */
Edbox.Currency.CurrencyList = new Array();

/**
 * 根据配置表Json数据获取配置表初始化
 * According to the configuration table Json data acquisition configuration table initialization
 * @param {String} data 配置表Json数据 , 不允许为空
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Currency.Init = function (data, success, error) {
    Edbox.Currency.CurrencyList = new Array();

    function getServerList(callback) {
        var subUrl = "/v0.1/api/role/role/actions/get_all_gold_type";
        var data = "app_id=" + Edbox.GameId + "&version=" + Edbox.Version;

        Edbox.Economic.ServerGet(subUrl, data, function (data) {
            Edbox.Currency.ServerList = data.list;
            if (callback) callback();
        }, error);
    }

    getServerList(function () {
        if (!data || data.trim().length === 0) {
            if (success) success();
            return;
        }

        var list = JSON.parse(data).Currencys;
        for (var i = 0; i < list.length; i++) {
            var info = new Edbox.Currency(list[i]);
            info.Get(function (data) {
                Edbox.Array.Add(Edbox.Currency.CurrencyList, data);
            }, error);
        }
        if (success) success();
    });
};

/**
 * 获取货币根据货币GUID
 * Get currency based on currency GUID
 * @param {String} guid GUID值 , 不允许为空
 * @returns {Object} 货币对象
 */
Edbox.Currency.GetByGUID = function (guid) {
    var list = Edbox.Currency.CurrencyList;
    if (!list) return null;
    for (var i = 0; i < list.length; i++) {
        var key = list[i];
        if (key.GUID === guid) return key;
    }
    return null;
};

/**
 * 获取货币根据游戏内唯一ID
 * Get currency based on in-game unique ID
 * @param {String} id 游戏内唯一ID , 不允许为空
 * @returns {Object} 货币对象
 */
Edbox.Currency.GetByID = function (id) {
    var list = Edbox.Currency.CurrencyList;
    if (!list) return null;
    for (var i = 0; i < list.length; i++) {
        var key = list[i];
        if (key.ID === id) return key;
    }
    return null;
};

/**
 * 获取货币根据货币名称
 * Get currency based on item name
 * @param {String} name 货币名称 , 不允许为空
 * @returns {Object} 货币对象
 */
Edbox.Currency.GetByName = function (name) {
    var list = Edbox.Currency.CurrencyList;
    if (!list) return null;
    for (var i = 0; i < list.length; i++) {
        var key = list[i];
        if (key.Name === name) return key;
    }
    return null;
};

/**
 * 获取货币列表
 * Get the list of currency
 * @returns {Array} 货币列表 , 队列类型 : Currency
 */
Edbox.Currency.GetList = function () {
    return Edbox.Currency.CurrencyList;
};

/**
 * 获取配置表Json
 * Get the configuration table Json
 * @returns {String} 配置表Json
 */
Edbox.Currency.GetJson = function () {
    var conf = new Object();
    conf.Currencys = Edbox.Currency.CurrencyList;
    return JSON.stringify(conf);
};

/**
 * 新建货币
 * New Currency
 * @param {Object} obj 货币初始配置 , 允许为空
 * @param {Function} success 成功回调 , 带Function参数Currency , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Currency.New = function (obj, success, error) {
    var item = new Edbox.Currency(obj);
    item.ID = obj && obj.ID || Edbox.GetGUID();

    var list = Edbox.Currency.CurrencyList;
    function IsCurrencyIndexExist(index) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].Index === index) return true;
        }
        return false;
    }

    for (var index = 1; index <= 10; index++) {
        if (IsCurrencyIndexExist(index)) continue;
        item.Index = index;
        break;
    }

    Edbox.Array.Add(Edbox.Currency.CurrencyList, item);
    if (success) success(item);
};

/**
 * 保存货币列表
 * Save Currency List
 * @param {Function} success 成功回调 , 带Function参数Array , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Currency.SaveList = function (success, error) {
    function release() {
        var subUrl = "/v0.1/api/role/role/actions/publish_game_gold";
        var obj = {
            app_id: Edbox.GameId,
            version: Edbox.Version
        };

        Edbox.Economic.ServerPost(subUrl, obj, function () {
            if (success) success(Edbox.Currency.CurrencyList);
        }, error);
    }

    var subUrl = "/v0.1/api/role/role/actions/edit_game_gold";
    var obj = {
        app_id: Edbox.GameId,
        version: Edbox.Version
    };

    obj.gold_types = new Array();

    var list = Edbox.Currency.CurrencyList;
    for (var i = 0; i < list.length; i++) {
        var self = list[i];
        var info = {
            res_guid: self.ID,
            name: self.Name,
            gold_type: Edbox.Currency.GetGoldType(self.Index)
        };
        Edbox.Array.Add(obj.gold_types, info);
    }

    Edbox.Economic.ServerPost(subUrl, obj, function (data) {
        var list = data.list;
        for (var i = 0; i < list.length; i++) {
            var self = list[i];
            Edbox.Currency.GetByID(self.res_guid).GUID = self.id;
        }
        release();
    }, error);
};

// 服务器货币列表
Edbox.Currency.ServerList = null;

// 获取金币类型
Edbox.Currency.GetGoldType = function (index) {
    var name = "gold_";
    switch (index) {
        case 1:
            name += "i";
            break;
        case 2:
            name += "ii";
            break;
        case 3:
            name += "iii";
            break;
        case 4:
            name += "iv";
            break;
        case 5:
            name += "v";
            break;
        case 6:
            name += "vi";
            break;
        case 7:
            name += "vii";
            break;
        case 8:
            name += "viii";
            break;
        case 9:
            name += "ix";
            break;
        case 10:
            name += "x";
            break;
        default:
            name = "";
            break;
    }
    return name;
};

// 获取金币序号
Edbox.Currency.GetGoldIndex = function (type) {
    type = type.replace(/gold_/g, "");
    switch (type) {
        case "i":
            return 1;
        case "ii":
            return 2;
        case "iii":
            return 3;
        case "iv":
            return 4;
        case "v":
            return 5;
        case "vi":
            return 6;
        case "vii":
            return 7;
        case "viii":
            return 8;
        case "ix":
            return 9;
        case "x":
            return 10;
        default:
            return 0;
    }
};

// Get请求方式
Edbox.Economic.ServerGet = function (subUrl, data, success, error) {
    Edbox.Request.GetWithEnv(Edbox.GetHost("MMO"), subUrl, data, success, error);
};

// Post请求方式
Edbox.Economic.ServerPost = function (subUrl, obj, success, error) {
    Edbox.Request.PostWithEnv(Edbox.GetHost("MMO"), subUrl, JSON.stringify(obj), success, error);
};