/**
 * Edbox 通用组件
 * 用于Edbox平台的基础服务框架
 * 拓展Edbox Html5游戏必须或常用Js方法
 * @author 温荣泉(201901)
 * @see http://ndsdn.nd.com.cn/index.php?title=Edbox%E9%80%9A%E7%94%A8%E7%BB%84%E4%BB%B6JS%E7%89%88
 * */
declare class Edbox {
    /**
     * Edbox平台用户id，用于获取平台角色信息
     */
    public static EbUserId: number;

    /**
     * Edbox平台用户昵称
     */
    public static UserName: string;

    /**
     * UC的用户id
     */
    public static AccountId: string;

    /**
     * 账号登陆渠道, "Default"(默认),"Edbox","Edmodo","99U","101PPT","101Lms","Frt","Wjt","Hwt","QQ","Weixin","Weibo","Facebook","Google","Twitter","Guest"
     */
    public static AccountType: string;

    /**
     * 用户的头像
     */
    public static Avatar: string;

    /**
     * UC的用户Token
     */
    public static AccessToken: string;

    /**
     * UC的用户秘钥
     */
    public static MacKey: string;

    /**
     * 本地时间与UC服务器时间的间隔
     */
    public static TimeStamp: number;

    /**
     * SDP应用ID
     */
    public static SDPAppId: string;

    /**
     * 访问类型 1-模板 2-个人库 3-体验库
     */
    public static Access: number;

    /**
     * Edbox上的游戏id
     */
    public static GameId: string;

    /**
     * Edbox上的游戏版本
     */
    public static Version: string;

    /**
     * 访问模式 0-显示需求 1-试玩需求 2-分享需求 3-编辑 4-体验区游戏
     */
    public static Mode: string;

    /**
     * package包在NDR上的guid  用于H5平台
     */
    public static PackageGuid: string;

    /**
     * 地区， 中国：CHN，美国：USA， 香港：HK
     */
    public static Area: string;

    /**
     * 语言，English,SimplifiedChinese,TraditionalChinese
     */
    public static Language: string;

    /**
     * 渠道, "Default"(默认), "Edbox", "Edbox_cn", "MingXingAPP", "HaoWenTi", "Conquer"
     */
    public static Channel: string;

    /**
     * 是否已经登录
     */
    public static IsLogin: boolean;

    /**
     * 服务器关键字，QA:QA提测(默认)、Dev:开发、Feature:特性测试、CN:国内、US:海外、HK:香港
     */
    public static ServerKey: string;

    /**
     * 获取Base64编码的登录信息
     * @return {String} Base64编码的登录信息
     * */
    public static GetLoginInfo(): string;

    /**
     * 登录成功委托设置
     * @param {Boolean} isLogin 是否成功登录
     */
    public static LoggedCallBack(IsLogin: boolean): void;

    /**
     * Edbox 登录启动
     * @param {Function} callback 登录结束回调方法
     */
    public static Start(callback?: Function): void;

    /**
     * Edbox 退出
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    public static Logout(success?: Function, error?: Function): void;

    /**
     * 获取组织信息
     * @param {Function} success 成功回调,Object类型{ID:组织ID,Name:组织名称}
     * @param {Function} error 出错回调
     */
    public static GetOrgInfo(success?: Function, error?: Function): void;

    /**
     * 获取生日、年龄信息
     * @param {Function} success 成功回调, Object类型{Birth:出生日期(String),Age:年龄周岁(Int)}
     * @param {Function} error 出错回调
     */
    public static GetBirthInfo(success?: Function, error?: Function): void;

    /**
     * 设置语言
     * @param {String} lan 语言参数，English,SimplifiedChinese,TraditionalChinese
     */
    public static SetLanguage(lan: string): void;

    /**
     * 前往 Edbox 编辑器
     */
    public static GotoEditor(): void;

    /**
     * 前往试玩游戏
     * @param {Function} error 出错回调
     */
    public static GotoPreviewGame(error?: Function): void;

    /**
     * 获取试玩Url
     * @param {Function} success 成功回调,带参数试玩Url，带登录信息仅用于开发者自行试玩
     * @param {Function} error 出错回调
     */
    public static GetPreviewGameUrl(success?: Function, error?: Function): void;

