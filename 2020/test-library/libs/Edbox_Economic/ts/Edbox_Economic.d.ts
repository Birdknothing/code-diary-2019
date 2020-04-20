declare module Edbox {
    /**
     * Edbox经济组件
     * 用于Edbox平台的经济组件,用于实现经济系统中货币的管理
     * @author 温荣泉(201901)
     * @version 0.0.0.1 (2019年04月26日 02:13:52)
     * @see http://ndsdn.nd.com.cn/index.php?title=Edbox经济组件
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
     *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
     *      Edbox.Currency:http://ndsdn.nd.com.cn/index.php?title=Edbox经济组件#.E8.B4.A7.E5.B8.81.E6.A8.A1.E5.9D.97
     * */
    class Economic {
        /**
         * 创建一个组件实例
         */
        constructor(obj?: object);



        /**
         * 货币列表
         * Currency List
         * Type : Map
         * MapType : Currency, Int
         * Default Value : null
         */
        public static CurrencyList: Dictionary;

        /**
         * 当前角色ID
         * Current Role ID
         * Type : Text
         * Default Value : 
         */
        public static RoleID: string;

        /**
         * 货币数量变化回调
         * Currency change callback
         * Type : Function
         * FunctionType : Currency, Int
         * Default Value : null
         */
        public static ChangeCallBack: Function;

        /**
         * 根据配置表Json数据获取配置表初始化
         * According to the configuration table Json data acquisition configuration table initialization
         * @param {string} data 配置表Json数据 , 不允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static Init(data: string, success?: Function, error?: Function): void;

        /**
         * 获取货币数量
         * Get the amount of money
         * @param {object} Currency 货币类型 , 不允许为空
         * @returns {Number} 货币数量
         */
        public static GetCurrencyCount(Currency: object): number;

        /**
         * 游戏内获得货币
         * Get currency in the game
         * @param {object} Currency 货币类型 , 不允许为空
         * @param {number} Count 数量 , 不允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static GainCurrency(Currency: object, Count: number, success?: Function, error?: Function): void;

        /**
         * 游戏内使用货币
         * Use currency in the game
         * @param {object} Currency 货币类型 , 不允许为空
         * @param {number} Count 数量 , 不允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static UseCurrency(Currency: object, Count: number, success?: Function, error?: Function): void;

        /**
         * 在商城获得货币
         * Gain currency in the mall
         * @param {object} Currency 货币类型 , 不允许为空
         * @param {number} Count 数量 , 不允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static GainCurrencyByMall(Currency: object, Count: number, success?: Function, error?: Function): void;

        /**
         * 在商城使用货币
         * Use currency in the mall
         * @param {object} Currency 货币类型 , 不允许为空
         * @param {number} Count 数量 , 不允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static UseCurrencyByMall(Currency: object, Count: number, success?: Function, error?: Function): void;
    }
}

declare module Edbox {
    /**
     * Edbox经济组件货币模块
     * 用于Edbox平台的经济组件,用于实现经济系统中货币的管理
     * @author 温荣泉(201901)
     * @version 0.0.0.1 (2019年04月26日 02:13:52)
     * @see http://ndsdn.nd.com.cn/index.php?title=Edbox经济组件#.E8.B4.A7.E5.B8.81.E6.A8.A1.E5.9D.97
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
     *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
     * */
    class Currency {
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
         * 服务器记录的货币类型(1-10)
         * Currency type recorded by the server(1-10)
         * Type : Int
         * Default Value : 
         */
        public Index: number;

        /**
         * 名称
         * Name
         * Type : Text
         * Default Value : 
         */
        public Name: string;

        /**
         * 图标
         * Icon
         * Type : Image
         * Default Value : 
         */
        public Icon: string;

        /**
         * 描述
         * Description
         * Type : LongText
         * Default Value : 
         */
        public Description: string;

        /**
         * 属性
         * Attribute
         * Type : Json
         * Default Value : 
         */
        public Attribute: object;

        /**
         * 通过服务器验证配置表的数据
         * Verify the data of the configuration table through the server
         * @param {Function} success 成功回调 , 带Function参数Currency , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Get(success?: Function, error?: Function): void;

        /**
         * 通过服务器保存数据
         * Save data through the server
         * @param {Function} success 成功回调 , 带Function参数Currency , 允许为空
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
         * 货币列表
         * Currency List
         * Type : Array
         * ArrayType : Currency
         * Default Value : 
         */
        public static CurrencyList: Array<object>;

        /**
         * 根据配置表Json数据获取配置表初始化
         * According to the configuration table Json data acquisition configuration table initialization
         * @param {string} data 配置表Json数据 , 不允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static Init(data: string, success?: Function, error?: Function): void;

        /**
         * 获取货币根据货币GUID
         * Get currency based on currency GUID
         * @param {string} guid GUID值 , 不允许为空
         * @returns {Object} 货币对象
         */
        public static GetByGUID(guid: string): object;

        /**
         * 获取货币根据游戏内唯一ID
         * Get currency based on in-game unique ID
         * @param {string} id 游戏内唯一ID , 不允许为空
         * @returns {Object} 货币对象
         */
        public static GetByID(id: string): object;

        /**
         * 获取货币根据货币名称
         * Get currency based on item name
         * @param {string} name 货币名称 , 不允许为空
         * @returns {Object} 货币对象
         */
        public static GetByName(name: string): object;

        /**
         * 获取货币列表
         * Get the list of currency
         * @returns {Array} 货币列表 , 队列类型 : Currency
         */
        public static GetList(): Array<object>;

        /**
         * 获取配置表Json
         * Get the configuration table Json
         * @returns {String} 配置表Json
         */
        public static GetJson(): string;

        /**
         * 新建货币
         * New Currency
         * @param {object} obj 货币初始配置 , 允许为空
         * @param {Function} success 成功回调 , 带Function参数Currency , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static New(obj?: object, success?: Function, error?: Function): void;

        /**
         * 保存货币列表
         * Save Currency List
         * @param {Function} success 成功回调 , 带Function参数Array , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static SaveList(success?: Function, error?: Function): void;
    }
}
