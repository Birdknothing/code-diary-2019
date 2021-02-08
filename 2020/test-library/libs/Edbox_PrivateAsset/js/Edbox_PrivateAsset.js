
/**
 * Edbox 个人资源库
 * 用于Edbox向个人资源库上传等数据管理
 * @author 张涛（120100）
 * @version 1.0.0 (2019年6月21日)
 * @see
 * Js需求:`
 *      jquery
 *      CryptoJS
 *      Edbox
 *      Edbox_Request
 *      Edbox_NDR
 * */
Edbox.PrivateAsset = {
    
    config: {
        "Image": "$RA1206002",
        "Audio": "$RA1206001"
    },
    
    /**
     * 获取上传资源列表
     * @param {Object} data {
     *              {String} category 资源类型
     *              {String} tags 资源标签多个标签用';'隔开 
     *              {String} word 搜索关键字
     *              {int} page 页码 
     *              {int} size 单页数量 }
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    GetUploadAssetsInfo: function (data, success, error) {
        var category = Edbox.PrivateAsset.config[data.category];
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "GetPrivateListError";
            obj.message = "获取数据列表失败";
            error(obj);
        };
        var succ = function (PrivateListData) {
            for (var i = 0, n = PrivateListData.items.length; i < n; i++) {
                PrivateListData.items[i].location = PrivateListData.items[i].files[0].location;
            }
            if (success) success(PrivateListData);
        };
        Edbox.Api.PrivateAsset.GetUploadAssetsInfo(category,data.tags, data.word, data.page, data.size, 1,succ, err);
    },

    /**
     * 获取个人资源信息
     * @param {Object} data {
     *      {string} res_id 资源id
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    GetPrivateAssetInfo: function(data,success,error){
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "GetDetailError";
            obj.message = "获取数据详情失败";
            error(obj);
        };
        var succ = function (PrivateData) {
            PrivateData.location = PrivateData.files[0].location;
            if (success) success(PrivateData);
        };
        Edbox.Api.PrivateAsset.GetPrivateAssetInfo(data.res_id,succ,err);
    },

    /**
     * 上传数据接口
     * @param {Object} data { 
     *              {Object} file 本地文件
     *              {string} category NDR维度
     *              {string} title 标题
     *              {string} description 描述
     *              {string} custom_properties json格式字符串
     *              {int} size 大小}
     * @param {Function} process 进度回调
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    UploadPrivateAssetInfo: function (data, process, success, error) {
        var category = Edbox.PrivateAsset.config[data.category];
        var title = data.title;
        var description = data.description;
        var custom_properties = data.custom_properties;
        var size = data.size;
        var file = data.file;
        var session;
        var ndrData;
        
        function createError(ob){
            var obj = new Object();
            obj.code = "CreateInfoError";
            obj.message = Edbox.GetTip("ERROR_Private_UploadData");
            error(obj);
        }
        
        function GetSessionSucc(sessionData){
            session = sessionData;
            Edbox.PrivateAsset.UploadNdrPrivateAsset(file, title, sessionData, category, process, UpNdrSuccess, createError);
        }
        
        //创建个人库数据
        function createSuccess(ob){
            //更新数据
            Edbox.PrivateAsset.UpdateAssetsInfo(ob.id, session.uuid, ndrData.tech_key, ndrData.md5, size, ndrData.Url, ndrData.Type, success, createError);
        }
        
        //上传NDR
        function UpNdrSuccess(dataNdr){
            ndrData = dataNdr;
            Edbox.Api.PrivateAsset.CreateAssetsInfo(session.uuid, category, title, description, custom_properties, size, createSuccess, createError);
        }
        
        function getRandomName(name){
            var date = new Date();
            var d = date.getDate() - 1; // 获取日
            var h = date.getHours(); // 获取小时
            var m = date.getMinutes(); // 获取分钟
            var s = date.getSeconds(); // 获取秒
            var t = ((d * 24 + h) * 60 + m) * 60 + s;
            return name + string10to62(t);
        }
        
        // 取62进制随机数
        function string10to62(number) {
            var chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split(''),
                radix = chars.length,
                qutient = +number,
                arr = [];
            do {
                mod = qutient % radix;
                qutient = (qutient - mod) / radix;
                arr.unshift(chars[mod]);
            } while (qutient);
            return arr.join('');
        }
        
        Edbox.Api.PrivateAsset.IsNameDup(category, title, function(sData){
            Edbox.Api.NDR.GetSessionSelfCoverage(Edbox.AccountId, "none", GetSessionSucc, createError);
        }, function(eData){
            title = getRandomName(title);
            Edbox.Api.NDR.GetSessionSelfCoverage(Edbox.AccountId, "none", GetSessionSucc, createError);
//             var obj = new Object();
//             obj.code = "DuplicateName";
//             obj.message = "名称重复";
//             error(obj);
        });
    },

     /**
      * 敏感词检测
      * @param {string} str 敏感词
      * @param {Function} succ 成功回调
      * @param {Function} error 失败回调
      */
    IsSensitive:function(str, succ, error){
        if(str.match(/[\\\/:*?"<>|#]/)){
            message.error(formatMessage({id: 'illegal_file_name'}));

            if (error) error();
            return;
        }
        // 空资源检测
        if (str === ""){
            if (succ) succ();
            return;
        }

        Edbox.MMO.IsSensitive(str, function(flag){
            if (flag.is_sensitive) {
                message.error(formatMessage({ id: 'sensitive_words' }));
                if (error) error();
                return;
            }
            else{
                if (succ) succ();
            }
        }, error);
    },

    /**
     * 上传NDR（内部使用）
     * @param {Object} file 文件路径
     * @param {string} resName 资源名称
     * @param {string} session session信息
     * @param {Array} category NDR维度
     * @param {Function} process 进度回调
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    UploadNdrPrivateAsset: function (file, resName,session,category,process, success, error) {
        var getfillErr = function(errFun){
            var obj = new Object();
            obj.code = "LocalFileError";
            obj.message = Edbox.GetTip("ERROR_Private_LocalFile");
            error(obj);
        };
        
        var getAudioDuration = function(url, callback){
            // var audio = document.createElement('audio');
            // audio.src = url;
            // var srcLoaded = function() {
            //     console.log('-------------: '+JSON.stringify(audio.duration));
                
            //     callback(audio.duration);
            // };
            // audio.onloadedmetadata = srcLoaded;
            var audio = document.createElement("audio");
                function preClick() {
                    audio.onloadedmetadata = function() {
                        callback(audio.duration);
                        document.body.removeChild(audio);
                    };
                    var player = audio.play();
                    if (player.then) {
                        player.then(function() {}).catch(function() {});
                    }
                    document.documentElement.removeEventListener("click", preClick);
                }
                audio.src = url;
                audio.muted = true;
                document.body.appendChild(audio);
                document.documentElement.addEventListener("click", preClick);
                document.body.click();
        };
        
        Edbox.NDR.GetFileData(file, function (info) {
            var upNdrErr = function(){
                var obj = new Object();
                obj.code = "UploadNdrError";
                obj.message = Edbox.GetTip("ERROR_Private_UploadFile");
                error(obj);
            };
            //上传CS，刷新NDR信息
            var data = info.Data;
            var name = info.Name;
            var isAudio = false;
            var nameSensitive = function(errFun){
                var obj = new Object();
                obj.code = "LocalFileNameSensitive";
                obj.message = Edbox.GetTip("ERROR_Private_Sensitive");
                error(obj);
            };  
            console.log('开始判断铭感词汇');
            
            Edbox.PrivateAsset.IsSensitive(name,succSensitive,nameSensitive);

            function succSensitive() {
                var userid = Edbox.AccountId;
                var blob = Edbox.NDR.Base64ToBlob(data);
                var format = blob.type;
                if (!format || format.length < 1) {
                    format = getType(name);
                }
                console.log('这里是sdk解析出的audio',format);
                
                if(format.indexOf("audio") >= 0 && format.indexOf("wma") < 0){
                    isAudio = true;
                }
                
                function getFileName(name) {
                    var index = name.lastIndexOf(".");
                    return name.substring(0, index);
                }
                function getExtend(name) {
                    var index = name.lastIndexOf(".");
                    return name.substring(index + 1, name.length);
                }
                
                
                function getType(name) {
                    var ext = getExtend(name);
                    var fmt = "";
                    switch (ext) {
                        case "jpg":
                        case "png":
                        case "jif":
                            fmt = "image/" + ext;
                            break;
                        case "zip":
                        case "rar":
                            fmt = "application/" + ext;
                            break;
                        case "mp3":
                        case "wav":
                        case "ogg":
                            fmt = "audio/" + ext;
                            break;
                        case "edpackage":
                            fmt = "application/zip";
                            break;
                        default:
                            break;
                    }
                    return fmt;
                }

                var tmpName = Edbox.GetGUID() + '.' + getExtend(name);

                // 上传到CS服务器
                Edbox.Api.CS.UpLoadToCS(session.session_id, session.dist_path, tmpName, blob, function (per, loader, total) {
                    process("uploadtocs", Math.floor(per * 100 / 100));
                }, buildResourceRequirement, error);
                
                function buildResourceRequirement(data){
                    process("createndrsource", 90);
                    var filelocation = '${ref-path}' + data.path;
                    if(isAudio){
                        var url = filelocation.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                        console.log('这里开始进入sdk1解析时长。。。。后面应出现解析出时长字样');
                        
                        getAudioDuration(url, function(duration){
                            data.duration = duration;
                            buildNdrResource(data);
                        });
                    }else{
                        buildNdrResource(data);
                    }
                }

                // 上传到NDR
                function buildNdrResource(data) {
                    process("createndrsource", 90);

                    var filelocation = '${ref-path}' + data.path;
                    var requirements = null;
                    if(isAudio){
                        var h = parseInt(data.duration/3600);
                        var ml = data.duration - 3600 * h;
                        var m = parseInt(ml/60);
                        var s = parseInt(ml - 60 * m);
                        var duration = 'PT';
                        if(h > 0){
                            duration = duration + h + 'H' + m + 'M' + s + 'S';
                        }else if(m > 0){
                            duration = duration + m + 'M' + s + 'S';
                        }else{
                            duration = duration + s + 'S';
                        }
                        requirements = new Array;
                        var requirement = new Object;
                        requirement.identifier = null;
                        requirement.type = 'QUOTA';
                        requirement.name = 'Duration';
                        requirement.min_version = null;
                        requirement.max_version = null;
                        requirement.installation = null;
                        requirement.installation_file = null;
                        requirement.value = duration;
                        requirements.push(requirement);
                    }
                    var nData = {
                        'title': resName,
                        'preview': {
                            'png': format.indexOf("image") >= 0 ? filelocation : ""
                        },
                        'language': 'zh-CN',
                        'identifier': session.uuid,
                        'life_cycle': {
                            'version': '1.0',
                            'status': 'ONLINE',
                            'enable': true,
                            'creator': userid,
                            'publisher': 'NetDragon'
                        },
                        'categories': {
                            "assets_type": [{
                                'taxoncode': category
                            }]
                        },
                        'tech_info': {
                            'source': {
                                'size': data.inode.size,
                                'location': filelocation,
                                'format': format,
                                'md5': data.inode.md5,
                                'requirements':requirements
                            }
                        },
                        "coverages": [
                            {
                                "target_type": "App",
                                "target": "cf7ce674-9dde-4bb3-8f54-1f1ab4f2bcf0",
                                "target_title": "EdBox Library",
                                "strategy": "OWNER"
                            }
                        ]
                    };
                    
                    
                    function handle(ans) {
                        //console.log(ans);
                        if (success) {
                            var obj = new Object();
                            obj.Guid = ans.identifier;
                            obj.Url = ans.tech_info.source.location.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                            obj.Type = '.' + getExtend(ans.tech_info.source.location);
                            obj.Name = ans.title;
                            obj.tech_key = 'source';
                            obj.md5 = ans.tech_info.source.md5;
                            success(obj);
                        }
                    }

                    Edbox.Api.NDR.Post(session.uuid, nData, handle, upNdrErr);
                }
            }
            
        },getfillErr);
    },

    /**
     * 刷新个人资源库数据信息（内部）
     * @param {string} res_id 个人库资源id
     * @param {string} ndr_id NDR资源id
     * @param {tech_key} tech_key 资源字段
     * @param {md5} md5 md5码
     * @param {size} size 资源大小
     * @param {location} location 资源路径
     * @param {extension} extension 资源格式
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    UpdateAssetsInfo: function (res_id, ndr_id,tech_key,md5,size,location,extension,success, error) {
        var succ = function (dataObj) {
            dataObj.id = ndr_id;
            dataObj.res_id = res_id;
            success(dataObj);
        };
        Edbox.Api.PrivateAsset.UpdateAssetsInfo(res_id,tech_key,md5,size,location,extension,succ,error);
    },

     /**
     * 删除个人库资源
     * @param {Object} data {
     *      {Array[string]} res_ids 个人库资源ids
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    DeleteAssetsInfo: function(data,success,error){
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "DeleteError";
            obj.message = Edbox.GetTip("ERROR_Private_DeleteSource");
            error(obj);
        };
        Edbox.Api.PrivateAsset.DeleteAssetsInfo(data.res_ids,success,err);
    },

    /**
     * 获取收藏资源列表
     * @param {Object} data {
     *              {String} category 资源类型
     *              {String} tech_key 资源标签 
     *              {String} word 搜索关键字
     *              {int} page 页码 
     *              {int} size 单页数量 }
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    GetCollectAssetsInfo: function (data, success, error) {
        var category = Edbox.PrivateAsset.config[data.category];
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "GetCollectError";
            obj.message = Edbox.GetTip("ERROR_Private_GetFavoriteRes");
            error(obj);
        };
        var succ = function (CollectListData) {
            var CollectAsset = new Array;
            var ndr_ids = new Array;
            var Asset = new Object();
            Asset.total = CollectListData.total;
            for (var i = 0, n = CollectListData.items.length; i < n; i++) {
                ndr_ids.push(CollectListData.items[i].ndr_id);
            }
            if(ndr_ids.length > 0){
                Edbox.NDR.GetList(ndr_ids, function (data) {
                    for (var i = 0, n = CollectListData.items.length; i < n; i++) {
                        for (var key in data) {
                            if (key === CollectListData.items[i].ndr_id) {
                                CollectAsset.push(
                                    {
                                        "ndr_id": key,
                                        "enable": CollectListData.items[i].enable,
                                        "title": CollectListData.items[i].title,
                                        "custom_properties": CollectListData.items[i].custom_properties,
                                        "location": data[key].Url
                                    }
                                );
                            }
                        }
                    }
                    Asset.items = CollectAsset;
                    if (success) success(Asset);
                }, function (e) {
                    if (error) err(e);
                });
            }else{
                Asset.items = new Array;
                if (success) success(Asset);
            }
        };
        Edbox.Api.PrivateAsset.GetCollectAssetsInfo(category,data.tech_key,data.page,data.size,data.word, succ, err);
    },

     /**
     * 收藏功能
     * @param {Object} data {
     *      {string} category 资源类型
     *      {string} ndr_id 资源ID
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    CollectAsset: function (data, success, error) {
        var category = Edbox.PrivateAsset.config[data.category];
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "CollectError";
            obj.message = Edbox.GetTip("ERROR_Private_Collect");
            error(obj);
        };
        Edbox.Api.PrivateAsset.CollectAsset(category,data.ndr_id,success,err);
    },

     /**
     * 取消收藏功能
     * @param {Object} data {
     *      {Array[string]} ndr_ids 个人库数据ID
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    CancelCollectAsset: function(data,success,error){
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "CancelCollectError";
            obj.message = Edbox.GetTip("ERROR_Private_CancelCollect");
            error(obj);
        };
        Edbox.Api.PrivateAsset.CancelCollectAsset(data.ndr_ids,success,err);
    },

     /**
     * 查询收藏状态
     * @param {Object} data {
     *      {Array[string]} ndr_ids 个人库数据ID
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    CheckCollectState: function(data,success,error){
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "CancelCollectError";
            obj.message = Edbox.GetTip("ERROR_Private_GetFavoriteStatus");
            error(obj);
        };
        var succ = function (dataobj) {
            var returnData = new Array;
            for (var index = 0; index < data.ndr_ids.length; index++) {
                var ndr_id = data.ndr_ids[index];
                var collectState = new Object();
                collectState.ndr_id = ndr_id;
                collectState.state = 0;
                for (var j = 0; j < dataobj.length; j++) {
                    var collectID = dataobj[j];
                    if(collectID === ndr_id){
                        collectState.state=1;
                        break;
                    }
                }
                returnData.push(collectState);
            }
            if (success) success(returnData);
        };
        Edbox.Api.PrivateAsset.CheckCollectState(data.ndr_ids,succ,err);
    },

    //获取标签集
     /**
     * 获取标签集
     * @param {Object} data {
     *      {string} category 资源类型
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    GetTags: function (data, success, error) {
        var category = Edbox.PrivateAsset.config[data.category];
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "GetTagsError";
            obj.message = Edbox.GetTip("ERROR_Private_GetTags");
            error(obj);
        };
        Edbox.Api.PrivateAsset.GetTags(category,success,err);
    },

    //新增标签
     /**
     * 新增标签
     * @param {Object} data {
     *      {string} name 标签名称
     *      {string} category 资源类型
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    AddTag: function (data, success, error) {
        var category = Edbox.PrivateAsset.config[data.category];
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "AddTagError";
            obj.message = Edbox.GetTip("ERROR_Private_AddTag");
            error(obj);
        };
        Edbox.Api.PrivateAsset.AddTag(data.name,category,1,success,err);
    },

     /**
     * 删除标签
     * @param {Object} data {
     *      {string} tag_id 要删除的标签id
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    DeleteTag: function(data,success,error){
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "DeleteTagError";
            obj.message = Edbox.GetTip("ERROR_Private_DeleteTag");
            error(obj);
        };
        Edbox.Api.PrivateAsset.DeleteTag(data.tag_id,success,err);
    },

     /**
     * 修改标签
     * @param {Object} data {
     *      {int} tag_id 标签id
     *      {string} name 标签新名称
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    UpdateTag: function(data,success,error){
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "ModifyTagError";
            obj.message = Edbox.GetTip("ERROR_Private_ModifyTag");
            error(obj);
        };
        Edbox.Api.PrivateAsset.UpdateTag(data.tag_id,data.name,success,err);
    },

     /**
     * 给资源添加标签
     * @param {Object} data {
     *      {Array{int}} res_ids 资源ids
     *      {Array{int}} tag_ids 标签ids
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    AddAssetTags: function(data,success,error){
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "AddAssetTagError";
            obj.message = Edbox.GetTip("ERROR_Private_AddTagOfRes");
            error(obj);
        };
        Edbox.Api.PrivateAsset.AddAssetTags(data.res_ids,data.tag_ids,success,err);
    },

    /**
     * 给资源删除标签
     * @param {Object} data {
     *      {Array{int}} res_ids 资源ids
     *      {Array{int}} tag_ids 标签ids
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    DeleteAssetTags: function(data,success,error){
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "DeleteAssetTagError";
            obj.message = Edbox.GetTip("ERROR_Private_DeleteTagOfRes");
            error(obj);
        };
        Edbox.Api.PrivateAsset.DeleteAssetTags(data.res_ids,data.tag_ids,success,err);
    },

    /**
     * 获取个人硬盘空间
     * @param {Object} data {
     *      {string} category 分类
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    GetMyCloudInfo: function (data, success, error) {
        var category = Edbox.PrivateAsset.config[data.category];
        var err = function(dataObj){
            var obj = new Object();
            obj.code = "GetCloudSizeError";
            obj.message = "获取个人硬盘空间失败";
            error(obj);
        };
        Edbox.Api.PrivateAsset.GetMyCloudInfo(category,success,err);
    },

    /**
     * 获取ndr资源信息（音频）
     * @param {Object} data {
     *              {string} resID ndr资源的id
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    GetAudioFileInfo: function (data,success,error){
        var succ = function(ndrData){
            //封装输出信息
            success(ndrData);
        };
        Edbox.NDR.Get(data.resID, succ, error);
    },

    /**
     * 获取ndr资源信息（图片）
     * @param {Object} data {
     *              {string} resID ndr资源的id
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    GetImageFileInfo: function (data,success,error){

    },

    /**
     * 获取ndr资源信息（文字）
     * @param {Object} data {
     *              {string} resID ndr资源的id
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    GetTextFileInfo: function (data,success,error){

    }
};

