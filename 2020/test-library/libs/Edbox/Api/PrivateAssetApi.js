(function (namespace, className) {

    var host = "192.168.212.78:80";
    /**
     * Get请求
     * @param {String} url Url
     * @param {String} data 数据 
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    function PrivateGet(url, data, success, error) {
        var header = new Object();
        header["language"] = Edbox.Language;
        Edbox.Request.GetWithHeader(Edbox.GetHost("MMO"), url, data, header, success, error, Edbox.Protocol);
    }

    /**
     * Post请求
     * @param {String} url Url
     * @param {String} data 数据 
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    function PrivatePost(url, data, success, error) {
        var header = new Object();
        header["language"] = Edbox.Language;
        Edbox.Request.PostWithHeader(Edbox.GetHost("MMO"), url, data, header, success, error, Edbox.Protocol);
    }
    var module = {

        /**
         * Get请求个人资源列表
         * @param {String} res_id 资源id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetPrivateAssetInfo:function(res_id,success,error){
            var data = "res_id=" + res_id;
            data = encodeURI(data);
            PrivateGet("/v1.0/api/userStore/resource/actions/get_info", data, success, error);
        },

        /**
         * Get请求个人资源列表
         * @param {String} category 资源上传的维度，用于区分资源类型
         * @param {String} tags 标签id，多个标签用';'隔开，查询关系为且 
         * @param {String} word 关键字搜索，匹配资源标题
         * @param {int} page 页码 
         * @param {int} size 单页数量 
         * @param {int} upload_status 上传状态，0：未上传，1：已上传，2：所有
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetUploadAssetsInfo:function(category,tags,word,page,size,upload_status,success,error){
            var data = "category=" + category+ "&tags="+tags+"&word="+word+"&page="+page+"&size="+size+"&upload_status="+upload_status;
            data = encodeURI(data);
            PrivateGet("/v1.0/api/userStore/resource/actions/get_list", data, success, error);
        },

        /**
         * Get请求收藏资源列表
         * @param {String} category 资源类型
         * @param {String} tech_key 资源标签 
         * @param {int} page 页码
         * @param {int} size 数量
         * @param {String} word 关键字
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetCollectAssetsInfo:function(category,tech_key,page,size,word,success,error){
            var data = "category=" + category+ "&tech_key=" + tech_key + "&page="+page+"&size="+size+"&word="+word;
            data = encodeURI(data);
            PrivateGet("/v1.0/api/userStore/favorite/actions/get_list", data, success, error);
        },

        /**
         * 查询个人库资源是否重名
         * @param {String} category 资源上传的维度，用于区分资源类型
         * @param {String} title 标题
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        IsNameDup:function(category,title,success,error){
            var url = "/v1.0/api/userStore/resource/actions/is_name_dup";
            var dataObj = new Object();
            dataObj.category = category;
            dataObj.title = title;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

        /**
         * Post创建个人上传数据
         * @param {String} ndr_id 资源ndrId
         * @param {String} category 资源上传的维度，用于区分资源类型
         * @param {String} title 标题
         * @param {String} description 描述
         * @param {String} custom_properties 自定义字段，json字符串。如 音频时长'{"duration":1}
         * @param {int} size 上传文件大小 
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CreateAssetsInfo:function(ndr_id,category,title,description,custom_properties,size,success,error){
            var url = "/v1.0/api/userStore/resource/actions/create";
            var dataObj = new Object();
            dataObj.ndr_id = ndr_id;
            dataObj.category = category;
            dataObj.title = title;
            dataObj.description = description;
            dataObj.custom_properties = custom_properties;
            dataObj.size = size;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

        /**
         * Post更新个人库数据
         * @param {String} res_id 资源id
         * @param {string} title 标题
         * @param {String} description 描述
         * @param {string} custom_properties 自定义字段，json字符串。如 音频时长"{'duration':1}"
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        UpdatePrivateAssetInfo:function(res_id,title,description,custom_properties,success,error){
            var url = "/v1.0/api/userStore/resource/actions/update";
            var dataObj = new Object();
            dataObj.res_id = res_id;
            dataObj.title = title;
            dataObj.description = description;
            dataObj.custom_properties = custom_properties;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

        /**
         * Post更新个人上传数据,资源上传成功通知
         * @param {String} res_id 资源ID
         * @param {String} tech_key files数组元素字段,ndr资源详情的tech_info字段
         * @param {String} md5 files数组元素字段,md5信息
         * @param {int} size files数组元素字段,文件大小
         * @param {String} location files数组元素字段,文件地址
         * @param {String} extension files数组元素字段,文件扩展名
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        UpdateAssetsInfo:function(res_id,tech_key,md5,size,location,extension,success,error){

            var url = "/v1.0/api/userStore/resource/actions/upload_success";
            var dataObj = new Object();
            dataObj.res_id = res_id;
            dataObj.tech_key = tech_key;
            dataObj.md5 = md5;
            dataObj.size = size;
            dataObj.location = location;
            dataObj.extension = extension;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

        /**
         * Post删除个人库数据
         * @param {Array} res_ids 资源个人库ID数组
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        DeleteAssetsInfo:function(res_ids,success,error){
            var url = "/v1.0/api/userStore/resource/actions/remove";
            var dataObj = new Object();
            dataObj.res_ids = res_ids;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

        /**
         * Post新增标签功能
         * @param {String} name 标签名称
         * @param {String} category 资源上传的ndr维度，用于区分标签使用范围
         * @param {int} type 标签使用范围，个人自定义标签：1，系统标签：0（客户端不可使用）
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        AddTag:function(name,category,type,success,error){
            var url = "/v1.0/api/userStore/tag/actions/create";
            var dataObj = new Object();
            dataObj.name = name;
            dataObj.category = category;
            dataObj.type = type;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

        /**
         * Post删除标签功能
         * @param {String} tag_id 要删除的标签
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        DeleteTag:function(tag_id,success,error){
            var url = "/v1.0/api/userStore/tag/actions/remove";
            var dataObj = new Object();
            dataObj.tag_id = tag_id;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

        /**
         * Post修改标签功能
         * @param {String} tag_id 要删除的标签
         * @param {String} name 资源名称
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        UpdateTag:function(tag_id,name,success,error){
            var url = "/v1.0/api/userStore/tag/actions/update";
            var dataObj = new Object();
            dataObj.name = name;
            dataObj.tag_id = tag_id;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

        /**
         * Get获取个人标签集
         * @param {String} category 资源类型
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTags:function(category,success,error){
            var data = "category=" + category;
            PrivateGet("/v1.0/api/userStore/tag/actions/get_list", data, success, error);
        },

        /**
         * Post给资源添加标签
         * @param {Array} res_ids 资源个人库ID
         * @param {Array} tag_ids 标签ID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        AddAssetTags:function(res_ids,tag_ids,success,error){
            var url = "/v1.0/api/userStore/resource/actions/link_tag";
            var dataObj = new Object();
            dataObj.res_ids = res_ids;
            dataObj.tag_ids = tag_ids;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

        /**
         * Post给资源删除标签
         * @param {Array} res_ids 资源NdrID
         * @param {Array} tag_ids 标签ID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        DeleteAssetTags:function(res_ids,tag_ids,success,error){
            var url = "/v1.0/api/userStore/resource/actions/unlink_tag";
            var dataObj = new Object();
            dataObj.res_ids = res_ids;
            dataObj.tag_ids = tag_ids;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

        /**
         * Post收藏作品
         * @param {String} category 资源分类
         * @param {String} ndr_id 资源NdrID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CollectAsset:function(category,ndr_id,success,error){
            var url = "/v1.0/api/userStore/favorite/actions/collect";
            var dataObj = new Object();
            dataObj.ndr_id = ndr_id;
            dataObj.category = category;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

         /**
         * Post取消收藏作品
         * @param {Array} ndr_ids 资源在ndr上的id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CancelCollectAsset:function(ndr_ids,success,error){
            var url = "/v1.0/api/userStore/favorite/actions/cancel_collect";
            var dataObj = new Object();
            dataObj.ndr_ids = ndr_ids;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

        /**
         * Post取消收藏作品
         * @param {Array} ndr_ids 资源在ndr上的id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CheckCollectState:function(ndr_ids,success,error){
            var url = "/v1.0/api/userStore/favorite/actions/verify";
            var dataObj = new Object();
            dataObj.ndr_ids = ndr_ids;
            var data = JSON.stringify(dataObj);
            PrivatePost(url,data,success,error);
        },

         /**
         * Get获取个人硬盘空间信息
         * @param {string} category ndr维度，用于区分类型
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetMyCloudInfo:function(category,success,error){
            var data = "category=" + category;
            PrivateGet("/v1.0/api/userStore/catalog/actions/get_space", data, success, error);
        }
    };
    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }

}(Edbox.Api, "PrivateAsset"));