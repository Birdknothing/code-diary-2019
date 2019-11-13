/**
 * Edbox组件加载器
 */
var Loader = {
	/**
	 * 加载需求组件
	 * @param {string} path 组件路径
	 * @param {string} condition 加载条件
	 * @param {string} onload  加载完成后执行string类型函数
	 */
    Load: function (path, condition, onload) {
        function load() {
            document.write(
                '<script src="' + path + '" type="text/javascript"></script>'
            );
            if (onload) {
                document.write(
                    '<script type="text/javascript">' + onload + "</script>"
                );
            }
        }
        if (condition || condition === undefined || condition === null) {
            load();
        } else {
            if (onload) {
                document.write(
                    '<script type="text/javascript">' + onload + "</script>"
                );
            }
        }
    },

	/**
	 * Edbox组件加载路径
	 */
    ComponentRootPath: "http://component.edbox-cn.101.com/libs/",

	/**
	 * 协议
	 */
    Protocol: "http",

	/**
	 * 组件服务器域名
	 */
    Host: {
        /**
         * 特性服务器域名
         */
        Feature: ".edbox-feature.101.com",
		/**
		 * 国内预生产服务器域名
		 */
        BetaCN: ".edbox-beta-cn.101.com",
		/**
		 * 国内服务器域名
		 */
        CN: ".edbox-cn.101.com",
		/**
		 * 香港服务器域名
		 */
        HK: ".edbox-hk.101.com",
		/**
		 * 美国服务器域名
		 */
        US: ".edbox.101.com",
		/**
		 * QA服务器域名
		 */
        QA: ".edbox-qa.101.com",
		/**
		 * Dev服务器域名
		 */
        Dev: ".edbox-dev.101.com"
    },

	/**
	 * 初始化Edbox组件加载路径
	 */
    InitComponentRootPath: function () {
        Loader.Protocol = window.location.protocol.replace(":", "");
        if (Loader.Protocol.toLowerCase() === "file") {
            // 配置file协议为http协议
            Loader.Protocol = "http";
        }

        var host = window.location.hostname;
        var keys = Object.keys(Loader.Host);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var temphost = Loader.Host[key];
            if (host.indexOf(temphost) >= 0) {
                Loader.ComponentRootPath =
                    Loader.Protocol + "://component" + temphost + "/libs/";
                return;
            }
        }
        Loader.ComponentRootPath =
            Loader.Protocol + "://" + window.location.host + "/libs/";
    }
};

Loader.InitComponentRootPath();
// <!-- 第三方组件引用 -->
Loader.Load(Loader.ComponentRootPath + "ThirdParty/angularjs/angular.min.js?v=" + new Date().getTime());