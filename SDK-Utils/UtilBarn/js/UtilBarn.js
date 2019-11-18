/// 加载依赖组件，3斜杠开始，接下来的数据不会被打包
(function (module) {
    var ComponentRootPath = "";

    /**
     * 初始化组件路径
     * @param {Object} com 组件对象
     */
    function InitPath(com) {
        var scripts = document.scripts;
        var path = scripts[scripts.length - 1].src;
        path = path.substring(0, path.lastIndexOf("/"));
        path = path.substring(0, path.lastIndexOf("/") + 1);
        path = path.substring(0, path.lastIndexOf("/"));
        path = path.substring(0, path.lastIndexOf("/") + 1);
        ComponentRootPath = path;
    }

    /**
     * 初始化需求组件
     * @param {String} path 组件路径
     * @param {Boolean} condition 是否已加载
     * @param {String} onload 加载完事件
     */
    function InitRequire_Load(path, condition, onload) {
        function load() {
            document.write('<script src="' + path + '" type="text/javascript"><\/script>');
            if (onload) {
                document.write('<script type="text/javascript">' + onload + '<\/script>');
            }
        }
        if (condition || condition === null || condition === undefined) {
            load();
        }
        else {
            if (onload) {
                document.write('<script type="text/javascript">' + onload + '<\/script>');
            }
        }
    }

    // 初始化路径
    InitPath();

    var v = "?v=201910160918";

    function InitRequire(url) {
        InitRequire_Load(ComponentRootPath + url + v);
    }

    // InitRequire方法调用进行打包
    InitRequire("UtilBarn/js/UtilBarn.Base.js");
    InitRequire("UtilBarn/js/UtilBarn.LocationLoad.js");
    InitRequire("UtilBarn/js/UtilBarn.Fixed.js");
    InitRequire("UtilBarn/js/UtilBarn.List.js");
    InitRequire("UtilBarn/js/UtilBarn.Dictionary.js");
    InitRequire("UtilBarn/js/UtilBarn.Require.js");

    InitRequire("UtilBarn/js/UtilBarn.Ext.js");
    InitRequire("UtilBarn/js/UtilBarn.Cookie.js");
    InitRequire("UtilBarn/js/UtilBarn.DataSet.js");

    InitRequire("UtilBarn/js/UtilBarn.Tips.js");
    InitRequire("UtilBarn/js/UtilBarn.Host.js");
    InitRequire("UtilBarn/js/UtilBarn.Check.js");
    InitRequire("UtilBarn/js/UtilBarn.ThirdPartyLogin.js");
    InitRequire("UtilBarn/js/UtilBarn.Components.js");
    InitRequire("UtilBarn/js/UtilBarn.FunctionCall.js");

    InitRequire("ThirdParty/jquery/Jquery.js");

    InitRequire("UtilBarn/Compononet/CryptoJS.js");
    InitRequire("UtilBarn/Compononet/Request.js");
    InitRequire("UtilBarn/Compononet/Platform.js");
    InitRequire("UtilBarn/Compononet/DataStatistic.js");
    InitRequire("UtilBarn/Compononet/DownLoad.js");
    InitRequire("UtilBarn/Compononet/Share.js");

    InitRequire("UtilBarn/Api/MMO.js");
    InitRequire("UtilBarn/Api/UC.js");
    InitRequire("UtilBarn/Api/CS.js");
    InitRequire("UtilBarn/Api/IM.js");
    InitRequire("UtilBarn/Api/NDR.js");
    InitRequire("UtilBarn/Api/FrontendLib.js");
    InitRequire("UtilBarn/Api/NewFrontendLib.js");
    InitRequire("UtilBarn/Api/FeedBack.js");

    InitRequire("UtilBarn/Api/Ranking.js");
    InitRequire("UtilBarn/Action/Ranking.js");
    InitRequire("UtilBarn/Compononet/Ranking.js");

    InitRequire("UtilBarn/Action/User.js");
    InitRequire("UtilBarn/Action/UC.js");
    InitRequire("UtilBarn/Action/FeedBack.js");

    InitRequire("UtilBarn/Compononet/MMO.js");
    InitRequire("UtilBarn/Compononet/MaskCutting.js");
    InitRequire("UtilBarn/Compononet/Message.js");
    InitRequire("UtilBarn/Compononet/QRCode.js");
    InitRequire("UtilBarn/Compononet/FrontendLib.js");
    InitRequire("UtilBarn/Compononet/NewFrontendLib.js");
    InitRequire("UtilBarn/Compononet/NDR.js");
    InitRequire("UtilBarn/Compononet/Resource.js");
    InitRequire("UtilBarn/Compononet/FrameAnimation.js");
    InitRequire("UtilBarn/Compononet/WindowEvent.js");
    InitRequire("UtilBarn/Compononet/Package.js");
    InitRequire("UtilBarn/Compononet/EbService.js");
    InitRequire("UtilBarn_WebSocket/js/UtilBarn_WebSocket.js");
    InitRequire("UtilBarn/Compononet/Loading.js");

    InitRequire("UtilBarn/js/UtilBarn.Init.js");

}(window));