// Edbox IM用户反馈平台组件
(function (namespace, className) {

    var action = Edbox.Action.FeedBack;

    /**
     * Edbox IM用户反馈平台组件
     * 用于Edbox向IM用户反馈平台信息
     * @author 张涛（120100）
     * */
    var module = {
        /**
             * 获取大厅反馈模板
             * @param {Object} data {modelName 模板标识名称}
             * @param {Function} success 成功回调
             * @param {Function} error 失败回调
             */
        GetModelData: function (data, success, error) {
            action.GetModelData(data.modelName, success, error);
        },

        /**
         * 提交大厅反馈内容
         * @param {Object} data {
         * 				{string}modelName 模板标识名称
         * 				{string}contact:联系方式 
         * 				{string}feed_type:反馈类型
         * 				{string} content 反馈内容(固定的)
         * 				{Array<string>} scene 反馈场景 
         * 				{string} subscript 反馈详情
         * 				{Array<string>} screenshot 截图}
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        PostFeedBack: function (data, success, error) {
            action.PostFeedBack(data.modelName, data.contact, data.feed_type, data.content, data.scene, data.subscript, data.screenshot, success, error);
        },

        /**
         * 获取反馈列表
         * @param {Object} data {
         * 				{int} page 页码（1~）}
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        GetFeedBacks: function (data, success, error) {
            action.GetFeedBacks(data.page, success, error);
        },

        /**
         * 获取反馈回复列表
         * @param {Object} data {
         * 				{string} feedback_id 反馈信息的id
         * 				{int} page 页码（1~）}
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        GetFeedBackReply: function (data, success, error) {
            action.GetFeedBackReply(data.feedback_id, data.page, success, error);
        },

        /**
        * 获取是否有未回复的反馈
        * @param {int} data {}
        * @param {Function} success 成功回调,带服务端返回对象  
        * @param {Function} error 出错回调
        */
        GetUnReplyFeedBacks:function(data,success, error){
            action.GetUnReplyFeedBacks(success, error);
        },

        /**
         * 刷新反馈已读状态
         * @param {Object} data {
         * 				{string} feedback_id 反馈信息的id}}
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        RefreshFeedBackState: function (data, success, error) {
            action.RefreshFeedBackState(data.feedback_id, success, error);
        },

        /**
         * 提交反馈回复
         * @param {Object} data {
         * 				{string} feedback_id 反馈信息的id
         * 				{string} content 反馈的内容}
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        PostFeedBackReply: function (data, success, error) {
            action.PostFeedBackReply(data.feedback_id, data.content, success, error);
        },

        /**
         * 上传反馈截屏TOCs
         * @param {Object} data {
         * 				{Object} file 反馈信息的id
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        UploadImageToCS: function (data, success, error) {
            action.UploadImageToCS(data.file, success, error, function () { });
        },

        /**
         * 上传反馈截屏TOCs
         * @param {Object} data {
         * 				{string} dentry_id 反馈信息的id
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        GetCSImageUrl: function (data, success) {
            var csData = action.GetCSImageUrl(data.dentry_id);
            if (success) {
                success(csData);
            }
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "FeedBack"));