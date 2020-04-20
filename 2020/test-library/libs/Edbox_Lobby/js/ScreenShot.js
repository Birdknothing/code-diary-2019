(function (namespace, className) {
    var module = {
        /**
         * 获取游戏的截图库
         * @param {Object} datas 数据
         *          {String} gameID 游戏ID
         *          {Number} ListType 要获取的截图列表的类型 1:所有截图 2:系统截图 3:手动截图 默认值为1
         *          {String} page 页数 可为空 为空默认获取所有
         *          {String} size 每页数量 可为空 为空默认获取所有
         * @param {function} success 成功回调 参数为Data对象
         *                  {
         *                     total: Number
         *                     items: Array [{id:截图编号,guid:截图guid,url:资源地址,type:截图埋点类型}]
         *                  }
         * @param {function} error 失败回调
         */
        GetList: function (datas, success, error) {
            Edbox.ScreenShot.GetList(datas.gameID, datas.ListType, success, error, datas.page, datas.size, true);
        },
        /**
         * 删除截图接口
         * @param {Object} datas 数据
         *                {Object} screenshotData 截图信息
         *                {String} gameID 游戏Id 
         * @param {function} success 成功回调 参数为Data对象
         *                  {
         *                     total: Number
         *                     items: Array [{id:截图编号,guid:截图guid,url:资源地址,type:截图埋点类型}]
         *                  }
         * @param {function} error 失败回调
         */
        Delete: function (datas, success, error) {
            Edbox.ScreenShot.Delete(datas.screenshotData, datas.gameID, success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Lobby, "ScreenShot"));