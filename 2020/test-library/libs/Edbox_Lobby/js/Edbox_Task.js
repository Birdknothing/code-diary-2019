// Edbox 粘合层接口， 提供给网编使用， 所有接口必须写ts
(function (namespace, className) {
    /**
     * Edbox 粘合层接口， 提供给网编使用， 所有接口必须写ts
     * 用于Edbox平台大厅任务模块的业务逻辑
     * @author 余晓(871129)
     * */
    var module = {
        /**
         * 是否有可接任务
         * @param {any} data 无意义
         * @param {Function} success 成功回调函数，返回是否有可接任务状态,如果没有则附带“暂无可接任务”
         * @param {Function} error
         */
        IsGetNewTask: function (data,success, error) {
            Edbox.LobbyService.IsGetNewTask(function (data) {
                if (success) success(data);
            });
        },
        /**
         * 获取经验和等级
         * @param {any} data 无意义
         * @param {Function} success 成功回调函数，带一个有用户经验和等级的数据
         * @param {Function} error
         */
        GetUserExp: function (data,success, error) {
            Edbox.LobbyService.GetUser(function (data) {
                if (success) success(data);
            }, function (e) {
                if (error) error("获取经验等级失败");
            });
        },
        /**
         * 分享完成任务到IM
         * @param {Object} data {
         *                {String} appId 作品id
         *                {String} receiver 接收玩家ID
         *                {String} appName 产品名称
         *                {String} appDesc 产品简介
         *                {number} access 访问类型  1-模板 2-个人库 3-体验库
         *                {number} get_type 0-显示需求，1-移动端H5试玩，2-分享需求 ，3-移动端编辑器，4-体验区游戏（移动端），5-PC端编辑器，6-体验区游戏（PC端），7-PC端H5试玩
         *                {String} version 版本
         *                {String} iconUrl 作品icon链接地址
         * }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ShareTaskToIM: function (data,success, error) {
            Edbox.Share.ShareApp2IM(data, success, error);
        }
    };


    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }

}(Edbox.Lobby, "Task"));