/**
 * Edbox数据统计服务组件
 * 用于Edbox平台的数据埋点收集组件
 * @author 陈五洲(880123)
 * @version 0.0.0.1 (2019年07月03日 21:00:00)
 * @see 
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox数据统计
 * */
(function (namespace, className) {

    /**
     * 应用标识码
     */
    var AppKey = {
        QA: "6d4ef39cfdc04dba99f9e508208ce7c8",
        CN: "0885f95475f8429f842008c26bd2d2b5",
        US: "d597cf288c904f87a3937e82e92bbf5b"
    };

    /**
     * 应用版本号
     */
    var AppVersion = "1.0.0.0";

    /**
     * 渠道ID
     */
    var ChannelId = "Default";

    /**
     * 是否控制台打印日志
     */
    var IsLog = false;

    /**
     * 是否使用https
     */
    var IsHttps = true;

    /**
     * 上传限制条数 (1-100) IsImmediately 为true 不会缓存 立即上传
     */
    var LimitNumber = 1;

    /**
     * 是否立即发送
     */
    var IsImmediately = true;
   
    /**
     * 环境配置
     */
    var Env = "PRODUCTION";

    /**
     * 云图实例
     */
    var com = null;

     /**
     * 获取产品ID
     * @param {string} appEnv 产品环境 QA-测试, CN-国内, US-美国
     */
    function GetAppKey(appEnv){

        switch (appEnv) {
            case 'CN':
                return AppKey.CN;
            case 'US':
                return AppKey.US;
            default:
                return AppKey.QA;
        }    
    }

    var module = {

        /**
        * 初始化组件
        * @param {string} appEnv 产品环境 QA-测试, CN-国内, US-美国
         * @param {string} channel 渠道id
        */
        Init : function (appEnv, channel){
            
            ChannelId = channel ? channel : ChannelId;          

            // 初始化云图
            com = new CloudAtlas({
                appKey: GetAppKey(appEnv),
                appVer: AppVersion,
                channelId: ChannelId,
                isLog: IsLog,
                env:Env,
                isHttps: IsHttps,
                limitNumber: LimitNumber,
                isImmediately: IsImmediately
            });
            
            com = CloudAtlas; 
        },

        /**
         * 页面加载完成 
         */
        Websit : function (){

            if (com === null){
                module.Init();
            }

            com.onEvent({
                eventId: "edbox_Websit",
                info: {
                    "channel": ChannelId
                }
            });
        },

        /**
         * 下载app
         * @param {string} channel 产品渠道(选填)
         */
        DownApp : function (channel){
            if (com === null){
                module.Init();
            }

            ChannelId = channel ? channel : ChannelId;

            com.onEvent({
                eventId: "edbox_DownApp",
                info: {
                    "channel": ChannelId
                }
            });
        }

    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
       
    
}(window, "DataStatistic"));
