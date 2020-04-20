// Edbox MMO服务端接口v0.1组件
(function (namespace, className) {
    var module = {
        /**
         * 试玩接口
         * @param {String} app_id 作品id
         * @param {int} access_type 获取类型 1-模板库  2-个人库 3-作品库
         * @param {int} get_type 0-显示需求，1-移动端H5试玩，2-分享需求 ，3-移动端编辑器，4-体验区游戏（移动端），5-PC端编辑器，6-体验区游戏（PC端），7-PC端H5试玩
         * @param {String} version 版本号,为空取最新版本
         * @param {Function} success 成功回调,带服务端返回对象
         * @param {Function} error 出错回调
         */
        GetTryPlayingInfo: function (app_id, access_type, get_type, version, success, error) {
            Edbox.Api.MMO.GetTryPlayingInfo(app_id, access_type, get_type, version, function (appResInfo) {
                // PC优先采用web pc 版本的链接
                if (Edbox.Platform.IsPC) {
                    appResInfo.web_resid = appResInfo.web_pc_resid ? appResInfo.web_pc_resid : appResInfo.web_resid;
                }
                else {
                    // 移动端优先采用web 移动端 版本的链接
                    appResInfo.web_resid = appResInfo.web_resid ? appResInfo.web_resid : appResInfo.web_pc_resid;
                }
                if (success) success(appResInfo);
            }, error);
        }

    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Action, "MMO"));