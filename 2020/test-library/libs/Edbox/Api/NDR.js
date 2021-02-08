// Edbox NDR 接口
(function (namespace, className) {
    var protocol = 'https';
    /**
     * Edbox NDR 接口
     */
    var module = {
        /**
         * 请求资源
         * @param {String} guid 资源GUID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
        */
        Get: function (guid, success, error) {
            var url = '/v0.6/assets/' + guid;
            var data = "include=TI";
            return Edbox.Request.GetWithoutHeader(Edbox.GetHost("NDR"), url, data, success, error, protocol);
        },

        /**
         * 请求资源列表
         * @param {Array} array 资源GUID列表
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        GetList: function (array, success, error) {
            var url = '/v0.6/assets/list';
            var data = "include=TI";

            for (var i = 0; i < array.length; i++) {
                var key = array[i];
                if (key) {
                    data += "&rid=" + key;
                }
            }

            return Edbox.Request.GetWithoutHeader(Edbox.GetHost("NDR"), url, data, success, error, protocol);
        },

        /**
         * 请求NDR上传Session
         * @param {String} userid 用户ID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        GetSession: function (userid, success, error) {
            var url = "/v0.6/assets/none/uploadurl";
            var data = "uid=" + userid + "&renew=false&coverage=App/cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0/OWNER";
            return Edbox.Request.GetWithProtocol(Edbox.GetHost("NDR"), url, data, success, error, protocol);
        },

        /**
         * 请求NDR上传Session，为个人组织
         * @param {String} userid 用户id
         * @param {String} guid 资源id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        GetSessionSelfCoverage: function (userid, guid, success, error) {
            var url = "/v0.6/assets/" + guid + "/uploadurl";
            var data = "uid=" + userid + "&renew=false&coverage=User/" + userid;
            return Edbox.Request.GetWithProtocol(Edbox.GetHost("NDR"), url, data, success, error, protocol);
        },

        /**
         * 请求NDR上传Session(更新)
         * @param {String} userid 用户ID
         * @param {String} guid 资源ID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        GetUpdateSession: function (userid, guid,  success, error) {
            var url = "/v0.6/assets/" + guid + "/uploadurl";
            var data = "uid=" + userid + "&renew=true&coverage=Org/nd/";
            return Edbox.Request.GetWithProtocol(Edbox.GetHost("NDR"), url, data, success, error, protocol);
        },

        /**
         * 请求NDR上传Session(更新)
         * @param {String} userid 用户ID
         * @param {String} guid 资源ID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        GetUpdateSession: function (userid, guid,  success, error) {
            var url = "/v0.6/assets/" + guid + "/uploadurl";
            var data = "uid=" + userid + "&renew=true&coverage=Org/nd/";
            return Edbox.Request.GetWithProtocol(Edbox.GetHost("NDR"), url, data, success, error, protocol);
        },

        /**
         * 上传到NDR
         * @param {String} guid 资源GUID
         * @param {Object} data 资源数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        Post: function (guid, data, success, error) {
            var url = '/v0.6/assets/' + guid;
            return Edbox.Request.Post(Edbox.GetHost("NDR"), url, JSON.stringify(data), success, error, protocol);
        },

        /**
         * 更新到NDR
         * @param {String} guid 资源GUID
         * @param {Object} data 资源数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        Update: function (guid, data, success, error) {
            var url = '/v0.6/assets/' + guid;
            return Edbox.Request.Put(Edbox.GetHost("NDR"), url, JSON.stringify(data), success, error, protocol);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Api, "NDR"));