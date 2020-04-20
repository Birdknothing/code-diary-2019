/**
 * 重定向处理方法
 */
var Redirect = {
    /**
     * 队列对象
     */
    List: null,

    /**
     * 数据连接字典
     */
    Link: new Dictionary(),

    /**
     * 设置重定向
     * @param {string} path 原路径
     * @param {string} newpath 新路径
     */
    Set: function (path, newpath) {
        if (!Redirect.List) return;

        var data = new Object();
        data.Path = path;
        var url = newpath.replace(/http:\/\//g, "").replace(/https:\/\//g, "");
        url = url.substr(url.indexOf("/"));
        url = encodeURI(url);
        data.NewPath = url;

        if (Redirect.Link.ContainsKey(data.Path)) {
            Redirect.Link.Get(data.Path).NewPath = data.NewPath;
        }
        else {
            Redirect.List.push(data);
        }
        Redirect.Link.Set(data.Path, data);
    },

    /**
     * 初始化重定向队列对象
     * @param {string} list 队列对象
     */
    Init: function (list) {
        Redirect.List = list;
        if (!list || list.length <= 0) return;
        for (var i = 0; i < list.length; i++) {
            Link.Set(list[i].Path, list[i]);
        }
    }
};