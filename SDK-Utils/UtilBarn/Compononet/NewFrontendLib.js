// UtilBarn 新前端分类库组件
(function (namespace, className) {

    // 指定Api集
    var api = UtilBarn.Api.NewFrontendLib;

    /**
     * 维度
     */
    var Dimension = {
        /**
         * 资源库
         */
        Resource: "f7d6183b-7bbe-0adf-3ab7-6e89d9f191e7"
    };

    /**
     * UtilBarn 新前端分类库组件
     * 用于UtilBarn平台的访问新前端分类库服务器资源搜索下载过程
     * @author 温荣泉(201901)
     * @see 
     * */
    var module = {
        /**
         * 维度ID
         */
        DimensionID: Dimension.Resource,

        /**
         * 查询前端分类树
         * @param {String} tag 标签ID
         * @param {Function} success 成功回调,带参数Data:[{ID,Name}]
         * @param {Function} error 出错回调
         * @param {String} dimensionid 维度ID
         */
        GetSortTree: function (tag, success, error, dimensionid) {
            if (!dimensionid) {
                dimensionid = module.DimensionID;
            }
            api.GetSortTree(dimensionid, tag, function (data) {
                var list = new Array();
                for (var i = 0; i < data.length; i++) {
                    var info = {
                        ID: data[i].id,
                        Name: data[i].name
                    };
                    list.push(info);
                }
                if (success) success(list);
            }, error);
        },

        /**
         * 获取分类下的资源列表
         * @param {String} tag 标签ID
         * @param {String} key 关键词
         * @param {Number} page 页码
         * @param {Number} size 每页大小
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {String} dimensionid 维度ID
         */
        GetResources: function (tag, key, page, size, success, error, dimensionid) {
            if (!page || page < 0) {
                page = 1;
            }
            if (!size || size < 0) {
                size = 20;
            }
            if (!dimensionid) {
                dimensionid = module.DimensionID;
            }

            api.GetResources(dimensionid, tag, key, page, size, function (data) {
                var ans = new Object();
                ans.Count = data.total_count;
                ans.Items = new Array();
                if (data.items) {
                    for (var i = 0; i < data.items.length; i++) {
                        var info = {
                            ID: data.items[i].id,
                            Name: data.items[i].title,
                            Cover: data.items[i].cover,
                            Type: data.items[i].format_type
                        };
                        ans.Items.push(info);
                    }
                }

                if (success) success(ans);
            }, error);
        },

        /**
         * 设置维度ID
         * @param {String} key 维度关键字
         * @return {String} 维度ID
         */
        SetDimensionID: function (key) {
            module.DimensionID = Dimension[key];
            return module.DimensionID;
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "NewFrontendLib"));