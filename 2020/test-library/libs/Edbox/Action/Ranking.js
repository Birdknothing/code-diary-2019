// Edbox UC交互
(function (namespace, className) {
    var api = Edbox.Api.Ranking;

    /**
     * Edbox 排行榜
     * @author 陈彬舰(110181)
     * */
    var module = {
        /**
        * 新建排行榜
        * @param {String} GameId 游戏ID
        * @param {Object} param 属性
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
        */
        CreateRanking: function (GameId, param, success, error) {
            var data = new Object();
            data.app_id = GameId;
            for (var i in param) {
                data[i] = param[i];
            }
            api.SaveConfig(data, success, error);
        },
        /**
         * 设置排行榜信息
         * @param {String} GameId 游戏ID
         * @param {Object} id 排行榜id
         * @param {Object} param 属性
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        RefreshRanking: function (GameId, id, param, success, error) {
            var data = new Object();
            data.app_id = GameId;
            data.id = id;
            for (var i in param) {
                data[i] = param[i];
            }
            api.SaveConfig(data, success, error);
        },
        /**
         * 发布排行榜配置信息
         * @param {String} GameId 游戏ID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ReleaseConfig: function (GameId, success, error) {
            api.ReleaseConfig(GameId, Edbox.Version, success, error);
        },
        /**
         * 获取排行榜配置信息列表（编辑库）
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetEditConfigList: function (success, error) {
            api.GetConfigList(Edbox.GameId, 1, success, error);
        },
        /**
         * 获取排行榜配置信息列表（发布库）
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetReleaseConfigList: function (success, error) {
            api.GetConfigList(Edbox.GameId, 2, success, error);
        },
        /**
        * 删除排行榜配置
        * @param {String} id 排行榜id
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
        */
        DeleteConfig: function (id, success, error) {
            api.DeleteConfig(id, success, error);
        },
        /**
         * 保存玩家分数
         * @param {String} GameId 游戏ID
         * @param {String} ids 排行榜id 多个用逗号隔开 例如：23,24,12
         * @param {Number} score 玩家获得的分数
         * @param {Number} scoreInfo 分数拓展信息
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SaveScore: function (GameId, ids, score, scoreInfo, success, error) {
            var data = new Object();
            data.app_id = GameId;
            data.ids = ids;
            data.score = score;
            data.score_info = scoreInfo;
            api.SaveScore(data, success, error);
        },
        /**
        * 获取排行榜列表信息
        * @param {String} id 排行榜id
        * @param {Number} page 第N页 默认值1 
        * @param {Number} size 每页大小 默认值20 不超过100 
        * @param {Number} history_long 历史数据 0/1 
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
        */
        GetList: function (id, page, size, history_long, success, error) {
            var url = "/v0.1/api/rank/rank/actions/get_list";
            var data = new Object();
            data.id = id;
            data.page = page;
            data.size = size;
            data.history_long = history_long;
            api.GetList(data, success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Action, "Ranking"));