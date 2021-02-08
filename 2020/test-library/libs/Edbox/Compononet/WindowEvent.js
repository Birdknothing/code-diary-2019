// Edbox 窗口事件
(function (namespace, className) {
    /**
     * 显示窗口关闭提示
     */
    var ShowHint = false;

    /**
     * 退出事件集
     */
    var ExitEvents = new List();

    /**
     * 聚焦事件集
     */
    var FocusEvents = new List();

    /**
     * 失去聚焦事件集
     */
    var BlurEvents = new List();

    /**
     * 断网事件集
     */
    var OfflineEvents = new List();

    /**
     * 连接事件集
     */
    var OnlineEvents = new List();

    // 点击关闭时提示
    function close() {
        for (var i = 0; i < ExitEvents.Count(); i++) {
            if (ExitEvents[i] && "function" === typeof ExitEvents[i]) {
                ExitEvents[i]();
            }
        }

        if (!ShowHint) return null;
        return Edbox.GetTip("Hint_NotSave");
    }

    // 聚焦事件
    function focus() {
        for (var i = 0; i < FocusEvents.Count(); i++) {
            if (FocusEvents[i] && "function" === typeof FocusEvents[i]) {
                FocusEvents[i]();
            }
        }
    }

    // 失去聚焦事件
    function blur() {
        for (var i = 0; i < BlurEvents.Count(); i++) {
            if (BlurEvents[i] && "function" === typeof BlurEvents[i]) {
                BlurEvents[i]();
            }
        }
    }

    // 断网事件
    function offline() {
        for (var i = 0; i < OfflineEvents.Count(); i++) {
            if (OfflineEvents[i] && "function" === typeof OfflineEvents[i]) {
                OfflineEvents[i]();
            }
        }
    }

    // 连接事件
    function online() {
        for (var i = 0; i < OnlineEvents.Count(); i++) {
            if (OnlineEvents[i] && "function" === typeof OnlineEvents[i]) {
                OnlineEvents[i]();
            }
        }
    }

    // 添加对窗口关闭事件的绑定
    $(function () {
        $(window).unbind('beforeunload');
        window.onbeforeunload = close;
        window.onfocus = focus;
        window.onblur = blur;
        window.onoffline = offline;
        window.ononline = online;
    });

	/**
	 * Edbox 窗口事件
	 * @author 温荣泉(201901)
	 */
    var module = {
        /**
         * 添加关闭事件
         * @param {Function} func 事件
         */
        AddExitEvent: function (func) {
            ExitEvents.Add(func);
        },

        /**
         * 移除关闭事件
         * @param {Function} func 事件
         */
        RemoveExitEvent: function (func) {
            ExitEvents.Remove(func);
        },

        /**
         * 添加聚焦事件
         * @param {Function} func 事件
         */
        AddFocusEvent: function (func) {
            FocusEvents.Add(func);
        },

        /**
         * 移除聚焦事件
         * @param {Function} func 事件
         */
        RemoveFocusEvent: function (func) {
            FocusEvents.Remove(func);
        },

        /**
         * 添加失去焦点事件
         * @param {Function} func 事件
         */
        AddBlurEvent: function (func) {
            BlurEvents.Add(func);
        },

        /**
         * 移除失去焦点事件
         * @param {Function} func 事件
         */
        RemoveBlurEvent: function (func) {
            BlurEvents.Remove(func);
        },

        /**
         * 添加断网事件
         * @param {Function} func 事件
         */
        AddOfflineEvent: function (func) {
            OfflineEvents.Add(func);
        },

        /**
         * 移除断网事件
         * @param {Function} func 事件
         */
        RemoveOfflineEvent: function (func) {
            OfflineEvents.Remove(func);
        },

        /**
         * 添加网络连接事件
         * @param {Function} func 事件
         */
        AddOnlineEvent: function (func) {
            OnlineEvents.Add(func);
        },

        /**
         * 移除网络连接事件
         * @param {Function} func 事件
         */
        RemoveOnlineEvent: function (func) {
            OnlineEvents.Remove(func);
        },

        /**
         * 显示关闭提示
         */
        Show: function () {
            ShowHint = true;
        },

        /**
         * 隐藏关闭提示
         */
        Hide: function () {
            ShowHint = false;
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
})(Edbox, "WindowEvent");