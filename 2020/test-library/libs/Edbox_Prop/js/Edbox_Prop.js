/**
 * Edbox道具组件
 * 用于Edbox平台的道具组件,用于实现道具的管理
 * @author 温荣泉(201901)
 * @version 0.0.0.1 (2019年04月14日 21:47:26)
 * @see http://ndsdn.nd.com.cn/index.php?title=Edbox道具组件
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
 *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
 * */
Edbox.Prop = function (obj) {
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

    /**
     * 叠加上限
     * Stack Limit
     * Type : Int
     * Default Value : 1
     */
    this.StackLimit = obj && obj.StackLimit || 1;

    /**
     * 稀有度
     * Rarity
     * Type : Int
     * Default Value : 1
     */
    this.Rarity = obj && obj.Rarity || 1;

    /**
     * 持续时间
     * Duration
     * Type : Int
     * Default Value : 0
     */
    this.Duration = obj && obj.Duration || 0;

    return this;
};

/**
 * 通过服务器验证配置表的数据
 * Verify the data of the configuration table through the server
 * @param {Function} success 成功回调 , 带Function参数Prop , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Prop.prototype.Get = function (success, error) {
    var self = this;
    var list = Edbox.Prop.ServerList;
    for (var i = 0; i < list.length; i++) {
        var key = list[i];
        if (key.id === self.GUID) {
            self.Name = key.item_name;
            self.ID = key.res_guid;
            self.Attribute = key.props;
            self.StackLimit = key.max_num;
            self.Rarity = key.rarity;
            self.Duration = key.duration;

            if (success) success(self);
            return;
        }
    }
    if (error) error("No Data On Server");
};

/**
 * 通过服务器保存数据
 * Save data through the server
 * @param {Function} success 成功回调 , 带Function参数Prop , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Prop.prototype.Set = function (success, error) {
    var self = this;
    if (success) success(self);
};

/**
 * 通过服务器删除数据
 * Delete data through the server
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Prop.prototype.Delete = function (success, error) {
    var self = this;
    var list = Edbox.Prop.PropList;
    Edbox.Array.Remove(list, self);
    if (success) success();
};

/**
 * 道具列表
 * Prop List
 * Type : Array
 * ArrayType : Prop
 * Default Value : null
 */
Edbox.Prop.PropList = new Array();

/**
 * 根据配置表Json数据获取配置表初始化道具表
 * According to the configuration table Json data acquisition configuration table initialization props table
 * @param {String} data 配置表Json数据 , 不允许为空
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Prop.Init = function (data, success, error) {
    Edbox.Prop.PropList = new Array();

    function getServerList(callback) {
        var subUrl = "/v0.1/api/bag/bag/actions/get_all_item_type";
        var data1 = "app_id=" + Edbox.GameId + "&version=" + Edbox.Version;

        Edbox.Prop.ServerGet(subUrl, data1, function (data2) {
            Edbox.Prop.ServerList = data2.list;
            if (callback) callback();
        }, error);
    }

    getServerList(function () {
        if (!data || data.trim().length === 0) {
            if (success) success();
            return;
        }

        var list = JSON.parse(data).Props;
        for (var i = 0; i < list.length; i++) {
            var info = new Edbox.Prop(list[i]);
            info.Get(function (prop) {
                Edbox.Array.Add(Edbox.Prop.PropList, prop);
            }, error);
        }
        if (success) success();
    });
};

/**
 * 获取道具根据道具GUID
 * Get prop based on props GUID
 * @param {String} guid GUID值 , 不允许为空
 * @returns {Object} 道具对象
 */
Edbox.Prop.GetByGUID = function (guid) {
    var list = Edbox.Prop.PropList;
    if (!list) return null;
    for (var i = 0; i < list.length; i++) {
        var key = list[i];
        if (key.GUID === guid) return key;
    }
    return null;
};

/**
 * 获取道具根据游戏内唯一ID
 * Get prop based on in-game unique ID
 * @param {String} id 游戏内唯一ID , 不允许为空
 * @returns {Object} 道具对象
 */
Edbox.Prop.GetByID = function (id) {
    var list = Edbox.Prop.PropList;
    if (!list) return null;
    for (var i = 0; i < list.length; i++) {
        var key = list[i];
        if (key.ID === id) return key;
    }
    return null;
};

/**
 * 获取道具根据道具名称
 * Get prop based on item name
 * @param {String} name 道具名称 , 不允许为空
 * @returns {Object} 道具对象
 */
Edbox.Prop.GetByName = function (name) {
    var list = Edbox.Prop.PropList;
    if (!list) return null;
    for (var i = 0; i < list.length; i++) {
        var key = list[i];
        if (key.Name === name) return key;
    }
    return null;
};

/**
 * 获取道具列表
 * Get the list of items
 * @returns {Array} 道具对象列表 , 队列类型 : Prop
 */
Edbox.Prop.GetList = function () {
    return Edbox.Prop.PropList;
};

/**
 * 获取配置表Json
 * Get the configuration table Json
 * @returns {String} 配置表Json
 */
Edbox.Prop.GetJson = function () {
    var conf = new Object();
    conf.Props = Edbox.Prop.PropList;
    return JSON.stringify(conf);
};

/**
 * 新建道具
 * New prop
 * @param {Object} obj 道具初始配置 , 允许为空
 * @param {Function} success 成功回调 , 带Function参数Prop , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Prop.New = function (obj, success, error) {
    var item = new Edbox.Prop(obj);
    item.ID = obj && obj.ID || Edbox.GetGUID();

    Edbox.Array.Add(Edbox.Prop.PropList, item);
    if (success) success(item);
};

/**
 * 保存道具列表
 * Save Prop List
 * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
Edbox.Prop.SaveList = function (success, error) {
    function release() {
        var subUrl = "/v0.1/api/bag/bag/actions/publish_item_type";
        var obj = {
            app_id: Edbox.GameId,
            version: Edbox.Version
        };

        Edbox.Prop.ServerPost(subUrl, obj, function () {
            if (success) success(Edbox.Prop.PropList);
        }, error);
    }

    var subUrl = "/v0.1/api/bag/bag/actions/edit_item_type";
    var obj = {
        app_id: Edbox.GameId,
        version: Edbox.Version
    };

    obj.item_types = new Array();

    var list = Edbox.Prop.PropList;
    for (var i = 0; i < list.length; i++) {
        var self = list[i];
        var info = {
            type_id: 2,
            item_name: self.Name,
            props: self.Attribute || new Object(),
            res_guid: self.ID,
            max_num: self.StackLimit,
            rarity: self.Rarity,
            duration: self.Duration
        };
        obj.item_types.push(info);
    }

    Edbox.Prop.ServerPost(subUrl, obj, function (data) {
        var list1 = data.list;
        for (var i = 0; i < list1.length; i++) {
            var self = list1[i];
            Edbox.Prop.GetByID(self.res_guid).GUID = self.id;
        }
        release();
    }, error);
};

// 服务器道具列表
Edbox.Prop.ServerList = null;

// Get请求方式
Edbox.Prop.ServerGet = function (subUrl, data, success, error) {
    Edbox.Request.GetWithEnv(Edbox.GetHost("MMO"), subUrl, data, success, error);
};

// Post请求方式
Edbox.Prop.ServerPost = function (subUrl, obj, success, error) {
    Edbox.Request.PostWithEnv(Edbox.GetHost("MMO"), subUrl, JSON.stringify(obj), success, error);
};