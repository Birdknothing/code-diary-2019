declare module Edbox {
    /**
     * Edbox角色组件
     * 用于Edbox平台的角色组件,用于实现角色的管理
     * @author 温荣泉(201901)
     * @version 0.0.0.1 (2019年04月15日 00:13:47)
     * @see http://ndsdn.nd.com.cn/index.php?title=Edbox角色组件
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
     *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
     * */
    class Role {
        /**
         * 创建一个组件实例
         */
        constructor(obj?: object);

        /**
         * 游戏内的唯一ID
         * Unique ID
         * Type : Text
         * Default Value : 
         */
        public ID: string;

        /**
         * 服务器上的唯一ID
         * Unique ID On Server
         * Type : Text
         * Default Value : 
         */
        public GUID: string;

        /**
         * 名称
         * Name
         * Type : Text
         * Default Value : 
         */
        public Name: string;

        /**
         * 头像
         * Avatar
         * Type : Image
         * Default Value : 
         */
        public Avatar: string;

        /**
         * 经验
         * Level
         * Type : Int
         * Default Value : 0
         */
        public Level: number;

        /**
         * 经验
         * Experience
         * Type : Int
         * Default Value : 0
         */
        public Experience: number;

        /**
         * 血量
         * HP
         * Type : Int
         * Default Value : 1
         */
        public HP: number;

        /**
         * 蓝量
         * MP
         * Type : Int
         * Default Value : 1
         */
        public MP: number;

        /**
         * 职业
         * Profession
         * Type : Text
         * Default Value : 
         */
        public Profession: string;

        /**
         * 通过服务器获取角色数据
         * Get data through the server
         * @param {Function} success 成功回调 , 带Function参数Role , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Get(success?: Function, error?: Function): void;

        /**
         * 通过服务器保存数据
         * Save data through the server
         * @param {Function} success 成功回调 , 带Function参数Role , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Set(success?: Function, error?: Function): void;

        /**
         * 通过服务器删除数据
         * Delete data through the server
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Delete(success?: Function, error?: Function): void;

        /**
         * 当前实例
         * Current Instance
         * Type : Role
         * Default Value : null
         */
        public static Current: object;

        /**
         * 角色列表
         * Role List
         * Type : Array
         * ArrayType : Role
         * Default Value : null
         */
        public static RoleList: Array<object>;

        /**
         * 获取角色列表
         * Get the list of roles
         * @param {Function} success 成功回调 , 带Function参数Array , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static GetList(success?: Function, error?: Function): void;

        /**
         * 新建角色
         * New Role
         * @param {Function} success 成功回调 , 带Function参数Role , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static New(success?: Function, error?: Function): void;

        /**
         * 选择角色
         * Select Role
         * @param {object} role 角色 , 不允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static Select(role: object, success?: Function, error?: Function): void;
    }
}
