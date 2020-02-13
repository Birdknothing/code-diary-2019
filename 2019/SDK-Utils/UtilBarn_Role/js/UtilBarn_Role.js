/**
 * UtilBarn角色组件
 * 用于UtilBarn平台的角色组件,用于实现角色的管理
 * @author 温荣泉(201901)
 * @version 1.0.0 (2019年04月13日 16:46:41)
 * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn角色组件
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用组件
 *      UtilBarn.Request:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用请求授权组件
 * */
UtilBarn.Role = function (obj) {
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
     * 头像
     * Avatar
     * Type : Image
     * Default Value : 
     */
    this.Avatar = obj && obj.Avatar || "";

    /**
     * 经验
     * Level
     * Type : Int
     * Default Value : 0
     */
    this.Level = obj && obj.Level || 0;

    /**
     * 经验
     * Experience
     * Type : Int
     * Default Value : 0
     */
    this.Experience = obj && obj.Experience || 0;

    /**
     * 血量
     * HP
     * Type : Int
     * Default Value : 1
     */
    this.HP = obj && obj.HP || 1;

    /**
     * 蓝量
     * MP
     * Type : Int
     * Default Value : 1
     */
    this.MP = obj && obj.MP || 1;

    /**
     * 职业
     * Profession
     * Type : Text
     * Default Value : 
     */
    this.Profession = obj && obj.Profession || "";

    return this;
};

/**
 * 通过服务器获取角色数据
 * Get data through the server
 * @param {Function} success 成功回调 , 带Function参数Role , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Role.prototype.Get = function (success, error) {
    var self = this;

    var subUrl = "/v0.1/api/role/role/actions/select_game_role_by_id";
    var data = "game_role_id=" + self.GUID;

    UtilBarn.Role.ServerGet(subUrl, data, function (data) {
        self.ID = data.user_id;
        self.Name = data.nick_name;
        self.Experience = data.experience;
        self.Level = data.level;
        self.Avatar = data.head_url;
        self.HP = data.hp;
        self.MP = data.mp;
        self.Profession = data.profession;
        if (success) success(self);
    }, error);
};

/**
 * 通过服务器保存数据
 * Save data through the server
 * @param {Function} success 成功回调 , 带Function参数Role , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Role.prototype.Set = function (success, error) {
    var self = this;
    if (success) success(self);
};

/**
 * 通过服务器删除数据
 * Delete data through the server
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Role.prototype.Delete = function (success, error) {
    var self = this;
    if (error) error("相关接口暂未开放");
};

/**
 * 当前实例
 * Current Instance
 * Type : Role
 * Default Value : null
 */
UtilBarn.Role.Current = null;

/**
 * 角色列表
 * Role List
 * Type : Array
 * ArrayType : Role
 * Default Value : null
 */
UtilBarn.Role.RoleList = new Array();

/**
 * 获取角色列表
 * Get the list of roles
 * @param {Function} success 成功回调 , 带Function参数Array , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Role.GetList = function (success, error) {
    if (UtilBarn.Role.RoleList && UtilBarn.Role.RoleList.length > 0) {
        if (success) success(UtilBarn.Role.RoleList);
        return;
    }

    UtilBarn.Role.RoleList = new Array();

    var subUrl = "/v0.1/api/role/role/actions/get_game_role";
    var data = "app_id=" + UtilBarn.GameId;

    UtilBarn.Role.ServerGet(subUrl, data, function (data) {
        if (data.list && data.list.length > 0) {
            var list = data.list;
            for (var i = 0; i < list.length; i++) {
                var info = new UtilBarn.Role({
                    GUID: list[i].id,
                    Name: list[i].nick_name,
                    Profession: list[i].profession
                });
                if (i === 0) {
                    UtilBarn.Role.Current = info;
                }
                info.Get(function (data) {
                    UtilBarn.Array.Add(UtilBarn.Role.RoleList, data);
                    if (UtilBarn.Role.RoleList.length === list.length) {
                        if (success) success(UtilBarn.Role.RoleList);
                    }
                }, error);
            }
        }
    }, error);
};

/**
 * 新建角色
 * New Role
 * @param {Function} success 成功回调 , 带Function参数Role , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Role.New = function (success, error) {
    var subUrl = "/v0.1/api/role/role/actions/create_game_role";
    var obj = {
        app_id: UtilBarn.GameId,
        nick_name: UtilBarn.UserName,
        head_url: UtilBarn.Avatar
    };

    UtilBarn.Role.ServerPost(subUrl, obj, function (data) {
        var info = new UtilBarn.Role({
            GUID: data.id
        });
        info.Get(function (data) {
            UtilBarn.Array.Add(UtilBarn.Role.RoleList, data);
            UtilBarn.Role.Current = data;
            if (success) success(data);
        }, error);
    }, error);
};

/**
 * 选择角色
 * Select Role
 * @param {Object} role 角色 , 不允许为空
 * @param {Function} success 成功回调 , 允许为空
 * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
 */
UtilBarn.Role.Select = function (role, success, error) {
    UtilBarn.Role.Current = role;
    if (success) success();
};

// Get请求方式
UtilBarn.Role.ServerGet = function (subUrl, data, success, error) {
    UtilBarn.Request.GetWithEnv(UtilBarn.GetHost("MMO"), subUrl, data, success, error);
};

// Post请求方式
UtilBarn.Role.ServerPost = function (subUrl, obj, success, error) {
    UtilBarn.Request.PostWithEnv(UtilBarn.GetHost("MMO"), subUrl, JSON.stringify(obj), success, error);
};