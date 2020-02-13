// 帧动画组件
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

    /**
     * 根据GUID获取帧动画数据
     * @param {String} guid NDR上的资源GUID
     * @param {String} success 成功回调
     * @param {String} error 失败回调
     */
    function Get(guid, success, error) {
        api.Get(guid, function (data) {
            var url = data.tech_info.source.location.replace('${ref-path}', UtilBarn.Protocol + "://" + UtilBarn.GetHost("CDNCS") + "/v0.1/static");
            Require([JSZipPath, JSZipUtilsPath], function () {
                JSZipUtils.getBinaryContent(url, function (err, data) {
                    if (err && error) error(err);

                    JSZip.loadAsync(data).then(function (zip) {
                        var data = new Array();

                        var config = zip.file('package/Config/Config.json');
                        config.async('string').then(function (buffer) {
                            var content = "";
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

                                Handle(obj);
                            }
                            else {
                                if (error)
                                    error("Content Not A Json");
                                return;
                            }
                        });

                        function Handle(obj) {
                            var times = obj.Times;
                            var i = 0;

                            function getdatas() {
                                if (i >= times.length) {
                                    if (success) success(data);

                                    return;
                                }
                                var file = zip.file('package/Image/' + i.toString() + '.png');
                                file.async('base64').then(function (buffer) {
                                    data[i] = {
                                        clip: "data:image/png;base64," + buffer,
                                        time: times[i]
                                    };

                                    i += 1;
                                    getdatas();
                                });
                            }
                            getdatas();
                        }
                    });
                });
            });
        }, error);
    }

    /**
     * 根据GUID获取预览图数据
     * @param {String} guid NDR上的资源GUID
     * @param {String} success 成功回调
     * @param {String} error 失败回调
     */
    function GetPreview(guid, success, error) {
        api.Get(guid, function (data) {
            if (!data.preview.png) {
                if (error) error("No Preview");
                return;
            }
            var url = data.preview.png.replace('${ref-path}', UtilBarn.Protocol + "://" + UtilBarn.GetHost("CDNCS") + "/v0.1/static");
            if (success) success(url);
        }, error);
    }

    /**
     * 根据GUID获取图集数据
     * @param {String} guid NDR上的资源GUID
     * @param {String} success 成功回调
     * @param {String} error 失败回调
     */
    function GetAtlas(guid, success, error) {
        api.Get(guid, function (data) {
            if (!data.tech_info.atlas) {
                if (error) error("No Atlas");
                return;
            }
            var url = data.tech_info.atlas.location.replace('${ref-path}', UtilBarn.Protocol + "://" + UtilBarn.GetHost("CDNCS") + "/v0.1/static");
            if (success) success(url);
        }, error);
    }

    /**
     * 根据帧动画数据获取Zip数据包
     * @param {Array} data 帧动画数据
     * @param {String} success 成功回调
     * @param {String} error 失败回调
     */
    function GetZip(data, success, error) {
        Require([JSZipPath, JSZipUtilsPath], function () {
            var zip = new JSZip();
            var config = new Object();
            config.Times = new Array();

            for (var i = 0; i < data.length; i++) {
                var info = data[i];
                var clip = info.clip;
                var arr = clip.split(',');
                var img = arr[1];
                var time = info.time;
                config.Times[i] = time;
                zip.file('package/Image/' + i.toString() + '.png', img, { base64: true });//根据base64数据在压缩包中生成jpg数据
            }

            zip.file('package/Config/Config.json', JSON.stringify(config));

            zip.generateAsync({ type: "blob" }).then(function (blob) {
                if (success) {
                    success(blob);
                }
                else {
                    error();
                }
            });
        });
    }

    /**
     * 保存至NDR，获取GUID
     * @param {Array} data 帧动画数据
     * @param {String} preview 预览图数据
     * @param {String} atlas 图集数据
     * @param {Function} progress 进度回调
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    function Set(data, preview, atlas, progress, success, error) {
        if (!data) {
            if (error) error("No Data");
        }
        // 用户ID
        var userid = UtilBarn.EbUserId;
        // 预览图
        var previewPath = "";
        // 图集
        var atlasData = null;
        // Zip数据包
        var zipData = null;

        // 获取Session
        api.GetSession(userid, function (sessionData) {
            // 上传预览图 1 - 20
            function UploadPreview() {
                if (preview) {
                    var blob = UtilBarn.NDR.Base64ToBlob(preview);
                    if (progress) progress("上传预览图", 1);

                    progress("上传预览图", 2);

                    var format = blob.type;
                    var name = "preview";
                    if (!format || format.length < 1) {
                        format = "image/png";
                    }
                    name += format.replace("image/", ".");

                    UtilBarn.Api.CS.UpLoadToCS(sessionData.session_id, sessionData.dist_path, name, blob, function (per, loader, total) {
                        progress("上传预览图", 2 + Math.floor(per * 18 / 100));

                        UploadAtlas();
                    }, function (data) {
                        previewPath = '${ref-path}' + data.path;
                    }, error);
                }
                else {
                    UploadAtlas();
                }
            }

            // 上传图集 21 - 50
            function UploadAtlas() {
                if (atlas) {
                    var blob = UtilBarn.NDR.Base64ToBlob(atlas);
                    if (progress) progress("上传图集", 21);

                    progress("上传图集", 22);

                    var format = blob.type;
                    var name = "atlas";
                    if (!format || format.length < 1) {
                        format = "image/png";
                    }
                    name += format.replace("image/", ".");

                    UtilBarn.Api.CS.UpLoadToCS(sessionData.session_id, sessionData.dist_path, name, blob, function (per, loader, total) {
                        progress("上传图集", 22 + Math.floor(per * 28 / 100));
                    }, function (data) {
                        atlasData = {
                            'size': data.inode.size,
                            'location': '${ref-path}' + data.path,
                            'format': format,
                            'md5': data.inode.md5
                        };

                        UploadZip();
                    }, error);
                }
                else {
                    UploadZip();
                }
            }

            // 获取Session上传Zip数据包 51 - 90
            function UploadZip() {
                GetZip(data, function (blob) {
                    if (progress) progress("上传Zip数据包", 51);

                    progress("上传Zip数据包", 52);
                    UtilBarn.Api.CS.UpLoadToCS(sessionData.session_id, sessionData.dist_path, "data.gzip", blob, function (per, loader, total) {
                        progress("上传Zip数据包", 52 + Math.floor(per * 38 / 100));
                    }, function (data) {
                        var format = "application/zip";
                        zipData = {
                            'size': data.inode.size,
                            'location': '${ref-path}' + data.path,
                            'format': format,
                            'md5': data.inode.md5
                        };

                        PostToNDR();
                    }, error);
                }, error);
            }

            // 上传到NDR
            function PostToNDR() {
                progress("上传到NDR", 91);

                var ndrData = {
                    'title': "Frame Animation",
                    'preview': {
                        'png': previewPath
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
                    'tech_info': {}
                };

                if (atlasData) {
                    drData.tech_info.atlas = atlasData;
                }

                if (zipData) {
                    ndrData.tech_info.zip = zipData;
                    ndrData.tech_info.source = zipData;
                }

                api.Post(sessionData.uuid, ndrData, function (data) {
                    progress("上传到NDR", 100);

                    if (success) success(data.identifier);
                }, error);
            }

            UploadPreview();
        }, error);
    }

    /**
     * 帧动画组件
     * 提供帧动画获取与保存的能力
     * @author 温荣泉(201901)
     */
    var module = {
        /**
         * 根据GUID获取帧动画数据
         * @param {String} guid NDR上的资源GUID
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        Get(guid, success, error) {
            Get(guid, success, error);
        },

        /**
         * 根据GUID获取预览图数据
         * @param {String} guid NDR上的资源GUID
         * @param {String} success 成功回调
         * @param {String} error 失败回调
         */
        GetPreview(guid, success, error) {
            GetPreview(guid, success, error);
        },

        /**
         * 根据GUID获取图集数据
         * @param {String} guid NDR上的资源GUID
         * @param {String} success 成功回调
         * @param {String} error 失败回调
         */
        GetAtlas(guid, success, error) {
            GetAtlas(guid, success, error);
        },

        /**
         * 保存至NDR，获取GUID
         * @param {Array} data 帧动画数据
         * @param {String} preview 预览图数据
         * @param {String} atlas 图集数据
         * @param {Function} progress 进度回调
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        Set(data, preview, atlas, progress, success, error) {
            Set(data, preview, atlas, progress, success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "FrameAnimation"));