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

    var v = "?v=201908021646";

    function InitRequire(url) {
        InitRequire_Load(ComponentRootPath + url + v);
    }

    // InitRequire方法调用进行打包
    InitRequire("UtilBarn/js/UtilBarn.js");
    InitRequire("UtilBarn_Editor/js/UtilBarn_Editor.js");
    InitRequire("UtilBarn_Editor/js/UtilBarn_EditorHelp.js");
    InitRequire("UtilBarn_FeedBack/js/UtilBarn_FeedBack.js");
    InitRequire("UtilBarn_WebSocket/js/UtilBarn_WebSocket.js");

}(window));