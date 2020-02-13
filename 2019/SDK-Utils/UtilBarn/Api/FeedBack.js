// UtilBarn IM用户反馈平台组件
(function (namespace, className) {
    /**
     * 转换语言
     * @param {String} language 平台语言
     * @returns {String} 语言关键字
     */
    function TransferLanguage(language) {
        if (language) {
            if (language === "English") {
                return "en";
            }
            else if (language === "SimplifiedChinese") {
                return "zh-CN";
            }
            else if (language === "TraditionalChinese") {
                return "zh-HK";
            }
            else if (language === "TraditionalChinese_TW") {
                return "zh-TW";
            }
        }
        return "zh-CN";
    }

    /**
     * Get请求
     * @param {String} url Url
     * @param {String} data 数据 
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    function FeedBackGet(url, data, success, error) {
        var header = new Object();
        header["vorg"] = "UtilBarn";
        header["accept-language"] = TransferLanguage(UtilBarn.Language);
        UtilBarn.Request.GetWithHeader(UtilBarn.GetHost("FeedBack"), url, data, header, success, error, "https");
    }

    /**
     * Post请求
     * @param {String} url Url
     * @param {String} data 数据 
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    function FeedBackPost(url, data, success, error) {
        var header = new Object();
        header["vorg"] = "UtilBarn";
        header["accept-language"] = TransferLanguage(UtilBarn.Language);
        UtilBarn.Request.PostWithHeader(UtilBarn.GetHost("FeedBack"), url, data, header, success, error, "https");
    }

    /**
     * Post请求
     * @param {String} url Url
     * @param {String} data 数据 
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    function FeedBackPatch(url, data, success, error) {
        var header = new Object();
        header["vorg"] = "UtilBarn";
        header["accept-language"] = TransferLanguage(UtilBarn.Language);
        UtilBarn.Request.PatchWithHeader(UtilBarn.GetHost("FeedBack"), url, data, header, success, error, "https");
    }

    /**
     * UtilBarn IM用户反馈平台组件
     * 用于UtilBarn向IM用户反馈平台信息
     * @author 张涛(120100) Review By 温荣泉(201901)
     * */
    var module = {
        /**
         * 获取大厅反馈模板
         * @param {string} modelName 模板名称（唯一）
         * @param {Function} success 编辑器反馈模板
         * @param {Function} error 卸载反馈模板
         */
        GetModelData: function (modelName, success, error) {
            var app_name = modelName;
            var data = "filter=" + "app_name eq " + app_name + " and disable eq false";
            data = encodeURI(data);
            FeedBackGet("/v0.1/c/models", data, success, error);
        },

        /**
        * 提交反馈内容
        * @param {string} model_id 模板名称（唯一）
        * @param {string} contact 联系方式
        * @param {string} feedback_type 反馈类型
        * @param {string} content 反馈内容(固定的)
        * @param {Array<string>} scene 反馈场景 
        * @param {string} subscript 反馈详情
        * @param {Array<string>} screenshot 截图
        * @param {Function} success 成功回调,带服务端返回对象
        * @param {Function} error 出错回调
        */
        PostFeedBack: function (model_id, contact, feedback_type, content, scene, subscript, screenshot, success, error) {
            var feedback = new Object();
            feedback.model_id = model_id;
            feedback.nick_name = UtilBarn.UserName;
            feedback.contact = contact;
            feedback.content = content;
            feedback.feedback_type = feedback_type;
            feedback.model_field = new Object();
            feedback.model_field.scene = scene;
            feedback.model_field.subscript = subscript;
            feedback.model_field.screenshot = screenshot;
            var data = JSON.stringify(feedback);
            FeedBackPost("/v0.1/c/feedbacks", data, function (suc) {

                // 云图埋点
                UtilBarn.DataStatistic.FeedBack();

                if (success) success(suc);
            }, error);
        },

        /**
         * 获取反馈列表
         * @param {int} page 页码（1~）
         * @param {Function} success 成功回调,带服务端返回对象  
         * @param {Function} error 出错回调
         */
        GetFeedBacks: function (page, success, error) {
            var offset = (page - 1) * 15;
            var data = "offset=" + offset + "&limit=15&count=true";

            FeedBackGet("/v0.1/c/feedbacks", data, success, error);
        },

        /**
         * 获取未查看回复的反馈列表
         * @param {int} page 页码（1~）
         * @param {Function} success 成功回调,带服务端返回对象  
         * @param {Function} error 出错回调
         */
        GetUnReplyFeedBacks: function (page, success, error) {
            var offset = (page - 1) * 15;
            var data = "offset=" + offset + "&limit=1&count=true" + "&filter=reply_status eq 1";
            data = encodeURI(data);
            FeedBackGet("/v0.1/c/feedbacks", data, success, error);
        },

        /**
         * 刷新反馈已读状态
         * @param {string} feedback_id 反馈信息的id
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        RefreshFeedBackState: function (feedback_id, success, error) {
            var url = "/v0.1/c/feedbacks/" + feedback_id + "/reply_status/actions/read";
            FeedBackPatch(url, null, success, error);
        },

        /**
        * 获取反馈回复列表
        * @param {string} feedback_id 反馈信息的id
        * @param {int} page 页码（1~）
        * @param {Function} success 成功回调,带服务端返回对象 ,带参数
        * @param {Function} error 出错回调
        */
        GetFeedBackReply: function (feedback_id, page, success, error) {
            var url = "/v0.1/c/feedbacks/" + feedback_id + "/replies";
            var offset = (page - 1) * 15;
            var data = "feedback_id=" + feedback_id + "&offset=" + offset + "&limit=15&count=true";
            FeedBackGet(url, data, success, error);
        },

        /**
        * 提交反馈回复
        * @param {string} feedback_id 反馈信息的id
        * @param {string} content 反馈的内容
        * @param {Function} success 成功回调,带服务端返回对象
        * @param {Function} error 出错回调
        */
        PostFeedBackReply: function (feedback_id, content, success, error) {
            var url = "/v0.1/c/feedbacks/" + feedback_id + "/replies";
            var reply = new Object();
            reply.content = content;
            var data = JSON.stringify(reply);
            FeedBackPost(url, data, success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn.Api, "FeedBack"));