    /**
     * 获取分享Url
     * @returns {String} 分享Url，可用于生成二维码
     * */
    public static GetShareUrl(): string;

    /**
     * 从服务端获取分享Url
     * @param {Function} success 成功回调,带参数分享Url，可用于生成二维码
     * @param {Function} error 出错回调
     */
    public static GetShareUrlFromServer(success?: Function, error?: Function): void;

    /**
     * 获取Host地址
     * @param {String} key 关键字:MMO、NDR、CS、CDNCS、FrontendLib、Login
     * @returns {String} Host地址
     */
    public static GetHost(key: string): string;

    /**
     * 获取提示信息
     * @param {String} key 关键字
     * @returns {String} 提示信息
     */
    public static GetTip(key: string): string;

    /**
     * 获取GUID
     * @return {String} GUID
     * */
    public static GetGUID(): string;

    /**
     * Base64 编码
     * @param {String} input 需要编码的数据
     * @return {String} Base64编码的数据
     * */
    public static Encode(input: string): string;

    /**
     * Base64 解码
     * @param {String} input 编码的数据
     * @return {String} Base64解码的结果
     * */
    public static Decode(input: string): string;

    /**
     * 获取Url中的参数
     * @param {String} name 参数名称
     * @param {String} url URl地址，为空时为默认window.location.href
     * @return {String} 参数值
     * */
    public static GetQueryString(name: string, url?: string): string;

    /**
     * 设置Url中的参数
     * @param {String} name 参数名称
     * @param {String} value 参数值
     * @param {String} url URl地址，为空时为默认window.location.href
     * @return {String} 配置后的Url
     * */
    public static SetQueryString(name: string, value: string, url?: string): string;

    /**
     * 移除Url中的参数
     * @param {String} name 参数名称
     * @param {String} url URl地址，为空时为默认window.location.href
     * @return {String} 配置后的Url
     * */
    public static RemoveQueryString(name: string, url?: string): string;

    /**
     * @param {String} src 资源路径 或者 base64字符串
     * @param {String} filename 文件名称
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     * @param {Function} progress 进度回调 仅在通过资源路径下载时使用 带三个参数：per当前进度百分比，loaded已下载文件大小,total文件总大小
     */
    public static DownLoad(src: string, filename?: String, success?: Function, error?: Function, progress?: Function): void;

}

declare module Edbox {
    /**
     * 关于Cookie的操作设置
     * */
    class Cookie {
        /**
         * 设置cookie方法
         * @param {String} key 关键字
         * @param {String} val 值
         * @param {number} time 有效期
         * */
        public static Set(key: string, val: string, time: number): void;

        /**
         * 获取cookie
         * @param {String} key 关键字
         * @returns {String} 值
         * */
        public static Get(key: string): string;

        /**
         * 删除cookie
         * @param {String} key 关键字
         * */
        public static Delete(key: string): void;
    }

    /**
     * 平台模块
     * */
    class Platform {
        // 平台类型
        public static IsWindowsPhone: boolean;
        public static IsSymbian: boolean; // 塞班手机、指示所有微软系统的移动端
        public static IsAndroid: boolean; // 安卓手机、指示所有安卓系统的移动端
        public static IsIPhone: boolean;
        public static IsIpad: boolean;
        public static IsIOS: boolean; // 苹果手机、指示所有苹果系统的移动端
        public static IsPC: boolean; // PC、指示电脑或其他非常用移动端手机类型
        public static IsWin64: boolean; // 64位Windows
        public static IsWin32: boolean; // 32位Windows
        public static IsMac: boolean; // Mac系统

        // 内嵌浏览器类型
        public static IsQQ: boolean; // QQ内嵌浏览器
        public static IsWechat: boolean; // 微信内嵌浏览器
        public static IsAlipay: boolean; // 支付宝内嵌浏览器
        public static Is99U: boolean; // 99U内嵌浏览器
        public static IsEdbox: boolean; // Edbox内嵌浏览器

        // 内核类型
        public static IsWebKit: boolean;
        public static IsIE: boolean;

