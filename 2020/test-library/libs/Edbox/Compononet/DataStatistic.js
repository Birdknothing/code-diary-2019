
/**
 * Edbox数据统计服务组件
 * 用于Edbox平台的数据埋点收集组件
 * @author 陈五洲(880123)
 * @version 0.0.2.0 (2019年11月29日 21:00:00)
 * @see 
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox数据统计
 * */

(function (namespace, className) {

    var _init = false;

    // 作品id
    var _appId = null;
    // 该作品id的标签数据
    var _appTags = {};
    // 总的标签数据
    var _tagMap = null;

    // 作品模板id
    var _templateID = "";
    // 作品模板版本
    var _templateVersion = "";

    // 是否是开启埋点记录
    var _isOpen = true;

    // 玩家id
    var _userId = 0;

    // 游戏名称
    var _gameName = "";

    /**
     * 初始化服务器关键字
     * @return {String} 服务器id
     */
    function GetServerKey() {

        var srvKey = "QA";
        var host = window.location.hostname.replace("component", "").replace("game", "").replace("api", "");
        var keys = Object.keys(Edbox.Host.Game);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var temphost = Edbox.Host.Game[key].replace("component", "").replace("game", "").replace("api", "");
            if (host.indexOf(temphost) >= 0) {
                srvKey = key;
                return srvKey;
            }
        }

        host = window.location.hostname;

        function Test(obj) {
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (host === obj[key]) {
                    srvKey = key;
                    return true;
                }
            }
        }

        if (Test(Edbox.Host.Login)) return srvKey;

        host = Edbox.ComponentRootPath;
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            var temp = Edbox.Host.Game[key].replace("component", "").replace("game", "").replace("api", "");
            if (host.indexOf(temp) > 0) {
                srvKey = key;
                return srvKey;
            }
        }

        return srvKey;
    }


    /**
     * 云图相关配置信息
     */

    // 应用标识码
    var AppKey = {
        QA: "6d4ef39cfdc04dba99f9e508208ce7c8",
        CN: "0885f95475f8429f842008c26bd2d2b5",
        US: "d597cf288c904f87a3937e82e92bbf5b"
    };

    // 云图应用版本号
    var AppVersion = "1.0.0.0";

    // 是否使用https
    var IsHttps = true;

    // 上传限制条数 (1-100) IsImmediately 为true 不会缓存 立即上传
    var LimitNumber = 1;

    var IsImmediately = true;

    // 云图是否控制台打印日志
    var _IsYuntuLog = false;

    // 云图环境
    var Env = "PRODUCTION";

    // 云图组件路径(带版本号参数)
    var CloudAtlasPath = Edbox.ComponentRootPath + "ThirdParty/cloud-alas/cloud-atlas.min.js?v=20190902";

 
    // 云图实例
    var com = null;

    function initYunTu(){
            
        function GetAppKey() {
            switch (Edbox.ServerKey) {
                case 'CN':
                    return AppKey.CN;
                case 'US':
                    return AppKey.US;
                default:
                    return AppKey.QA;
            }
        }
        
        if (typeof CloudAtlas === 'undefined' || !CloudAtlas){
            dlog("DataStatistic not Init YunTu");
            return;
        }

       
        // 初始化云图
        new CloudAtlas({
            appKey: GetAppKey(),
            appVer: AppVersion,
            channelId: Edbox.Channel,
            isLog: _IsYuntuLog,
            env: Env,
            isHttps: IsHttps,
            limitNumber: LimitNumber,
            isImmediately: IsImmediately
        });

        com = CloudAtlas;

        // 云图独立登陆事件
        com.onProfileSignIn(Edbox.EbUserId + '');
        
        dlog("DataStatistic Init YunTu Succ");
                        
    }


    /**
     * 谷歌相关配置信息
     */

    //谷歌产品id
    var GoogleKey = {
        Dev: "UA-132188429-2",
        QA: "UA-132188429-3",
        BetaCN: "UA-132188429-2",
        Beta: "UA-132188429-4",
        CN: "UA-132188429-2",
        US: "UA-132188429-5"
    };

    
    // 谷歌组件路径
    var GoogleAtlasPath = Edbox.ComponentRootPath + "ThirdParty/google/gtag.js?id=";

    // 谷歌实例
    var gcom = null;

    /**
     * 获取谷歌账号ID
    * @param {string} key 服务器id
    * @return {String} GoogleId 
     */
    function GetGoogleKey (key) {
        key = key ? key : Edbox.ServerKey;
        if (GoogleKey[key]){
            return GoogleKey[key];
        }
        else{
            return GoogleKey.QA;
        }
    }


    function initGA(){

        if (typeof gtag === 'undefined' || !gtag){
            dlog("DataStatistic Init GA Failed");
            return;
        }
        else{
            dlog("DataStatistic not Init GA");
            gcom = gtag;
            // 初始化谷歌
            //gcom = window.dataLayer || [];
            gtag('js', new Date());
            gtag('config', GetGoogleKey(), {
                'custom_map': {
                    'dimension1': 'account_type', 
                    'dimension2': 'gameId',
                    'dimension3': 'channel',
                    'dimension4': 'area',
                    'dimension5': 'gameName',
                    'dimension6': 'access'						
                }
            });
        }
    }

    /**s
     * FaceBook相关配置信息
     */
    var FacebookPath = Edbox.ComponentRootPath + "ThirdParty/facebook/Loader.js?v=20191002";


    function GetAccess() {

        var access = "个人库";

        switch(Edbox.Access){
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

        return Edbox.GameId === "" ? "" : access;
    }

    // 获取作品相关信息
    function getGameDetail(success, error){
              // 获取模板id
        if (Edbox.Access === 1){
            Edbox.Api.MMO.GetBaseAppInfo(Edbox.GameId, Edbox.Version, function(data){
                _gameName = data.app_name;
                _templateID = Edbox.GameId;
                _templateVersion = Edbox.Version;
                
                if (success) success(_gameName);
            },error);
        }
        else if (Edbox.Access === 2){
                Edbox.Api.MMO.GetPersonalAppInfo(Edbox.GameId, function(data){
                    _gameName = data.app_name;
                    _templateID = data.baseid;
                    _templateVersion = data.base_version;

                    if (success) success(_gameName);
                },error);
        }
        else if (Edbox.Access === 3){
            Edbox.Api.MMO.GetAppInfo(Edbox.GameId, function(data){
                _gameName = data.app_name;
                _templateID = data.baseid;
                _templateVersion = data.base_version;

                if (success) success(_gameName);
            },error);
        }
    }

  
    // 获取总标签数据
    function GetTagsMap (success, error) {

        Edbox.Api.MMO.GetTagMap(function (data) {
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
            dlog('GetTagMap failed : ' + err);
            if (error) error('GetTagMap failed : ' + err);
        });
    }

    /**
     * 获取标签数据
     * @param {String} appid 数据
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    function GetAppTags (appid, success, error) {

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
            Edbox.Api.MMO.GetTags(appid, function (taginfo) {
                if (taginfo) {

                    _appTags = GetTagsFormatData(appid, taginfo);

                    _appId = appid;

                    if (success) success(_appTags);
                } else {
                    if (error) error("GetTags null");
                }
            }, function (e) { if (error) error(e); });
        }
    }


    // 获取标签格式数据
    function GetTagsFormatData (appid, taginfo) {
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
    }


    //根据标签码获取标签文本
    function GetTagsByCodes(codes) {
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
    }


    function GetLoginInfo (){
        // 登陆方式
        var loginMode = "";

        if (location.host.indexOf('game.') >= 0) {
            loginMode = "Game";
        }else if (location.host === Edbox.GetHost("Lobby") ){
            loginMode = "Lobby";
        }else if (location.host === Edbox.GetHost("Component") ){
            loginMode = "Editor";
        }

        _userId = Edbox.EbUserId + '';

        var info = {
            "gameId": Edbox.GameId,
            "userId": _userId,
            "account_type": Edbox.AccountType,
            "channel": Edbox.Channel,
            "access": GetAccess(),
            "version": Edbox.Version,
            "area": Edbox.Area,
            "server_key": Edbox.ServerKey,
            "loginMode": loginMode
        };

        return info;
    }

    /**
    * 发送云图事件
    * @param {string} event 自定义事件ID
    * @param {Object} info 自定义信息
    */
   function YuntuEvent (event, info) {
        if (!com) return;
        
        com.onEvent({
            eventId: event + '_' + Edbox.ServerKey,
            info: info
        });

        dlog(event, info);
    }

    /**
    * 发送谷歌事件
    * @param {string} event 事件ID
    * @param {string} category 事件分类
    * @param {string} label 事件附加信息
    * @param {function} callback 消息发送成功后回调
    */
    function GAEvent (event, category, label, callback) {
        if (!gcom) {
            if (callback) callback();
            return;
        }
        //var sendInfo = ["event", event, info];
        //gcom.push(sendInfo);
        if (!category) category = "";
        if (!label) label = "";

        gtag('event', event, {
            'event_category': category,
            'event_label': label,
            'send_to': GetGoogleKey(),
            'event_callback': createFunctionWithTimeout(function() {
                if(callback) callback();
            })
        });

        //console.log("GA log :" + event + "  " + GetGoogleKey());
    }

    // 超时处理
    function createFunctionWithTimeout(callback, opt_timeout) {
        var called = false;
        function fn() {
          if (!called) {
            called = true;
            callback();
          }
        }
        // 超时时间默认10s
        setTimeout(fn, opt_timeout || 10000);
        return fn;
      }

    function gtag (){
        window.dataLayer = window.dataLayer || [];
        dataLayer.push(arguments);
    }

    // GA登陆
    function GoogleLogin (){
        if (!gcom) return;

        // 组件不记录
        if (location.host.indexOf(Edbox.GetHost("Component")) === 0){
            return;
        }

        var loginType = "defalut";

        if (location.host.indexOf(Edbox.GetHost("Lobby")) === 0){
            loginType = "lobby";
        }
        else{
            loginType = "game";

            // 获取作品名称
            getGameDetail(function(){
                gtag('event', 'gameName_dimension', {'gameName': _gameName });  
            });
        }
        
        // 自定义维度数据
        gtag('event', 'account_type_dimension', {'account_type': Edbox.AccountType});
        gtag('event', 'channel_dimension', {'channel': Edbox.Channel});
        gtag('event', 'area_type_dimension', {'area': Edbox.Area}); 
        gtag('event', 'gameId_dimension', {'gameId': Edbox.GameId});
        gtag('event', 'access_dimension', {'access': Edbox.Access + ""});

        GAEvent("login_" + loginType, Edbox.AccountType + "_login" , Edbox.EbUserId+"");
    }

    
    /**
    * GA 老用户登陆记录
    * @param {function} callback 消息发送成功后回调
    */
   function signInGoogle (callback){
        GAEvent("signin", Edbox.AccountType + "_signin" , Edbox.EbUserId+"", callback);
    }

    /**
    * GA 新增用户记录
    * @param {function} callback 消息发送成功后回调
    */
    function signUpGoogle (callback){   
        //console.log("谷歌登陆注册");        
        GAEvent("signup", Edbox.AccountType + "_signup" , Edbox.EbUserId+"", callback);
        //console.log("谷歌登陆注册结束");   
    }

    /**
    * Facebook 老用户登陆记录
    * @param {function} callback 消息发送成功后回调
    */
    function signInFacebook (callback){   
        if (Edbox.AccountType !== "Facebook") return;

        Require(FacebookPath, function () {
            dlog("Sign In Facebook");
            if (
                typeof fbq('trackCustom', 'SignIn', {
                    promotion: Edbox.EbUserId                
                }
              ) === 'undefined') if(callback) callback();

        });
    }

    /**
    * Facebook 新增用户记录
    * @param {function} callback 消息发送成功后回调
    */
   function signUpFacebook (callback){

        if (Edbox.AccountType !== "Facebook") return;
        
        Require(FacebookPath, function () {
            dlog("Sign Up Facebook");
            if (
                typeof fbq('track', 'CompleteRegistration', {
                  content_name: Edbox.EbUserId, 
                  currency: 'USD',
                  value: 1
                }
              ) === 'undefined') if(callback) callback();

            //if( typeof fbq('track', 'CompleteRegistration', {content_name: Edbox.EbUserId, currency: "USD", value: 1} === 'undefined') fdbCallback();     
        }); 
    }
    
    var _flag_NewUser = 1;
    var _flag_GA = 2;
    var _flag_FB = 4;
    
     /**
     * 初始化组件
     */
    function Init () {

        // 国外开启Google分析和FaceBook
        if (Edbox.ServerKey === "Beta" || Edbox.ServerKey === "US"){
            initGA(); 

            Edbox.Action.User.GetUserInfo(function (data) {      
                // 国外开启Google分析和FaceBook
          
                if (data.statistics_flag === 0) {
                    Edbox.Api.MMO.SetStatisticsFlag(_flag_NewUser | _flag_GA | _flag_FB);
                    signInGoogle();
                    signInFacebook();
                    return;
                }
    
                // 记录谷歌 用户登陆
                if (data.statistics_flag & _flag_GA){
                    signInGoogle();
                }
                else{
                    // 记录谷歌 新用户注册
                    signUpGoogle(function(){
                        //console.log('谷歌注册成功拉!!!!!!!!!!!!!');
                        Edbox.Api.MMO.SetStatisticsFlag( data.statistics_flag | _flag_GA);
                    });
                }
    
                // 记录Facebook 用户登陆
                if (data.statistics_flag & _flag_FB){
                    signInFacebook();
                }
                else{
                    // 记录Facebook 新用户注册
                    signUpFacebook(function(){
                        //console.log('Facebook注册成功拉!!!!!!!!!!!!!');
                        Edbox.Api.MMO.SetStatisticsFlag( data.statistics_flag | _flag_FB);
                    });
                }
            });                  
        }
    
        if (Edbox.ServerKey === "Feature" || Edbox.ServerKey === "Dev" || Edbox.ServerKey === "QA" ) {
            _IsYuntuLog = true;
        }

        initYunTu();

        _init = true;
    }

    /**
    * log记录
    * @param {string} context 标题数据
    * @param {string} log 记录内容
    */
    function dlog(context, log) {
        if (module.OnLog){
            if(context) module.OnLog(context);
            if(log) module.OnLog(log);
        }
    }

    /**
     * Edbox数据统计服务
     * 用于Edbox平台的数据埋点收集组件
     * @author 陈五洲(880123) Review by 温荣泉(201901)
     * @see http://ndsdn.nd.com.cn/index.php?title=Edbox数据统计
     * */
    var module = {

        /**
        * log输出
        */
        OnLog: null,

        /**
         * 用户登陆
         */
        Login: function () {

            if (!_isOpen) return;

            // 登陆事件
            function loginEvent(){

                GoogleLogin();
                YuntuEvent("edbox_Login", GetLoginInfo());

                Edbox.WindowEvent.AddExitEvent(module.Exit); 
            }  
            
            if (!_init) Init();
            loginEvent();     
            
        },

        /**
         * 新增注册用户
        * @param {function} callback 消息发送成功后回调
         */
        SignUp : function(callback){    
            var host = window.location.host;
            if (host.indexOf(Edbox.GetHost("Lobby")) >= 0 || host.indexOf(Edbox.GetHost("Game")) >= 0){
                if (!_init) Init();  
 
                signUpFacebook();            
                signUpGoogle(callback);
            }
            else{
                if (callback) callback();
            }
        },

       /**
         * 老用户登陆
         * @param {function} callback 消息发送成功后回调
        */
        SignIn : function(callback){
            var host = window.location.host;
            if (host.indexOf(Edbox.GetHost("Lobby")) >= 0 || host.indexOf(Edbox.GetHost("Game")) >= 0){
                if (!_init) Init();
                signInFacebook();
                signInGoogle(callback);
            }
            else{
                if (callback) callback();
            }
        },

        /**
         * 开始游戏
         * @param {string} gameId 游戏id
         */
        StartGame: function (gameId) {
            GetAppTags(gameId, function (info) {
                YuntuEvent("edbox_StartGame", info);
            });
        },

        /**
         * 发布游戏
         * @param {string} gameId 游戏id
         */
        PublishGame: function (gameId) {
            GetAppTags(gameId, function (info) {
                YuntuEvent("edbox_PublishGame",info);
            });
            
        },

        /**
         * 收藏游戏
         * @param {string} gameId 游戏id
         */
        CollectGame: function (gameId) {
            GetAppTags(gameId, function (info) {
                YuntuEvent("edbox_CollectGame",info);
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
 
            YuntuEvent("edbox_ShareGame",info);
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

            YuntuEvent("edbox_ExportGame",info);
        },

        /**
         * 导出编辑模板
         * @param {string} gameId 游戏id
        */
        ExportEditorTemplate: function (gameId) {
            GetAppTags(gameId, function (info) {
                YuntuEvent("edbox_ExportEditorTemplate",info);
            });
        },

        /**
         * 提交反馈
         */
        FeedBack: function () {
            YuntuEvent("edbox_FeedBack",{});
        },

        /**
         * 用户注销
         */
        Logout: function () {
            var  info = {
                userid: _userId
            };

            YuntuEvent("edbox_Logout",info);

            // 云图独立登陆事件
            if (com){
                com.onProfileSignOff();
            }
            
        },

        /**
         * 用户退出
         */
        Exit: function () {

            YuntuEvent("edbox_Exit", {
                userid: _userId
            });

            // 云图独立登陆事件
            if (com){
                com.onProfileSignOff();
            }

            // 退出大厅处理
            if (location.host === Edbox.GetHost("Lobby")){
                module.ClickEvent("CloseLobby");
            }
        },

        /**
         * 设置是否记录埋点信息
         * @param {bool} open 是否开启
        */ 
        SetOpen: function (open){
            _isOpen = open;
        },

         /**
         * 获取是否记录埋点信息
         * @return {bool} open 是否开启
        */ 
        GetOpen: function (){
            return _isOpen;
        },


        /**
         * Edbox编辑器使用
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

                com.onProfileSignIn(Edbox.EbUserId + '');

                GetAppTags(Edbox.GameId, function (info) {

                    info['access'] = GetAccess();

                    YuntuEvent("edbox_EditorGame", info);

                }, null);

                Edbox.WindowEvent.AddExitEvent(module.EditExit);
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

                YuntuEvent("edbox_EditorSave", info);
            });
        },

        /**
         * 试玩游戏
         */
        EditPlay: function () {
            if (!com) return;

            GetAppTags(Edbox.GameId, function (info) {
                info['access'] = GetAccess();

                YuntuEvent("edbox_EditorPlay", info);  
            });
        },

        /**
         * 退出编辑
         */
        EditExit: function () {
            if (!com) return;

            GetAppTags(Edbox.GameId, function (info) {

                info['access'] = GetAccess();

                YuntuEvent("edbox_EditorExit", info);  
            });
        },

        /**
         * 界面点击事件
         * @param {string} eventId 事件名称
         * @param {string} category 事件分类
         * @param {string} info 事件信息
         * @param {function} callback 消息发送成功后回调
         */
        ClickEvent: function (eventId, category, info, callback) {
            GAEvent("click" + eventId, category, info, callback);
        },
       
        /**
         * 用户自定义埋点接口
         * @param {string} eventId 事件名称
         * @param {object} info 用户自定义事件
         */
        CustomEvent: function (eventId, info) {
            
            function GetTemplateID(success){
                // 还未获取信息
                if (_templateID === ""){
                    getGameDetail(success); 
                }
                else{
                    success();
                }
            }

            if (Edbox.GameId === "") return;

            GetTemplateID(function(){
                if (!info || typeof info !== "object"){
                    info = new Object();
                }
                
                info.GameName = _gameName;
                info.GameId = Edbox.GameId;
                info.Version = Edbox.Version;
                //info.BaseId = _templateID;
                //info.BaseVersion = _templateVersion;
                YuntuEvent(Edbox.GameId + "_"+ eventId, info);
            });        
        },

        /**
        * 发送谷歌事件
        * @param {string} category 事件类别
        * @param {string} event 事件操作名称
        * @param {string} label 事件标签信息
        */
        GoogleEvent : function (category, event, label) {
            if (!gcom) return;
            
            // 附件一个自定义标识
            if (!label) label = "";
            gtag('event', event, {
                'event_category': category+ "_custom",
                'event_label': label,
                'send_to': GetGoogleKey()
                // 自定义标识
            });
        }

    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }

    /*
    * 加载组件
    */
    function Loader () {
           
        var srvKey = GetServerKey();
        function GetHost (key) {       
            if (Edbox.Host && Edbox.Host[key]) return Edbox.Host[key][srvKey];
            return "";
        }

        var host = window.location.host; 
        // 特定host环境下才加载数据埋点     
        if (host.indexOf(GetHost("Lobby")) >= 0 || 
            host.indexOf(GetHost("Game")) >= 0 || 
            host.indexOf(GetHost("Component")) >= 0){
            // 国外开启Google分析和FaceBook
            if (srvKey === "Beta" || srvKey === "US"){
                Edbox.InitRequire(GoogleAtlasPath + GetGoogleKey());
            }

            Edbox.InitRequire(CloudAtlasPath);   
        }
          
   }

   Loader();

}(Edbox, "DataStatistic"));