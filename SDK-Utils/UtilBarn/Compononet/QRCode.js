// UtilBarn二维码组件
(function (namespace, className) {

    var Dom = null; // 存放使用的Dom
    var com = null; // 二维码组件
    var QRImg = null; // 生成的图片
    var QRCanvas = null; // 二维码画布
    var QRContext = null;// 二维码绘制
    var Url = ""; // 当前的二维码路径 
    var ShowDom = null; // 显示用的Dom

    /**
     * 二维码组件路径
     */
    var QRCodePath = UtilBarn.ComponentRootPath + "ThirdParty/qrcode/qrcode.min.js";

    /**
     * 初始化
     */
    function Init() {
        Dom = document.createElement("div");

        com = new QRCode(Dom, {
            text: "",
            width: 256,
            height: 256,
            colorDark: "black",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });

        var nodes = Dom.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName === "IMG") {
                QRImg = nodes[i];
                break;
            }
        }

        // 构建画布
        QRCanvas = document.createElement('canvas');
        QRCanvas.width = 300;
        QRCanvas.height = 300;
        QRCanvas.style.backgroundColor = "#fff";
        QRContext = QRCanvas.getContext('2d');
    }

    /**
     * UtilBarn二维码组件
     * 用于UtilBarn平台游戏二维码的生成与显示下载等操作
     * @author 温荣泉(201901)
     * @version 1.0.0 (2019年2月18日)
     * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%BB%84%E4%BB%B6JS%E7%89%88
     * Js需求:
     *      qrcode
     * */
    var module = {
        /**
         * 生成的二维码Base64数据,执行生成后才有数据
         */
        Datas: null,

        /**
         * 创建二维码
         * @param {String} url Url地址
         * @param {Function} success 成功回调,带String类型二维码Base64数据结果
         * @param {Function} error 出错回调
         */
        Create: function (url, success, error) {
            if (!url) {
                if (error)
                    error("请输入要生成的url地址!");
                return;
            }

            if (url === Url) {
                if (success) success(module.Datas);
                return;
            }

            Url = url;

            Require([QRCodePath], function () {
                Init();

                com.clear();
                com.makeCode(url);

                QRImg.onload = function () {
                    // 清空画布
                    QRCanvas.height = QRCanvas.height;
                    // 在canvas绘制前填充白色背景
                    QRContext.fillStyle = "#fff";
                    QRContext.fillRect(0, 0, QRCanvas.width, QRCanvas.height);
                    // 绘制二维码
                    QRContext.drawImage(QRImg, 22, 22, 256, 256);
                    // 转码
                    module.Datas = QRCanvas.toDataURL('image/jpeg');

                    if (success) success(module.Datas);
                };
            });
        },

        /**
         * 下载
         * @param {String} name 文件名称
         */
        Download: function (name) {
            if (!name || name.trim().length < 1) {
                name = "UtilBarn游戏分享二维码";
            }

            if (UtilBarn.Platform.IsIOS || UtilBarn.Platform.IsAndroid) {
                module.Show();
            }
            else {
                var a = document.createElement("a");
                a.setAttribute("href", module.Datas);
                a.setAttribute("download", name + ".jpg");
                a.click();
            }
        },

        /**
         * 创建并下载二维码
         * @param {String} url Url地址
         * @param {String} name 文件名称
         * @param {Function} success 成功回调,带String类型二维码Base64数据结果
         * @param {Function} error 出错回调
         */
        CreateAndDownload: function (url, name, success, error) {
            module.Create(url, function (data) {
                module.Download(name);
                if (success)
                    success(data);
            }, error);
        },

        /**
         * 显示二维码界面
         */
        Show: function () {
            ShowDom = document.createElement("div");
            ShowDom.style.overflow = "hidden";
            ShowDom.style.position = "fixed";
            ShowDom.style.top = "0";
            ShowDom.style.left = "0";
            ShowDom.style.height = "100%";
            ShowDom.style.width = "100%";
            ShowDom.style.margin = "0";
            ShowDom.style.padding = "0";
            ShowDom.style.border = "0";
            ShowDom.style.zIndex = "9999";
            ShowDom.style.backgroundColor = "#000";
            ShowDom.onclick = function () {
                module.Hide();
            };
            ShowDom.ontouchend = function () {
                module.Hide();
            };

            document.body.appendChild(ShowDom);

            var img = document.createElement("img");
            var width = ShowDom.clientWidth;
            if (ShowDom.clientHeight < width) width = ShowDom.clientHeight;
            if (width > 256) width = 256;
            img.style.position = "absolute";
            img.style.top = (ShowDom.clientHeight - width) / 2 + "px";
            img.style.left = (ShowDom.clientWidth - width) / 2 + "px";
            img.setAttribute("width", width);
            img.setAttribute("height", width);
            img.style.margin = "0";
            img.style.padding = "0";
            img.style.border = "0";
            img.style.zIndex = "200";
            img.setAttribute("src", module.Datas);

            ShowDom.appendChild(img);
        },

        /**
         * 隐藏二维码界面
         */
        Hide: function () {
            if (ShowDom) {
                document.body.removeChild(ShowDom);
                ShowDom = null;
            }
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "QRCode"));