        // 常用浏览器类型
        public static IsChrome: boolean;
        public static IsFirefox: boolean;
        public static IsSafari: boolean;
        public static IsOpera: boolean;
        public static IsUC: boolean;
    }

    /**
     * Edbox 前端分类库组件
     * 用于Edbox平台的访问前端分类库服务器搜索资源
     * */
    class FrontendLib {
        /**
         * 维度ID
         */
        public static DimensionID: string;

        /**
         * 查询前端分类树
         * @param {String} tag 标签ID
         * @param {Function} success 成功回调,带参数Data:List
         * @param {Function} error 出错回调
         * @param {String} dimensionid 维度ID
         */
        public static GetSortTree(tag?: string, success?: Function, error?: Function, dimensionid?: string): void;

        /**
         * 获取分类下的资源列表
         * @param {String} tag 标签ID
         * @param {String} key 关键词
         * @param {Number} page 页码
         * @param {Number} size 每页大小
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {String} dimensionid 维度ID
         */
        public static GetResources(tag?: string, key?: string, page?: number, size?: number, success?: Function, error?: Function, dimensionid?: string): void;

        /**
         * 设置维度ID
         * @param {String} key 维度关键字
         * @return {String} 维度ID
         */
        public static SetDimensionID(key: string): string;
    }

    /**
     * Edbox 新前端分类库组件
     * 用于Edbox平台的访问新前端分类库服务器搜索资源
     * */
    class NewFrontendLib {
        /**
         * 维度ID
         */
        public static DimensionID: string;

        /**
         * 查询前端分类树
         * @param {String} tag 标签ID
         * @param {Function} success 成功回调,带参数Data:List
         * @param {Function} error 出错回调
         * @param {String} dimensionid 维度ID
         */
        public static GetSortTree(tag?: string, success?: Function, error?: Function, dimensionid?: string): void;

        /**
         * 获取分类下的资源列表
         * @param {String} tag 标签ID
         * @param {String} key 关键词
         * @param {Number} page 页码
         * @param {Number} size 每页大小
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {String} dimensionid 维度ID
         */
        public static GetResources(tag?: string, key?: string, page?: number, size?: number, success?: Function, error?: Function, dimensionid?: string): void;

        /**
         * 设置维度ID
         * @param {String} key 维度关键字
         * @return {String} 维度ID
         */
        public static SetDimensionID(key: string): string;
    }

    /**
     * Edbox 资源加载组件
     * 用于Edbox平台的资源加载过程
     * */
    class Resource {
        /**
         * 资源Zip包
         */
        public static PackageZip: object;

        /**
         * 请求资源
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {Boolean} async 是否异步
         */
        public static Get(guid: string, success?: Function, error?: Function, async?: Boolean): void;

        /**
         * 请求音频地址
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数URL:String
         * @param {Function} error 出错回调
         * @param {any} formats 指定音频格式,例如mp3、ogg、[mp3、ogg] , 留空时获取源文件
         * @param {Boolean} async 是否异步
         */
        public static GetAudio(guid: string, success?: Function, error?: Function, format?: any, async?: Boolean): void;

        /**
         * 请求图片地址
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数URL:String
         * @param {Function} error 出错回调
         * @param {any} formats 指定图片格式,例如png、jpeg、[png、jpeg] , 留空时获取源文件
         * @param {Boolean} async 是否异步
         */
        public static GetImage(guid: string, success?: Function, error?: Function, format?: any, async?: Boolean): void;

        /**
         * 请求字体地址
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数URL:String
         * @param {Function} error 出错回调
         * @param {any} formats 指定图片格式,例如ttf、woff、[ttf、woff] , 留空时获取源文件
         * @param {Boolean} async 是否异步
         */
        public static GetFont(guid: string, success?: Function, error?: Function, format?: any, async?: Boolean): void;

        /**
         * 获取资源包，记录至PackageZip
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数Zip包:Object
         * @param {Function} error 出错回调
         * @param {Boolean} async 是否异步
         */
        public static GetPackage(guid: string, success?: Function, error?: Function, async?: Boolean): void;

