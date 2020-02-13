//UtilBarn 通用组件初始化
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

        module.ServerKey = "QA";
    }

    if (module) {
        InitServerKey();
        module.Init();
    }
}(UtilBarn));