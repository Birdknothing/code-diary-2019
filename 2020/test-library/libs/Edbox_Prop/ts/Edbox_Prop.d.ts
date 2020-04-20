declare module Edbox {
    /**
     * Edbox道具组件
     * 用于Edbox平台的道具组件,用于实现道具的管理
     * @author 温荣泉(201901)
     * @version 0.0.0.1 (2019年04月26日 02:24:40)
     * @see http://ndsdn.nd.com.cn/index.php?title=Edbox道具组件
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
     *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
     * */
    class Prop {
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
         * 叠加上限
         * Stack Limit
         * Type : Int
         * Default Value : 1
         */
        public StackLimit: number;

        /**
         * 稀有度
         * Rarity
         * Type : Int
         * Default Value : 1
         */
        public Rarity: number;

        /**
         * 持续时间
         * Duration
         * Type : Int
         * Default Value : 0
         */
        public Duration: number;

        /**
         * 通过服务器验证配置表的数据
         * Verify the data of the configuration table through the server
         * @param {Function} success 成功回调 , 带Function参数Prop , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Get(success?: Function, error?: Function): void;

        /**
         * 通过服务器保存数据
         * Save data through the server
         * @param {Function} success 成功回调 , 带Function参数Prop , 允许为空
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
         * 道具列表
         * Prop List
         * Type : Array
         * ArrayType : Prop
         * Default Value : null
         */
        public static PropList: Array<object>;

        /**
         * 根据配置表Json数据获取配置表初始化道具表
         * According to the configuration table Json data acquisition configuration table initialization props table
         * @param {string} data 配置表Json数据 , 不允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static Init(data: string, success?: Function, error?: Function): void;

        /**
         * 获取道具根据道具GUID
         * Get prop based on props GUID
         * @param {string} guid GUID值 , 不允许为空
         * @returns {Object} 道具对象
         */
        public static GetByGUID(guid: string): object;

        /**
         * 获取道具根据游戏内唯一ID
         * Get prop based on in-game unique ID
         * @param {string} id 游戏内唯一ID , 不允许为空
         * @returns {Object} 道具对象
         */
        public static GetByID(id: string): object;

        /**
         * 获取道具根据道具名称
         * Get prop based on item name
         * @param {string} name 道具名称 , 不允许为空
         * @returns {Object} 道具对象
         */
        public static GetByName(name: string): object;

        /**
         * 获取道具列表
         * Get the list of items
         * @returns {Array} 道具对象列表 , 队列类型 : Prop
         */
        public static GetList(): Array<object>;

        /**
         * 获取配置表Json
         * Get the configuration table Json
         * @returns {String} 配置表Json
         */
        public static GetJson(): string;

        /**
         * 新建道具
         * New prop
         * @param {object} obj 道具初始配置 , 允许为空
         * @param {Function} success 成功回调 , 带Function参数Prop , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static New(obj?: object, success?: Function, error?: Function): void;

        /**
         * 保存道具列表
         * Save Prop List
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static SaveList(success?: Function, error?: Function): void;
    }
}
