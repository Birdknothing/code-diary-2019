// 子窗口加载回调
(function (namespace, className) {
    /**
     * 向上层窗口发送当前URL
     */
    function PostLocationLoad() {
        if (window.parent !== null) {
            var data = new Object();
            data.Type = "LocationLoad";
            data.Url = location.href;
            data.Host = location.host;
            window.parent.postMessage(data, "*");
        }
    }

    function ListenLocationLoad() {
        // 消息回调
        function messageCallBack(e) {
            var window = e.source;
            var data = e.data;
            if (data && data.Type === "LocationLoad") {
                var type = "Game";
                var url = data.Url;
                if (url.indexOf("studio") >= 0) {
                    type = "Studio";
                }
                else if (url.indexOf("editor") >= 0) {
                    type = "Editor";
                }

                if (namespace[className]) {
                    namespace[className](window, url, type);
                }
            }
        }

        window.addEventListener("message", messageCallBack, false);
    }

    PostLocationLoad();

    ListenLocationLoad();

    /**
     * 子窗口加载回调
     * @param {Object} window 窗口
     * @param {String} url 子页面URL
     * @param {String} type 类型，Studio(大厅)、Editor(编辑器)、Game(游戏)
     */
    var module = function (window, url, type) {
        console.log(["子窗口加载回调", window, url, type]);
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "LocationLoad"));