        /**
         * 获取配置，需先获取资源包
         * @param {String} name 配置名称
         * @param {Function} success 成功回调,带配置Json对象:Object
         * @param {Function} error 出错回调
         */
        public static GetConfig(name: string, success?: Function, error?: Function): void;

        /**
         * 读取Package数据包的数据到Datas对象中
         * @param {Object} datas Datas对象
         * @param {Function} success 成功回调，带参数Datas对象
         * @param {Function} error 出错回调
         */
        public static LoadDatas(datas: object, success?: Function, error?: Function): void;
    }
    /**
     * Edbox 授权请求组件
     * 用于Edbox平台游戏向服务器请求或提交数据
     * */
    class Request {
        /**
         * 获取授权信息
         * @param {String} httpmethod Http请求方法: "Get","Post"
         * @param {String} url URL地址 "/index.html"
         * @param {String} host Host: "192.168.211.67:19001"
         * @returns {String} 授权信息
         */
        public static GetAuthorization(httpmethod: string, url: string, host: string): string;

        /**
         * Get请求获取数据
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        public static Get(host: string, url: string, data: string, success?: Function, error?: Function): object;

        /**
         * Get请求获取数据,带language参数
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        public static GetWithLanguage(host: string, url: string, data: string, success?: Function, error?: Function): object;

        /**
         * Get请求获取数据,带env参数
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        public static GetWithEnv(host: string, url: string, data: string, success?: Function, error?: Function): object;

        /**
         * Get请求获取数据，带请求头，如服务器不支持，将出现跨域问题
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Object} header 请求头
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        public static GetWithHeader(host: string, suburl: string, data: string, header: object, success?: Function, error?: Function, protocol?: string): object;

        /**
         * Get请求获取数据，不带请求头
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        public static GetWithoutHeader(host: string, url: string, data: string, success?: Function, error?: Function, protocol?: string): object;

        /**
         * Post请求获取数据
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带对象类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        public static Post(host: string, url: string, data: string, success?: Function, error?: Function): object;

        /**
         * Post请求获取数据,带language参数
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        public static PostWithLanguage(host: string, url: string, data: string, success?: Function, error?: Function): object;

        /**
         * Post请求获取数据,带env参数
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} url URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        public static PostWithEnv(host: string, url: string, data: string, success?: Function, error?: Function): object;

        /**
         * Post请求获取数据，带请求头，如服务器不支持，将出现跨域问题
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Object} header 请求头
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        public static PostWithHeader(host: string, suburl: string, data: string, header: object, success?: Function, error?: Function, protocol?: string): object;

        /**
         * Post请求获取数据，不带请求头
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        public static PostWithoutHeader(host: string, suburl: string, data: string, success?: Function, error?: Function, protocol?: string): object;

        /**
         * Patch请求获取数据，带请求头，如服务器不支持，将出现跨域问题
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Object} header 请求头
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        public static PatchWithHeader(host: string, suburl: string, data: string, header: object, success?: Function, error?: Function, protocol?: string): object;

        /**
         * Delete请求获取数据，带请求头，如服务器不支持，将出现跨域问题
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {String} data 请求数据
         * @param {Object} header 请求头
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @param {String} protocol 网络请求协议
         * @returns {Object} Ajax对象
         */
        public static DeleteWithHeader(host: string, suburl: string, data: string, header: object, success?: Function, error?: Function, protocol?: string): object;

        /**
         * 发送请求获取数据
         * @param {String} httpmethod 请求类型 Get、Post、Patch、Delete
         * @param {String} protocol 网络请求协议: Http、Https
         * @param {String} host Host: "192.168.211.67:19001"
         * @param {String} suburl URL地址 "/index.html"
         * @param {any} data 请求数据
         * @param {Object} header 请求头
         * @param {Boolean} addAuth 是否添加授权请求头
         * @param {Function} success 成功回调,带Object类型返回结果
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        public static Send(httpmethod: string, protocol: string, host: string, suburl: string, data: any, header?: object, addAuth?: boolean, success?: Function, error?: Function): object;
    }
    /**
     * Edbox蒙版切图组件
     * 可用于Edbox平台的编辑模块开发，或其他需要切图的地方
     * */
    class MaskCutting {
        /**
         * 创建一个组件实例
         * */
        constructor(obj?: object);

