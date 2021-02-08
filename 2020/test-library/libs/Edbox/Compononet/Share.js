/**
 * Edbox第三方分享服务组件
 * 用于Edbox平台的数据埋点收集组件
 * @author 陈五洲(880123)
 * @version 0.0.1.0 (2019年08月08日 21:00:00)
 * @see 
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox第三方分享
 * */

(function (namespace, className) {

    // 微博AppKey
    var WeiboKey = "1671520477";

    // IM查询数据
    var _imData = {
        key: '',   // 关键字
        offset: 0, // 当前偏移量

        // 单次查询数据结果
        data: {
            offset: 0, // 查询的偏移量
            items: []  // 用户数据
        }
    };

    window.addEventListener('message', function (event) {
        var data = event.data;
        if (data.Type === 'getShareUrl') {
            Edbox.MMO.GetGameLink(Edbox.GameId, Edbox.Version, Edbox.Access, 2, function (url) {
                var sendData = {
                    Type: "refShareUrl",
                    Datas: url
                };

                event.source.postMessage(sendData, "*");
            });
        }
    }, false);


    // 分享页面高度
    offsetHeight = 584;

    function GetHost() {

        if (Edbox.ServerKey === "Dev" || Edbox.ServerKey === "QA") {
            return Edbox.Host.Login.Feature;
        }

        return Edbox.GetHost("Login");
    }

    function GetShareInfo(appid, success, error) {

        Edbox.Api.MMO.GetAppInfo(appid, function suc(data) {
            if (success) success(data);
        }, error);
    }

    // 获取Name字段满足的数据
    function GetInfoByKey(datas, name, key) {

        function getData(data) {
            if (!key) {
                return data;
            }
            else {
                if (data[key]) return data[key];
                return "";
            }
        }

        if (!datas) {
            return null;
        }

        if (datas.Name && datas.Name === name) {
            return getData(datas);
        }

        if (datas.Datas) {
            for (let index = 0; index < datas.Datas.length; index++) {
                var element = datas.Datas[index];
                var data = GetInfoByKey(element, name);
                if (data) {
                    return getData(data);
                }
            }
        }
        else {
            return null;
        }
    }


    function OpenShare(url, type, appid) {
        var a = document.createElement('a');
        a.id = "shared";
        // 将a的download属性设置为我们想要下载的图片名称      
        a.download = 'twitter';
        // 将生成的URL设置为a.href属性
        a.href = url + encodeURIComponent(Edbox.Protocol + "://" + GetHost() + "/edbox/share/" + type + "/" + appid + ".html");
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        // 触发a的单击事件
        a.click();
    }

    /**
    * 获取分享组件信息
     * @param {Function} callback 开启回调, 分享页面url
    */
    function GetShareArgs(callback) {

        Edbox.Resource.GetConfig("DatasConfig", function (data) {

            var shareData = data.StaticData.Share;

            // 是否开启
            var isopen = GetInfoByKey(data.StaticData.Share, "share_switch");
            if (!isopen) {
                isopen = false;
            }
            else {
                isopen = isopen.Value;
            }
            // 背景图
            var bg = GetInfoByKey(shareData, "share_bg", "GUID");
            // qr背景图
            var qrbg = GetInfoByKey(shareData, "share_qrbg", "GUID");
            // qr背景图
            var backImg = GetInfoByKey(shareData, "share_back", "GUID");

            var title = GetInfoByKey(shareData, "share_title");
            var save = GetInfoByKey(shareData, "share_save");
            var tip = GetInfoByKey(shareData, "share_tip");

            var mode = shareData.Height > shareData.Width ? 1 : 0;

            // 获取开启渠道
            var channels = GetInfoByKey(shareData, "share_type", "Key");

            var bgurl = "";
            var qrbgurl = "";
            var backurl = "";

            function sendDatas() {
                Edbox.MMO.GetGameLink(Edbox.GameId, Edbox.Version, Edbox.Access, 2, function (url) {
                    if (callback) {
                        var res = {
                            isopen: isopen,
                            width: shareData.Width,
                            height: shareData.Height,
                            bg: bgurl,
                            qrbg: qrbgurl,
                            backImg: backurl,
                            title: title,
                            save: save,
                            tip: tip,
                            channelLst: channels,
                            url: url,
                            mode: mode,
                            productname: Edbox.ServerInfo.app_name,
                            language: Edbox.Language,
                            access: Edbox.Access,
                            showqr: Edbox.Platform.IsIOS || Edbox.Platform.IsAndroid
                        };

                        callback(res);
                    }
                });
            }

            // 通过图片guid获取url
            Edbox.NDR.GetList([bg, qrbg, backImg], function (resDatas) {
                if (bg !== "") bgurl = resDatas[bg].Url;
                if (qrbg !== "") qrbgurl = resDatas[qrbg].Url;
                if (backImg !== "") backurl = resDatas[backImg].Url;

                sendDatas();
            }, function () {
                sendDatas();
            });

        });
    }

    function OpenWindow(shareUrl) {

        var iHeight = 400;
        var iWidth = 600;
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;

        window.open(shareUrl, "ShareGame", 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
    }

    /**
     * 获取用户好友列表
     * @param {String} key 查询关键字
     * @param {int} offset 查询偏移量
     * @param {int} pagesize 分页参数, 每页大小，默认值10，size最大不能超过50
     * @param {bool} reset 是否重置查询
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
    */
    function GetIMFriendsLst(key, offset, pagesize, reset, success, error) {

        var succ = function (dataObj) {

            var users = [];

            dataObj.items.forEach(function (item) {
                var user = new Object();
                user.uri = item.uri;
                user.iconUrl = Edbox.Api.CS.GetAvatar(item.uri, 80);
                users.push(user);
            });
            //解析dataObj,然后构建字符串数组
            var postData = "[";
            for (var i = 0; i < users.length; i++) {
                postData += "{\"user_id\":\"" + users[i].uri + "\"}";
                if (i < users.length - 1)
                    postData += ",";
            }
            postData += "]";
            var succDetail = function (dataObj) {
                dataObj.items.forEach(function (item) {
                    users.forEach(function (user) {
                        if (user.uri === item.user_id + '') {

                            if (_imData.data.items.length < pagesize &&
                                (_imData.key.length < 1 ||
                                    item.nick_name.indexOf(_imData.key) > -1)) {

                                user.nickname = item.nick_name;
                                _imData.data.items.push(user);
                            }
                        }
                    });
                });

                _imData.offset += dataObj.items.length;

                // 数据不为空且数据量不够 则递归查询
                if (dataObj.items.length !== 0 && _imData.data.items.length < pagesize) {
                    GetIMFriendsLst(key, _imData.offset, pagesize, false, success, error);
                }
                else {

                    _imData.data.offset = _imData.offset;

                    if (success) success(_imData.data);
                }
            };

            Edbox.Api.UC.GetIMFriendsDetail(postData, succDetail, error);
        };

        // 参数判断 
        pagesize = Math.min(pagesize, 50);

        if (_imData.key !== key) {
            _imData.key = key;
            _imData.offset = 0;

        }

        if (reset) {
            _imData.data.total = 0;
            _imData.data.items = [];
        }

        _imData.offset = offset;

        Edbox.Api.IM.GetIMFriendList(_imData.offset, pagesize, succ, error);
    }

    function fillArgs(url){
        var args = {
            appkey: Edbox.AppKey,
            lan: Edbox.Language,
            area: Edbox.Area
        };
	
        var newurl = url + "?edboxargs=" + Edbox.Encode(JSON.stringify(args));
        return newurl;
    }


    /**
     * 对外接口
     * */
    var module = {
        /**
        * FaceBook分享
        * @param {string} appid 参数对象
        */
        ShareFacebook: function (appid) {

            var url = "https://www.facebook.com/sharer.php?title=Edbox&u=";

            var targetUrl = Edbox.Protocol + "://" + GetHost() + "/edbox/share/" + "facebook" + "/" + appid + ".html";

            var shareUrl = url + encodeURIComponent(targetUrl); 

            shareUrl = fillArgs(shareUrl);

            OpenWindow(shareUrl);
        },

        /**
        * Twitter分享
         * @param {string} appid 参数对象
        */
        ShareTwitter: function (appid) {

            GetShareInfo(appid, function (appInfo) {
                var url = "https://twitter.com/share?text=" + encodeURIComponent(appInfo.app_name) + "&url=";

                var targetUrl = Edbox.Protocol + "://" + GetHost() + "/edbox/share/" + "twitter" + "/" + appid + ".html";

                var shareUrl = url + encodeURIComponent(targetUrl);

                shareUrl = fillArgs(shareUrl);

                OpenWindow(shareUrl);
            });

        },

        /**
        * Weibo分享
        * @param {string} appid 参数对象
        */
        ShareWeibo: function (appid) {

            GetShareInfo(appid, function (appInfo) {
                // 获取图片地址
                Edbox.Resource.GetImage(appInfo.icon, function (iconUrl) {

                    var targetUrl = Edbox.Protocol + "://" + GetHost() + "/edbox/share/" + "weibo" + "/" + appid + ".html";

                    var shareUrl = "https://service.weibo.com/share/share.php?appkey=" + encodeURIComponent(WeiboKey) + "&title=" + encodeURIComponent(Edbox.GetTip('QQ_SHARE_JOIN') + "《" + appInfo.app_name + "》") + "&url=" + encodeURIComponent(targetUrl);

                    OpenWindow(shareUrl);
                });

            }, function () {

            });
        },

        /**
        * QQ分享
        * @param {string} appid 参数对象
        */
        ShareQQ: function (appid) {
            GetShareInfo(appid, function (appInfo) {
                // 获取图片地址
                Edbox.Resource.GetImage(appInfo.icon, function (iconUrl) {
                    var targetUrl = Edbox.Protocol + "://" + GetHost() + "/edbox/share/" + "qq" + "/" + appid + ".html";
                    var shareUrl = "https://connect.qq.com/widget/shareqq/index.html?url=" + encodeURIComponent(targetUrl) + "&summary=" + encodeURIComponent(appInfo.introduction) + "&title=" + encodeURIComponent(appInfo.app_name) + "&desc=" + encodeURIComponent(Edbox.GetTip('QQ_SHARE_JOIN')) + "&pics=" + encodeURIComponent(iconUrl);
                    var a = 'height=540,width=720, top = ' + (window.screen.height - 540) / 2 + ', left = ' + (window.screen.width - 720) / 2 + ', toolbar=no,menubar=no,resizable=yes,location=yes,status=no';
                    window.open(shareUrl, "shareQQ", a);
                });

            });
        },

        // firend
        ShareIM: function () {

            var shareWindow = document.createElement("iframe");
            shareWindow.id = "shareIM";
            shareWindow.setAttribute("src", getUrl());
            shareWindow.style.width = "100%";
            shareWindow.style.height = "100%";
            shareWindow.style.overflow = "hidden";
            shareWindow.style.position = "fixed";
            shareWindow.style.top = "0";
            shareWindow.style.left = "0";
            shareWindow.style.height = "100%";
            shareWindow.style.width = "100%";
            shareWindow.style.margin = "0";
            shareWindow.style.padding = "0";
            shareWindow.style.border = "0";
            shareWindow.style.zIndex = "9999";
            //ShowDom.style.backgroundColor = "#000";
            window.onresize = function () {
                shareWindow.style.top = getPosTop();
            };

            window.addEventListener('message', function (event) {
                if (event.data === 'closeIM') {
                    $("#shareIM").remove();
                }
            }, false);

            document.body.appendChild(shareWindow);

            function getPosTop() {
                return Math.max(0, (top.window.innerHeight - 644) / 2 + top.pageYOffset) + "px";
            }

            function getUrl() {
                var url = Edbox.Protocol + "://" + Edbox.GetHost("Component") + "/coms/IM/index.html";
                var param = "?EdboxArgs=" + Edbox.DataSet.Get("EdboxArgs");

                url = url + param;

                return url;
            }

        },

        /**
         * 获取用户好友列表
         * @param {Object} data { 
         *                  {number} offset 当前偏移值, 
         *                  {number} pagesize  每页数量 默认10个, 最大不超过50
         *                  {String} key 关键字
         * } 
         * @param {Function} success 成功回调  data 用户数据
         *                                  {array} 用户数据
         *                                  {int} offset 偏移量
         *                      
         * @param {Function} error 出错回调
         */
        GetIMFriendsInfo: function (data, success, error) {
            var pagesize = data.pagesize ? data.pagesize : 10;
            pagesize = Math.min(pagesize, 50);

            GetIMFriendsLst(data.key, data.offset, pagesize, true, success, error);
        },


        /**
         * 分享游戏到IM
         * @param {Object} data {
         *                {String} appId 作品id
         *                {String} receiver 接收玩家ID
         *                {String} appName 产品名称
         *                {String} appDesc 产品简介
         *                {number} access 访问类型  1-模板 2-个人库 3-体验库
         *                {number} get_type 获取类型0-显示需求 1-试玩需求 2-分享需求  3-编辑 4-体验区游戏
         *                {String} version 版本
         *                {String} iconUrl 作品icon链接地址
         * }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ShareApp2IM: function (data, success, error) {

            var summary = Edbox.GetTip('IM_SHARE_SUMMARY');
            var iconalt = data.appName + Edbox.GetTip('IM_SHARE_ICONALT');
            //const iconUrl = "http://cs.101.com/v0.1/static/edu_product/esp/assets/dae98584-60b3-496d-a4b8-b94899f37b39.pkg/source/cover.png";
            var sharetbtntxt = Edbox.GetTip('IM_SHARE_JOIN');

            Edbox.Action.MMO.GetTryPlayingInfo(data.appId, data.access, data.get_type, data.version, function (appResInfo) {
                // 云图埋点
                Edbox.DataStatistic.ShareGame(data.appId, 'Friends');

                // 换行符替换
                //data.appDesc = data.appDesc.replace(/\n/g, "</span><br/><span>");
                data.appDesc = data.appDesc.replace(/\n/g, " ");

                // \ 替换
                data.appDesc = data.appDesc.replace(/\\/g, '\\\\');

                Edbox.MMO.CutString(data.appName, 20, "...", function (appName) {

                    Edbox.MMO.CutString(data.appDesc, 100, "...", function (appDesc) {
                        Edbox.Api.IM.SharePersonalApp(data.appId, data.receiver, summary, iconalt, data.iconUrl, appName, appDesc, sharetbtntxt, appResInfo.web_resid, success, error);

                    });
                });

                //Edbox.Api.IM.SharePersonalApp(data.appId, data.receiver, summary, iconalt, data.iconUrl, data.appName, data.appDesc, sharetbtntxt, appResInfo.web_resid, success, error);
            });
        },


        /**
         * 分享游戏到IM
         * @param {string} receiver 接收玩家ID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ShareAppToIM: function (receiver, success, error) {

            if (Edbox.Access === 1) {

                Edbox.MMO.GetTemplateInfo(Edbox.GameId, Edbox.Version, function (data) {
                    ShareTo(data.app_name, data.icon, data.introduction);
                });
            }
            else if (Edbox.Access === 2) {

                Edbox.MMO.GetProductInfo(Edbox.GameId, function (data) {
                    ShareTo(data.app_name, data.icon, data.introduction);

                });
            }
            else if (Edbox.Access === 3) {

                Edbox.MMO.GetAppInfo(Edbox.GameId, function (data) {
                    ShareTo(data.app_name, data.icon, data.introduction);
                });
            }

            function ShareTo(app_name, icon, introduction) {
                var data = {
                    appId: Edbox.GameId,
                    receiver: receiver,
                    appName: app_name,
                    access: Edbox.Access,
                    version: Edbox.Version,
                    iconUrl: icon,
                    appDesc: introduction,
                    get_type: 2
                };

                module.ShareApp2IM(data, success, error);
            }
        },

         /**
         * 打开分享页面
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
        */
        OpenShareUrl: function (success, error) {     

            function getPosTop(height){
                return 0;
            }

            // 生成分享页面链接
            function getUrl(){

                var url = Edbox.Protocol + "://" + Edbox.GetHost("Component") + "/coms/Share/index.html";
                var param = "?type=1";

                url = url + param;

                return url;
            }
            
            // 增加年龄判断
            Edbox.GetFunctionConfig(function(data){
                // 临时针对香港用户
                if (Edbox.AppKey !== 'HK' && data.LimitFunctions.indexOf("SHARE") >= 0 ){
                    if (error) error("age limit");
                    return;
                }

                GetShareArgs(function(res){

                    // 关闭退出
                    if (!res.isopen) {
                        if (error) error();
                        return;
                    }

                    mode = res.width > res.height ? 0 : 1;

                    var shareWindow = document.createElement("iframe");
                    shareWindow.id = "shareFrame";
                    shareWindow.setAttribute("src", getUrl(res));
                    shareWindow.setAttribute("allowTransparency", true);
                    shareWindow.style.width = window.innerWidth + "px";
                    shareWindow.style.height = window.innerHeight + "px";
                    shareWindow.style.overflow = "hidden";
                    shareWindow.style.position = "fixed";
                    shareWindow.style.top = getPosTop(res.height);
                    shareWindow.style.left = "0";
                    shareWindow.style.margin = "0";
                    shareWindow.style.padding = "0";
                    shareWindow.style.border = "0";
                    shareWindow.style.zIndex = "9999";
                    //ShowDom.style.backgroundColor = "#000";
                    window.onresize = function(){
                        shareWindow.style.top = getPosTop(res.height);  
                    };
        
                    document.body.appendChild(shareWindow);

                    shareWindow.onload = function(){
                        GetShareArgs(function(res){

                            // 发送消息
                            function Send(type, datas) {

                                if (!shareWindow) return;

                                var sendData = {
                                    Type: type,
                                    Datas: datas
                                };

                                obj = JSON.parse(JSON.stringify(sendData));
                                shareWindow.contentWindow.postMessage(obj, "*");
                            }

                            Send("refreshShare", res);

                            //Edbox.Message.Broadcast("refreshShare", res);
                        });
                    };

                    // 监听消息
                    window.addEventListener('message',function(event){
                        var data = event.data;
                        if (data.Type === 'closeShare') {
                            $("#shareFrame").remove();
                        }
                        else if (data.Type === 'initShare') {
                            //$("#shareFrame").remove();
                        }
                        else if (data.Type === "ShareTo") {

                            switch(data.Datas){
                                case "Weibo":
                                    module.ShareWeibo(Edbox.GameId);
                                    break;
                                case "QQ":
                                    module.ShareQQ(Edbox.GameId);
                                    break;
                                case "Facebook":
                                    module.ShareFacebook(Edbox.GameId);
                                    break;
                                case "Twitter":
                                    module.ShareTwitter(Edbox.GameId);
                                    break; 
                                case "IM":
                                    module.ShareIM();
                                    break;           
                            }
                        }
                    },false);

                    if (success) success();
                });
                
            }, function(err){
                if (error) error(err);
            });
        
        },


        /**
        * 获取可分享的渠道
        * @return {Array} 返回可分享的渠道信息
        */
        GetEnableShare: function () {
            if (Edbox.ServerKey === "US" || Edbox.ServerKey === "Beta") {
                return ['facebook', 'friend', 'twitter', 'link'];
            }
            else {
                return ['friend', 'qq', 'weibo', 'link'];
            }
        }

    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }

}(Edbox, "Share"));