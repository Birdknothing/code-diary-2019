// Edbox 前端分类服务端接口
(function (namespace, className) {

    /**
     * Get请求，带语言参数
     * @param {String} subUrl URI
     * @param {String} data 数据
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    function Get(subUrl, data, success, error) {
        Edbox.Request.GetWithLanguage(Edbox.GetHost(className), subUrl, data, success, error);
    }

    /**
     * Edbox 前端分类服务端接口
     * 用于Edbox平台的访问前端分类服务端接口
     * @author 温荣泉(201901)
     * @see 服务端接口 http://wiki.doc.101.com/index.php?title=EDU_GROUP3_API_LIST
     * */
    var module = {
        /**
         * 查询前端分类树
         * @param {String} dimensionid 维度ID
         * @param {String} tag 标签ID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetSortTree: function (dimensionid, tag, success, error) {
            var subUrl = "/v1.0/front_end_categories/children";
            var data = "tag_dimension_id=" + dimensionid + "&parent_tag_id=" + tag;
            Get(subUrl, data, success, error);
        },

        /**
         * 获取分类下的资源列表
         * @param {String} dimensionid 维度ID
         * @param {String} tag 标签ID
         * @param {String} key 关键词
         * @param {Number} page 页码
         * @param {Number} size 每页大小
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetResources: function (dimensionid, tag, key, page, size, success, error) {
            var subUrl = "/v1.0/front_end_categories/resources";
            var data = "tag_dimension_id=" + dimensionid + "&tag_id=" + tag + "&words=" + encodeURIComponent(key) + "&page=" + page + "&size=" + size;
            Get(subUrl, data, success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Api, "FrontendLib"));