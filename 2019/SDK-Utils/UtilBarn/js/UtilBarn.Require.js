// 加载依赖模块
(function (namespace, className) {
    /**
     * 依赖项的回调队列
     */
    var requires = new Dictionary();

    /**
     * 依赖加载模块
     * @param {String} url 依赖的组件路径
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    function Load(url, success, error) {
        function callback() {
            if (success) success();
        }

        if (!url || url.trim().length < 1) {
            callback();
            return;
        }

        var scripts = document.scripts;
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src === url) {
                callback();
                return;
            }
        }

        if (requires.ContainsKey(url)) {
            var func = requires.Get(url);
            var newfunc = function () {
                callback();
                if (func) {
                    func();
                }
            };
            requires.Set(url, newfunc);
            return;
        }

        requires.Set(url, callback);

        var cnt = 0;

        function load() {
            if (cnt >= 3) {
                if (error) {
                    error();
                }
                return;
            }

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = function () {
                var func = requires.Get(url);
                requires.Remove(url);
                if (func) {
                    func();
                }
            };

            script.onerror = function () {
                script.remove();
                cnt += 1;
                load();
            };

            document.head.appendChild(script);
        }

        load();
    }

    /**
     * 加载依赖模块
     * @param {any} require 依赖的组件列表
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     */
    var module = function (require, success, error) {
        var self = this;

        // 成功回调
        function callback() {
            if (success) success();
        }

        // 失败回调
        function errorCallback() {
            self.Stop();
            if (error) error();
        }

        // 无需加载
        if (!require) {
            callback();
            return;
        }

        // String 转 Array
        if (typeof require === "string") {
            require = [require];
        }

        // 无需加载
        if (!require.length) {
            callback();
            return;
        }

        function load(url) {
            Load(url, function () {
                var index = require.indexOf(url);
                if (index > -1) {
                    require.splice(index, 1);
                }
            }, errorCallback);
        }

        var list = new Array();
        for (var i = 0; i < require.length; i++) {
            var obj = require[i];
            list.push(obj);
        }

        for (var j = 0; j < list.length; j++) {
            var url = list[j];
            load(url);
        }

        var loading = setInterval(function () {
            if (require.length > 0) return;
            clearInterval(loading);
            callback();
        }, 100);

        this.Stop = function () {
            clearInterval(loading);
        };
    };

    /**
     * 卸载已加载的组件
     * @param {any} coms 组件列表
     */
    module.Unload = function (coms) {
        // String 转 Array
        if (typeof coms === "string") {
            coms = [coms];
        }

        for (var j = 0; j < coms.length; j++) {
            var url = coms[j];
            var scripts = document.scripts;
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src === url) {
                    scripts[i].parentNode.removeChild(scripts[i]);
                }
            }
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(window, "Require"));