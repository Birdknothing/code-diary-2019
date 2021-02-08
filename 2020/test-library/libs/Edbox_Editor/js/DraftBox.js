// 粘合层接口， 提供给网编使用
(function (namespace, className) {
    var DraftBoxApi = Edbox.Api.DraftBox;
    var Editor = Edbox.Editor;
    var Resource = Edbox.Resource;
    var SaveTimeHelp = Edbox.Editor.SaveTimeHelp;
    var LastDataStr = "";

    // 还原错误码
    var errorCode = {
        NODATARESOURCE: 0,
        ERRDRAFTDATA: 1,
        ERRORVERSION: 2
    };

    // 全局唯一计时器
    var Timer = null;

    // 注册回调管理
    var CBManager = {
        success: null,
        error: null,
        start: null,
        action: function (fn, param) {
            if (fn) fn(param);
        }
    };

    // 草稿列表管理
    var Manager = {
        DraftList: [],  // 草稿箱列表
        DraftMap: {},   // 草稿箱映射
        maxLength: 10,  // 列表维护最大数量
        initFlag: false,     // 是否进行过第一次获取
        // 添加草稿到列表
        Add: function (records, success, error) {
            var tmp = {
                id: records.id,
                time: timeHandle(records.createtime),
                guid: records.resid
            };

            Manager.DraftList.unshift(tmp);

            while (Manager.DraftList.length > Manager.maxLength) {
                Manager.DraftList.pop();
            }

            if (success) success(tmp);
        }
    };

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
        var offsetTime = new Date().getTimezoneOffset() * 60 * 1000;
        var UTCDate = new Date(time).getTime();
        var localDate = new Date(UTCDate - offsetTime);
        var resultTime = new Date(localDate).getTime();
        var date = new Date(resultTime);
        return date;
    }

    /**
     * 获取当前模板id
     * @returns {String} 临时模板id
     */
    function getBaseId() {
        return Editor.GetBaseAppId();
    }

    /**
     * 重置定时器
     * @param {Number} time 定时器周期 单位为秒
     * @param {function} success 成功回调
     * @param {function} error 失败回调
     */
    function resetTimer(time, success, error) {
        if (!time || typeof time !== 'number') {
            if (error) error("时间参数错误");
            return;
        }

        if (Timer) clearInterval(Timer);

        SaveTimeHelp.Set(Edbox.EbUserId, time);

        if (time === -1) {
            if (success) success("定时关闭成功.");
            return;
        }

        Timer = setInterval(saveDraft, time * 1000);

        if (success) success(time);
    }

    /**
     * 生成草稿额外信息
     * @returns {String} 草稿额外信息
     */
    function generateExtInfo() {
        var res = "";
        var ver = Edbox.Version;
        var baseAppId = getBaseId();
        res = baseAppId + "_" + ver + "_" + new Date().getTime();
        return res;
    }

    /**
     * 获取草稿版本信息
     * @param {String} extInfo 草稿额外信息
     * @returns {String} 草稿版本信息 
     */
    function getDraftVer(extInfo) {
        if (!extInfo) {
            return "1.00";
        }

        var infoArr = extInfo.split('_');

        if (!infoArr || infoArr.length < 0) {
            return "1.00";
        }

        return infoArr[0];
    }

    /**
     * 保存新的草稿
     */
    function saveDraft() {
        function saveError() {
            // 执行 保存失败 回调
            CBManager.action(CBManager.error);
        }

        var datas = JSON.parse(JSON.stringify(Editor.DataResource));

        // 数据源为空，不保存，跳过
        if (datas === null) {
            saveError();
            return;
        }

        // 当前数据已保存，不保存，跳过
        if (Editor.IsSavedPackage()) return;

        // 当前数据未更新，不保存，跳过
        if (LastDataStr === JSON.stringify(datas)) return;
        LastDataStr = JSON.stringify(datas);

        // 执行 开始保存 回调
        CBManager.action(CBManager.start);

        Editor.SaveDraftBox(datas, function (guid) {
            DraftBoxApi.AddDraft(getBaseId(), guid, Edbox.Version, generateExtInfo(), function (record) {
                Manager.DraftMap[guid] = datas;
                Manager.Add(record, function (data) {
                    // 执行 保存成功 回调
                    CBManager.action(CBManager.success, data);
                    Editor.NewPackageGuid = guid;
                    Editor.IsSavedPackage(true);
                }, saveError);
            }, saveError);
        }, saveError);
    }

    var module = {
        /**
         * 注册方法回调
         * @param {function} start 开始备份
         * @param {function} success 备份成功
         * @param {function} error 备份失败
         */
        RegisterCallBack: function (start, success, error) {
            CBManager.start = start;
            CBManager.success = success;
            CBManager.error = error;
        },

        /**
         * 设置自动保存时间间隔
         * @param {Number} time 重置时间 单位为秒
         * @param {function} success 成功回调
         * @param {function} error 失败回调
         */
        SetAutoSaveTime: function (time, success, error) {
            resetTimer(time, success, error);
        },

        /**
         * 获取草稿箱列表
         * @param {function} success 成功回调 带参数数组 DraftData
         * @param {function} error 失败回调
         */
        GetList: function (success, error) {
            if (!Manager.initFlag) {
                DraftBoxApi.GetDraftList(getBaseId(), Edbox.Version, function (datas) {
                    for (var i = datas.records.length - 1; i >= 0; --i) {
                        Manager.Add(datas.records[i]);
                    }
                    Manager.initFlag = true;
                    if (success) success(Manager.DraftList);
                }, error, '1', '10');
            }
            else {
                if (success) success(Manager.DraftList);
            }
        },

        /**
         * 还原草稿设置
         * @param {Object} DraftData 对应草稿数据
         * @param {function} success 成功回调 带参数对象 DatasConfig
         * @param {function} error 失败回调
         * @param {function} progress 进度回调
         */
        Reset: function (DraftData, success, error) {
            // 传入DraftData或其格式错误
            if (!DraftData || !DraftData.guid) {
                if (error) error(errorCode.ERRDRAFTDATA);
                return;
            }
            // 无数据源绑定
            if (!Editor || !Editor.DataResource) {
                if (error) error(errorCode.NODATARESOURCE);
                return;
            }
            // // 版本不兼容
            // if (getDraftVer(DraftData.extInfo) !== Edbox.Version) {
            //     if (error) error(errorCode.ERRORVERSION);
            //     return;
            // }

            if (Manager.DraftMap[DraftData.guid]) {
                if (success) success(Manager.DraftMap[DraftData.guid]);
                return;
            }

            Resource.LoadDatas(Editor.DataResource, function (datas) {
                Manager.DraftMap[DraftData.guid] = datas;
                if (success) success(datas);
            }, error, DraftData.guid);
        },

        /**
         * 获取当前备份周期时间
         * @returns {Number} 当前备份周期时间 (秒) -1表示未开启备份
         */
        GetTime: function () {
            return SaveTimeHelp.Get(Edbox.EbUserId);
        }

        // Manager: Manager
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Editor, "DraftBox"));
