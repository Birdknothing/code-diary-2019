/**
 * UtilBarn音频选取组件
 * 可用于UtilBarn平台的编辑模块中进行音频选取
 * @author 温荣泉(201901)
 * @version 1.0.0 (2019年3月22日)
 * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn%E9%9F%B3%E9%A2%91%E9%80%89%E5%8F%96%E7%BB%84%E4%BB%B6JS%E7%89%88
 * Js需求:
 *      UtilBarn
 * */
UtilBarn.AudioSelector = {
    /**
     * 启动音频选取器
     * @param {String} name 资源名称
     * @param {String} url 资源远程路径
     * @param {Array} formats 指定格式支持队列,例如["mp3","ogg"] , 留空时获取源文件
     * @param {Function} reset 重置回调
     * @param {Function} getinfo 获取到文件信息回调,带参数info{Name,Data}
     * @param {Function} progress 文件上传NDR过程,带两个参数msg, step
     * @param {Function} success 成功回调,带参数info{Name,Type,Guid,Url}
     * @param {Function} error 出错回调
     */
    Start: function (name, url, formats, reset, getinfo, progress, success, error) {
        var com = UtilBarn.AudioSelector;
        var frame;
        var pageurl = com.ComponentPath + "page/";
        pageurl = UtilBarn.SetQueryString("UtilBarnArgs", UtilBarn.GetLoginInfo(), pageurl);

        // 创建
        function create() {
            var dom = document.createElement("iframe");
            dom.style.overflow = "hidden";
            dom.style.position = "fixed";
            dom.style.top = "0";
            dom.style.left = "0";
            dom.style.height = "100%";
            dom.style.width = "100%";
            dom.style.margin = "0";
            dom.style.padding = "0";
            dom.style.border = "0";
            dom.style.zIndex = "1000";
            document.body.appendChild(dom);
            return dom;
        }

        // 隐藏
        function hide() {
            frame.style.display = "none";
        }

        // 销毁
        function dispose() {
            if (frame) {
                frame.remove();
            }
            window.removeEventListener("message", messageCallBack, false);
            frame = null;
            frameWindow = null;
        }

        // 方法集
        var Functions = {
            // 获取到文件信息回调,带参数info{Name,Data}
            GetInfo: function (datas) {
                hide();
                if (getinfo) getinfo(datas[0]);
            },
            // 文件上传NDR过程,带两个参数msg, step
            Progress: function (datas) {
                hide();
                if (progress) progress(datas[0], datas[1]);
            },
            // 成功回调,带参数info{Name,Type,Guid,Url}
            Success: function (datas) {
                dispose();
                if (success) success(datas[0]);
            },
            // 出错回调
            Error: function (datas) {
                dispose();
                if (error) error(datas[0]);
            },
            // 重置回调
            Reset: function (datas) {
                dispose();
                if (reset) reset();
            },
            // 关闭组件
            Cancel: function (datas) {
                dispose();
            }
        };

        // 消息回调
        function messageCallBack(data) {
            data = data.data;
            if (data && data.Type && Functions[data.Type]) {
                Functions[data.Type](data.Datas);
            }
        }

        frame = create();
        frame.setAttribute("src", pageurl);
        window.addEventListener("message", messageCallBack, false);

        frame.onload = function () {
            var data = new Object();
            data.name = name;
            data.url = url;
            data.formats = formats;
            frame.contentWindow.postMessage(data, "*");
        };
    }
};

// 初始化组件路径
UtilBarn.AudioSelector.InitPath = function () {
    var js = document.scripts;
    var path = js[js.length - 1].src.substring(0, js[js.length - 1].src.lastIndexOf("/"));
    path = path.substring(0, path.lastIndexOf("/") + 1);
    UtilBarn.AudioSelector.ComponentPath = path;
};
UtilBarn.AudioSelector.InitPath();