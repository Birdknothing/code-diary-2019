declare module UtilBarn {
    /**
     * UtilBarn编辑器通用组件
     * 用于UtilBarn平台的编辑器基础服务框架,拓展UtilBarn Html5编辑器接入平台的方法
     * @author 温荣泉(201901)
     * @version 0.0.0.1 (2019年05月09日 19:36:21)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn编辑器通用组件
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用组件
     * */
    class Editor {
        /**
         * 创建一个组件实例
         */
        constructor(obj?: object);



        /**
         * UtilBarn上的游戏id
         * Game id on UtilBarn
         * Type : Text
         * Default Value : 
         */
        public static GameId: string;

        /**
         * UtilBarn平台上的游戏版本
         * Game version on the UtilBarn platform
         * Type : Text
         * Default Value : 
         */
        public static Version: string;

        /**
         * package包在NDR上的GUID
         * Package package GUID on NDR
         * Type : Text
         * Default Value : 
         */
        public static PackageGuid: string;

        /**
         * 访问类型  1-模板 2-个人库 3-体验库
         * Access Type 1 - Template 2 - Personal Library 3 - Experience Library
         * Type : Int
         * Default Value : 2
         */
        public static Access: number;

        /**
         * 访问模式 0-显示需求 1-试玩需求 2-分享需求 3-编辑 4-体验区游戏
         * Access Mode 0-Display Requirements 1-Trial Needs 2-Share Requirements 3-Edit 4-Experience Zone Game
         * Type : Int
         * Default Value : 1
         */
        public static Mode: number;

        /**
         * 游戏名称
         * Game name
         * Type : Text
         * Default Value : 
         */
        public static GameName: string;

        /**
         * 游戏简介
         * Game description
         * Type : LongText
         * Default Value : 
         */
        public static Description: string;

        /**
         * 封面图片
         * Cover Image
         * Type : Image
         * Default Value : 
         */
        public static CoverImage: string;

        /**
         * 获取GameBaseConfig.json
         * Get GameBaseConfig.json
         * @param {object} datas 完整数据 , 不允许为空
         * @returns {String} GameBaseConfig.json的内容
         */
        public static GetGameBaseConfigJson(datas: object): string;

        /**
         * 获取AssetConfig.json
         * Get AssetConfig.json
         * @param {object} datas 完整数据 , 不允许为空
         * @returns {String} AssetConfig.json的内容
         */
        public static GetAssetConfigJson(datas: object): string;

        /**
         * 获取TextConfig.json
         * Get GameBaseConfig.json
         * @param {object} datas 完整数据 , 不允许为空
         * @returns {String} TextConfig.json的内容
         */
        public static GetTextConfigJson(datas: object): string;

        /**
         * 获取PackageZip
         * Get PackageZip
         * @param {object} datas 完整数据 , 不允许为空
         * @param {Function} success 成功回调,带Object类型参数Blob , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static GetPackageBlob(datas: object, success?: Function, error?: Function): void;

        /**
         * 保存
         * Save
         * @param {object} datas 完整数据 , 不允许为空
         * @param {Function} success 成功回调,带String类型新GameID , 带Function参数String , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static Save(datas: object, success?: Function, error?: Function): void;

        /**
         * 另保存
         * Save as
         * @param {object} datas 完整数据 , 不允许为空
         * @param {Function} success 成功回调,带String类型新GameID , 带Function参数String , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static SaveAs(datas: object, success?: Function, error?: Function): void;

        /**
         * 试玩
         * Play
         * @param {object} datas 完整数据 , 不允许为空
         * @param {Function} success 成功回调 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static Play(datas: object, success?: Function, error?: Function): void;

        /**
         * 读取Package数据包的数据到Datas对象中
         * Read the data of the Package packet into the Datas object
         * @param {object} datas Datas对象 , 不允许为空
         * @param {Function} success 成功回调，带参数Datas对象 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static LoadDatas(datas: object, success?: Function, error?: Function): void;

        /**
         * 返回主页
         * Back to the homepage
         */
        public static GotoHomePage(): void;

        /**
         * 查询最近编辑记录数据
         * GetEditRecordInfo
         * @param {Number} page 页码
         * @param {Number} size 每页大小
         * @param {Function} success 成功回调，带参数Datas对象 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static GetEditRecordInfo(page: Number, size: Number,success?: Function, error?: Function): void;

        /**
         * 清除编辑记录
         * PostClearEditRecord
         * @param {Function} success 成功回调，带参数Datas对象 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static PostClearEditRecord( success?: Function, error?: Function): void;

        /**
         * 打开游戏编辑器页面
         * OpenGameEditor
         * @param {string} app_id 作品id
         * @param {string} version 作品版本
         * @param {Function} success 成功回调，带参数Datas对象 , 带string参数试玩链接
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static OpenGameEditor(app_id: string, version: string,success?: Function, error?: Function): void;
    }
}
