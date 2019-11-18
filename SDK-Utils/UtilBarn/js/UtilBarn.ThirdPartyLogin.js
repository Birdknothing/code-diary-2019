// 单点登录方法
(function (namespace, className) {
    /**
     * 单点登录方法，为游戏URL带登录信息
     * @param {String} url 游戏链接
     * @param {String} access_token AccessToken
     * @param {String} mac_key MacKey
     * @param {String} server_time UC服务器时间
     * @param {String} user_id UC用户ID
     * @param {String} sdp_app_id SDPAppId
     * @returns {String} 带登录信息的游戏URL
     */
    var module = function (url, access_token, mac_key, server_time, user_id, sdp_app_id) {
        namespace.IsLogin = true;
        // UC的用户id
        namespace.AccountId = user_id;
        // UC的用户Token
        namespace.AccessToken = access_token;
        // UC的用户秘钥
        namespace.MacKey = mac_key;
        // UC服务器时间
        if (server_time) {
            var str = server_time;
            var timeStr = str.replace(/-/g, "/").replace(/T/g, " ");
            timeStr = timeStr.substring(0, str.length - 9) + timeStr.substring(str.length - 5, str.length);
            namespace.TimeStamp = new Date().getTime() - new Date(timeStr).getTime();
            namespace.TimeStamp = Math.round(namespace.TimeStamp);
        }
        namespace.SDPAppId = sdp_app_id;
        return namespace.SetQueryString("UtilBarnArgs", namespace.GetLoginInfo(), url);
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "GetURLWithLoginInfo"));