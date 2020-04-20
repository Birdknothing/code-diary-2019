(function (namespace, className) {
    /**
     * 用于Edbox排行榜组件的接口
     * @author 陈彬舰(110181)
     * @see 服务端接口 http://ndsdn.nd.com.cn/index.php?title=%E6%8E%92%E8%A1%8C%E6%A6%9C-%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3
     * */
    var module = {
        /**
         * 排行榜配置设置
         * @param {Object} params 请求参数
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SaveConfig: function (params, success, error) {
            var url = "/v0.1/api/rank/rank/actions/save_config";
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(params), success, error);
        },
        /**
         * 发布排行榜配置信息
         * @param {String} app_id 作品id
         * @param {String} version 作品版本
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ReleaseConfig: function (app_id, version, success, error) {
            var url = "/v0.1/api/rank/rank/actions/release_config";
            var data = new Object();
            data.app_id = app_id;
            data.version = version;
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        },
        /**
         * 获取排行榜配置信息列表
         * @param {String} app_id 作品id
         * @param {String} access_type 1-编辑库 2-发布库
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetConfigList: function (app_id, access_type, success, error) {
            var url = "/v0.1/api/rank/rank/actions/get_config_list";
            var data = "app_id=" + app_id + "&access_type=" + access_type;
            Edbox.Request.Get(Edbox.GetHost('MMO'), url, data, success, error);
        },
        /**
         * 删除排行榜配置
         * @param {String} id 排行榜id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        DeleteConfig: function (id, success, error) {
            var url = "/v0.1/api/rank/rank/actions/delete_config";
            var data = new Object();
            data.id = id;
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        },
        /**
         * 保存玩家分数
         * @param {Object} params 请求参数
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SaveScore: function (params, success, error) {
            var url = "/v0.1/api/rank/rank/actions/save_score";
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(params), success, error);
        },
        /**
         * 获取排行榜列表信息
         * @param {Object} params 请求参数
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetList: function (params, success, error) {
            var url = "/v0.1/api/rank/rank/actions/get_list";
            var data = "id=" + params.id;
            if (params.page) {
                data += "&page=" + params.page;
            }
            if (params.size) {
                data += "&size=" + params.size;
            }
            if (params.history_long) {
                data += "&history_long=" + params.history_long;
            }
            Edbox.Request.Get(Edbox.GetHost('MMO'), url, data, success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Api, "Ranking"));