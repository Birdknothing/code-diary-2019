/**
 * UtilBarn文件保存组件
 * 可用于UtilBarn平台上文件的下载保存使用
 * @author 温荣泉(201901)
 * @version 1.0.0 (2019年4月4日)
 * Js需求:
 *      UtilBarn
 * */
UtilBarn.FileSaver = {
    /**
     * 保存
     * @param {Object} blob 二进制对象
     * @param {string} name 文件名称
     */
    Save: function (blob, name) {
        saveAs(blob, name);
    },

    /**
     * 保存文本
     * @param {string} text 文本内容
     * @param {string} name 文件名称
     */
    SaveText: function (text, name) {
        var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        saveAs(blob, name);
    }
};

// 初始化组件路径
UtilBarn.FileSaver.InitPath = function () {
    var js = document.scripts;
    var path = js[js.length - 1].src.substring(0, js[js.length - 1].src.lastIndexOf("/"));
    path = path.substring(0, path.lastIndexOf("/") + 1);
    UtilBarn.FileSaver.ComponentPath = path;
};
UtilBarn.FileSaver.InitPath();

// 初始化需求组件
UtilBarn.FileSaver.InitRequire = function () {
    function load(url) {
        console.log(url);
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = url;
        document.body.appendChild(script);
    }
    if ("undefined" === typeof saveAs) {
        load(UtilBarn.FileSaver.ComponentPath + "js/FileSaver.min.js");
    }
};
UtilBarn.FileSaver.InitRequire();