        /**
         * 宽
         */
        public Width: number;

        /**
         * 高
         */
        public Height: number;

        /**
         * 质量
         */
        public Quality: number;

        /**
         * 生成的数据
         */
        public Datas: string;

        /**
         * 设置蒙版
         * @param {String} mask 蒙版图片路径
         * @param {Boolean} crossOrigin 是否设置跨域支持，不携带Cookie请求
         */
        public SetMask(mask: string, crossOrigin?: boolean): void;

        /**
         * 启动执行
         * @param {String} path 图片路径
         * @param {Function} success 成功回调，带string类型二进制生成数据
         * @param {Function} error 出错回调
         * @param {Boolean} cross 是否需要跨域
         */
        public Start(path: string, success?: Function, error?: Function, cross?: boolean): void;
    }
    /**
     * Edbox二维码组件JS版
     * 用于Edbox平台游戏二维码的生成与显示下载等操作
     * */
    class QRCode {
        /**
         * 生成的二维码Base64数据,执行生成后才有数据
         */
        public static Datas: string;

        /**
         * 创建二维码
         * @param {String} url Url地址
         * @param {Function} success 成功回调,带String类型二维码Base64数据结果
         * @param {Function} error 出错回调
         */
        public static Create(url: string, success?: Function, error?: Function): void;

        /**
         * 下载
         * @param {String} name 文件名称
         */
        public static Download(name: string): void;

        /**
         * 创建并下载二维码
         * @param {String} url Url地址
         * @param {String} name 文件名称
         * @param {Function} success 成功回调,带String类型二维码Base64数据结果
         * @param {Function} error 出错回调
         */
        public static CreateAndDownload(url: string, name?: string, success?: Function, error?: Function): void;

        /**
         * 显示二维码界面
         */
        public static Show(): void;

        /**
         * 隐藏二维码界面
         */
        public static Hide(): void;
    }
    /**
     * Edbox MMO组件
     * 用于Edbox平台的访问MMO服务器游戏发布试玩过程
     * */
    class MMO {
        /**
         * 获取模板或个人作品信息
         * 集成方法,返回效率受Edbox.Access的设置影响
         * @param {String} productid 模板id
         * @param {Function} success 成功回调,带Object类型参数,access_type定义类型 1、模板库 2、个人作品
         * @param {Function} error 出错回调
         * @param {Boolean} change 是否调整Edbox.Access，默认不调整
         */
        public static GetInfo(productid: string, success?: Function, error?: Function, change?: boolean): void;

        /**
         * 获取模板信息
         * @param {String} productid 模板id
         * @param {String} version 模板版本号,为空取最新版本
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static GetTemplateInfo(productid: string, version: string, success?: Function, error?: Function): void;

        /**
         * 获取个人作品信息
         * @param {String} productid 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static GetProductInfo(productid: string, success?: Function, error?: Function): void;

        /**
         * 验证作品是否重名
         * @param {String} productid 作品id
         * @param {Number} releaseMode 发布方式 1-创建新游 2-更新游戏
         * @param {String} productname 作品名称
         * @param {Number} type 获取类型 1-模板库  2-个人库 3-作品库
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static IsNameDuplicate(productid: string, releaseMode: number, productname: string, type: number, success?: Function, error?: Function): void;

        /**
         * 敏感词判断
         * @param {String} word 需要验证的字符串
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static IsSensitive(word: string, success?: Function, error?: Function): void;

        /**
         * 保存作品
         * @param {String} productid 作品id
         * @param {String} packageid 配置包GUID
         * @param {String} productname 作品名称
         * @param {String} icon 图标、封面
         * @param {String} introduction 描述介绍
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static SaveProduct(productid: string, packageid: string, productname: string, icon: string, introduction: string, success?: Function, error?: Function): void;

        /**
         * 创建作品
         * @param {String} productid 作品id
         * @param {String} packageid 配置包GUID
         * @param {String} productname 作品名称
         * @param {String} icon 图标、封面
         * @param {String} introduction 描述介绍
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {Object} infodata 作品信息数据对象
         */
        public static CreateProduct(productid: string, packageid: string, productname: string, icon: string, introduction: string, success?: Function, error?: Function, infodata?: object): void;

