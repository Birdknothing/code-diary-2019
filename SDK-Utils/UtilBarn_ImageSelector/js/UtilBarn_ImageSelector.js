/**
 * UtilBarn图片选取组件
 * 可用于UtilBarn平台的编辑模块中进行图片选取
 * @author LFH(350424)
 * @version 1.0.0 (2019年4月4日)
 * @see 
 * Js需求:
 *      UtilBarn
 * */

UtilBarn.ImageSelector = {
    /**
     * 启动图片选取器
     * @param {Object} args 参数对象后期较容易扩展参数，如：{ formats：["*"], radio: 1, limit: 1 }
     * {Array} formats 指定格式支持队列,如：["*"]、["png","jpg"],可选择图片格式（文字转图片不支持gif）
     * {Number} radio 截取的文件比率，默认为1
     * {Number} limit 限制可选中的图片数，默认为1
     * @param {Function} reset 重置回调
     * @param {Function} getinfo 获取到文件信息回调,带参数info{Name,Data}
     * @param {Function} progress 文件上传NDR过程,带两个参数msg, step
     * @param {Function} success 成功回调,带参数info{Name,Type,Guid,Url},选中空图片回调：{ Name: "空图片"， Type："image/png", Guid: "", Url: "" }
     * @param {Function} error 出错回调
     */
    Start: function(args, reset, getinfo, progress, success, error) {
        var com = UtilBarn.ImageSelector;
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
        var Functions = { // 获取到文件信息回调,带参数info{Name,Data}
            GetInfo: function(datas) {
                hide();
                if (getinfo) getinfo(datas[0]);
            },
            // 文件上传NDR过程,带两个参数msg, step
            Progress: function(datas) {
                hide();
                if (progress) progress(datas[0], datas[1]);
            },
            // 成功回调,带参数info{Name,Type,Guid,Url}
            Success: function(datas) {
                dispose();
                if (success) success(datas[0]);
            },
            // 出错回调
            Error: function(datas) {
                dispose();
                if (error) error(datas[0]);
            },
            // 重置回调
            Reset: function(datas) {
                dispose();
                if (reset) reset();
            },
            // 关闭组件
            Cancel: function(datas) {
                dispose();
            },
            // 输入框失去焦点事件
            InputBlur: function(datas) {
                window.scrollTo(0, 0);
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

        frame.onload = function() {
            var data = new Object();
            // data.name = name;
            // data.url = url;
            // data.formats = formats;
            // data.radio = radio;
            data.args = args;
            frame.contentWindow.postMessage(data, "*");
        };
    }
};

// 初始化组件路径
UtilBarn.ImageSelector.InitPath = function() {
    var js = document.scripts;
    var path = js[js.length - 1].src.substring(0, js[js.length - 1].src.lastIndexOf("/"));
    path = path.substring(0, path.lastIndexOf("/") + 1);
    UtilBarn.ImageSelector.ComponentPath = path;
};
UtilBarn.ImageSelector.InitPath();