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
    InitRequire("Edbox/js/Edbox.Base.js");
    InitRequire("Edbox/js/Edbox.LocationLoad.js");
    InitRequire("Edbox/js/Edbox.Fixed.js");
    InitRequire("Edbox/js/Edbox.List.js");
    InitRequire("Edbox/js/Edbox.Dictionary.js");
    InitRequire("Edbox/js/Edbox.Require.js");

    InitRequire("Edbox/js/Edbox.Ext.js");
    InitRequire("Edbox/js/Edbox.Cookie.js");
    InitRequire("Edbox/js/Edbox.DataSet.js");

    InitRequire("Edbox/js/Edbox.Tips.js");
    InitRequire("Edbox/js/Edbox.Host.js");
    InitRequire("Edbox/js/Edbox.Check.js");
    InitRequire("Edbox/js/Edbox.ThirdPartyLogin.js");
    InitRequire("Edbox/js/Edbox.Components.js");
    InitRequire("Edbox/js/Edbox.FunctionCall.js");

    InitRequire("ThirdParty/jquery/Jquery.js");

    InitRequire("Edbox/Compononet/CryptoJS.js");
    InitRequire("Edbox/Compononet/Request.js");
    InitRequire("Edbox/Compononet/Platform.js");
    InitRequire("Edbox/Compononet/DataStatistic.js");
    InitRequire("Edbox/Compononet/DownLoad.js");
    InitRequire("Edbox/Compononet/Share.js");

    InitRequire("Edbox/Api/MMO.js");
    InitRequire("Edbox/Api/UC.js");
    InitRequire("Edbox/Api/CS.js");
    InitRequire("Edbox/Api/IM.js");
    InitRequire("Edbox/Api/NDR.js");
    InitRequire("Edbox/Api/FrontendLib.js");
    InitRequire("Edbox/Api/NewFrontendLib.js");
    InitRequire("Edbox/Api/FeedBack.js");
    InitRequire("Edbox/Api/DraftBox.js");
    InitRequire("Edbox/Api/Task.js");
    InitRequire("Edbox/Api/PrivateAssetApi.js");
    InitRequire("Edbox/Api/ScreenShot.js");

    InitRequire("Edbox/Api/Ranking.js");

    InitRequire("Edbox/Action/MMO.js");
    InitRequire("Edbox/Action/User.js");
    InitRequire("Edbox/Action/UC.js");
    InitRequire("Edbox/Action/FeedBack.js");
    InitRequire("Edbox/Action/Task.js");
    InitRequire("Edbox/Action/Ranking.js");

    InitRequire("Edbox/Compononet/MMO.js");
    InitRequire("Edbox/Compononet/MaskCutting.js");
    InitRequire("Edbox/Compononet/Message.js");
    InitRequire("Edbox/Compononet/QRCode.js");
    InitRequire("Edbox/Compononet/FrontendLib.js");
    InitRequire("Edbox/Compononet/NewFrontendLib.js");
    InitRequire("Edbox/Compononet/NDR.js");
    InitRequire("Edbox/Compononet/Resource.js");
    InitRequire("Edbox/Compononet/FrameAnimation.js");
    InitRequire("Edbox/Compononet/WindowEvent.js");
    InitRequire("Edbox/Compononet/Task.js");
    InitRequire("Edbox/Compononet/Package.js");
    InitRequire("Edbox/Compononet/EbService.js");
    InitRequire("Edbox_WebSocket/js/Edbox_WebSocket.js");
    InitRequire("Edbox_WebSocket/js/Edbox_Mqtt.js");
    InitRequire("Edbox/Compononet/ImageCollider.js");
    InitRequire("Edbox/Compononet/AudioHelpServer.js");
    //InitRequire("Edbox/Compononet/SdpWallet.js");
    //InitRequire("ThirdParty/wallet/sdpwalletsdk.js");
    InitRequire("Edbox/Compononet/OpusInfo.js");
    InitRequire("Edbox/Compononet/ScreenShot.js");
    InitRequire("Edbox/Compononet/Ranking.js");
    InitRequire("Edbox/Compononet/Vip.js");
    InitRequire("Edbox/Compononet/Thesaurus.js");
    InitRequire("Edbox/js/Edbox.Init.js");

}(window));