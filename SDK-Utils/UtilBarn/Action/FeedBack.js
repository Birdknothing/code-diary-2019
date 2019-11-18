// UtilBarn IM用户反馈平台组件
(function (namespace, className) {
    var api = UtilBarn.Api.FeedBack;

    var _lobbyModel = new Object();
    var _editorModel = new Object();

    /**
     * UtilBarn IM用户反馈平台组件
     * 用于UtilBarn向IM用户反馈平台信息
     * @author 张涛(120100) Review By 温荣泉(201901)
     * */
    var module = {
        /**
         * 选取本地图片（选择并上传）
         * @param {object} file 文件路径
         * @param {Function} success 成功带参数 info{dentyID,Name,Data}
         * @param {Function} error 失败带参数 string
         * @param {Function} process 进度带参数 int
         */
        UploadImageToCS: function (file, success, error, process) {
            UtilBarn.NDR.GetFileData(file, function (info) {
                UtilBarn.Action.FeedBack.NameCheck(info, function () {
                    var userid = UtilBarn.EbUserId;
                    UtilBarn.Api.NDR.GetSession(userid, function (session) {
                        function ReturnCsData(csdata) {
                            var data = new Object();
                            if (csdata) {
                                data.dentry_id = csdata.dentry_id;
                                data.url = UtilBarn.Protocol + "://" + UtilBarn.GetHost("CDNCS") + "/v0.1/static" + csdata.path;
                                success(data);
                            }
                            else {
                                var ex = new Object();
                                ex.error = "error";
                                error(ex);
                            }
                        }
                        var blob = UtilBarn.NDR.Base64ToBlob(info.Data);
                        UtilBarn.Api.CS.UpLoadToCS(session.session_id, session.dist_path, info.Name, blob, process, ReturnCsData, error);
                    }, error);
                }, error);
            });
        },
        /**
         * 检测文件名称
         * @param {Object} info 成功带参数 info{Name,Data}
         * @param {Function} success 失败带参数 string
         * @param {Function} error 进度带参数 int
        */
        NameCheck: function (info, success, error) {
            if (!info.Name) {
                if (error) error("Illegal File Name");
                return;
            }

            var list = new Array("&", " ", "#", ":", "?", "!", "/", "\\");
            for (var i = 0; i < list.length; i++) {
                var key = list[i];
                if (info.Name.indexOf(key) >= 0) {
                    if (error) error("Illegal File Name");
                    return;
                }
            }
            if (success) success(info);
        },

        /**
         * 根据dentry_id获取cs图片url
         * @param {String} dentry_id dentry_id
         * @returns {String} cs图片url
         */
        GetCSImageUrl: function (dentry_id) {
            var data = new Object();
            data.dentry_id = dentry_id;
            data.url = UtilBarn.Protocol + "://" + UtilBarn.GetHost("CDNCS") + "/v0.1/download?dentryId=" + dentry_id;
            return data;
        },

        /**
         * 获取大厅反馈模板
         * @param {string} modelName 模板名称（唯一）
         * @param {Function} success 编辑器反馈模板
         * @param {Function} error 卸载反馈模板
         */
        GetModelData: function (modelName, success, error) {
            var succ = function (dataObj) {
                //数据转换并保存到这里

                if (!dataObj.hasOwnProperty('items')) {
                    var err = new Object();
                    err.error = "NOModel";
                    error(err);
                } else {
                    if (dataObj.items[0]) {
                        var modelData = new Object();
                        modelData.feedback_type = dataObj.items[0].feedback_type;
                        modelData.model_id = dataObj.items[0].id;
                        for (var index = 0; index < dataObj.items[0].items.length; index++) {
                            var element = dataObj.items[0].items[index];
                            if (element.symbol === "scene") {
                                modelData.scene = element.checks;
                                modelData.scenetype = element.type;
                                break;
                            }
                        }
                        modelData.isinit = true;
                        if (modelName === "UtilBarn_Lobby") {
                            UtilBarn.Action.FeedBack._lobbyModel = modelData;
                        } else {
                            UtilBarn.Action.FeedBack._editorModel = modelData;
                        }
                        success(modelData);
                    } else {
                        var err1 = new Object();
                        err1.error = "NOModel";
                        error(err1);
                    }
                }
            };
            api.GetModelData(modelName, succ, error);
        },

        /**
       * 提交反馈内容
       * @param {string} modelName 模板名称（唯一）
       * @param {string} contact 联系方式
       * @param {string} feedback_type 反馈类型
       * @param {string} content 反馈内容(固定的)
       * @param {Array<string>} scene 反馈场景 
       * @param {string} subscript 反馈详情
       * @param {Array<string>} screenshot 截图
       * @param {Function} success 成功回调,带服务端返回对象
       * @param {Function} error 出错回调
       */
        PostFeedBack: function (modelName, contact, feedback_type, content, scene, subscript, screenshot, success, error) {
            var model_id = "";
            if (modelName === "UtilBarn_Lobby") {
                model_id = UtilBarn.Action.FeedBack._lobbyModel.model_id;
            }
            else {
                model_id = UtilBarn.Action.FeedBack._editorModel.model_id;
            }

            api.PostFeedBack(model_id, contact, feedback_type, content, scene, subscript, screenshot, success, error);
        },

        /**
        * 获取反馈列表
        * @param {int} page 页码（1~）
        * @param {Function} success 成功回调,带服务端返回对象  
        * @param {Function} error 出错回调
        */
        GetFeedBacks: function (page, success, error) {
            var succ = function (dataObj) {
                var backs = new Object();
                backs.count = dataObj.count;
                backs.items = [];

                dataObj.items.forEach(function (element) {
                    var feedData = new Object();
                    feedData.id = element.id;
                    feedData.model_id = element.model_id;
                    feedData.scene = element.model_field.scene;
                    feedData.feedback_type = element.feedback_type;
                    feedData.content = element.model_field.subscript;
                    feedData.status = element.status;
                    feedData.reply_status = element.reply_status;
                    feedData.date_created = element.date_created;
                    feedData.last_reply_time = element.last_reply_time;
                    feedData.screenshot = element.model_field.screenshot;
                    backs.items.push(feedData);
                });
                success(backs);
            };
            api.GetFeedBacks(page, succ, error);
        },

        /**
        * 获取是否有未回复的反馈
        * @param {Function} success 成功回调,带服务端返回对象  
        * @param {Function} error 出错回调
        */
        GetUnReplyFeedBacks:function(success, error){
            var succ = function (dataObj) {
                var isAllReply = true;
                if (dataObj.count > 0) {
                    isAllReply = false;
                }
                success(isAllReply);
            };
            api.GetUnReplyFeedBacks(1, succ, error);
        },

        /**
         * 刷新反馈已读状态
         * @param {string} feedback_id 反馈信息的id
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        RefreshFeedBackState: function (feedback_id, success, error) {
            api.RefreshFeedBackState(feedback_id, success, error);
        },

        /**
        * 获取反馈回复列表
        * @param {string} feedback_id 反馈信息的id
        * @param {int} page 页码（1~）
        * @param {Function} success 成功回调,带服务端返回对象 ,带参数
        * @param {Function} error 出错回调
        */
        GetFeedBackReply: function (feedback_id, page, success, error) {
            var succ = function (dataObj) {
                var replyBacks = new Object();
                replyBacks.count = dataObj.count;
                replyBacks.replys = [];
                dataObj.items.forEach(function (element) {
                    var replyData = new Object();
                    replyData.id = element.id;
                    replyData.feedback_id = element.feedback_id;
                    replyData.content = element.content;
                    replyData.reply_time = element.reply_time;
                    replyData.reply_uid = element.reply_uid;
                    replyData.type = element.type;
                    replyBacks.replys.push(replyData);
                });
                success(replyBacks);
            };
            api.GetFeedBackReply(feedback_id, page, succ, error);
        },
        /**
        * 提交反馈回复
        * @param {string} feedback_id 反馈信息的id
        * @param {string} content 反馈的内容
        * @param {Function} success 成功回调,带服务端返回对象
        * @param {Function} error 出错回调
        */
        PostFeedBackReply: function (feedback_id, content, success, error) {
            api.PostFeedBackReply(feedback_id, content, success, error);
        }

    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn.Action, "FeedBack"));