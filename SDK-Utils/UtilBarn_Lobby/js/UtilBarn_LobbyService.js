// UtilBarn 大厅业务逻辑组件， 内部逻辑整理使用， 不需要写ts
(function (namespace, className) {
    /**
     * 声明个私有变量api
     */
    var api = UtilBarn.Api.MMO;

    var tagMap = new Dictionary();
    var imageMap = new Dictionary();
    var progressMap = new Dictionary();
    var publishAppMap = new Dictionary();
    var publishTagsMap = new Dictionary();
    var allTagNames = [];
    var publishVersion = 0;

    // IM查询数据
    var _imData = {
        key : '',   // 关键字
        offset : 0, // 当前偏移量

        // 单次查询数据结果
        data : {
            offset : 0, // 查询的偏移量
            items : []  // 用户数据
        }
    };

    var config = {
        /**
         * ConfigGuid域名配置包在服务后台的id
         */
        ConfigGuid: {
            QA: "681fd75a-e77b-afcb-481c-39a15ccef521",
            Dev: "bcbdae7c-d1f0-d1cb-09d2-b0e2ded89a5a",
            Feature: "a0fabf0c-4988-2ad9-7c4c-bbf80c3890d9",
            CN: "d017e42d-6c6c-6982-14d5-a425c4e23ef6",
            BetaCN: "c1054e19-b7e3-313f-ef3d-4e34eb6e5aac",
            HK: "",
            US: "d05ceb51-f4b4-4938-f225-2ab43fa93881",
            Beta: "5ca2fc3c-dca6-da00-d572-18df84d3c676"
        },
        /**
         * 基础服务程序包在服务后台的id，用于更新
         */
        ProgramGuid: {
            QA: "b31f7d3f-f5fe-dbb3-12da-c9c2ffcc8d8f",
            Dev: "3627f47c-db07-b36c-29e5-f9011bbe441a",
            Feature: "eadb8780-3a1a-8858-f819-120e63b65cbd",
            CN: "19fba8cd-eb6c-e030-f7ae-2f136672d5a4",
            BetaCN: "9ac7baa7-9c09-c69e-f2c0-cbbbf2c60763",
            HK: "",
            US: "5a071066-be46-ce3d-df92-4be16561283b",
            Beta: "1f892a14-b4d5-aee0-8d9e-232e41b92ba4"
        },
        /**
         * Html5Player程序包在服务后台的id
         */
        Html5PlayerId: {
            QA: "6eb4c904-c320-5679-28ec-78d8864679c4",
            Dev: "fb42879f-d277-49cc-c153-caefa22f3267",
            Feature: "823efda6-d3f1-e261-e34f-8b485982dfd6",
            CN: "4021ec0a-7741-320b-a8ae-219b6f2fc5a4",
            BetaCN: "7d4cf2f9-263b-94c2-630e-840f991f0165",
            HK: "",
            US: "bcf5034f-22e3-343f-5c24-9d43d2da150d",
            Beta: "269cf52f-e4c8-25bc-0b57-175f5560bf05"
        },
        /**
         * 基础服务程序包在服务后台的id，用于更新
         */
        ApkToolId: {
            QA: "291888de-ccbc-41f1-909a-62935f3142f4",
            Dev: "a39415cb-1009-80e6-e13e-ce53c9d2925d",
            Feature: "44167a59-64f8-bd63-67eb-d89ba353b6f5",
            CN: "92e5a457-0e4f-60fd-ecfa-a3cd3f8ff37c",
            BetaCN: "b227fddd-f5dc-5fd9-982b-d6fbd3af1588",
            HK: "",
            US: "41143802-57a4-3208-e027-7a4eedab1083",
            Beta: "1ef2649e-57eb-1d24-6256-679f3cf6f981"
        },
        /**
         * 基础服务安装程序在服务后台的id
         */
        BaseServiceExeId: {
            QA: "a5b082d8-a968-240b-d376-65eb7b87d5e7",
            Dev: "b2dd0929-6f5e-0799-d4f4-64a806ceba5b",
            Feature: "835ba3df-8bab-0ba6-771e-4458abfe4b7c",
            CN: "09df2ad0-a14c-89c1-995e-edbefa5c266c",
            BetaCN: "364bbc6c-ad5e-a1c8-75ba-ea06ce9defd0",
            HK: "",
            US: "a7913bc2-6874-e0d2-5d46-c4dc4e210e53",
            Beta: "dbda1efd-219e-e641-b750-13eb050f8486"
        },
        /**
         * WebIM的域名
         */
        WebIMHost: {
            QA: "webim.UtilBarn-cn.101.com",
            Dev: "webim.UtilBarn-cn.101.com",
            Feature: "webim.UtilBarn-cn.101.com",
            CN: "webim.UtilBarn-cn.101.com",
            BetaCN: "webim.UtilBarn-cn.101.com",
            HK: "webim.UtilBarn-cn.101.com",
            US: "webim.UtilBarn.101.com",
            Beta: "webim.UtilBarn.101.com"
        },
        /**
         * Lib配置
         */
        LibConfig:{
            QA: {
                Host: "library.UtilBarn-cn.101.com",
                Url: "/?locale={0}",
                CodeLibHost: "http://library.UtilBarn-cn.101.com/?locale={0}&__mac="
            },
            Dev: {
                Host: "library.UtilBarn-cn.101.com",
                Url: "/?locale={0}",
                CodeLibHost: "http://library.UtilBarn-cn.101.com/?locale={0}&__mac="
            },
            Feature: {
                Host: "library.UtilBarn-cn.101.com",
                Url: "/?locale={0}",
                CodeLibHost: "http://library.UtilBarn-cn.101.com/?locale={0}&__mac="
            },
            CN: {
                Host: "library.UtilBarn-cn.101.com",
                Url: "/?locale={0}",
                CodeLibHost: "http://library.UtilBarn-cn.101.com/?locale={0}&__mac="
            },
            BetaCN: {
                Host: "library.UtilBarn-cn.101.com",
                Url: "/?locale={0}",
                CodeLibHost: "http://library.UtilBarn-cn.101.com/?locale={0}&__mac="
            },
            HK: {
                Host: "UtilBarn-en.e.awsca.101.com",
                Url: "/market/",
                CodeLibHost: "http://UtilBarn-en.e.awsca.101.com/market/#/UtilBarn-en?show_rank=false&show_upload=true&locale=en-US&__mac="
            },
            US: {
                Host: "UtilBarn-en.e.awsca.101.com",
                Url: "/market/",
                CodeLibHost: "http://UtilBarn-en.e.awsca.101.com/market/#/UtilBarn-en?show_rank=false&show_upload=true&locale=en-US&__mac="
            },
            Beta: {
                Host: "UtilBarn-en.e.awsca.101.com",
                Url: "/market/",
                CodeLibHost: "http://UtilBarn-en.e.awsca.101.com/market/#/UtilBarn-en?show_rank=false&show_upload=true&locale=en-US&__mac="
            }
        },
        /**
         * Elearning配置
         */
        ElearningConfig: {
            QA: {
                Host: "elearning.UtilBarn-cn.101.com",
                Url: "/home/auto_portal_app_190314103432",
                Head: "http://"
            },
            Dev: {
                Host: "elearning.UtilBarn-cn.101.com",
                Url: "/home/auto_portal_app_190314103432",
                Head: "http://"
            },
            Feature: {
                Host: "elearning.UtilBarn-cn.101.com",
                Url: "/home/auto_portal_app_190314103432",
                Head: "http://"
            },
            CN: {
                Host: "elearning.UtilBarn-cn.101.com",
                Url: "/home/auto_portal_app_190314103432",
                Head: "http://"
            },
            BetaCN: {
                Host: "elearning.UtilBarn-cn.101.com",
                Url: "/home/auto_portal_app_190314103432",
                Head: "http://"
            },
            HK: {
                Host: "elearning.UtilBarn-cn.101.com",
                Url: "/home/auto_portal_app_190314103432",
                Head: "http://"
            },
            US: {
                Host: "elearning.UtilBarn.101.com",
                Url: "/home/auto_portal_app_190314033325",
                Head: "http://"
            },
            Beta: {
                Host: "elearning.UtilBarn.101.com",
                Url: "/home/auto_portal_app_190314033325",
                Head: "http://"
            }
        }
    };
    /**
     * 作品库标识
     * @property *{int} base 模板库
     * @property *{int} personal 个人库
     * @property *{int} released 发布库(体验区)
     */
    var accessType = {
        base: 1,
        personal: 2,
        released: 3
    };

    /**
     * 作品操作状态
     * @property *{int} create 创建作品状态
     * @property *{int} update 更新作品状态
     */
    var releaseMode = {
        create: 1,
        update: 2
    };

    var tagList = {};

    /**
     * UtilBarn 大厅业务逻辑组件， 内部逻辑整理使用， 不需要写ts
     * 用于UtilBarn平台大厅的业务逻辑
     * @author 余晓(871129)
     * */
    var module = {
        // 数组转字串
        GetArrayString: function (array) {
            if (Array.isArray(array)) {
                var txt = "";
                for (var i = 0; i < array.length; i++) {
                    if (i !== 0) {
                        txt += ",";
                    }
                    txt += array[i];
                }
                return txt;
            }
            else {
                return array;
            }
        },

        /**
         * 固定标签编码余名称映射列表获取
              * @param {Function} success 成功回调
              * @param {Function} error 出错回调
         */
        GetTagsList: function (success, error) {
            api.GetTagMap(
                function (data) {
                    if (success) success(data);
                },
                function (e) {
                    if (error) error(e);
                }
            );
        },

        /**
         * 根据标签码获取指定标签格式数组
              * @param {array} codes 标签码
         */
        GetTagsByCodes: function (codes) {
            var list = [];
            if (tagMap && codes) {
                for (var i = 0; i < codes.length; i++) {
                    var isContains = false;
                    for (var j = 0; j < tagMap.Keys.length; j++) {
                        var key = tagMap.Keys[j];
                        if (key === codes[i]) {
                            isContains = true;
                            var ob = new Object;
                            ob.id = key;
                            ob.value = tagMap.Get(key).lvl2name;
                            list.push(ob);
                        }
                    }
                    if(!isContains){
                        list.push(codes[i]);
                    }
                }
            }
            return list;
        },

        /**
         * 根据标签码获取标签名称数组
              * @param {array} codes 标签码
         */
        GetTagNamesByCodes: function (codes) {
            var list = [];
            if (tagMap && codes) {
                for (var i = 0; i < codes.length; i++) {
                    for (var j = 0; j < tagMap.Keys.length; j++) {
                        var key = tagMap.Keys[j];
                        if (key === codes[i]) {
                            list.push(tagMap.Get(key).lvl2name);
                        }
                    }
                }
            }
            return list;
        },

        GetReleaseMode: function () {
            return releaseMode;
        },

        GetAccessType: function () {
            return accessType;
        },

        GetTagList: function () {
            if (tagList.Tags) {
                var succ = function (dataObj) {
                    tagList.Tags = dataObj.taglist;
                    return tagList;
                };
                var err = function () {
                    console.log("Get official tags error");
                };
                api.GetTagMap(succ, err);
            }
            else {
                return tagList;
            }
            return null;
        },

        /**
         * 获取TagCode对应的名称
         * @param {String} tagcode TagCode
         * @returns {String} TagCode对应的名称
         */
        GetTagTitle: function (tagcode) {
            var tagList = this.TagList;
            tagList.Tags.forEach(function (tagItem) {
                if (tagItem.fatherid === tagcode) {
                    return tagItem.lvl2name;
                }
            });
            return "";
        },

        /**
         * 获取字符串长度
         * @param {String} str 字符串
         * @returns {Number} 字符串长度
         */
        GetBLen: function (str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
                    len += 2;
                } else {
                    len++;
                }
            }
            return len;
        },

        /**
         * 获取个人库作品列表(编辑列表)
         * @param {int} page 分页参数，第N页，N从1开始，默认值1
         * @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
         * @param {String} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序 
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetPersonalEditorApps: function (page, size, sorts, success, error) {
            var succ = function (dataObj) {
                var apps = module.GetPersonalAppsData(dataObj);
                success(apps);
            };
            api.GetPersonalApps(page, size, sorts, 0, succ, error);
        },

        /**
        * 获取个人库作品列表(发布列表)
        * @param {int} page 分页参数，第N页，N从1开始，默认值1
        * @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
        * @param {String} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序 
        * @param {Function} success 成功回调,带服务端返回对象
        * @param {Function} error 出错回调
        */
        GetPersonalPublishApps: function (page, size, sorts, success, error) {
            var succ = function (dataObj) {
                var apps = module.GetPersonalAppsData(dataObj);
                success(apps);
            };
            api.GetPersonalReleaseApps(page, size, sorts, succ, error);
        },

        /**
         * 作品重命名
         * @param {String} appId 作品id
         * @param {String} newName 新名字
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        RenamePersonalAppName: function (appId, newName, success, error) {
            for (var i = 0; i < newName.length; i++) {
                if (newName[i] !== " ") {
                    api.RenameApp(appId, newName, success, error);
                    return;
                }
            }
            var errObj=new Object();
            errObj.responseJSON = {};
            errObj.responseJSON.code = "OnlySpaceError";
            errObj.responseJSON.message = "不能只输入空格";
            error(errObj);
        },

        /**
        * 删除作品
        * @param {String} appId 作品id
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
        */
        DeletePersonalApp: function (appId, success, error) {
            api.DeleteApp(appId, success, error);
        },

        /**
        * 复制个人作品
        * @param {String} appId 个人作品id
        * @param {String} version 版本号,为空取最新版本
        * @param {String} curName 作品名称
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
        */
        CopyPersonalApp: function (appId, version, curName, success, error) {

            var checkData = new Object();
            checkData.app_id = appId;
            checkData.release_mode = releaseMode.create;
            checkData.access_type = accessType.personal;
            var succ = function (dataObj) {
                api.CopyPersonalApp(appId, version, dataObj.checkname, success, error);
            };
            module.CheckPersonalAppName(checkData, curName, 1, succ, error);
        },

        /**
         * 复制个人作品时使用的递归函数，不对外开放
         * @param {any} checkData checkData
         * @param {any} name name
         * @param {any} index index
         * @param {any} success  成功回调
         * @param {any} error 出错回调
         */
        CheckPersonalAppName: function (checkData, name, index, success, error) {
            var checkname = name;
            if (index !== 0) {
                checkname += "_" + index;
            }
            var strLength = module.GetBLen(checkname);
            if (strLength > 60) {
                var overLenErr = new Object();
                overLenErr.responseJSON = {};
                overLenErr.responseJSON.code = "NameOverLength";
                overLenErr.responseJSON.message = "作品名称超过长度限制";
                error(overLenErr);
            }
            else {
                checkData.app_name = checkname;

                var succ = function (dataObj) {
                    if (dataObj.is_duplicate === 0) {
                        dataObj.checkname = checkname;
                        success(dataObj);
                    } else {
                        index++;
                        module.CheckPersonalAppName(checkData, name, index, success, error);
                    }
                };
                api.IsNameDuplicate(checkData, succ, error);
            }
        },

        /**
         * 下架作品
         * @param {String} appId 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SoldoutPersonalApp: function (appId, success, error) {
            api.SoldoutApp(appId, success, error);
        },

        /**
         * 取消发布
         * @param {String} appId 作品id
         * @param {String} version 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CancelPublishPersonalApp: function (appId, version, success, error) {
            api.CancelPublishApp(appId, version, success, error);
        },

        //#endregion

        //#region 体验区作品模块

        /**
        * 获取用户收藏列表
        * @param {int} page 分页参数，第N页，N从1开始，默认值1
        * @param {int} size 分页参数, 每页大小，默认值10，size最大不能超过100
        * @param {Function} success 成功回调,带服务端返回对象
        * @param {Function} error 出错回调
        */
        GetUserCollectApps: function (page, size, success, error) {
            var succ = function (dataObj) {
                //资源处理
                dataObj.items.forEach(function (item) {
                    item.cover = UtilBarn.Resource.GetImage(item.cover);
                });
                //tag处理

                success(dataObj);
            };
            api.GetUserCollectApps(page, size, succ, error);
        },

        /**
        * 获取最近游戏记录列表
        * @param {Function} success 成功回调,带服务端返回对象
        * @param {Function} error 出错回调
        */
        GetPlayRecordApps: function (success, error) {
            var succ = function (dataObj) {
                //资源处理
                dataObj.items.forEach(function (item) {
                    item.cover = UtilBarn.Resource.GetImage(item.cover);
                });
                //tag处理

                success(dataObj);
            };
            api.GetPlayRecord(succ, error);
        },
        //#endregion

        /**
         * 获取图片下载地址
         * @param {String} resourceId 图片资源id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetImage: function (resourceId, success, error) {
            for (var j = 0; j < imageMap.Keys.length; j++) {
                var key = imageMap.Keys[j];
                if (key === resourceId) {
                    if (success) success(imageMap.Get(key));
                    return;
                }
            }

            UtilBarn.Resource.GetImage(resourceId, function (url) {
                if (!imageMap.ContainsKey(resourceId)) {
                    imageMap.Set(resourceId, url);
                }
                if (success) success(url);
            }, function (e) {
                console.log(e);
                if (error) error(e);
            });
        },

        /**
         * 获取用户头像
         * @param {String} userid 用户id
         */
        GetUserAvatar: function (userid) {
            return UtilBarn.Protocol + "://" + UtilBarn.GetHost("CS") + "/v0.1/static/cscommon/avatar/" + userid + "/" + userid + ".jpg?size=160&t=" + new Date().getTime();
        },

        /**
         * 获取用户收藏列表格式
         * @param {object} data 源数据
         */
        GetUserCollectAppsFormatData: function (data) {
            var returndata = new Array();
            for (var i = 0; i < data.item_count; i++) {
                var item = data.items[i];
                var codes = item.tags.game_tags.concat(item.tags.edu_tags);
                var tagNames = module.GetTagNamesByCodes(codes);
                //标签待修改
                var demo = {
                    "id": item.app_id,
                    "game_icon": item.icon,
                    "game_name": item.app_name,
                    "tags": tagNames.concat(item.tags.customed_tags),
                    "game_score": module.GetScoreFormat(item.score),
                    "players": item.online,
                    "author": item.ownername,
                    "author_head": module.GetUserAvatar(item.acc_id)
                };
                returndata.push(demo);
            }
            var result = { "count": data.total_count, "data": returndata };
            return result;
        },

        /**
         * 获取规定格式的数据
         * @param {object} data {}服务端返回的完整数据
         * @return {json} result规定格式的数据
         */
        GetAppsFomatData: function (data) {
            var returndata = new Array();
            for (var i = 0; i < data.item_count; i++) {
                var item = data.items[i];
                var tagNames = [];
                if (item.tags) {
                    var codes = item.tags.edu_tags.concat(item.tags.game_tags);
                    tagNames = module.GetTagNamesByCodes(codes);
                    tagNames = tagNames.concat(item.tags.customed_tags);
                }
                //标签待修改
                var demo = {
                    "id": item.app_id,
                    "game_icon": item.cover,
                    "game_name": item.title,
                    "tags": tagNames,
                    "game_score": module.GetScoreFormat(item.score),
                    "players": item.online,
                    "author": item.author,
                    "author_head": module.GetUserAvatar(item.acc_id)
                };
                returndata.push(demo);
            }
            var result = { "count": data.total_count, "data": returndata };
            return result;
        },

        /**
         * 获取模板列表规定格式的数据
         * @param {object} data {}服务端返回的完整数据
         * @return {json} result规定格式的数据
         */
        GetBaseAppsFomatData: function (data) {
            var returndata = new Array();
            for (var i = 0; i < data.item_count; i++) {
                var item = data.items[i];
                var codes = item.tags.game_tags.concat(item.tags.edu_tags);
                var tagNames = module.GetTagNamesByCodes(codes);
                //标签待修改
                var demo = {
                    "id": item.app_id,
                    "game_icon": item.cover,
                    "game_name": item.title,
                    "version": item.version,
                    "tags": tagNames.concat(item.tags.customed_tags),
                    "game_description": item.description
                };
                returndata.push(demo);
            }
            var result = { "count": data.total_count, "data": returndata };
            return result;
        },

        /**
         * 获取模板列表规定格式的数据
         * @param {object} data {}服务端返回的完整数据
         * @return {json} result规定格式的数据
         */
        GetPlayRecordAppsFomatData: function (data) {
            var returndata = new Array();
            for (var i = 0; i < data.item_count; i++) {
                var item = data.items[i];
                var codes = item.tags.game_tags.concat(item.tags.edu_tags);
                var tagNames = module.GetTagNamesByCodes(codes);
                //标签待修改
                var demo = {
                    "id": item.app_id,
                    "game_icon": item.cover,
                    "game_name": item.title,
                    "tags": tagNames.concat(item.tags.customed_tags),
                    "game_score": module.GetScoreFormat(item.score),
                    "players": item.online,
                    "author": item.author,
                    "author_head": module.GetUserAvatar(item.acc_id)
                };
                returndata.push(demo);
            }
            var result = { "count": data.item_count, "data": returndata };
            return result;
        },

        /**
         * 获取推荐列表格式
         * @param {object} data 源数据
         */
        GetRecommandAppsFomatData: function (data) {
            var returndata = new Array();
            for (var i = 0; i < data.recommand.length; i++) {
                var tagNames = [];
                var item = data.recommand[i];
                if (item.tags) {
                    var codes = item.tags.edu_tags.concat(item.tags.game_tags);
                    tagNames = module.GetTagNamesByCodes(codes);
                    if(item.tags.customed_tags){
                        tagNames = tagNames.concat(item.tags.customed_tags);
                    }
                }
                var demo = {
                    "id": item.app_id,
                    "game_icon": item.icon,
                    "game_name": item.app_name,
                    "tags": tagNames,
                    "game_score": module.GetScoreFormat(item.score),
                    "players": item.online,
                    "author": item.ownername,
                    "author_head": module.GetUserAvatar(item.acc_id)
                };
                returndata.push(demo);
            }
            var result = { "data": returndata };
            return result;
        },

        /**
         * 获取规定格式的数据
         * @param {object} data {}服务端返回的完整数据
         * @return {json} result规定格式的数据
         */
        GetPersonalAppsData: function (data) {
            var returndata = new Array();
            for (var i = 0; i < data.item_count; i++) {
                var item = data.items[i];
                var codes = item.tags.edu_tags.concat(item.tags.game_tags);
                var tagNames = module.GetTagNamesByCodes(codes);
                //标签待修改
                var demo = {
                    "id": item.app_id,
                    "game_icon": item.cover,
                    "game_name": item.title,
                    "ver": item.version,
                    "game_score": module.GetScoreFormat(item.score),
                    "game_playing": item.online,
                    "tags": tagNames.concat(item.tags.customed_tags),
                    "update_time": item.update_time,
                    "release_time": item.schedule_time,
                    "statu": item.flag,
                    "creation_time": item.create_time
                };
                returndata.push(demo);
            }
            var result = { "count": data.total_count, "data": returndata };
            return result;
        },
        /**
         * 获取作品详情模板数据
         * @param {object} appinfo 服务端返回的完整数据
         * @return {json} result规定格式的数据
         */
        GetAppFomatData: function (appinfo, appResInfo) {
            var data = new Object();
            data.game_name = appinfo.app_name;
            data.ver = appinfo.version;
            data.game_icon = appinfo.icon;
            data.game_img_full = appinfo.screenshot;
            data.game_img_thumbnail = appinfo.screenshot;
            data.game_author_img = module.GetUserAvatar(appinfo.acc_id);
            data.game_author_name = appinfo.ownername;
            data.game_description = appinfo.introduction;
            data.game_score = module.GetScoreFormat(appinfo.score);
            data.game_experienced = appinfo.played_num;
            data.game_reviews = appinfo.scorenumber;
            data.game_playing = appinfo.online;
            data.like = appinfo.is_collected;
            data.game_reviews = appinfo.score_info.scorenumber;
            data.game_reviews_0 = appinfo.score_info.score1number;
            data.game_reviews_1 = appinfo.score_info.score2number;
            data.game_reviews_2 = appinfo.score_info.score3number;
            data.game_reviews_3 = appinfo.score_info.score4number;
            data.game_reviews_4 = appinfo.score_info.score5number;
            data.grade = appinfo.grade;
            data.baseid = appinfo.baseid;
            data.base_version = appinfo.base_version;
            
            //0: 启用 1：隐藏 2：禁用但显示
            data.collect_display = 0;//收藏
            data.reviews_display = 0;//评论、已评分
            data.score_display = 0;//打分
            data.gameVersionLog_display = 0;//版本记录
            data.gameOriginalTpl_display = 0;//原始模板
            data.gameSameTpl_display = 0;//相同模板列表
            var ucUserId = UtilBarn.AccountId + "";
            if(appinfo.acc_id === ucUserId){
                data.report_display = 1;//举报
            }else{
                data.report_display = 0;//举报
            }
            data.onlineNumber_display = 0;//在线人数
            data.experienced_display = 0;//体验人数
            if (appResInfo.web_resid && appResInfo.web_resid !== "") {
                data.exportapk_enable = 0;//导出apk按钮的状态
            } else {
                data.exportapk_enable = 2;//导出apk按钮的状态
            }
            var result = { "data": data };
            return result;
        },
        /**
        * 获取个人作品详情模板数据
        * @param {object} appinfo 服务端返回的完整数据
        * @return {json} result规定格式的数据
        */
        GetPersonalAppFomatData: function (appinfo, appResInfo) {
            var data = new Object();
            data.game_name = appinfo.app_name;
            data.ver = appinfo.version;
            data.game_icon = appinfo.icon;
            data.game_img_full = appinfo.screenshot;
            data.game_img_thumbnail = appinfo.screenshot;
            data.game_author_img = module.GetUserAvatar(appinfo.acc_id);
            data.game_author_name = appinfo.ownername;
            data.game_description = appinfo.introduction;
            data.game_score = module.GetScoreFormat(appinfo.score);
            data.game_experienced = appinfo.played_num;
            data.game_reviews = appinfo.scorenumber;
            data.game_playing = appinfo.online;
            data.like = appinfo.is_collected;
            data.game_reviews = appinfo.score_info.scorenumber;
            data.game_reviews_0 = appinfo.score_info.score1number;
            data.game_reviews_1 = appinfo.score_info.score2number;
            data.game_reviews_2 = appinfo.score_info.score3number;
            data.game_reviews_3 = appinfo.score_info.score4number;
            data.game_reviews_4 = appinfo.score_info.score5number;
            data.grade = appinfo.grade;
            data.baseid = appinfo.baseid;
            data.base_version = appinfo.base_version;
            
            //0: 启用 1：隐藏 2：禁用但显示
            data.collect_display = 1;//收藏
            data.reviews_display = 1;//评论、已评分
            data.score_display = 1;//打分
            data.gameVersionLog_display = 0;//版本记录
            data.gameOriginalTpl_display = 0;//原始模板
            data.gameSameTpl_display = 0;//相同模板列表
            data.report_display = 1;//举报
            data.onlineNumber_display = 1;//在线人数
            data.experienced_display = 1;//体验人数
            if (appResInfo.web_resid && appResInfo.web_resid !== "") {
                data.exportapk_enable = 0;//导出apk按钮的状态
            } else {
                data.exportapk_enable = 2;//导出apk按钮的状态
            }
            var result = { "data": data };
            return result;
        },

        /**
         * 发布作品
         * @param {object} data 发布数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        PublishApp: function (data, success, error) {
            if (data.introduction === "" || data.introduction === undefined) {
                if (error) error("introduction can not be empty");
                return;
            }

            if (data.screenshot === undefined || data.screenshot === null || data.screenshot.length === 0) {
                if (error) error("screenshot can not be empty");
                return;
            }

            if (data.game_icon === undefined || data.game_icon === null || data.game_icon === "") {
                if (error) error("game_icon can not be empty");
                return;
            }

            if (data.game_update === undefined || data.game_update === null || data.game_update === "") {
                if (error) error("game_update can not be empty");
                return;
            }

            UtilBarn.Api.MMO.PublishCountDown(function (time) {
                if (time.remain > 0) {
                    if (error) error("user publish too frequently");
                    return;
                }

                var tagModel = {};
                tagModel.app_id = data.id;
                tagModel.tagname = {};
                tagModel.tagname.gametags = [];
                tagModel.tagname.edutags = [];
                tagModel.tagname.othertags = [];
                tagModel.tagname.customedgametags = [];
                tagModel.tagname.customededutags = [];
                if (publishAppMap.ContainsKey(data.id) && publishTagsMap.ContainsKey(data.id) && tagMap) {
                    var appinfo = publishAppMap.Get(data.id);
                    var defaultGameTags = [];
                    var defaultEduTags = [];
                    for (var i = 0; i < tagMap.Keys.length; i++) {
                        var key = tagMap.Keys[i];
                        var tagItem = tagMap.Get(key);
                        if (tagItem.lvl1name === "game") {
                            defaultGameTags.push(tagItem.fatherid);
                        }
                        if (tagItem.lvl1name === "edu") {
                            defaultEduTags.push(tagItem.fatherid);
                        }
                    }
                    for (var i = 0; i < data.tags.tags_game.length; i++) {
                        var item = data.tags.tags_game[i];
                        if (UtilBarn.Array.Contain(appinfo.game_tags, item.id)) {
                            continue;
                        }
                        if (UtilBarn.Array.Contain(defaultGameTags, item.id)) {
                            tagModel.tagname.gametags.push(item.id);
                        } else {
                            tagModel.tagname.customedgametags.push(item.id);
                        }
                    }
                    for (var i = 0; i < data.tags.tags_edu.length; i++) {
                        var item = data.tags.tags_edu[i];
                        if (UtilBarn.Array.Contain(appinfo.edu_tags, item.id)) {
                            continue;
                        }
                        if (UtilBarn.Array.Contain(defaultEduTags, item.id)) {
                            tagModel.tagname.edutags.push(item.id);
                        } else {
                            tagModel.tagname.customededutags.push(item.id);
                        }
                    }
                    for (var i = 0; i < data.tags.tags_other.length; i++) {
                        var item = data.tags.tags_other[i];
                        tagModel.tagname.othertags.push(item.id);
                    }
                    UtilBarn.Api.MMO.SetTag(tagModel, function () {
                        var publishData = {};
                        publishData.app_id = data.id;
                        publishData.app_name = data.game_name;
                        publishData.icon = data.game_icon;
                        publishData.game_tags = appinfo.game_tags.join(",");
                        publishData.edu_tags = appinfo.edu_tags.join(",");
                        publishData.screenshot = data.screenshot.join(",");
                        publishData.introduction = data.introduction;
                        publishData.releasetime_mode = data.immediately ? 1 : 2;
                        publishData.schedule_time = data.immediately ? "" : data.publish_date;
                        publishData.version = data.ver + "";
                        publishData.privacy = 1;
                        publishData.update_content = data.game_update;

                        UtilBarn.Api.MMO.ReleaseApp(publishData, function(suc) {

                            // 云图埋点
                            UtilBarn.DataStatistic.PublishGame(data.id);

                            if (success) success(suc);

                        }, error);

                    }, error);
                }
            }, error);
        },

        /**
         * 新增标签
         * @param {object} data 标签数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        AddTag: function(data, success, error){
            if(module.IsEmptyStr(data)){
                if(error)error(UtilBarn.GetTip("ERROR_TagsInValid"));
                return;
            }
            
            var invalidChars = new Array("`", "!", "@", "#", "$", "%", "^", "&", "_", "+", "=", "[", "]", "{", "}", "'", ",", ".", "?", "|", "￥", "！","……","——","‘","’", "，","。","、", "？");
            for (var i = 0; i < data.length; i++) {
                if(UtilBarn.Array.Contain(invalidChars, data[i])){
                    if(error)error(UtilBarn.GetTip("ERROR_TagsInValid"));
                    return;
                }
            }
            
            if(UtilBarn.Array.Contain(allTagNames, data)){
                if(error)error(UtilBarn.GetTip("ERROR_TagsNotSame"));
                return;
            }
            
            allTagNames.push(data);
            if(success)success("");
        },

        /**
         * 删除标签
         * @param {object} data 标签名称
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        DeleteTag: function(data, success, error){
            allTagNames = allTagNames.filter(function(item) {
                return item !== data;
            });
            if(success)success("");
        },

        /**
         * 是否空字符串
         * @param {object} str 验证内容
         */
        IsEmptyStr: function(str){
            if ( str === ""  || str === "undefined" || str === null) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        },

        /**
         * 版本检测
         * @param {object} data 版本号
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CheckVersion: function(data, success, error){
            var version = parseFloat(data);
            var minVersion = publishVersion + 0.01;
            if(isNaN(version))
            {
                if(success)success(minVersion.toFixed(2) + "");
            }
            else
            {
                if(version < minVersion){
                    version = minVersion;
                }
                if(success)success(version.toFixed(2) + "");
            }
        },

        /**
         * 获取发布源数据格式
         * @param {object} appinfo 作品详情
         * @param {object} taginfo 标签详情
         */
        GetPublishOriginFomatData: function (appinfo, taginfo) {
            publishAppMap.Set(appinfo.app_id, appinfo);
            publishTagsMap.Set(appinfo.app_id, taginfo);
            var platform = 1;
            if (appinfo.platform_info.android === 1) {
                platform = 2;
            }
            if (appinfo.platform_info.web === 1) {
                platform = 3;
            }
            var tags_game = [];
            var tags_edu = [];
            var tags_other = [];
            var defaultGameTags = [];
            var defaultEduTags = [];
            var defaultEtcTags = [];
            allTagNames = [];
            publishVersion = 0;
            if (tagMap) {
                for (var i = 0; i < tagMap.Keys.length; i++) {
                    var key = tagMap.Keys[i];
                    var tagItem = tagMap.Get(key);
                    if (tagItem.lvl1name === "game") {
                        defaultGameTags.push(tagItem);
                    }
                    if (tagItem.lvl1name === "edu") {
                        defaultEduTags.push(tagItem);
                    }
                    if (tagItem.lvl1name === "etc") {
                        defaultEtcTags.push(tagItem);
                    }
                    allTagNames.push(tagItem.lvl2name);
                }

                for (var i = 0; i < defaultGameTags.length; i++) {
                    var item = defaultGameTags[i];
                    var isMust = UtilBarn.Array.Contain(appinfo.game_tags, item.fatherid);
                    var isChecked = isMust || UtilBarn.Array.Contain(taginfo.gametags, item.fatherid);
                    var ob = {};
                    ob.id = item.fatherid;
                    ob.value = item.lvl2name;
                    ob.checked = isChecked;
                    ob.undo = isMust;
                    ob.candel = false;
                    tags_game.push(ob);
                }

                for (var i = 0; i < taginfo.customedgametags.length; i++) {
                    var item = taginfo.customedgametags[i];
                    if (item !== "") {
                        var ob = {};
                        ob.id = item;
                        ob.value = item;
                        ob.checked = true;
                        ob.undo = false;
                        ob.candel = true;
                        tags_game.push(ob);
                        allTagNames.push(item);
                    }
                }

                for (var i = 0; i < defaultEduTags.length; i++) {
                    var item = defaultEduTags[i];
                    var isMust = UtilBarn.Array.Contain(appinfo.edu_tags, item.fatherid);
                    var isChecked = isMust || UtilBarn.Array.Contain(taginfo.edutags, item.fatherid);
                    var ob = {};
                    ob.id = item.fatherid;
                    ob.value = item.lvl2name;
                    ob.checked = isChecked;
                    ob.undo = isMust;
                    ob.candel = false;
                    tags_edu.push(ob);
                }

                for (var i = 0; i < taginfo.customededutags.length; i++) {
                    var item = taginfo.customededutags[i];
                    if (item !== "") {
                        var ob = {};
                        ob.id = item;
                        ob.value = item;
                        ob.checked = true;
                        ob.undo = false;
                        ob.candel = true;
                        tags_edu.push(ob);
                        allTagNames.push(item);
                    }
                }

                var defaultEtcCodes = [];
                for (var i = 0; i < defaultEtcTags.length; i++) {
                    var item = defaultEtcTags[i];
                    var isChecked = UtilBarn.Array.Contain(taginfo.othertags, item.fatherid);
                    var ob = {};
                    ob.id = item.fatherid;
                    ob.value = item.lvl2name;
                    ob.checked = isChecked;
                    ob.undo = false;
                    ob.candel = false;
                    tags_other.push(ob);
                    defaultEtcCodes.push(item.fatherid);
                }

                for (var i = 0; i < taginfo.othertags.length; i++) {
                    var item = taginfo.othertags[i];
                    if (!UtilBarn.Array.Contain(defaultEtcCodes, item)) {
                        if (item !== "") {
                            var ob = {};
                            ob.id = item;
                            ob.value = item;
                            ob.checked = true;
                            ob.undo = false;
                            ob.candel = true;
                            tags_other.push(ob);
                            allTagNames.push(item);
                        }
                    }
                }
            }

            var data = new Object();
            data.game_icon = appinfo.icon;
            data.game_name = appinfo.app_name;
            data.game_description = appinfo.introduction;
            data.isNew = appinfo.flag !== 0;
            //平台 1：PC 2：移动端 3：H5
            data.tags_game = tags_game;
            data.tags_edu = tags_edu;
            data.tags_other = tags_other;
            data.platform = platform;
            var version = parseFloat(appinfo.version);
            if(isNaN(version))
            {
                version = 1.00;
            }
            publishVersion = version;
            var newVersion = version + 0.01;
            data.ver = newVersion.toFixed(2) + "";
            data.game_update = appinfo.update_content;
            data.price = 0;
            data.image_config = {};
            data.image_config.ID = appinfo.screenshot;
            var result = { "data": data };
            return result;
        },

        /**
         * 获取模板数据
         * @param {object} appinfo 服务端返回的完整数据
         * @return {json} result规定格式的数据
         */
        GetBaseAppFomatData: function (appinfo) {
            var data = new Object();
            data.id = appinfo.app_id;
            data.game_name = appinfo.app_name;
            data.game_icon = appinfo.icon;
            data.game_description = appinfo.introduction;
            data.ver = appinfo.version;
            var result = { "data": data };
            return result;
        },
        /**
         * 获取标签格式数据
         * @param {object} taginfo 服务端返回的完整数据
         * @return {json} result规定格式的数据
         */
        GetTagsFormatData: function (taginfo) {
            var edutags = module.GetTagsByCodes(taginfo.edutags);
            var gametags = module.GetTagsByCodes(taginfo.gametags);
            var othertags = module.GetTagsByCodes(taginfo.othertags);
            var customededutags = module.GetTagsByCodes(taginfo.customededutags);
            var customedgametags = module.GetTagsByCodes(taginfo.customedgametags);
            var modelgametag = module.GetTagsByCodes(taginfo.modelgametag);
            var modeledutag = module.GetTagsByCodes(taginfo.modeledutag);
            var tags = edutags.concat(modeledutag).concat(customededutags).concat(modelgametag).concat(gametags).concat(customedgametags).concat(othertags);
            var result = { "data": tags };
            return result;
        },
        /**
         * 获取标签格式数据
         * @param {object} taginfo 服务端返回的完整数据
         * @return {json} result规定格式的数据
         */
        GetTagMapFormatData: function (taginfo) {
            var edutags = module.GetTagsByCodes(taginfo.edutags);
            var gametags = module.GetTagsByCodes(taginfo.gametags);
            var othertags = module.GetTagsByCodes(taginfo.othertags);
            var customededutags = module.GetTagsByCodes(taginfo.customededutags);
            var modelgametag = module.GetTagsByCodes(taginfo.modelgametag);
            var modeledutag = module.GetTagsByCodes(taginfo.modeledutag);
            var tags = edutags.concat(gametags).concat(othertags).concat(customededutags).concat(modelgametag).concat(modeledutag);
            var result = { "data": tags };
            return result;
        },
        /**
         * 获取规定格式的user数据
         * @param {object} data {}服务端返回的完整数据
         * @return {json} result规定格式的数据
         */
        GetUserFomatData: function (data, org) {
            var demo = {
                //"user_name":data.nick_name,
                //"user_id":data.user_id,
                //"user_avatar":data.head
                "avatarUrl": module.GetUserAvatar(UtilBarn.AccountId),
                "name": data.name,
                "birthday": data.birthday,
                "sex": data.sex,
                "parentsMailbox": data.email_address,
                "AccountType": UtilBarn.AccountType,
                "EditorEnable": org.Name.toUpperCase() === "E_UtilBarn"
            };
            var result = { "data": demo };
            return result;
        },

        GetScoreFormat: function (score) {
            if (score) {
                if (score > 0) {
                    return score.toFixed(1);
                }
                return score;
            }
            return 0;
        },
        /**
        * 作品评价打分
        * @param {object} data {
                    {String}app_id : 作品id, 
                    *{int}score : 评价，例如： 4 代表四星, 
                    {String}version : 版本，例如：1.0.1
                }
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
        */
        SetAppScore: function (data, success, error) {
            if (data.version === "" || typeof data.version === "undefined")
                data.version = "1.0.0";
            if (data.score === "" || typeof data.score === "undefined") {
                data.score = 0;
            }
            else {
                data.score = data.score < 0 ? 0 : data.score;
                data.score = data.score > 5 ? 5 : data.score;
            }
            api.SetAppScore(data,
                function (data) {
                    if (success) success(data);
                },
                function (e) {
                    if (error) error(e);
                }
            );
        },

        /**
         * 收藏作品
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CollectApp: function (app_id, success, error) {
            if (app_id !== "" && typeof app_id !== "undefined") {
                api.CollectApp(app_id,
                    function (data) {
                        if (success) success(data);
                    },
                    function (e) {
                        if (error) error(e);
                    }
                );
            }
        },
        /**
         * 取消收藏作品
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CancelCollectApp: function (app_id, success, error) {
            if (app_id !== "" && typeof app_id !== "undefined") {
                api.CancelCollectApp(app_id,
                    function (data) {
                        if (success) success(data);
                    },
                    function (e) {
                        if (error) error(e);
                    }
                );
            }
        },
        /**
         * 基础服务程序初始化
         * @param {String} playerid 用户playerid
         * @param {String} nickname 用户昵称
         */
        BaseServiceInit: function (playerid, nickname) {
            var model = {};
            model.AccessToken = UtilBarn.AccessToken;
            model.MacKey = UtilBarn.MacKey;
            model.TimeStamp = UtilBarn.TimeStamp;
            model.UserId = UtilBarn.AccountId;
            model.EbUserId = playerid;
            model.NickName = nickname;
            var message = module.GetMessageData(UtilBarn.GetGUID(), model, "Init");
            UtilBarn.WebSocket.SendInitMessage(message);
        },
        
        /**
         * 导出apk
         * @param {String} taskId 任务id
         * @param {String} app_id 作品id
         * @param {String} icon 作品图标
         * @param {int} accessType 1：模板库 2：作品库 3：体验库
         * @param {String} gameName 作品名称
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ExportApk: function (taskId, app_id, icon, accessType, gameName, success, error) {
            var model = {};
            model.ProductId = app_id;
            model.LogoResID = icon;
            model.AccessType = accessType;
            model.GameName = gameName;
            var message = module.GetMessageData(taskId, model, "ExportApk");
            UtilBarn.WebSocket.Send(message);
            UtilBarn.WebSocket.ExportApkResultCbDic.Set(taskId, function (returnTaskId, data) {
                var result = {};
                if (returnTaskId === taskId) {
                    if (data.Code === "SUCCESS" || data.Code === "CANCEL") {
                        result = {};
                        result.Code = data.Code;
                        result.Message = data.Message;

                        // 云图埋点
                        UtilBarn.DataStatistic.ExportGame(app_id, "apk");

                        if (success) success(result);
                    } else {
                        result = {};
                        if(navigator && navigator.onLine){
                            result.Code = data.Code;
                        }else{
                            result.Code = "NETWORK_OFFLINE";
                        }
                        result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                        if (error) error(result);
                    }
                }
            });
            
            UtilBarn.WebSocket.ExportApkProgressCbDic.Set(taskId, function (returnTaskId, progress) {
                if (returnTaskId === taskId) {
                    progressMap.Set(taskId, progress);
                }
            });
        },
        
        /**
         * 导出游戏
         * @param {String} taskId 任务id
         * @param {String} app_id 作品id
         * @param {String} icon 作品图标
         * @param {int} accessType 1：模板库 2：作品库 3：体验库
         * @param {String} gameName 作品名称
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ExportExeGame: function (taskId, app_id, icon, accessType, gameName, success, error) {
            var model = {};
            model.ProductId = app_id;
            model.LogoResID = icon;
            model.AccessType = accessType;
            model.GameName = gameName;
            var message = module.GetMessageData(taskId, model, "ExportPCGame");
            UtilBarn.WebSocket.Send(message);
            UtilBarn.WebSocket.ExportExeResultCbDic.Set(taskId, function (returnTaskId, data) {
                if (returnTaskId === taskId) {
                    if (data.Code === "SUCCESS" || data.Code === "CANCEL") {
                        var result = {};
                        result.Code = data.Code;
                        result.Message = "";

                        // 云图埋点
                        UtilBarn.DataStatistic.ExportGame(app_id, "exe");

                        if (success) success(result);
                    } else {
                        var result = {};
                        if(navigator && navigator.onLine){
                            result.Code = data.Code;
                        }else{
                            result.Code = "NETWORK_OFFLINE";
                        }
                        result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                        if (error) error(result);
                    }
                }
            });
            UtilBarn.WebSocket.ExportExeProgressCbDic.Set(taskId, function (returnTaskId, progress) {
                if (returnTaskId === taskId) {
                    progressMap.Set(taskId, progress);
                }
            });
        },
        
        /**
         * 导出编辑器
         * @param {String} taskId 任务id
         * @param {String} app_id 作品id
         * @param {String} icon 作品图标
         * @param {int} accessType 1：模板库 2：作品库 3：体验库
         * @param {String} gameName 作品名称
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ExportEditor: function (taskId, app_id, icon, accessType, gameName, success, error) {
            var model = {};
            model.ProductId = app_id;
            model.LogoResID = icon;
            model.AccessType = accessType;
            model.GameName = gameName;
            var message = module.GetMessageData(taskId, model, "ExportEditor");
            UtilBarn.WebSocket.Send(message);
            UtilBarn.WebSocket.ExportEditorResultCbDic.Set(taskId, function (returnTaskId, data) {
                if (returnTaskId === taskId) {
                    if (data.Code === "SUCCESS" || data.Code === "CANCEL") {

                        if (data.Code === "SUCCESS"){
                            // 云图埋点
                            UtilBarn.DataStatistic.ExportEditorTemplate(app_id);
                        }

                        var result = {};
                        result.Code = data.Code;
                        result.Message = "";
                        if (success) success(result);
                    } else {
                        var result = {};
                        if(navigator && navigator.onLine){
                            result.Code = data.Code;
                        }else{
                            result.Code = "NETWORK_OFFLINE";
                        }
                        result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                        if (error) error(result);
                    }
                }
            });
            UtilBarn.WebSocket.ExportEditorProgressCbDic.Set(taskId, function (returnTaskId, progress) {
                if (returnTaskId === taskId) {
                    progressMap.Set(taskId, progress);
                }
            });
        },

        /**
         * 播放游戏
         * @param {String} taskId 任务id
         * @param {String} app_id 作品id
         * @param {int} playType 1：模板库 2：作品库 3：体验库
         * @param {String} version 版本号
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        OpenGamePlay: function (taskId, app_id, playType, version, success, error) {
            var model = {};
            model.ProductId = app_id;
            model.PlayType = playType;
            model.Version = version;
            var message = module.GetMessageData(taskId, model, "PlayGame");
            UtilBarn.WebSocket.Send(message);
            UtilBarn.WebSocket.OpenGamePlayResultCallback = function (returnTaskId, data) {
                if (returnTaskId === taskId) {
                    if (data.Code === "SUCCESS") {
                        var result = {};
                        result.Code = "SUCCESS";
                        result.Message = "";
                        if (success) success(result);
                    } else {
                        if (error) error("Failed, error :" + data.Message);
                    }
                }
            };
            UtilBarn.WebSocket.OpenGamePlayProgressCallback = function (returnTaskId, progress) {
                if (returnTaskId === taskId) {
                    progressMap.Set(taskId, progress);
                }
            };
        },

        /**
         * 打开编辑器
         * @param {String} taskId 任务id
         * @param {String} app_id 作品id
         * @param {int} accessType 1：模板库 2：作品库 3：体验库
         * @param {String} version 版本号
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        OpenGameEditor: function (taskId, app_id, accessType, version, success, error) {
            var model = {};
            model.ProductId = app_id;
            model.AccessType = accessType;
            model.Version = version;
            var message = module.GetMessageData(taskId, model, "OpenEditor");
            UtilBarn.WebSocket.Send(message);
            UtilBarn.WebSocket.OpenGameEditorResultCallback = function (returnTaskId, data) {
                if (returnTaskId === taskId) {
                    if (data.Code === "SUCCESS") {
                        var result = {};
                        result.Code = "SUCCESS";
                        result.Message = "";
                        if (success) success(result);
                    } else {
                        var result = {};
                        result.Code = "NetWorkError";
                        result.Message = data.Message;
                        if (error) error(result);
                    }
                }
            };
            UtilBarn.WebSocket.OpenGameEditorProgressCallback = function (returnTaskId, progress) {
                if (returnTaskId === taskId) {
                    progressMap.Set(taskId, progress);
                }
            };
        },

        /**
         * 获取任务进度
         * @param {String} taskId 任务id
         * @param {Function} success 成功回调
         */
        GetProgress: function (taskId, success) {
            if (progressMap.ContainsKey(taskId)) {
                var progress = progressMap.Get(taskId);
                if (success) success(progress);
            } else {
                if (success) success(0);
            }
        },

        /**
         * 检测基础服务程序是否运行
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CheckEbService: function (success, error) {
            UtilBarn.WebSocket.CheckIsOpen(function(isOpen){
                if (isOpen) {
                    success("");
                } else {
                    module.GetProgramLocation(success, error);
                }
            });
        },

        /**
         * 获取基础服务程序下载地址
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetProgramLocation: function (success, error) {
            var subUrl = "/UtilBarn/v1.0/package/lastest_version";
            var arg = {
                pkg_guid: config["BaseServiceExeId"][UtilBarn.ServerKey],
                pkg_version: "1.0.0",
                pkg_platform: "PC",
                language: "zh-CN"
            };

            $.ajax({
                url: UtilBarn.Protocol + "://" + UtilBarn.GetHost("Login") + subUrl,
                // async: true,
                type: "post",
                data: JSON.stringify(arg),
                contentType: 'application/x-www-form-urlencoded',
                success: function (rpData) {
                    var rp = JSON.parse(rpData);
                    if (rp && rp.data) {
                        success(rp.data.location);
                    } else {
                        error("GetProgramLocation failed");
                    }
                },
                error: function (e) {
                    if (error) {
                        var result = {};
                        result.Code = "NetWorkError";
                        result.Message = e;
                        error(result);
                    }
                }
            });
        },

        /**
         * 获取基础服务程序消息
         * @param {String} taskId 任务id
         * @param {object} model 消息数据
         * @param {string} code 消息类型
         */
        GetMessageData: function (taskId, model, code) {
            var arg = UtilBarn.Encode(JSON.stringify(model));
            var taskConfig = {};
            taskConfig.ConfigGuid = config["ConfigGuid"][UtilBarn.ServerKey];
            taskConfig.WebServer = UtilBarn.Protocol + "://" + UtilBarn.GetHost("Login") + "/";
            taskConfig.ProgramGuid = config["ProgramGuid"][UtilBarn.ServerKey];
            taskConfig.ApkToolId = config["ApkToolId"][UtilBarn.ServerKey];
            taskConfig.Html5PlayerId = config["Html5PlayerId"][UtilBarn.ServerKey];
            taskConfig.Language = UtilBarn.Language;
            var webSocketMessage = {};
            webSocketMessage.TaskId = taskId;
            webSocketMessage.TaskConfigData = taskConfig;
            webSocketMessage.Code = code;
            webSocketMessage.Data = arg;
            return JSON.stringify(webSocketMessage);
        },

        /**
         * 初始化
         * @param {object} ebUser 用户数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        Init: function (ebUser, success, error) {
            module.BaseServiceInit(ebUser.user_id, ebUser.nick_name);
            api.GetTagMap(function (data) {
                tagMap = new Dictionary();
                if (data && data.taglist) {
                    for (var i = 0; i < data.taglist.length; i++) {
                        if (!tagMap.ContainsKey(data.taglist[i].fatherid)) {
                            tagMap.Set(data.taglist[i].fatherid, data.taglist[i]);
                        }
                    }
                }
                if(success)success();
            }, function (error) {
                console.log('GetTagMap failed : ' + error);
                if(error)error('GetTagMap failed : ' + error);
            });
        },

        /**
         * 试玩接口
         * @param {String} app_id 作品id
         * @param {Number} access_type 获取类型 1-模板库  2-个人库 3-作品库
         * @param {Number} get_type 获取类型0-显示需求 1-试玩需求 2-分享需求  3-编辑 4-体验区游戏
         * @param {String} version 版本号,为空取最新版本
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetTryPlayingInfo: function (app_id, access_type, get_type, version, success, error) {
            api.GetTryPlayingInfo(app_id, access_type, get_type, version, success, error);
        },
        /**
         * 获取webIM地址
         * @param {Function} success 成功回调,返回webIM地址
         * @param {Function} error 出错回调
         */
        GetWebIMUrl: function (success, error) {
            var webIMHost = config["WebIMHost"][UtilBarn.ServerKey];
            var lang = UtilBarn.Language === "English" ? "en-US" : "zh-CN";
            var auth = UtilBarn.Request.GetAuthorization("GET", "/", webIMHost);
            var webIMUrl = "http://" + webIMHost + "?lng=" + lang + "&auth=" + encodeURIComponent(auth);
            if (success) success(webIMUrl);
        },
        /**
         * 获取Elearning地址
         * @param {Function} success 成功回调,返回Elearning地址
         * @param {Function} error 出错回调
         */
        GetElearningUrl: function(success, error){
            var ElearningHost = config["ElearningConfig"][UtilBarn.ServerKey]["Host"];
            var url = config["ElearningConfig"][UtilBarn.ServerKey]["Url"];
            var auth = UtilBarn.Request.GetAuthorization("GET", url, ElearningHost);
            var ElearningUrl = config["ElearningConfig"][UtilBarn.ServerKey]["Head"] + ElearningHost + url + "?__mac=" + UtilBarn.Encode(auth);
            if(success){
                success(ElearningUrl);
            }
        },
        /**
         * 获取图书馆地址
         * @param {Function} success 成功回调,返回Elearning地址
         * @param {Function} error 出错回调
         */
        GetLibUrl: function(success, error){
            var lang = UtilBarn.Language === "English" ? "en-Us" : "zh-CN";
            var LibHost = config["LibConfig"][UtilBarn.ServerKey]["Host"];
            var url = UtilBarn.Language === "SimplifiedChinese" ? "/" : config["LibConfig"][UtilBarn.ServerKey]["Url"].replace('{0}',lang);
            var CodeLibHost = config["LibConfig"][UtilBarn.ServerKey]["CodeLibHost"];
            //CodeLibHost = CodeLibHost.replace('{0}',lang);
            var auth = UtilBarn.Request.GetAuthorization("GET", url, LibHost);
            var LibUrl = CodeLibHost.replace('{0}',lang) + UtilBarn.Encode(auth);
            if(success){
                success(LibUrl);
            }
        },
        /**
         * 获取版本更新日志
         * @param {Function} success 成功回调,返回版本更新日志
         * @param {Function} error 出错回调
         */
        GetVersionLog: function (success, error) {
            var data = UtilBarn.Language === "English" ? UtilBarn.English : UtilBarn.SimplifiedChinese;
            if(success && data !== "" && typeof data !== "undefined"){
                success(data);
            }
            else{
                error("获取日志失败！");
            }
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "LobbyService"));