        /**
         * 更新作品
         * @param {String} productid 作品id
         * @param {String} packageid 配置包GUID
         * @param {String} productname 作品名称
         * @param {String} icon 图标、封面
         * @param {String} introduction 描述介绍
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {Object} infodata 作品信息数据对象
         */
        public static UpdateProduct(productid: string, packageid: string, productname: string, icon: string, introduction: string, success?: Function, error?: Function, infodata?: object): void;

        /**
         * 获取个人库游戏试玩信息
         * @param {String} productid 产品ID
         * @param {String} version 版本
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static GetTrialPlayInfo(productid: string, version?: string, success?: Function, error?: Function): void;

        /**
         * 获取游戏链接
         * @param {String} productid 产品ID
         * @param {String} version 版本
         * @param {any} access 访问类型  1-模板 2-个人库 3-体验库
         * @param {any} mode 访问模式 0-显示需求 1-试玩需求 2-分享需求  3-编辑 4-体验区游戏
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static GetGameLink(productid: string, version?: string, access?: any, mode?: any, success?: Function, error?: Function): void;

        /**
         * 获取作品列表
         * @param {String} key 关键字
         * @param {Number} page 页数
         * @param {Number} size 每页数量
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static GetProductList(key?: string, page?: number, size?: number, success?: Function, error?: Function): void;

        /**
         * 发布作品
         * @param {String} productid 作品id
         * @param {String} version 版本号
         * @param {String} packageid 配置包GUID
         * @param {String} productname 作品名称
         * @param {String} icon 图标、封面
         * @param {String} introduction 描述介绍
         * @param {Number} privacy 发布范围 2-活动 1-公开  0-私有
         * @param {String} activity_id 活动id
         * @param {String} screenshot 作品截图
         * @param {String} update_content 更新内容
         * @param {Date} schedule_time 发布时间,未填写或null时立即发布
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static ReleaseProduct(productid: string, version: string, packageid?: string, productname?: string, icon?: string, introduction?: string, privacy?: number, activity_id?: string, screenshot?: string, update_content?: string, schedule_time?: Date, success?: Function, error?: Function): void;
    }
    /**
     * Edbox NDR组件
     * 用于Edbox平台的访问NDR服务器上传下载过程
     * */
    class NDR {
        /**
         * 请求资源
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数Data:{Guid,Url,Type,Name}
         * @param {Function} error 出错回调
         * @param {Array} formats 指定格式支持队列,例如["mp3","ogg"] , 留空时获取源文件
         */
        public static Get(guid: string, success?: Function, error?: Function, formats?: Array<string>): void;

        /**
         * 基于Url后缀请求资源
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数Data:{Guid,Url,Type,Name}
         * @param {Function} error 出错回调
         * @param {Array} formats 指定格式支持队列,例如["mp3","ogg"] , 留空时获取源文件
         */
        public static GetWithUrlFormats(guid: string, success?: Function, error?: Function, formats?: Array<string>): void;

        /**
         * 请求资源列表
         * @param {Array} array 资源服务器GUID
         * @param {Function} success 成功回调,带参数Object:{"Guid":{Guid,Url,Type,Name}}
         * @param {Function} error 出错回调
         * @param {Array} formats 指定格式支持队列,例如["mp3","ogg"] , 留空时获取源文件
         */
        public static GetList(array: Array<string>, success?: Function, error?: Function, formats?: Array<string>): void;

        /**
         * 上传资源
         * @param {String} data Base64数据
         * @param {String} name 名称
         * @param {Function} progress 进度显示
         * @param {Function} success 成功回调,带参数Data:{Guid,Url,Type,Name}
         * @param {Function} error 出错回调
         */
        public static Post(data: string, name: string, progress?: Function, success?: Function, error?: Function): void;

        /**
         * 获取File的文本类型数据
         * @param {Object} file 输入文件
         * @param {Function} success 成功回调，带对象参数，对象带参数文件名称Name、文本二进制数据Data
         * @param {Function} error 出错回调
         */
        public static GetFileData(file: object, success?: Function, error?: Function): void;

