// Edbox 新前端分类库组件
(function (namespace, className) {

    // 指定Api集
    var api = Edbox.Api.NewFrontendLib;

    /**
     * 维度
     */
    var BaseDimension = {
        QA: "fb8ea50e-f90c-238e-ceca-cb9814e72e32",
        Dev: "74b004c4-d8ed-534a-d16a-79eb39149393",
        Feature: "f7d6183b-7bbe-0adf-3ab7-6e89d9f191e7",
        CN: "f7d6183b-7bbe-0adf-3ab7-6e89d9f191e7",
        BetaCN: "f7d6183b-7bbe-0adf-3ab7-6e89d9f191e7",
        HK: "f7d6183b-7bbe-0adf-3ab7-6e89d9f191e7",
        US: "f7d6183b-7bbe-0adf-3ab7-6e89d9f191e7",
        Beta: "f7d6183b-7bbe-0adf-3ab7-6e89d9f191e7"
    };
    
    /**
     * 3D对象标识
     */
    var Object3DDimension = {
        Unity:{
            QA: "d163f53f-0d71-c943-8727-4ea534bd57d8",
            Dev: "e5ef3c9e-273d-7912-692f-12c5ff46525e",
            Feature: "9ed09b93-bb0f-eb05-3dfa-a97e0590d62b",
            CN: "9ed09b93-bb0f-eb05-3dfa-a97e0590d62b",
            BetaCN: "9ed09b93-bb0f-eb05-3dfa-a97e0590d62b",
            HK: "9ed09b93-bb0f-eb05-3dfa-a97e0590d62b",
            US: "9ed09b93-bb0f-eb05-3dfa-a97e0590d62b",
            Beta: "9ed09b93-bb0f-eb05-3dfa-a97e0590d62b"
        },
        Laya:{
            QA: "48c2b02b-15ef-338a-3ec6-d86f3ccf758f",
            Dev: "26c9332e-176f-7a35-af2f-a142db795542",
            Feature: "2e1a9678-5055-2406-db6a-eda8cccac6dd",
            CN: "2e1a9678-5055-2406-db6a-eda8cccac6dd",
            BetaCN: "2e1a9678-5055-2406-db6a-eda8cccac6dd",
            HK: "2e1a9678-5055-2406-db6a-eda8cccac6dd",
            US: "2e1a9678-5055-2406-db6a-eda8cccac6dd",
            Beta: "2e1a9678-5055-2406-db6a-eda8cccac6dd"
        }
    };
    
    /**
     * 3D特效标识
     */
    var Effect3DDimension = {
        Unity:{
            QA: "f98c07f3-c410-c21a-2c17-bbf143b0d07a",
            Dev: "472b564f-3a3c-3214-4224-613401a82ee5",
            Feature: "72f452eb-35b9-704a-8e8c-1f9f88468962",
            CN: "72f452eb-35b9-704a-8e8c-1f9f88468962",
            BetaCN: "72f452eb-35b9-704a-8e8c-1f9f88468962",
            HK: "72f452eb-35b9-704a-8e8c-1f9f88468962",
            US: "72f452eb-35b9-704a-8e8c-1f9f88468962",
            Beta: "72f452eb-35b9-704a-8e8c-1f9f88468962"
        },
        Laya:{
            QA: "decde0d5-6fef-a898-621c-e3b66f564158",
            Dev: "9b1eb229-21ca-2560-200c-85dcfc4401fd",
            Feature: "8b8bd6e1-2f38-05d2-8664-948d1e94cd58",
            CN: "8b8bd6e1-2f38-05d2-8664-948d1e94cd58",
            BetaCN: "8b8bd6e1-2f38-05d2-8664-948d1e94cd58",
            HK: "8b8bd6e1-2f38-05d2-8664-948d1e94cd58",
            US: "8b8bd6e1-2f38-05d2-8664-948d1e94cd58",
            Beta: "8b8bd6e1-2f38-05d2-8664-948d1e94cd58"
        }
    };
    
    /**
     * 2D特效标识
     */
    var Effect2DDimension = {
        Unity:{
            QA: "da238013-e601-0960-8e85-a3590c8d64d3",
            Dev: "d68f6693-6678-60fb-1084-c9255ab73e11",
            Feature: "52cab318-1cdf-72ae-c771-94514de2d484",
            CN: "52cab318-1cdf-72ae-c771-94514de2d484",
            BetaCN: "52cab318-1cdf-72ae-c771-94514de2d484",
            HK: "52cab318-1cdf-72ae-c771-94514de2d484",
            US: "52cab318-1cdf-72ae-c771-94514de2d484",
            Beta: "52cab318-1cdf-72ae-c771-94514de2d484"
        },
        Laya:{
            QA: "da238013-e601-0960-8e85-a3590c8d64d3",
            Dev: "d68f6693-6678-60fb-1084-c9255ab73e11",
            Feature: "52cab318-1cdf-72ae-c771-94514de2d484",
            CN: "52cab318-1cdf-72ae-c771-94514de2d484",
            BetaCN: "52cab318-1cdf-72ae-c771-94514de2d484",
            HK: "52cab318-1cdf-72ae-c771-94514de2d484",
            US: "52cab318-1cdf-72ae-c771-94514de2d484",
            Beta: "52cab318-1cdf-72ae-c771-94514de2d484"
        }
    };

    /**
     * Edbox 新前端分类库组件
     * 用于Edbox平台的访问新前端分类库服务器资源搜索下载过程
     * @author 温荣泉(201901)
     * @see 
     * */
    var module = {
        
        /**
         * 查询标识id
         * @param {String} resType 资源类型 （Unity/Laya）
         * @param {String} dimensionType 资源标识类型 (3D对象， 3D特效， 2D特效等)
         * @param {Function} success 成功回调,带参数Data:[{ID,Name}]
         * @param {Function} error 出错回调
         */
        GetDimensionID: function(resType, dimensionType, success, error){
            var id = "";
            if(dimensionType === "3DObject"){
                id = Object3DDimension[resType][Edbox.ServerKey];
            }
            if(dimensionType === "3DEffect"){
                id = Effect3DDimension[resType][Edbox.ServerKey];
            }
            if(dimensionType === "2DEffect"){
                id = Effect2DDimension[resType][Edbox.ServerKey];
            }
            
            if(id === ""){
                if(error)error("Not found dimensionId");
            }else{
                if(success)success(id);
            }
        },

        /**
         * 查询前端分类树
         * @param {String} tag 标签ID
         * @param {Function} success 成功回调,带参数Data:[{ID,Name}]
         * @param {Function} error 出错回调
         * @param {String} dimensionid 维度ID
         */
        GetSortTree: function (tag, success, error, dimensionid) {
            if (!dimensionid) {
                dimensionid = BaseDimension[Edbox.ServerKey];
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
                dimensionid = BaseDimension[Edbox.ServerKey];
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
         * 获取分组可选资源
         * @param {String} ndr_guid 资源guid
         * @param {String} sType 类型 common公共动作 self私有动作
         * @param {String} keyword 搜索关键词
         * @param {Number} page 分页 默认1
         * @param {Number} size 分页数量 默认10
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetGroupResouces: function (ndr_guid, sType, keyword, page, size, success, error) {
            if (!page || page < 0) {
                page = 1;
            }
            if (!size || size < 0) {
                size = 20;
            }
            
            if (!sType || sType === '') {
                sType = 'common';
            }
            
            if (!keyword) {
                keyword = '';
            }
            
            api.GetGroupResouces(Edbox.ProAlias, ndr_guid, BaseDimension[Edbox.ServerKey], sType, keyword, page, size, function (data) {
                var ans = new Object();
                ans.Count = data.count;
                ans.Items = new Array();
                if (data.selectable_resource) {
                    for (var i = 0; i < data.selectable_resource.length; i++) {
                        var info = {
                            ID: data.selectable_resource[i].ndr_guid,
                            Name: data.selectable_resource[i].name
                        };
                        ans.Items.push(info);
                    }
                }
                    
                if (success) success(ans);
            }, error);
        },
        
        /**
         * 获取项目资源分组
         * @param {String} ndr_guid 个人资源ndr guid
         * @param {String} select_ndr_guid 关联资源ndr guid
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        UploadGroupResource: function (ndr_guid, select_ndr_guid, success, error) {
            api.UploadGroupResource(Edbox.ProAlias, ndr_guid, BaseDimension[Edbox.ServerKey], select_ndr_guid, success, error);
        },
        
        /**
         * 选择资源
         * @param {String} ndr_guid 个人资源ndr guid
         * @param {String} select_ndr_guid 关联资源ndr guid
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        BindGroupResources: function (ndr_guid, select_ndr_guid, success, error) {
            api.BindGroupResources(Edbox.ProAlias, ndr_guid, BaseDimension[Edbox.ServerKey], select_ndr_guid, success, error);
        },

        /**
         * 设置维度ID
         * @param {String} key 维度关键字
         * @return {String} 维度ID
         */
        SetDimensionID: function (key) {
            return BaseDimension[Edbox.ServerKey];
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "NewFrontendLib"));