// UtilBarn IM 接口
(function (namespace, className) {

    /**
   * 分享作品
   * @param {String} appid 作品id
   * @return {string} url 返回生成的链接地址
   */
    function MakeShareUrl(appid) {
        var url = 'http://' + UtilBarn.GetHost("Lobby") + "/?channel=Default#/Detail/" + appid;

        return url;
    }

    var module = {
        /**
        * 分享作品
        * @param {String} appid 作品id
        * @param {String} receiveid 分享目标
        * @param {String} summary 分享标题 “【UtilBarn】邀请通知”
        * @param {String} iconalt 图标alt "XXX游戏宣传"
        * @param {String} shareicon 分享游戏图标地址
        * @param {String} sharetitle 分享标题 (作品名称)
        * @param {String} sharecontent 分享内容 "哇哇，你的好友邀请你一起玩游戏啦！快来陪他/她一起玩吧"
        * @param {String} sharetbtntxt 分享的显示按钮文字
        * @param {String} shareurl 分享的游戏地址
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
        */
        SharePersonalApp: function (appid, receiveid, summary, iconalt, shareicon, sharetitle, sharecontent, sharetbtntxt, shareurl, success, error) {
            var subUrl = "/v0.2/api/agents/messages";
            var arg = '["' + UtilBarn.AccountId + '", "' + receiveid + '"]';
            
            var json = "{\"filter\":[{\"name\": \"p2p\", \"args\": {\"p2p_uri\": [" + arg + "]}}],\"body\":{\"content\":\"Content-Type:box/xml\\r\\n\\r\\n<box data-summary=\\\"" + summary + "\\\">" + "<div class=\\\"row\\\"> <div class=\\\"col-2\\\" data-href=\\\"http://com.nd.social.me/me_HomePage?uid=1223\\\">  <img src=\\\"" + shareicon + "\\\" class=\\\"img-square\\\" mime=\\\"jpeg\\\" width=\\\"240px\\\" height=\\\"320px\\\" size=\\\"1201024\\\" alt=\\\"" + iconalt + "\\\"/> </div> <div class=\\\"col-4\\\"> <span>" + sharetitle + "</span>" + "<br/>" + "<span>" + sharecontent + "</span>     </div>   </div>   <hr/>   <div class=\\\"row\\\">     <div class=\\\"col-1\\\"></div>     <div class=\\\"col-2\\\">       <button class=\\\"btn-default\\\" data-href=\\\"" + shareurl + "\\\">" + sharetbtntxt + "</button>     </div>    <div class=\\\"col-1\\\"></div>  <div class=\\\"col-2\\\"></div>  </div> </box>\", \"flag\": 0, \"hide_sender\": 0 }, 	\"sender\": 123456, \"send_msg_sync\": 0 }";
            UtilBarn.Request.PostWithHeader(UtilBarn.GetHost("IMMsg"), subUrl, json, null, success, error, "https");
        },

        /**
         * 获取用户好友列表
         * @param {number} offset 开始位置 默认0，参数不合法则使用默认值
         * @param {number} limit 获取记录数量
         * @param {Function} success 成功回调 默认值20, 最大值200，参数不合法则使用默认值
         * @param {Function} error 出错回调
         */
        GetIMFriendList: function (offset, limit, success, error) {
            var subUrl = "/v0.1/friends?" + "$offset=" + offset + "&$limit=" + limit;

            UtilBarn.Request.Get(UtilBarn.GetHost("IM"), subUrl, null, success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn.Api, "IM"));