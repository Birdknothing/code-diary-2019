(function(namespace, name) {
    var module = {
        Dom: null,
        isVisible: true,
        getIframe: function() {
            var iframe = document.createElement("iframe");
            var tempURL = window["Edbox"].SetQueryString(
                "EdboxArgs",
                window["Edbox"].GetLoginInfo(),
                window["Edbox"].Protocol + "://" + window["Edbox"].GetHost("Component") + "/coms/Library/index.html"
            );
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
        hideLibrary: null,
        Init: function(initOk) {
            var iframe = this.getIframe();
            this.Dom = iframe;
            document.body.appendChild(iframe);
            if (!this.hideLibrary) {
                this.hideLibrary = function(e) {
                    // @ts-ignore
                    e.data === "HideLibrary" &&  (this.Dom.style.display = "none");
                }.bind(this);
            }
            window.addEventListener("message", this.hideLibrary);
            if (typeof initOk === "function") initOk();
        },
        Show: function() {
            if (this.isVisible) {
                this.Dom.style.display = "none";
                this.isVisible = false;
                return;
            }
            if (!this.isVisible) {
                this.Dom.style.display = "block";
                this.isVisible = true;
            }
        },
        Start: function(initOk) {
            if (typeof initOk === "function") initOk();
        },
        Dispose: function(isOk) {
            this.Dom && document.body.removeChild(this.Dom);
            this.hideLibrary && window.removeEventListener("message", this.hideLibrary);
            if (typeof isOk === "function") isOk();
        }
        // StartMessageTest() {
        //     log("startMessagetest");
        // }
    };
    if (namespace && name && !namespace[name]) {
        namespace[name] = module;
    }
})(window["Edbox"], "Library");
