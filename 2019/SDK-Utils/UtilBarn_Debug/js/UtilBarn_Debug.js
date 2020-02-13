var Debug = {

    Dom: null,

    Show: function () {
        if (!Debug.Dom) {
            // 构造Debug Dom
            var dom = document.createElement("div");
            dom.style.width = "100%";
            dom.style.height = "300px";
            dom.style.background = "rgba(0, 0, 0, 0.3)";
            dom.style.margin = "0";
            dom.style.position = "fixed";
            dom.style.overflow = "auto";
            dom.style.bottom = "0";
            dom.style.left = "0";
            dom.style.zIndex = "999999";
            dom.style.color = "white";
            dom.style.pointerEvents = "none";
            document.body.appendChild(dom);
            Debug.Dom = dom;
        }
        Debug.Dom.style.display = "block";
    },

    Hide: function () {
        if (Debug.Dom) {
            Debug.Dom.style.display = "none";
        }
    },

    Log: function (msg, url, line) {
        var data = msg + "     " + url + ":" + line;
        if (!url) {
            data = msg;
        }
        var dom = document.createElement("p");
        dom.innerText = new Date().toLocaleTimeString() + ':' + data;
        if (Debug.Dom.firstChild) {
            Debug.Dom.insertBefore(dom, Debug.Dom.firstChild);
        } else {
            Debug.Dom.appendChild(dom);
        }
    },

    Init: function () {
        Debug.Show();

        window.onerror = function (msg, url, line) {
            Debug.Log(msg, url, line);
        };

        console.error = function (e) {
            Debug.Log(e.message);
        };

        console.log = function (msg) {
            Debug.Log(msg);
        };
    }
};

Debug.Init();