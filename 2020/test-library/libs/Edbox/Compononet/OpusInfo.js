//我的游戏作品相关组件，包括服务器人数，游戏收益，发布数量限制
(function (namespace, className) {
    var api = Edbox.Api.MMO;

    var module = {
        /**
         * 获取服务器人数上限
         * @param {Object} data{
         *                  {String}app_id:游戏作品id 
         * }
         * @param {Function} success 成功回调 附带该游戏服务器人数上限
         * @param {Function} error 出错回调
         */
        GetLimitOfPeople: function (data, success, error) {
            var vip_level = Edbox.UserVipInfo.vip_level;
            for (let i = 0, n = Edbox.VipLimits.length; i < n; i++) {
                if (vip_level === Edbox.VipLimits[i].vip_level) {
                    if (success) success({
                        user_limit: Edbox.VipLimits[i].user_limit > 0 ? Edbox.VipLimits[i].user_limit : 30
                    });
                }
            }
        },

        /**
         * 获取用户游戏创建与发布数量限制
         * @param {Object} data 空参数
         * @param {Function} success 成功回调，附带当前可以创建和发布游戏的数量限制
         * @param {Function} error 出错回调
         */
        LimitOfGame(data, success, error) {
            var vip_level = Edbox.UserVipInfo.vip_level;
            for (let i = 0, n = Edbox.VipLimits.length; i < n; i++) {
                if (vip_level === Edbox.VipLimits[i].vip_level) {
                    if (success) success({
                        create_limit: Edbox.VipLimits[i].create_limit,
                        release_limit: Edbox.VipLimits[i].release_limit
                    });
                }
            }
        },

        /**
         * 获取游戏收益情况
         * @param {Object} data{
         *                  {String}app_id:作品id
         *                  {int}access_type:作品类型，1-模板库 2-个人库 (目前该字段不生效，不用传递)
         * }
         * @param {Function} success 成功回调 附带游戏收益情况
         * @param {Function} error 出错回调
         */
        GetAppIncome(data, success, error) {
            api.GetAppIncome(data.app_id, data.access_type, success, error);
        },

        /**
         * 进行创建时判断
         * @param {Object} data 空参数
         * @param {Function} success 成功回调函数
         * @param {Function} error 失败回调函数
         */
        CreateJudge(data, success, error) {
            api.GetPersonalApps("", "", "", "", function (data) {
                var nowCreateNum = data.total_count;
                module.LimitOfGame("", function (data) {
                    if (data.create_limit === -1) {
                        if (success) success({
                            message: "NoNeedVipUp"
                        });
                    }
                    else if (data.create_limit <= nowCreateNum) {
                        if (success) success({
                            message: "NeedVipUp"
                        });
                    }
                    else {
                        if (success) success({
                            message: "NoNeedVipUp"
                        });
                    }
                }, error);
            }, error);
        },

        /**
         * 获得待审核、审核中、审核通过未发布（定时）、已发布上线的作品数量
         * @param {Object} data{
         *            {int}num：总的作品数量
         *            {Object}list：第一次的作品列表
         * }
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetReleaseNum: function (data, success, error) {
            var num = data.num;
            var list = data.list.items;
            var releaseNum=0;
            if (num <= 100) {
                for (let i = 0; i < num; i++) {
                    if (list[i].flag === 0 || list[i].flag === 3 || list[i].flag === 7 || list[i].flag === 9) {
                        releaseNum++;
                    }
                }
                if (success) success({
                    num: releaseNum
                });
            }
            else {
                for (let i = 1, n = Math.ceil(num / 100); i <= n; i++) {
                    api.GetPersonalApps(i, 100, "", 1, function (data) {
                        for (let j = 0, k = data.item_count; j < k; j++) {
                            if (data.items[j].Info === 0 || list[i].Info === 3 || list[i].Info === 7 || list[i].Info === 9) {
                                releaseNum++;
                            }
                        }
                        if (i === n) {
                            if (success) success({
                                num: releaseNum
                            });
                        }
                    });
                }
            }
        },

        /**
         * 进行发布时数量判断
         * @param {Object} data{
         *               {String}app_id:将要发布的作品的appid
         * }
         * @param {Function} success 成功回调函数
         * @param {Function} error 失败回调函数
         */
        PublishJudge(data, success, error) {
            var app_id = data.app_id;
            api.GetPersonalAppInfo(app_id, function (Info) {
                var state = false;
                if (Info.flag === 0 || Info.flag === 3 || Info.flag === 7 || Info.flag === 9) {
                    state = true;
                }
                module.LimitOfGame("", function (data) {
                    if (data.release_limit === -1) {
                        if (success) success({
                            message: "NoNeedVipUp"
                        });
                    }
                    else {
                        api.GetPersonalApps("", 100, "", 1, function (list) {
                            var total = list.total_count;
                            module.GetReleaseNum({ num: total, list: list }, function (datas) {
                                var nowReleaseNum = datas.num;
                                if (nowReleaseNum >= data.release_limit) {
                                    if (state !== true) {
                                        if (success) success({
                                            message: "NeedVipUp"
                                        });
                                    }
                                    else {
                                        if (success) success({
                                            message: "NoNeedVipUp"
                                        });
                                    }
                                }
                                else {
                                    if (success) success({
                                        message: "NoNeedVipUp"
                                    });
                                }
                            }, error);
                        }, error);
                    }
                },error);  
            }, error);
        }

    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }    
}(Edbox,"OpusInfo"));