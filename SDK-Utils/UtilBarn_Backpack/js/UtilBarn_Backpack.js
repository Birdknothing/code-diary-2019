/**
 * UtilBarn背包组件
 * 用于UtilBarn平台的背包组件,用于实现背包的管理
 * @author 温荣泉(201901)
 * @version 0.0.0.1 (2019年04月18日 22:52:30)
 * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn背包组件
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用组件
 *      UtilBarn.Request:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用请求授权组件
 *      UtilBarn.Prop:http://ndsdn.nd.com.cn/index.php?title=UtilBarn道具组件
 *      UtilBarn.BackpackProp:http://ndsdn.nd.com.cn/index.php?title=UtilBarn背包组件#.E8.83.8C.E5.8C.85.E9.81.93.E5.85.B7.E6.A8.A1.E5.9D.97
 * */
UtilBarn.Backpack = function (obj) {
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
     * 标题
     * Title
     * Type : Text
     * Default Value : 背包
     */
    this.Title = obj && obj.Title || "背包";

    /**
     * 图标
     * Icon
     * Type : Image
     * Default Value : 
     */
    this.Icon = obj && obj.Icon || "";

    /**
     * 背景图片
     * Background Image
     * Type : Image
     * Default Value : 
     */
    this.BackgroundImage = obj && obj.BackgroundImage || "";

    /**
     * 格子图片
     * Grid Image
     * Type : Image
     * Default Value : 
     */
    this.GridImage = obj && obj.GridImage || "";

    /**
     * 格子总数
     * Total Number Of Grids
     * Type : Int
     * Default Value : 40
     */
    this.Total = obj && obj.Total || 40;

    /**
     * 格子
     * Columns
     * Type : Int
     * Default Value : 4
     */
    this.Columns = obj && obj.Columns || 4;

    /**
     * 道具列表
     * Prop List
     * Type : Array
     * ArrayType : [BackpackProp]
     * Default Value : null
     */
    this.PropList = obj && obj.PropList || new Array();

    return this;
};

/**
 * 通过服务器获取数据
 * Get data through the server
 * @param {Function} success 成功回调 , 带Function参数Backpack , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Backpack.prototype.Get = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/bag/bag/actions/get_bag_type";
    var obj = {
        app_id: UtilBarn.GameId,
        version: UtilBarn.Version
    };

    UtilBarn.Backpack.ServerPost(subUrl, obj, function (data) {
        self.GUID = data.id;
        self.Enable = data.enable_bag === 1;
        self.Title = data.title;
        self.Total = data.tags;
        self.Columns = data.column;
        if (success) success(self);
    }, error);
};

/**
 * 通过服务器保存数据
 * Save data through the server
 * @param {Function} success 成功回调 , 带Function参数Backpack , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Backpack.prototype.Set = function (success, error) {
    var self = this;

    function release() {
        var subUrl = "/v0.1/api/bag/bag/actions/publish_bag";
        var obj = {
            app_id: UtilBarn.GameId,
            version: UtilBarn.Version
        };

        UtilBarn.Backpack.ServerPost(subUrl, obj, function (data) {
            if (success) success(self);
        }, error);
    }

    var subUrl = "/v0.1/api/bag/bag/actions/edit_bag";
    var obj = {
        app_id: UtilBarn.GameId,
        version: UtilBarn.Version,
        enable_bag: self.Enable ? 1 : 0,
        title: self.Title,
        tags: self.Total,
        column: self.Columns
    };

    UtilBarn.Backpack.ServerPost(subUrl, obj, function (data) {
        self.GUID = data.id;
        release();
    }, error);
};

/**
 * 通过服务器删除数据
 * Delete data through the server
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Backpack.prototype.Delete = function (success, error) {
    var self = this;
    if (error) error("相关接口暂未开放");
};

/**
 * 当前实例
 * Current Instance
 * Type : Backpack
 * Default Value : null
 */
UtilBarn.Backpack.Current = null;

/**
 * 当前角色ID
 * Current Role ID
 * Type : Text
 * Default Value : 
 */
UtilBarn.Backpack.RoleID = "";

/**
 * 使用道具回调
 * Use prop callback
 * Type : Function
 * FunctionType : [Prop , Int]
 * Default Value : null
 */
UtilBarn.Backpack.UsePropCallback = null;

