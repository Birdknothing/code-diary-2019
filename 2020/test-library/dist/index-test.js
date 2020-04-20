(function (namespace, name) {
    var module = {
        _dom: null,
        _isVisible: true,
        _getIframe: function () {
            var iframe = document.createElement("iframe");
            var tempURL = window["Edbox"].SetQueryString("EdboxArgs", window["Edbox"].GetLoginInfo(), window["Edbox"].Protocol + "://" + window["Edbox"].GetHost("Component") + "/coms/Library/index.html?v=" + new Date().getTime());
            // var tempURL = "http://127.0.0.1:8686";
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
            return iframe;
        },
        _sendMsg: function (data) {
            if (!this._dom)
                return;
            this._dom.contentWindow.postMessage(data, "*");
        },
        _thisBindedMsgHandler: null,
        _messageHandler: function (e) {
            var _this = this;
            var self = this;
            switch (e.data) {
                case "HideLibrary":
                    setTimeout(function () {
                        _this._dom.style.display = "none";
                        self._isVisible = false;
                    }, 200);
                    break;
                default:
                    break;
            }
        },
        _hide: function () {
            this._dom.style.display = "none";
            this._isVisible = false;
        },
        _show: function () {
            this._dom.style.display = "block";
            this._sendMsg("Mount");
            this._isVisible = true;
        },
        Init: function (initOk) {
            // Edbox的Load方法加载/coms/Library/index.js
            var iframe = this._getIframe();
            this._dom = iframe;
            document.body.appendChild(iframe);
            if (!this._thisBindedMsgHandler) {
                this._thisBindedMsgHandler = this._messageHandler.bind(this);
            }
            window.addEventListener("message", this._thisBindedMsgHandler);
            if (typeof initOk === "function")
                initOk();
        },
        Show: function () {
            if (this._isVisible) {
                this._hide();
                return;
            }
            if (!this._isVisible) {
                this._show();
            }
        },
        Start: function (initOk) {
            // 登录后的调用
            if (typeof initOk === "function")
                initOk();
        },
        Dispose: function (isOk) {
            this._dom && document.body.removeChild(this._dom);
            this._thisBindedMsgHandler &&
                window.removeEventListener("message", this._thisBindedMsgHandler);
            if (typeof isOk === "function")
                isOk();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFDLFVBQVMsU0FBUyxFQUFFLElBQUk7SUFDckIsSUFBSSxNQUFNLEdBQUc7UUFDVCxJQUFJLEVBQUUsSUFBSTtRQUNWLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFVBQVUsRUFBRTtZQUNSLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FDeEMsV0FBVyxFQUNYLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFDOUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyw2QkFBNkIsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUNqSSxDQUFDO1lBQ0YseUNBQXlDO1lBQ3pDLDJDQUEyQztZQUMzQyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7WUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUNqQyxPQUFPLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ0QsUUFBUSxZQUFDLElBQUk7WUFDVCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7Z0JBQUUsT0FBTztZQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFDRCxxQkFBcUIsRUFBRSxJQUFJO1FBQzNCLGVBQWUsWUFBQyxDQUFDO1lBQWpCLGlCQVlDO1lBWEcsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDWixLQUFLLGFBQWE7b0JBQ2QsVUFBVSxDQUFDO3dCQUNQLEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7d0JBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO29CQUM1QixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ1IsTUFBTTtnQkFDVjtvQkFDSSxNQUFNO2FBQ2I7UUFDTCxDQUFDO1FBQ0QsS0FBSztZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDNUIsQ0FBQztRQUNELEtBQUs7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDM0IsQ0FBQztRQUNELElBQUksRUFBRSxVQUFTLE1BQU07WUFDakIsdUNBQXVDO1lBRXZDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztZQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFO2dCQUM3QixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEU7WUFDRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQy9ELElBQUksT0FBTyxNQUFNLEtBQUssVUFBVTtnQkFBRSxNQUFNLEVBQUUsQ0FBQztRQUMvQyxDQUFDO1FBQ0QsSUFBSSxFQUFFO1lBQ0YsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNqQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsT0FBTzthQUNWO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNoQjtRQUNMLENBQUM7UUFDRCxLQUFLLEVBQUUsVUFBUyxNQUFNO1lBQ2xCLFNBQVM7WUFDVCxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVU7Z0JBQUUsTUFBTSxFQUFFLENBQUM7UUFDL0MsQ0FBQztRQUNELE9BQU8sRUFBRSxVQUFTLElBQUk7WUFDbEIsSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLHFCQUFxQjtnQkFDdEIsTUFBTSxDQUFDLG1CQUFtQixDQUN0QixTQUFTLEVBQ1QsSUFBSSxDQUFDLHFCQUFxQixDQUM3QixDQUFDO1lBQ04sSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVO2dCQUFFLElBQUksRUFBRSxDQUFDO1FBQzNDLENBQUM7UUFDRCxxQ0FBcUM7UUFDckMsb0NBQW9DO1FBQ3BDLGdDQUFnQztRQUNoQyxrQkFBa0I7UUFDbEIsUUFBUTtRQUNSLDRDQUE0QztRQUM1QyxJQUFJO0tBQ1AsQ0FBQztJQUNGLElBQUksU0FBUyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN2QyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO0tBQzVCO0FBQ0wsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDIn0=