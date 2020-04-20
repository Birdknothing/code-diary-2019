//Edbox 浏览器检测提示
(function (namespace, className) {
    var module = function (title, content) {
        var url = Edbox.ComponentRootPath + "Edbox/page/error.html";
        url = Edbox.SetQueryString("Title", title || Edbox.GetTip("ERROR_NotSupport_Title"), url);
        url = Edbox.SetQueryString("Content", content || Edbox.GetTip("ERROR_NotSupport_Content"), url);
        url = Edbox.SetQueryString("Page", location.href, url);
        location.href = url;
    };

    //if (Edbox.Platform.IsIE) {
    //    Edbox.GotoErrorPage();
    //}

    //window.onerror = function () {
    //    Edbox.GotoErrorPage();
    //};

    //var error = console.error;

    //console.error = function () {
    //    Edbox.GotoErrorPage();
    //};

    //window.setTimeout(function () {
    //    console.error = error;
    //}, 10000);

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "GotoErrorPage"));