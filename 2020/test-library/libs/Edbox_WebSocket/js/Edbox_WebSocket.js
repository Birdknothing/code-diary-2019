// EdboxWebSocket组件
(function (namespace, className) {
    /**
     * EdboxWebSocket组件
     * 用于Edbox平台的WebSocket组件,用于实现WebSocket消息的传递与管理
     * @author 余晓(871129)
     * @version 0.0.0.1 (2019年06月17日 21:00:00)
     * @see 
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      Edbox:http://ndsdn.nd.com.cn/index.php?title=Edbox通用组件
     * */
    var module = {

        /**
         * WebSocket连接对象
         */
        Ws : null,

        /**
         * WebSocket连接对象状态
         */
        IsOpen : false,

        /**
         * WebSocket是否处于连接后断开状态
         */
        IsBreak : false,
        /**
         * 最近一条消息
         */
        LastMessage : "",
        /**
         * 站点初始化数据
         */
        InitMessage : "",
        /**
         * 打开游戏进度回调
         */
        OpenGamePlayProgressCallback : null,

        /**
         * 打开游戏结果回调
         */
        OpenGamePlayResultCallback : null,
        /**
         * 打开编辑器进度回调
         */
        OpenGameEditorProgressCallback : null,

        /**
         * 打开编辑器结果回调
         */
        OpenGameEditorResultCallback : null,
        
        /**
         * 导出编辑器结果回调
         */
        ExportEditorResultCbDic : new Dictionary(),
        /**
         * 导出编辑器进度回调
         */
        ExportEditorProgressCbDic : new Dictionary(),
        /**
         * 导出APK结果回调
         */
        ExportApkResultCbDic : new Dictionary(),
        /**
         * 导出APK进度回调
         */
        ExportApkProgressCbDic : new Dictionary(),
        /**
         * 导出EXE游戏结果回调
         */
        ExportExeResultCbDic : new Dictionary(),
        /**
         * 导出EXE游戏进度回调
         */
        ExportExeProgressCbDic : new Dictionary(),
        /**
         * 搜索百度图片回调
         */
        SearchBaiduImageResultCbDic : new Dictionary(),
        /**
         * 搜索谷歌图片回调
         */
        RequestBase64ImageCbDic : new Dictionary(),
        /**
         * 截图回调
         */
        OpenScreenShooterCbDic : new Dictionary(),

        /**
         * 连接WebSocket
         */
        Connect : function () {
            if(Edbox.Platform.IsIPhone || Edbox.Platform.IsAndroid || Edbox.Platform.IsIpad || Edbox.Platform.IsIOS || Edbox.Platform.IsMac){
                return;
            }
            // 监听连接
            var wsImpl = window.WebSocket || window.MozWebSocket || window.webSocket;
            // create a new websocket and connect
            module.Ws = new wsImpl('ws://127.0.0.1:8181/');
            // console.log("ws.readyState :" + module.Ws.readyState);
            // when data is comming from the server, this metod is called
            module.Ws.onmessage = function (evt) {
                //evt.data
                // console.log("module get message : " + evt.data);
                if (evt.data) {
                    var message = JSON.parse(evt.data);
                    if (message) {
                        if (message.Code === "OpenGamePlayProgress" && module.OpenGamePlayProgressCallback) {
                            module.OpenGamePlayProgressCallback(message.TaskId, JSON.parse(message.Data));
                        }
                        if (message.Code === "OpenGamePlayResult" && module.OpenGamePlayResultCallback) {
                            module.OpenGamePlayResultCallback(message.TaskId, JSON.parse(message.Data));
                        }
                        if (message.Code === "OpenEditorProgress" && module.OpenGameEditorProgressCallback) {
                            module.OpenGameEditorProgressCallback(message.TaskId, JSON.parse(message.Data));
                        }
                        if (message.Code === "OpenEditorResult" && module.OpenGameEditorResultCallback) {
                            module.OpenGameEditorResultCallback(message.TaskId, JSON.parse(message.Data));
                        }
                        if (message.Code === "ExportEditorProgress" && module.ExportEditorProgressCbDic.ContainsKey(message.TaskId)) {
                            var f =  module.ExportEditorProgressCbDic.Get(message.TaskId);
                            f(message.TaskId, JSON.parse(message.Data));
                        }
                        if (message.Code === "ExportEditorResult" && module.ExportEditorResultCbDic.ContainsKey(message.TaskId)) {
                            var f =  module.ExportEditorResultCbDic.Get(message.TaskId);
                            f(message.TaskId, JSON.parse(message.Data));
                            module.ExportEditorResultCbDic.Remove(message.TaskId);
                            module.ExportEditorProgressCbDic.Remove(message.TaskId);
                        }
                        if (message.Code === "ExportApkProgress" && module.ExportApkProgressCbDic.ContainsKey(message.TaskId)) {
                            var f =  module.ExportApkProgressCbDic.Get(message.TaskId);
                            f(message.TaskId, JSON.parse(message.Data));
                        }
                        if (message.Code === "ExportApkResult" && module.ExportApkResultCbDic.ContainsKey(message.TaskId)) {
                            var f =  module.ExportApkResultCbDic.Get(message.TaskId);
                            f(message.TaskId, JSON.parse(message.Data));
                            module.ExportApkResultCbDic.Remove(message.TaskId);
                            module.ExportApkProgressCbDic.Remove(message.TaskId);
                        }
                        if (message.Code === "ExportPCGameProgress" && module.ExportExeProgressCbDic.ContainsKey(message.TaskId)) {
                            var f =  module.ExportExeProgressCbDic.Get(message.TaskId);
                            f(message.TaskId, JSON.parse(message.Data));
                        }
                        if (message.Code === "ExportPCGameResult" && module.ExportExeResultCbDic.ContainsKey(message.TaskId)) {
                            var f =  module.ExportExeResultCbDic.Get(message.TaskId);
                            f(message.TaskId, JSON.parse(message.Data));
                            module.ExportExeResultCbDic.Remove(message.TaskId);
                            module.ExportExeProgressCbDic.Remove(message.TaskId);
                        }
                        if (message.Code === "SearchBaiduImageResult" && module.SearchBaiduImageResultCbDic.ContainsKey(message.TaskId)) {
                            var f =  module.SearchBaiduImageResultCbDic.Get(message.TaskId);
                            f(message.TaskId, JSON.parse(message.Data));
                            module.SearchBaiduImageResultCbDic.Remove(message.TaskId);
                        }
                        if (message.Code === "RequestBase64ImageResult" && module.RequestBase64ImageCbDic.ContainsKey(message.TaskId)) {
                            var f =  module.RequestBase64ImageCbDic.Get(message.TaskId);
                            f(message.TaskId, JSON.parse(message.Data));
                            module.RequestBase64ImageCbDic.Remove(message.TaskId);
                        }
                        if (message.Code === "ScreenShotResult" && module.OpenScreenShooterCbDic.ContainsKey(message.TaskId)) {
                            var f =  module.OpenScreenShooterCbDic.Get(message.TaskId);
                            f(message.TaskId, JSON.parse(message.Data));
                            module.OpenScreenShooterCbDic.Remove(message.TaskId);
                        }
                    }
                }
            };

            // when the connection is established, this method is called
            module.Ws.onopen = function () {
                module.IsOpen = true;
                // console.log("module onopen");
            };

            // when the connection is closed, this method is called
            module.Ws.onclose = function () {
                module.IsOpen = false;
                module.IsBreak = true;
                module.Ws = null;
                // console.log("module onclose");
            };

            // when the connection is error, this method is called
            module.Ws.onerror = function () {
                module.IsOpen = false;
                module.Ws.close();
                // console.log("module onerror");
            };
        },
        /**
         * 发送消息
         * Send Message
         * @param {String} message 发送的消息
         */
        Send : function (message) {
            if (!module.IsOpen || module.Ws === null) {
                module.Connect();
                module.LastMessage = message;
            } else {
                if(module.InitMessage !== ""){
                    module.Ws.send(module.InitMessage);
                    module.InitMessage = "";
                    setTimeout(function(){
                        module.Ws.send(message);
                    }, 500);
                }else{
                    module.Ws.send(message);
                }
            }
        },
        
        CheckIsOpen: function(callback){
            if(callback){
                if(module.IsOpen){
                    callback(true);
                }else{
                    module.Connect();
                    setTimeout(function(){
                        callback(module.IsOpen);
                    }, 1000);
                }
            }
        },
        
        SendInitMessage: function(message){
            if (!module.IsOpen || module.Ws === null) {
                module.InitMessage = message;
            } else {
                module.Ws.send(message);
            }
        },

        InArray : function (arr, item) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === item) {
                    return true;
                }
            }
            return false;
        },

         /**
         * 发送消息
         * Send Message
         * @param {String} message 发送的消息
         */
        CheckStatus : function () {
            if (module.IsOpen && module.Ws) {
                if(module.LastMessage !== ""){
                    module.Ws.send(module.LastMessage);
                    module.LastMessage = "";
                }
            }
        },

        //初始化
        Init : function () {
            module.Connect();
            setInterval(function(){module.CheckStatus();}, 1000);
        }
    };

    module.Init();

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "WebSocket"));