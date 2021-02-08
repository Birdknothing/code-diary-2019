// Edbox 通用组件
(function (namespace, className) {
    var userInfo = null;    // Edbox用户信息
    /**
     * 登录
     */
    function Login() {
        function success() {
            if (Edbox.Components) {
                Edbox.Components.Start();
            }

            if (module.LoggedCallBack) {
                module.LoggedCallBack(module.IsLogin);
            }
        }
        function error(e) {
            // console.log(e);
            if (module.LoggedCallBack) module.LoggedCallBack(module.IsLogin);
        }
        function getGameInfo() {
            if (module.GameId) {
                module.MMO.GetGameInfo(module.GameId, module.Version, module.Access, module.Mode, function (data) {
                    if (data) {
                        module.ServerInfo = data;
                        // 识别pkg参数:PackageGuid
                        pkg = module.GetQueryString("pkg");
                        if (pkg) {
                            module.PackageGuid = pkg;
                        }
                        else {
                            module.PackageGuid = data.pkg_resid;
                        }

                        if (module.Editor) {
                            module.Editor.Init(success, error);
                        } else {
                            success();
                        }
                    }
                    else {
                        success();
                    }
                }, error);
            }
            else {
                error("MMO Init Error");
            }
        }
        
        function bindMessage(){
            Edbox.Message.AddMessageHandler("JumpBuyGameLink", function (datas, com) {
                if (datas.length >= 3) {
                    location.href = datas[2];
                }
            });
        }
        /**
         * 获取DataConfig中Login数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        function GetDataConfig(success, error) {
            if (Edbox.PackageGuid) {
                Edbox.Resource.GetConfig("DatasConfig", function (data) {
                    // 未接入登录控件
                    if (!data || !data.StaticData || !data.StaticData.Login) {
                        if (error) error(data);
                    }
                    else if (success)
                        success(data);
                }, error);
            }
            else
                error();
        }
        /**
         * 初始化登录选择页面
         * @returns {Object} 子页面元素
         */
        function InitLoginIfm() {
            var LoginUrl = "/coms/Login/index.html";
            var iframe = document.createElement("iframe");
            var tempURL = Edbox.Protocol + "://" + Edbox.GetHost("Component") + LoginUrl + "?v=" + new Date().getTime();
            iframe.setAttribute("src", tempURL);
            iframe.style.top = "0";
            iframe.style.left = "0";
            iframe.style.position = "fixed";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.borderWidth = "0px";
            iframe.style.zIndex = "9999";
            document.body.appendChild(iframe);
            return iframe;
        }
        /**
         * 初始化监听消息
         */
        function onMessage() {
            function messageCallBack(e) {
                var data = e.data;
                if (data && data.Type && data.Type === "GoToLogin") {
                    var LoginMode = data.Datas[0];
                    JumpUrl(LoginMode);
                    window.removeEventListener("message", messageCallBack, false);
                }
            }
            window.addEventListener("message", messageCallBack, false);
        }
        /**
         * 向Login页发送消息
         * @param {document} dom 操作的元素
         * @param {String} Type 发送的消息类型
         * @param {any} Datas 发送的消息
         */
        function Send(dom, Type, Datas) {
            if (dom) {
                var data = {
                    Type: Type,
                    Datas: Datas
                };
                dom.contentWindow.postMessage(data, "*");
            }
        }
        /**
         * 跳转页面
         * @param {String} LoginMode 登陆模式
         */
        function JumpUrl(LoginMode) {
            var url = module.Protocol + "://" + module.GetHost("Login") + "/edbox.php?c=login";
            url = module.SetQueryString("lan", module.Language || "SimplifiedChinese", url);
            url = module.SetQueryString("template", module.Channel.toLowerCase(), url);
            url = module.SetQueryString("area", module.Area, url);
            url = module.SetQueryString("v", new Date().getTime(), url);
            url = module.SetQueryString("CallbackUrl", location.href, url);
            url = module.SetQueryString("EdboxArgs", module.GetLoginInfo(), url);
            if (LoginMode)
                url = module.SetQueryString("mode", LoginMode, url);
            location.href = url;
        }
        // 获取游戏信息
        function InitLogin() {
            // 游戏分享打开
            if (module.GameId) {
                onMessage();
                // 获取DatasConfig包
                GetDataConfig(function (data) {
                    var loginIfm = InitLoginIfm();
                    loginIfm.onload = function () {
                        Send(loginIfm, "DatasConfig", [data.StaticData.Login]);
                    };
                }, JumpUrl);
            }
            // 大厅打开
            else {
                JumpUrl();
            }
        }
        CheckUserInfo(function () {
            if (module.IsLogin) {
                // 处理登录成功后的托管委托
                bindMessage();
                ExecutiveHeartbeatPackage();
                LoginDataCollect();
                getGameInfo();
            }
            else {
                InitLogin();
            }
        });
    }
    /**
     * 用户信息检查回调
     */
    var CheckUserInfoCallback = null;

    /**
     * 检测用户数据
     * @param {Function} callback 完成回调
     */
    function CheckUserInfo(callback) {
        function success() {
            if (CheckUserInfoCallback) CheckUserInfoCallback();
            CheckUserInfoCallback = null;
        }

        if (CheckUserInfoCallback) {
            var temp = CheckUserInfoCallback;
            CheckUserInfoCallback = function () {
                temp();
                if (callback) callback();
            };
            return;
        }

        CheckUserInfoCallback = function () {
            if (callback) callback();
        };

        // 获取Edbox用户数据
        function getEdboxUserInfo(success) {
            if (!module.IsLogin) {
                success();
                return;
            }

            function getMMOUserInfo() {
                module.Action.User.GetUserInfo(function (data) {
                    userInfo = data;
                    module.EbUserId = data.user_id;
                    if (!module.UserName || module.UserName.trim().length === 0) {
                        module.UserName = data.nick_name;
                    }
                    if (!module.RealName || module.RealName.trim().length === 0) {
                        module.RealName = data.real_name;
                    }
                    // module.UserVipInfo = getVipInfo(data.vip_info);
                    if (success) success();

                }, function (err) {
                    console.log(err);
                    if (err && err.status !== 0) {
                        module.Logout();
                    }
                    success();
                });
            }
            
//             function getVipInfo(vip_info){
//                 var data = new Object;
//                 //当前vip等级(int)
//                 data.vip_level = vip_info.vip_level;
//                 //vip_info.remain_time : 当前vip剩余有效时间（小时）
//                 data.remain_time = getLimitTime(vip_info.remain_time);
//                 data.current_list = new Array;
//                 if(vip_info.current_list && vip_info.current_list.length > 0){
//                     for(var i = 0; i < vip_info.current_list.length; i++){
//                         var vip = new Object;
//                         var item = vip_info.current_list[i];
//                         vip.vip_level = item.vip_level;
//                         vip.remain_time = getLimitTime(item.remain_time);
//                         //状态，0正在使用，1封存，2到期
//                         vip.status = item.status;
//                         data.current_list.push(vip);
//                     }
//                 }
//                 return data;
//             }
            
//             function getLimitTime(remain_time){
//                 if(remain_time === -1){
//                     remain_time = 9999999;
//                 }
//                 var t = new Date(new Date().getTime() + remain_time * 3600 * 1000);
//                 return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
//             }

            module.Api.UC.GetUserInfo(module.AccountId, function (data) {
                module.UserName = data.nick_name;
                if (data.org_exinfo) {
                    module.RealName = data.org_exinfo.real_name;
                }
                getMMOUserInfo();
            }, function (err) {
                console.log(err);
                if (err && err.status !== 0) {
                    module.Logout();
                }
                success();
            });
        }

        // 识别EdboxArgs参数
        var uid = module.GetQueryString("uid");
        var auth = module.GetQueryString("auth");
        if (!auth) {
            var base64auth = module.GetQueryString("base64auth");
            if (base64auth) {
                auth = module.Decode(base64auth);
            }
        }
        var id = module.GetQueryString("sdp-app-id");
        if (id) {
            module.SDPAppId = id;
        }
        if (!uid || !auth) {
            getEdboxUserInfo(success);
            return;
        }

        module.Action.UC.ValidCheck(uid, auth, function (data) {
            // UC的用户id
            module.AccountId = data.AccountId;
            // UC的用户Token
            module.AccessToken = data.AccessToken;
            // UC的用户秘钥
            module.MacKey = data.MacKey;
            // UC服务器时间差
            module.TimeStamp = data.TimeStamp;
            // 用户头像
            module.Avatar = data.Avatar;

            module.IsLogin = true;

            module.DataSet.Set("EdboxArgs", module.GetLoginInfo());
            var url = module.RemoveQueryString("uid");
            url = module.RemoveQueryString("auth", url);
            url = module.RemoveQueryString("base64auth", url);
            history.pushState("Location Change", null, url);

            getEdboxUserInfo(success);
        }, function (e) {
            getEdboxUserInfo(success);
            console.log(e);
        });
    }

    /**
     * 执行心跳包
     */
    function ExecutiveHeartbeatPackage() {
        function postOnlineInfo() {
            if (!module.IsLogin || !module.MMO || !module.GameId || !module.Version) return;
            if (window.location.host.toLowerCase().indexOf("game") < 0) return;
            module.MMO.HeartBeating(null, function (e) { console.log(e); });
        }

        postOnlineInfo();

        setInterval(function () {
            postOnlineInfo();
        }, 60 * 1000);
    }

    /**
     * 登录埋点数据收集
     */
    function LoginDataCollect() {
        if (module.DataStatistic) {
            module.DataStatistic.Login();
        }
    }

    /**
     * 获取年龄
     * @param {String} strBirthday 生日 yyyy-mm-dd
     * @returns {Number} 年龄
     */
    function jsGetAge(strBirthday) {
        var strBirthdayArr = strBirthday.split("-");
        var d = new Date();
        var yearDiff = d.getFullYear() - strBirthdayArr[0];
        var monthDiff = d.getMonth() + 1 - strBirthdayArr[1];
        var dayDiff = d.getDate() - strBirthdayArr[2];
        var age = monthDiff || monthDiff === 0 && dayDiff > 0 ? yearDiff : yearDiff - 1; //判断有没有到生日,没到就减1
        return age = age > 0 ? age : 0;
    }


    /**
    * 跳转编辑器页面的前置判断
    * data = {
    *   type : string,
    *   func : function 
    *           success : function,
    *                   data : {
    *                       ret : boolean 是否检测通过,
    *                       info : 相关信息
    * 
    *           }
    *           error : function
    * }
    *
    **/

    /**
     * Edbox 通用组件
     * 用于Edbox平台的基础服务框架
     * 拓展Edbox Html5游戏必须或常用Js方法
     * @author 温荣泉(201901)
     * @see http://ndsdn.nd.com.cn/index.php?title=Edbox%E9%80%9A%E7%94%A8%E7%BB%84%E4%BB%B6JS%E7%89%88
     * */
    var module = {
        // 用户信息
        EbUserId: 0, // Edbox平台用户id，用于获取平台角色信息
        UserName: "", // Edbox平台用户昵称
        RealName: "", // Edbox平台用户真实名称

        AccountId: "", // UC的用户id
        AccountType: "Default", // 账号登录方式, "Default"(默认),"Edbox","Edmodo","99U","101PPT","101Lms","Frt","Wjt","Hwt","QQ","Weixin","Weibo","Facebook","Google","Twitter","Guest"
        Avatar: "", // 用户的头像
        AccessToken: "", // UC的用户Token
        MacKey: "", // UC的用户秘钥
        TimeStamp: 0, // 本地时间与UC服务器时间的间隔

        // 游戏信息
        SDPAppId: "", // SDP应用ID
        Access: 2, // 访问类型  1-模板 2-个人库 3-体验库 
        GameId: "", // Edbox上的游戏id
        Version: "", // Edbox上的游戏版本
        Mode: 1, // 访问模式 0-显示需求 1-试玩需求 2-分享需求 3-编辑 4-体验区游戏 
        PackageGuid: "", // package包在NDR上的guid  用于H5平台

        // 透传数据
        Area: "CHN", // 地区， 中国：CHN，美国：USA， 香港：HK
        Language: null, // 语言，English,SimplifiedChinese,TraditionalChinese,TraditionalChinese_TW
        Channel: "Default",	//渠道, "Default"(默认), "Edbox", "Edbox_cn", "MingXingAPP", "HaoWenTi", "Conquer"

        // 配置信息
        IsLogin: false, // 是否已经登录
        ServerKey: "CN", // 服务器关键字，QA:QA提测(默认)、Dev:开发、Feature:特性测试、CN:国内、US:海外、HK:香港

        // 临时参数
        ServerInfo: null, // 服务端返回游戏信息

        /**
        * 跳转编辑器页面的前置判断
        * data = {
        *   type : string,
        *   func : function 
        *           success : function,
        *                   data : {
        *                       ret : boolean 是否检测通过,
        *                       info : 相关信息
        * 
        *           }
        *           error : function
        * }
        *
        **/
        PreGoEditor : new Array(),

        /**
         * 获取Base64编码的登录信息
         * @return {String} Base64编码的登录信息
         */
        GetLoginInfo: function () {
            function valid(s) {
                if (!s) return false;
                if (typeof s !== "string") return false;
                if (s.trim().length > 0) return true;
                return false;
            }

            var obj = new Object();
            // 用户信息
            if (module.IsLogin) {
                obj.EbUserId = module.EbUserId; // Edbox平台用户id，用于获取平台角色信息
                obj.UserName = module.UserName; // Edbox平台用户昵称
                obj.RealName = module.RealName; // Edbox平台用户真实名称
                obj.AccountId = module.AccountId; // UC的用户id
                obj.AccessToken = module.AccessToken; // UC的用户Token
                obj.MacKey = module.MacKey; // UC的用户秘钥
                obj.TimeStamp = module.TimeStamp; // 本地时间与UC服务器时间的间隔
                if (valid(module.AccountType)) {
                    obj.AccountType = module.AccountType; // 账号登录方式
                }
            }

            // 游戏信息
            obj.Access = module.Access; // 访问类型
            if (valid(module.GameId)) {
                obj.GameId = module.GameId; // Edbox上的游戏id
            }
            if (valid(module.Version)) {
                obj.Version = module.Version; // Edbox上的游戏id
            }
            if (valid(module.SDPAppId)) {
                obj.SDPAppId = module.SDPAppId; // SDP应用ID
            }

            // 透传数据
            obj.Language = module.Language; // 语言，English,SimplifiedChinese,TraditionalChinese
            obj.Area = module.Area; // 地区， 中国：CHN，美国：USA， 香港：HK
            obj.Channel = module.Channel; // 渠道, "Default"(默认), "Edbox", "Edbox_cn", "MingXingAPP", "HaoWenTi", "Conquer"
            obj.AppKey = Edbox.AppKey;
            return module.Encode(JSON.stringify(obj));
        },

        /**
         * 登录成功委托设置
         * @param {Boolean} isLogin 是否成功登录
         */
        LoggedCallBack: function (isLogin) {
        },

        /**
         * Edbox 登录启动
         * @param {Function} callback 登录结束回调方法
         */
        Start: function (callback) {
            // 判断是否方法设置回调
            if (typeof callback === "function") {
                module.LoggedCallBack = function (isLogin) {
                    if (callback) {
                        callback(isLogin);
                    }
                };
            }

            Login();
        },

        /**
         * Edbox 退出
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        Logout: function (success, error) {
            module.Api.MMO.Logout(function () {
                if (success) success();
            }, error);

            module.IsLogin = false;
            module.EbUserId = 0; // Edbox平台用户id，用于获取平台角色信息
            module.UserName = ""; // Edbox平台用户昵称
            module.RealName = ""; // Edbox平台用户真实名称
            module.AccountId = ""; // UC的用户id
            module.AccountType = "Default"; // 账号登录方式, "Default"(默认),"Edbox","Edmodo","99U","101PPT","101Lms","Frt","Wjt","Hwt","QQ","Weixin","Weibo","Facebook","Google","Twitter","Guest"
            module.Avatar = ""; // 用户的头像
            module.AccessToken = ""; // UC的用户Token
            module.MacKey = ""; // UC的用户秘钥
            module.TimeStamp = 0; // 本地时间与UC服务器时间的间隔
            module.DataSet.Set("EdboxArgs", module.GetLoginInfo());
        },

        /**
         * 获取组织信息
         * @param {Function} success 成功回调,Object类型{ID:组织ID,Name:组织名称}
         * @param {Function} error 出错回调
         */
        GetOrgInfo: function (success, error) {
            module.Action.UC.GetUserInfo(function (data) {
                var info = new Object();
                info.ID = data.OrgID;
                info.Name = data.OrgName;
                if (success) success(info);
            }, error);
        },

        /**
          * 获取生日、年龄信息
          * @param {Function} success 成功回调, Object类型{Birth:出生日期(String),Age:年龄周岁(Int)}
          * @param {Function} error 出错回调
          */
        GetBirthInfo: function (success, error) {
            if (userInfo === null) {
                module.Action.UC.GetUserInfo(function (data) {
                    userInfo = data;
                    var info = new Object();
                    info.Birth = userInfo.birthday;
                    info.Age = jsGetAge(userInfo.birthday);
                    if (success) success(info);
                }, error);
            }
            else {
                var info = new Object();
                info.Birth = userInfo.birthday;
                info.Age = jsGetAge(userInfo.birthday);
                if (success) success(info);
            }
        },
        /**
         * 设置语言
         * @param {String} lan 语言参数，English,SimplifiedChinese,TraditionalChinese
         */
        SetLanguage: function (lan) {
            if (!lan) return;
            lan = lan.toLowerCase();
            if (lan === "english" || lan === "en" || lan === "en-us") {
                module.Language = "English";
            }
            else if (lan === "traditionalchinese" || lan === "hk" || lan === "zh-hk") {
                module.Language = "TraditionalChinese";
            }
            else if (lan === "traditionalchinese_tw" || lan === "tw" || lan === "zh-tw") {
                module.Language = "TraditionalChinese_TW";
            }
            else {
                module.Language = "SimplifiedChinese";
            }

            module.DataSet.Set("EdboxArgs", module.GetLoginInfo());
        },

        /**
         * 前往注册页面
         */
        GotoRegister: function () {
            var url = module.Protocol + "://" + module.GetHost("Login") + "/edbox.php?c=register";
            url = module.SetQueryString("lan", module.Language || "SimplifiedChinese", url);
            url = module.SetQueryString("v", new Date().getTime(), url);
            url = module.SetQueryString("area", Edbox.Area, url);
            url = module.SetQueryString("CallbackUrl", location.href, url);
            url = module.SetQueryString("EdboxArgs", module.GetLoginInfo(), url);
            location.href = url;
        },

        /**
         * 绑定前往编辑器的前置判断
         */
        AddPreGoEditor: function (type, func) {

            var _preGoEditor = module.PreGoEditor;

            for (var k = 0; k < _preGoEditor.length; ++k) {
                if (_preGoEditor[k].type === type) {
                    _preGoEditor[k].func = func;
                    return;
                }
            }

            module.PreGoEditor = _preGoEditor.concat({ type: type, func: func });
        },


        /**
         * 前往Edbox编辑器
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GotoEditor: function (success, error) {
           

            function gotoEditor() {

                var obj = JSON.parse(module.Decode(module.GetLoginInfo()));
                if (obj.Access)
                    delete obj.Access;

                if (obj.Version)
                    delete obj.Version;

                if (obj.GameId)
                    delete obj.GameId;

                var args = module.Encode(JSON.stringify(obj));

                var url = module.Protocol + "://" + module.GetHost("Login") + "/edbox.php?c=im&a=launch";
                url = module.SetQueryString("playerid", module.EbUserId, url);
                url = module.SetQueryString("productid", module.GameId, url);
                url = module.SetQueryString("accesstype", module.Access, url);
                url = module.SetQueryString("EdboxArgs", args, url);

                location.href = url;
            }

            if (!module.IsLogin) {
                alert(module.GetTip("ERROR_NotLoggedIn"));
                return;
            }
            if (!module.GameId) {
                alert(module.GetTip("ERROR_GameIDInvalid"));
                return;
            }
            if (!module.ServerInfo) {
                gotoEditor();
                return;
            }

            if (module.Platform.IsIOS && !module.ServerInfo.web_editor_resid && !module.ServerInfo.ios_editor_resid) {
                alert(module.GetTip("ERROR_EditorNotSupport"));
                return;
            }
            if (module.Platform.IsAndroid && !module.ServerInfo.web_editor_resid && !module.ServerInfo.android_editor_resid) {
                alert(module.GetTip("ERROR_EditorNotSupport"));
                return;
            }

            // 检测打开编辑器的条件
            function checkPreGoEditor(eSuccess, index) {
                index = !index ? 0 : index;

                if (module.PreGoEditor.length < 1) {
                    if (success) success();
                }
                else {
                    var eitem = module.PreGoEditor[index];
                    var checkfunc = eitem.func;
                    checkfunc(function (data) {
                        if (data.ret) {
                            index = index + 1;
                            if (index >= module.PreGoEditor.length) {
                                if (eSuccess) eSuccess();
                            }
                            else{
                                checkPreGoEditor(eSuccess, index);
                            }       
                        }
                        else {
                            if (error) error(data.info);
                        }
                    }, function (err) {
                        var errlog = "Go Editor Error Step is :" + eitem.type + " ," + err;
                        if (error) error(errlog);
                    });
                }
            }

            checkPreGoEditor(function () {
                gotoEditor();
            });
        },

        /**
         * 获取Edbox编辑器链接
         * @param {Function} success 成功回调,带参数Edbox编辑器Url，带登录信息
         * @param {Function} error 出错回调
         */
        GetEditorUrl: function (success, error) {
            if (!module.IsLogin) {
                if (error)
                    error(module.GetTip("ERROR_NotLoggedIn"));
                return;
            }
            if (!module.GameId) {
                if (error)
                    error(module.GetTip("ERROR_GameIDInvalid"));
                return;
            }

            if (!module.ServerInfo || !module.ServerInfo.web_editor_resid) {
                alert(module.GetTip("ERROR_EditorNotSupport"));
                return;
            }

            if (success)
                success(module.ServerInfo.web_editor_resid);
        },

        /**
         * 前往试玩游戏
         * @param {Function} error 出错回调
         */
        GotoPreviewGame: function (error) {
            module.GetPreviewGameUrl(function (url) {
                // 关闭退出提示
                module.WindowEvent.Hide();

                location.href = url;
            }, error);
        },

        /**
         * 获取游戏试玩链接
         * @param {Function} success 成功回调,带参数试玩Url，带登录信息仅用于开发者自行试玩
         * @param {Function} error 出错回调
         */
        GetPreviewGameUrl: function (success, error) {
            if (!module.MMO) {
                // 缺少组件module.MMO引用无法获取分享链接
                if (error) error("Missing component module.MMO reference can't get share link");
                return;
            }

            module.MMO.GetGameLink(module.GameId, "", module.Access, 1, function (url) {
                if (url !== "")
                    url = module.SetQueryString("EdboxArgs", module.GetLoginInfo(), url);
                if (success) success(url);
            }, error);
        },

        /**
         * 获取分享Url
         * @returns {String} 分享Url，可用于生成二维码
         */
        GetShareUrl: function () {
            var url = module.Protocol + "://" + module.GetHost("MMO") + "/m/" + module.GameId + "/" + module.Access + "_2";
            url = module.FillUrl(url);
            return url;
        },

        /**
         * 从服务端获取分享Url
         * @param {Function} success 成功回调,带参数分享Url，可用于生成二维码
         * @param {Function} error 出错回调
         */
        GetShareUrlFromServer: function (success, error) {
            if (!module.MMO) {
                // 缺少组件module.MMO引用无法获取分享链接
                if (error) error("Missing component module.MMO reference can't get share link");
                return;
            }

            module.MMO.GetGameLink(module.GameId, "", module.Access, 2, success, error);
        },

        /**
         * 完善URL,添加语言参数，地区参数
         * @param {String} url 原URL
         * @returns {String} 完善后的URL
         */
        FillUrl: function (url) {
            function getlan() {
                if (module.Language === "English") return "en";
                if (module.Language === "TraditionalChinese") return "hk";
                if (module.Language === "TraditionalChinese_TW") return "tw";
                return "ch";
            }

            if (!url || url === "") return "";

            url = module.SetQueryString("lan", getlan(), url);
            url = module.SetQueryString("area", module.Area, url);
            url = module.SetQueryString("appkey", Edbox.AppKey, url);
            if (module.SDPAppId && module.SDPAppId.trim().length > 0) {
                url = module.SetQueryString("sdp-app-id", module.SDPAppId, url);
            }
            if (module.Channel !== "Default") {
                url = module.SetQueryString("channel", module.Channel, url);
            }
            return url;
        },

        /**
         * 获取Host地址
         * @param {String} key 关键字:MMO、NDR、CS、CDNCS、FrontendLib、Login、Component、Game
         * @returns {String} Host地址
         */
        GetHost: function (key) {
            var host = module.Host;
            var tempKey = key + "_" + module.Protocol.toUpperCase();
            if (host && host[tempKey]) return host[tempKey][module.ServerKey];
            if (!host || !host[key]) return key;
            return host[key][module.ServerKey];
        },

        /**
         * 获取提示信息
         * @param {String} key 关键字
         * @returns {String} 提示信息
         */
        GetTip: function (key) {
            var tips = module.Tips;
            if (!tips || !tips[key]) return key;
            return tips[key][module.Language];
        },

        /**
         * 转换语言
         * @returns {String} 语言关键字
         */
        GetLanguageCode: function () {
            if (module.Language) {
                if (module.Language === "English") {
                    return "en-US";
                }
                else if (module.Language === "SimplifiedChinese") {
                    return "zh-CN";
                }
                else if (module.Language === "TraditionalChinese") {
                    return "zh-HK";
                }
                else if (module.Language === "TraditionalChinese_TW") {
                    return "zh-TW";
                }
            }
            return "zh-CN";
        },

        /**
        * 获取年龄限制的功能
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
       */
        GetFunctionConfig: function (success, error) {
            module.GetBirthInfo(function (info) {
                var data = new Object();
                data.LimitFunctions = [];
                if (info.Age < module.AgeLimit) {
                    data.LimitFunctions = module.LimitFunctions;
                }
                if (success) success(data);
            }, function (e) {
                console.log("GetBirthInfo error : " + e);
                if (error) error(e);
            });
        },

        /**
         * Api对象，记录所有Api方法
         */
        Api: new Object(),

        /**
         * 行为对象，记录所有行为方法
         */
        Action: new Object(),

        /**
         * 初始化组件路径
         * @param {Object} com 组件对象
         */
        InitPath: function (com) {
            var scripts = document.scripts;
            var path = scripts[scripts.length - 1].src;
            path = path.substring(0, path.lastIndexOf("/"));
            path = path.substring(0, path.lastIndexOf("/") + 1);
            com.ComponentPath = path;
            path = path.substring(0, path.lastIndexOf("/"));
            path = path.substring(0, path.lastIndexOf("/") + 1);
            com.ComponentRootPath = path;
            path = path.substring(0, path.lastIndexOf("/"));
            path = path.substring(0, path.lastIndexOf("/") + 1);
            com.RootPath = path;
        },

        /**
         * 初始化需求组件
         * @param {String} path 组件路径
         * @param {Boolean} condition 是否已加载
         * @param {String} onload 加载完事件
         */
        InitRequire: function (path, condition, onload) {
            function load() {
                document.write('<script src="' + path + '" type="text/javascript"><\/script>');
                if (onload) {
                    document.write('<script type="text/javascript">' + onload + '<\/script>');
                }
            }
            if (condition || condition === null || condition === undefined) {
                load();
            }
            else {
                if (onload) {
                    document.write('<script type="text/javascript">' + onload + '<\/script>');
                }
            }
        },

        /**
         * 启动初始化数据
         * @param {String} url 需要识别的链接
         */
        Init: function (url) {
            // 识别EdboxArgs参数
            var data = module.GetQueryString("EdboxArgs", url);
            if (data) {
                module.DataSet.Set("EdboxArgs", data);
                history.pushState("Location Change", null, module.RemoveQueryString("EdboxArgs"));
            }

            // 设置默认语言及地区
            //             if (module.ServerKey === "US") {
            //                 module.Language = "English";
            //                 module.Area = "USA";
            //             }
            //             else if (module.ServerKey === "HK") {
            //                 module.Language = "TraditionalChinese";
            //                 module.Area = "HK";
            //             }
            //             else if (module.ServerKey === "TW") {
            //                 module.Language = "TraditionalChinese_TW";
            //                 module.Area = "TW";
            //             }
            //             else {
            //                 module.Language = "SimplifiedChinese";
            //                 module.Area = "CHN";
            //             }

            // 识别lan参数:语言(ch、en、hk)
            data = module.GetQueryString("lan", url);
            if (data) {
                if (data === "en" || data === "English") {
                    module.Language = "English";
                }
                else if (data === "hk" || data === "TraditionalChinese") {
                    module.Language = "TraditionalChinese";
                }
                else if (data === "tw" || data === "TraditionalChinese_TW") {
                    module.Language = "TraditionalChinese_TW";
                }
                else {
                    module.Language = "SimplifiedChinese";
                }
            }

            // 识别area参数:地区(中国：CHN，美国：USA， 香港：HK)
            data = module.GetQueryString("area", url);
            if (data) {
                if (data === "USA") {
                    module.Area = "USA";
                }
                else if (data === "HK") {
                    module.Area = "HK";
                }
                else if (data === "TW") {
                    module.Area = "TW";
                }
                else {
                    module.Area = "CHN";
                }
            } else {
                var appkey = module.GetQueryString("appkey", url);
                if (appkey) {
                    if (appkey === "US") {
                        module.Area = "USA";
                    }
                    if (appkey === "TW") {
                        module.Area = "TW";
                    }
                    if (appkey === "HK") {
                        module.Area = "HK";
                    }
                    if (appkey === "CN") {
                        module.Area = "CHN";
                    }
                }
            }

            // 识别EdboxArgs参数
            data = module.DataSet.Get("EdboxArgs");
            if (data) {
                var obj = JSON.parse(module.Decode(data));
                for (var item in obj) {
                    module[item] = obj[item];
                }
            }

            // 识别链接中数据
            // 识别channel参数:渠道, "Default"(默认), "Edbox", "Edbox_cn", "MingXingAPP", "HaoWenTi", "Conquer"
            data = module.GetQueryString("channel", url);
            if (data) {
                module.Channel = data;
            }

            // 识别account_type参数
            data = module.GetQueryString("account_type", url);
            if (data) {
                module.AccountType = data;
            }

            // 识别area参数
            data = module.GetQueryString("area", url);
            if (data) {
                module.Area = data;
            }

            // 识别lan参数
            data = module.GetQueryString("lan", url);
            if (data) {
                module.SetLanguage(data);
            }

            // 设置头像
            if (module.AccountId) {
                module.Avatar = module.Api.CS.GetAvatar(module.AccountId, 160);
            }

            var access = module.Access;

            // 识别t参数:Access_Mode 
            data = module.GetQueryString("t", url);
            if (data) {
                var list = data.split("_");
                try {
                    access = parseInt(list[0]);
                    module.Mode = parseInt(list[1]);
                    if (module.Mode === 5) {
                        module.Mode = 3;
                    }
                    if (module.Mode === 6) {
                        module.Mode = 4;
                    }
                    if (module.Mode === 7) {
                        module.Mode = 1;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            else {
                // 兼容代码，服务端调整完删除 
                // 识别page参数
                var page0 = module.GetQueryString("Page", url);
                if (page0) {
                    // 识别t参数:Access_Mode 
                    data = module.GetQueryString("t", page0);
                    if (data) {
                        var list0 = data.split("_");
                        try {
                            access = parseInt(list0[0]);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    module.Mode = 3;
                }
            }

            // 非编辑器模式、或没产品ID时使用game_id作为产品ID
            if (access !== 1 || module.Mode !== 3 || module.GameId.toString().trim().length < 1) {
                // 识别game_id参数
                data = module.GetQueryString("game_id", url);
                if (data) {
                    module.GameId = data;
                }

                // 识别v参数
                data = module.GetQueryString("v", url);
                if (data) {
                    module.Version = data;
                }

                module.Access = access;
            }

            // Page兼容代码
            if (!module.GameId || module.GameId.toString().trim().length < 1) {
                // 识别page参数
                var page = module.GetQueryString("Page", url);
                if (page) {
                    // 识别game_id参数
                    data = module.GetQueryString("game_id", page);
                    if (data) {
                        module.GameId = data;
                    }

                    // 识别v参数
                    data = module.GetQueryString("v", page);
                    if (data) {
                        module.Version = data;
                    }
                }
            }

            module.IsLogin = module.IsLogin || module.AccountId.toString().length > 0 && module.AccessToken.length > 0 && module.MacKey.length > 0;

            CheckUserInfo();
        }
    };

    // 初始化需求组件
    module.InitPath(module);

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(window, "Edbox"));