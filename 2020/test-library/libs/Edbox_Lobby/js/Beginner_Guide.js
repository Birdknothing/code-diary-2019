(function (namespace, className) {
    var module = {
        isOpen: true,
        GuideGameId: {
            /**
             * QA测试服务器引导游戏ID
             */
            QA: "9fcda270-5d1d-11ea-b330-6587625629b6",
            /**
             * 开发服务器引导游戏ID
             */
            Dev: "f5c146f0-1fce-11ea-9a30-cf5404600c17",
            /**
             * 特性服务器引导游戏ID
             */
            Feature: "65f34ee0-209d-11ea-8686-b53a642398ef",
            /**
             * 国内预生产服务器引导游戏ID
             */
            BetaCN: "d0214d50-4e13-11ea-bc3e-bbccb6aa550d",
            /**
             * 海外预生产服务器引导游戏ID
             */
            Beta: "58e95630-209e-11ea-912d-3fadd83da66d",
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
            return module.GuideGameId[Edbox.ServerKey];
        },

        node_id: null,

        InitGuide: function () {
            Edbox.Api.MMO.GetLoadGuideNodeInfo(Edbox.SDPAppId, function (data) {
                // 排除移动端
                if (!Edbox.Platform.IsPC) {
                    return;
                }
                if (data && data["items"] && data["items"].length && data["items"][0].status === 0) {
                    module.node_id = data["items"][0].node_id ? data["items"][0].node_id : 1;
                    Edbox.GameId = module.GetGuideGameId();
                    Edbox.Access = "1";
                    Edbox.Mode = "3";
                    Edbox.Version = "1.00";
                    var ifm = document.createElement("iframe");
                    var url = Edbox.Protocol + "://" + Edbox.GetHost("Component") + "/coms/Guide/index.html";
                    url = Edbox.SetQueryString("EdboxArgs", Edbox.GetLoginInfo(), url);
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
                    Edbox.Message.Get(window, function (com) {
                        com.Stop();
                    });
                    ifm.onload = function () {
                        Edbox.Message.Get(window, function (com) {
                            com.Start();
                        });
                    };
                    Edbox.Message.AddMessageHandler("GuideFinish", function (datas, com) {
                        if (datas[0]) {
                            // 结束引导 跳转到我的大厅的我的作品列表
                            Edbox.Api.MMO.FinishGuideNode(Edbox.SDPAppId, module.node_id, function (data) {
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
                            Edbox.Api.MMO.FinishGuideNode(Edbox.SDPAppId, module.node_id, function (data) {
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
}(Edbox, "Guide"));