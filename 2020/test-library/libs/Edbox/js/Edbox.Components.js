// 组件集合
(function (namespace, className) {
    /**
     * 记录组件集
     */
    var coms = new Object();

    /**
     * 已加载的组件集
     */
    var loadedComs = new Object();

    /**
     * 等待Start的组件集
     */
    var waitStartComs = new Object();

    /**
     * 组件集合
     */
    var module = {
        /**
         * 记录组件
         * @param {String} name 组件名称
         * @param {Object} com 组件
         */
        Add: function (name, com) {
            coms[name] = com;
        },
        /**
         * 获取已记录组件
         * @param {String} name 组件名称
         * @returns {Object} 已记录组件
         */
        Get: function (name) {
            return coms[name];
        },
        /**
         * 组件是否已记录
         * @param {String} name 组件名称
         * @returns {Boolean} 是否已记录
         */
        Contain: function (name) {
            if (coms[name]) {
                return true;
            }
            return false;
        },
        /**
         * 组件是否已加载
         * @param {String} name 组件名称
         * @returns {Boolean} 是否已记录
         */
        IsLoaded: function (name) {
            if (loadedComs[name]) {
                return true;
            }
            return false;
        },

        /**
         * 等待启动事件执行
         * @param {String} name 组件名称
         * @param {Function} startEvent 启动事件
         */
        WaitStart: function (name, startEvent) {
            if (!coms[name]) return;
            waitStartComs[name] = startEvent;
        },
        /**
         * 组件加载完成记录
         * @param {String} name 组件名称
         */
        LoadOK: function (name) {
            if (!coms[name]) return;
            loadedComs[name] = coms[name];
        },
        /**
         * 组件卸载完成记录
         * @param {String} name 组件名称
         */
        UnloadOK: function (name) {
            if (coms[name]) {
                delete coms[name];
            }
            if (waitStartComs[name]) {
                delete waitStartComs[name];
            }
            if (loadedComs[name]) {
                delete loadedComs[name];
            }
        },

        /**
         * 执行所有记录组件的Start方法
         */
        Start: function () {
            var keys = Object.keys(waitStartComs);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                waitStartComs[key]();
            }
            waitStartComs = new Object();
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Components"));

// 编辑器组件集合
(function (namespace, className) {
    /**
     * 记录编辑器组件集
     */
    var coms = new Object();

    /**
     * 组件集合
     */
    var module = {
        /**
         * 记录编辑器组件
         * @param {String} name 编辑器组件名称
         * @param {Object} com 编辑器组件
         */
        Add: function (name, com) {
            coms[name] = com;
        },
        /**
         * 编辑器组件是否已记录
         * @param {String} name 编辑器组件名称
         * @returns {Boolean} 是否已记录
         */
        Contain: function (name) {
            if (coms[name]) {
                return true;
            }
            return false;
        },

        /**
         * 执行所有记录组件的Save方法
         * @param {Object} datas 数据集
         * @param {Function} callback 回调
         */
        Save: function (datas, callback) {
            var keys = Object.keys(coms);

            function handle(data, i) {
                if (i >= keys.length) {
                    if (callback) {
                        callback(datas);
                    }
                    return;
                }

                var key = keys[i];
                if (coms[key].Save) {
                    coms[key].Save(data, function (newData) {
                        handle(newData, i + 1);
                    });
                }
                else {
                    handle(data, i + 1);
                }
            }

            handle(datas, 0);
        },
        /**
         * 执行所有记录组件的SaveAs方法
         * @param {Object} datas 数据集
         * @param {Function} callback 回调
         */
        SaveAs: function (datas, callback) {
            var keys = Object.keys(coms);

            function handle(data, i) {
                if (i >= keys.length) {
                    if (callback) {
                        callback(datas);
                    }
                    return;
                }

                var key = keys[i];
                if (coms[key].SaveAs) {
                    coms[key].SaveAs(data, function (newData) {
                        handle(newData, i + 1);
                    });
                }
                else {
                    handle(data, i + 1);
                }
            }

            handle(datas, 0);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "EditorComponents"));

// 组件加载
(function (namespace, className) {
    /**
     * 回调集合
     */
    var callbacks = new Object();

    var v = new Date().setSeconds(0, 0) / 10000;

    /**
     * 组件加载
     * @param {String} com 组件名称
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     * */
    var module = function (com, success, error) {
        if (namespace.Components.IsLoaded(com)) {
            if (success) {
                success();
            }
            return;
        }

        if (callbacks[com]) {
            var temp = callbacks[com];
            callbacks[com] = function () {
                temp();
                if (success) {
                    success();
                }
            };

            return;
        }
        callbacks[com] = function () {
            namespace.Components.LoadOK(com);
            if (success) {
                success();
            }
            delete callbacks[com];
        };

        function loadOK() {
            if (callbacks[com]) {
                callbacks[com]();
            }
        }

        Require(namespace.RootPath + "coms/" + com + "/index.js" + "?v=" + v, function () {
            if (!namespace[com]) {
                if (error) {
                    error("Component Load Error");
                }
                return;
            }

            namespace.Components.Add(com, namespace[com]);

            if (namespace[com].Init) {
                namespace[com].Init(loadOK);
            }

            if (namespace[com].Start) {
                if (namespace.IsLogin) {
                    namespace[com].Start(loadOK);
                }
                else {
                    namespace.Components.WaitStart(com, loadOK);
                }
            }

            if (!namespace[com].Init && !namespace[com].Start) {
                loadOK();
            }
        }, error);
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Load"));

// 编辑器组件加载
(function (namespace, className) {
    /**
     * 回调集合
     */
    var callbacks = new Object();

    /**
     * 编辑器组件加载，同时加载基础组件
     * @param {String} com 组件名称
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     * */
    var module = function (com, success, error) {
        if (!namespace.Editor) {
            if (error) {
                error("Editor Component must be loaded in the editor");
            }
            return;
        }

        if (namespace.EditorComponents.Contain(com)) {
            if (success) {
                success();
            }
            return;
        }

        if (callbacks[com]) {
            var temp = callbacks[com];
            callbacks[com] = function () {
                temp();
                if (success) {
                    success();
                }
            };

            return;
        }
        callbacks[com] = function () {
            if (success) {
                success();
            }
            delete callbacks[com];
        };

        function loadOK() {
            if (callbacks[com]) {
                callbacks[com]();
            }
        }

        function load() {
            Require(namespace.RootPath + "coms/" + com + "/editor.js", function () {
                if (!namespace.Editor[com]) {
                    if (error) {
                        error("Editor Component Load Error");
                    }
                    return;
                }

                namespace.EditorComponents.Add(com, namespace.Editor[com]);

                loadOK();
            }, error);
        }

        namespace.Load(com, function () {
            load();
        }, error);
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "LoadEditor"));

// 组件卸载
(function (namespace, className) {
    /**
     * 回调集合
     */
    var callbacks = new Object();

    var v = new Date().setSeconds(0, 0) / 10000;

    /**
     * 组件卸载
     * @param {String} com 组件名称
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     * */
    var module = function (com, success, error) {
        if (!namespace.Components.Contain(com)) {
            if (error) {
                error("Component Not Loaded");
            }
            return;
        }

        if (callbacks[com]) {
            var temp = callbacks[com];
            callbacks[com] = function () {
                temp();
                if (success) {
                    success();
                }
            };

            return;
        }
        callbacks[com] = function () {
            namespace.Components.UnloadOK(com);
            delete namespace[com];
            if (success) {
                success();
            }
            delete callbacks[com];
        };

        function disposeOK() {
            if (callbacks[com]) {
                callbacks[com]();
            }
        }

        Require.Unload(namespace.RootPath + "coms/" + com + "/index.js" + "?v=" + v);

        if (namespace[com].Dispose) {
            namespace[com].Dispose(disposeOK);
        }
        else {
            disposeOK();
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Unload"));

// 组件重新加载
(function (namespace, className) {
    /**
     * 组件重新加载
     * @param {String} com 组件名称
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     * */
    var module = function (com, success, error) {
        function load() {
            namespace.Load(com, success, error);
        }

        namespace.Unload(com, load, load);
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Reload"));