/**
 * 根据配置表Json数据获取配置表初始化背包
 * According to the configuration table Json data acquisition configuration table initialization backpack
 * @param {String} data 配置表Json数据 , 不允许为空
 * @param {Function} success 成功回调 , 带Function参数Backpack , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Backpack.Init = function (data, success, error) {
    UtilBarn.Backpack.Current = null;

    var obj = JSON.parse(data).Backpack;

    var info = new UtilBarn.Backpack(obj);
    info.Get(function (data) {
        UtilBarn.Backpack.Current = data;
        UtilBarn.Backpack.RefreshList(function () {
            if (success) success(UtilBarn.Backpack.Current);
        }, error);
    }, error);
};

/**
 * 刷新道具列表
 * Refresh Prop List
 * @param {Function} success 成功回调 , 带Function参数Array , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Backpack.RefreshList = function (success, error) {
    function getPropList() {
        var subUrl = "/v0.1/api/bag/bag/actions/get_all";
        var data = "role_id=" + UtilBarn.Backpack.RoleID + "&app_id=" + UtilBarn.GameId;

        UtilBarn.Backpack.ServerGet(subUrl, data, function (data) {
            for (var i = 0; i < data.list.length; i++) {
                var obj = data.list[i];
                var info = new UtilBarn.BackpackProp({
                    GUID: obj.id,
                    Prop: UtilBarn.Prop.GetByGUID(obj.item_type),
                    ExpireTime: UtilBarn.Backpack.GetTime(obj.expire_time),
                    StackAmount: obj.num
                });
                UtilBarn.Array.Add(UtilBarn.Backpack.Current.PropList, info);
            }
            if (success) success(UtilBarn.Backpack.Current.PropList);
        }, error);
    }

    UtilBarn.Backpack.Current.PropList = new Array();
    getPropList();
};

/**
 * 获取背包中的所有道具
 * Get all the items in the backpack
 * @param {Function} success 成功回调 , 带Function参数Array , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Backpack.GetList = function (success, error) {
    var current = UtilBarn.Backpack.Current;
    if (!current) {
        if (error) error("Uninitialized");
        return;
    }
    if (success) success(current.PropList);
};

/**
 * 获取配置表Json
 * Get the configuration table Json
 * @returns {String} 配置表Json
 */
UtilBarn.Backpack.GetJson = function () {
    var current = UtilBarn.Backpack.Current;
    var conf = new Object();
    conf.Backpack = new Object();

    var keys = Object.keys(current);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key === "PropList") continue;
        conf.Backpack[key] = current[key];
    }

    return JSON.stringify(conf);
};

/**
 * 打开UI
 * Open UI
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Backpack.Open = function (success, error) {
    var com = UtilBarn.Backpack;

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
    var json = JSON.stringify(UtilBarn.Backpack.Current);
    data.Datas = JSON.parse(json);

    console.log(data);

    sendMessage(data);
};

/**
 * 根据GUID获取背包道具
 * Get backpack props based on GUID
 * @param {String} guid GUID值 , 不允许为空
 * @returns {Object} 背包道具
 */
UtilBarn.Backpack.GetPropByGUID = function (guid) {
    if (!UtilBarn.Backpack.Current) return null;
    var list = UtilBarn.Backpack.Current.PropList;
    if (!list) return null;
    for (var i = 0; i < list.length; i++) {
        var key = list[i];
        if (key.GUID === guid) return key;
    }
    return null;
};

/**
 * 游戏内获得道具
 * Get props in the game
 * @param {Object} prop 道具 , 不允许为空
 * @param {Number} count 数量 , 不允许为空
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Backpack.GainProp = function (prop, count, success, error) {
    var subUrl = "/v0.1/api/bag/bag/actions/add_res";
    var obj = {
        app_id: UtilBarn.GameId,
        role_id: UtilBarn.Backpack.RoleID,
        data: [{
            id: prop.GUID,
            num: count
        }]
    };

    UtilBarn.Backpack.ServerPost(subUrl, obj, function (data) {
        if (data.insert_data.length > 0) {
            var obj = data.insert_data[0];
            var info = new UtilBarn.BackpackProp({
                GUID: obj.id,
                Prop: UtilBarn.Prop.GetByGUID(obj.item_type),
                ExpireTime: UtilBarn.Backpack.GetTime(obj.expire_time),
                StackAmount: obj.num
            });
            UtilBarn.Array.Add(UtilBarn.Backpack.Current.PropList, info);
        }
        else if (data.update_data.length > 0) {
            obj = data.update_data[0];
            info = UtilBarn.Backpack.GetPropByGUID(obj.id);
            if (!info) {
                if (error) error("Data Error");
                return;
            }
            info.ExpireTime = UtilBarn.Backpack.GetTime(obj.expire_time);
            info.StackAmount = obj.num;
        }
        if (success) success(data);
    }, error);
};

/**
 * 在商城获得道具
 * Get props in the mall
 * @param {Object} prop 道具 , 不允许为空
 * @param {Number} count 数量 , 不允许为空
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Backpack.GainPropByMall = function (prop, count, success, error) {
    UtilBarn.Backpack.RefreshList(null, error);
};

/**
 * 使用道具
 * Use props
 * @param {Object} prop 背包中的道具 , 不允许为空
 * @param {Number} count 数量 , 不允许为空
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Backpack.UseProp = function (prop, count, success, error) {
    if (!prop) {
        if (error) error("Invalid Prop");
        return;
    }
    prop.Use(count, success, error);
};

/**
 * 丢弃道具
 * Drop props
 * @param {Object} prop 道具 , 不允许为空
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Backpack.DropProp = function (prop, success, error) {
    if (!prop) {
        if (error) error("Invalid Prop");
        return;
    }
    prop.Delete(success, error);
};

/**
 * UtilBarn背包组件背包道具模块
 * 用于UtilBarn平台的背包组件,用于实现背包中道具的管理
 * @author 温荣泉(201901)
 * @version 0.0.0.1 (2019年04月18日 22:52:30)
 * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn背包组件#.E8.83.8C.E5.8C.85.E9.81.93.E5.85.B7.E6.A8.A1.E5.9D.97
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用组件
 *      UtilBarn.Request:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用请求授权组件
 *      UtilBarn.Prop:http://ndsdn.nd.com.cn/index.php?title=UtilBarn道具组件
 * */
