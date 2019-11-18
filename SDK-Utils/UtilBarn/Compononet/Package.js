/**
 * Package包组件
 * 生成和读取Package包数据的功能
 * @author 陈五洲(880123)
 * @version 0.1 (2019/10/15 13:44)
 */
(function (namespace, className) {
    var api = UtilBarn.Api.NDR;

    /**
     * JSZip组件路径
     */
    var JSZipPath = UtilBarn.ComponentRootPath + "ThirdParty/jszip/jszip.min.js";

    /**
     * JSZip工具组件路径
     */
    var JSZipUtilsPath = UtilBarn.ComponentRootPath + "ThirdParty/jszip/jszip-utils.js";

    // 获取基础信息
    function GetDatasBaseInfo (datas) {
        var baseinfo = new Object();
        var list = datas.Datas;
        for (var i = 0; i <= list.length; i++) {
            var tab = list[i];
            if (tab.Name === "BaseInfo") {
                for (var j = 0; j < tab.Datas.length; j++) {
                    var key = tab.Datas[j];
                    if (key.Name === "GameName") {
                        GameName = key.Value;
                        baseinfo.GameName = key.Value;
                    }
                    if (key.Name === "Description") {
                        Description = key.Value;
                        baseinfo.Description = key.Value;
                    }
                    if (key.Name === "CoverImage") {
                        CoverImage = key.GUID;
                        CoverImageValue = key.Value;
                        baseinfo.CoverImage = key.GUID;
                    }
                }
                break;
            }
        }
        return baseinfo;
    }

        
      /**
     * 获取GameBaseConfig.json
     * @param {Object} datas 完整数据 , 不允许为空
     * @returns {String} GameBaseConfig.json的内容
     */
    function GetGameBaseConfigJson (datas) {
        var json = new Object();
        var info = new Object();

        var baseinfo = GetDatasBaseInfo(datas);
        info.AppName = baseinfo.GameName;
        info.Description = baseinfo.Description;
        info.CoverImage = baseinfo.CoverImage;

        info.Version = "";
        info.LoadingImage = "";
        info.GameTemplate = "";
        info.IsStandAlone = "true";
        json.AppliactionInfo = info;

        return JSON.stringify(json);
    }

    /**
     * 获取AssetConfig.json (兼容旧json信息)
     * Get AssetConfig.json
     * @param {Object} datas 完整数据 , 不允许为空
     * @returns {String} AssetConfig.json的内容
     */
    function GetAssetConfigJson (datas) {
        var json = new Object();
        json.Assets = new Array();

        var links = new Object();

        function load(obj) {
            if (obj.Type.indexOf("Image") >= 0 || obj.Type.indexOf("Audio") >= 0) {
               
                var data = new Object();
                data[obj.ID] = obj.Name;
                if (obj.GUID && obj.GUID !== "") {
                    data.AssetGUID = obj.GUID;
                    data.AssetPath = "";
                } else {
                    data.AssetGUID = "";
                    data.AssetPath = obj.Value;
                }

                data.AssetType = obj.Type;
                data.Platform = "";
                json.Assets.push(data);
                links[obj.ID] = data;
             
            }

            if (obj.Type.indexOf("Tab0") >= 0 && obj.Datas) {
                for (var i = 0; i < obj.Datas.length; i++) {
                    var value = obj.Datas[i];
                    load(value);
                }
            }
        }

        function loadDatas(datas) {
            for (var i = 0; i < datas.Datas.length; i++) {
                var value = datas.Datas[i];
                load(value);
            }
        }

        loadDatas(datas);

        return JSON.stringify(json);
    }

    /**
     * 获取TextConfig.json
     * Get GameBaseConfig.json
     * @param {Object} datas 完整数据 , 不允许为空
     * @returns {String} TextConfig.json的内容
     */
    function GetTextConfigJson (datas) {
        var json = new Object();
        json.Txts = new Array();

        var links = new Object();

        function load(obj) {
            if (obj.Type.indexOf("Text") >= 0) {
            
                var data = new Object();
                data[obj.ID] = obj.Name;
                data.Text = obj.Value;
                json.Txts.push(data);
                links[obj.ID] = data;
            }

            if (obj.Type.indexOf("Tab0") >= 0 && obj.Datas) {
                for (var i = 0; i < obj.Datas.length; i++) {
                    var value = obj.Datas[i];
                    load(value);
                }
            }
        }

        function loadDatas(datas) {
            for (var i = 0; i < datas.Datas.length; i++) {
                var value = datas.Datas[i];
                load(value);
            }
        }

        loadDatas(datas);

        return JSON.stringify(json);
    }

    /**
     * 获取 DatasConfig.json
     * Get DatasConfig.json
     * @param {Object} datas 完整数据 , 不允许为空
     * @returns {String} DatasConfig.json的内容
     */
    function GetDatasConfigJson (datas) {
        var json = new Object();
        json.Datas = new Array();

        function load(lstDatas, parent) {
            var list = lstDatas.Datas;
            if (!list) return;
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];

                var data = JSON.parse(JSON.stringify(obj));
                var keys = Object.keys(data);
                for (var j = 0; j < keys.length; j++) {
                    var key0 = keys[j];
                    // 删除 带有Name字符 (非Nanme 非ShowName, ResourceName) 
                    if (key0.indexOf("Name") >= 0 &&
                        key0 !== "Name" && key0 !== "ShowName" && key0 !== "ResourceName") {
                        delete data[key0];
                    }
                    // 删除带有Text字符的字段
                    else if (key0.indexOf("Text") >= 0) {
                        delete data[key0];
                    }
                }

                if (obj.Type.indexOf("Tab0") >= 0) {

                    // 删除Template
                    if (data["Template"]) {
                        delete data["Template"];
                    }

                    // 关卡编辑判断
                    if (obj.Class && obj.Class === "LevelEdit") {
                        // Tab02不支持可视化编辑
                        if (obj.Type === "tab01" || obj.Type === "tab02") {
                            if (obj.Editable === undefined) {
                                obj.Editable = true;
                            }
                        }
                    }

                    // Datas数据递归
                    load(data, obj);
                    delete data.Datas;

                    if (!parent || !parent.Type) continue;

                    if (parent.Type === "Tab03") {
                        parent.Editable = parent.Editable === undefined ? true : parent.Editable;
                    }

                    if (!parent.Editable) continue;
                }

                data.ParantID = parent.ID;
                data.ParantIndex = i;
                json.Datas.push(data);
            }
        }

        load(datas);

        json.StaticData = datas.StaticData;
        if (!json.StaticData) {
            json.StaticData = new Object();
            json.StaticData.ID = "StaticData";
            json.StaticData.Name = "StaticData";
            json.StaticData.Type = "StaticData";
            json.StaticData.ShowName = "静态数据";
            json.StaticData.Datas = new Array();
        }
      
        return JSON.stringify(json);
    }

    /**
     * Package包组件
     * 生成和读取Package包数据的功能
     * @author 陈五洲(880123)
     */
    var module = {

         /**
         * 资源Zip包
         */
        PackageZip: null,


        /**
         * 保存至NDR，获取GUID
         * @param {Array} datas 多语言package包数据
         * @param {string} language 默认语言类型 , 不允许为空
         * @param {Function} progress 进度回调
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        UploadToNDR: function(datas, language, progress, success, error) {
            if (!datas) {
                if (error) error("No Data");
            }
            // 用户ID
            var userid = UtilBarn.EbUserId;
    
            // 上传到CS服务器的信息
            var mulangInfo = {};
            // 缺省数据
            var sourceInfo = {};
    
            var format = "application/zip";
            // 上传
            api.GetSession(userid, function (sessionData) {
             
                // 上传Package数据多语言包  进度 1 - 90
                function UploadPackages() {
    
                    var keys = Object.keys(datas);
                    
                    var index = 0;
                    var key = keys[index];
    
                    // 上传到CS服务器
                    UploadPkg2CS(datas[key], key, onUploadPkgSuc, onUploadPkgErr);         
    
                    // 上传CS 成功返回
                    function onUploadPkgSuc(){
    
                        console.log("Upload " + keys[index] + " Package Success.");
                        index++;
    
                        if (index === keys.length){
                            PostToNDR();
                        }
                        // 继续上传
                        else{
                            key = keys[index];
                            UploadPkg2CS(datas[key], key, onUploadPkgSuc, onUploadPkgErr);
                        }
                    }
    
                    // 上传CS 错误返回
                    function onUploadPkgErr(err){
                        if(error){
                            error("Upload " + keys[index] + " Package Failed :" + err);
                        }
                    }
    
                    // cs上传进度反馈
                    function upCsProgress(value){
                        value = Math.floor(value / 100 + index) * (90 / keys.length);
                        if (progress) progress(value, "Upload " + keys[index] + " Package");
                        console.log("Upload " + keys[index] + " Package :" + value + "%");
                    }
    
                    // 上传Package包到CS服务器
                    function UploadPkg2CS(blob, lkey){
    
                        upCsProgress(1);
                        var name = lkey + ".edpackage";
    
                        UtilBarn.Api.CS.UpLoadToCS(sessionData.session_id, sessionData.dist_path, name, blob, function (per, loader, total) {
                            upCsProgress( 2 + per * 98 / 100);
                        }, function (data) {
    
                            if (lkey === language){
                                sourceInfo = {
                                    'size': data.inode.size,
                                    'location': '${ref-path}' + data.path,
                                    'format': format,
                                    'md5': data.inode.md5
                                };
                            }
    
                            mulangInfo[lkey] = {
                                'size': data.inode.size,
                                'location': '${ref-path}' + data.path,
                                'format': format,
                                'md5': data.inode.md5
                            };
    
                            upCsProgress(100);
                            onUploadPkgSuc();
    
                        }, error); 
                    }   
                }
    
                // NDR上传进度反馈
                function upNdrProgress(value){
    
                    if (progress) progress(value, "UpLoad To NDR.");
                }
    
                // 上传到NDR
                function PostToNDR() {
                    upNdrProgress(91);
    
                    var ndrData = {
                        'title': "edpackage",
                        'preview': {
                            'png': ""
                        },
                        'language': 'zh-CN',
                        'identifier': sessionData.uuid,
                        'life_cycle': {
                            'version': '1.0',
                            'status': 'ONLINE',
                            'enable': true,
                            'creator': userid,
                            'publisher': 'NetDragon'
                        },
                        'categories': {
                            "assets_type": [{
                                'taxoncode': '$RA0106'
                            }, {
                                'taxoncode': 'RT022'
                            }, {
                                'taxoncode': '$RA1201'
                            }]
                        },
                        'tech_info': mulangInfo
                    };
    
                    ndrData.tech_info.source = sourceInfo;
                    ndrData.tech_info.href =  sourceInfo;
    
                    api.Post(sessionData.uuid, ndrData, function (data) {
                        upNdrProgress(100);
    
                        if (success) success(data.identifier);
                    }, error);
                }
    
                // 开始上传数据
                UploadPackages();
    
            }, error);
        },


        /**
         * 生成并上传游戏package包
         * @param {Object} datas 完整数据 , 不允许为空 
         *      {
         *          English: json,
         *          SimplifiedChinese: json,
         *          ..... 其他多语言数据
         *       }
         * @param {string} language 默认语言类型 , 不允许为空 
         * @param {Function} progress 进度回调,带number参数prg , 带string参数desc , 允许为空
         * @param {Function} success 成功回调,带Object类型参数Blob , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */

        UpLoadPackages: function (datas, language, progress, success, error) {  
            
            if (!datas ){
                if (error) error("Datas is Null or Empty!");
                return;
            }

            var keys = Object.keys(datas);

            if (keys.length === 0){
                if (error) error("Datas is Null or Empty!");
                return;
            }

            // 检测默认语言
            if (!datas[language]){
                if (error) error("Default Language is Null !");
                return;
            }

            var index = 0;
            var blobLst = {};
           
            function onBlobSuc(blob, lang){
                blobLst[lang] = blob;
                index++;

                if (index === keys.length){
                    // 第二步 上传Package包到NDR
                    module.UploadToNDR(blobLst, language, progress, success, error);
                }
                else{
                    key = keys[index];
                    module.GetPackageBlob(datas[key], key, onBlobSuc, onBlobErr);
                }
            }
            
            function onBlobErr(language){
                alert("GetPackageBlob " + language + " Failure");
            }
        
            /*
            * 第一步 生成package包数据
            */
            var key = keys[index];
            module.GetPackageBlob(datas[key], key, onBlobSuc, onBlobErr);
            
        },


        /**
        * 生成并上传游戏oackage包( 编辑器专用)
        * @param {Object} datas 完整数据 , 不允许为空 
        * @param {Function} progress 进度回调,带number参数prg , 带string参数desc , 允许为空
        * @param {Function} success 成功回调,带Object类型参数Blob , 带Function参数Object , 允许为空
        * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
        */
        UpLoadEditorPackage: function (datas, progress, success, error) {  

            module.GetPackageBlob(datas, UtilBarn.Language, function (blob) {
                var blobLst = {};
                blobLst[UtilBarn.Language] = blob;            
                module.UploadToNDR(blobLst, UtilBarn.Language, progress, success, error);
            }, error);        
        },


        /**
         * 生成单独语言PackageZip
         * @param {Object} datas 完整数据 , 不允许为空 
         * @param {string} language 语言类型 , 不允许为空 
         * @param {Function} success 成功回调,带Object类型参数Blob , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        GetPackageBlob: function (datas, language, success, error) {       

            Require([JSZipPath, JSZipUtilsPath], function () {

                var zip = new JSZip();
               
                zip.file('package/Config/GameBaseConfig.json', GetGameBaseConfigJson(datas));
                zip.file('package/Config/DatasConfig.json', GetDatasConfigJson(datas));
                zip.file('package/Config/AssetConfig.json', GetAssetConfigJson(datas));
                zip.file('package/Config/TxtConfig.json', GetTextConfigJson(datas));

                if (datas.StaticData && datas.StaticData.Redirect) {
                    zip.file('package/Config/Redirect.json', JSON.stringify(datas.StaticData.Redirect));
                }  
                
                zip.generateAsync({ type: "blob" }).then(function (blob) {
                    if (success) {
                        success(blob, language);
                    }
                    else {
                        error(language);
                    }
                });
            });
        },

        /**
         * 获取资源包数据
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数Zip包:Object
         * @param {Function} error 出错回调
         * @param {Boolean} async 是否异步
         */
        GetPackage: function (guid, success, error, async) {
            module.Get(guid, function (data) {

                var key = "source";
                // 模板数据 获取当前多语言数据
                if (UtilBarn.Access === 1){
                    if (data.tech_info[UtilBarn.Language]){
                        key = UtilBarn.Language;
                    }
                }

                var location = data.tech_info[key].location.replace('${ref-path}', '');
                var downloadUrl = UtilBarn.Protocol + "://" + UtilBarn.GetHost("CDNCS") + "/v0.1/static" + location;
                Require([JSZipPath, JSZipUtilsPath], function () {
                    JSZipUtils.getBinaryContent(downloadUrl, function (err, data) {
                        if (err && error) error(err);

                        JSZip.loadAsync(data).then(function (zip) {
                            module.PackageZip = zip;

                            if (success)
                                success();
                        });
                    });
                });
            }, error, async);
        },

         /**
         * 获取配置，需先获取资源包
         * @param {String} name 配置名称
         * @param {Function} success 成功回调,带配置Json对象:Object
         * @param {Function} error 出错回调
         * @param {String} guid 资源服务器GUID,默认为当前游戏GUID
         */
        GetConfig: function (name, success, error, guid) {

            if (!guid) {
                guid = UtilBarn.PackageGuid;
            }

            if (module.PackageZip === null) {
                if (guid) {
                    module.GetPackage(guid, function (obj) {
                        module.GetConfig(name, success, error, guid);
                    }, error, true);
                    return;
                }

                if (error)
                    error("Package Not Load");
                return;
            }

            var config = module.PackageZip.file('package\\Config\\' + name + '.json');
            if (!config) config = module.PackageZip.file('package/Config/' + name + '.json');
            if (!config) config = module.PackageZip.file('package\\\\Config\\\\' + name + '.json');
            if (!config) config = module.PackageZip.file('package//Config//' + name + '.json');
            if (config) {
                config.async('string').then(function (buffer) {
                    var content = "";
                    var obj = null;
                    if (buffer) {
                        content = buffer.toString();
                    }
                    else {
                        if (error)
                            error("Buffer Error");
                        return;
                    }
                    if (content) {
                        obj = JSON.parse(content);
                    }
                    else {
                        if (error)
                            error("Content Not A Json");
                        return;
                    }
                    if (obj) {
                        if (success)
                            success(obj);
                    }
                    else {
                        if (error)
                            error("Content Not A Json");
                        return;
                    }
                });
            }
            else if (name !== "DatasConfig") {
                module.GetConfig("DatasConfig", function (data) {
                    if (data && data.StaticData && data.StaticData[name]) {
                        if (success)
                            success(data.StaticData[name]);
                    }
                    else {
                        if (error)
                            error("Config Not Find");
                    }
                }, error);
                return;
            }
            else {
                if (error)
                    error("Config Not Find");
                return;
            }
        },

        /**
         * 请求资源
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {Boolean} async 是否异步
         */
        Get: function (guid, success, error, async) {
            if (async) {
                api.Get(guid, success, error);
                return;
            }
            var _url = '/v0.6/assets/' + guid + "?include=TI";
            var curl = UtilBarn.Protocol + "://" + UtilBarn.GetHost("NDR") + _url;
            $.ajax({
                url: curl,
                async: false,
                type: "GET",
                dataType: "json",
                success: function (ans) {
                    if (success)
                        success(ans);
                },
                error: function (err) {
                    if (error)
                        error(err);
                }
            });
        }

    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "Package"));