// UtilBarn消息组件
(function (namespace, className) {
    /**
     * UtilBarn消息组件
     * 用于UtilBarn平台的消息组件,用于实现跨域消息的传递与管理
     * @author 温荣泉(201901)
     * @version 0.0.0.1 (2019年04月26日 03:42:17)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn消息组件
     * @param {Object} obj 参数对象
     * @returns {Object} 组件
     * Depend:
     *      UtilBarn:http://ndsdn.nd.com.cn/index.php?title=UtilBarn通用组件
     * */
    var module = function (obj) {
        var self = this;

        /**
         * 组件唯一ID
         * Unique ID
         * Type : Text
         * Default Value : 
         */
        this.ID = obj && obj.ID || "";

        /**
         * 是否启用
         * Whether to enable
         * Type : Boolean
         * Default Value : false
         */
        this.Enable = obj && obj.Enable || false;

        /**
         * 监听的窗口对象
         * Listening window object
         * Type : Object
         * Default Value : null
         */
        this.Window = obj && obj.Window || null;

        return this;
    };

    /**
     * 发送消息
     * Send Message
     * @param {String} type 方法执行类型关键字 , 不允许为空
     * @param {Array} datas 消息数据 , 带Array参数Object , 允许为空
     * @param {Function} success 成功回调 , 允许为空
     * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
     */
    module.prototype.Send = function (type, datas, success, error) {
        var self = this;
        if (!type) {
            if (error) error("Error:Empty Parameters");
            return;
        }

        if (!self.Enable) {
            if (error) error("Error:Connection interruption");
            return;
        }

        var data = new Object();
        data.Type = type;
        data.datas = [];

        if (datas) {
            var json = JSON.stringify(datas);
            datas = JSON.parse(json);
            data.Datas = datas;
        }

        if (module.OnSend) {
            module.OnSend(data, self);
        }

        self.Window.postMessage(data, "*");
        if (success) success();
    };

    /**
     * 启动并监听消息组件
     * Start and listen for the message component
     * @param {Function} success 成功回调 , 允许为空
     * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
     */
    module.prototype.Start = function (success, error) {
        var self = this;
        self.Enable = true;
        if (!namespace.Array.Contain(module.MessageList, self)) {
            self.Send("Connect");
        }
        namespace.Array.Add(module.MessageList, self);
        if (success) success();
    };

    /**
     * 停止并释放消息组件
     * Stop and release the message component
     * @param {Function} success 成功回调 , 允许为空
     * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
     */
    module.prototype.Stop = function (success, error) {
        var self = this;
        if (namespace.Array.Contain(module.MessageList, self)) {
            self.Send("Disconnect");
        }
        self.Enable = false;
        namespace.Array.Remove(module.MessageList, self);
        if (success) success();
    };

    /**
     * 消息组件队列
     * Message Component List
     * Type : Array
     * ArrayType : Message
     * Default Value : null
     */
    module.MessageList = new Array();

    /**
     * 消息组件连接回调
     * Message component connection callback
     * Type : Function
     * FunctionType : Message
     * Default Value : null
     */
    module.ConnectCallback = null;

    /**
     * 消息组件连接中断回调
     * Message component connection interrupt callback
     * Type : Function
     * FunctionType : Message
     * Default Value : null
     */
    module.DisonnectCallback = null;

    /**
     * 当收到消息
     */
    module.OnReceive = null;

    /**
     * 当发出消息
     */
    module.OnSend = null;

    /**
     * 方法集
     * Function Set
     * Type : Map
     * MapType : Text, Function
     * Default Value : null
     */
    module.Functions = new Dictionary();

    /**
     * 获取消息组件
     * Get message component
     * @param {Object} window 监听的窗口对象 , 不允许为空
     * @param {Function} success 成功回调 , 带Function参数Message , 允许为空
     * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
     */
    module.Get = function (window, success, error) {
        var list = module.MessageList;
        for (var i = 0; i < list.length; i++) {
            if (list[i].Window === window) {
                if (success) success(list[i]);
                return;
            }
        }

        var message = new module();
        message.ID = namespace.GetGUID();
        message.Enable = true;
        message.Window = window;

        if (success) success(message);
    };

    /**
     * 是否存在该窗口消息组件的监听
     * Whether there is a listener for the window message component
     * @param {Object} window 监听的窗口对象 , 不允许为空
     * @returns {Boolean} 是否存在
     */
    module.Contain = function (window) {
        var list = module.MessageList;
        for (var i = 0; i < list.length; i++) {
            if (list[i].Window === window) return true;
        }
        return false;
    };

    /**
     * 添加消息处理事件
     * Add Message Handler
     * @param {String} type 方法执行类型关键字 , 不允许为空
     * @param {Function} func 消息 , 带Function参数Array, Message , 不允许为空
     * @param {Function} success 成功回调 , 允许为空
     * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
     */
    module.AddMessageHandler = function (type, func, success, error) {
        if (!type || !func) {
            if (error) error("Error:Empty Parameters");
            return;
        }
        var list = module.Functions;
        list.Set(type, func);
        if (success) success();
    };

    /**
     * 向所有连接的消息组件广播消息
     * Broadcast messages to all connected message components
     * @param {String} type 方法执行类型关键字 , 不允许为空
     * @param {Array} datas 消息数据 , 带Array参数Object , 允许为空
     * @param {Function} success 成功回调 , 允许为空
     * @param {Function} error 出错回调 , 带Function参数Object , 允许为空
     */
    module.Broadcast = function (type, datas, success, error) {
        var list = module.MessageList;
        if (!list) {
            if (error) error("None connected message component");
            return;
        }
        for (var i = 0; i < list.length; i++) {
            list[i].Send(type, datas);
        }
        if (success) success();
    };

    // 初始化
    var Init = function () {
        // 监听连接
        module.AddMessageHandler("Connect", function (datas, com) {
            com.Start();
            if (module.ConnectCallback)
                module.ConnectCallback(com);
        });

        // 监听连接中断
        module.AddMessageHandler("Disconnect", function (datas, com) {
            com.Stop();
            if (module.DisonnectCallback)
                module.DisonnectCallback(com);
        });

        // 监听Log
        module.AddMessageHandler("Log", function (datas, com) {
            console.log(datas);
        });

        // 消息回调
        function messageCallBack(e) {
            var window = e.source;
            var data = e.data;
            module.Get(window, function (com) {
                if (!com.Enable) return;
                if (data && data.Type) {
                    if (module.OnReceive) {
                        module.OnReceive(data, com);
                    }
                    var func = module.Functions.Get(data.Type);
                    if (!func) return;
                    func(data.Datas, com);
                }
            });
        }

        window.addEventListener("message", messageCallBack, false);
    };
    Init();

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "Message"));