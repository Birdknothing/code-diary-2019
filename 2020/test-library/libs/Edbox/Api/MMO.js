// Edbox MMO服务端接口v0.1组件
(function (namespace, className) {

    /**
     * Get请求
     * @param {String} url Url
     * @param {String} data 数据 
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     * @param {Boolean} withoutAuth 是否带登录信息 默认不填表示带，为true时不带
     */
    function MMOGet(url, data, success, error, withoutAuth) {
        var head = "";
        var platforms = 'ANDROID';
        if (Edbox.Platform.IsPC) {
            platforms = 'WINDOWS';
        }
        var lang = Edbox.GetLanguageCode();

        var headers = {
            //env: Edbox.Mode,
            language: lang,
            platform: platforms
        };

        if (Edbox.SDPAppId && Edbox.SDPAppId.trim().length > 0) {
            headers.sdp_app_id = Edbox.SDPAppId;
        }
        if (withoutAuth) {
            var authUrl = "";
            if (data && data.trim().length > 0) {
                authUrl = url + "?" + data;
            }

            headers.Authorization = Edbox.Request.GetAuthorizationWithoutLogin("Get", authUrl, Edbox.GetHost("MMO"));
            Edbox.Request.Send("Get", Edbox.Protocol, Edbox.GetHost("MMO"), url, data, headers, false, success, error);
        }
        else {
            Edbox.Request.GetWithHeader(Edbox.GetHost("MMO"), url, data, headers, success, error);
        }
    }

    /**
     * Post请求
     * @param {String} url Url
     * @param {String} data 数据 
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    function MMOPost(url, data, success, error) {
        var headers = null;

        if (Edbox.SDPAppId && Edbox.SDPAppId.trim().length > 0) {
            headers = {
                sdp_app_id: Edbox.SDPAppId
            };
        }

        Edbox.Request.PostWithHeader(Edbox.GetHost("MMO"), url, data, headers, success, error);
    }

    /**
     * 作品发布预检
     * @param {Number} 0-创建作品，1-发布作品
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    function Precheck (action_type, success, error) {
        var subUrl = "/v1.0/api/product/product/actions/get_precheck_status";
        var data = "action_type=" + action_type;
        MMOGet(subUrl, data, success, error);
    }

    /**
     * Edbox MMO服务端接口v1.0组件
     * 用于Edbox平台的访问MMO服务端接口
     * @author 余晓(871129) Review By 温荣泉(201901)
     * @see 服务端接口 http://ndsdn.nd.com.cn/index.php?title=Edbox%E5%A4%A7%E5%8E%85%E6%9C%8D%E5%8A%A1-%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3V1.0
     * */
    var module = {
        /**
        * 举报作品
        * @param {object} data {
                        {string}gameId : 作品id, 
                        {string}playerId : 用户id
                        {string}gameVersion : 版本，例如：1.0.1
                        {string}reportContent : 举报内容
                        {string}reportDesc : 举报描述
                    }
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
        */
        ReportApp: function (data, success, error) {
            var subUrl = "/edbox.php?c=api_v1_report&a=index";
            Edbox.Request.Post(Edbox.GetHost("Login"), subUrl, JSON.stringify(data), success, error);
        },
        /**
         * 获取体验区作品详情
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetAppInfo: function (app_id, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_app_detail";
            var query = "app_id=" + app_id;
            MMOGet(subUrl, query, success, error);
        },

        /**
        * 不带登录信息的get请求
        * @param {String} url Url
        * @param {String} data 数据 
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
        */
        MMOGetWithoutLogin: function (url, data, success, error) {
            MMOGet(url, data, success, error, true);
        },

        /**
         * 获取个人库作品详情
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetPersonalAppInfo: function (app_id, success, error) {
            var subUrl = "/v0.1/api/product/personal/actions/get_app_detail";
            var query = "app_id=" + app_id;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取适合端的模板库详细信息
         * @param {String} app_id 模板id
         * @param {String} editorTypes 指定搜索编辑器支持平台参数默认为空字符串，查询所有平台，支持多平台查询，格式每种平台用逗号隔开 WEB是移动端,WEB_PC是PC端如：“WINDOWS,WEB,WEB_PC,ANDROID,IOS”
         * @param {String} version 模板版本号,为空取最新版本
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetBaseFitAppInfo: function (app_id, editorTypes, version, success, error) {
            var subUrl = "/v0.1/api/product/base/actions/get_fit_app_detail";
            var query = "app_id=" + app_id + "&editorTypes=" + editorTypes + "&version=" + version;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取个人库作品列表(旧接口)
         * @param {int} page 分页参数，第N页，N从1开始，默认值1
         * @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
         * @param {String} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序 
         * @param {int} appstatus 要获取某状态的作品，默认为0, 0-用户所有作品，1-用户进行发布操作后的作品（包括待审核、审核中、审核失败、审核通过未发布（定时）、已发布上线）
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetPersonalApps: function (page, size, sorts, appstatus, success, error) {
            var subUrl = "/v0.1/api/product/personal/actions/get_app_list";
            var query = "page=" + (page || 1) + "&size=" + (size || 20) + "&sorts=" + (sorts || "") + "&status=" + (appstatus || 0);
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取个人库作品发布列表
         * @param {int} page 分页参数，第N页，N从1开始，默认值1
         * @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
         * @param {String} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序 
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetPersonalReleaseApps: function (page, size, sorts, success, error) {
            var subUrl = "/v0.1/api/product/personal/actions/get_released_list";
            var query = "page=" + (page || 1) + "&size=" + (size || 20) + "&sorts=" + (sorts || "");
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取作品资源信息，打包用的作品资源信息接口
         * @param {String} app_id 作品id
         * @param {int} access_type 获取类型 1-模板库  2-个人库 3-作品库
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetAppResInfo: function (app_id, access_type, success, error) {
            if (!access_type) access_type = 2;
            var subUrl = "/v0.1/api/product/product/actions/get_pkg_res_info";
            var query = "app_id=" + app_id + "&access_type=" + access_type;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 试玩接口
         * @param {String} app_id 作品id
         * @param {int} access_type 获取类型 1-模板库  2-个人库 3-作品库
         * @param {int} get_type 获取类型0-显示需求，1-移动端H5试玩，2-分享需求 ，3-移动端编辑器，4-体验区游戏（移动端），5-PC端编辑器，6-体验区游戏（PC端），7-PC端H5试玩
         * @param {String} version 版本号,为空取最新版本
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetTryPlayingInfo: function (app_id, access_type, get_type, version, success, error) {
            if (!access_type) access_type = 2;
            if (!get_type) {
                if (Edbox.Platform.IsPC) {
                    get_type = 7;
                }
                else {
                    get_type = 1;
                }
            }
            var subUrl = "/v0.1/api/product/product/actions/get_app_res_info";
            var query = "app_id=" + app_id + "&access_type=" + access_type + "&get_type=" + get_type + "&version=" + version;
            MMOGet(subUrl, query, success, error, true);
        },

        /**
         * 游戏心跳
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        HeartBeating: function (success, error) {
            var subUrl = "/v0.1/api/product/stat/actions/add_online";
            var data = new Object();
            data.app_id = Edbox.GameId;
            data.version = Edbox.Version;
            data.access_type = Edbox.Access;
            data.get_type = Edbox.Mode;
            data = JSON.stringify(data);
            MMOPost(subUrl, data, success, error);
        },

        /**
         * 作品搜索接口-体验区
         * @param {String} word 搜索文本内容，默认为空
         * @param {int} page 分页参数，第N页，N从1开始，默认值1
         * @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
         * @param {String} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序
         * @param {String} type 预留参数，作品类型，默认为'all'
         * @param {String} searchPlatforms  "WINDOWS,WEB,ANDROID,IOS" 指定搜索平台参数默认为空字符串，查询所有平台，支持多平台查询，格式每种平台用逗号隔开
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SearchExperienceApps: function (word, page, size, sorts, type, searchPlatforms, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/search_app";
            var query = "word=" + (encodeURIComponent(word) || "") + "&page=" + (page || 1) + "&size=" + (size || 20) + "&sorts=" + (sorts || "") + "&type=" + type + "&searchPlatforms=" + searchPlatforms;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取热门搜索作品
         * @param {int} count 需要获取的热门搜索作品数量，默认值5，count不能超过10，count = 0时默认count = 5
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetHeatApp: function (count, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_app_by_heat";
            var query = "count=" + count;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取作品评价信息
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetAppScoreInfo: function (app_id, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_app_score_info";
            var query = "app_id=" + app_id;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 设置作品评价
         * @param {object} data {
                        {String}app_id : 作品id, 
                        {int}score : 评价，例如： 4 代表四星, 
                        {String}version : 版本，例如：1.0.1
                    }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SetAppScore: function (data, success, error) {
            var subUrl = "/v0.1/api/review/review/actions/set_app_score";
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 获取单个玩家对作品评价信息
         * @param {String} app_id 作品id
         * @param {int} target_user_id 玩家id
         * @param {String} version 默认最新版本，例如1.2.3
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetUserScoreInfo: function (app_id, target_user_id, version, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_user_score_info";
            var query = "app_id=" + app_id + "&target_user_id=" + target_user_id + "&version=" + (version || "");
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 添加自定义标签
         * @param {Object} data 标签名称,Json对象
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SetTag: function (data, success, error) {
            var subUrl = "/v1.1/api/product/product/actions/set_tag";
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 自定义作品标签标签获取
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTags: function (app_id, success, error) {
            if (!app_id) {
                if (error) error("App_id ID Error");
                return;
            }
            var subUrl = "/v1.1/api/product/product/actions/get_customed_tag";
            var query = "app_id=" + app_id;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 固定标签编码与名称映射列表
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetTagMap: function (success, error) {
            var lang = Edbox.GetLanguageCode();
            var subUrl = "/v0.1/api/product/product/actions/get_official_tagmap";
            var query = "lang=" + lang;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 收藏作品
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CollectApp: function (app_id, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/collect_app";
            var data = {
                'app_id': app_id
            };
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 取消收藏作品
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CancelCollectApp: function (app_id, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/cancel_collect_app";
            var data = {
                'app_id': app_id
            };
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 获取用户收藏列表
         * @param {int} page 分页参数，第N页，N从1开始，默认值1
         * @param {int} size 分页参数, 每页大小，默认值10，size最大不能超过100
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetUserCollectApps: function (page, size, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_collect_app_list";
            var query = "page=" + (page || 1) + "&size=" + (size || 20);
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取作品简介及更新说明
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetAppHistory: function (app_id, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_introduction_list";
            var query = "app_id=" + app_id;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取作品推荐列表
         * @param {int} recommand_type 1-填充在没有最近游戏记录情况下的推荐
         * @param {int} page 分页参数，第N页，N从1开始，默认值1
         * @param {int} size 分页参数, 每页大小，默认值10，size最大不能超过100
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetRecommandApps: function (recommand_type, page, size, success, error) {
            var subUrl = "/v0.1/api/product/recommand/actions/get_app_list";
            var query = "recommand_type=" + recommand_type + "&page=" + (page || 1) + "&size=" + (size || 20);
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取作品推荐列表
         * @param {String} appid 作品id
         * @param {String} access_type 作品类型 1-模板作品 2-个人作品 3-体验区作品
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetRecommandAppsByAppId: function (appid, access_type, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_recommand_list";
            var query = "app_id=" + appid + "&access_type=" + access_type;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 添加最近游戏记录列表
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        AddPlayRecord: function (app_id, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/add_play_record";
            var query = "app_id=" + app_id;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取最近游戏记录列表
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetPlayRecord: function (success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_play_record";
            MMOGet(subUrl, "", success, error);
        },

        /**
         * 作品重命名
         * @param {String} app_id 作品id
         * @param {String} new_name 新名字
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        RenameApp: function (app_id, new_name, success, error) {
            var subUrl = "/v0.1/api/product/personal/actions/rename_app";
            var data = {
                'app_id': app_id,
                'new_name': new_name
            };
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 删除作品
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        DeleteApp: function (app_id, success, error) {
            var subUrl = "/v0.1/api/product/personal/actions/delete_app";
            var query = "app_id=" + app_id;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 下架作品
         * @param {String} app_id 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SoldoutApp: function (app_id, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/soldout_app";
            var data = {
                'app_id': app_id
            };
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 取消发布
         * @param {String} app_id 作品id
         * @param {String} version 版本
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CancelPublishApp: function (app_id, version, success, error) {
            var subUrl = "/v1.0/api/product/personal/actions/cancel_release_app";
            var data = {
                'app_id': app_id,
                'version': version
            };
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 作品搜索接口-模板库
         * @param {String} word 搜索文本内容，默认为空
         * @param {int} page 分页参数，第N页，N从1开始，默认值1
         * @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
         * @param {String} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序
         * @param {String} editorTypes 指定搜索编辑器支持平台参数默认为空字符串，查询所有平台，支持多平台查询，格式每种平台用逗号隔开 WEB是移动端,WEB_PC是PC端如：“WINDOWS,WEB,WEB_PC,ANDROID,IOS”
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SearchBaseApps: function (word, page, size, sorts, editorTypes, success, error) {
            var subUrl = "/v0.1/api/product/base/actions/search_app";
            var query = "word=" + (encodeURIComponent(word) || "") + "&page=" + (page || 1) + "&size=" + (size || 20) + "&sorts=" + (sorts || "") + "&editorTypes=" + editorTypes;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 点赞或取消点赞接口-模板库
         * @param {object} data {
                        {String}app_id : 产品id, 
                        {String}version : 版本，例如：1.0.1
                        {int}type: 默认0是取消点赞，1是点赞
                    }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SetLike: function (data, success, error) {
            var subUrl = "/v0.1/api/product/base/actions/like";

            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 验证作品是否重名
         * @param {object} data {
                        {String}app_id : 产品id, 
                        {int}release_mode : 发布方式 1-创建新游 2-更新游戏, 
                        {String}app_name: 产品名称,
                        {int}access_type : 获取类型 1-模板库  2-个人库 3-作品库
                    }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        IsNameDuplicate: function (data, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/check_name_duplicate";
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 用户发布倒计时时间获取
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        PublishCountDown: function (success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_countdown";
            MMOGet(subUrl, "", success, error);
        },

        /**
         * 发布作品
         * @param {object} data {
                        {String}app_id : 作品id, 
                        {String}resid : 资源id, 
                        {String}app_name : 作品名称, 
                        {String}icon: 作品封面图标, 
                        {String}game_tags: 游戏标签 使用逗号隔开, 
                        {String}edu_tags: 教育标签 使用逗号隔开, 
                        {String}screenshot: 作品截图 使用逗号隔开, 
                        {String}introduction: 作品简介, 
                        {int}privacy: 发布范围 1-公开 2-活动
                        {int}releasetime_mode: 发布时间  1-立即发布 2-定时发布, 
                        {String}schedule_time: 时间 例如：2018/12/26 20:51:09, 
                        {String}version: 作品版本, 
                        {String}update_content: 更新内容, 
                        {int}limit: 游戏限制人数 默认10 范围：10-50, 允许为空
                        {String}baseid: 作品模板id,允许为空
                        {String}activity_id: 活动ID,
                        {int}price:发布价格
                    }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ReleaseApp: function (data, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/release_app";
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 敏感词判断
         * @param {String} word 需要验证的字符串
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        IsSensitive: function (word, success, error) {
            var subUrl = "/v0.1/api/product/verify/actions/sensitive";
            var query = "word=" + encodeURIComponent(word);
            query = query.replace("'", "%27");
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 创建作品
         * @param {object} data {
                        {String}resid : 资源id, 
                        {String}pkg_resid : package 资源id, 
                        {String}pc_resid: pc资源id,
                        {String}web_resid : h5资源id,
                        {String}android_resid : android资源id,
                        {String}ios_resid : ios 资源id,
                        {String}wp_resid : window phone资源id,
                        {String}app_name : 作品名称,
                        {String}icon : 作品封面图标,
                        {String}game_tags : 游戏标签 使用逗号隔开,
                        {String}edu_tags : 教育标签 使用逗号隔开,
                        {String}screenshot : 作品截图 使用逗号隔开,
                        {String}introduction : 作品简介,
                        {int}privacy : 发布范围 1-公开  0-私有,
                        {String}version : 作品版本,
                        {String}baseid : 模板id,
                        {String}base_version : 模板版本
                    }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CreateProduct: function (data, success, error) {
            var subUrl = "/v0.1/api/product/personal/actions/create_app";
            // 提交
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 更新作品
         * @param {object} data {
                        {String}app_id : 作品id, 
                        {String}resid : 资源id, 
                        {String}pkg_resid : package 资源id, 
                        {String}pc_resid: pc资源id,
                        {String}web_resid : h5资源id,
                        {String}android_resid : android资源id,
                        {String}ios_resid : ios 资源id,
                        {String}wp_resid : window phone资源id,
                        {String}app_name : 作品名称,
                        {String}icon : 作品封面图标,
                        {String}game_tags : 游戏标签 使用逗号隔开,
                        {String}edu_tags : 教育标签 使用逗号隔开,
                        {String}screenshot : 作品截图 使用逗号隔开,
                        {String}introduction : 作品简介,
                        {int}privacy : 发布范围 1-公开  0-私有,
                        {String}version : 作品版本
                    }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        UpdateApp: function (data, success, error) {
            var subUrl = "/v0.1/api/product/personal/actions/update_app";
            // 提交
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 复制个人作品
         * @param {String} app_id 个人作品id
         * @param {String} version 版本号,为空取最新版本
         * @param {String} app_name 新的作品名称
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CopyPersonalApp: function (app_id, version, app_name, success, error) {
            var subUrl = "/v0.1/api/product/personal/actions/copy_app";
            var data = "app_id=" + app_id + "&version=" + version + "&app_name=" + encodeURI(app_name);
            MMOGet(subUrl, data, success, error);
        },

        /**
         * 添加验证邮箱
         * @param {String} send_to_address 接收的邮箱地址
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        AddEmailVerify: function (send_to_address, success, error) {
            var subUrl = "/v0.1/api/user/user/actions/add_email_verify";
            var data = {
                'send_to_address': send_to_address
            };
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 重新发送验证邮箱
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ResendEmail: function (success, error) {
            var subUrl = "/v0.1/api/user/user/actions/resend_email";
            MMOPost(subUrl, '', success, error);
        },

        /**
         * 修改邮箱
         * @param {String} send_to_address 接收的邮箱地址
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        UpdateEmailVerify: function (send_to_address, success, error) {
            var subUrl = "/v0.1/api/user/user/actions/update_user_email_address";
            var data = {
                'send_to_address': send_to_address
            };
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 修改用户个人信息
         * @param {object} data {
                        {String}birthday : 生日, 如不传该参数则不修改该用户生日，格式如：20190213, 
                        {int}sex : 性别, 如不传该参数则不修改该用户性别，1男，2女 , 
                        {String}nick_name : 昵称, 如不传该参数或传空字符串则不修改该用户昵称, 
                        {String}head : 头像资源, 如不传该参数或传空字符串则不修改该用户头像, 
                    }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        UpdateUserInfo: function (data, success, error) {
            var subUrl = "/v0.1/api/user/user/actions/update_user_info";
            MMOPost(subUrl, data, success, error);
        },

        /**
         * 获取用户个人信息
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetUser: function (success, error) {
            // var subUrl = "/v0.1/api/userCenter/user/actions/get_detail_info";
            var subUrl = "/v0.1/api/user/user/actions/get_user";
            var data = "acc_type=";
            MMOGet(subUrl, data, success, error);
        },

        /**
         * 注销用户
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        Logout: function (success, error) {
            var subUrl = "/v1.0/api/user/user/actions/logout";
            MMOGet(subUrl, null, success, error);
        },

        /**
         * 加载获取引导节点信息
         * @param {String} app_id 应用id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetLoadGuideNodeInfo: function (app_id, success, error) {
            var subUrl = "/v0.1/api/guide/guide/actions/load_guides";
            var query = "app_id=" + app_id;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 完成引导节点
         * @param {String} app_id : 应用id
         * @param {int} node_id : 节点id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        FinishGuideNode: function (app_id, node_id, success, error) {
            var subUrl = "/v0.1/api/guide/guide/actions/finish_guide_node";
            var data = {
                app_id: app_id,
                node_id: node_id
            };
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 获取最近编辑游戏记录
         * @param {int} page 页码
         * @param {int} size 每页个数
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetEditRecordInfo: function (page, size, success, error) {
            var subUrl = "/v1.0/api/product/personal/actions/get_edit_history";
            var query = "page=" + page + "&size=" + size;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 修改最近编辑游戏记录条数
         * @param {string} app_id 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        PostChangeNumEditRecord: function (app_id, success, error) {
            var subUrl = "/v1.0/api/product/personal/actions/set_recent_edit_num";
            var query = "app_id=" + app_id;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取临时作品id
         * @param {number} access_type 作品类型，1-模板库  2-个人库
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTempAppId: function (access_type, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_temp_app_id";
            var data = "access_type=" + access_type;
            MMOGet(subUrl, data, success, error);
        },

        /**
         * 获取热词信息
         * @param {string} product_type set表示体验区热词，base表示模板热词
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetHotWords: function (product_type, success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_hot_word_list";
            var data = "product_type=" + product_type;
            MMOGet(subUrl, data, success, error);
        },

        /**
         * 模板作品创建
         * @param {object} data {
         * {String} app_name : 作品名称 必填
         * {Number} privacy : 发布范围：0-私有,1-公开 必填
         * {Number} replicable : 是否支持复制：1-支持 2-不支持 必填
         * {String} pkg_resid : package 资源id 必填
         * {String} game_tags : 游戏标签 使用逗号隔开 必填
         * {String} edu_tags : 教育标签 使用逗号隔开 必填
         * {String} editor_frame_type : 编辑器类型 0-旧版本编辑器 1-新框架编辑器 必填
         * {Number} grade :  游戏评级，1:0-10岁，2:10-13岁，3:13-17岁，4：17-18岁，5：18+ 必填
         * ...
         * }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CreateBaseApp: function (data, success, error) {
            var subUrl = "/v1.1/api/product/base/actions/create_app";
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 模板作品更新
         * @param {object} data {
         * {String} app_id : 作品id 必填
         * {String} app_name : 作品名称 必填
         * {Number} privacy : 发布范围：0-私有,1-公开 必填
         * {Number} replicable : 是否支持复制：1-支持 2-不支持 必填
         * {String} version : 作品版本 必填
         * {String} pkg_resid : package 资源id 必填
         * {String} game_tags : 游戏标签 使用逗号隔开 必填
         * {String} edu_tags : 教育标签 使用逗号隔开 必填
         * {String} editor_frame_type : 编辑器类型 0-旧版本编辑器 1-新框架编辑器 必填
         * {Number} grade :  游戏评级，1:0-10岁，2:10-13岁，3:13-17岁，4：17-18岁，5：18+ 必填
         * ...
         * }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        UpdateBaseApp: function (data, success, error) {
            var subUrl = "/v1.1/api/product/base/actions/update_app";
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 模板作品覆盖
         * @param {object} data {
         * {String} app_id : 作品id 必填
         * {String} app_name : 作品名称 必填
         * {Number} privacy : 发布范围：0-私有,1-公开 必填
         * {Number} replicable : 是否支持复制：1-支持 2-不支持 必填
         * {String} version : 作品版本 必填
         * {String} pkg_resid : package 资源id 必填
         * {String} game_tags : 游戏标签 使用逗号隔开 必填
         * {String} edu_tags : 教育标签 使用逗号隔开 必填
         * {String} editor_frame_type : 编辑器类型 0-旧版本编辑器 1-新框架编辑器 必填
         * {Number} grade :  游戏评级，1:0-10岁，2:10-13岁，3:13-17岁，4：17-18岁，5：18+ 必填
         * ...
         * }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CoverBaseApp: function (data, success, error) {
            var subUrl = "/v1.1/api/product/base/actions/cover_update_app";
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
         * 获取模板详情
         * @param {String} app_id 模板id
         * @param {String} version 模板版本号,为空取最新版本
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetBaseAppInfo: function (app_id, version, success, error) {
            var subUrl = "/v1.1/api/product/base/actions/get_app_detail";
            var query = "app_id=" + app_id + "&version=" + version;
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取模板历史版本列表
         * @param {String} app_id 模板id
         * @param {int} page 分页参数，第N页，N从1开始，默认值1
         * @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
         * @param {String} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetBaseAppHistoryList: function (app_id, page, size, sorts, success, error) {
            var subUrl = "/v0.1/api/product/base/actions/get_history_list";
            var query = "app_id=" + app_id + "&page=" + (page || 1) + "&size=" + (size || 20) + "&sorts=" + (sorts || "");
            MMOGet(subUrl, query, success, error);
        },

        /**
          * 模板作品上架
          * @param {String} app_id 模板id 
          * @param {String} version 版本号
          * @param {Function} success 成功回调
          * @param {Function} error 出错回调
          */
        ReleaseBaseApp: function (app_id, version, success, error) {
            var subUrl = "/v0.1/api/product/base/actions/release_app";
            var data = {
                app_id: app_id,
                version: version
            };
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },

        /**
          * 模板作品下架
          * @param {String} app_id 模板id 
          * @param {String} version 版本号
          * @param {Function} success 成功回调
          * @param {Function} error 出错回调
          */
        SoldoutBaseApp: function (app_id, version, success, error) {
            var subUrl = "/v0.1/api/product/base/actions/soldout_app";
            var data = {
                app_id: app_id,
                version: version
            };
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },
        /**
          * 模板库帮助手册设置
          * @param {String} app_id 作品id
          * @param {String} version 版本号
          * @param {String} docurl 帮助手册sign码
          * @param {Number} isopen 是否开启帮助手册
          * @param {Function} success 成功回调
          * @param {Function} error 出错回调
          */
        SetHelpDoc: function (app_id, version, docurl, isopen, success, error) {
            var subUrl = "/v0.1/api/product/base/actions/set_help_doc";
            var data = {
                app_id: app_id,
                version: version,
                docurl: docurl,
                isopen: isopen
            };
            MMOPost(subUrl, JSON.stringify(data), success, error);
        },
        /**
         * 设置用户个人信息标志位
         * @param {number} flag 标志位
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SetStatisticsFlag: function (flag, success, error) {
            var subUrl = "/v0.1/api/user/user/actions/setStatisticsFlag";
            var data = {
                user_id: Edbox.EbUserId,
                statistics_flag: flag
            };

            MMOPost(subUrl, JSON.stringify(data), success, error);
        },
        /**
         * 获取模板库所有模板
         * @param {int} page 分页参数，第N页，N从1开始，默认值1
         * @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
         * @param {String} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序 
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetBaseAppList: function (page, size, sorts, success, error) {
            var subUrl = "/v1.0/api/product/base/actions/get_app_list";
            var query = "page=" + (page || 1) + "&size=" + (size || 20) + "&sorts=" + (sorts || "");
            MMOGet(subUrl, query, success, error);
        },
        /**
          * 获取模板库帮助手册
          * @param {String} app_id 作品id
          * @param {String} version 版本号
          * @param {Function} success 成功回调
          * @param {Function} error 出错回调
          */
        GetHelpDoc: function (app_id, version, success, error) {
            var subUrl = "/v0.1/api/product/base/actions/get_help_doc";
            var query = "app_id=" + app_id + "&version=" + (version || "");
            MMOGet(subUrl, query, success, error);
        },

        /**
         * 获取个人库作品发布列表
         * @param {int} word 关键字
         * @param {int} page 分页参数，第N页，N从1开始，默认值1
         * @param {int} size 分页参数, 每页大小，默认值20，size最大不能超过100
         * @param {String} sorts 排序字段，!表示降序，多个之间用逗号（,）隔开 eg: sorts="!popular, releasetime"表示先按在线人数降序，再按游戏上线时间升序 
         * @param {int} status 0-编辑区作品（所有作品），1-发布区作品（已发布作品）
         * @param {String} searchPlatforms 指定平台用逗号隔开，默认查询所有平台 “WINDOWS,WEB,ANDROID,IOS”
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        SearchPersonalApps: function (word, page,size,sorts,status,searchPlatforms,success, error) {
            var subUrl = "/v0.1/api/product/product/actions/get_hot_word_list";
            var data = "word=" + word + "page=" + page + "size=" + size + "sorts=" + sorts + "status=" + status + "searchPlatforms=" + searchPlatforms;
            MMOGet(subUrl, data, success, error);
        },

        /**
         * 获取钱包余额
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetBalance: function (success,error) {
            var subUrl = "/v1.0/api/user/user/actions/get_balance";
            MMOGet(subUrl,"",success,error);
        },

        /**
         * 获取VIP配置列表
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetVipInfos : function (success,error) {
            var subUrl = "/v1.0/api/vip/vip/actions/get_config_list";
            var data = "app_id=" + Edbox.SDPAppId;
            MMOGet(subUrl,data,success,error);
        },

        /**
         * 获取VIP配置(单个)
         * @param {number} vip_level Vip等级
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetVipInfo : function (vip_level, success,error) {
            var subUrl = "/v1.0/api/vip/vip/actions/get_config";
            var data = "app_id=" + Edbox.SDPAppId + "&vip_level=" + vip_level;
            MMOGet(subUrl,data,success,error);
        },

        /**
         * 创建订单
         * @param {number} item_id 商品id
         * @param {number} quantity 商品数量
         * @param {number} app_id 租户id或者商品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CreateOrder : function (item_id, quantity, app_id, success,error) {
            var subUrl = "/v1.0/api/vip/vip/actions/create_order";
            var data = {
                item_id: item_id,
                quantity: quantity,
                app_id: app_id
            };
            MMOPost(subUrl,JSON.stringify(data),success,error);
        },

        /**
         * 购买游戏
         * @param {number} app_id 体验区游戏作品id
         * @param {number} pay_source 支付渠道, 0-其它，1-iOS，2-android，3-web
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        PurchaseGame : function (app_id, pay_source, success,error) {
            var subUrl = "/v0.1/api/product/product/actions/purchase_game";
            var data = {
                app_id: app_id,
                pay_source: pay_source
            };
            MMOPost(subUrl,JSON.stringify(data),success,error);
        },

        /**
         * 是否购买游戏
         * @param {number} app_id 体验区游戏作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CheckPurchaseGame : function (app_id, success,error) {
            var subUrl = "/v0.1/api/product/product/actions/check_purchase_game";
            var data = "app_id=" + app_id;
            MMOGet(subUrl,data,success,error);
        },

        /**
         * 获取个人作品收益
         * @param {String} app_id 作品id
         * @param {String} access_type 作品类型，1-模板库 2-个人库 目前暂不生效
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetAppIncome: function (app_id, access_type, success, error) {
            var subUrl = "/v1.0/api/product/personal/actions/get_app_profit_info";
            var data = "app_id=" + app_id;
            MMOGet(subUrl, data, success, error);
        },

        /**
         * 作品创建预检
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        PrecheckCreate: function (success, error) {
            var subUrl = "/v1.0/api/product/product/actions/get_precheck_status";
            var data = "action_type=0";
            MMOGet(subUrl, data, success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Api, "MMO"));