declare module Edbox {
    /**
     * Edbox商城组件
     * 用于Edbox平台的商城组件,用于实现商城、商店、商品的管理
     * @author 温荣泉(201901)
     * @version 0.0.0.1 (2019年04月26日 02:51:39)
     * @see http://ndsdn.nd.com.cn/index.php?title=Edbox商城组件
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
     *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
     *      Edbox.Prop:http://ndsdn.nd.com.cn/index.php?title=Edbox道具组件
     *      Edbox.Store:http://ndsdn.nd.com.cn/index.php?title=Edbox商城组件#.E5.95.86.E5.BA.97.E6.A8.A1.E5.9D.97
     *      Edbox.Commodity:http://ndsdn.nd.com.cn/index.php?title=Edbox商城组件#.E5.95.86.E5.93.81.E6.A8.A1.E5.9D.97
     * */
    class Mall {
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
         * 商城名称
         * Mall Name
         * Type : Text
         * Default Value : 商店
         */
        public MallName: string;

        /**
         * 商城入口图标
         * Mall Entrance Icon
         * Type : Image
         * Default Value : 
         */
        public MallIcon: string;

        /**
         * 商城背景
         * Mall Background Image
         * Type : Image
         * Default Value : 
         */
        public BackgroundImage: string;

        /**
         * 打开商城音效
         * Open Mall Audio
         * Type : Audio
         * Default Value : 
         */
        public OpenAudio: string;

        /**
         * 关闭商城音效
         * Close Mall Audio
         * Type : Audio
         * Default Value : 
         */
        public CloseAudio: string;

        /**
         * 商城广告文
         * Mall AD
         * Type : LongText
         * Default Value : 
         */
        public MallAD: string;

        /**
         * 商店列表
         * Store List
         * Type : Array
         * ArrayType : Store
         * Default Value : null
         */
        public StoreList: Array<object>;

        /**
         * 购买确认提示
         * Purchase Confirmation Prompt
         * Type : Array
         * ArrayType : Text
         * Default Value : null
         */
        public PurchaseConfirmationPrompt: Array<string>;

        /**
         * 购买成功提示
         * Purchase Success Prompt
         * Type : Array
         * ArrayType : Text
         * Default Value : null
         */
        public PurchaseSuccessPrompt: Array<string>;

        /**
         * 购买失败提示
         * Purchase Failure Prompt
         * Type : Array
         * ArrayType : Text
         * Default Value : null
         */
        public PurchaseFailurePrompt: Array<string>;

        /**
         * 余额不足提示
         * Insufficient Balance Prompt
         * Type : Array
         * ArrayType : Text
         * Default Value : null
         */
        public InsufficientBalancePrompt: Array<string>;

        /**
         * 达到购买上限提示
         * Purchase Limit Prompt
         * Type : Array
         * ArrayType : Text
         * Default Value : null
         */
        public PurchaseLimitPrompt: Array<string>;

        /**
         * 购买按钮文字
         * Purchase Button Text
         * Type : Text
         * Default Value : 
         */
        public PurchaseButtonText: string;

        /**
         * 提示框背景
         * Tip Box Background
         * Type : Image
         * Default Value : 
         */
        public TipBoxBackground: string;

        /**
         * 商品详情背景
         * Product Details Background
         * Type : Image
         * Default Value : 
         */
        public CommodityDetailsBackground: string;

        /**
         * 商品底框
         * Commodity Bottom Frame
         * Type : Image
         * Default Value : 
         */
        public CommodityBottomFrame: string;

        /**
         * 关闭按钮图片
         * Close Button Image
         * Type : Image
         * Default Value : 
         */
        public CloseButtonImage: string;

        /**
         * 按钮底框
         * Button Bottom Frame
         * Type : Image
         * Default Value : 
         */
        public ButtonBottomFrame: string;

        /**
         * 按钮点击音效
         * Button Click Sound
         * Type : Audio
         * Default Value : 
         */
        public ButtonClickSound: string;

        /**
         * 通过服务器验证配置表的数据
         * Verify the data of the configuration table through the server
         * @param {Function} success 成功回调 , 带Function参数Mall , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Get(success?: Function, error?: Function): void;

        /**
         * 通过服务器保存数据
         * Save data through the server
         * @param {Function} success 成功回调 , 带Function参数Mall , 允许为空
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
         * 创建商店
         * Create Store
         * @param {Function} success 成功回调 , 带Function参数Store , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public CreateStore(success?: Function, error?: Function): void;

        /**
         * 打开UI
         * Open UI
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Open(success?: Function, error?: Function): void;

        /**
         * 当前实例
         * Current Instance
         * Type : Mall
         * Default Value : null
         */
        public static Current: object;

        /**
         * 购买回调
         * Buy Callback
         * Type : Function
         * FunctionType : Commodity, Int
         * Default Value : null
         */
        public static BuyCallback: Function;

        /**
         * 商品是否可以购买判断方法，返回是否
         * Whether the product can be purchased as a judgment method, return True or False
         * Type : Function
         * FunctionType : Commodity, Int
         * Function Return Type : Boolean
         * Default Value : null
         */
        public static CanBuyJudgeFunction: Function;