UtilBarn.BackpackProp = function (obj) {
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
     * 道具
     * Prop
     * Type : Prop
     * Default Value : null
     */
    this.Prop = obj && obj.Prop || null;

    /**
     * 过期时间
     * Expire Time
     * Type : DateTime
     * Default Value : null
     */
    this.ExpireTime = obj && obj.ExpireTime || null;

    /**
     * 叠加数量
     * Stack Amount
     * Type : Int
     * Default Value : 1
     */
    this.StackAmount = obj && obj.StackAmount || 1;

    return this;
};

/**
 * 通过服务器获取数据
 * Get data through the server
 * @param {Function} success 成功回调 , 带Function参数BackpackProp , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.BackpackProp.prototype.Get = function (success, error) {
    var self = this;
    if (error) error("相关接口暂未开放");
};

/**
 * 通过服务器保存数据
 * Save data through the server
 * @param {Function} success 成功回调 , 带Function参数BackpackProp , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.BackpackProp.prototype.Set = function (success, error) {
    var self = this;
    if (error) error("相关接口暂未开放");
};

/**
 * 通过服务器删除数据
 * Delete data through the server
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.BackpackProp.prototype.Delete = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/bag/bag/actions/drop_item";
    var obj = {
        role_id: UtilBarn.Backpack.RoleID,
        item_id: self.GUID
    };

    UtilBarn.Backpack.ServerPost(subUrl, obj, function (data) {
        UtilBarn.Array.Remove(UtilBarn.Backpack.Current.PropList, self);
        if (success) success(data);
    }, error);
};

/**
 * 使用道具
 * Use props
 * @param {Number} count 数量 , 不允许为空
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.BackpackProp.prototype.Use = function (count, success, error) {
    var self = this;
    if (self.StackAmount < count) {
        if (error) error("Not enough props");
        return;
    }

    var subUrl = "/v0.1/api/bag/bag/actions/deduct_item";
    var obj = {
        role_id: UtilBarn.Backpack.RoleID,
        item_id: self.GUID,
        num: count
    };

    UtilBarn.Backpack.ServerPost(subUrl, obj, function (data) {
        self.StackAmount -= count;
        if (self.StackAmount === 0) {
            UtilBarn.Array.Remove(UtilBarn.Backpack.Current.PropList, self);
        }
        if (success) success(data);
    }, error);
};

// 获取时间数字
UtilBarn.Backpack.GetTimeNumber = function (date) {
    var year = date.getFullYear();

    if (year < 2000) return 0;

    var mon = date.getMonth();
    var day = date.getDay();
    var hour = date.getHours();
    var min = date.getMinutes();
    return min + hour * 100 + day * 10000 + mon * 1000000 + year * 100000000;
};

// 时间数字转时间
UtilBarn.Backpack.GetTime = function (num) {
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

// Get请求方式
UtilBarn.Backpack.ServerGet = function (subUrl, data, success, error) {
    UtilBarn.Request.GetWithEnv(UtilBarn.GetHost("MMO"), subUrl, data, success, error);
};

// Post请求方式
UtilBarn.Backpack.ServerPost = function (subUrl, obj, success, error) {
    UtilBarn.Request.PostWithEnv(UtilBarn.GetHost("MMO"), subUrl, JSON.stringify(obj), success, error);
};

// 初始化组件路径
UtilBarn.InitPath(UtilBarn.Backpack);

// 初始化需求组件
UtilBarn.InitRequire(UtilBarn.ComponentRootPath + "UtilBarn_Prop/js/UtilBarn_Prop.js", "undefined" === typeof UtilBarn.Prop);

// 初始化UI绘制
UtilBarn.Backpack.InitFrame = function () {
    var com = UtilBarn.Backpack;

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
        // 道具丢弃
        Drop: function (datas) {
            var guid = datas[0].GUID;
            if (!guid) return;
            com.DropProp(UtilBarn.Backpack.GetPropByGUID(guid), success, error);
        },
        // 道具使用
        Use: function (datas) {
            var guid = datas[0].GUID;
            var count = datas[1];
            if (!guid) return;
            com.UseProp(UtilBarn.Backpack.GetPropByGUID(guid), count, success, error);
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
UtilBarn.Backpack.InitFrame();
