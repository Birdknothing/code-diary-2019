
(function (namespace, className) {
    var module = {
        /**
         * 新增作品草稿记录
         * @param {String} baseid 模板id 必填
         * @param {String} resid 保存的资源id 必填
         * @param {String} version 版本号
         * @param {String} extInfo 草稿额外属性
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {String} user_id 玩家id
         * @param {String} app_id 作品的id，如果已经保存过可以传作品id，如果没有就留空
         * @param {String} name 作品名称，用于区分草稿
         */
        AddDraft: function (baseid, resid, version, extInfo, success, error, user_id, app_id, name) {
            var url = '/v1.0/api/product/personal/actions/add_draft';
            var data = {
                user_id: user_id,
                baseid: baseid,
                resid: resid,
                app_id: app_id,
                name: name,
                extInfo: extInfo,
                version: version
            };
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        },
        /**
         * 获取最近草稿记录
         * @param {String} baseid 模板id
         * @param {String} version 版本号
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {String} page 页数，第几页
         * @param {String} size 返回多少条记录
         * @param {String} user_id 玩家id
         * @param {String} app_id 作品id，如果有可以传
         */
        GetDraftList: function (baseid, version, success, error, page, size, user_id, app_id) {
            var url = '/v1.0/api/product/personal/actions/get_draft_list';
            var data = {
                user_id: user_id,
                page: page,
                size: size,
                baseid: baseid,
                app_id: app_id,
                version: version
            };
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        },
        /**
         * 删除草稿
         * @param {String} user_id 玩家id
         * @param {Array} records 要删除的草稿集合 
         * [
         **     @param {Number} id 要删除的草稿id和resid是二选一，必须有一个
         * ]
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        DeleteDrafts: function (user_id, records, success, error) {
            var url = '/v1.0/api/product/personal/actions/delete_drafts';
            var data = {
                user_id: user_id,
                records: records
            };
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Api, "DraftBox"));