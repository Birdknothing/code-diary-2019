// Edbox 排行榜交互
(function (namespace, className) {
    var action = Edbox.Action.Ranking;
    var RankingsData = {}; // rank_uuid ： pack包数据
    var MapEditRank = {}; // rank_uuid ： 编辑库排行榜id
    var MapReleaseRank = {}; // rank_uuid ： 发布库排行榜id

    var curHistory = 0; //需要重置
    var curPage = 1;    //需要重置

    var InitMode = true; // 判断是否已经初始化
    var isError = -1; // 判断排行榜异常 -1 : 无异常，  0：无GameId  1：DatasConfig异常 2:无发布排行榜
    var isClick = true;  // 防止显示排行榜多次点击

    var RankingIfm = null;
    var RankingUrl = "/coms/Ranking/index.html";

    var ShowSuccess = null; // 注册显示成功回调
    var ShowError = null;   // 注册显示失败回调

    /**
	 * 向加载页发送消息
     * @param {document} dom 操作的元素
     * @param {String} Type 发送的消息类型
     * @param {any} Datas 发送的消息
	 */
    function Send(dom, Type, Datas) {
        if (dom) {
            var data = {
                Type: Type,
                Datas: Datas
            };
            dom.contentWindow.postMessage(data, "*");
        }
    }
    /**
     * 初始化子页面
     */
    function InitIfm() {
        // 创建排行榜iframe
        RankingIfm = document.createElement("iframe");
        var tempURL = Edbox.Protocol + "://" + Edbox.GetHost("Component") + RankingUrl + "?v=" + new Date().getTime();
        RankingIfm.setAttribute("src", tempURL);
        RankingIfm.setAttribute("allowtransparency", "true");
        RankingIfm.style.backgroundColor = "transparent";
        RankingIfm.style.top = "0";
        RankingIfm.style.left = "0";
        RankingIfm.style.position = "fixed";
        RankingIfm.style.height = "100%";
        RankingIfm.style.width = "100%";
        RankingIfm.style.borderWidth = "0px";
        RankingIfm.style.display = "none";
        document.body.appendChild(RankingIfm);
    }
    /**
     * 关闭排行榜
     */
    function CloseRanking() {
        RankingIfm.style.display = "none";
    }
    /**
     * 显示排行榜
     */
    function ShowRanking() {
        RankingIfm.style.display = "block";
    }
    // 获取游戏信息
    function getGameInfo(success, error) {
        Edbox.MMO.GetGameInfo(Edbox.GameId, Edbox.Version, Edbox.Access, Edbox.Mode, function (data) {
            if (data) {
                Edbox.ServerInfo = data;
                pkg = Edbox.GetQueryString("pkg");
                if (pkg) {
                    Edbox.PackageGuid = pkg;
                }
                else {
                    Edbox.PackageGuid = data.pkg_resid;
                }
                if (success) success();
            }
            else {
                console.error("Edbox.MMO.GetGameInfo 无值");
                if (error) error("Edbox.MMO.GetGameInfo 无值");
            }
        }, error);
    }
    /**
     * 获取DataConfig中排行榜数据
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    function GetDataConfig(success, error) {
        var timer = setInterval(function () {
            if (Edbox.PackageGuid) {
                Edbox.Resource.GetConfig("DatasConfig",
                    function (data) {
                        if (!data || !data.StaticData || !data.StaticData.Ranking) {
                            // 无排行榜信息
                            console.error("无排行榜相关的配置信息");
                            if (error) error("无排行榜相关的配置信息");
                        }
                        else if (success) {
                            success(data);
                        }
                    }
                );
                clearInterval(timer);
                clearTimeout(timeOut);
            }
        }, 200);

        var timeOut = setTimeout(function () {
            console.error("无PAKAGEGUID！");
            if (error) error("无PAKAGEGUID！");
            clearInterval(timer);
        }, 10000);
    }
    /**
     * 初始化排行榜信息
     */
    function InitRankings() {
        if (!Edbox.GameId) {
            isError = 0;
            isClick = true;
            if (ShowError) ShowError(isError);
            return;
        }

        action.GetReleaseConfigList(function (data) {
            if (data && data.items && data.items.length > 0) {
                for (var item in data.items) {
                    MapReleaseRank[data.items[item].rank_uuid] = data.items[item].id;
                }
                getGameInfo(
                    function () {
                        GetDataConfig(
                            function (data) {
                                var arrDatas = null;
                                if (data.StaticData.Ranking && data.StaticData.Ranking.Datas) {
                                    arrDatas = data.StaticData.Ranking.Datas[2].Datas;
                                }
                                else {
                                    isError = 1;
                                    isClick = true;
                                    console.error("DatasConfig has no Ranking");
                                    if (ShowError) ShowError(isError);
                                    return;
                                }
                                for (var i in arrDatas) {
                                    RankingsData[arrDatas[i].RankUid] = arrDatas[i];
                                }
                                InitIfm();
                                RankingIfm.onload = function () {
                                    Send(RankingIfm, "lang", Edbox.Language);
                                    Send(RankingIfm, "DatasConfig", data.StaticData.Ranking);
                                };
                            });
                    });
            }
            else {
                isError = 2;
                isClick = true;
                console.error("No release ranking info");
                if (ShowError) ShowError(isError);
            }
        });

        action.GetEditConfigList(function (data) {
            if (data && data.items && data.items.length > 0) {
                for (var item in data.items) {
                    MapEditRank[data.items[item].rank_uuid] = data.items[item].id;
                }
            }
            else {
                console.error("No editor ranking info");
            }
        });
    }
    /**
     * 初始化监听消息
     */
    function onMessage() {
        function messageCallBack(e) {
            var data = e.data;
            if (data && data.Type && data.Type === "GetRankers") {
                curPage = data.Datas.page;
                curHistory = data.Datas.history;
                curRankUid = data.Datas.rankUid;
                GetRankers(curPage, curHistory, curRankUid);
            }
            if (data && data.Type && data.Type === "Finish") {
                ShowRanking();
                isClick = true;
                if (ShowSuccess) success();
            }
            if (data && data.Type && data.Type === "Close") {
                CloseRanking();
                window.removeEventListener("message", messageCallBack, false);
            }
        }
        window.addEventListener("message", messageCallBack, false);
    }
    /**
     * 获取排行榜内列表信息
     * @param {Number} page 第N页 默认值1 
     * @param {Number} history 历史数据
     * @param {String} curRankUid 当前排行榜rankuID
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
    */
    function GetRankers(page, history, curRankUid, success, error) {
        var id = MapReleaseRank[curRankUid];
        if (!id) return;
        var size = 10;
        action.GetList(id, page, size, history, function (data) {
            // 发送给ranking页面
            data.RankUid = curRankUid;
            Send(RankingIfm, "Ranker", data);
            if (success) {
                success(data);
            }
        }, error);
    }
    /**
     * 处理第一次重置时间戳问题yymmddhhmmss
     * @param {String} timeString 控件获取的时间值
     * @returns {String} 返回时间戳
     */
    function HandleDate(timeString) {
        try {
            if (timeString && typeof timeString === "string") {
                timeString = timeString.replace(/[.]/g, "-");
                return new Date(timeString).toISOString().split("-").join("").split("T").join("").split(":").join("").split(".")[0];
            }
            else {
                return "20000101000000";
            }
        } catch (e) {
            return "20000101000000";
        }
    }
    /**
     * 处理重置时间戳问题hhmmss
     * @param {String} timeString 控件获取的时间值
     * @returns {String} 返回时间戳
     */
    function HandleTime(timeString) {
        if (timeString !== "") {
            var tmp = "2019-01-02 " + timeString;
            return new Date(tmp).toISOString().split("-").join("").split("T").join("").split(":").join("").split(".")[0].slice(8);
        }
        return "";
    }
    /**
     * 创建、更新排行榜 设置属性通用方法
     * @param {Array} GeneralData 通用属性
     * @param {Object} data 属性
     * @returns {Object} 返回属性param
     */
    function HandleSaveRank(GeneralData, data) {
        var score_param_value = data.Datas[0].Datas[2].Key ? data.Datas[0].Datas[2].Key : data.Datas[0].Datas[2].Keys[0];
        var limit_scope_value = data.Datas[0].Datas[0].Key;
        var limit_scope_param_value = JSON.stringify(data.Datas[0].Datas[1].Value);
        var param_order = data.Datas[0].Datas[3].Key === "Des" ? 1 : 0;
        var range_max = data.Datas[0].Datas[4].Value;

        // 通用
        var open = GeneralData[0].Datas[0].Value ? 1 : 0;
        var first_reset_datetime = HandleDate(GeneralData[0].Datas[4].Value);
        var rank_type = GeneralData[0].Datas[5].Key - "0";
        var reset_time = rank_type === 7 ? HandleTime(GeneralData[0].Datas[6].Value) : "";
        var reset_cycle = GeneralData[0].Datas[7].Value;
        var show_history = GeneralData[0].Datas[8].Value ? 1 : 0;
        var history_long = show_history ? GeneralData[0].Datas[8].Value : 0;

        var param = {
            score_param_value: score_param_value,
            limit_scope_value: limit_scope_value,
            limit_scope_param_value: limit_scope_param_value,
            range_max: range_max,
            param_order: param_order,

            open: open,
            first_reset_datetime: first_reset_datetime,
            rank_type: rank_type,
            reset_time: reset_time,
            reset_cycle: reset_cycle,
            show_history: show_history,
            history_long: history_long
        };

        return param;
    }
    /**
     * Edbox 排行榜交互
     * @author 陈彬舰(110181)
     * */
    var module = {
        // 排行榜id : rankuid
        rankidMap: {},
        /**
         * 删除排行榜配置
         * @param {String} rankUid 排行榜rank_uuid
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        DeleteRanking: function (rankUid, success, error) {
            if (!rankUid)
                return;
            action.GetEditConfigList(function (data) {
                if (data && data.items && data.items.length > 0) {
                    for (var item in data.items) {
                        MapEditRank[data.items[item].rank_uuid] = data.items[item].id;
                    }
                }

                if (MapEditRank[rankUid])
                    action.DeleteConfig(MapEditRank[rankUid], success, error);
                else {
                    console.error("删除排行榜失败 rankUid不存在.");
                    if (error) error("删除排行榜失败 rankUid不存在.");
                }
            });
        },
        /**
         * 创建新排行榜
         * @param {String} GameId 作品id
         * @param {Array} GeneralData 通用属性
         * @param {Object} data 属性
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        CreateRanking: function (GameId, GeneralData, data, success, error) {
            var param = HandleSaveRank(GeneralData, data);
            action.CreateRanking(GameId, param, success, error);
        },
        /**
         * 设置排行榜信息
         * @param {String} GameId 作品id
         * @param {Array} GeneralData 通用属性
         * @param {Object} uuid 排行榜uuid
         * @param {Object} data 属性
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        RefreshRanking: function (GameId, GeneralData, uuid, data, success, error) {
            action.GetEditConfigList(function (listData) {
                if (listData && listData.items && listData.items.length > 0) {
                    for (var item in listData.items) {
                        MapEditRank[listData.items[item].rank_uuid] = listData.items[item].id;
                    }
                }
                var id = MapEditRank[uuid];
                var param = HandleSaveRank(GeneralData, data);
                action.RefreshRanking(GameId, id, param, success, error);
            });
        },
        /**
         * 上传排行数据
         * @param {Object} postData 上传数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        Post: function (postData, success, error) {
            action.GetReleaseConfigList(function (data) {
                if (data && data.items && data.items.length > 0) {
                    for (var item in data.items) {
                        var Key = data.items[item].limit_scope_value;
                        var ScoreParam = data.items[item].score_param_value;
                        var value = [-1, -1];
                        if (data.items[item].limit_scope_param_value)
                            value = JSON.parse(data.items[item].limit_scope_param_value);
                        var minV = value[0];
                        var maxV = value[1];
                        MapReleaseRank[data.items[item].rank_uuid] = data.items[item].id;

                        if (Key && ScoreParam && postData[Key] && postData[ScoreParam] && postData[Key] >= minV && postData[Key] <= maxV) {
                            var ids = data.items[item].id + "";
                            action.SaveScore(Edbox.GameId, ids, postData[ScoreParam], JSON.stringify(postData), success, error);
                        }
                    }
                }
            });
        },
        /**
         * 打开排行榜页面
         * @param {Function} success 成功回调
         * @param {Function} error 失败回调
         */
        Show: function (success, error) {
            if (!isClick) return;
            ShowSuccess = success;
            ShowError = error;
            // 在close事件里移除监听
            onMessage();
            if (InitMode) {
                InitMode = false;
                isClick = false;
                InitRankings();
            }
            else {
                if (isError !== -1) {
                    if (ShowError) ShowError(isError);
                    return;
                }
                Send(RankingIfm, "Show");
            }
        },
        /**
         * 判断是否打开排行榜
         * @param {Function} success 可打开排行榜的成功回调
         * @param {Function} error   不可打开排行榜的失败回调
         */
        JudgeOpenRanking: function (success, error) {
            getGameInfo(function () {
                GetDataConfig(function (data) {
                    // 判断是否开启排行榜
                    if (data.StaticData.Ranking.Datas) {
                        if (!data.StaticData.Ranking.Datas[0].Datas[0].Value) {
                            if (error) error();
                            return;
                        }
                    }// 兼容旧配置
                    else if (!data.StaticData.Ranking[0].Datas[0].Value) {
                        if (error) error();
                        return;
                    }
                    if (success) {
                        success(data);
                    }
                }, error);
            }, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Ranking"));