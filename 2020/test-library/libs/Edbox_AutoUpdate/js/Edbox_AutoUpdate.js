/**
 * Edbox自动更新服务程序组件
 * 用于Edbox平台的自动更新服务组件
 * @author 陈五洲(880123)
 * @version 0.0.0.1 (2019年06月25日 21:00:00)
 * @see 
 * @param {Object} obj 参数对象
 * @returns {Object} 组件
 * Depend:
 *      Edbox:
 *      Message: http://ndsdn.nd.com.cn/index.php?title=Edbox%E6%8E%A5%E5%85%A5%E5%AE%A2%E6%88%B7%E7%AB%AF%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%E5%86%99%E6%8E%A5%E5%8F%A3
 * 
 * */
Edbox.AutoUpdate = {

    /**
    * 安装包guid
    * @const
    * @type {string}
    */
    pkgGuid: "36313e8d-c1ea-3e69-12c9-e79b305dac8a",

    /**
    * 平台参数
    * @const
    * @type {string}
    */
    platform: "ANDROID",


    /**
     * 最新安装包信息获取
     * @public
     * @param {string} pkgVersion 版本号
     * @param {Function} success 成功回调
     * @param {Function=} error 出错回调
     */
    getLastVersion(pkgVersion, success, error) {

        var subUrl = "/edbox/v1.0/package/lastest_version";

        let args = {
            pkg_guid: this.pkgGuid,
            pkg_version: pkgVersion,
            pkg_platform: this.platform,
            language: this.getLanguage()
        };

        this.get(subUrl, args, success, error);
    },


    /**
    * 获取安装包列表
    * @public
    * @param {Function} success 成功回调
    * @param {Function=} error 出错回调
    */
    getVersionLst(success, error) {

        var subUrl = "/edbox/v1.0/package/version_list";

        let args = {
            "pkg_guid": this.pkgGuid,
            "pkg_platform": this.platform,
            "language": this.getLanguage()
        };

        this.get(subUrl, args, success, error);
    },


    getLanguage() {
        return Edbox.Language === "English" ? "en" : "zh-CN";
    },

    /**
    * 请求消息
    * @private
    * @param {String} subUrl url后缀地址
    * @param {Object} args url参数信息
    * @param {Function} success 成功回调
    * @param {Function} error 出错回调
    * @param {boolean=} async 是否异步 默认true
    */
    get(subUrl, args, success, error, async = true) {

        $.ajax({
            url: Edbox.Protocol + "://" + Edbox.GetHost("Login") + subUrl,
            async: async,
            type: "post",
            data: JSON.stringify(args),
            success: function (rpData) {
                var rp = JSON.parse(rpData);
                if (rp && rp.data) {
                    if (success) {
                        success(rp.data);
                    }
                } else {
                    if (error) {
                        error();
                    }
                }
            },
            error: function (e) {
                if (error) {
                    error(e);
                }
            }
        });
    }

};
