// Edbox CS 接口
(function (namespace, className) {
    var module = {
        /**
         * 获取用户头像链接地址
         * @param {String} userid 用户id
         * @param {Number} size 大小
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @returns {String} 地址
         */
        GetAvatar: function (userid, size) {
            if (!size) size = 160;
            return Edbox.Protocol + "://" + Edbox.GetHost("CS") + "/v0.1/static/cscommon/avatar/" + userid + "/" + userid + ".jpg?size=" + size;
        },

        /**
         * 上传到CS
         * @param {String} sessionid 会话ID
         * @param {String} distpath 上传路径
         * @param {String} name 名称
         * @param {Object} blob Blob对象
         * @param {Function} progress 上传进度回调，带三个参数:百分比、已上传、总大小
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         * @returns {Object} Ajax对象
         */
        UpLoadToCS: function (sessionid, distpath, name, blob, progress, success, error) {
            var url = '/v0.1/upload?session=' + sessionid + '&rename=false';
            var curl = Edbox.Protocol + "://" + Edbox.GetHost("CS") + url;

            var formdata = new FormData();
            formdata.append("path", distpath);
            formdata.append("name", name);
            formdata.append("scope", 1);
            formdata.append("file", blob);

            return $.ajax({
                processData: false,
                contentType: false,
                url: curl,
                async: true,
                type: "post",
                data: formdata,
                dataType: "json",
                success: success,
                error: error,
                xhr: function () {
                    myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress', function (e) {
                            var loaded = e.loaded;//已经上传大小情况
                            var total = e.total;//附件总大小
                            var per = Math.floor(100 * loaded / total);  //已经上传的百分比
                            if (progress) {
                                progress(per, loaded, total);
                            }
                        }, false);
                    }
                    return myXhr;
                }
            });
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Api, "CS"));