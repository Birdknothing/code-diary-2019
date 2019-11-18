/**
 * UtilBarn第三方分享服务组件
 * 用于UtilBarn平台的数据埋点收集组件
 * @author 陈五洲(880123)
 * @version 0.0.1.0 (2019年08月08日 21:00:00)
 * @see 
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn第三方分享
 * */

(function (namespace, className) {

    // 微博AppKey
    var WeiboKey = "1671520477";

     // IM查询数据
     var _imData = {
        key : '',   // 关键字
        offset : 0, // 当前偏移量

        // 单次查询数据结果
        data : {
            offset : 0, // 查询的偏移量
            items : []  // 用户数据
        }
    };


    // 分享页面高度
    offsetHeight = 584;

    function GetHost (){

        if (UtilBarn.ServerKey === "Dev" || UtilBarn.ServerKey === "QA"){
            return UtilBarn.Host.Login.Feature;
        }

        return UtilBarn.GetHost("Login");
    }

    GetShareInfo = function (appid, success, error){
  
        UtilBarn.Api.MMO.GetAppInfo(appid, function suc(data){
            if (success) success(data);
        }, error);

    };

    // 获取Name字段满足的数据
    function GetInfoByKey (datas, key){

        if (!datas){
            return null;
        }

        if (datas.Name && datas.Name === key){
            return datas;
        }

        if (datas.Datas){
            for (var index = 0; index < datas.Datas.length; index++) {
                var element = datas.Datas[index];
                var data = GetInfoByKey(element, key);

                if (data){
                    return data;
               }       
            }
        }

        return null;
    }

    function OpenShare (url, type, appid){ 
        var a = document.createElement('a');
        a.id = "shared";
        // 将a的download属性设置为我们想要下载的图片名称      
        a.download = 'twitter';
        // 将生成的URL设置为a.href属性
        a.href = url + encodeURIComponent(UtilBarn.Protocol + "://" + GetHost() + "/UtilBarn/share/" + type + "/" + appid +".html");
        a.target="_blank";
        a.rel="noopener noreferrer";
        // 触发a的单击事件
        a.click();      
    }

    function OpenWindow (shareUrl){
        
        var iHeight = 400;
        var iWidth = 600;
        var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
        var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;

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
   function GetIMFriendsLst (key, offset, pagesize, reset, success, error) {
        
        var succ = function (dataObj) {

            var users = [];

            dataObj.items.forEach(function (item) {
                var user = new Object();
                user.uri = item.uri;
                user.iconUrl = UtilBarn.Api.CS.GetAvatar(item.uri, 80);
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
                        if (user.uri === item.user_id + '' ) {
                            
                            if (_imData.data.items.length < pagesize && 
                                (_imData.key.length < 1 ||
                                item.nick_name.indexOf(_imData.key) > -1)){

                                user.nickname = item.nick_name;
                                _imData.data.items.push(user);
                            }
                        }
                    });
                });

                _imData.offset += dataObj.items.length;

                // 数据不为空且数据量不够 则递归查询
                if (dataObj.items.length !== 0 && _imData.data.items.length < pagesize){
                    GetIMFriendsLst(key, _imData.offset, pagesize, false, success, error);
                }
                else{

                    _imData.data.offset = _imData.offset;

                    if (success) success(_imData.data); 
                } 
            };
            
            UtilBarn.Api.UC.GetIMFriendsDetail(postData, succDetail, error);
        };

        // 参数判断 
        pagesize = Math.min(pagesize, 50);

        if (_imData.key !== key){
            _imData.key = key;
            _imData.offset = 0;
            
        }

        if (reset){
            _imData.data.total = 0;
            _imData.data.items = [];
        }

        _imData.offset = offset;

        UtilBarn.Api.IM.GetIMFriendList(_imData.offset, pagesize, succ, error);
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

            var url = "https://www.facebook.com/sharer.php?title=UtilBarn&u=";

            var targetUrl = UtilBarn.Protocol + "://" + GetHost() + "/UtilBarn/share/" + "facebook" + "/" + appid +".html";

            var shareUrl = url + encodeURIComponent(targetUrl);

            OpenWindow(shareUrl);
        },

        /**
        * Twitter分享
         * @param {string} appid 参数对象
        */
        ShareTwitter: function (appid) {

            GetShareInfo(appid, function(appInfo){
                var url = "https://twitter.com/share?text=" + encodeURIComponent(appInfo.app_name) + "&url=";

                var targetUrl = UtilBarn.Protocol + "://" + GetHost() + "/UtilBarn/share/" + "twitter" + "/" + appid +".html";

                var shareUrl = url + encodeURIComponent(targetUrl);

                OpenWindow(shareUrl);
            });

        },
 
        /**
        * Weibo分享
        * @param {string} appid 参数对象
        */
        ShareWeibo: function (appid) {
       
            GetShareInfo(appid, function(appInfo){
                // 获取图片地址
                UtilBarn.Resource.GetImage(appInfo.icon, function(iconUrl){

                    var targetUrl = UtilBarn.Protocol + "://" + GetHost() + "/UtilBarn/share/" + "weibo" + "/" + appid +".html";
 
                    var shareUrl = "http://service.weibo.com/share/share.php?appkey=" + encodeURIComponent(WeiboKey) + "&title=" + encodeURIComponent(UtilBarn.GetTip('QQ_SHARE_JOIN') + "《" + appInfo.app_name + "》") + "&url=" + encodeURIComponent(targetUrl);
                
                    OpenWindow(shareUrl);
                });
           
            }, function(){

            });
            
       },

        /**
        * QQ分享
        * @param {string} appid 参数对象
        */
       ShareQQ: function (appid) {
            GetShareInfo(appid, function(appInfo){
                // 获取图片地址
                UtilBarn.Resource.GetImage(appInfo.icon, function(iconUrl){
                    var targetUrl = UtilBarn.Protocol + "://" + GetHost() + "/UtilBarn/share/" + "qq" + "/" + appid +".html";
                    var shareUrl = "https://connect.qq.com/widget/shareqq/index.html?url=" + encodeURIComponent(targetUrl) + "&summary=" +  encodeURIComponent(appInfo.introduction) + "&title=" + encodeURIComponent(appInfo.app_name)  + "&desc=" +  encodeURIComponent(UtilBarn.GetTip('QQ_SHARE_JOIN')) + "&pics=" + encodeURIComponent(iconUrl);
                    var a = 'height=540,width=720, top = ' + (window.screen.height - 540) / 2 + ', left = ' + (window.screen.width - 720) / 2 + ', toolbar=no,menubar=no,resizable=yes,location=yes,status=no';
                    window.open (shareUrl , "shareQQ", a);
                });
        
            });
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

            var summary = UtilBarn.GetTip('IM_SHARE_SUMMARY');
            var iconalt = data.appName + UtilBarn.GetTip('IM_SHARE_ICONALT');
            //const iconUrl = "http://cs.101.com/v0.1/static/edu_product/esp/assets/dae98584-60b3-496d-a4b8-b94899f37b39.pkg/source/cover.png";
            var sharetbtntxt = UtilBarn.GetTip('IM_SHARE_JOIN');

            UtilBarn.Api.MMO.GetTryPlayingInfo(data.appId, data.access, data.get_type, data.version, function (appResInfo) {
                // 云图埋点
                UtilBarn.DataStatistic.ShareGame(data.appId, 'Friends');

                // 换行符替换
                //data.appDesc = data.appDesc.replace(/\n/g, "</span><br/><span>");
                data.appDesc = data.appDesc.replace(/\n/g, " ");

                // \ 替换
                data.appDesc = data.appDesc.replace(/\\/g, '\\\\');

                UtilBarn.MMO.CutString(data.appName, 20, "...", function(appName){

                    UtilBarn.MMO.CutString(data.appDesc, 100, "...", function(appDesc){
                        UtilBarn.Api.IM.SharePersonalApp(data.appId, data.receiver, summary, iconalt, data.iconUrl, appName, appDesc, sharetbtntxt, appResInfo.web_resid, success, error);
                        
                    });
                });

                //UtilBarn.Api.IM.SharePersonalApp(data.appId, data.receiver, summary, iconalt, data.iconUrl, data.appName, data.appDesc, sharetbtntxt, appResInfo.web_resid, success, error);
            });

        },


        /**
         * 分享游戏到IM
         * @param {string} receiver 接收玩家ID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ShareAppToIM: function (receiver, success, error) {

            if (UtilBarn.Access === 1){

                UtilBarn.MMO.GetTemplateInfo(UtilBarn.GameId, UtilBarn.Version, function(data){		
                    ShareTo(data.app_name, 	data.icon, data.introduction);				
                });	
            }
            else if (UtilBarn.Access === 2){

                UtilBarn.MMO.GetProductInfo(UtilBarn.GameId, function(data){
                    ShareTo(data.app_name, data.icon, data.introduction);	

                });	
            }
            else if (UtilBarn.Access === 3){

                UtilBarn.MMO.GetAppInfo(UtilBarn.GameId, function(data){
                    ShareTo(data.app_name, data.icon, data.introduction);	
                });	
            }

            function ShareTo(app_name, icon, introduction){
                var data = {
                    appId: UtilBarn.GameId,
                    receiver: receiver,
                    appName: app_name,
                    access: UtilBarn.Access,
                    version: UtilBarn.Version,
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

            module.GetShareArgs(function(res){

                // 关闭退出
                if (!res.isopen) {
                    if (error) error();
                    return;
                }

                var shareWindow = document.createElement("iframe");
                shareWindow.id = "shareFrame";
                shareWindow.setAttribute("src", getUrl(res));
                shareWindow.setAttribute("allowTransparency", true);
                shareWindow.style.width = "100%";
                shareWindow.style.height = "100%";
                shareWindow.style.overflow = "hidden";
                shareWindow.style.position = "fixed";
                shareWindow.style.top = getPosTop();
                shareWindow.style.left = "0";
                shareWindow.style.height = "100%";
                shareWindow.style.width = "100%";
                shareWindow.style.margin = "0";
                shareWindow.style.padding = "0";
                shareWindow.style.border = "0";
                shareWindow.style.zIndex = "9999";
                //ShowDom.style.backgroundColor = "#000";
                window.onresize = function(){
                    shareWindow.style.top = getPosTop();  
                };
    
                document.body.appendChild(shareWindow);

                window.addEventListener('message',function(event){
                    if (event.data === 'closeShare') {
                        $("#shareFrame").remove();
                    }
                },false);

                if (success) success();
            });
            

            function getPosTop()
            {
                //return Math.max(0, (top.window.innerHeight - offsetHeight) / 2 + top.pageYOffset) + "px";
                return 0;
            }
            
            // 生成分享页面链接
            function getUrl(data){
                
                var url = UtilBarn.Protocol + "://" + UtilBarn.GetHost("Component") + "/coms/Share/index.html";

                var param = "?share=" + encodeURIComponent(data.channelLst) + "&type=1"+ "&bg=" + encodeURIComponent(data.bg) + "&qrbg=" + encodeURIComponent(data.qrbg) + "&UtilBarnArgs=" + UtilBarn.DataSet.Get("UtilBarnArgs");

                url = url + param;

                return url;

            }
       },

        /**
         * 获取分享组件信息
          * @param {Function} callback 开启回调, 分享页面url
        */
       GetShareArgs: function (callback) {

            UtilBarn.Resource.GetConfig("DatasConfig", function (data) {

                // 是否开启
                var isopen = GetInfoByKey(data.StaticData.Share, "share_switch");
                if (!isopen){
                    isopen = false;
                }
                else{
                    isopen = isopen.Value;
                }

                // 背景图
                var bg = GetInfoByKey(data.StaticData.Share, "share_bg");
                if (!bg){
                    bg = "";
                }
                else{
                    bg = bg.GUID;
                }

                // qr背景图
                var qrbg = GetInfoByKey(data.StaticData.Share, "share_qrbg");
                if (!qrbg){
                    qrbg = "";
                }
                else{
                    qrbg = qrbg.GUID;
                }

                // 获取开启渠道
                var channelLst = GetInfoByKey(data.StaticData.Share, "share_type");
                if (channelLst && channelLst.Key){
                    channelLst = channelLst.Key.join("_");
                }
                else{
                    channelLst = "";
                }

                if (callback){
                    var res = {
                        isopen: isopen,
                        bg: bg,
                        qrbg: qrbg,
                        channelLst: channelLst
                    };

                    callback(res);
                }

            });     
        }

    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }

}(UtilBarn, "Share"));