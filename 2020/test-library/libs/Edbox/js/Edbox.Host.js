// 协议
(function (namespace, className) {
    /**
     * 协议
     */
    var module = "http";

    // 初始化协议
    function InitProtocol() {
        module = window.location.protocol.replace(":", "");
        if (module.toLowerCase() === "file") {
            // 配置file协议为http协议，适配Laya开发调试
            module = "http";
        }
    }
    InitProtocol();

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Protocol"));

// 服务器域名
(function (namespace, className) {
    /**
     * 服务器域名
     */
    var module = {
        /**
         * MMO服务器域名
         */
        MMO: {
            /**
             * QA测试服务器域名
             */
            QA: "api.edbox-qa.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "api.edbox-dev.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "api.edbox-feature.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "api.edbox-beta-cn.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "api.edbox-beta.101.com",
            /**
             * 国内服务器域名
             */
            CN: "api.edbox-cn.101.com",
            /**
             * 香港服务器域名
             */
            HK: "api.edbox.101.com",
            /**
             * 美国服务器域名
             */
            US: "api.edbox.101.com"
        },
        /**
         * NDR服务器域名
         */
        NDR: {
            /**
             * QA测试服务器域名
             */
            QA: "esp-lifecycle.sdp.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "esp-lifecycle.sdp.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "esp-lifecycle.sdp.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "esp-lifecycle.sdp.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "esp-lifecycle.awsca.101.com",
            /**
             * 国内服务器域名
             */
            CN: "esp-lifecycle.sdp.101.com",
            /**
             * 香港服务器域名
             */
            HK: "esp-lifecycle.awsca.101.com",
            /**
             * 美国服务器域名
             */
            US: "esp-lifecycle.awsca.101.com"
        },
        /**
         * CS服务器域名
         */
        CS: {
            /**
             * QA测试服务器域名
             */
            QA: "cs.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "cs.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "cs.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "cs.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "cs-awsca.101.com",
            /**
             * 国内服务器域名
             */
            CN: "cs.101.com",
            /**
             * 香港服务器域名
             */
            HK: "cs.101.com",
            /**
             * 美国服务器域名
             */
            US: "cs-awsca.101.com"
        },
        /**
         * CS服务器CDN库域名
         */
        CommonCS: {
            /**
             * QA测试服务器域名
             */
            QA: "cscommon.web.sdp.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "cscommon.web.sdp.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "cscommon.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "cscommon.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "cscommon.awsca.101.com",
            /**
             * 国内服务器域名
             */
            CN: "cscommon.101.com",
            /**
             * 香港服务器域名
             */
            HK: "cscommon.101.com",
            /**
             * 美国服务器域名
             */
            US: "cscommon.awsca.101.com"
        },
        /**
         * CS服务器CDN库域名
         */
        CDNCS: {
            /**
             * QA测试服务器域名
             */
            QA: "cdncs.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "cdncs.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "cdncs.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "cdncs.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "cdn-cs-awsca.101.com",
            /**
             * 国内服务器域名
             */
            CN: "cdncs.101.com",
            /**
             * 香港服务器域名
             */
            HK: "cdncs.101.com",
            /**
             * 美国服务器域名
             */
            US: "cdn-cs-awsca.101.com"
        },
        /**
         * 前端分类库服务器域名
         */
        FrontendLib: {
            /**
             * QA测试服务器域名
             */
            QA: "vr-life.sdp.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "vr-life.sdp.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "vr-life.sdp.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "vr-life.sdp.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "vr-life.awsca.101.com",
            /**
             * 国内服务器域名
             */
            CN: "vr-life.sdp.101.com",
            /**
             * 香港服务器域名
             */
            HK: "vr-life.hk.101.com",
            /**
             * 美国服务器域名
             */
            US: "vr-life.awsca.101.com"
        },
        /**
         * 新前端分类库服务器域名
         */
        NewFrontendLib: {
            /**
             * QA测试服务器域名
             */
            QA: "3dcp-qa.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "3dcp-dev.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "3dcp.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "3dcp.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "3dcpus.101.com",
            /**
             * 国内服务器域名
             */
            CN: "3dcp.101.com",
            /**
             * 香港服务器域名
             */
            HK: "3dcpus.101.com",
            /**
             * 美国服务器域名
             */
            US: "3dcpus.101.com"
        },
        /**
         * 登录页面服务器域名
         */
        Login: {
            /**
             * QA测试服务器域名
             */
            QA: "support.edbox-qa.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "support.edbox-dev.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "support.edbox-feature.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "support.edbox-beta-cn.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "support.edbox-beta.101.com",
            /**
             * 国内服务器域名
             */
            CN: "support.edbox-cn.101.com",
            /**
             * 香港服务器域名
             */
            HK: "support.edbox.101.com",
            /**
             * 美国服务器域名
             */
            US: "support.edbox.101.com"
        },
        /**
         * 组件服务器域名
         */
        Component: {
            /**
             * QA测试服务器域名
             */
            QA: "component.edbox-qa.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "component.edbox-dev.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "component.edbox-feature.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "component.edbox-beta-cn.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "component.edbox-beta.101.com",
            /**
             * 国内服务器域名
             */
            CN: "component.edbox-cn.101.com",
            /**
             * 香港服务器域名
             */
            HK: "component.edbox-hk.101.com",
            /**
             * 美国服务器域名
             */
            US: "component.edbox.101.com"
        },
        /**
         * 游戏服务器域名
         */
        Game: {
            /**
             * QA测试服务器域名
             */
            QA: "game.edbox-qa.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "game.edbox-dev.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "game.edbox-feature.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "game.edbox-beta-cn.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "game.edbox-beta.101.com",
            /**
             * 国内服务器域名
             */
            CN: "game.edbox-cn.101.com",
            /**
             * 香港服务器域名
             */
            HK: "game.edbox-hk.101.com",
            /**
             * 美国服务器域名
             */
            US: "game.edbox.101.com"
        },
        /**
          * IM服务器域名
          */
        IM: {
            /**
             * QA测试服务器域名
             */
            QA: "im-friend.web.sdp.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "im-friend.web.sdp.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "im-friend.web.sdp.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "im-friend.web.sdp.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "im-friend.awsca.101.com",
            /**
             * 国内服务器域名
             */
            CN: "im-friend.web.sdp.101.com",
            /**
             * 香港服务器域名
             */
            HK: "im-friend.web.sdp.101.com",
            /**
             * 美国服务器域名
             */
            US: "im-friend.awsca.101.com"
        },
          /**
          * IM服务器域名
          */
         IM_HTTPS: {
            /**
             * QA测试服务器域名
             */
            QA: "im-friend.sdp.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "im-friend.sdp.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "im-friend.sdp.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "im-friend.sdp.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "im-friend.awsca.101.com",
            /**
             * 国内服务器域名
             */
            CN: "im-friend.sdp.101.com",
            /**
             * 香港服务器域名
             */
            HK: "im-friend.hk.101.com",
            /**
             * 美国服务器域名
             */
            US: "im-friend.awsca.101.com"
        },
        /**
         * UC服务器域名
         */
        UC: {
            /**
             * QA测试服务器域名
             */
            QA: "aqapi.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "aqapi.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "aqapi.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "aqapi.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "uc-awsca.101.com",
            /**
             * 国内服务器域名
             */
            CN: "aqapi.101.com",
            /**
             * 香港服务器域名
             */
            HK: "aqapi.101.com",
            /**
             * 美国服务器域名
             */
            US: "uc-awsca.101.com"
        },
        /**
         * IM消息服务器域名
         */
        IMMsg: {
            /**
             * QA测试服务器域名
             */
            QA: "imagent.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "imagent.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "imagent.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "imagent.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "im-agent.awsca.101.com",
            /**
             * 国内服务器域名
             */
            CN: "imagent.101.com",
            /**
             * 香港服务器域名
             */
            HK: "im-friend.web.sdp.101.com",
            /**
             * 美国服务器域名
             */
            US: "im-agent.awsca.101.com"
        },
        /**
         * IM用户反馈
         */
        FeedBack: {
            /**
             * QA测试服务器域名
             */
            QA: "user-feedback.sdp.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "user-feedback.sdp.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "user-feedback.sdp.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "user-feedback.sdp.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "user-feedback.awsca.101.com",
            /**
             * 国内服务器域名
             */
            CN: "user-feedback.sdp.101.com",
            /**
             * 香港服务器域名
             */
            HK: "user-feedback.sdp.101.com",
            /**
             * 美国服务器域名
             */
            US: "user-feedback.awsca.101.com"
        },

        /**
         * 大厅服务器域名
         */
        Lobby: {
            /**
             * QA测试服务器域名
             */
            QA: "studio.edbox-qa.101.com",
            /**
             * 开发服务器域名
             */
            Dev: "studio.edbox-dev.101.com",
            /**
             * 特性服务器域名
             */
            Feature: "studio.edbox-feature.101.com",
            /**
             * 国内预生产服务器域名
             */
            BetaCN: "studio.edbox-beta-cn.101.com",
            /**
             * 海外预生产服务器域名
             */
            Beta: "studio.edbox-beta.101.com",
            /**
             * 国内服务器域名
             */
            CN: "studio.edbox-cn.101.com",
            /**
             * 香港服务器域名
             */
            HK: "studio.edbox-hk.101.com",
            /**
             * 美国服务器域名
             */
            US: "studio.edbox.101.com"
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Host"));