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
     * Post请求
     * @param {String} subUrl URI
     * @param {String} data 数据
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
    */
    function Post(subUrl, data, success, error) {
        Edbox.Request.Post(Edbox.GetHost(className), subUrl, JSON.stringify(data), success, error);
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
        },
        
        /**
         * 获取分组可选资源
         * @param {String} pro_alias 项目标志
         * @param {String} ndr_guid 当前资源id
         * @param {String} dimension_guid 当前资源前端分类维度
         * @param {String} type 类型 common公共动作 self私有动作
         * @param {Number} keyword 搜索关键词
         * @param {Number} page 分页 默认1
         * @param {Number} size 分页数量 默认10
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetGroupResouces: function (pro_alias, ndr_guid, dimension_guid, type, keyword, page, size, success, error) {
            var data = new Object();
            data.pro_alias = pro_alias;
            data.ndr_guid = ndr_guid;
            data.dimension_guid = dimension_guid;
            data.type = type;
            data.keyword = keyword;
            data.page = page;
            data.size = size;
            var subUrl = '/service/v1.0/relation/group/selectable_resource';
            Post(subUrl, data, success, error);
        },
        
        /**
         * 上传个人资源
         * @param {String} pro_alias 项目标志
         * @param {String} ndr_guid 当前资源ndr id
         * @param {String} dimension_guid 前端分类维度guid
         * @param {String} self_ndr_guid 个人资源ndr id
         */
        UploadGroupResource: function (pro_alias, ndr_guid, dimension_guid, self_ndr_guid, success, error) {
            var data = new Object();
            data.pro_alias = pro_alias;
            data.ndr_guid = ndr_guid;
            data.dimension_guid = dimension_guid;
            data.self_ndr_guid = self_ndr_guid;
            var subUrl = '/service/v1.0/relation/group/add_selectable_resource';
            Post(subUrl, data, success, error);
        },
        
        /**
         * 选择资源
         * @param {String} pro_alias 项目标志
         * @param {String} ndr_guid 当前资源ndr id
         * @param {String} dimension_guid 前端分类维度guid
         * @param {String} select_ndr_guid 关联资源ndr guid
         */
        BindGroupResources: function (pro_alias, ndr_guid, dimension_guid, select_ndr_guid, success, error) {
            var data = new Object();
            data.pro_alias = pro_alias;
            data.ndr_guid = ndr_guid;
            data.dimension_guid = dimension_guid;
            data.select_ndr_guid = select_ndr_guid;
            var subUrl = '/service/v1.0/relation/group/select_resource';
            Post(subUrl, data, success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Api, "NewFrontendLib"));