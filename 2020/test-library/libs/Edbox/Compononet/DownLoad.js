/* Edbox 下载组件
 * @author 温荣泉(201901) 陈彬舰(110181);
 */
(function (namespace, className) {
    /**
     * Base64转Blob
     * @param {String} data Base64数据
     * @return {Object} Blob对象
     */
    var Base64ToBlob = function (data) {
        var parts = data.split(';base64,');
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);
        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {
            type: contentType
        });
    };

    /**
     * 判断是否是base64字符串
     * @param {String} str 判断的字符串
     * @returns {Boolean} 是否是base64字符串
     */
    var isBase64 = function (str) {
        if (str.indexOf('data:') !== -1 && str.indexOf('base64') !== -1) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 获取base64文件后缀名
     * @param {String} base64 base字符串 
     * @returns {String} 后缀名
     */
    var getBase64Suf = function (base64) {
        return base64.split(";")[0].split("/")[1];
    };

    /**
     * 根据链接获取资源名称
     * @param {String} str 需要获取文件名的字符串
     * @param {String} type 字符串类型
     * @param {String} filename 文件名称
     * @returns {String} 资源名称
     */
    var getURLFilename = function (str, type, filename) {
        var arr = ['bmp', 'png', 'jpg', 'jpeg', 'gif', 'mp3', 'ogg'];
        // 提供filename
        if (filename) {
            // 提供后缀名
            if (arr.indexOf(filename.slice(filename.lastIndexOf('.') + 1, filename.length)) >= 0)
                return filename;
            // 不提供后缀名
            else {
                // 资源获取
                if (type === "src") {
                    str = str.replace(/\\/g, "/");
                    var index = str.lastIndexOf("/");
                    str = str.substring(index + 1);
                    str = str.split("?")[0];
                    str = str.split(".")[1];
                    return filename + "." + str;
                }
                // base64获取
                if (type === "base64") {
                    return filename + "." + getBase64Suf(str);
                }
            }
        }
        // 不提供filename
        else {
            // 资源获取
            if (type === "src") {
                str = str.replace(/\\/g, "/");
                var ind = str.lastIndexOf("/");
                str = str.substring(ind + 1);
                str = str.split("?")[0];
                return str;
            }
            // base64获取
            if (type === "base64") {
                return new Date().getTime() + "." + getBase64Suf(str);
            }
        }
    };

    /**
     * 保存下载base64文件
     * @param {String} base64 base64字符串
     * @param {String} filename 文件名称
     */
    var saveFile = function (base64, filename) {
        var blob = typeof base64 === 'string' ? Base64ToBlob(base64) : base64;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
            // 转换完成，创建一个a标签用于下载
            var eleLink = document.createElement("a");
            eleLink.download = filename;
            eleLink.href = window.URL.createObjectURL(blob);
            eleLink.click();
            window.URL.revokeObjectURL(eleLink.href);
        };
    };

    /**
     * @param {String} src 资源路径 或者 base64字符串
     * @param {String} filename 文件名称
     * @param {Function} success 成功回调
     * @param {Function} error 失败回调
     * @param {Function} progress 进度回调 仅在通过资源路径下载时使用 带三个参数：per当前进度百分比，loaded已下载文件大小,total文件总大小
     */
    var module = function (src, filename, success, error, progress) {
        // 根据base64字符串保存下载
        if (isBase64(src)) {
            filename = getURLFilename(src, "base64", filename);
            saveFile(src, filename, success, error);
            if (success) success();
        }
        // 根据资源路径下载
        else {
            filename = getURLFilename(src, "src", filename);
            var xhr = new XMLHttpRequest();
            xhr.open("GET", src, true); // 根据接口
            xhr.responseType = "blob";
            xhr.addEventListener("progress", function (e) {
                if (e.lengthComputable) {
                    var loaded = e.loaded;//已经下载大小情况
                    var total = e.total;//附件总大小
                    var per = Math.floor(100 * loaded / total);  //已经下载的百分比
                    if (progress) {
                        progress(per, loaded, total);
                    }
                }
            }, false);

            // 请求完成
            xhr.onload = function () {
                saveFile(this.response, filename);
                if (success) success();
            };

            // 请求超时
            xhr.ontimeout = function (e) {
                if (error) error(e);
            };

            // 请求错误
            xhr.onerror = function (e) {
                // 转换完成，创建一个a标签用于下载
                var eleLink = document.createElement("a");
                eleLink.download = filename;
                eleLink.href = src;
                eleLink.click();
                window.URL.revokeObjectURL(eleLink.href);
                if (error) error(e);
            };

            // 发送ajax请求
            xhr.send();
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
})(Edbox, "DownLoad");