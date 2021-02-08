(function(namespace, name) {
    var module = {
        _dom: null,
        _isVisible: true,
        _getIframe: function() {
            var iframe = document.createElement("iframe");
            // var tempURL = window["Edbox"].SetQueryString(
            //     "EdboxArgs",
            //     window["Edbox"].GetLoginInfo(),
            //     window["Edbox"].Protocol + "://" + window["Edbox"].GetHost("Component") + "/coms/Library/index.html?v=" + new Date().getTime()
            // );
            var tempURL = "/dev/index.html"; // source/dist + webpack -w
            // var tempURL = "./dist"; //用于打包项目后单端口服务测试
            iframe.setAttribute("src", tempURL);
            iframe.setAttribute("id", "Library_Iframe");
            iframe.style.top = "0";
            iframe.style.zIndex = "999";
            iframe.style.left = "0";
            iframe.style.position = "fixed";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.borderWidth = "0px";
            iframe.onload = function() {
                this.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                };
            };
            return iframe;
        },
        _sendMsg(data) {
            if (!this._dom) return;
            this._dom.contentWindow.postMessage(data, "*");
        },
        _thisBindedMsgHandler: null,
        _messageHandler(e) {
            const self = this;
            switch (e.data) {
                case "HideLibrary":
                    setTimeout(() => {
                        this._dom.style.display = "none";
                        self._isVisible = false;
                    }, 1000);
                    break;
                default:
                    break;
            }
        },
        _hide() {
            console.log('hide');
            
            this._dom.style.display = "none";
            this._isVisible = false;
        },
        _show() {
            this._dom.style.display = "block";
            this._sendMsg("Mount");
            this._isVisible = true;
        },
        Init: function(initOk) {
            // Edbox的Load方法加载/coms/Library/index.js
            console.log("init");

            var iframe = this._getIframe();
            console.log(iframe);
            
            this._dom = iframe;
            document.body.appendChild(iframe);
            if (!this._thisBindedMsgHandler) {
                this._thisBindedMsgHandler = this._messageHandler.bind(this);
            }
            window.addEventListener("message", this._thisBindedMsgHandler);
            if (typeof initOk === "function") initOk();
        },
        Show: function() {
            if (this._isVisible) {
                this._hide();
                return;
            }
            if (!this._isVisible) {
                this._show();
            }
        },
        Start: function(initOk) {
            // 登录后的调用
            if (typeof initOk === "function") initOk();
        },
        Dispose: function(isOk) {
            this._dom && document.body.removeChild(this._dom);
            this._thisBindedMsgHandler &&
                window.removeEventListener(
                    "message",
                    this._thisBindedMsgHandler
                );
            if (typeof isOk === "function") isOk();
        }
        // 组件外点击应为 dom.onclick = function() {
        //     if (Edbox && Edbox.Library) {
        //         Edbox.Library.Show();
        //         return;
        //     }
        //     Edbox.Load("Library", function() {});
        // }
    };
    if (namespace && name && !namespace[name]) {
        namespace[name] = module;
    }
})(window["Edbox"], "Library");
