declare module UtilBarn {
    /**
     * UtilBarn背包组件
     * 用于UtilBarn平台的背包组件,用于实现背包的管理
     * @author 温荣泉(201901)
     * @version 0.0.0.1 (2019年04月26日 02:20:22)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn背包组件
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用组件
     *      UtilBarn.Request:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用请求授权组件
     *      UtilBarn.Prop:http://ndsdn.nd.com.cn/index.php?title=UtilBarn道具组件
     *      UtilBarn.BackpackProp:http://ndsdn.nd.com.cn/index.php?title=UtilBarn背包组件#.E8.83.8C.E5.8C.85.E9.81.93.E5.85.B7.E6.A8.A1.E5.9D.97
     * */
    class Backpack {
        /**
         * 创建一个组件实例
         */
        constructor(obj?: object);

        /**
         * 是否启用
         * Enable
         * Type : Boolean
         * Default Value : false
         */
        public Enable: boolean;

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
         * 标题
         * Title
         * Type : Text
         * Default Value : 背包
         */
        public Title: string;

        /**
         * 图标
         * Icon
         * Type : Image
         * Default Value : 
         */
        public Icon: string;

        /**
         * 背景图片
         * Background Image
         * Type : Image
         * Default Value : 
         */
        public BackgroundImage: string;

        /**
         * 格子图片
         * Grid Image
         * Type : Image
         * Default Value : 
         */
        public GridImage: string;

        /**
         * 格子总数
         * Total Number Of Grids
         * Type : Int
         * Default Value : 40
         */
        public Total: number;

        /**
         * 格子
         * Columns
         * Type : Int
         * Default Value : 4
         */
        public Columns: number;

        /**
         * 道具列表
         * Prop List
         * Type : Array
         * ArrayType : BackpackProp
         * Default Value : null
         */
        public PropList: Array<object>;

        /**
         * 通过服务器获取数据
         * Get data through the server
         * @param {Function} success 成功回调 , 带Function参数Backpack , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Get(success?: Function, error?: Function): void;

        /**
         * 通过服务器保存数据
         * Save data through the server
         * @param {Function} success 成功回调 , 带Function参数Backpack , 允许为空
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
         * Type : Backpack
         * Default Value : null
         */
        public static Current: object;

        /**
         * 当前角色ID
         * Current Role ID
         * Type : Text
         * Default Value : 
         */
        public static RoleID: string;

        /**
         * 使用道具回调
         * Use prop callback
         * Type : Function
         * FunctionType : Prop, Int
         * Default Value : null
         */
        public static UsePropCallback: Function;

        /**
         * 根据配置表Json数据获取配置表初始化背包
         * According to the configuration table Json data acquisition configuration table initialization backpack
         * @param {string} data 配置表Json数据 , 不允许为空
         * @param {Function} success 成功回调 , 带Function参数Backpack , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static Init(data: string, success?: Function, error?: Function): void;

        /**
         * 刷新道具列表
         * Refresh Prop List
         * @param {Function} success 成功回调 , 带Function参数Array , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static RefreshList(success?: Function, error?: Function): void;

        /**
         * 获取背包中的所有道具
         * Get all the items in the backpack
         * @param {Function} success 成功回调 , 带Function参数Array , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static GetList(success?: Function, error?: Function): void;

        /**
         * 获取配置表Json
         * Get the configuration table Json
         * @returns {String} 配置表Json
         */
        public static GetJson(): string;

        /**
         * 打开UI
         * Open UI
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static Open(success?: Function, error?: Function): void;

        /**
         * 根据GUID获取背包道具
         * Get backpack props based on GUID
         * @param {string} guid GUID值 , 不允许为空
         * @returns {Object} 背包道具
         */
        public static GetPropByGUID(guid: string): object;

        /**
         * 游戏内获得道具
         * Get props in the game
         * @param {object} prop 道具 , 不允许为空
         * @param {number} count 数量 , 不允许为空
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static GainProp(prop: object, count: number, success?: Function, error?: Function): void;

        /**
         * 在商城获得道具
         * Get props in the mall
         * @param {object} prop 道具 , 不允许为空
         * @param {number} count 数量 , 不允许为空
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static GainPropByMall(prop: object, count: number, success?: Function, error?: Function): void;

        /**
         * 使用道具
         * Use props
         * @param {object} prop 背包中的道具 , 不允许为空
         * @param {number} count 数量 , 不允许为空
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static UseProp(prop: object, count: number, success?: Function, error?: Function): void;

        /**
         * 丢弃道具
         * Drop props
         * @param {object} prop 道具 , 不允许为空
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static DropProp(prop: object, success?: Function, error?: Function): void;
    }
}

declare module UtilBarn {
    /**
     * UtilBarn背包组件背包道具模块
     * 用于UtilBarn平台的背包组件,用于实现背包中道具的管理
     * @author 温荣泉(201901)
     * @version 0.0.0.1 (2019年04月26日 02:20:22)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn背包组件#.E8.83.8C.E5.8C.85.E9.81.93.E5.85.B7.E6.A8.A1.E5.9D.97
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用组件
     *      UtilBarn.Request:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用请求授权组件
     *      UtilBarn.Prop:http://ndsdn.nd.com.cn/index.php?title=UtilBarn道具组件
     * */
    class BackpackProp {
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
         * 道具
         * Prop
         * Type : Prop
         * Default Value : null
         */
        public Prop: object;

        /**
         * 过期时间
         * Expire Time
         * Type : DateTime
         * Default Value : null
         */
        public ExpireTime: Date;

        /**
         * 叠加数量
         * Stack Amount
         * Type : Int
         * Default Value : 1
         */
        public StackAmount: number;

        /**
         * 通过服务器获取数据
         * Get data through the server
         * @param {Function} success 成功回调 , 带Function参数BackpackProp , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Get(success?: Function, error?: Function): void;

        /**
         * 通过服务器保存数据
         * Save data through the server
         * @param {Function} success 成功回调 , 带Function参数BackpackProp , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Set(success?: Function, error?: Function): void;

        /**
         * 通过服务器删除数据
         * Delete data through the server
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Delete(success?: Function, error?: Function): void;

        /**
         * 使用道具
         * Use props
         * @param {number} count 数量 , 不允许为空
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Use(count: number, success?: Function, error?: Function): void;


    }
}
