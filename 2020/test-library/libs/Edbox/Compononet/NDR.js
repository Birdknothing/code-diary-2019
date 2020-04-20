// Edbox NDR组件
(function (namespace, className) {
    var api = Edbox.Api.NDR;

    // 获取资源的其他信息
    function getSourceInfo(list) {
        if (!list) return null;
        var obj = new Object();
        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            if (!key.name) continue;
            obj[key.name] = key.value;
        }
        return obj;
    }

    // 获取多语言名称
    function getName(data) {
        var ans = data.title;
        if (!data.global_title) return ans;
        if (Edbox.Language === "English" && data.global_title["en-US"]) return data.global_title["en-US"];
        if (Edbox.Language === "TraditionalChinese" && data.global_title["zh-HK"]) return data.global_title["zh-HK"];
        // NDR1.0 未配置繁体台湾,直接使用香港繁体
        if (Edbox.Language === "TraditionalChinese_TW" && data.global_title["zh-HK"]) return data.global_title["zh-HK"];
        if (Edbox.Language === "SimplifiedChinese" && data.global_title["zh-CN"]) return data.global_title["zh-CN"];
        return ans;
    }
    
    function getEncodeLocation(location){
        var sp = location.split("/");
        var result = '';
        if(sp.length > 0){
            for(var i=0; i < sp.length - 1; i++){
                result = result + sp[i] + '/';
            }
            var params = sp[sp.length - 1].split("?");
            if(params.length === 2){
                result = result + encodeURIComponent(params[0]) + "?" + params[1];
            }else{
                result = result + encodeURIComponent(sp[sp.length - 1]);
            }
        }else{
            result = location;
        }
        return result;
    }

    /**
     * Edbox NDR组件
     * 用于Edbox平台的访问NDR服务器上传下载过程
     * @author 温荣泉(201901)
     * @see http://ndsdn.nd.com.cn/index.php?title=EdboxNDR%E7%BB%84%E4%BB%B6JS%E7%89%88
     */
    var module = {
        /**
         * 请求资源
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数Data:{Guid,Url,Type,Name}
         * @param {Function} error 出错回调
         * @param {Array} formats 指定格式支持队列,例如["mp3","ogg"] , 留空时获取源文件
         */
        Get: function (guid, success, error, formats) {
            // 是否为支持格式
            function isMeet(obj) {
                var type = obj.Type;
                if (!formats || formats.length === 0) {
                    return true;
                }
                for (var i = 0; i < formats.length; i++) {
                    var format = formats[i];
                    if (type.indexOf(format) > 0) {
                        return true;
                    }
                }
                return false;
            }

            api.Get(guid, function (ans) {
                var obj = new Object();
                obj.Guid = ans.identifier;
                obj.Name = getName(ans);
                obj.Preview = "";
                if (ans.preview && ans.preview.png) {
                    obj.Preview = getEncodeLocation(ans.preview.png).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                }
                if (obj.Preview === "" && ans.preview && ans.preview.cover) {
                    obj.Preview = getEncodeLocation(ans.preview.cover).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                }
                if (obj.Preview === "" && ans.preview) {
                    var keys = Object.keys(ans.preview);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        if (key === 240 || key === '240') {
                            var info = ans.preview[key];
                            obj.Preview = getEncodeLocation(info).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                        }
                    }
                }
                obj.Url = getEncodeLocation(ans.tech_info.source.location).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                obj.Type = ans.tech_info.source.format;
                obj.Size = ans.tech_info.source.size;
                obj.SourceInfo = getSourceInfo(ans.tech_info.source.requirements);
                if (obj.Url.substring(obj.Url.length - 4, obj.Url.length) === '.pkg') {
                    obj.Url = getEncodeLocation(ans.tech_info.config.location).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                    obj.Type = ans.tech_info.config.format;
                    obj.SourceInfo = getSourceInfo(ans.tech_info.config.requirements);
                }

                if (isMeet(obj)) {
                    if (success) {
                        success(obj);
                    }
                    return;
                }

                var keys = Object.keys(ans.tech_info);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var info = ans.tech_info[key];
                    obj.Url = getEncodeLocation(info.location).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                    obj.Type = info.format;
                    obj.Size = info.size;
                    obj.SourceInfo = getSourceInfo(ans.tech_info.source.requirements);
                    obj.Preview = getEncodeLocation(ans.preview.png).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                    if (isMeet(obj)) {
                        if (success) {
                            success(obj);
                        }
                        return;
                    }
                }
                if (error) {
                    error("No resource support specified format");
                }
            }, error);
        },

        /**
         * 基于Url后缀请求资源
         * @param {String} guid 资源服务器GUID
         * @param {Function} success 成功回调,带参数Data:{Guid,Url,Type,Name}
         * @param {Function} error 出错回调
         * @param {Array} formats 指定格式支持队列,例如["mp3","ogg"] , 留空时获取源文件
         */
        GetWithUrlFormats: function (guid, success, error, formats) {
            var url = '/v0.6/assets/' + guid;
            var data = "include=TI";

            // 是否为支持格式
            function isMeet(obj) {
                var info = obj.Url;
                if (!formats || formats.length === 0) {
                    return true;
                }
                for (var i = 0; i < formats.length; i++) {
                    var format = formats[i].toLowerCase();
                    if (info.toLowerCase().endsWith(format)) {
                        return true;
                    }
                }
                return false;
            }

            api.Get(guid, function (ans) {
                var obj = new Object();
                obj.Guid = ans.identifier;
                obj.Name = getName(ans);
                obj.Preview = "";
                if (ans.preview && ans.preview.png) {
                    obj.Preview = getEncodeLocation(ans.preview.png).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                }
                if (obj.Preview === "" && ans.preview && ans.preview.cover) {
                    obj.Preview = getEncodeLocation(ans.preview.cover).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                }
                if (obj.Preview === "" && ans.preview) {
                    var keys = Object.keys(ans.preview);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        if (key === 240 || key === '240') {
                            var info = ans.preview[key];
                            obj.Preview = getEncodeLocation(info).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                        }
                    }
                }
                obj.Url = getEncodeLocation(ans.tech_info.source.location).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                obj.Type = ans.tech_info.source.format;
                obj.Size = ans.tech_info.source.size;
                obj.SourceInfo = getSourceInfo(ans.tech_info.source.requirements);

                if (isMeet(obj)) {
                    if (success) {
                        success(obj);
                    }
                    return;
                }

                var keys = Object.keys(ans.tech_info);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var info = ans.tech_info[key];
                    obj.Url = getEncodeLocation(info.location).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                    obj.Type = info.format;
                    obj.Size = info.size;
                    obj.SourceInfo = getSourceInfo(ans.tech_info.source.requirements);

                    if (isMeet(obj)) {
                        if (success) {
                            success(obj);
                        }
                        return;
                    }
                }
                if (error) {
                    error("No resource support specified format");
                }
            }, error);
        },

        /**
         * 请求资源列表
         * @param {Array} array 资源服务器GUID
         * @param {Function} success 成功回调,带参数Object:{"Guid":{Guid,Url,Type,Name}}
         * @param {Function} error 出错回调
         * @param {Array} formats 指定格式支持队列,例如["mp3","ogg"] , 留空时获取源文件
         */
        GetList: function (array, success, error, formats) {
            if (!array || array.length === 0) {
                if (error) {
                    error("No Datas");
                }
                return;
            }

            function handle(arr) {
                // 遍历arr，把元素分别放入tmp数组(不存在才放)
                var temp = new Array();
                var left = new Array();
                for (var i in arr) {
                    //该元素在temp内部不存在才允许追加
                    if (temp.indexOf(arr[i]) === -1) {
                        if (temp.length < 100)
                            temp.push(arr[i]);
                        else {
                            left.push(arr[i]);
                        }
                    }
                }
                return [temp, left];
            }
            var ans = handle(array);
            array = ans[0];
            var left = ans[1];

            // 是否为支持格式
            function isMeet(obj) {
                var type = obj.Type;
                if (!formats || formats.length === 0) {
                    return true;
                }
                for (var i = 0; i < formats.length; i++) {
                    var format = formats[i];
                    if (type.indexOf(format) > 0) {
                        return true;
                    }
                }
                return false;
            }

            function getInfo(ans, success, error) {
                var obj = new Object();
                obj.Guid = ans.identifier;
                obj.Name = getName(ans);
                obj.Preview = "";
                if (ans.preview && ans.preview.png) {
                    obj.Preview = getEncodeLocation(ans.preview.png).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                }
                if (obj.Preview === "" && ans.preview && ans.preview.cover) {
                    obj.Preview = getEncodeLocation(ans.preview.cover).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                }
                if (obj.Preview === "" && ans.preview) {
                    var keys = Object.keys(ans.preview);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        if (key === 240 || key === '240') {
                            var info = ans.preview[key];
                            obj.Preview = getEncodeLocation(info).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                        }
                    }
                }
                obj.Url = getEncodeLocation(ans.tech_info.source.location).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                obj.Type = ans.tech_info.source.format;
                obj.Size = ans.tech_info.source.size;
                obj.SourceInfo = getSourceInfo(ans.tech_info.source.requirements);

                if (isMeet(obj)) {
                    if (success) {
                        success(obj);
                    }
                    return;
                }

                var keys = Object.keys(ans.tech_info);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var info = ans.tech_info[key];
                    obj.Url = getEncodeLocation(info.location).replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                    obj.Type = info.format;
                    obj.Size = info.size;
                    obj.SourceInfo = getSourceInfo(ans.tech_info.source.requirements);

                    if (isMeet(obj)) {
                        if (success) {
                            success(obj);
                        }
                        return;
                    }
                }
                if (error) {
                    error("No resource support specified format");
                }
            }

            api.GetList(array, function (ans) {
                function answer(result) {
                    if (left && left.length > 0) {
                        module.GetList(left, function (datas) {
                            var keys = Object.keys(datas);
                            for (var i = 0; i < keys.length; i++) {
                                var key = keys[i];
                                result[key] = datas[key];
                            }
                            if (success) {
                                success(result);
                            }
                        }, error, formats);
                    } else {
                        if (success) {
                            success(result);
                        }
                    }
                }

                var keys = Object.keys(ans);
                var datas = new Object();
                if (keys.length === 0) {
                    answer(datas);
                }
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    getInfo(ans[key], function (info) {
                        datas[key] = info;
                        if (i === keys.length - 1) {
                            answer(datas);
                        }
                    }, function (err) {
                        if (i === keys.length - 1) {
                            answer(datas);
                        }
                    });
                }
            }, error);
        },

        /**
         * 上传资源
         * @param {String} data Base64数据
         * @param {String} name 名称
         * @param {Function} progress 进度显示
         * @param {Function} success 成功回调,带参数Data:{Guid,Url,Type,Name}
         * @param {Function} error 出错回调
         */
        Post: function (data, name, progress, success, error) {
            var session;
            var userid = Edbox.EbUserId;
            var blob = module.Base64ToBlob(data);
            var format = blob.type;
            if (!format || format.length < 1) {
                format = getType(name);
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
                    case "gif":
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
                    case "assetbundle":
                        fmt = "application/octet-stream";
                        break;
                    default:
                        break;
                }
                return fmt;
            }

            if (getExtend(name) === 'zip') {
                name = getFileName(name) + '.' + "edpackage";
            }

            var title = getFileName(name);
            name = title + '.' + getExtend(name);

            // 获取Session
            function getSession() {

                var sessionAjax = api.GetSession(userid, uploadToCS, error);

                if (progress) {
                    progress("getsession", 0, sessionAjax);
                }
            }

            // 上传到CS服务器
            function uploadToCS(sessionData) {

                var uploadAjax = null;

                session = sessionData;
                var tmpName = Edbox.GetGUID() + '.' + getExtend(name);
                uploadAjax = sendAjax = Edbox.Api.CS.UpLoadToCS(sessionData.session_id, sessionData.dist_path, tmpName, blob, function (per, loader, total) {
                    if (progress) {
                        progress("uploadtocs", 10 + Math.floor(per * 70 / 100), uploadAjax);
                    }
                }, buildNdrResource, error);

                if (progress) {
                    progress("uploadtocs", 10, uploadAjax);
                }
            }

            // 上传到NDR
            function buildNdrResource(data) {

                var filelocation = '${ref-path}' + data.path;
                var nData = {
                    'title': title,
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
                            'taxoncode': '$RA0106'
                        }, {
                            'taxoncode': 'RT022'
                        }, {
                            'taxoncode': '$RA1201'
                        }]
                    },
                    'tech_info': {
                        'source': {
                            'size': data.inode.size,
                            'location': filelocation,
                            'format': format,
                            'md5': data.inode.md5
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
                        obj.Type = ans.tech_info.source.format;
                        obj.Name = ans.title;
                        obj.Preview = "";
                        if (ans.preview && ans.preview.png) {
                            obj.Preview = ans.preview.png.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                        }
                        if (obj.Preview === "" && ans.preview && ans.preview.cover) {
                            obj.Preview = ans.preview.cover.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                        }
                        if (obj.Preview === "" && ans.preview) {
                            var keys = Object.keys(ans.preview);
                            for (var i = 0; i < keys.length; i++) {
                                var key = keys[i];
                                if (key === 240 || key === '240') {
                                    var info = ans.preview[key];
                                    obj.Preview = info.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                                }
                            }
                        }
                        success(obj);
                    }
                }

                var ndrAjax = api.Post(session.uuid, nData, handle, error);

                if (progress) {
                    progress("createndrsource", 90, ndrAjax);
                }
            }

            // 开始执行
            getSession();
        },

        /**
         * 更新资源
         * @param {String} data Base64数据
         * @param {String} resId ndr资源id
         * @param {String} name 文件名
         * @param {Function} progress 进度显示
         * @param {Function} success 成功回调,带参数Data:{Guid,Url,Type,Name}
         * @param {Function} error 出错回调
         */
        Put: function (data, resId, name, progress, success, error) {
            var session;
            var userid = Edbox.EbUserId;
            var blob = module.Base64ToBlob(data);
            var format = blob.type;
            if (!format || format.length < 1) {
                format = getType(name);
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
                    case "gif":
                        fmt = "image/" + ext;
                        break;
                    case "zip":
                    case "rar":
                    case "json":
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
                    case "assetbundle":
                        fmt = "application/octet-stream";
                        break;
                    default:
                        break;
                }
                return fmt;
            }

            name = getFileName(name) + "_" + Edbox.GetGUID() + '.' + getExtend(name);

            // 获取Session
            function getSession() {
                progress("getsession", 0);

                api.GetUpdateSession(userid, resId, uploadToCS, error);
            }

            // 上传到CS服务器
            function uploadToCS(sessionData) {
                progress("uploadtocs", 10);

                session = sessionData;
                var tmpName = Edbox.GetGUID() + '.' + getExtend(name);
                Edbox.Api.CS.UpLoadToCS(sessionData.session_id, sessionData.dist_path, tmpName, blob, function (per, loader, total) {
                    progress("uploadtocs", 10 + Math.floor(per * 70 / 100));
                }, buildNdrResource, error);
            }

            // 上传到NDR
            function buildNdrResource(data) {
                progress("createndrsource", 90);

                api.Get(resId, function (ndrData) {
                    if (ndrData !== null) {
                        var filelocation = '${ref-path}' + data.path;

                        var handle = function (ans) {
                            //console.log(ans);
                            if (success) {
                                var obj = new Object();
                                obj.Guid = ans.identifier;
                                obj.Url = filelocation.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                                obj.Type = format;
                                obj.Name = ans.title;
                                obj.Preview = "";
                                if (ans.preview && ans.preview.png) {
                                    obj.Preview = ans.preview.png.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                                }
                                if (obj.Preview === "" && ans.preview && ans.preview.cover) {
                                    obj.Preview = ans.preview.cover.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                                }
                                if (obj.Preview === "" && ans.preview) {
                                    var keys = Object.keys(ans.preview);
                                    for (var i = 0; i < keys.length; i++) {
                                        var key = keys[i];
                                        if (key === 240 || key === '240') {
                                            var info = ans.preview[key];
                                            obj.Preview = info.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                                        }
                                    }
                                }
                                success(obj);
                            }
                        };

                        ndrData.categories = {};
                        ndrData.categories.assets_type = new Array();
                        ndrData.categories.assets_type.push({ 'taxoncode': '$RA0106' });
                        ndrData.categories.assets_type.push({ 'taxoncode': 'RT022' });
                        ndrData.categories.assets_type.push({ 'taxoncode': '$RA1201' });
                        ndrData.tech_info.source = {};
                        ndrData.tech_info.source.size = data.inode.size;
                        ndrData.tech_info.source.location = filelocation;
                        ndrData.tech_info.source.format = format;
                        ndrData.tech_info.source.md5 = data.inode.md5;
                        api.Update(resId, ndrData, handle, error);
                    } else {
                        error();
                    }
                }, error);

            }

            // 开始执行
            getSession();
        },

        /**
         * 上传预览图
         * @param {String} data Base64数据
         * @param {String} resId ndr资源id
         * @param {String} name 文件名称
         * @param {Function} progress 进度显示
         * @param {Function} success 成功回调,带参数Data:{Guid,Url,Type,Name}
         * @param {Function} error 出错回调
         */
        SetPreview: function (data, resId, name, progress, success, error) {
            var session;
            var userid = Edbox.EbUserId;
            var blob = module.Base64ToBlob(data);
            var format = blob.type;
            if (!format || format.length < 1) {
                format = getType(name);
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
                    case "gif":
                        fmt = "image/" + ext;
                        break;
                    default:
                        break;
                }
                return fmt;
            }

            name = getFileName(name) + "_" + Edbox.GetGUID() + '.' + getExtend(name);

            // 获取Session
            function getSession() {
                progress("getsession", 0);

                api.GetUpdateSession(userid, resId, uploadToCS, error);
            }

            // 上传到CS服务器
            function uploadToCS(sessionData) {
                progress("uploadtocs", 10);

                session = sessionData;
                var tmpName = Edbox.GetGUID() + '.' + getExtend(name);
                Edbox.Api.CS.UpLoadToCS(sessionData.session_id, sessionData.dist_path, tmpName, blob, function (per, loader, total) {
                    progress("uploadtocs", 10 + Math.floor(per * 70 / 100));
                }, buildNdrResource, error);
            }

            // 上传到NDR
            function buildNdrResource(data) {
                progress("createndrsource", 90);

                api.Get(resId, function (ndrData) {
                    if (ndrData !== null) {
                        var preview = '${ref-path}' + data.path;

                        function handle(ans) {
                            //console.log(ans);
                            if (success) {
                                var obj = new Object();
                                obj.Guid = ans.identifier;
                                obj.Url = preview.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                                obj.Type = format;
                                obj.Name = ans.title;
                                obj.Preview = "";
                                if (ans.preview && ans.preview.png) {
                                    obj.Preview = ans.preview.png.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                                }
                                if (obj.Preview === "" && ans.preview && ans.preview.cover) {
                                    obj.Preview = ans.preview.cover.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                                }
                                if (obj.Preview === "" && ans.preview) {
                                    var keys = Object.keys(ans.preview);
                                    for (var i = 0; i < keys.length; i++) {
                                        var key = keys[i];
                                        if (key === 240 || key === '240') {
                                            var info = ans.preview[key];
                                            obj.Preview = info.replace('${ref-path}', Edbox.Protocol + "://" + Edbox.GetHost("CDNCS") + "/v0.1/static");
                                        }
                                    }
                                }
                                success(obj);
                            }
                        }

                        ndrData.preview.png = preview;
                        ndrData.categories = {};
                        ndrData.categories.assets_type = new Array();
                        ndrData.categories.assets_type.push({ 'taxoncode': '$RA0106' });
                        ndrData.categories.assets_type.push({ 'taxoncode': 'RT022' });
                        ndrData.categories.assets_type.push({ 'taxoncode': '$RA1201' });
                        api.Update(resId, ndrData, handle, error);
                    } else {
                        error();
                    }
                }, error);

            }

            // 开始执行
            getSession();
        },

        /**
         * 获取File的文本类型数据
         * @param {Object} file 输入文件
         * @param {Function} success 成功回调，带对象参数，对象带参数文件名称Name、文本二进制数据Data
         * @param {Function} error 失败回调
         */
        GetFileData: function (file, success, error) {
            var reader = new FileReader();
            reader.onload = function () {
                var obj = new Object();
                obj.Name = file.name;
                obj.Data = reader.result;
                if (success) success(obj);
            };
            reader.onerror = function (e) {
                if (error) error(e);
            };
            reader.readAsDataURL(file);
        },

        /**
         * Base64转Blob
         * @param {String} data Base64数据
         * @return {Object} Blob对象
         */
        Base64ToBlob: function (data) {
            var parts = data.split(';base64,');
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;
            var uInt8Array = new Uint8Array(rawLength);
            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {
                type: contentType
            });
        },

        /**
         * Blob转Base64数据
         * @param {Object} blob Blob对象
         * @param {Function} success 成功回调,带String类型参数Base64数据
         */
        BlobToBase64: function (blob, success) {
            var a = new FileReader();
            a.onload = function (e) {
                if (success)
                    success(e.target.result);
            };
            a.readAsDataURL(blob);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "NDR"));