        /**
         * 根据配置表Json数据获取配置表初始化商城
         * According to the configuration table Json data acquisition configuration table initialization mall
         * @param {string} data 配置表Json数据 , 不允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static Init(data: string, success?: Function, error?: Function): void;

        /**
         * 获取商城中的所有商店
         * Get all the items in the mall
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
         * 打开商城UI
         * Open Mall UI
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static OpenMall(success?: Function, error?: Function): void;
    }
}

declare module Edbox {
    /**
     * Edbox商城组件商店模块
     * 用于Edbox平台的商城组件,用于实现商店的管理
     * @author 温荣泉(201901)
     * @version 0.0.0.1 (2019年04月26日 02:51:39)
     * @see http://ndsdn.nd.com.cn/index.php?title=Edbox商城组件#.E5.95.86.E5.BA.97.E6.A8.A1.E5.9D.97
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
     *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
     *      Edbox.Prop:http://ndsdn.nd.com.cn/index.php?title=Edbox道具组件
     *      Edbox.Commodity:http://ndsdn.nd.com.cn/index.php?title=Edbox商城组件#.E5.95.86.E5.93.81.E6.A8.A1.E5.9D.97
     * */
    class Store {
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
         * 商店名称
         * Store Name
         * Type : Text
         * Default Value : 
         */
        public StoreName: string;

        /**
         * 商品列表
         * Commodity List
         * Type : Array
         * ArrayType : Commodity
         * Default Value : 
         */
        public CommodityList: Array<object>;

        /**
         * 通过服务器验证配置表的数据
         * Verify the data of the configuration table through the server
         * @param {Function} success 成功回调 , 带Function参数Store , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Get(success?: Function, error?: Function): void;

        /**
         * 通过服务器保存数据
         * Save data through the server
         * @param {Function} success 成功回调 , 带Function参数Store , 允许为空
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
         * 创建商品
         * Create Commodity
         * @param {Function} success 成功回调 , 带Function参数Commodity , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public CreateCommodity(success?: Function, error?: Function): void;

        /**
         * 打开UI
         * Open UI
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Open(success?: Function, error?: Function): void;


        /**
         * 获取商店根据商店GUID
         * Get Store based on Store GUID
         * @param {string} guid GUID值 , 不允许为空
         * @param {Function} success 成功回调 , 带Function参数Store , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static GetByGUID(guid: string, success?: Function, error?: Function): void;
    }
}

declare module Edbox {
    /**
     * Edbox商城组件商品模块
     * 用于Edbox平台的商城组件,用于实现商品的管理
     * @author 温荣泉(201901)
     * @version 0.0.0.1 (2019年04月26日 02:51:39)
     * @see http://ndsdn.nd.com.cn/index.php?title=Edbox商城组件#.E5.95.86.E5.93.81.E6.A8.A1.E5.9D.97
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
     *      Edbox.Request:http://ndsdn.nd.com.cn/index.php?title=Edbox通用请求授权组件
     *      Edbox.Prop:http://ndsdn.nd.com.cn/index.php?title=Edbox道具组件
     *      Edbox.Currency:http://ndsdn.nd.com.cn/index.php?title=Edbox经济组件#.E8.B4.A7.E5.B8.81.E6.A8.A1.E5.9D.97
     * */
    class Commodity {
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
         * 位置
         * Index
         * Type : Int
         * Default Value : 0
         */
        public Index: number;

        /**
         * 商品名称
         * Commodity Name
         * Type : Text
         * Default Value : 
         */
        public CommodityName: string;

        /**
         * 商品图片
         * Commodity Image
         * Type : Image
         * Default Value : 
         */
        public Image: string;

        /**
         * 商品介绍
         * Commodity Description
         * Type : Text
         * Default Value : 
         */
        public Description: string;

        /**
         * 开始出售时间
         * Start Sale Time
         * Type : DateTime
         * Default Value : null
         */
        public StartSaleTime: Date;

        /**
         * 结束出售时间
         * End Sale Time
         * Type : DateTime
         * Default Value : null
         */
        public EndSaleTime: Date;

        /**
         * 是否库存限制
         * Is Inventory Limit
         * Type : Boolean
         * Default Value : true
         */
        public IsInventoryLimit: boolean;

        /**
         * 库存限制
         * Inventory Limit
         * Type : Int
         * Default Value : 0
         */
        public InventoryLimit: number;

        /**
         * 是否商品限购
         * Is Purchase Limit
         * Type : Boolean
         * Default Value : true
         */
        public IsPurchaseLimit: boolean;

        /**
         * 商品限购类型
         * Purchase Limit Type
         * Type : Enum
         * EnumType : Day, Week, Total
         * Default Value : 0
         */
        public PurchaseLimitType: number;

        /**
         * 商品限购
         * Purchase Limit
         * Type : Int
         * Default Value : 0
         */
        public PurchaseLimit: number;

        /**
         * 绑定道具
         * Binding Prop
         * Type : Prop
         * Default Value : null
         */
        public BindingProp: object;

        /**
         * 绑定道具数量
         * Binding Prop Count
         * Type : Int
         * Default Value : 1
         */
        public BindingPropCount: number;

        /**
         * 商品价格
         * Commodity Price
         * Type : Map
         * MapType : Currency, Int
         * Default Value : null
         */
        public Price: Dictionary;

        /**
         * 通过服务器验证配置表的数据
         * Verify the data of the configuration table through the server
         * @param {Function} success 成功回调 , 带Function参数Commodity , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Get(success?: Function, error?: Function): void;

        /**
         * 通过服务器保存数据
         * Save data through the server
         * @param {Function} success 成功回调 , 带Function参数Commodity , 允许为空
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
         * 购买
         * Buy
         * @param {object} Currency 支付货币类型 , 不允许为空
         * @param {number} Count 购买数量 , 允许为空
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Buy(Currency: object, Count?: number, success?: Function, error?: Function): void;

        /**
         * 打开UI
         * Open UI
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Open(success?: Function, error?: Function): void;


        /**
         * 获取商品根据商品GUID
         * Get Commodity based on Commodity GUID
         * @param {string} guid GUID值 , 不允许为空
         * @param {Function} success 成功回调 , 带Function参数Commodity , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static GetByGUID(guid: string, success?: Function, error?: Function): void;
    }
}
