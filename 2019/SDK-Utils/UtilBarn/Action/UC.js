// UtilBarn UC交互
(function (namespace, className) {
    var api = UtilBarn.Api.UC;

    /**
     * UtilBarn UC交互
     * @author 温荣泉(201901)
     * */
    var module = {
        /**
         * 获取用户信息
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetUserInfo: function (success, error) {
            api.GetUserInfo(UtilBarn.AccountId, function (data) {
                var info = new Object();
                info.ID = data.user_id;
                info.Name = data.nick_name;
                info.Type = data.source_plat;
                info.OrgID = "";
                info.OrgName = "";

                if (data.org_exinfo) {
                    info.OrgID = data.org_exinfo.org_id;
                    info.OrgName = data.org_exinfo.org_name;
                }
                if (success) success(info);
            }, error);
        },

        /**
         * 有效性检查
         * @param {String} uid 用户ID
         * @param {String} auth 用户授权信息
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ValidCheck: function (uid, auth, success, error) {
            var reg = new RegExp("MAC id=\"([^\"]*)\",nonce=\"([^\"]*)\",mac=\"([^\"]*)\"");
            var result = auth.match(reg);
            var access_token = result[1];
            var mac = result[3];
            var nonce = result[2];
            var http_method = "Get";
            var request_uri = "/";
            var host = window.location.host;
            api.ValidCheck(access_token, mac, nonce, http_method, request_uri, host, function (data) {
                var info = new Object();
                // UC的用户id
                info.AccountId = data.user_id;
                // UC的用户Token
                info.AccessToken = data.access_token;
                // UC的用户秘钥
                info.MacKey = data.mac_key;
                // UC服务器时间
                if (data.server_time) {
                    var str = data.server_time;
                    var timeStr = str.replace(/-/g, "/").replace(/T/g, " ");
                    timeStr = timeStr.substring(0, str.length - 9) + timeStr.substring(str.length - 5, str.length);
                    info.TimeStamp = new Date().getTime() - new Date(timeStr).getTime();
                    info.TimeStamp = Math.round(info.TimeStamp);
                }

                // 设置头像
                if (info.AccountId) {
                    info.Avatar = UtilBarn.Api.CS.GetAvatar(info.AccountId, 160);
                }

                if (success) success(info);
            }, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn.Action, "UC"));