        /**
         * Base64转Blob
         * @param {String} data Base64数据
         * @return {Object} Blob对象
         */
        public static Base64ToBlob(data: string): object;

        /**
         * Blob转Base64数据
         * @param {Object} blob Blob对象
         * @param {Function} success 成功回调,带String类型参数Base64数据
         */
        public static BlobToBase64(blob: object, success?: Function): void;
    }
    /**
     * Edbox消息组件
     * 用于Edbox平台的消息组件,用于实现跨域消息的传递与管理
     * */
    class Message {
        /**
         * 创建一个组件实例
         */
        constructor(obj?: object);

        /**
         * 组件唯一ID
         * Unique ID
         * Type : Text
         * Default Value : 
         */
        public ID: string;

        /**
         * 是否启用
         * Whether to enable
         * Type : Boolean
         * Default Value : false
         */
        public Enable: boolean;

        /**
         * 监听的窗口对象
         * Listening window object
         * Type : Object
         * Default Value : null
         */
        public Window: object;

        /**
         * 发送消息
         * Send Message
         * @param {string} type 方法执行类型关键字 , 不允许为空
         * @param {Array<object>} datas 消息数据 , 带Array参数Object , 允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Send(type: string, datas?: Array<object>, success?: Function, error?: Function): void;

        /**
         * 启动并监听消息组件
         * Start and listen for the message component
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Start(success?: Function, error?: Function): void;

        /**
         * 停止并释放消息组件
         * Stop and release the message component
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public Stop(success?: Function, error?: Function): void;

        /**
         * 消息组件队列
         * Message Component List
         * Type : Array
         * ArrayType : Message
         * Default Value : null
         */
        public static MessageList: Array<object>;

        /**
         * 消息组件连接回调
         * Message component connection callback
         * Type : Function
         * FunctionType : Message
         * Default Value : null
         */
        public static ConnectCallback: Function;

        /**
         * 消息组件连接中断回调
         * Message component connection interrupt callback
         * Type : Function
         * FunctionType : Message
         * Default Value : null
         */
        public static DisonnectCallback: Function;

        /**
         * 方法集
         * Function Set
         * Type : Map
         * MapType : Text, Function
         * Default Value : null
         */
        public static Functions: Dictionary;

        /**
         * 获取消息组件
         * Get message component
         * @param {object} window 监听的窗口对象 , 不允许为空
         * @param {Function} success 成功回调 , 带Function参数Message , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static Get(window: object, success?: Function, error?: Function): void;

        /**
         * 是否存在该窗口消息组件的监听
         * Whether there is a listener for the window message component
         * @param {object} window 监听的窗口对象 , 不允许为空
         * @returns {Boolean} 是否存在
         */
        public static Contain(window: object): boolean;

        /**
         * 添加消息处理事件
         * Add Message Handler
         * @param {string} type 方法执行类型关键字 , 不允许为空
         * @param {Function} func 消息 , 带Function参数Array, Message , 不允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static AddMessageHandler(type: string, func: Function, success?: Function, error?: Function): void;

        /**
         * 向所有连接的消息组件广播消息
         * Broadcast messages to all connected message components
         * @param {string} type 方法执行类型关键字 , 不允许为空
         * @param {Array<object>} datas 消息数据 , 带Array参数Object , 允许为空
         * @param {Function} success 成功回调 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        public static Broadcast(type: string, datas?: Array<object>, success?: Function, error?: Function): void;
    }
    /**
     * Edbox排行榜组件
     * 用于Edbox平台的排行榜组件,用于实现排行榜的交互
     * */
    class Ranking {
        /**
         * 打开排行榜页面
         * @param {Function} success 成功回调 
         * @param {Function} error 失败回调 错误码：0：无GameId 1：DatasConfig异常 2:无发布排行榜
         */
        public static Show(success?: Function, error?: Function): void;

