// UtilBarn 粘合层接口， 提供给网编使用， 所有接口必须写ts
(function (namespace, className) {

    /**
     * 产品ID
     */
    var GameId = "";
    /**
     * UtilBarn平台上的游戏版本 
     */
    var Version = "";

    /**
     * 访问类型  1-模板 2-个人库 3-体验库(不随游戏保存而变更为个人库)
     */
    var Access = 2;

    /**
     * 游戏名称
     */
    var GameName = "";

    /**
     * (计入编辑器的作品)名称
     */
    var TemplateName = "";

    /**
     * 游戏简介
     */
    var Description = "";

    /**
     * 封面图片
     */
    var CoverImage = "";
    var CoverImageValue = "";

    /**
     * 保存前监听事件
     */
    var ListenEvent = [];
    var ListenCom = {};
    var progressMap = new Dictionary();

    /**
     * 保存事件任务自增事件Key
     */
    var intervalID = 0;

    /**
     * 名字长度限制
     */
    var maxNameLength = 60;

    /**
     * 基础服务配置
     */
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
        }
    };

    /**
     * 临时保存旧排行榜数据
     */
    var oldRankingConfig = null;
    /**
     * 临时保存新排行榜数据
     */
    var newRankingConfig = null;
    /**
     * 另存为新GAMEID
     */
    var newSaveGameId = null;

    // 获取基础信息
    function GetBaseInfo(datas) {
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
     *编辑器log
    * @param {string} log 记录内容
    * @param {string} lev 日记等级(log, debug info, warn, error)(默认log), 允许为空
    */
    function Log(log, lev) {
        if (UtilBarn.ServerKey === "QA" || UtilBarn.ServerKey === "Dev" || UtilBarn.ServerKey === "Feature") {

            if (typeof console[lev] === "function") {
                console[lev](log);
            }
            else {
                console.log(log);
            }
        }
        else {
            if (module.OnLog) {
                module.OnLog(log);
            }
        }
    }

    /**
    * 生成并上传游戏oackage包
    * @param {Object} datas 完整数据 , 不允许为空 
    * @param {Function} progress 进度回调,带number参数prg , 带string参数desc , 允许为空
    * @param {Function} success 成功回调,带Object类型参数Blob , 带Function参数Object , 允许为空
    * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
    * @param {Number} mode 默认:0,保存:1,另存为:2,保存临时:3
    */
    function SavePackage(datas, progress, success, error, mode) {
        module.HandleDatas(datas, function (newData) {
            var pack = new Object();
            pack[UtilBarn.Language] = newData;
            // 上传package
            UtilBarn.Package.UpLoadPackages(pack, UtilBarn.Language, progress, success, error);
        }, function (err) {
            console.error(err);
        }, mode);
    }

    /**
     * 试玩
     * Play
     * @param {Object} datas Datas对象 , 不允许为空
     * @param {Function} success 成功回调，带参数Datas对象 , 带string参数试玩链接
     * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
     * @param {Function} progress 进度回调 {step: number 进度, info: string 步骤信息}, 允许为空
     */
    function PlayHandle(datas, success, error, progress) {
        function webPlay(url, success) {
            var info = {
                Url: url,
                Width: UtilBarn.ServerInfo.width || 0,
                Height: UtilBarn.ServerInfo.height || 0
            };

            if (success) success(info);
        }

        function clientPlay() {
            var model = {};
            model.ProductId = UtilBarn.GameId;
            model.PlayType = UtilBarn.Access;
            model.Version = UtilBarn.Version;
            var taskid = UtilBarn.GetGUID();
            var message = module.GetMessageData(taskid, model, "PlayGame");
            UtilBarn.WebSocket.Send(message);
            UtilBarn.WebSocket.OpenGamePlayResultCallback = function (returnTaskId, data) {
                if (returnTaskId === taskid) {
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
            UtilBarn.WebSocket.OpenGamePlayProgressCallback = function (returnTaskId, prg) {
                if (returnTaskId === taskid) {
                    progressMap.Set(taskid, prg);
                }
            };
        }

        function play() {
            // 云图埋点
            UtilBarn.DataStatistic.EditPlay();

            UtilBarn.GetPreviewGameUrl(function (url) {
                if (url && url.trim().length > 0)
                    // 无端试玩
                    webPlay(url, success);
                else
                    // 有端试玩
                    clientPlay();

            }, error);
        }

        if (IsSaved) {
            play();
            return;
        }
        SaveHandle(datas, function (gameId) {
            play();
        }, error);
    }

    /**
     * 另保存
     * Save as
     * @param {Object} datas 完整数据 , 不允许为空
     * @param {string} newname 另存为作品名称
     * @param {Function} success 成功回调,带String类型新GameID ,GameID为""表示保存取消 允许为空
     * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
     * @param {Function} progress 进度回调 {step: number 进度, info: string 步骤信息}, 允许为空
     */
    function SaveAsHandle(datas, newname, success, error, progress) {
        function reqerr(e) {
            //DataFunction.Waiting.State = false;
            console.log(e);
            /*
            // 手动取消任务, 不做处理
            if (e.statusText === "abort" && intervalID === 0) {
                // 通一到checkTask处理
                //if(success) success("");
            }
            */
            if (e.responseText) {
                if (error) error(UtilBarn.GetTip("ERROR_EditorSaveAsFailed") + e.responseText);
            }
            else {
                if (error) error(UtilBarn.GetTip("ERROR_EditorSaveAsFailed") + e);
            }
        }

        // 模板创作直接调用保存
        if (Access === 1) {
            SaveHandle(datas, success, error, progress);
            return;
        }

        var maxProgress = 0;
        var stepInfo = "";
        var curProgress = 0;

        // 复制个人库作品
        function CopyProduct(name, success, error) {
            UtilBarn.MMO.CopyProduct(UtilBarn.GameId, name, Version, success, error);
        }

        // 进度反馈
        function callProgress(progress, info) {
            if (maxProgress < progress) {
                curProgress = maxProgress;
            }

            if (progress === 999) {
                curProgress = 100;
                maxProgress = 100;
            }
            else {
                maxProgress = Math.min(100, Math.floor(progress));
            }

            stepInfo = info;
        }

        // 先取消上一次保存任务
        module.SaveCancel();

        intervalID = setInterval(function () {

            var newProgress = Math.min(curProgress + 1, maxProgress);
            if (newProgress === curProgress) return;

            curProgress = newProgress;
            Log("保存进度 " + curProgress + "%");

            if (progress) {
                progress(curProgress, stepInfo);
            }

            if (curProgress >= 100) {
                clearInterval(intervalID);
                intervalID = 0;
                taskKey = 0;
            }
        }, 100);

        taskKey = intervalID;

        var baseinfo = GetBaseInfo(datas);

        callProgress(10, "CopyProduct");

        CopyProduct(newname, function (productid) {
            callProgress(15, "GetPackageBlob");

            // todo 处理掉已有的rankuid
            function load(lstDatas) {
                var list = lstDatas.Datas;
                if (!list) return;
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    if (obj.Type.indexOf("Tab01") < 0) continue;
                    if (obj.Name === "Ranking") {
                        (function () {
                            var tempRankingList = obj.Datas[2].Datas;
                            for (var i = 0; i < tempRankingList.length; i++) {
                                if (tempRankingList[i].RankUid) {
                                    delete tempRankingList[i].RankUid;
                                }
                            }
                        }());
                        break;
                    }
                    load(obj);
                }
            }

            load(datas);

            newSaveGameId = productid;

            SavePackage(datas, function (prg, desc) {

                callProgress(15 + prg * 80 / 100, desc);

            }, function (pkgGuid) {

                callProgress(95, "UpdateProduct");

                UtilBarn.MMO.UpdateProduct(productid, pkgGuid, newname, baseinfo.CoverImage, baseinfo.Description, function (data) {


                    // 模板变更为个人库 作品id更新
                    UtilBarn.GameId = data.productid;
                    GameId = data.productid;

                    // 更新版本号
                    if (data.version) {
                        Version = data.version;
                        UtilBarn.Version = data.version;
                    }

                    // 更新 PackageGuid
                    UtilBarn.PackageGuid = pkgGuid;
                    PackageGuid = UtilBarn.PackageGuid;

                    if (UtilBarn.Access === 1) {
                        // 编辑类型更新
                        UtilBarn.Access = 2;
                        Access = 2;
                    }

                    UpdataDataSet();

                    // 云图埋点
                    UtilBarn.DataStatistic.EditSave(UtilBarn.GameId);

                    setTimeout(function () {
                        callProgress(999, "Save Finish Tip");
                        // 关闭退出提示
                        UtilBarn.WindowEvent.Hide();
                    }, 500);


                    // 成功后发送
                    if (success) {
                        setTimeout(function () {
                            success(GameId);
                        }, 1000);
                    }
                    else {
                        alert(UtilBarn.GetTip("TIP_EditorSaveSucess"));
                    }
                }, reqerr);
            }, reqerr, 2);
        }, reqerr);
    }

    /**
     * 新增编辑记录
     * @param {string} app_id 作品id
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    function AddEditRecord(app_id, success, error) {
        UtilBarn.Api.MMO.PostChangeNumEditRecord(app_id, success, error);
    }

    // 更新DataSet
    function UpdataDataSet() {
        var args = UtilBarn.DataSet.Get("UtilBarnArgs");

        var obj = JSON.parse(UtilBarn.Decode(args));

        obj.Version = UtilBarn.Version;
        obj.GameId = UtilBarn.GameId;
        obj.Access = UtilBarn.Access;

        UtilBarn.DataSet.Set("UtilBarnArgs", UtilBarn.Encode(JSON.stringify(obj)));
    }

    /**
     * 保存
     * Save
     * @param {Object} datas 完整数据 , 不允许为空
     * @param {Function} success 成功回调,带String类型新GameID,GameID为""表示保存取消 允许为空
     * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
     * @param {Function} progress 进度回调 {step: number 进度, info: string 步骤信息}, 允许为空
     */
    function SaveHandle(datas, success, error, progress) {

        var maxProgress = 0;
        var stepInfo = "";
        var curProgress = 0;
        var taskKey = 0;
        newSaveGameId = null;

        function reqerr(e) {
            console.log(e);

            module.SaveCancel();
            /*
            // 手动取消任务, 不做处理
            if (e.statusText === "abort" && intervalID === 0) {
                // 通一到checkTask处理
                //if(success) success("");
            }
            */
            if (e.responseText) {
                if (error) error(UtilBarn.GetTip("ERROR_EditorSaveFailed") + e.responseText);
            }
            else {
                if (error) error(UtilBarn.GetTip("ERROR_EditorSaveFailed") + e);
            }
        }

        // 进度反馈
        function callProgress(prgValue, info) {
            prgValue = Math.floor(prgValue);

            if (maxProgress < prgValue) {
                curProgress = maxProgress;
            }

            if (prgValue === 999) {
                curProgress = 100;
                maxProgress = 100;
            }
            else {
                maxProgress = Math.min(100, prgValue);
            }

            stepInfo = info;
        }

        // 先取消上一次保存任务
        module.SaveCancel();

        intervalID = setInterval(function () {

            var newProgress = Math.min(curProgress + 1, maxProgress);
            if (newProgress === curProgress) return;

            curProgress = newProgress;
            Log("保存进度 " + curProgress + "%");

            if (progress) {
                progress(curProgress, stepInfo);
            }

            if (curProgress >= 100) {
                clearInterval(intervalID);
                intervalID = 0;
                taskKey = 0;
            }
        }, 100);

        taskKey = intervalID;

        callProgress(5, "GetPackageBlob");
        var baseinfo = GetBaseInfo(datas);
        SavePackage(datas, function (prg, desc) {

            callProgress(5 + prg * 90 / 100, desc);

        }, function (pkgGuid) {

            callProgress(95, "SaveProduct");

            UtilBarn.MMO.SaveProduct(UtilBarn.GameId, pkgGuid, baseinfo.GameName, baseinfo.CoverImage, baseinfo.Description, function (data) {
                if (data.productid === undefined) {
                    reqerr("Productid is Null");
                    return;
                }

                callProgress(100, "Save Finish");

                IsSaved = true;

                // 更新版本号
                if (data.version) {
                    Version = data.version;
                    UtilBarn.Version = data.version;
                }

                // 模板变更为个人库 作品id更新
                UtilBarn.GameId = data.productid;
                GameId = data.productid;

                // 更新 PackageGuid
                UtilBarn.PackageGuid = pkgGuid;
                PackageGuid = UtilBarn.PackageGuid;

                if (UtilBarn.Access === 1) {
                    // 编辑类型更新
                    UtilBarn.Access = 2;
                    Access = 2;
                }

                UpdataDataSet();

                UtilBarn.Message.Broadcast("EditSave", []);

                // 云图埋点
                UtilBarn.DataStatistic.EditSave(UtilBarn.GameId);

                // 增加编辑记录
                AddEditRecord(UtilBarn.GameId);

                setTimeout(function () {
                    callProgress(999, "Save Finish Tip");
                }, 500);

                // 成功后发送
                if (success) {
                    setTimeout(function () {
                        success(UtilBarn.GameId);
                    }, 1000);

                }
                else {
                    alert(UtilBarn.GetTip("TIP_EditorSaveSucess"));
                }
            }, reqerr, GameId);
        }, reqerr, 1);
    }

    /**
     * 保存临时作品（用于导出功能）
     * Save
     * @param {Object} datas 完整数据 , 不允许为空
     * @param {Function} success 成功回调,带String类型新GameID , 带Function参数String , 允许为空
     * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
     */
    function SaveTempHandle(datas, success, error) {
        function reqerr(e) {
            console.log(e);
            if (e.responseText) {
                if (error) error(UtilBarn.GetTip("ERROR_EditorSaveFailed") + e.responseText);
            }
            else {
                if (error) error(UtilBarn.GetTip("ERROR_EditorSaveFailed") + e);
            }
        }

        var baseinfo = GetBaseInfo(datas);

        SavePackage(datas, null, function (pkgGuid) {
            if (UtilBarn.Access === 1) {
                UtilBarn.MMO.SaveTempProduct(UtilBarn.GameId, Version, pkgGuid, baseinfo.CoverImage, baseinfo.Description, function (data) {
                    if (data.app_id === undefined) {
                        reqerr("Productid is Null");
                        return;
                    }

                    if (success)
                        success(data.app_id, baseinfo.CoverImage, data.TempName);
                    else {
                        alert(UtilBarn.GetTip("TIP_EditorSaveSucess"));
                    }
                }, reqerr);
            } else {
                UtilBarn.MMO.GetProductInfo(UtilBarn.GameId, function (baseInfo) {
                    UtilBarn.MMO.SaveTempProduct(baseInfo.baseid, baseInfo.base_version, pkgGuid, baseinfo.CoverImage, baseinfo.Description, function (data) {
                        if (data.app_id === undefined) {
                            reqerr("Productid is Null");
                            return;
                        }

                        if (success)
                            success(data.app_id, baseinfo.CoverImage, data.TempName);
                        else {
                            alert(UtilBarn.GetTip("TIP_EditorSaveSucess"));
                        }
                    }, reqerr);
                }, reqerr);
            }
        }, reqerr, 3);
    }

    /**
     * 添加监听
     */
    function AddListenEvent() {
        var temp = UtilBarn.Message.OnReceive;
        UtilBarn.Message.OnReceive = function (data, com) {
            if (temp) temp(data, com);
            if (data.Type === "Add" || data.Type === "Update" || data.Type === "Delete") {
                IsSaved = false;
                UtilBarn.WindowEvent.Show();
            }
        };

        temp = UtilBarn.Message.OnSend;
        UtilBarn.Message.OnSend = function (data, com) {
            if (temp) temp(data, com);
            if (data.Type === "Add" || data.Type === "Update" || data.Type === "Delete") {
                IsSaved = false;
                UtilBarn.WindowEvent.Show();
            }
        };

        UtilBarn.Message.AddMessageHandler("ListenEvent", function (datas, com) {
            console.log(datas);
            ListenEvent = datas;
            ListenCom = com;
        });
    }

    function GetMessageData(taskId, model, code) {
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
    }

    /**
     * 保存前的关键数据检测
     * Save
     * @param {Object} datas 完整数据 , 不允许为空
     * @param {Object} success 成功回调,带String类型新GameID , 带Function参数String , 允许为空
     * @param {string} error 出错回调 , 错误信息 , 允许为空
     */
    function BaseInfoVerified(datas, success, error) {
        var baseinfo = GetBaseInfo(datas);

        // 作品名称全空格判断
        if (baseinfo.GameName.match(/^[ ]+$/)) {
            console.log("GameName all space");
            if (error) error(UtilBarn.GetTip("ERROR_GAMENAME_SPACE"));
            return;
        }

        if (baseinfo.GameName.match(/[\\\/:*?"<>|]/)) {
            console.log("GameName illegal_character");
            if (error) error(UtilBarn.GetTip("ERROR_ILLEGAL_CHARACTER"));
            return;
        }

        if (success) success(baseinfo);

    }


    /**
     * 是否已保存
     */
    var IsSaved = false;

    /**
     * UtilBarn编辑器通用组件
     * 用于UtilBarn平台的编辑器基础服务框架,拓展UtilBarn Html5编辑器接入平台的方法
     * @author 温荣泉(201901)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn编辑器通用组件
     * */
    var module = {

        /**
       * log输出
       */
        OnLog: null,

        /**
         * Datas原始数据处理 (保存前处理)
         * @param {Object} data 完整数据 , 不允许为空 
         * @param {Function} success 成功回调 带参数datas
         * @param {Function} error 失败回调
         * @param {Number} mode 默认:0,保存:1,另存为:2,保存临时:3
         */
        HandleDatas: function (data, success, error, mode) {
            var datas = JSON.parse(JSON.stringify(data));

            // 处理静态数据
            function handleStaticData() {
                var LoadingDatas = null;
                var RankingDatas = null;
                var shareData = null;
                var loginData = null;

                function load(lstDatas) {
                    var list = lstDatas.Datas;
                    if (!list) return;
                    for (var i = 0; i < list.length; i++) {
                        var obj = list[i];

                        if (obj.Type.indexOf("Tab01") < 0) continue;

                        // 保留加载节点信息
                        if (obj.Name === "Loading") {
                            LoadingDatas = obj;
                        }

                        // 保留排行榜节点信息
                        else if (obj.Name === "Ranking") {
                            (function () {
                                if (newRankingConfig) {
                                    // 保存记录在static上的rankuid，记录在obj.data上的排行榜信息
                                    var tempRankingList = obj.Datas[2].Datas;
                                    for (var i in tempRankingList) {
                                        tempRankingList[i].RankUid = newRankingConfig[2].Datas[i].RankUid;
                                    }
                                }
                                RankingDatas = obj;
                                UtilBarn.Message.Get(window, function (com) {
                                    com.Send("Update", [obj]);
                                });
                            }());
                        }

                        // 分享功能保存
                        else if (obj.Class === "Share") {
                            shareData = obj;
                        }
                        // 登录选择功能保存
                        else if (obj.Class === "Login") {
                            loginData = obj;
                        }
                        load(obj);
                    }
                }

                load(datas);

                datas.StaticData;
                if (!datas.StaticData) {
                    datas.StaticData = new Object();
                    datas.StaticData.ID = "StaticData";
                    datas.StaticData.Name = "StaticData";
                    datas.StaticData.Type = "StaticData";
                    datas.StaticData.ShowName = "静态数据";
                    datas.StaticData.Datas = new Array();
                }

                //分享数据保存
                if (shareData) {
                    datas.StaticData.Share = shareData;
                }
                //登录数据保存
                if (loginData) {
                    datas.StaticData.login = loginData;
                }
                if (LoadingDatas)
                    datas.StaticData.Loading = LoadingDatas;
                if (RankingDatas) {
                    datas.StaticData.Ranking = RankingDatas;
                    if (RankingDatas.Datas)
                        oldRankingConfig = RankingDatas.Datas[2];
                }

                if (UtilBarn.EditorComponents) {
                    if (mode === 1) {
                        UtilBarn.EditorComponents.Save(datas, function (newdatas) {
                            if (success) {
                                success(newdatas);
                            }
                        }, error);
                    }
                    else {
                        UtilBarn.EditorComponents.SaveAs(datas, function (newdatas) {
                            if (success) {
                                success(newdatas);
                            }
                        }, error);
                    }
                }
                else {
                    if (success) {
                        success(newdatas);
                    }
                }
            }

            // 排行版数据处理
            function GetNewRankingConfig(lstDatas) {
                var list = lstDatas.Datas;
                if (!list) return;
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    var data = JSON.parse(JSON.stringify(obj));

                    if (obj && obj.Type && obj.Type.indexOf("Tab01") >= 0 && obj.Name === "Ranking") {
                        newRankingConfig = obj.Datas;
                        return;
                        // if (!oldRankingConfig)
                        //     return;

                        // var tmpObj = newRankingConfig[2].Datas;
                        // var len = tmpObj.length;
                        // var oldlen = oldRankingConfig.Datas.length;
                        // for (var j = 0; j < len; j++) {
                        //     for (var k = 0; k < oldlen; k++) {
                        //         if (oldRankingConfig.Datas[k].ID === tmpObj[j].ID) {
                        //             tmpObj[j].RankUid = oldRankingConfig.Datas[k].RankUid;
                        //         }
                        //     }
                        // }
                        // return;
                    }
                    if (obj && obj.Type && obj.Type.indexOf("Tab0") >= 0) {
                        GetNewRankingConfig(data, obj);
                    }
                }
            }

            // 排行版数据处理
            GetNewRankingConfig(datas);

            if (newRankingConfig) {
                var obj = newRankingConfig[2];//obj rankinglist

                if (oldRankingConfig) {
                    // 保存时与服务器同步已删除排行榜
                    var newRankUid = {};
                    for (var i in obj.Datas) {
                        if (obj.Datas[i].RankUid)
                            newRankUid[obj.Datas[i].RankUid] = true;
                    }
                    for (var j in oldRankingConfig.Datas) {
                        var tmpRankUid = oldRankingConfig.Datas[j].RankUid;
                        // 旧config中的rankuid 不在 新的config中时，则删除
                        if (tmpRankUid && !newRankUid[tmpRankUid]) {
                            UtilBarn.Ranking.DeleteRanking(tmpRankUid);
                        }
                    }
                }
                // 保存时与服务器同步新增的排行榜
                var times = 0; // 已经绑定rank_uuid的排行榜个数
                var tmpGameId = newSaveGameId ? newSaveGameId : GameId;

                if (obj.Datas.length === 0) {
                    handleStaticData();
                    return;
                }

                if (!tmpGameId) {
                    handleStaticData();
                    return;
                }

                for (var k in obj.Datas) {
                    if (!obj.Datas[k].RankUid) {
                        (function (index) {
                            // 另存为 / 保存
                            UtilBarn.Ranking.CreateRanking(tmpGameId, newRankingConfig, obj.Datas[index], function (data) {
                                obj.Datas[index].RankUid = data.rank_uuid;
                                times++;
                                if (times === obj.Datas.length) {
                                    handleStaticData();
                                }
                            }, function (err) {
                                console.error(err);
                            });
                        })(k);
                    } else {
                        (function (index) {
                            UtilBarn.Ranking.RefreshRanking(tmpGameId, newRankingConfig, obj.Datas[index].RankUid, obj.Datas[index], function () {
                                times++;
                                if (times === obj.Datas.length) {
                                    handleStaticData();
                                }
                            }, function (err) {
                                console.error(err);
                            });
                        })(k);
                    }
                }
            }
            else {
                handleStaticData();
            }
        },

        /**
         * 导出编辑器
         * @param {Object} datas 完整数据 , 不允许为空
         * @param {Function} success 成功回调, 允许为空
         * @param {Function} error 出错回调, 允许为空
         */
        ExportEditor: function (datas, success, error) {
            if (!(navigator && navigator.onLine)) {
                var result = {};
                result.Code = "NETWORK_OFFLINE";
                result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                if (error) error(result);
                return;
            }
            module.CheckEbService(function (localtion) {
                if (localtion !== "") {
                    var result = {};
                    result.Code = "UNINSTALL";
                    result.Message = localtion;
                    if (error) error(result);
                } else {
                    module.SaveTemp(datas, function (appId, icon, gameName) {
                        var model = {};
                        model.ProductId = appId;
                        model.LogoResID = icon;
                        model.AccessType = 2;
                        model.GameName = gameName;
                        var message = GetMessageData(datas.taskId, model, "ExportEditor");
                        UtilBarn.WebSocket.Send(message);
                        UtilBarn.WebSocket.ExportEditorResultCbDic.Set(datas.taskId, function (returnTaskId, data) {
                            if (returnTaskId === datas.taskId) {
                                var result = {};
                                if (data.Code === "SUCCESS" || data.Code === "CANCEL") {

                                    if (data.Code === "SUCCESS") {
                                        // 云图埋点
                                        UtilBarn.DataStatistic.ExportEditorTemplate(appId);
                                    }

                                    result.Code = data.Code;
                                    result.Message = "";
                                    if (success) success(result);
                                } else {
                                    if (navigator && navigator.onLine) {
                                        result.Code = data.Code;
                                    } else {
                                        result.Code = "NETWORK_OFFLINE";
                                    }
                                    result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                                    if (error) error(result);
                                }
                            }
                        });
                        UtilBarn.WebSocket.ExportEditorProgressCbDic.Set(datas.taskId, function (returnTaskId, progress) {
                            if (returnTaskId === datas.taskId) {
                                progressMap.Set(datas.taskId, progress);
                            }
                        });
                    },
                        function (e) {
                            var result = {};
                            if (navigator && navigator.onLine) {
                                result.Code = "SAVEFAILED";
                                result.Message = e;
                            } else {
                                result.Code = "NETWORK_OFFLINE";
                                result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                            }
                            if (error) error(result);
                        });
                }
            }, function (e) {
                var result = {};
                if (navigator && navigator.onLine) {
                    result.Code = "NetWorkError";
                    result.Message = e;
                } else {
                    result.Code = "NETWORK_OFFLINE";
                    result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                }

                if (error) error(result);
            });
        },

        /**
         * 导出exe游戏
         * @param {Object} data 作品数据
         * @param {Function} success 成功回调, 允许为空
         * @param {Function} error 出错回调, 允许为空
         */
        ExportExeGame: function (data, success, error) {
            var result = {};
            if (!(navigator && navigator.onLine)) {
                result = {};
                result.Code = "NETWORK_OFFLINE";
                result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                if (error) error(result);
                return;
            }

            if (!IsSaved) {
                result = {};
                result.Code = "UNSAVE";
                result.Message = "";
                if (error) error(result);
                return;
            }
            module.CheckEbService(function (localtion) {
                if (localtion !== "") {
                    var result = {};
                    result.Code = "UNINSTALL";
                    result.Message = localtion;
                    if (error) error(result);
                } else {
                    var model = {};
                    model.ProductId = data.appId;
                    model.LogoResID = data.icon;
                    model.AccessType = 2;
                    model.GameName = data.gameName;
                    var message = GetMessageData(data.taskId, model, "ExportPCGame");
                    UtilBarn.WebSocket.Send(message);
                    UtilBarn.WebSocket.ExportExeResultCbDic.Set(data.taskId, function (returnTaskId, returnData) {
                        if (returnTaskId === data.taskId) {
                            var result = {};
                            if (returnData.Code === "SUCCESS" || returnData.Code === "CANCEL") {

                                if (returnData.Code === "SUCCESS") {
                                    // 云图埋点
                                    UtilBarn.DataStatistic.ExportGame(data.appId, "exe");
                                }

                                result.Code = returnData.Code;
                                result.Message = "";
                                if (success) success(result);
                            } else {
                                if (navigator && navigator.onLine) {
                                    result.Code = returnData.Code;
                                } else {
                                    result.Code = "NETWORK_OFFLINE";
                                }
                                result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                                if (error) error(result);
                            }
                        }
                    });
                    UtilBarn.WebSocket.ExportExeProgressCbDic.Set(data.taskId, function (returnTaskId, progress) {
                        if (returnTaskId === data.taskId) {
                            progressMap.Set(data.taskId, progress);
                        }
                    });
                }
            }, function (e) {
                var result = {};
                if (navigator && navigator.onLine) {
                    result.Code = "NetWorkError";
                    result.Message = e;
                } else {
                    result.Code = "NETWORK_OFFLINE";
                    result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                }
                if (error) error(result);
            });
        },

        /**
         * 导出Apk
         * @param {Object} data 作品数据
         * @param {Function} success 成功回调, 允许为空
         * @param {Function} error 出错回调, 允许为空
         */
        ExportApk: function (data, success, error) {
            var result = {};
            if (!(navigator && navigator.onLine)) {
                result = {};
                result.Code = "NETWORK_OFFLINE";
                result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                if (error) error(result);
                return;
            }
            if (!IsSaved) {
                result = {};
                result.Code = "UNSAVE";
                result.Message = "";
                if (error) error(result);
                return;
            }
            module.CheckEbService(function (localtion) {
                if (localtion !== "") {
                    var result = {};
                    result.Code = "UNINSTALL";
                    result.Message = localtion;
                    if (error) error(result);
                } else {
                    var model = {};
                    model.ProductId = data.appId;
                    model.LogoResID = data.icon;
                    model.AccessType = 2;
                    model.GameName = data.gameName;
                    var message = GetMessageData(data.taskId, model, "ExportApk");
                    UtilBarn.WebSocket.Send(message);
                    UtilBarn.WebSocket.ExportApkResultCbDic.Set(data.taskId, function (returnTaskId, returnData) {
                        if (returnTaskId === data.taskId) {
                            var result = {};
                            if (returnData.Code === "SUCCESS" || returnData.Code === "CANCEL") {

                                if (returnData.Code === "SUCCESS") {
                                    // 云图埋点
                                    UtilBarn.DataStatistic.ExportGame(data.appId, "apk");
                                }


                                result.Code = returnData.Code;
                                result.Message = returnData.Message;
                                if (success) success(result);
                            } else {
                                if (navigator && navigator.onLine) {
                                    result.Code = returnData.Code;
                                } else {
                                    result.Code = "NETWORK_OFFLINE";
                                }
                                result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                                if (error) error(result);
                            }
                        }
                    });

                    UtilBarn.WebSocket.ExportApkProgressCbDic.Set(data.taskId, function (returnTaskId, progress) {
                        if (returnTaskId === data.taskId) {
                            progressMap.Set(data.taskId, progress);
                        }
                    });
                }
            }, function (e) {
                var result = {};
                if (navigator && navigator.onLine) {
                    result.Code = "NetWorkError";
                    result.Message = e;
                } else {
                    result.Code = "NETWORK_OFFLINE";
                    result.Message = UtilBarn.GetTip("ERROR_" + result.Code);
                }
                if (error) error(result);
            });
        },

        /**
         * 获取进度
         * @param {Object} taskId 任务id
         * @param {Function} success 成功回调, 允许为空
         * @param {Function} error 出错回调, 允许为空
         */
        GetProgress: function (taskId, success, error) {
            if (progressMap.ContainsKey(taskId)) {
                var progress = progressMap.Get(taskId);
                if (success) success(progress);
            } else {
                if (success) success(0);
            }
        },

        /**
         * 检测是否已安装服务程序
         * @param {Function} success 成功回调, 允许为空
         * @param {Function} error 出错回调, 允许为空
         */
        CheckEbService: function (success, error) {
            UtilBarn.WebSocket.CheckIsOpen(function (isOpen) {
                if (isOpen) {
                    success("");
                } else {
                    module.GetProgramLocation(success, error);
                }
            });
        },

        /**
         * 获取服务程序下载地址
         * @param {Function} success 成功回调, 允许为空
         * @param {Function} error 出错回调, 允许为空
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
                        error(e);
                    }
                }
            });
        },

        /**
         * 取消保存
         * Save
         * @param {Function} success 成功回调, 允许为空
         */
        SaveCancel: function (success) {
            if (intervalID !== 0) {
                clearInterval(intervalID);
                intervalID = 0;
            }

            if (success) success();
        },


        /**
         * 开始保存
         * Save
         * @param {Object} datas 完整数据 , 不允许为空
         * @param {Function} success 成功回调,带String类型新GameID , GameID 为""表示取消保存 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         * @param {Function} progress 进度回调 {step: number 进度, info: string 步骤信息}, 允许为空
         */
        Save: function (datas, success, error, progress) {

            if (Access === 1) {
                UtilBarn.DataStatistic.ClickEvent("Save", "Editor", TemplateName);
            }
            else if (Access === 2) {
                UtilBarn.DataStatistic.ClickEvent("Save", "LibraryEditor", TemplateName);
            }

            // 基础信息检测
            BaseInfoVerified(datas, function () {

                if (ListenEvent) {
                    if (ListenEvent.indexOf("BeforeSave") > -1) {
                        var guid = UtilBarn.GetGUID();
                        UtilBarn.Message.AddMessageHandler(guid, function (datas, com) {
                            var isSucc = datas[1];
                            if (isSucc === undefined) {
                                isSucc = true;
                            }
                            if (!isSucc) {
                                error("0");
                                return;
                            }

                            SaveHandle(datas[0], success, error, progress);
                            UtilBarn.Message.Functions.Remove(guid);

                        });

                        ListenCom.Send("BeforeSave", [guid, datas]);
                        return;
                    }
                }
                SaveHandle(datas, success, error, progress);
            }, error);

        },

        /**
         * 开始保存临时作品（用于导出功能）
         * Save
         * @param {Object} datas 完整数据 , 不允许为空
         * @param {Function} success 成功回调,带String类型新GameID , 带Function参数String , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        SaveTemp: function (datas, success, error) {

            if (ListenEvent) {
                if (ListenEvent.indexOf("BeforeSave") > -1) {
                    var guid = UtilBarn.GetGUID();
                    UtilBarn.Message.AddMessageHandler(guid, function (datas, com) {
                        var isSucc = datas[1];
                        if (isSucc === undefined) {
                            isSucc = true;
                        }
                        if (!isSucc) {
                            error("0");
                            return;
                        }
                        SaveTempHandle(datas[0], success, error);
                        UtilBarn.Message.Functions.Remove(guid);

                    });

                    ListenCom.Send("BeforeSave", [guid, datas]);
                    return;
                }
            }

            SaveTempHandle(datas, success, error);
        },

        /**
         * 开始另保存
         * Save as
         * @param {Object} datas 完整数据 , 不允许为空
         * @param {Function} success 成功回调,带String类型新GameID , GameID 为""表示取消保存 , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         * @param {Function} progress 进度回调 {step: number 进度, info: string 步骤信息}, 允许为空
         */
        SaveAs: function (datas, success, error, progress) {

            if (Access === 1) {
                UtilBarn.DataStatistic.ClickEvent("SaveAs", "Editor", TemplateName);
            }
            else if (Access === 2) {
                UtilBarn.DataStatistic.ClickEvent("SaveAs", "LibraryEditor", TemplateName);
            }

            // 基础信息检测
            BaseInfoVerified(datas, function (baseinfo) {

                if (ListenEvent) {
                    if (ListenEvent.indexOf("BeforeSaveAs") > -1) {
                        var guid = UtilBarn.GetGUID();
                        UtilBarn.Message.AddMessageHandler(guid, function (datas, com) {
                            var isSucc = datas[1];
                            if (isSucc === undefined) {
                                isSucc = true;
                            }
                            if (!isSucc) {
                                error("0");
                                return;
                            }

                            SaveAsHandle(datas[0], baseinfo.GameName, success, error, progress);
                            UtilBarn.Message.Functions.Remove(guid);

                        });

                        ListenCom.Send("BeforeSaveAs", [guid, datas]);

                        return;
                    }
                }

                SaveAsHandle(datas, baseinfo.GameName, success, error, progress);

            });

        },

        /**
         * 读取Package数据包的数据到Datas对象中
         * Read the data of the Package packet into the Datas object
         * @param {Object} datas Datas对象 , 不允许为空
         * @param {Function} success 成功回调，带参数Datas对象 , 带Function参数Object , 允许为空
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        LoadDatas: function (datas, success, error) {

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


            UtilBarn.Resource.LoadDatas(datas, function (datas) {

                var list = datas.Datas;
                for (var i = 0; i < list.length; i++) {
                    var tab = list[i];
                    if (tab.Name === "BaseInfo") {
                        for (var j = 0; j < tab.Datas.length; j++) {
                            var key = tab.Datas[j];
                            if (key.Name === "GameName") {
                                key.Value = GameName;

                                // 修改名称最长长度
                                if (key.Length) {
                                    key.Length = maxNameLength;
                                }
                                // 模板名称需添加随机数
                                if (UtilBarn.Access === 1) {
                                    var date = new Date();
                                    var d = date.getDate() - 1; // 获取日
                                    var h = date.getHours(); // 获取小时
                                    var m = date.getMinutes(); // 获取分钟
                                    var s = date.getSeconds(); // 获取秒
                                    var t = ((d * 24 + h) * 60 + m) * 60 + s;
                                    // 取每月1号0点到现在的秒数的62进制数 0 -> beLZ
                                    key.Value = GameName + string10to62(t);
                                }
                            }
                            if (key.Name === "Description")
                                key.Value = Description;
                            if (key.Name === "CoverImage") {
                                key.GUID = CoverImage;
                                key.Value = CoverImageValue;
                            }
                        }
                        break;
                    }
                }

                // 排行榜数据赋值
                if (datas.StaticData && datas.StaticData["Ranking"] && datas.StaticData["Ranking"].Datas) {
                    oldRankingConfig = datas.StaticData["Ranking"].Datas[2];
                }

                if (success) success(JSON.parse(JSON.stringify(datas)));
            }, error);

        },

        /**
         * 开始试玩
         * Play
         * @param {Object} datas Datas对象 , 不允许为空
         * @param {Function} success 成功回调，带参数Datas对象 , 带string参数试玩链接
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         * @param {Function} progress 进度回调 {step: number 进度, info: string 步骤信息}, 允许为空
         */
        Play: function (datas, success, error, progress) {

            if (Access === 1) {
                UtilBarn.DataStatistic.ClickEvent("Play", "Editor", TemplateName);
            }
            else if (Access === 2) {
                UtilBarn.DataStatistic.ClickEvent("Play", "LibraryEditor", TemplateName);
            }

            // 基础信息检测
            BaseInfoVerified(datas, function (baseinfo) {
                // 先保存再试玩
                if (ListenEvent) {
                    if (ListenEvent.indexOf("BeforePlay") > -1) {
                        var guid = UtilBarn.GetGUID();
                        UtilBarn.Message.AddMessageHandler(guid, function (datas, com) {
                            var isSucc = datas[1];
                            if (isSucc === undefined) {
                                isSucc = true;
                            }
                            if (!isSucc) {
                                error("0");
                                return;
                            }
                            PlayHandle(datas[0], success, error, progress);
                            UtilBarn.Message.Functions.Remove(guid);

                        });
                        ListenCom.Send("BeforePlay", [guid, datas]);
                        return;
                    }
                }
                PlayHandle(datas, success, error, progress);
            });
        },

        /**
         * 返回大厅
         * Back to the homepage
         */
        GotoLobby: function () {

            //根据参数判断是否新窗口打开大厅
            if (typeof ArgsInfo !== "undefined" && ArgsInfo.ContainArgs("from")) {
                if (ArgsInfo.GetArgs("from") === "pceditor") {

                    var lobbyrul = UtilBarn.Protocol + "://" + UtilBarn.GetHost("Lobby");
                    window.open(lobbyrul);
                    return;
                }
            }

            // 判断是否在大厅内嵌中打开   
            if (window.top !== window.parent) {
                var data = new Object();
                data.Type = "EditorExit";
                data.Url = UtilBarn.GetHost("Lobby");
                window.top.postMessage(data, "*");
            }
            else {
                location.href = UtilBarn.Protocol + "://" + UtilBarn.GetHost("Lobby");
            }
        },

        /**
         * 初始化数据
         * Initialize Edobx_Editor
         * @param {Function} success 成功回调,  带Function参数Object , 允许为空
         * @param {Function} error 出错回调, 带Function参数Object , 允许为空
         */
        Init: function (success, error) {

            GameId = UtilBarn.GameId;
            PackageGuid = UtilBarn.PackageGuid;
            Version = UtilBarn.Version;
            Access = UtilBarn.Access;
            Mode = UtilBarn.Mode;

            //初始化WebSocket
            var model = {};
            model.AccessToken = UtilBarn.AccessToken;
            model.MacKey = UtilBarn.MacKey;
            model.TimeStamp = UtilBarn.TimeStamp;
            model.UserId = UtilBarn.AccountId;
            model.EbUserId = 0;
            model.NickName = "";
            var message = GetMessageData(UtilBarn.GetGUID(), model, "Init");
            UtilBarn.WebSocket.SendInitMessage(message);

            AddListenEvent();
            UtilBarn.MMO.GetInfo(UtilBarn.GameId, function (data) {

                TemplateName = data.productname;

                GameName = data.productname;
                Description = data.introduction;
                CoverImage = data.icon;
                UtilBarn.NDR.Get(data.icon, function (info) {
                    CoverImageValue = info.Url;

                    // 判断是否是需要获取产品临时ID
                    if (Access === 1) {
                        UtilBarn.MMO.GetTempAppId(Access, function (info) {
                            GameId = info.app_id;

                            if (success) success();

                        }, error);
                    }
                    else {

                        if (success) success();
                    }

                    // 云图埋点
                    UtilBarn.DataStatistic.EditStart();

                }, error);
            }, error);
        },

        /**
         * 敏感词判断
         * @param {String} word 需要验证的字符串
         * @param {Function} success 成功回调 带boolean类型参数,true、包含敏感词 false 没有敏感词
         * @param {Function} error 出错回调
         */
        IsSensitive: function (word, success, error) {
            UtilBarn.MMO.IsSensitive(word, success, error);
        },

        /**
         * 查询最近编辑记录数据
         * GetEditRecordInfo
         * @param {int} page 页码
         * @param {int} size 每页个数
         * @param {Function} success 成功回调，带参数Datas对象 , 带string参数试玩链接
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        GetEditRecordInfo: function (page, size, success, error) {
            UtilBarn.Api.MMO.GetEditRecordInfo(page, size, success, error);
        },

        /**
         * 清除编辑记录
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        PostClearEditRecord: function (success, error) {
            var app_id = "-1";
            UtilBarn.Api.MMO.PostChangeNumEditRecord(app_id, success, error);
        },

        /**
         * 打开游戏编辑器页面
         * OpenGameEditor
         * @param {string} app_id 作品id
         * @param {string} version 作品版本
         * @param {Function} success 成功回调，带参数Datas对象 , 带string参数试玩链接
         * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
         */
        OpenGameEditor: function (app_id, version, success, error) {
            var get_type = 3;
            var accessType = 2;
            UtilBarn.Api.MMO.GetTryPlayingInfo(app_id, accessType, get_type, "", function (appResInfo) {

                var webresid = appResInfo.web_editor_resid;
                if (UtilBarn.Platform.IsPC) {
                    webresid = appResInfo.web_pc_editor_resid;
                }
                if (webresid && webresid !== "") {
                    var result = {};
                    result.Code = "WEBGAME";
                    var ms = {};
                    UtilBarn.GameId = app_id;
                    UtilBarn.Access = accessType;
                    UtilBarn.Version = version;
                    ms.Url = UtilBarn.SetQueryString("UtilBarnArgs", UtilBarn.GetLoginInfo(), webresid);
                    window.location.href = ms.Url;
                } else {
                    var e = {};
                    e.Code = "NoEditorURL";
                    e.Message = "NoEditorURL";
                    if (error) error(e);
                }
            }, function (e) {
                var result = {};
                result.Code = "NetWorkError";
                result.Message = e;
                if (error) error(result);
            });
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "Editor"));
