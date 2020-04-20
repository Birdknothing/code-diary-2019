/**
 * Edbox背包组件
 * 用于Edbox平台的背包组件,用于实现背包的管理
 * @author 温荣泉(201901)
 * @version 0.0.0.1 (2019年04月18日 22:52:30)
 * @see http://ndsdn.nd.com.cn/index.php?title=Edbox背包组件
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
 *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
 *      Edbox.Prop:http://ndsdn.nd.com.cn/index.php?title=Edbox道具组件
 *      Edbox.BackpackProp:http://ndsdn.nd.com.cn/index.php?title=Edbox背包组件#.E8.83.8C.E5.8C.85.E9.81.93.E5.85.B7.E6.A8.A1.E5.9D.97
 * */
Edbox.Backpack = function (obj) {
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
Edbox.Backpack.prototype.Get = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/bag/bag/actions/get_bag_type";
    var obj = {
        app_id: Edbox.GameId,
        version: Edbox.Version
    };

    Edbox.Backpack.ServerPost(subUrl, obj, function (data) {
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
Edbox.Backpack.prototype.Set = function (success, error) {
    var self = this;

    function release() {
        var subUrl = "/v0.1/api/bag/bag/actions/publish_bag";
        var obj = {
            app_id: Edbox.GameId,
            version: Edbox.Version
        };

        Edbox.Backpack.ServerPost(subUrl, obj, function (data) {
            if (success) success(self);
        }, error);
    }

    var subUrl = "/v0.1/api/bag/bag/actions/edit_bag";
    var obj = {
        app_id: Edbox.GameId,
        version: Edbox.Version,
        enable_bag: self.Enable ? 1 : 0,
        title: self.Title,
        tags: self.Total,
        column: self.Columns
    };

    Edbox.Backpack.ServerPost(subUrl, obj, function (data) {
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
Edbox.Backpack.prototype.Delete = function (success, error) {
    var self = this;
    if (error) error("相关接口暂未开放");
};

/**
 * 当前实例
 * Current Instance
 * Type : Backpack
 * Default Value : null
 */
Edbox.Backpack.Current = null;

/**
 * 当前角色ID
 * Current Role ID
 * Type : Text
 * Default Value : 
 */
Edbox.Backpack.RoleID = "";

/**
 * 使用道具回调
 * Use prop callback
 * Type : Function
 * FunctionType : [Prop , Int]
 * Default Value : null
 */
Edbox.Backpack.UsePropCallback = null;

/**
 * 根据配置表Json数据获取配置表初始化背包
 * According to the configuration table Json data acquisition configuration table initialization backpack
 * @param {String} data 配置表Json数据 , 不允许为空
 * @param {Function} success 成功回调 , 带Function参数Backpack , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Backpack.Init = function (data, success, error) {
    Edbox.Backpack.Current = null;

    var obj = JSON.parse(data).Backpack;

    var info = new Edbox.Backpack(obj);
    info.Get(function (data) {
        Edbox.Backpack.Current = data;
        Edbox.Backpack.RefreshList(function () {
            if (success) success(Edbox.Backpack.Current);
        }, error);
    }, error);
};

/**
 * 刷新道具列表
 * Refresh Prop List
 * @param {Function} success 成功回调 , 带Function参数Array , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Backpack.RefreshList = function (success, error) {
    function getPropList() {
        var subUrl = "/v0.1/api/bag/bag/actions/get_all";
        var data = "role_id=" + Edbox.Backpack.RoleID + "&app_id=" + Edbox.GameId;

        Edbox.Backpack.ServerGet(subUrl, data, function (data) {
            for (var i = 0; i < data.list.length; i++) {
                var obj = data.list[i];
                var info = new Edbox.BackpackProp({
                    GUID: obj.id,
                    Prop: Edbox.Prop.GetByGUID(obj.item_type),
                    ExpireTime: Edbox.Backpack.GetTime(obj.expire_time),
                    StackAmount: obj.num
                });
                Edbox.Array.Add(Edbox.Backpack.Current.PropList, info);
            }
            if (success) success(Edbox.Backpack.Current.PropList);
        }, error);
    }

    Edbox.Backpack.Current.PropList = new Array();
    getPropList();
};

/**
 * 获取背包中的所有道具
 * Get all the items in the backpack
 * @param {Function} success 成功回调 , 带Function参数Array , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Backpack.GetList = function (success, error) {
    var current = Edbox.Backpack.Current;
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
Edbox.Backpack.GetJson = function () {
    var current = Edbox.Backpack.Current;
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
Edbox.Backpack.Open = function (success, error) {
    var com = Edbox.Backpack;

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
    var json = JSON.stringify(Edbox.Backpack.Current);
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
Edbox.Backpack.GetPropByGUID = function (guid) {
    if (!Edbox.Backpack.Current) return null;
    var list = Edbox.Backpack.Current.PropList;
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
Edbox.Backpack.GainProp = function (prop, count, success, error) {
    var subUrl = "/v0.1/api/bag/bag/actions/add_res";
    var obj = {
        app_id: Edbox.GameId,
        role_id: Edbox.Backpack.RoleID,
        data: [{
            id: prop.GUID,
            num: count
        }]
    };

    Edbox.Backpack.ServerPost(subUrl, obj, function (data) {
        if (data.insert_data.length > 0) {
            var obj = data.insert_data[0];
            var info = new Edbox.BackpackProp({
                GUID: obj.id,
                Prop: Edbox.Prop.GetByGUID(obj.item_type),
                ExpireTime: Edbox.Backpack.GetTime(obj.expire_time),
                StackAmount: obj.num
            });
            Edbox.Array.Add(Edbox.Backpack.Current.PropList, info);
        }
        else if (data.update_data.length > 0) {
            obj = data.update_data[0];
            info = Edbox.Backpack.GetPropByGUID(obj.id);
            if (!info) {
                if (error) error("Data Error");
                return;
            }
            info.ExpireTime = Edbox.Backpack.GetTime(obj.expire_time);
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
Edbox.Backpack.GainPropByMall = function (prop, count, success, error) {
    Edbox.Backpack.RefreshList(null, error);
};

/**
 * 使用道具
 * Use props
 * @param {Object} prop 背包中的道具 , 不允许为空
 * @param {Number} count 数量 , 不允许为空
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Backpack.UseProp = function (prop, count, success, error) {
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
Edbox.Backpack.DropProp = function (prop, success, error) {
    if (!prop) {
        if (error) error("Invalid Prop");
        return;
    }
    prop.Delete(success, error);
};

/**
 * Edbox背包组件背包道具模块
 * 用于Edbox平台的背包组件,用于实现背包中道具的管理
 * @author 温荣泉(201901)
 * @version 0.0.0.1 (2019年04月18日 22:52:30)
 * @see http://ndsdn.nd.com.cn/index.php?title=Edbox背包组件#.E8.83.8C.E5.8C.85.E9.81.93.E5.85.B7.E6.A8.A1.E5.9D.97
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
 *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
 *      Edbox.Prop:http://ndsdn.nd.com.cn/index.php?title=Edbox道具组件
 * */
Edbox.BackpackProp = function (obj) {
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
Edbox.BackpackProp.prototype.Get = function (success, error) {
    var self = this;
    if (error) error("相关接口暂未开放");
};

/**
 * 通过服务器保存数据
 * Save data through the server
 * @param {Function} success 成功回调 , 带Function参数BackpackProp , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.BackpackProp.prototype.Set = function (success, error) {
    var self = this;
    if (error) error("相关接口暂未开放");
};

/**
 * 通过服务器删除数据
 * Delete data through the server
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.BackpackProp.prototype.Delete = function (success, error) {
    var self = this;
    var subUrl = "/v0.1/api/bag/bag/actions/drop_item";
    var obj = {
        role_id: Edbox.Backpack.RoleID,
        item_id: self.GUID
    };

    Edbox.Backpack.ServerPost(subUrl, obj, function (data) {
        Edbox.Array.Remove(Edbox.Backpack.Current.PropList, self);
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
Edbox.BackpackProp.prototype.Use = function (count, success, error) {
    var self = this;
    if (self.StackAmount < count) {
        if (error) error("Not enough props");
        return;
    }

    var subUrl = "/v0.1/api/bag/bag/actions/deduct_item";
    var obj = {
        role_id: Edbox.Backpack.RoleID,
        item_id: self.GUID,
        num: count
    };

    Edbox.Backpack.ServerPost(subUrl, obj, function (data) {
        self.StackAmount -= count;
        if (self.StackAmount === 0) {
            Edbox.Array.Remove(Edbox.Backpack.Current.PropList, self);
        }
        if (success) success(data);
    }, error);
};

// 获取时间数字
Edbox.Backpack.GetTimeNumber = function (date) {
    var year = date.getFullYear();

    if (year < 2000) return 0;

    var mon = date.getMonth();
    var day = date.getDay();
    var hour = date.getHours();
    var min = date.getMinutes();
    return min + hour * 100 + day * 10000 + mon * 1000000 + year * 100000000;
};

// 时间数字转时间
Edbox.Backpack.GetTime = function (num) {
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
Edbox.Backpack.ServerGet = function (subUrl, data, success, error) {
    Edbox.Request.GetWithEnv(Edbox.GetHost("MMO"), subUrl, data, success, error);
};

// Post请求方式
Edbox.Backpack.ServerPost = function (subUrl, obj, success, error) {
    Edbox.Request.PostWithEnv(Edbox.GetHost("MMO"), subUrl, JSON.stringify(obj), success, error);
};

// 初始化组件路径
Edbox.InitPath(Edbox.Backpack);

// 初始化需求组件
Edbox.InitRequire(Edbox.ComponentRootPath + "Edbox_Prop/js/Edbox_Prop.js", "undefined" === typeof Edbox.Prop);

// 初始化UI绘制
Edbox.Backpack.InitFrame = function () {
    var com = Edbox.Backpack;

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
            com.DropProp(Edbox.Backpack.GetPropByGUID(guid), success, error);
        },
        // 道具使用
        Use: function (datas) {
            var guid = datas[0].GUID;
            var count = datas[1];
            if (!guid) return;
            com.UseProp(Edbox.Backpack.GetPropByGUID(guid), count, success, error);
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
        pageurl = Edbox.SetQueryString("EdboxArgs", Edbox.GetLoginInfo(), pageurl);

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
        if (!Edbox.IsLogin) return;
        init();
        clearInterval(int);
    }, 100);
};
Edbox.Backpack.InitFrame();
