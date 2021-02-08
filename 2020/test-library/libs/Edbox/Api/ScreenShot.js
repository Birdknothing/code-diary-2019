(function (namespace, className) {
    var module = {
        /**
         * 新增作品截图记录
         * @param {Array} records 要保存图片的数组 必填
         *                 [{ 
         *                      {String} resid 存到ndr的资源id 必填
         *                      {String} burying_point 埋点id，手动截图传manual 必填
         *                 }] 
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {string} app_id 作品的id，如果已经保存过可以传作品id，如果没有就留空
         * @param {string} user_id 玩家id
         */
        AddScreenshots: function (records, success, error, app_id, user_id) {
            var url = "/v1.0/api/product/personal/actions/add_screenshots";
            var datas = {
                records: records,
                app_id: app_id,
                user_id: user_id
            };
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(datas), success, error);
        },

        /**
         * 获取截图列表记录
         * @param {string} burying_point 埋点id
         * @param {string} page 页数
         * @param {string} size 返回多少条记录，默认返回最近编辑的10条记录
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {string} app_id 作品id，如果有可以传
         * @param {string} user_id 玩家id
         */
        GetList: function (burying_point, page, size, success, error, app_id, user_id) {
            var url = "/v1.0/api/product/personal/actions/get_screenshot_list";
            var datas = {
                burying_point: burying_point,
                page: page,
                size: size,
                app_id: app_id,
                user_id: user_id
            };
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(datas), success, error);
        },

        /**
         * 删除截图记录
         * @param {string} app_id 作品ID 必填
         * @param {Array} records 要删除的截图集合 必填
         *                 [{ 
         *                      {String} resid 存到ndr的资源id 必填
         *                      {String} burying_point 埋点id，手动截图传manual 必填
         *                 }] 
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {string} user_id 玩家id
         */
        DeleteScreenShots: function (app_id, records, success, error, user_id) {
            var url = "/v1.0/api/product/personal/actions/delete_screenshots";
            var datas = {
                records: records,
                app_id: app_id,
                user_id: user_id
            };
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(datas), success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Api, "ScreenShot"));