//UtilBarn 浏览器检测提示
(function (namespace, className) {
    var module = function (title, content) {
        var url = UtilBarn.ComponentRootPath + "UtilBarn/page/error.html";
        url = UtilBarn.SetQueryString("Title", title || UtilBarn.GetTip("ERROR_NotSupport_Title"), url);
        url = UtilBarn.SetQueryString("Content", content || UtilBarn.GetTip("ERROR_NotSupport_Content"), url);
        url = UtilBarn.SetQueryString("Page", location.href, url);
        location.href = url;
    };

    //if (UtilBarn.Platform.IsIE) {
    //    UtilBarn.GotoErrorPage();
    //}

    //window.onerror = function () {
    //    UtilBarn.GotoErrorPage();
    //};

    //var error = console.error;

    //console.error = function () {
    //    UtilBarn.GotoErrorPage();
    //};

    //window.setTimeout(function () {
    //    console.error = error;
    //}, 10000);

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "GotoErrorPage"));