// 消息调用
(function (namespace, className) {
    /**
     * 消息调用
     * @param {Object} e 消息数据
     */
    var module = function (e) {
        var from = e.source;
        var data = e.data;
        if (data && data.Type === "FunctionCall") {
            if (data.Datas.length !== 2) return;
            var func = new Function(data.Datas[1]);
            var ans = func();
            if (typeof ans === "object") {
                ans = JSON.parse(JSON.stringify(ans));
            }
            var ansData = {
                Type: data.Datas[0],
                Datas: [ans]
            };
            from.postMessage(ansData, "*");
        }
    };

    window.addEventListener("message", module, false);

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "FunctionCall"));