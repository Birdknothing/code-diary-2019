// Edbox UC 接口
(function (namespace, className) {
    /**
     * Edbox UC服务端接口v0.93
     * 用于Edbox平台的访问UC服务端接口
     * @author 温荣泉(201901)
     * @see 服务端接口 http://wiki.doc.101.com/index.php?title=UC_API_RestfulV0.93
     * */
    var module = {
        /**
         * 获取用户好友详细信息
         * @param {String} userArray [ {"user_id":"100212"}]
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetIMFriendsDetail: function (userArray, success, error) {
            var subUrl = "/v0.93/users/actions/query?realm=edbox";
            Edbox.Request.PostWithHeader(Edbox.GetHost("UC"), subUrl, userArray, null, success, error, "https");
        },

        /**
         * 设置用户昵称
         * @param {String} userid 用户ID
         * @param {String} nickName 用户昵称
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SetUserNickName: function (userid, nickName, success, error) {
            var subUrl = "/v0.93/users/" + userid;
            var data = new Object();
            data.nick_name = nickName;
            Edbox.Request.PatchWithHeader(Edbox.GetHost("UC"), subUrl, JSON.stringify(data), "", success, error, "https");
        },

        /**
         * 获取用户信息
         * @param {String} userid 用户ID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetUserInfo: function (userid, success, error) {
            var subUrl = "/v0.93/users/" + userid;
            Edbox.Request.GetWithHeader(Edbox.GetHost("UC"), subUrl, null, null, success, error, "https");
        },

        /**
         * 获取组织信息
         * @param {String} org_id 组织ID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetOrganizationInfo: function (org_id, success, error) {
            var subUrl = "/v0.93/organizations/" + org_id;
            Edbox.Request.GetWithHeader(Edbox.GetHost("UC"), subUrl, null, null, success, error, "https");
        },

        /**
         * 有效性检查
         * @param {String} access_token 授权Token
         * @param {String} mac 签名值
         * @param {String} nonce 时间戳(到毫秒) + ":" + 随机码
         * @param {String} http_method http请求方法名称
         * @param {String} request_uri 请求的URI
         * @param {String} host Header中的HOST
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ValidCheck: function (access_token, mac, nonce, http_method, request_uri, host, success, error) {
            var subUrl = "/v0.93/tokens/" + access_token + "/actions/valid";
            var data = {
                "mac": mac, // 签名值
                "nonce": nonce, // 时间戳(到毫秒) + ":" + 随机码
                "http_method": http_method.toUpperCase(),// http请求方法名称
                "request_uri": request_uri,// 请求的URI
                "host": host // Header中的HOST
            };
            Edbox.Request.PostWithoutHeader(Edbox.GetHost("UC"), subUrl, JSON.stringify(data), success, error, "https");
        },

        /**
         * 退出当前用户
         * @param {String} access_token 授权Token
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        Logout: function (access_token, success, error) {
            var subUrl = "/v0.93/tokens/" + access_token;
            Edbox.Request.DeleteWithHeader(Edbox.GetHost("UC"), subUrl, null, null, success, error, "https");
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Api, "UC"));