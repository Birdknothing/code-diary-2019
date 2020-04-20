/**
 * Edbox 截图功能组件
 * 用于Edbox平台截图相关共使用
 * */
(function (namespace, className) {
    var NDR = Edbox.NDR;
    var Api = Edbox.Api;
    var IsAuthor = null;
    // var IsEditor = null;
    var curGameId = "";

    // 截图本地缓存管理
    var Manager = {
        manualList: [],      // 手动截图列表
        autoList: [],        // 系统截图列表
        manualMax: 30,       // 手动截图最大数量
        autoMax: 20,         // 自动截图最大数量
        initFlag: false,     // 是否进行过第一次获取

        // 保存截图
        Save: function (data, type, success, error) {
            module.GetList(Edbox.GameId, 1, function () {
                // 上限已满 或 已存在的自动埋点 直接退出
                if (!Manager.IsAvailable(type)) {
                    if (error) error("已达到截图存储上限");
                    return;
                }

                if (Manager.IsExisted(type)) {
                    if (error) error("已存在该埋点");
                    return;
                }

                UploadScreenshot(data, type, success, error);
            }, error);
        },

        // 删除截图
        Delete: function (gameID, screenshotData, success, error) {
            if (!screenshotData || JSON.stringify(screenshotData) === '{}') {
                if (error) error("删除截图的数据不允许为空");
                return;
            }
            var type = screenshotData.type;
            var guid = screenshotData.guid;
            var records = [{
                resid: guid,
                burying_point: type
            }];
            Api.ScreenShot.DeleteScreenShots(gameID, records, function () {
                Manager.Remove(type, guid);
                if (success) success(Manager.GetList());
            }, error);
        },

        // 获取所有截图列表
        //
        GetList: function (type, page, size) {
            if (!type || type === '') type = 0;
            if (!page || page === '') page = '1';
            if (!size || size === '') size = '50';
            var targetArr = [];
            // 系统
            if (type === 1) {
                targetArr = Manager.autoList;
            }
            // 手动
            else if (type === 2) {
                targetArr = Manager.manualList;
            }
            // 所有
            else {
                targetArr = Manager.autoList.concat(Manager.manualList);
            }
            var offset = (page - 1) * size;

            var sliceArr = targetArr.slice(offset, offset + size);
            var ret = {
                total: targetArr.length,
                items: sliceArr
            };
            return ret;
        },

        // 初始化获取列表时的添加
        Add: function (records, success, error) {
            var tmp = {
                id: records.id,
                time: timeHandle(records.createtime),
                guid: records.resid,
                type: records.burying_point,
                url: records.url
            };

            if (!Manager.IsAvailable(tmp.type)) {
                if (error) error("已达到截图存储上限");
                return;
            }

            if (Manager.IsExisted(tmp.type, tmp.id)) {
                if (error) error("已存在该埋点");
                return;
            }

            if (tmp.type === "manual")
                Manager.manualList.unshift(tmp);
            else
                Manager.autoList.unshift(tmp);

            if (success) success(tmp);
        },

        // 移除本地截图
        Remove: function (type, guid) {
            var index = -1;
            var i = 0;
            var arrPoint = [];

            if (type === "manual") {
                arrPoint = Manager.manualList;
            }
            else {
                arrPoint = Manager.autoList;
            }

            for (i = 0; i < arrPoint.length; i++) {
                if (arrPoint[i].guid === guid) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                arrPoint.splice(index, 1);
            }
        },

        // 判断截图库是否有空闲空间
        IsAvailable: function (type) {
            if (type === "manual"
                && Manager.manualList.length >= Manager.manualMax) {
                return false;
            }
            if (type !== "manual"
                && Manager.autoList.length >= Manager.autoMax) {
                return false;
            }

            return true;
        },

        // 判断已存在该埋点类型（系统判断类型，手动判断id）
        IsExisted: function (type, id) {
            var index = -1;
            var i = 0;
            // 判断手动
            if (type === "manual") {
                for (i = 0; i < Manager.manualList.length; i++) {
                    if (Manager.manualList[i].id === id) {
                        index = i;
                        break;
                    }
                }
            }
            // 判断系统
            else {
                for (i = 0; i < Manager.autoList.length; i++) {
                    if (Manager.autoList[i].type === type) {
                        index = i;
                        break;
                    }
                }
            }

            return index > -1;
        }
    };

    /**
     * 生成图片名称
     * @param {string} type 埋点类型
     * @returns {string} 图片名称
     */
    function getName(type) {
        return Edbox.GameId + '_' + type + '_' + new Date().getTime() + '.png';
    }

    /**
     * 时间字符串转Date格式
     * @param {Number} time 时间
     * @returns {Date} Date类型的时间
     */
    function timeHandle(time) {
        if (typeof time !== 'number' && typeof time !== 'string') {
            return new Date();
        }
        time = time + "";
        time = time.slice(0, 4) + '/'
            + time.slice(4, 6) + '/'
            + time.slice(6, 8) + ' '
            + time.slice(8, 10) + ':'
            + time.slice(10, 12) + ':'
            + time.slice(12, 14);
        var date = new Date(time);
        return date;
    }

    /**
     * 判断是否是作者本人
     * @param {function} success 成功回调 是作者本人 回调
     * @param {function} error 失败回调 非作者本人 回调
     */
    function JudgeIsAuthor(success, error) {
        // 第一次判断初始化
        if (IsAuthor === null) {
            Api.MMO.GetPersonalAppInfo(Edbox.GameId, function (data) {
                if (data.ownerid === Edbox.EbUserId) {
                    IsAuthor = true;
                    if (success) success();
                }
                else {
                    if (error) error("非作者本人进行游戏，无法进行截图");
                }
            }, function () {
                IsAuthor = false;
                if (error) error("不支持模板截图");
            });
        }
        // 第二次根据本地变量判断
        else {
            if (IsAuthor && success) success();
            else if (!IsAuthor && error) error();
        }

    }

    /**
     * 上传资源
     * @param {string} data 图片资源base64
     * @param {string} type 埋点类型
     * @param {function} success 成功回调
     * @param {function} error 失败回调
     */
    function UploadScreenshot(data, type, success, error) {
        // 上传NDR
        NDR.Post(data, getName(type), null, function (ndrData) {
            // 上传截图库
            var records = [];
            var tmp = {
                resid: ndrData.Guid,
                burying_point: type
            };
            records.push(tmp);
            Api.ScreenShot.AddScreenshots(records, function (datas) {
                if (datas && datas.records && datas.records.length > 0) {
                    datas.records[0].url = ndrData.Url;
                    Manager.Add(datas.records[0], success, error);
                }
            }, error, Edbox.GameId);
        }, error);
    }

    var module = {
        /**
         * 上传截图
         * @param {String} data 截图Base64数据 
         * @param {String} type 截图埋点类型
         * @param {function} success 成功回调 参数为新增的截图对象数据 ScreenshotData
         * @param {function} error 失败回调
         */
        SaveScreenShot: function (data, type, success, error) {
            if (!data) {
                if (error) error("截图数据不许为空");
                return;
            }

            if (Edbox.Mode !== 1) {
                if (error) error("仅允许试玩时截图");
                return;
            }

            // 默认为
            if (!type || type === '') {
                type = "manual";
            }

            JudgeIsAuthor(function () {
                Manager.Save(data, type, success, error);
            }, error);
        },

        /**
         * 获取游戏的截图库
         * @param {String} gameID 游戏ID
         * @param {Number} ListType 要获取的截图列表的类型 1:所有截图 2:系统截图 3:手动截图 默认值为1
         * @param {function} success 成功回调 参数为Data对象
         *                  {
         *                     total: Number
         *                     items: Array [{id:截图编号,guid:截图guid,url:资源地址,type:截图埋点类型}]
         *                  }
         * @param {function} error 失败回调
         * @param {String} page 页数 可为空 为空默认获取所有
         * @param {String} size 每页数量 可为空 为空默认获取所有
         * @param {boolean} fromServer 从服务器取最新的
         */
        GetList: function (gameID, ListType, success, error, page, size, fromServer) {
            if (!gameID) {
                gameID = Edbox.GameId;
            }

            if (!gameID) {
                if (error) error("GameId不允许为空.");
                return;
            }

            if (gameID !== curGameId) {
                curGameId = gameID;
                Manager.manualList = [];
                Manager.autoList = [];
                Manager.initFlag = false;
            }

            // 已从服务端获取数据初始化
            if (Manager.initFlag && !fromServer) {
                if (success) success(Manager.GetList(ListType, page, size));
            }
            else {
                // 从服务器获取所有列表
                Api.ScreenShot.GetList('', '', '', function (datas) {
                    var guidList = [];  // 所有guid的数组
                    var map = {};       // guid : record 映射

                    // 获取所有guid
                    for (var i = 0; i < datas.records.length; i++) {
                        map[datas.records[i].resid] = datas.records[i];
                        guidList.push(datas.records[i].resid);
                    }

                    // 若无guid，不请求NDR
                    if (guidList.length === 0) {
                        if (success) success(Manager.GetList(ListType, page, size));
                        return;
                    }

                    // 批量取ndr
                    NDR.GetList(guidList, function (ndrDatas) {
                        // 打包数据给页编
                        for (var j = 0; j < guidList.length; j++) {
                            var tmpGuid = guidList[j];
                            var tmp = {
                                id: map[tmpGuid].id,
                                resid: tmpGuid,
                                url: ndrDatas[tmpGuid].Url,
                                burying_point: map[tmpGuid].burying_point,
                                createtime: map[tmpGuid].createtime
                            };
                            Manager.Add(tmp);
                        }
                        Manager.initFlag = true;

                        // 获取
                        if (success) success(Manager.GetList(ListType, page, size));
                    }, error);
                }, error, gameID);
            }
        },

        /**
         * 删除截图接口
         * @param {Object} screenshotData 截图信息
         * @param {String} gameID 游戏Id 
         * @param {function} success 成功回调 参数为Data对象
         *                  {
         *                     total: Number
         *                     items: Array [{id:截图编号,guid:截图guid,url:资源地址,type:截图埋点类型}]
         *                  }
         * @param {function} error 失败回调
         */
        Delete: function (screenshotData, gameID, success, error) {
            if (!gameID) {
                gameID = Edbox.GameId;
            }

            if (!gameID) {
                if (error) error("GameId不允许为空.");
                return;
            }

            Manager.Delete(gameID, screenshotData, success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }

}(Edbox, "ScreenShot"));