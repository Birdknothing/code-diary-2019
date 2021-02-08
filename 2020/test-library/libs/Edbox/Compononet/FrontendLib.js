// Edbox 前端分类库组件
(function (namespace, className) {

    // 指定Api集
    var api = Edbox.Api.FrontendLib;

    /**
     * 维度
     */
    var Dimension = {
        /**
         * Edbox资源库【资源库】
         */
        Resource: "c3794ba1-7939-412d-8320-59aadfb377b4",
        /**
         * Edbox资源库（新） 【启用】 【专业类资源库】
         */
        NewResource: "df489d22-b6e4-4140-8a79-f616c26c1991",
        /**
         * Edbox游戏模板【我要创作】
         */
        Editor: "a9e01fdc-a272-497f-9556-c0fde8cb08a1",
        /**
         * Edbox成品游戏【在线作品】
         */
        Product: "eb4002ee-f661-433f-b133-6cf03974f7bd",
        /**
         * VR人生
         */
        VRLife: "RESOURCE_STORE"
    };

    // 数据处理
    function DataHandler(datas) {
        if (!datas) return datas;

        var items = datas.items;

        if (!items) return datas;

        var length = items.length;

        for (var i = 0; i < length; i++) {
            if (!items[i] || !items[i].cover) continue;
            var cover = items[i].cover;
            if (!cover.startsWith("http://")) continue;
            cover = cover.substring("http://".length);
            cover = "https://" + cover;
            items[i].cover = cover;
        }

        return datas;
    }

    /**
     * Edbox 前端分类库组件
     * 用于Edbox平台的访问前端分类库服务器资源搜索下载过程
     * @author 温荣泉(201901)
     * @see http://ndsdn.nd.com.cn/index.php?title=Edbox%E5%89%8D%E7%AB%AF%E5%88%86%E7%B1%BB%E5%BA%93%E7%BB%84%E4%BB%B6JS%E7%89%88
     * */
    var module = {
        /**
         * 维度ID
         */
        DimensionID: "df489d22-b6e4-4140-8a79-f616c26c1991",

        /**
         * 查询前端分类树
         * @param {String} tag 标签ID
         * @param {Function} success 成功回调,带参数Data:List
         * @param {Function} error 出错回调
         * @param {String} dimensionid 维度ID
         */
        GetSortTree: function (tag, success, error, dimensionid) {
            if (!dimensionid) {
                dimensionid = module.DimensionID;
            }
            api.GetSortTree(dimensionid, tag, success, error);
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

            api.GetResources(dimensionid, tag, key, page, size, function (datas) {
                if (!success) return;
                datas = DataHandler(datas);
                success(datas);
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
}(Edbox, "FrontendLib"));