// UtilBarn 粘合层接口， 提供给网编使用， 所有接口必须写ts
(function (namespace, className) {


    /**
     * 帮助手册地址
     */
    var HelpUrl = "";

     /**
     * MD5组件路径
     */
    var MD5Path = UtilBarn.ComponentRootPath + "ThirdParty/md5/md5.min.js";

    /**
     * 帮助手册域名
     */
    var Host = {
        CN: "help.UtilBarn-cn.101.com",
        US: "help.UtilBarn.101.com"
    };

    /**
     * 消息信息
     */
    var subUrl = "/v0.1/api/product/product/actions/get_base_help_doc";

    /**
     * 帮助手册配置信息
     */
    var HelpConfig = {
        Url: "/api/getGameArtInfo",
        //Url: "api/getGameArtInfo?version={0}&nonce={1}&time={2}&sign={3}&artkey={4}&lang={5}",
        Version: "v0.1",
        Nonce: "12345678",
        Secret: "DIaTKtkAMEv#8bE9"
    };


    /**
     * 获取产品帮助手册信息
     * Get Help Info information
     * @param {string} baseId 模板id,
     * @param {string} baseVersion 模板版本,
     * @param {string} lang 语言,
     * @param {Function} success 成功回调,  { bool } isopen : 是否显示,
     * @param {Function} error 出错回调, 带Function参数Object , 允许为空
     */
    GetHelpInfo = function (baseId, baseVersion, lang, success, error) {

        function GetHost(){
            if (UtilBarn.ServerKey === "US" || "Beta" === UtilBarn.ServerKey){
                return Host.US;
            }
            else{
                return Host.CN;
            }
        }    

        subUrl += "?playerid=" + UtilBarn.EbUserId + "&productid=" + baseId + "&version=" + baseVersion;

        UtilBarn.Request.Get(UtilBarn.GetHost("MMO"), subUrl, null, function (data) {

            var isopen = data.isopen === 1;
            
            Require([MD5Path], function () {

                var timestamp = new Date().getTime();
                var md5Key = HelpConfig.Version + '&' + HelpConfig.Nonce + '&' + timestamp + '&' + HelpConfig.Secret;
                var md5Data = md5(md5Key);
                //data.docurl = "GMuA8BGBGHntFmN9UhXs";
                var param = "?version=" + HelpConfig.Version + "&nonce=" + HelpConfig.Nonce + "&time=" + timestamp + "&sign=" + md5Data + "&artkey=" + data.docurl + "&lang=" + lang;

                var url = UtilBarn.Protocol + "://" + GetHost() + HelpConfig.Url + param;
                $.post(url, {}, function (ret) {
                    if(ret.code === 0){
                        if (error) error(ret.message);
                        return;
                    }
                    else{
                        //window.open(ret.message.url);
                        if (isopen) {
                            isopen = ret.message.status === 1;
                            HelpUrl = ret.message.url;
                        }
                        
                        if (success) success(isopen);
                    }

                });
            }, error);
        }, error);
            
    };

    /**
     * UtilBarn编辑器帮助手册组件
     * 用于UtilBarn平台的编辑器帮助手册服务框架
     * @author 陈五洲(880123)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn帮助手册组件
     * */
    var module = {

        /**
         * 打开帮助手册地址
         */
        GoToHelp: function () {
            if (HelpUrl !== ""){
                window.open(HelpUrl);
            }
        },

        /**
         * 初始化数据
         * Initialize Edobx_HelpInfo
        * @param {Function} success 成功回调,  { bool } isopen 是否显示
         * @param {Function} error 出错回调, 带Function参数Object , 允许为空
         */
        Init: function (success, error) {

            var language = getLang(UtilBarn.Language);

            // 多语言转换
            function getLang(e) {
                switch (e) {
                    case 'SimplifiedChinese':
                        return 'zh';
                    case 'English':
                        return 'en';
                    default:
                        return 'en';
                }
            }

            if (UtilBarn.Access === 1){
                GetHelpInfo(UtilBarn.GameId, UtilBarn.Version, language, success, error);
            }
            else if (UtilBarn.Access === 2){
                UtilBarn.Api.MMO.GetPersonalAppInfo(UtilBarn.GameId, function(tempInfo){
                    GetHelpInfo(tempInfo.baseid, tempInfo.base_version, language, success, error);
                });
            }
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }

}(UtilBarn, "EditorHelp"));
