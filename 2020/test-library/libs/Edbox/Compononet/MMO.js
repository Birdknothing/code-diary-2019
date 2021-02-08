// Edbox MMO组件
(function (namespace, className) {
    /**
     * 数组转字串
     * @param {Array} array 数组
     * @returns {String} 字串
     */
    function GetArrayString(array) {
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
    }

    /**
     * Api使用
     */
    var api = Edbox.Api.MMO;

    /**
     * Edbox MMO组件
     * 用于Edbox平台的访问MMO服务器游戏发布试玩过程
     * @author 温荣泉(201901)
     * @see http://ndsdn.nd.com.cn/index.php?title=EdboxMMO%E7%BB%84%E4%BB%B6JS%E7%89%88
     * */
    var module = {
        /**
         * 获取模板或个人作品信息
         * 集成方法,返回效率受Edbox.Access的设置影响
         * @param {String} productid 模板id
         * @param {Function} success 成功回调,带Object类型参数,access_type定义类型 1、模板库 2、个人作品
         * @param {Function} error 出错回调
         * @param {Boolean} change 是否调整Edbox.Access，默认不调整
         */
        GetInfo: function (productid, success, error, change) {
            if (!productid) {
                if (error) error("Product ID Error");
                return;
            }

            // 获取模板的信息
            function GetTemplateInfo(guid, success, error) {
                module.GetTemplateInfo(guid, "", function (data) {
                    data.access_type = 1;
                    Edbox.BaseAppId = data.app_id;
                    if (change) {
                        Edbox.Access = 1;
                        Edbox.GameId = guid;
                        Edbox.Version = data.version;
                    }
                    if (success) success(data);
                }, error);
            }

            // 获取个人作品的信息
            function GetProductInfo(guid, success, error) {
                module.GetProductInfo(guid, function (data) {
                    data.access_type = 2;
                    Edbox.BaseAppId = data.baseid;
                    if (change && Edbox.Access === 1) {
                        Edbox.Access = 2;
                    }
                    if (success) success(data);
                }, error);
            }

            // 获取个人作品的信息
            function GetAppInfo(guid, success, error) {
                module.GetAppInfo(guid, function (data) {
                    data.access_type = 3;
                    if (change) {
                        Edbox.Access = 3;
                    }
                    if (success) success(data);
                }, error);
            }

            // 假设Edbox.Access与请求的productid的类型一致
            // 不一致时溢出使用其他方法请求
            // 若其他方法成功返回，且change为true将修改Edbox.Access
            if (Edbox.Access === 1) {
                GetTemplateInfo(productid, success, function () {
                    GetAppInfo(productid, success, function () {
                        GetProductInfo(productid, success, error);
                    });
                });
            } else if (Edbox.Access === 2) {
                GetProductInfo(productid, function (appData) {
                    if (appData && appData.operation_type === 1) {
                        change = true;
                        GetTemplateInfo(appData.baseid, success, error);
                    } else {
                        if (success) success(appData);
                    }
                }, function () {
                    GetTemplateInfo(productid, success, error);
                });
            } else {
                GetAppInfo(productid, success, function () {
                    GetTemplateInfo(productid, success, function () {
                        GetProductInfo(productid, success, error);
                    });
                });
            }
        },

        /**
         * 获取模板信息
         * @param {String} productid 模板id
         * @param {String} version 模板版本号,为空取最新版本
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTemplateInfo: function (productid, version, success, error) {
            api.GetBaseAppInfo(productid, version, success, error);
        },

        /**
        * 获取个人作品信息
        * @param {String} productid 作品id
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
        */
        GetProductInfo: function (productid, success, error) {
            api.GetPersonalAppInfo(productid, success, error);
        },

        /**
         * 获取体验区作品信息
         * @param {String} productid 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetAppInfo: function (productid, success, error) {
            api.GetAppInfo(productid, success, error);
        },



        /**
         * 验证作品名是否含有非法字符
         * @param {String} name 作品名称
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        IsNameVerified: function (name, success, error) {

            // 作品名称全空格判断
            if (name.match(/^[ ]+$/)) {
                console.log("GameName all space");
                if (error) error(Edbox.GetTip("ERROR_GAMENAME_SPACE"));
                return;
            }
            if (name.match(/[\\\/:*?"<>|]/)) {
                console.log("GameName illegal_character");
                if (error) error(Edbox.GetTip("ERROR_ILLEGAL_CHARACTER"));
                return;
            }

            if (success) success();

        },

        /**
         * 验证作品是否重名
         * @param {String} productid 作品id
         * @param {Number} releaseMode 发布方式 1-创建新游 2-更新游戏
         * @param {String} productname 作品名称
         * @param {Number} type 获取类型 1-模板库  2-个人库 3-作品库
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        IsNameDuplicate: function (productid, releaseMode, productname, type, success, error) {

            // 检测是否包含非法字符
            module.IsNameVerified(productname, function () {
                var data = {
                    'app_id': productid,
                    'release_mode': releaseMode - 0,
                    'app_name': productname,
                    'access_type': type - 0
                };
                api.IsNameDuplicate(data, success, error);

            }, function (err) {
                if (error) error(err);
            });
        },

        /**
         * 敏感词判断
         * @param {String} word 需要验证的字符串
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        IsSensitive: function (word, success, error) {
            api.IsSensitive(word, success, error);
        },

        /**
         * 保存作品
         * @param {String} productid 作品id
         * @param {String} packageid 配置包GUID
         * @param {String} productname 作品名称
         * @param {String} icon 图标、封面
         * @param {String} introduction 描述介绍
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {String} temp_id 预分配作品id
         */
        SaveProduct: function (productid, packageid, productname, icon, introduction, success, error, temp_id) {
            // 模板回调
            function tempCallback(data) {
                if (data.access_type === 1) {
                    data.operation_type = 0;
                    module.CreateProduct(productid, packageid, productname, icon, introduction, success, error, data, temp_id);
                }
                else {
                    module.UpdateProduct(productid, packageid, productname, icon, introduction, success, error, data);
                }
            }

            // 获取模板或个人作品信息
            module.GetInfo(productid, tempCallback, error, true);
        },

        /**
         * 保存临时作品（用于导出功能）
         * @param {String} productid 作品id
         * @param {String} version 版本号
         * @param {String} packageid 配置包GUID
         * @param {String} icon 图标、封面
         * @param {String} introduction 描述介绍
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SaveTempProduct: function (productid, version, packageid, icon, introduction, success, error) {

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

            // 模板回调
            function tempCallback(data) {
                data.operation_type = 1;
                var date = new Date();
                var d = date.getDate() - 1; // 获取日
                var h = date.getHours(); // 获取小时
                var m = date.getMinutes(); // 获取分钟
                var s = date.getSeconds(); // 获取秒
                var t = ((d * 24 + h) * 60 + m) * 60 + s;
                var gameName = data.app_name + string10to62(t);
                module.CreateTempProduct(productid, version, packageid, gameName, icon, introduction, function (returnData) {
                    returnData.TempName = gameName;
                    success(returnData);
                }, error, data);
            }


            // 获取模板或个人作品信息
            module.GetTemplateInfo(productid, "", tempCallback, error);
        },

        /**
         * 创建作品(用于导出功能)
         * @param {String} productid 作品id
         * @param {String} version 版本号
         * @param {String} packageid 资源包id
         * @param {String} productname 作品名称
         * @param {String} icon 图标、封面
         * @param {String} introduction 描述介绍
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {Object} infodata 作品信息数据对象
         */
        CreateTempProduct: function (productid, version, packageid, productname, icon, introduction, success, error, infodata) {
            // 提交创建
            function create(tempData) {
                // 构造
                var data = {
                    pkg_resid: packageid,
                    app_name: productname,
                    icon: icon,
                    game_tags: GetArrayString(tempData.game_tags),
                    edu_tags: GetArrayString(tempData.edu_tags),
                    screenshot: GetArrayString(tempData.screenshot),
                    introduction: introduction,
                    version: "1.0",
                    privacy: 1,
                    baseid: productid,
                    base_version: version,
                    operation_type: tempData.operation_type
                };

                // 提交
                api.CreateProduct(data, success, error);
            }

            // 基于infodata创建
            function createByInfodata() {
                if (!productname || productname.trim().length < 1) {
                    productname = infodata.app_name;
                }
                if (!icon || icon.trim().length < 1) {
                    icon = infodata.icon;
                }
                if (!introduction || introduction.trim().length < 1) {
                    introduction = infodata.introduction;
                }
                if (introduction.length > 1000) {
                    alert(Edbox.GetTip("ERROR_LengthExceeds"));
                    if (error)
                        error(Edbox.GetTip("ERROR_LengthExceeds"));
                    return;
                }
                if (!packageid || packageid.trim().length < 1) {
                    packageid = infodata.resid;
                }

                // 重名检测
                module.IsNameDuplicate(productid, 1, productname, 2, function (ans) {
                    if (ans.is_duplicate === 1) {
                        if (error)
                            error(Edbox.GetTip("ERROR_NameDuplicate"));
                        return;
                    }
                    create(infodata);
                }, error);
            }

            // 模板回调
            function tempCallback(data) {
                var operation_type = infodata.operation_type;
                infodata = data;
                infodata.operation_type = operation_type;
                createByInfodata();
            }

            if (infodata && infodata.access_type === 1) {
                createByInfodata();
                return;
            }

            // 获取模板信息
            module.GetTemplateInfo(productid, "", tempCallback, error);
        },

        /**
         * 创建作品
         * @param {String} productid 模板ID
         * @param {String} packageid 配置包GUID
         * @param {String} productname 作品名称
         * @param {String} icon 图标、封面
         * @param {String} introduction 描述介绍
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {Object} infodata 作品信息数据对象
         * @param {String} app_id  预分配产品id,允许为空
         */
        CreateProduct: function (productid, packageid, productname, icon, introduction, success, error, infodata, app_id) {
            // 提交创建
            function create(tempData) {

                if (!app_id || app_id === productid) {
                    app_id = "";
                }

                // 构造
                var data = {
                    pkg_resid: packageid,
                    app_name: productname,
                    icon: icon,
                    game_tags: GetArrayString(tempData.game_tags),
                    edu_tags: GetArrayString(tempData.edu_tags),
                    screenshot: GetArrayString(tempData.screenshot),
                    introduction: introduction,
                    version: "1.0",
                    privacy: 1,
                    baseid: productid,
                    base_version: infodata.version,
                    operation_type: tempData.operation_type,
                    app_id: app_id
                };

                // 提交
                api.CreateProduct(data, success, error);
            }

            // 基于infodata创建
            function createByInfodata() {
                if (!productname || productname.trim().length < 1) {
                    productname = infodata.app_name;
                }
                if (!icon || icon.trim().length < 1) {
                    icon = infodata.icon;
                }
                if (!introduction || introduction.trim().length < 1) {
                    introduction = infodata.introduction;
                }
                if (introduction.length > 1000) {
                    alert(Edbox.GetTip("ERROR_LengthExceeds"));
                    if (error)
                        error(Edbox.GetTip("ERROR_LengthExceeds"));
                    return;
                }
                if (!packageid || packageid.trim().length < 1) {
                    packageid = infodata.resid;
                }

                // 重名检测
                module.IsNameDuplicate(productid, 1, productname, 2, function (ans) {
                    if (ans.is_duplicate === 1) {
                        if (error)
                            error(Edbox.GetTip("ERROR_NameDuplicate"));
                        return;
                    }
                    create(infodata);
                }, error);
            }

            // 模板回调
            function tempCallback(data) {
                infodata = data;
                createByInfodata();
            }

            if (infodata && infodata.access_type === 1) {
                createByInfodata();
                return;
            }

            // 获取模板信息
            module.GetTemplateInfo(productid, "", tempCallback, error);
        },

        /**
         * 更新作品
         * @param {String} productid 作品id
         * @param {String} packageid 配置包GUID
         * @param {String} productname 作品名称
         * @param {String} icon 图标、封面
         * @param {String} introduction 描述介绍
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @param {Object} infodata 作品信息数据对象
         */
        UpdateProduct: function (productid, packageid, productname, icon, introduction, success, error, infodata) {
            // 提交更新
            function create(tempData) {
                var version = 1.0;
                try {
                    version = (parseFloat(tempData.version) + 0.01).toFixed(2);
                } catch (e) {
                    console.log("Version Error,Version = 1.0");
                }

                // 构造
                var data = {
                    app_id: productid,
                    pkg_resid: packageid,
                    app_name: productname,
                    icon: icon,
                    game_tags: GetArrayString(tempData.game_tags),
                    edu_tags: GetArrayString(tempData.edu_tags),
                    screenshot: GetArrayString(tempData.screenshot),
                    introduction: introduction,
                    privacy: 1,
                    version: ""
                };

                // 提交
                api.UpdateApp(data, function (data) {
                    data.version = version;
                    if (success) success(data);
                }, error);
            }

            // 基于infodata创建
            function createByInfodata() {
                if (!productname || productname.trim().length < 1) {
                    productname = infodata.app_name;
                }
                if (!icon || icon.trim().length < 1) {
                    icon = infodata.icon;
                }
                if (!introduction || introduction.trim().length < 1) {
                    introduction = infodata.introduction;
                }
                if (introduction.length > 1000) {
                    alert(Edbox.GetTip("ERROR_LengthExceeds"));
                    if (error)
                        error(Edbox.GetTip("ERROR_LengthExceeds"));
                    return;
                }
                if (!packageid || packageid.trim().length < 1) {
                    packageid = infodata.resid;
                }

                // 重名检测
                module.IsNameDuplicate(productid, 2, productname, 2, function (ans) {
                    if (ans.is_duplicate === 1) {
                        if (error)
                            error('product name is duplicate');
                        return;
                    }
                    create(infodata);
                }, error);
            }

            // 模板回调
            function tempCallback(data) {
                infodata = data;
                createByInfodata();
            }

            if (infodata && infodata.access_type === 2) {
                createByInfodata();
                return;
            }

            // 获取个人作品信息
            module.GetProductInfo(productid, tempCallback, error);
        },

        /**
         * 复制作品
         * @param {String} productid 作品id
         * @param {String} productname 作品名称
         * @param {String} version 作品版本
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CopyProduct: function (productid, productname, version, success, error) {
            api.CopyPersonalApp(productid, '', productname, function (data) {
                if (!data.productid || data.productid.length < 1) {
                    if (error) error(data);
                    return;
                }

                if (success) success(data.productid);

            }, function (data) {
                if (data.responseJSON.code === "EDBOX_LOBBY/PRODUCT_NAME_DUPLICATE") {
                    if (error) error("product name is duplicate");
                }
                else {
                    if (error) error(data);
                }
            });
        },

        /**
         * 获取个人库游戏试玩信息
         * @param {String} productid 产品ID
         * @param {String} version 版本
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTrialPlayInfo: function (productid, version, success, error) {
            module.GetGameInfo(productid, version, 2, 1, function (data) {
                var url = data.web_resid;
                url = Edbox.FillUrl(url);
                data.web_resid = url;
                if (success) success(data);
            }, error);
        },

        /**
         * 获取游戏链接
         * @param {String} productid 产品ID
         * @param {String} version 版本
         * @param {any} access 访问类型  1-模板 2-个人库 3-体验库
         * @param {any} mode 访问模式 0-显示需求 1-试玩需求 2-分享需求  3-编辑 4-体验区游戏
         * @param {Function} success 成功回调,带String类型试玩链接
         * @param {Function} error 出错回调
         */
        GetGameLink: function (productid, version, access, mode, success, error) {
            module.GetGameInfo(productid, version, access, mode, function (data) {
                var url = data.web_resid;
                url = Edbox.FillUrl(url);
                if (success) success(url);
            }, error);
        },

        /**
         * 无需登录获取资源链接
         * @param {String} url Url
         * @param {String} data 数据 
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetSrcUrlWithoutLogin: function (url, data, success, error) {
            api.MMOGetWithoutLogin(url, data, success, error);
        },

        /**
         * 获取游戏信息
         * @param {String} productid 产品ID
         * @param {String} version 版本
         * @param {Number} access 访问类型  1-模板 2-个人库 3-体验库
         * @param {Number} mode 访问模式 0-显示需求 1-试玩需求 2-分享需求  3-编辑 4-体验区游戏
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetGameInfo: function (productid, version, access, mode, success, error) {
            if (!version) version = "";
            Edbox.Action.MMO.GetTryPlayingInfo(productid, access, mode, version, function (data) {
                if (!data.pkg_resid) {
                    if (error) error("Request failed,Server Error");
                    return;
                }
                if (success) success(data);
            }, error);
        },

        /**
         * 获取作品列表
         * @param {String} key 关键字
         * @param {Number} page 页数
         * @param {Number} size 每页数量
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetProductList: function (key, page, size, success, error) {
            api.SearchExperienceApps(key, page, size, "", "", "", success, error);
        },

        /**
         * 发布作品（旧）
         * @param {String} productid 作品id
         * @param {String} version 版本号
         * @param {String} packageid 配置包GUID
         * @param {String} productname 作品名称
         * @param {String} icon 图标、封面
         * @param {String} introduction 描述介绍
         * @param {Number} privacy 发布范围 2-活动 1-公开  0-私有
         * @param {String} activity_id 活动id
         * @param {String} screenshot 作品截图
         * @param {String} update_content 更新内容
         * @param {Date} schedule_time 发布时间,未填写或null时立即发布
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ReleaseProduct: function (productid, version, packageid, productname, icon, introduction, privacy, activity_id, screenshot, update_content, schedule_time, success, error) {
            var infodata = null;

            // 提交创建
            function create(tempData) {
                if (!version || version.trim().length === 0) {
                    version = 1.0;
                    try {
                        version = parseFloat(tempData.version) + 0.01;
                    } catch (e) {
                        console.log("Version Error,Version = 1.0");
                    }
                    version = "" + version;
                }

                if (privacy === 2 && !activity_id) {
                    if (error) {
                        error("活动需要指定活动ID");
                    }
                    return;
                }

                // 构造
                var data = {
                    app_id: productid,
                    resid: packageid,
                    app_name: productname,
                    icon: icon,
                    game_tags: GetArrayString(tempData.game_tags),
                    edu_tags: GetArrayString(tempData.edu_tags),
                    screenshot: GetArrayString(tempData.screenshot),
                    introduction: introduction,
                    privacy: privacy,
                    release_mode: 1,
                    releasetime_mode: 1,
                    version: version,
                    update_content: update_content, // 更新内容
                    area: "cn",
                    is_exp_protocol: 0
                };

                if (schedule_time && schedule_time > new Date()) {
                    data.releasetime_mode = 2;
                    data.schedule_time = schedule_time.toISOString().replace(/T/g, ' ').replace(/Z/g, '');
                }

                if (privacy === 2) {
                    data.activity_id = activity_id;
                }

                if (screenshot && screenshot.trim().length > 0) {
                    data.screenshot = screenshot;
                }

                // 提交
                api.ReleaseApp(data, success, error);
            }

            // 基于infodata创建
            function createByInfodata() {
                if (!productname || productname.trim().length < 1) {
                    productname = infodata.app_name;
                }
                if (!icon || icon.trim().length < 1) {
                    icon = infodata.icon;
                }
                if (!introduction || introduction.trim().length < 1) {
                    introduction = infodata.introduction;
                }
                if (introduction.length > 1000) {
                    if (error)
                        error('Introduction Length Exceeds 1000');
                    return;
                }
                if (!packageid || packageid.trim().length < 1) {
                    packageid = infodata.resid;
                }

                // 重名检测
                module.IsNameDuplicate(productid, 2, productname, 3, function (ans) {
                    if (ans.is_duplicate === 1) {
                        if (error)
                            error('product name is duplicate');
                        return;
                    }
                    create(infodata);
                }, error);
            }

            // 模板回调
            function tempCallback(data) {
                infodata = data;
                createByInfodata();
            }

            // 获取模板或个人作品信息
            module.GetInfo(productid, tempCallback, error, true);
        },

        /**
         * 游戏心跳
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        HeartBeating: function (success, error) {
            api.HeartBeating();
        },

        /**
         * 添加自定义标签
         * @param {String} productid 作品id
         * @param {Object} tag 标签名称,Json对象, {"edutags": ['T0021'],"gametags": ['T0010', 'T0009'],"othertags": ['T0022']，"customededutags": ['jjj', 'iiiii'],"customedgametags": ['ooo', 'nnn']}
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SetTag: function (productid, tag, success, error) {
            if (!productid) {
                if (error) error("Product ID Error");
                return;
            }
            if (!tag) {
                if (error) error("Tag Error");
                return;
            }
            var data = {
                app_id: productid,
                tagname: tag
            };
            api.SetTag(data, success, error);
        },

        /**
         * 自定义作品标签标签获取
         * @param {String} productid 作品id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTags: function (productid, success, error) {
            api.GetTags(productid, success, error);
        },

        /**
         * 固定标签编码与名称映射列表
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetTagMap: function (success, error) {
            api.GetTagMap(success, error);
        },

        /**
         * 获取字符串长度
         * @param {String} str 字符串
         * @param {Function} success 成功回调, 返回字符长度 
         * @param {Function} error 出错回调
         */
        GetStrLen: function (str, success, error) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                //单字节加1   
                if (c >= 0x0001 && c <= 0x007e || 0xff60 <= c && c <= 0xff9f) {
                    len++;
                }
                else {
                    len += 2;
                }
            }

            if (success) success(len);
        },

        /**
         * 截取指定长度的中英文混合字符串
         * @param {string} str 字符串
         * @param {number} len 截取长度
         * @param {Function} success 成功回调, 返回截取后的字符
         * @param {Function} error 出错回调
         */
        SubStrLen: function (str, len, success, error) {
            var strLen = str.length;
            var strCut = '';
            var strLength = 0;

            for (var i = 0; i < strLen; i++) {
                var charStr = str.charAt(i); //使用charAt获取单个字符
                strLength++;

                if (encodeURI(charStr).length > 4) { //使用encodeURI获取编码长度
                    strLength++;
                }

                if (strLength > len) {
                    if (success) success(strCut);
                    return;
                }
                strCut = strCut.concat(charStr);//单个字符进行合并

            }

            if (strLength <= len) {
                if (success) success(str);
                return;
            }
        },

        /**
         * 截取指定长度的中英文混合字符串
         * @param {string} str 字符串
         * @param {number} len 截取长度
         * @param {string} suffix 省略显示的字符
         * @param {Function} success 成功回调, 返回截取后的字符
         * @param {Function} error 出错回调
         */
        CutString: function (str, len, suffix, success, error) {
            module.GetStrLen(suffix, function (slen) {
                var realLen = len - slen;

                if (realLen < 0) {

                    if (error) error(suffix + " Length is More then :" + str);
                    return;
                }

                module.SubStrLen(str, len, function (rstr) {
                    if (success) success(rstr + suffix);
                });
            });
        },

        /**
         * 获取临时作品id
         * @param {number} access_type 作品类型，1-模板库  2-个人库
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTempAppId: function (access_type, success, error) {
            api.GetTempAppId(access_type, success, error);
        },

        /**
         * 获取模板VIP信息
         * @param {String} productid 模板id
         * @param {String} version 模板版本号,为空取最新版本
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetVipInfo: function (productid, version, success, error) {
            api.GetBaseAppInfo(productid, version, function (data) {
                var resData = {
                    isVip: 1
                };
                if (data && data.is_vip) {
                    resData.isVip = data.is_vip - 0;
                }
                // 临时针对香港租户
                if (Edbox.AppKey !== 'HK') {
                    resData.isVip = 2;
                }
                if (success) {
                    success(resData);
                }
            }, error);
        }

    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "MMO"));