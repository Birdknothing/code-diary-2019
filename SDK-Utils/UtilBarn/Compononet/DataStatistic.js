
/**
 * UtilBarn数据统计服务组件
 * 用于UtilBarn平台的数据埋点收集组件
 * @author 陈五洲(880123)
 * @version 0.0.1.0 (2019年07月25日 21:00:00)
 * @see 
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn数据统计
 * */

(function (namespace, className) {

    var _init = false;

    /**
     * 应用标识码
     */
    var AppKey = {
        QA: "6d4ef39cfdc04dba99f9e508208ce7c8",
        CN: "0885f95475f8429f842008c26bd2d2b5",
        US: "d597cf288c904f87a3937e82e92bbf5b"
    };
    

    /**
     * 谷歌产品id
     */
    var GoogleKey = {
        Dev: "UA-132188429-2",
        QA: "UA-132188429-3",
        BetaCN: "UA-132188429-2",
        Beta: "UA-132188429-4",
        CN: "UA-132188429-2",
        US: "UA-132188429-5"
    };


    /**
     * 云图应用版本号
     */
    var AppVersion = "1.0.0.0";

    /**
     * 渠道信息
     */
    var Channel = "Default";

    /**
     * 是否使用https
     */
    var IsHttps = true;

    /**
     * 上传限制条数 (1-100) IsImmediately 为true 不会缓存 立即上传
     */
    var LimitNumber = 1;

    var IsImmediately = true;

    /**
     * 是否控制台打印日志
     */
    var IsLog = false;

    /**
     * 云图环境
    */
    var Env = "PRODUCTION";

    /**
     * 玩家id
    */
   var _userId = 0;

    /**
     * 云图组件路径(带版本号参数)
     */
    var CloudAtlasPath = UtilBarn.ComponentRootPath + "ThirdParty/cloud-alas/cloud-atlas.min.js?v=20190902";

    /**
     * 云图实例
     */
    var com = null;

    /**
     * 谷歌组件路径
     */
    var GoogleAtlasPath = UtilBarn.ComponentRootPath + "ThirdParty/google/gtag.js?id=";

    /**
     * 谷歌实例
     */
    var gcom = null;

    // 作品id
    var _appId = null;
    // 该作品id的标签数据
    var _appTags = {};
    // 总的标签数据
    var _tagMap = null;


    // 作品模板id
    var templateID = "";
    // 作品模板版本
    var templateVersion = "";

    // 是否是开启埋点记录
    var isOpen = true;

    /**
     * 获取谷歌账号ID
    * @return {String} GoogleId 
     */
    GetGoogleKey = function () {

        if (GoogleKey[UtilBarn.ServerKey]){
            return GoogleKey[UtilBarn.ServerKey];
        }
        else{
            return GoogleKey.QA;
        }      
      
    };

    /**
     * 初始化组件
     * @param {String} success 自定义事件
    * @param {String} error 最终自定义事件id
     */
    Init = function (success, error) {

        if (_init) return;

        if (!isOpen) return;

        if (IsLocalHost() || UtilBarn.ServerKey === "Feature" || UtilBarn.ServerKey === "Dev" || UtilBarn.ServerKey === "QA" ) {
            IsLog = true;
        }

        var requirePath = new Array();
        var openGoogle = false;
        var openYuntu = true;

        requirePath.push(CloudAtlasPath);


        // 国外开启Google分析 (测试环境开启Google)
        if (UtilBarn.ServerKey === "Beta" || UtilBarn.ServerKey === "US" 
            || UtilBarn.ServerKey === "QA" || UtilBarn.ServerKey === "Dev"){

            requirePath.push(GoogleAtlasPath + GetGoogleKey());
            openGoogle = true;
        }

        Require(requirePath, function () {

            if (openYuntu){
                // 初始化云图
                new CloudAtlas({
                    appKey: GetAppKey(),
                    appVer: AppVersion,
                    channelId: Channel,
                    isLog: IsLog,
                    env: Env,
                    isHttps: IsHttps,
                    limitNumber: LimitNumber,
                    isImmediately: IsImmediately
                });

                com = CloudAtlas;
            }

            if (openGoogle){
                // 初始化谷歌
                gcom = window.dataLayer || [];

                gtag('js', new Date());
                gtag('config', GetGoogleKey());
            }
           

            function GetAppKey() {
                switch (UtilBarn.ServerKey) {
                    case 'CN':
                        return AppKey.CN;
                    case 'US':
                        return AppKey.US;
                    default:
                        return AppKey.QA;
                }
            }

            log("DataStatistic Init, ChannelId : " + UtilBarn.AccountType);

            _init = true;

            if(success) success();
        });
        
    };

    GetAccess = function(){

        var access = "个人库";

        switch(UtilBarn.Access){
            case 1:
                access = "模板";
                break;
            case 2:
                access = "个人库";
                break;
            case 3:
                access = "体验库";
                break;
        }

        return UtilBarn.GameId === "" ? "" : access;
 
    };

    /**
    * 获取自定义事件
    * @param {String} event 自定义事件
    * @return {String} 最终自定义事件id
    */
    GetEvent = function(event) {
        return event + '_' + UtilBarn.ServerKey;
    };

    /**
     * log打印
     * @param {any} obj 消息
     */
    log = function(obj) {
        if (!IsLog) return;
        console.log(obj);
    };

  
    // 获取总标签数据
    GetTagsMap = function(success, error) {

        UtilBarn.Api.MMO.GetTagMap(function (data) {
            _tagMap = new Dictionary();
            if (data && data.taglist) {
                for (var i = 0; i < data.taglist.length; i++) {
                    if (!_tagMap.ContainsKey(data.taglist[i].fatherid)) {
                        _tagMap.Set(data.taglist[i].fatherid, data.taglist[i]);
                    }
                }
            }
            if (success) success();
        }, function (err) {
            console.log('GetTagMap failed : ' + err);
            if (error) error('GetTagMap failed : ' + err);
        });
    };

    /**
     * 获取标签数据
     * @param {String} appid 数据
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    GetAppTags = function(appid, success, error) {

        if (appid === _appId) {
            if (success) success(_appTags);
        }
        else if (_tagMap === null) {
            GetTagsMap(function () {
                GetTags(appid, success, error);
            });
        }
        else {
            GetTags(appid, success, error);
        }

        // 获取游戏标签数据
        function GetTags(appid, success, error) {
            UtilBarn.Api.MMO.GetTags(appid, function (taginfo) {
                if (taginfo) {

                    _appTags = GetTagsFormatData(appid, taginfo);

                    _appId = appid;

                    if (success) success(_appTags);
                } else {
                    if (error) error("GetTags null");
                }
            }, function (e) { if (error) error(e); });
        }
    };


    // 获取标签格式数据
    GetTagsFormatData = function(appid, taginfo) {
        var edutags = GetTagsByCodes(taginfo.edutags);
        var gametags = GetTagsByCodes(taginfo.gametags);
        var othertags = GetTagsByCodes(taginfo.othertags);
        var customededutags = GetTagsByCodes(taginfo.customededutags);
        var modelgametag = GetTagsByCodes(taginfo.modelgametag);
        var modeledutag = GetTagsByCodes(taginfo.modeledutag);
        var tags = edutags.concat(modeledutag).concat(gametags).concat(modelgametag).concat(othertags).concat(customededutags);

        var tagInfo = {};

        for(var i=0; i<tags.length; ++i){
            if (tags[i].id === undefined){
               continue;
            }

            var key = tags[i].id + " " + tags[i].value;
            tagInfo[key] = appid;
        }

        tagInfo["gameId"] = appid;

        return tagInfo;
    };


    //根据标签码获取标签文本
    GetTagsByCodes = function(codes) {
        var list = [];
        if (_tagMap && codes) {
            for (var i = 0; i < codes.length; i++) {
                var isContains = false;
                for (var j = 0; j < _tagMap.Keys.length; j++) {
                    var key = _tagMap.Keys[j];
                    if (key === codes[i]) {
                        isContains = true;
                        var ob = new Object;
                        ob.id = key;
                        ob.value = _tagMap.Get(key).lvl2name;
                        list.push(ob);
                    }
                }
                if (!isContains) {
                    list.push(codes[i]);
                }
            }
        }
        return list;
    };


    GetLoginInfo = function(){
        // 登陆方式
        var loginMode = "";

        if (location.host.indexOf('game.') >= 0) {
            loginMode = "Game";
        }else if (location.host === UtilBarn.GetHost("Lobby") ){
            loginMode = "Lobby";
        }else if (location.host === UtilBarn.GetHost("Component") ){
            loginMode = "Editor";
        }

        _userId = UtilBarn.EbUserId + '';

        var info = {
            "gameId": UtilBarn.GameId,
            "userId": _userId,
            "account_type": UtilBarn.AccountType,
            "channel": Channel,
            "access": GetAccess(),
            "version": UtilBarn.Version,
            "area": UtilBarn.Area,
            "server_key": UtilBarn.ServerKey,
            "loginMode": loginMode
        };

        return info;
    };

    /**
    * 发送云图事件
    * @param {string} event 自定义事件ID
    * @param {Object} info 自定义信息
    */
    YuntuEvent = function(event, info) {
        if (!com) return;
        com.onEvent({
            eventId:event,
            info: info
        });
    };

    /**
    * 发送谷歌事件
    * @param {string} event 事件ID
    * @param {string} category 事件分类
    * @param {string} label 事件附加信息
    */
    GoogleEvent = function(event, category, label) {

        if (!isOpen) return;
        if (!gcom) return;
        //var sendInfo = ["event", event, info];
        //gcom.push(sendInfo);
        if (!category) category = "";
        if (!label) label = "";

        gtag('event', event, {
            'event_category': category,
            'event_label': label,
            'send_to': GetGoogleKey()
        });

    };

    IsLocalHost = function(){
        return location.host.indexOf('192.168.') > -1 || location.host.indexOf('localhost') > -1;
    };

    gtag = function(){
        window.dataLayer = window.dataLayer || [];
        dataLayer.push(arguments);
    };

    // GA登陆
    GoogleLogin = function(){
        if (!gcom) return;

        // 组件不记录
        if (location.host.indexOf(UtilBarn.GetHost("Component")) === 0){
            return;
        }

        var loginType = "defalut";

        if (location.host.indexOf(UtilBarn.GetHost("Lobby")) === 0){
            loginType = "lobby";
        }
        else{
            loginType = "game";
        }

        GoogleEvent("login_" + loginType, UtilBarn.AccountType , UtilBarn.EbUserId+"");
    };

    /**
     * UtilBarn数据统计服务
     * 用于UtilBarn平台的数据埋点收集组件
     * @author 陈五洲(880123) Review by 温荣泉(201901)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn数据统计
     * */
    var module = {
        /**
         * 用户登陆
         */
        Login: function () {

            if (!isOpen) return;

            // 登陆事件
            function loginEvent(){

                if (location.host === UtilBarn.GetHost("MMO") ){
                    // 跳转页面不做记录
                    return;
                }

                // 云图独立登陆事件
                if (com){
                    com.onProfileSignIn(UtilBarn.EbUserId + '');
                }

                GoogleLogin();

                module.LogEvent("UtilBarn_Login",GetLoginInfo());

                UtilBarn.WindowEvent.AddExitEvent(module.Exit); 
            }  
            
            if (!_init) {
                // 初始化 埋点信息
                Init(loginEvent);
            }
            else{
                loginEvent();
            }       
        },

        /**
         * 开始游戏
         * @param {string} gameId 游戏id
         */
        StartGame: function (gameId) {
            GetAppTags(gameId, function (info) {
                module.LogEvent("UtilBarn_StartGame", info);
            });
        },

        /**
         * 发布游戏
         * @param {string} gameId 游戏id
         */
        PublishGame: function (gameId) {
            GetAppTags(gameId, function (info) {
                module.LogEvent("UtilBarn_PublishGame",info);
            });
            
        },

        /**
         * 收藏游戏
         * @param {string} gameId 游戏id
         */
        CollectGame: function (gameId) {
            GetAppTags(gameId, function (info) {
                module.LogEvent("UtilBarn_CollectGame",info);
            });
        },

        /**
         * 分享游戏
         * @param {string} gameId 游戏id
         * @param {string} share 分享方式 Friend 好友, Fackbook, QR, Url, Twitter
         */
        ShareGame: function (gameId, share) {

            var info = {
                "gameId": gameId,
                "share": share
            };
 
            module.LogEvent("UtilBarn_ShareGame",info);
        },

        /**
         * 导出游戏
         * @param {string} gameId 游戏id
         * @param {string} type 导出类型 exe apk
         * 
         */
        ExportGame: function (gameId, type) {
            var info = {
                "gameId": gameId,
                "type": type
            };

            module.LogEvent("UtilBarn_ExportGame",info);
        },

        /**
         * 导出编辑模板
         * @param {string} gameId 游戏id
        */
        ExportEditorTemplate: function (gameId) {
            GetAppTags(gameId, function (info) {
                module.LogEvent("UtilBarn_ExportEditorTemplate",info);
            });
        },

        /**
         * 提交反馈
         */
        FeedBack: function () {
            module.LogEvent("UtilBarn_FeedBack",{});
        },

        /**
         * 用户注销
         */
        Logout: function () {
            var  info = {
                userid: _userId
            };

            module.LogEvent("UtilBarn_Logout",info);

            // 云图独立登陆事件
            if (com){
                com.onProfileSignOff();
            }
            
        },

        /**
         * 用户退出
         */
        Exit: function () {
    
            com.onEvent({
                eventId: GetEvent("UtilBarn_Exit"),
                info:{
                    userid: _userId
                }
            });

            // 云图独立登陆事件
            if (com){
                com.onProfileSignOff();
            }

            // 退出大厅处理
            if (location.host === UtilBarn.GetHost("Lobby")){
                ClickEvent("click" + "CloseLobby");
            }
        },

        /**
         * 设置是否记录埋点信息
         * @param {bool} open 是否开启
        */ 
        SetOpen: function (open){
            isOpen = open;
        },

         /**
         * 获取是否记录埋点信息
         * @return {bool} open 是否开启
        */ 
        GetOpen: function (){
            return isOpen;
        },


        /**
         * UtilBarn编辑器使用
         */

        /**
         * 开始编辑游戏
         */
        EditStart: function () {
            
            if (!com) {
                Init(CloudLogin);
            }
            else{
                CloudLogin();
            }

            function CloudLogin(){ 

                com.onProfileSignIn(UtilBarn.EbUserId + '');

                GetAppTags(UtilBarn.GameId, function (info) {

                    info['access'] = GetAccess();

                    com.onEvent({
                        eventId: GetEvent("UtilBarn_EditorGame"),
                        info: info
                    });

                    log("Edit Start");

                }, null);

                UtilBarn.WindowEvent.AddExitEvent(module.EditExit);
            }
        },
        /**
         * 编辑保存
        * @param {string} gameId 保存游戏的id
        */
        EditSave: function (gameId) {
            if (!com) return;

            GetAppTags(gameId, function (info) {
                info['access'] = GetAccess();

                com.onEvent({
                    eventId: GetEvent("UtilBarn_EditorSave"),
                    info: info
                });

                log("Edit Save");

            });
        },

        /**
         * 试玩游戏
         */
        EditPlay: function () {
            if (!com) return;

            GetAppTags(UtilBarn.GameId, function (info) {
                info['access'] = GetAccess();

                com.onEvent({
                    eventId: GetEvent("UtilBarn_EditorPlay"),
                    info: info
                });

                log("Edit Play");
            });
        },

        /**
         * 退出编辑
         */
        EditExit: function () {
            if (!com) return;

            GetAppTags(UtilBarn.GameId, function (info) {

                info['access'] = GetAccess();

                com.onEvent({
                    eventId: GetEvent("UtilBarn_EditorExit"),
                    info: info
                });

                log("Edit Exit");
            });
        },

        /**
         * 云图记录数据
         * @param {string} eventId 事件名称
         * @param {ojbect} info 事件信息
         */
        LogEvent: function (eventId, info) {
            
            if (!isOpen) return;

            log(eventId);
       
            var evt = GetEvent(eventId);
            YuntuEvent(evt, info);
        },

        /**
         * 界面点击事件
         * @param {string} eventId 事件名称
         * @param {string} category 事件分类
         * @param {string} info 事件信息
         */
        ClickEvent: function (eventId, category, info) {

            GoogleEvent("click" + eventId, category, info);
        },

        
        /**
         * 用户自定义埋点接口
         * @param {string} eventId 事件名称
         * @param {object} info 用户自定义事件
         */
        CustomEvent: function (eventId, info) {

            function GetTemplateID(success){
                if (templateID === ""){
                    // 获取模板id
                    if (UtilBarn.Access === 1){
                        templateID = UtilBarn.GameId;
                        templateVersion = UtilBarn.Version;
                        success();
                    }
                    else if (UtilBarn.Access === 2){
                        UtilBarn.Api.MMO.GetPersonalAppInfo(UtilBarn.GameId, function(data){
                            templateID = data.baseid;
                            templateVersion = data.base_version;
                            success();
                        });
                    }
                    else if (UtilBarn.Access === 3){
                        UtilBarn.Api.MMO.GetAppInfo(UtilBarn.GameId, function(data){
                            templateID = data.baseid;
                            templateVersion = data.base_version;
                            success();
                        });
                    }
                }
                else{
                    success();
                }
            }


            if (UtilBarn.GameId === "") return;

            GetTemplateID(function(){
                if (!info || typeof info !== "object"){
                    info = new Object();
                }

                info.BaseId = templateID;
                info.BaseVersion = templateVersion;

                module.LogEvent("UtilBarn_CustomEvent", info);
            });        
        }

    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }

}(UtilBarn, "DataStatistic"));