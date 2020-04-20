// Edbox 租户配置文件
(function (namespace, className) {
    //租户id
    var AppSetting = {
        /**
         * 国内
         */
        CN: "2353d7e4-cbdc-4962-aadf-16b80a325bf4",
        /**
         * 美国
         */
        US: "e671d549-b827-44da-a677-62f1c4f3a767",
        /**
         * 台湾
         */
        TW: "ef8bc900-602f-428a-96ca-3c73209cea31",
        /**
         * 香港
         */
        HK: "ca8a15ed-6606-4f5b-9459-989c4c423cc4"
    };
    
    //支持的语言
    var LanguageSetting = {
        /**
         * 国内
         */
        CN: ["SimplifiedChinese", "English", "TraditionalChinese", "TraditionalChinese_TW"],
        /**
         * 美国
         */
        US: ["English"],
        /**
         * 台湾
         */
        TW: ["TraditionalChinese_TW", "English"],
        /**
         * 香港
         */
        HK: ["TraditionalChinese", "English"]
    };
    
    //地区码
    var LoginArea = {
        /**
         * 国内
         */
        CN: "CHN",
        /**
         * 美国
         */
        US: "USA",
        /**
         * 台湾
         */
        TW: "TW",
        /**
         * 香港
         */
        HK: "HK"
    };
    
    //年龄限制
    var AgeLimit = {
        /**
         * 国内
         */
        CN: 0,
        /**
         * 美国
         */
        US: 13,
        /**
         * 台湾
         */
        TW: 12,
        /**
         * 香港
         */
        HK: 18
    };
    
    //功能限制
    var LimitFunctions = {
        /**
         * 国内
         */
        CN: ["IM","SHARE", "RECHARGE", "PAY"],
        /**
         * 美国
         */
        US: ["IM","SHARE", "RECHARGE", "PAY"],
        /**
         * 台湾
         */
        TW: ["IM","SHARE", "RECHARGE", "PAY"],
        /**
         * 香港
         */
        HK: ["IM", "RECHARGE", "PAY"]
    };
    
    //功能限制
    var ProAlias = {
        /**
         * 国内
         */
        CN: "edbox",
        /**
         * 美国
         */
        US: "edbox",
        /**
         * 台湾
         */
        TW: "edbox",
        /**
         * 香港
         */
        HK: "edbox"
    };

    var SdpWalletEnvSet = {
        /**
         * 国内
         */
        CN: "product",
        /**
         * 美国
         */
        US: "aws-california",
        /**
         * 台湾
         */
        TW: "aws-california",
        /**
         * 香港
         */
        HK: "aws-california"
    };

    var VipLimits = {
        /**
         * 国内
         */
        CN: [
            {
                //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 0,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:10,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:5,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:0,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:30, 
               //收益分成
               income_percent: '10%',
               //图片个人库容量
                image_limit: 0,
               //音频个人库容量
               audio_limit:0
            },
            {
               //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 1,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:30,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:15,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:20,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:-7, 
               //收益分成
               income_percent: '70%',
               //图片个人库容量
               image_limit: 10,
               //音频个人库容量
               audio_limit: 10
            },
            {
               //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 2,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:-1,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:-1,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:-1,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:-7, 
               //收益分成
               income_percent: '70%',
               //图片个人库容量
               image_limit: 30,
               //音频个人库容量
               audio_limit: 30
            }
        ],
        /**
         * 美国
         */
        US: [
            {
                //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 0,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:10,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:5,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:0,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:30, 
               //收益分成
               income_percent: '10%',
               //图片个人库容量
               image_limit: 0,
               //音频个人库容量
               audio_limit: 0
            },
            {
               //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 1,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:30,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:15,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:20,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:-7, 
               //收益分成
               income_percent: '70%',
               //图片个人库容量
               image_limit: 10,
               //音频个人库容量
               audio_limit: 10
            },
            {
               //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 2,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:-1,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:-1,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:-1,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:-7, 
               //收益分成
               income_percent: '70%',
               //图片个人库容量
               image_limit: 30,
               //音频个人库容量
               audio_limit: 30
            }
        ],
        /**
         * 台湾
         */
        TW: [
            {
                //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 0,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:10,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:5,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:0,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:30, 
               //收益分成
               income_percent: '10%',
               //图片个人库容量
               image_limit: 0,
               //音频个人库容量
               audio_limit: 0
            },
            {
               //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 1,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:30,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:15,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:20,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:-7, 
               //收益分成
               income_percent: '70%',
               //图片个人库容量
               image_limit: 10,
               //音频个人库容量
               audio_limit: 10
            },
            {
               //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 2,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:-1,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:-1,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:-1,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:-7, 
               //收益分成
               income_percent: '70%',
               //图片个人库容量
               image_limit: 30,
               //音频个人库容量
               audio_limit: 30
            }
        ],
        /**
         * 香港
         */
        HK: [
            {
                //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 0,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:10,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:5,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:0,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:30, 
               //收益分成
               income_percent: '10%',
               //图片个人库容量
               image_limit: 0,
               //音频个人库容量
               audio_limit: 0
            },
            {
               //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 1,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:30,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:15,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:20,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:-7, 
               //收益分成
               income_percent: '70%',
               //图片个人库容量
               image_limit: 10,
               //音频个人库容量
               audio_limit: 10
            },
            {
               //当前vip等级, 0-免费 1-黄金 2-钻石
               vip_level: 2,
               //创作数量限制, 默认0个，-1表示无限制
               create_limit:-1,
               //发布数量限制, 默认0个，-1表示无限制
               release_limit:-1,
               //导出数量限制, 0：付费导出，-1：无限制导出， 其他免费N次/月
               export_limit:-1,
               //服务器人数上限，-N N折购买服务器人数， N 游戏上线N人
               user_limit:-7, 
               //收益分成
               income_percent: '70%',
               //图片个人库容量
               image_limit: 30,
               //音频个人库容量
               audio_limit: 30
            }
        ]
    }

    /**
     * Edbox 租户配置
     * @author 余晓(871129)
     * */
    var module = {
        /**
         * 初始化租户
         */
        Init: function () {
            var data = Edbox.GetQueryString("appkey");
            if(!data || data === '' || !AppSetting[data]){
                if(Edbox.SDPAppId && Edbox.SDPAppId !== ''){
                    if(AppSetting['CN'] === Edbox.SDPAppId){
                        data = 'CN';
                    }
                    if(AppSetting['US'] === Edbox.SDPAppId){
                        data = 'US';
                    }
                    if(AppSetting['TW'] === Edbox.SDPAppId){
                        data = 'TW';
                    }
                    if(AppSetting['HK'] === Edbox.SDPAppId){
                        data = 'HK';
                    }
                }else{
                    data = Edbox.AppKey;
                }
            }
            
            if(data && AppSetting[data]){
                var langs = LanguageSetting[data];
                if(!Edbox.SDPAppId || Edbox.SDPAppId === ''){
                    Edbox.SDPAppId = AppSetting[data];
                }
                Edbox.AreaLanguage = langs;
                Edbox.Area = LoginArea[data];
                Edbox.AgeLimit = AgeLimit[data];
                Edbox.LimitFunctions = LimitFunctions[data];
                Edbox.ProAlias = ProAlias[data];
                Edbox.AppKey = data;
                Edbox.VipLimits = VipLimits[data];
                Edbox.SdpWalletEnv = SdpWalletEnvSet[data];
                if(!Edbox.Language || Edbox.Language === "" || langs.indexOf(Edbox.Language) < 0){
                    Edbox.Language = langs[0];
                }
            }else{
                var key = "";
                if(Edbox.ServerKey === "Beta" || Edbox.ServerKey === "HK" || Edbox.ServerKey === "US"){
                    key = "US";
                }else{
                    key = "CN";
                }
                var langs = LanguageSetting[key];
                if(!Edbox.SDPAppId || Edbox.SDPAppId === ''){
                    Edbox.SDPAppId = AppSetting[key];
                }
                Edbox.AreaLanguage = langs;
                Edbox.Area = LoginArea[key];
                Edbox.AgeLimit = AgeLimit[key];
                Edbox.LimitFunctions = LimitFunctions[key];
                Edbox.ProAlias = ProAlias[key];
                Edbox.AppKey = key;
                Edbox.VipLimits = VipLimits[key];
                Edbox.SdpWalletEnv = SdpWalletEnvSet[key];
                if(!Edbox.Language || Edbox.Language === "" || langs.indexOf(Edbox.Language) < 0){
                    Edbox.Language = langs[0];
                }
            }
        }
    };

    module.Init();

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(window, "AppConfig"));