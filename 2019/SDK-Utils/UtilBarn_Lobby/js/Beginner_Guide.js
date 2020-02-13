(function (namespace, className) {
    var module = {
        isOpen: true,
        GuideAppId: {
            CN: "ap1552529812079",
            US: "ap1552534065623"
        },
        GuideGameId: {
            /**
             * QA测试服务器引导游戏ID
             */
            QA: "fa1923c0-a8fb-11e9-a486-b9931030a9b3",
            /**
             * 开发服务器引导游戏ID
             */
            Dev: "bbbdc9a0-9825-11e9-87b0-cd02bc52b8ea",
            /**
             * 特性服务器引导游戏ID
             */
            Feature: "fa1923c0-a8fb-11e9-a486-b9931030a9b3",
            /**
             * 国内预生产服务器引导游戏ID
             */
            BetaCN: "077a5eb0-c54b-11e9-8857-0d9c94ffddec",
            /**
             * 海外预生产服务器引导游戏ID
             */
            Beta: "0eeb8610-cfb4-11e9-800b-45142177d2f9",
            /**
             * 国内服务器引导游戏ID
             */
            CN: "1fd70950-a2fe-11e9-8791-754c6cde7aa4",
            /**
             * 香港服务器引导游戏ID
             */
            HK: "11697620-a4b9-11e9-aea4-75bd302e256c",
            /**
             * 美国服务器引导游戏ID
             */
            US: "11697620-a4b9-11e9-aea4-75bd302e256c"
        },
        /**
         * 获取引导游戏的ID
         * @returns {String} 引导游戏的ID
         */
        GetGuideGameId: function () {
            return module.GuideGameId[UtilBarn.ServerKey];
        },
        /**
         * 获取引导游戏的ID
         * @returns {String} 引导游戏的ID
         */
        GetGuideAppId: function () {
            return module.GuideAppId['CN'];
        },

        node_id: null,

        InitGuide: function () {
            UtilBarn.Api.MMO.GetLoadGuideNodeInfo(module.GetGuideAppId(), function (data) {
                // 排除移动端
                if (!UtilBarn.Platform.IsPC) {
                    return;
                }
                if (data && data["items"] && data["items"].length && data["items"][0].status === 0) {
                    module.node_id = data["items"][0].node_id ? data["items"][0].node_id : 1;
                    UtilBarn.GameId = module.GetGuideGameId();
                    UtilBarn.Access = "1";
                    UtilBarn.Mode = "3";
                    UtilBarn.Version = "1.00";
                    var ifm = document.createElement("iframe");
                    var url = UtilBarn.Protocol + "://" + UtilBarn.GetHost("Component") + "/coms/Guide/index.html";
                    url = UtilBarn.SetQueryString("UtilBarnArgs", UtilBarn.GetLoginInfo(), url);
                    ifm.setAttribute("src", url);
                    ifm.style.width = "100%";
                    ifm.style.height = "100%";
                    ifm.style.position = "fixed";
                    ifm.style.border = "0";
                    ifm.style.top = "0";
                    ifm.style.left = "0";
                    ifm.style.zIndex = '99999';
                    document.body.appendChild(ifm);

                    var window = ifm.contentWindow;
                    UtilBarn.Message.Get(window, function (com) {
                        com.Stop();
                    });
                    ifm.onload = function () {
                        UtilBarn.Message.Get(window, function (com) {
                            com.Start();
                        });
                    };
                    UtilBarn.Message.AddMessageHandler("GuideFinish", function (datas, com) {
                        if (datas[0]) {
                            // 结束引导 跳转到我的大厅的我的作品列表
                            UtilBarn.Api.MMO.FinishGuideNode(module.GetGuideAppId(), module.node_id, function (data) {
                                console.log(data);
                                ifm.remove();
                                location.hash = "/SingleGameList/MyWorks";
                            }, function (err) {
                                console.error(err);
                                ifm.remove();
                                location.hash = "/SingleGameList/MyWorks";
                            });
                            module.isOpen = false;
                        }
                        else {
                            // 结束引导 跳转到大厅首页                            // 结束引导 跳转到我的大厅的我的作品列表
                            UtilBarn.Api.MMO.FinishGuideNode(module.GetGuideAppId(), module.node_id, function (data) {
                                ifm.remove();
                                location.hash = "/Warehouse/Warehouse";
                            }, function (err) {
                                ifm.remove();
                                location.hash = "/Warehouse/Warehouse";
                            });
                            module.isOpen = false;
                        }
                    });
                }
            });
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(UtilBarn, "Guide"));