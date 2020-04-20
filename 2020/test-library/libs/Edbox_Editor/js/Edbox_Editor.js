// Edbox 粘合层接口， 提供给网编使用， 所有接口必须写ts
(function (namespace, className) {

    /**
     * 产品ID
     */
    var GameId = "";
    /**
     * Edbox平台上的游戏版本 
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
    /**
     * 模板ID
     */
    var BaseAppId = null;
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
     * @param {string} context 标题数据
    * @param {string} log 记录内容
    */
    function Log(context, log) {
        if (module.OnLog) {
            if (context) module.OnLog(context);
            if (log) module.OnLog(log);
        }
    }

    /**
    * 生成并上传游戏oackage包
    * @param {Object} datas 完整数据 , 不允许为空 
    * @param {Function} progress 进度回调,带number参数prg , 带string参数desc , 允许为空
    * @param {Function} success 成功回调,带Object类型参数Blob , 带Function参数Object , 允许为空
    * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
    * @param {Number} mode 默认:0,保存:1,另存为:2,保存临时:3,自动保存草稿:4
    */
    function SavePackage(datas, progress, success, error, mode) {
        if (module.NewPackageGuid && module.NewPackageGuid.length > 0 && IsSavedPackage) {
            success(module.NewPackageGuid);
            return;
        }

        module.HandleDatas(datas, function (newData) {
            var pack = new Object();
            pack[Edbox.Language] = newData;
            // 上传package
            Edbox.Package.UpLoadPackages(pack, Edbox.Language, progress, success, error);
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
                Width: Edbox.ServerInfo.width || 0,
                Height: Edbox.ServerInfo.height || 0
            };

            if (success) success(info);
        }

        function clientPlay() {
            var model = {};
            model.ProductId = Edbox.GameId;
            model.PlayType = Edbox.Access;
            model.Version = '';
            var taskid = Edbox.GetGUID();
            var message = GetMessageData(taskid, model, "PlayGame");
            Edbox.WebSocket.Send(message);
            Edbox.WebSocket.OpenGamePlayResultCallback = function (returnTaskId, data) {
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
            Edbox.WebSocket.OpenGamePlayProgressCallback = function (returnTaskId, prg) {
                if (returnTaskId === taskid) {
                    progressMap.Set(taskid, prg);
                }
            };
        }

        function play() {
            // 云图埋点
            Edbox.DataStatistic.EditPlay();

            Edbox.GetPreviewGameUrl(function (url) {
                if (url && url.trim().length > 0)
                    // 无端试玩
                    webPlay(url, success);
                else
                    // 有端试玩
                    clientPlay();

            }, error);
        }

        Log("编辑器试玩数据:", datas);

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
            module.SaveCancel();
            if (e.responseText) {
                if (error) error(Edbox.GetTip("ERROR_EditorSaveAsFailed") + e.responseText);
            }
            else {
                if (error) error(Edbox.GetTip("ERROR_EditorSaveAsFailed") + e);
            }
        }

        Log("编辑器另存为数据:", datas);

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
            // 预检测
            module.PrecheckCreate(function(data){
                if (data.data.limit){
                    reqerr(Edbox.GetTip("VIP_NOTCREATE"));
                    return;
                }
                else{
                    Edbox.MMO.CopyProduct(Edbox.GameId, name, '', success, function(err){
                        if (err.responseJSON && err.responseJSON.code && err.responseJSON.code === "LOBBY/PRODUCT_CREATE_LIMIT") {                       
                            reqerr(Edbox.GetTip("VIP_NOTCREATE"));                       
                        }
                        else{
                            reqerr(err);  
                        }
                    });  
                }
                
            }, error, true);        
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
        
            }
        }, 100);

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

                Edbox.MMO.UpdateProduct(productid, pkgGuid, newname, baseinfo.CoverImage, baseinfo.Description, function (data) {


                    // 模板变更为个人库 作品id更新
                    Edbox.GameId = data.productid;
                    GameId = data.productid;

                    // 更新版本号
                    if (data.version) {
                        Version = data.version;
                        Edbox.Version = data.version;
                    }

                    // 更新 PackageGuid
                    Edbox.PackageGuid = pkgGuid;
                    PackageGuid = Edbox.PackageGuid;

                    if (Edbox.Access === 1) {
                        // 编辑类型更新
                        Edbox.Access = 2;
                        Access = 2;
                    }

                    UpdataDataSet();

                    // 云图埋点
                    Edbox.DataStatistic.EditSave(Edbox.GameId);

                    setTimeout(function () {
                        callProgress(999, "Save Finish Tip");
                        // 关闭退出提示
                        Edbox.WindowEvent.Hide();
                    }, 500);


                    // 成功后发送
                    if (success) {
                        setTimeout(function () {
                            success(GameId);
                        }, 1000);
                    }
                    else {
                        alert(Edbox.GetTip("TIP_EditorSaveSucess"));
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
        Edbox.Api.MMO.PostChangeNumEditRecord(app_id, success, error);
    }

    // 更新DataSet
    function UpdataDataSet() {
        var args = Edbox.DataSet.Get("EdboxArgs");

        var obj = JSON.parse(Edbox.Decode(args));

        obj.Version = Edbox.Version;
        obj.GameId = Edbox.GameId;
        obj.Access = Edbox.Access;

        Edbox.DataSet.Set("EdboxArgs", Edbox.Encode(JSON.stringify(obj)));
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
        newSaveGameId = null;

        function reqerr(e) { 

            module.SaveCancel();

            if (e.responseText) {
                if (error) error(Edbox.GetTip("ERROR_EditorSaveFailed") + e.responseText);
            }
            else {
                if (error) error(Edbox.GetTip("ERROR_EditorSaveFailed") + e);
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

        Log("编辑器保存数据:", datas);

        if (IsSaved) {
            callProgress(100, "Save Finish");

            // 成功后发送
            if (success) success(Edbox.GameId);
            return;
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

            }
        }, 100);

        // 检测是否可以创建作品
      
        module.PrecheckCreate(function(data){

            if (data.data.limit){
                reqerr(Edbox.GetTip("VIP_NOTCREATE"));
                return;
            }

            callProgress(5, "GetPackageBlob");
            var baseinfo = GetBaseInfo(datas);
            SavePackage(datas, function (prg, desc) {
    
                callProgress(5 + prg * 90 / 100, desc);
    
            }, function (pkgGuid) {
    
                callProgress(95, "SaveProduct");
    
                Edbox.MMO.SaveProduct(Edbox.GameId, pkgGuid, baseinfo.GameName, baseinfo.CoverImage, baseinfo.Description, function (data) {
                    if (data.productid === undefined) {
                        reqerr("Productid is Null");
                        return;
                    }
    
                    callProgress(100, "Save Finish");
    
                    IsSaved = true;
    
                    // 更新版本号
                    if (data.version) {
                        Version = data.version;
                        Edbox.Version = data.version;
                    }
    
                    // 模板变更为个人库 作品id更新
                    Edbox.GameId = data.productid;
                    GameId = data.productid;
    
                    // 更新 PackageGuid
                    Edbox.PackageGuid = pkgGuid;
                    PackageGuid = Edbox.PackageGuid;
    
                    if (Edbox.Access === 1) {
                        // 编辑类型更新
                        Edbox.Access = 2;
                        Access = 2;
                    }
    
                    UpdataDataSet();
    
                    Edbox.Message.Broadcast("EditSave", []);
    
                    // 云图埋点
                    Edbox.DataStatistic.EditSave(Edbox.GameId);
    
                    // 增加编辑记录
                    AddEditRecord(Edbox.GameId);
    
                    setTimeout(function () {
                        callProgress(999, "Save Finish Tip");
                    }, 500);
    
                    // 成功后发送
                    if (success) {
                        setTimeout(function () {
                            success(Edbox.GameId);
                        }, 1000);
    
                    }
                    else {
                        alert(Edbox.GetTip("TIP_EditorSaveSucess"));
                    }
                }, function(err){
                    if (err.responseJSON && err.responseJSON.code && err.responseJSON.code === "LOBBY/PRODUCT_CREATE_LIMIT") {                       
                        reqerr(Edbox.GetTip("VIP_NOTCREATE"));                       
                    }
                    else{
                        reqerr(err);
                    }}, GameId);
            }, reqerr, 1);
        },error);
        
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
                if (error) error(Edbox.GetTip("ERROR_EditorSaveFailed") + e.responseText);
            }
            else {
                if (error) error(Edbox.GetTip("ERROR_EditorSaveFailed") + e);
            }
        }

        var baseinfo = GetBaseInfo(datas);

        SavePackage(datas, null, function (pkgGuid) {
            if (Edbox.Access === 1) {
                Edbox.MMO.SaveTempProduct(Edbox.GameId, Version, pkgGuid, baseinfo.CoverImage, baseinfo.Description, function (data) {
                    if (data.app_id === undefined) {
                        reqerr("Productid is Null");
                        return;
                    }

                    if (success)
                        success(data.app_id, baseinfo.CoverImage, data.TempName);
                    else {
                        alert(Edbox.GetTip("TIP_EditorSaveSucess"));
                    }
                }, reqerr);
            } else {
                Edbox.MMO.GetProductInfo(Edbox.GameId, function (baseInfo) {
                    Edbox.MMO.SaveTempProduct(baseInfo.baseid, baseInfo.base_version, pkgGuid, baseinfo.CoverImage, baseinfo.Description, function (data) {
                        if (data.app_id === undefined) {
                            reqerr("Productid is Null");
                            return;
                        }

                        if (success)
                            success(data.app_id, baseinfo.CoverImage, data.TempName);
                        else {
                            alert(Edbox.GetTip("TIP_EditorSaveSucess"));
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
        var temp = Edbox.Message.OnReceive;
        Edbox.Message.OnReceive = function (data, com) {
            if (temp) temp(data, com);
            if (data.Type === "Add" || data.Type === "Update" || data.Type === "Delete") {
                IsSaved = false;
                IsSavedPackage = false;
                Edbox.WindowEvent.Show();
            }
        };

        temp = Edbox.Message.OnSend;
        Edbox.Message.OnSend = function (data, com) {
            if (temp) temp(data, com);
            if (data.Type === "Add" || data.Type === "Update" || data.Type === "Delete") {
                IsSaved = false;
                IsSavedPackage = false;
                Edbox.WindowEvent.Show();
            }
        };

        Edbox.Message.AddMessageHandler("ListenEvent", function (datas, com) {
            console.log(datas);
            ListenEvent = datas;
            ListenCom = com;
        });
    }

    function GetMessageData(taskId, model, code) {
        var arg = Edbox.Encode(JSON.stringify(model));
        var taskConfig = {};
        taskConfig.ConfigGuid = config["ConfigGuid"][Edbox.ServerKey];
        taskConfig.WebServer = Edbox.Protocol + "://" + Edbox.GetHost("Login") + "/";
        taskConfig.ProgramGuid = config["ProgramGuid"][Edbox.ServerKey];
        taskConfig.ApkToolId = config["ApkToolId"][Edbox.ServerKey];
        taskConfig.Html5PlayerId = config["Html5PlayerId"][Edbox.ServerKey];
        taskConfig.Language = Edbox.Language;
        taskConfig.SDPAppId = Edbox.SDPAppId;
        taskConfig.LoginArea = Edbox.Area;
        taskConfig.Channel = Edbox.Channel;
        taskConfig.AppKey = Edbox.AppKey;
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
     * @param {Object} success 成功回调
     * @param {string} error 出错回调 , 错误信息 , 允许为空
     */
    function BaseInfoVerified(datas, success, error) {
        var baseinfo = GetBaseInfo(datas);

        // 作品名称全空格判断
        if (baseinfo.GameName.match(/^[ ]+$/)) {
            console.log("GameName all space");
            if (error) error(Edbox.GetTip("ERROR_GAMENAME_SPACE"));
            return;
        }

        // eslint-disable-next-line no-useless-escape
        if (baseinfo.GameName.match(/[\\\/:*?"<>|]/)) {
            console.log("GameName illegal_character");
            if (error) error(Edbox.GetTip("ERROR_ILLEGAL_CHARACTER"));
            return;
        }

        if (success) success(baseinfo);

    }

    /**
     * 是否已保存
     */
    var IsSaved = false;
    /**
     * 是否已生成Package包
     */
    var IsSavedPackage = false;
    /**
     * 是否在大厅中打开
     */
    var IsOpenInLobby = false;

    /**
     * 检测是否在大厅中打开
     */
    function CheckOpenInLobby() {
        var func = function (e) {
            var from = e.source;
            var data = e.data;
            if (data && data.Type === "FunctionCall_IsOpenInLobby") {
                IsOpenInLobby = data.Datas[0];
            }
        };
        window.addEventListener("message", func, false);

        window.top.postMessage(
            {
                Type: "FunctionCall",
                Datas: [
                    "FunctionCall_IsOpenInLobby",
                    "return Edbox.Lobby !== undefined;"
                ]
            },
            "*"
        );
    }
    CheckOpenInLobby();

    /**
     * Edbox编辑器通用组件
     * 用于Edbox平台的编辑器基础服务框架,拓展Edbox Html5编辑器接入平台的方法
     * @author 温荣泉(201901)
     * @see http://ndsdn.nd.com.cn/index.php?title=Edbox编辑器通用组件
     * */
    var module = {

        /**
       * log输出
       */
        OnLog: null,

        /**
         * 最新保存的配置包guid
         */
        NewPackageGuid: "",

        /**
         * Datas原始数据处理 (保存前处理)
         * @param {Object} data 完整数据 , 不允许为空 
         * @param {Function} success 成功回调 带参数datas
         * @param {Function} error 失败回调
         * @param {Number} mode 默认:0,保存:1,另存为:2,保存临时:3
         */
        HandleDatas: function (data, success, error, mode) {
            var datas = JSON.parse(JSON.stringify(data));

            Log("Datas原始数据处理 开始", datas);

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
                        if (obj.Class === "Loading" && obj.Name === "Loading") {
                            LoadingDatas = obj;
                        }

                        // 保留排行榜节点信息
                        else if (obj.Class === "Ranking" && obj.Name === "Ranking") {
                            (function () {
                                if (newRankingConfig) {
                                    // 保存记录在static上的rankuid，记录在obj.data上的排行榜信息
                                    var tempRankingList = obj.Datas[2].Datas;
                                    for (var i in tempRankingList) {
                                        tempRankingList[i].RankUid = newRankingConfig[2].Datas[i].RankUid;
                                        Edbox.Ranking.rankidMap[tempRankingList[i].ID] = newRankingConfig[2].Datas[i].RankUid;
                                    }
                                }
                                RankingDatas = obj;
                                // Edbox.Message.Get(window, function (com) {
                                //     com.Send("Update", [obj]);
                                // });
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
                    datas.StaticData.Login = loginData;
                }
                if (LoadingDatas)
                    datas.StaticData.Loading = LoadingDatas;
                if (RankingDatas) {
                    datas.StaticData.Ranking = RankingDatas;
                    if (RankingDatas.Datas) {
                        oldRankingConfig = RankingDatas.Datas[2];
                    }
                }

                Log("Datas EditorComponents 数据处理 开始 ", datas);

                if (Edbox.EditorComponents) {
                    if (mode === 1) {
                        Edbox.EditorComponents.Save(datas, function (newdatas) {
                            if (success) {
                                Log("Datas原始数据处理 成功 ", newdatas);
                                success(newdatas);
                            }
                        }, error);
                    }
                    else {
                        Edbox.EditorComponents.SaveAs(datas, function (newdatas) {
                            if (success) {
                                Log("Datas原始数据处理 成功 ", newdatas);
                                success(newdatas);
                            }
                        }, error);
                    }
                }
                else {
                    if (success) {
                        Log("Datas原始数据处理 成功 ", datas);
                        success(datas);
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

                // 防止另存为时，模板B依照模板A删除排行榜
                if (oldRankingConfig && mode !== 2) {
                    // 保存时与服务器同步已删除排行榜
                    var newRankUid = {};
                    for (var i in obj.Datas) {
                        // 二次保存时 复原rankuid
                        if (!obj.Datas[i].RankUid && Edbox.Ranking.rankidMap[obj.Datas[i].ID]) {
                            obj.Datas[i].RankUid = Edbox.Ranking.rankidMap[obj.Datas[i].ID];
                        }
                        if (obj.Datas[i].RankUid) {
                            newRankUid[obj.Datas[i].RankUid] = true;
                            Edbox.Ranking.rankidMap[obj.Datas[i].ID] = obj.Datas[i].RankUid;
                        }
                    }
                    for (var j in oldRankingConfig.Datas) {
                        var tmpRankUid = oldRankingConfig.Datas[j].RankUid;
                        // 旧config中的rankuid 不在 新的config中时，则删除
                        if (tmpRankUid && !newRankUid[tmpRankUid]) {
                            Edbox.Ranking.DeleteRanking(tmpRankUid);
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
                            Edbox.Ranking.CreateRanking(tmpGameId, newRankingConfig, obj.Datas[index], function (data) {
                                obj.Datas[index].RankUid = data.rank_uuid;
                                Edbox.Ranking.rankidMap[obj.Datas[index].ID] = data.rank_uuid;
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
                            Edbox.Ranking.RefreshRanking(tmpGameId, newRankingConfig, obj.Datas[index].RankUid, obj.Datas[index], function () {
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
                result.Message = Edbox.GetTip("ERROR_" + result.Code);
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
                        Edbox.WebSocket.Send(message);
                        Edbox.WebSocket.ExportEditorResultCbDic.Set(datas.taskId, function (returnTaskId, data) {
                            if (returnTaskId === datas.taskId) {
                                var result = {};
                                if (data.Code === "SUCCESS" || data.Code === "CANCEL") {

                                    if (data.Code === "SUCCESS") {
                                        // 云图埋点
                                        Edbox.DataStatistic.ExportEditorTemplate(appId);
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
                                    result.Message = Edbox.GetTip("ERROR_" + result.Code);
                                    if (error) error(result);
                                }
                            }
                        });
                        Edbox.WebSocket.ExportEditorProgressCbDic.Set(datas.taskId, function (returnTaskId, progress) {
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
                                result.Message = Edbox.GetTip("ERROR_" + result.Code);
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
                    result.Message = Edbox.GetTip("ERROR_" + result.Code);
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
                result.Message = Edbox.GetTip("ERROR_" + result.Code);
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
                    Edbox.WebSocket.Send(message);
                    Edbox.WebSocket.ExportExeResultCbDic.Set(data.taskId, function (returnTaskId, returnData) {
                        if (returnTaskId === data.taskId) {
                            var result = {};
                            if (returnData.Code === "SUCCESS" || returnData.Code === "CANCEL") {

                                if (returnData.Code === "SUCCESS") {
                                    // 云图埋点
                                    Edbox.DataStatistic.ExportGame(data.appId, "exe");
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
                                result.Message = Edbox.GetTip("ERROR_" + result.Code);
                                if (error) error(result);
                            }
                        }
                    });
                    Edbox.WebSocket.ExportExeProgressCbDic.Set(data.taskId, function (returnTaskId, progress) {
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
                    result.Message = Edbox.GetTip("ERROR_" + result.Code);
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
                result.Message = Edbox.GetTip("ERROR_" + result.Code);
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
                    Edbox.WebSocket.Send(message);
                    Edbox.WebSocket.ExportApkResultCbDic.Set(data.taskId, function (returnTaskId, returnData) {
                        if (returnTaskId === data.taskId) {
                            var result = {};
                            if (returnData.Code === "SUCCESS" || returnData.Code === "CANCEL") {

                                if (returnData.Code === "SUCCESS") {
                                    // 云图埋点
                                    Edbox.DataStatistic.ExportGame(data.appId, "apk");
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
                                result.Message = Edbox.GetTip("ERROR_" + result.Code);
                                if (error) error(result);
                            }
                        }
                    });

                    Edbox.WebSocket.ExportApkProgressCbDic.Set(data.taskId, function (returnTaskId, progress) {
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
                    result.Message = Edbox.GetTip("ERROR_" + result.Code);
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
            Edbox.WebSocket.CheckIsOpen(function (isOpen) {
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
            var subUrl = "/edbox/v1.0/package/lastest_version";
            var arg = {
                pkg_guid: config["BaseServiceExeId"][Edbox.ServerKey],
                pkg_version: "1.0.0",
                pkg_platform: "PC",
                language: "zh-CN"
            };

            $.ajax({
                url: Edbox.Protocol + "://" + Edbox.GetHost("Login") + subUrl,
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
                Edbox.DataStatistic.ClickEvent("Save", "Editor", TemplateName);
            }
            else if (Access === 2) {
                Edbox.DataStatistic.ClickEvent("Save", "LibraryEditor", TemplateName);
            }

            datas = JSON.parse(JSON.stringify(datas));

            Log("编辑器开始保存 ", datas);

            // 基础信息检测
            BaseInfoVerified(datas, function () {

                if (ListenEvent) {
                    if (ListenEvent.indexOf("BeforeSave") > -1) {
                        var guid = Edbox.GetGUID();
                        Edbox.Message.AddMessageHandler(guid, function (datas, com) {
                            var isSucc = datas[1];
                            if (isSucc === undefined) {
                                isSucc = true;
                            }
                            if (!isSucc) {
                                error("0");
                                return;
                            }

                            SaveHandle(datas[0], success, error, progress);
                            Edbox.Message.Functions.Remove(guid);

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

            datas = JSON.parse(JSON.stringify(datas));

            Log("编辑器保存临时作品 ", datas);

            if (ListenEvent) {
                if (ListenEvent.indexOf("BeforeSave") > -1) {
                    var guid = Edbox.GetGUID();
                    Edbox.Message.AddMessageHandler(guid, function (datas, com) {
                        var isSucc = datas[1];
                        if (isSucc === undefined) {
                            isSucc = true;
                        }
                        if (!isSucc) {
                            error("0");
                            return;
                        }
                        SaveTempHandle(datas[0], success, error);
                        Edbox.Message.Functions.Remove(guid);

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
                Edbox.DataStatistic.ClickEvent("SaveAs", "Editor", TemplateName);
            }
            else if (Access === 2) {
                Edbox.DataStatistic.ClickEvent("SaveAs", "LibraryEditor", TemplateName);
            }

            datas = JSON.parse(JSON.stringify(datas));

            Log("编辑器开始另存为 ", datas);

            // 基础信息检测
            BaseInfoVerified(datas, function (baseinfo) {

                if (ListenEvent) {
                    if (ListenEvent.indexOf("BeforeSaveAs") > -1) {
                        var guid = Edbox.GetGUID();
                        Edbox.Message.AddMessageHandler(guid, function (datas, com) {
                            var isSucc = datas[1];
                            if (isSucc === undefined) {
                                isSucc = true;
                            }
                            if (!isSucc) {
                                error("0");
                                return;
                            }

                            SaveAsHandle(datas[0], baseinfo.GameName, success, error, progress);
                            Edbox.Message.Functions.Remove(guid);

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

            Log("游戏传入的数据: ", datas);
            Edbox.Resource.LoadDatas(datas, function (datas) {

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
                                if (Edbox.Access === 1) {
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

                if (success) {
                    var newData = JSON.parse(JSON.stringify(datas));
                    Log("编辑器处理后的数据: ", newData);
                    success(newData);
                }
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
                Edbox.DataStatistic.ClickEvent("Play", "Editor", TemplateName);
            }
            else if (Access === 2) {
                Edbox.DataStatistic.ClickEvent("Play", "LibraryEditor", TemplateName);
            }

            datas = JSON.parse(JSON.stringify(datas));
            Log("编辑器试玩 ", datas);

            // 基础信息检测
            BaseInfoVerified(datas, function (baseinfo) {
                // 先保存再试玩
                if (ListenEvent) {
                    if (ListenEvent.indexOf("BeforePlay") > -1) {
                        var guid = Edbox.GetGUID();
                        Edbox.Message.AddMessageHandler(guid, function (datas, com) {
                            var isSucc = datas[1];
                            if (isSucc === undefined) {
                                isSucc = true;
                            }
                            if (!isSucc) {
                                error("0");
                                return;
                            }
                            PlayHandle(datas[0], success, error, progress);
                            Edbox.Message.Functions.Remove(guid);

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

                    var lobbyrul = Edbox.Protocol + "://" + Edbox.GetHost("Lobby");
                    window.open(lobbyrul);
                    return;
                }
            }

            // 判断是否在大厅内嵌中打开   
            if (IsOpenInLobby) {
                var data = new Object();
                data.Type = "EditorExit";
                data.Url = Edbox.GetHost("Lobby");
                window.top.postMessage(data, "*");
            }
            else {
                location.href = Edbox.Protocol + "://" + Edbox.GetHost("Lobby");
            }
        },

        /**
         * 初始化数据
         * Initialize Edobx_Editor
         * @param {Function} success 成功回调,  带Function参数Object , 允许为空
         * @param {Function} error 出错回调, 带Function参数Object , 允许为空
         */
        Init: function (success, error) {

            function getLanguage() {
                switch (Edbox.Language) {
                    case "English":
                        return "en_us";
                    case "SimplifiedChinese":
                        return "zh_cn";
                    case "TraditionalChinese":
                        return "zh_hk";
                    case "TraditionalChinese_TW":
                        return "zh_tw";
                }

                return "zh_cn";
            }

            GameId = Edbox.GameId;
            PackageGuid = Edbox.PackageGuid;
            Version = Edbox.Version;
            Access = Edbox.Access;
            Mode = Edbox.Mode;

            //初始化WebSocket
            var model = {};
            model.AccessToken = Edbox.AccessToken;
            model.MacKey = Edbox.MacKey;
            model.TimeStamp = Edbox.TimeStamp;
            model.UserId = Edbox.AccountId;
            model.EbUserId = Edbox.EbUserId;
            model.NickName = Edbox.UserName;
            var message = GetMessageData(Edbox.GetGUID(), model, "Init");
            Edbox.WebSocket.SendInitMessage(message);

            function getTempId(){
                // 判断是否是需要获取产品临时ID
                if (Access === 1) {
                    Edbox.MMO.GetTempAppId(Access, function (info) {
                        GameId = info.app_id;

                        if (success) success();

                    }, error);
                }
                else {

                    if (success) success();
                }
            }

            AddListenEvent();
            Edbox.MMO.GetInfo(Edbox.GameId, function (data) {
                BaseAppId = data.baseid === "" ? data.app_id : data.baseid;
                TemplateName = data.productname;
                Version = Edbox.Version;
                Access = Edbox.Access;
                GameId = Edbox.GameId;

                GameName = "";
                // 模板名称多语言
                if (data.global_name) {
                    GameName = data.global_name[getLanguage()];
                }
                if (!GameName || GameName === "") {
                    GameName = data.productname;
                }

                Description = "";
                // 模板描述多语言
                if (data.global_introduction) {
                    Description = data.global_introduction[getLanguage()];
                }
                if (!Description || Description === "") {
                    Description = data.introduction;
                }

                CoverImage = data.icon;
                // 获取封面图片url
                if (CoverImage !== ""){
                    Edbox.NDR.Get(CoverImage, function (info) {
                        CoverImageValue = info.Url;  
                        getTempId();   
                    },function(){
                        getTempId();
                    });
                }
                else{
                    getTempId();
                }

                // 云图埋点
                Edbox.DataStatistic.EditStart();

            }, error);


        },

        /**
         * 敏感词判断
         * @param {String} word 需要验证的字符串
         * @param {Function} success 成功回调 带boolean类型参数,true、包含敏感词 false 没有敏感词
         * @param {Function} error 出错回调
         */
        IsSensitive: function (word, success, error) {
            Edbox.MMO.IsSensitive(word, success, error);
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
            Edbox.Api.MMO.GetEditRecordInfo(page, size, success, error);
        },

        /**
         * 清除编辑记录
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        PostClearEditRecord: function (success, error) {
            var app_id = "-1";
            Edbox.Api.MMO.PostChangeNumEditRecord(app_id, success, error);
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
            if (Edbox.Platform.IsPC) {
                get_type = 5;
            }
            var accessType = 2;
            Edbox.Api.MMO.GetTryPlayingInfo(app_id, accessType, get_type, "", function (appResInfo) {

                var webresid = appResInfo.web_editor_resid;
                if (Edbox.Platform.IsPC) {
                    webresid = appResInfo.web_pc_editor_resid;
                }
                if (webresid && webresid !== "") {
                    var result = {};
                    result.Code = "WEBGAME";
                    var ms = {};
                    Edbox.GameId = app_id;
                    Edbox.Access = accessType;
                    Edbox.Version = version;
                    ms.Url = Edbox.SetQueryString("EdboxArgs", Edbox.GetLoginInfo(), webresid);
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
        },

        /**
         * 获取模板id
         * @returns {String} 模板id
         */
        GetBaseAppId: function () {
            return BaseAppId;
        },

        /**
         * 判断是否保存过（数据是否有变动）
         * @param {Boolean} bool 设置是否保存过
         * @returns {Boolean} 是否保存过（数据是否有变动）
         */
        IsSavedPackage: function (bool) {
            if (typeof bool === "boolean") {
                IsSavedPackage = bool;
            }
            return IsSavedPackage;
        },

        /**
         * 自动保存入草稿箱
         * @param {Object} datas 完整的数据
         * @param {function} success 成功回调 带参数 配置包的 guid
         * @param {function} error 失败回调
         */
        SaveDraftBox: function (datas, success, error) {
            SavePackage(datas, null, success, error, 4);
        },

        /**
         * 判断是否在大厅内嵌中打开
         * 大厅打开true, 新窗口false
         * @returns {boolean} 是否在大厅内嵌中打开
         */
        IsOpenInLobby: function () {
            return IsOpenInLobby;
        },

        /**
         * 预检测创建作品
         * @param {Function} success 成功回调
         *          data : {
         *              limit : boolean true:权限不够, 反之则无限制                 
         * }
         * @param {Function} error 出错回调
         * @param {boolean} bcopy 是否为复制
         */
        PrecheckCreate: function (success, error, bcopy) {

            // 非第一次创建模板
            if (Edbox.Access !== 1 && !bcopy){
                if(success) success({data: {limit: false}});
                return;
            }

            // 获取模板信息
            function getTemplateInfo(success, error) {
                if (Edbox.Access === 1){

                    if (success) success(Edbox.GameId, Edbox.Version);         
                }
                else if (Edbox.Access === 2){
                    Edbox.Api.MMO.GetPersonalAppInfo(Edbox.GameId, function(data){
                     
                        if (success) success(data.baseid, data.base_version);
                    },error);
                }
                else if (Edbox.Access === 3){
                    Edbox.Api.MMO.GetAppInfo(Edbox.GameId, function(data){
                        if (success) success(data.baseid, data.base_version);
                    },error);
                }
            }
            
            getTemplateInfo(function(tempplateId, version){
                Edbox.Vip.PrecheckCreate(tempplateId, version, function(datas){
                    if(success) success({data: datas})}
                    , error);
            });
        },

        // todo 数据源的引用
        DataResource: null
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Editor"));
