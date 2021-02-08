//Edbox 通用组件初始化
(function (module) {
    /**
     * 初始化服务器关键字
     */
    function InitServerKey() {
        var host = window.location.hostname.replace("component", "").replace("game", "").replace("api", "");
        var keys = Object.keys(module.Host.Game);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var temphost = module.Host.Game[key].replace("component", "").replace("game", "").replace("api", "");
            if (host.indexOf(temphost) >= 0) {
                module.ServerKey = key;
                return;
            }
        }

        host = window.location.hostname;

        function Test(obj) {
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (host === obj[key]) {
                    module.ServerKey = key;
                    return true;
                }
            }
        }

        if (Test(module.Host.Login)) return;

        host = module.ComponentRootPath;
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            var temp = module.Host.Game[key].replace("component", "").replace("game", "").replace("api", "");
            if (host.indexOf(temp) > 0) {
                module.ServerKey = key;
                return;
            }
        }

        module.ServerKey = "BetaCN";
    }

    // 处理移动端 HTTPS打开HTTP无法返回的问题 
    function PopstateEvent() {
        window.addEventListener("popstate", function (e) {
            var window = e.target;
            if (window !== window.top) {
                var data = new Object();
                data.Type = "popstate";
                window.top.postMessage(data, "*");
            }
        }, false);
    }

    if (module) {
        InitServerKey();
        module.Init();
        Edbox.InitRequire(Edbox.ComponentRootPath + "Config/AppConfig.js?v=" + new Date().getTime());
        Edbox.Load("Loading");
        PopstateEvent();
    }
}(Edbox));