        /**
         * 上传排行数据
         * @param {Object} postData 上传数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        public static Post(postData: Object, success?: Function, error?: Function): void;

        /**
         * 判断是否打开排行榜
         * @param {Function} success 可打开排行榜的成功回调
         * @param {Function} error   不可打开排行榜的失败回调
         */
        public static JudgeOpenRanking(success?: Function, error?: Function): void;
    }
    /**
     * Edbox通用加载组件
     */
    class Loading {
        /**
         * 主加载内容加载进度 游戏->中转页
         * @param {Number} percent 进度占百分比
         */
        public static Progress(percent: Number): void;
    }
	/**
     * Edbox第三方分享服务组件
     */
    class Share {
         /**
         * 打开分享页面
         * @param {Function} success 可打开的成功回调
         * @param {Function} error   不可打开的失败回调
         */
        public static OpenShareUrl(success?: Function, error?: Function): void;
    }
	/**
     * Edbox图片包围盒
     */
    class ImageCollider {
         /**
         * 获取线性碰撞盒
         * @param {string} url 图片地址
         * @param {Number} width 宽度
         * @param {Number} height 高度
         * @param {Number} count 图片精度
         * @param {Function} success 可打开的成功回调
         * @param {Function} error   不可打开的失败回调
         */
        public static GetChainColiderPoints(url : string, width: Number, height: Number, count: Number, success?: Function, error?: Function): void;
        
         /**
         * 获取多边形碰撞盒
         * @param {string} url 图片地址
         * @param {Number} width 宽度
         * @param {Number} height 高度
         * @param {Number} count 图片精度
         * @param {Function} success 可打开的成功回调
         * @param {Function} error   不可打开的失败回调
         */
        public static GetPolygonColiderPoints(url : string, width: Number, height: Number, count: Number, success?: Function, error?: Function): void;
    }
    
     /**
     * Edbox截图库组件
     */
    class ScreenShot {
        /**
         * 上传截图
         * @param {String} data 截图Base64数据 
         * @param {String} type 截图埋点类型
         * @param {function} success 成功回调 参数为新增的截图对象数据 ScreenshotData
         * @param {function} error 失败回调
         */
        public static SaveScreenShot(data: String, type?: String, success?: Function, error?: Function): void;

        /**
         * 获取游戏的截图库
         * @param {String} gameID 游戏ID
         * @param {Number} ListType 要获取的截图列表的类型 1:所有截图 2:系统截图 3:手动截图 默认值为1
         * @param {function} success 成功回调 参数为一个数组[{id:截图编号,guid:截图guid,url:资源地址,type:截图埋点类型}]
         * @param {function} error 失败回调
         * @param {String} page 页数 可为空 为空默认获取所有
         * @param {String} size 每页数量 可为空 为空默认获取所有
         */
        public static GetList(gameID?: String, ListType?: Number, success?: Function, error?: Function, page?: String, size?: String): void;

        /**
         * 删除截图接口
         * @param {Object} screenshotData 截图信息
         * @param {String} gameID 游戏Id 
         * @param {function} success 成功回调
         * @param {function} error 失败回调
         */
        public static Delete(ScreenshotData: Object, gameID?: String, success?: Function, error?: Function): void;
    }
}

/**
 * 字典表
 * @param {Object} obj Object类型字典表
 * @returns {Object} 字典表
 * */
declare class Dictionary {
    /**
     * 创建一个字典表实例
     */
    constructor(obj?: object);

    /**
     * 关键字列表
     */
    public Keys: Array<object>;

    /**
     * 元素值列表
     */
    public Values: Array<object>;

    /**
     * 元素数量
     * @returns {Number} 元素数量
     */
    public Count(): number;

    /**
     * 是否包含关键字
     * @param {any} key 关键字
     * @returns {Boolean} 是否包含
     */
    public ContainsKey(key: any): boolean;

    /**
     * 是否包含值
     * @param {any} value 值
     * @returns {Boolean} 是否包含
     */
    public ContainsValue(value: any): boolean;

    /**
     * 获取元素值
     * @param {any} key 关键字
     * @returns {any} 元素值
     */
    public Get(key: any): any;

    /**
     * 新增或修改元素
     * @param {any} key 关键字
     * @param {any} value 值
     * @returns {Boolean} 执行结果
     */
    public Set(key: any, value: any): boolean;

    /**
     * 删除元素
     * @param {any} key 关键字
     * @returns {Boolean} 执行结果
     */
    public Remove(key: any): boolean;
}