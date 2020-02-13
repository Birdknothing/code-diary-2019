window.onload = function () {
    onMessage();
};

var DataSet = {};   // 初始化数据集
var ParentIfmWindow = null;// 父页面
var Mode = 1;   //1 编辑器 2 游戏
var RankingIndex = 0;

// 重置时间自定义选择 Datas
var ResetTime = null;
// 重置周期 Datas
var ResetCycle = null;
// 历史排行周期 Datas
var HistoryData = null;
var HistoryDataValue = null;

var SortType = "Des";

/**
* 发送消息给父页面
* @param {String} Type 发送的消息类型
* @param {any} Datas 发送的消息
*/
function Send(Type, Datas) {
    var sendData = {
        Type: Type,
        Datas: Datas
    };
    ParentIfmWindow.postMessage(sendData, "*");
}
/**
* 添加事件监听
*/
function onMessage() {
    function messageCallBack(e) {
        ParentIfmWindow = e.source;
        console.log("Ranking子页面收到:" + JSON.stringify(e.data.Type));
        var data = e.data;
        // 【编辑器】 消息连接
        if (data && data.Type && data.Type === "Connect") {
            Send("Connect");
        }
        // 【编辑器】 初始化
        if (data && data.Type && data.Type === "Init") {
            RankingsManager.InitEditRank();
            // todo 联调时切换
            ParseInitDatas(data.Datas[0]);
            // ParseInitDatas(data.Datas[0].Datas[1]);
            for (var key in DataSet) {
                DataManager.HelperForData(DataSet[key]);
            }
            document.getElementById("bg").style.display = "block";
        }
        // 【编辑器】 数据更新
        if (data && data.Type && data.Type === "Update") {
            DataManager.HelperForData(data.Datas[0]);
        }
        // 【编辑器】 切换标签
        if (data && data.Type && data.Type === "TabClick") {
            if (data.Datas && data.Datas[0] && data.Datas[0].Class === "RankingItem") {
                RankingsManager.curRanking = data.Datas[0].ID;
                CheckRankStyle();
                RankingsManager.GetCurRanking().Datas = data.Datas[0];
                ParseInitDatas(data.Datas[0]);
            }
        }
        // 【编辑器】 新增排行榜
        if (data && data.Type && data.Type === "Add") {
            if (data.Datas && data.Datas[1] && data.Datas[1].Class === "RankingItem")
                AddNewRanking(data.Datas[1], "Add");
        }
        // 【编辑器】 删除排行榜
        if (data && data.Type && data.Type === "Delete") {
            if (data.Datas && data.Datas[0] && data.Datas[0].Class === "RankingItem") {
                var tempRankIndex = RankingsManager.Rankings[data.Datas[0].ID].domID;
                for (var i in RankingsManager.Rankings) {
                    if (RankingsManager.Rankings[i].domID > tempRankIndex) {
                        --RankingsManager.Rankings[i].domID;
                    }
                }
                --RankingIndex;
                delete RankingsManager.Rankings[data.Datas[0].ID];
                RankingsManager.Apply();
            }
        }
        // 【游戏】 设置好curRankUid后
        if (data && data.Type && data.Type === "curRankUid") {
            RankingsManager.ResetRankers();
        }
        // 【游戏】 接收处理DatasConfig
        if (data && data.Type && data.Type === "DatasConfig") {
            Mode = 2;
            (function () {
                if (data.Datas.Datas) {
                    for (var tmpData in data.Datas.Datas)
                        ParseInitDatas(data.Datas.Datas[tmpData]);
                }
                else {
                    // 兼容旧配置
                    for (var tmpData in data.Datas)
                        ParseInitDatas(data.Datas[tmpData]);
                }
                for (var key in DataSet) {
                    DataManager.HelperForData(DataSet[key]);
                }
                Send("Page", RankingsManager.Page.curPage);
                Send("Finish");
                document.getElementById("bg").style.display = "block";
            }());
        }
        // 【游戏】 接收ranker数据
        if (data && data.Type && data.Type === "Ranker") {
            RankingsManager.showRankers.splice(0, RankingsManager.showRankers.length);
            for (var j = 0; j < data.Datas.items.length; j++) {
                RankingsManager.showRankers.push(data.Datas.items[j]);
            }
            RankingsManager.MyRanking = data.Datas.my_ranking;
            RankingsManager.RankersLength = data.Datas.total_count;
            RankingsManager.GetPages();
            RankingsManager.Apply();
        }
    }
    window.addEventListener("message", messageCallBack, false);
}

/**
 * 处理初始化的数据
 * @param {Object} data 初始化数据
*/
function ParseInitDatas(data) {
    if (!data || !data.Type || !data.ID) return;

    if (!DataSet[data.ID])
        DataSet[data.ID] = data;

    if (!data.Datas) {
        DataManager.HelperForData(data);
        return;
    }

    if (data.Name === "RankingList") {
        // 处理多个排行榜
        (function () {
            for (var i in data.Datas) {
                AddNewRanking(data.Datas[i]);
            }
        }());
    }

    for (var i = 0; i < data.Datas.length; i++) {
        ParseInitDatas(data.Datas[i]);
    }
}

/**
 * 新增排行榜
 * @param {Object} data Tab03
 * @param {String} type 编辑/初始化下添加排行榜
*/
function AddNewRanking(data, type) {
    if (data.Class === "RankingItem") {
        var newRanking = {};

        if (type === "Add") {
            data.Datas[1].Datas[0].Value = data.ShowName;
            newRanking.RankingName = data.ShowName;
        }
        else
            newRanking.RankingName = data.Datas[1].Datas[0].Value;// 排行榜名称

        newRanking.ParamTitle = data.Datas[1].Datas[1].Value;// 参数标题
        newRanking.ParamSortBy = data.Datas[0].Datas[3].Key;// 排序方法
        newRanking.Total = data.Datas[0].Datas[4].Value;// 统计人数
        newRanking.Datas = data;// tab03层级的数据
        newRanking.domID = RankingIndex++;
        newRanking.RankUid = data.RankUid;

        RankingsManager.Rankings[data.ID] = newRanking;
        if (!RankingsManager.curRanking || type === "Add") {
            RankingsManager.curRanking = data.ID;
            if (RankingsManager.GetCurRanking().RankUid) {
                Send("curRankUid", RankingsManager.GetCurRanking().RankUid);
            }
            ParseInitDatas(data);
        }
        else {
            // 更新新排行榜的DatasConfig数据
            var old = RankingsManager.curRanking;
            RankingsManager.curRanking = data.ID;
            ParseInitDatas(data);
            RankingsManager.curRanking = old;
        }

        CheckRankStyle();
        newRanking.Datas.Datas[1].Datas[0].Value = newRanking.RankingName;
        Send("Update", [newRanking.Datas]);

        RankingsManager.Apply();
    }
}
/**
 * 切换标签样式修改
*/
function CheckRankStyle() {
    // var target = document.getElementById("rout-" + RankingsManager.GetCurRanking().domID);
    // if (target) {
    //     var doms = document.getElementsByClassName("rank-h2-c");
    //     for (var i = 0; i < doms.length; i++) {
    //         if (doms[i].classList.contains("on")) {
    //             doms[i].classList.remove("on");
    //             doms[i].firstElementChild.src = DataManager.RankBackgroundImage ? DataManager.RankBackgroundImage : " ";
    //             break;
    //         }
    //     }
    //     target.parentElement.classList.add("on");
    //     target.previousElementSibling.src = DataManager.OnRankBackgroundImage ? DataManager.OnRankBackgroundImage : " ";
    // }
}
/**
 * 点击切换标签事件
 * @param {Object} event 点击选中的元素
 * @param {String} rank 点击选中的rank
*/
function CheckRank(event, rank) {
    if (Mode === 1) return;
    RankingsManager.curRanking = rank.Datas.ID;
    CheckRankStyle();
    // 编辑模式
    if (Mode === 1) {
        // ParseInitDatas(RankingsManager.GetCurRanking().Datas);
        Send("ObjectClick", [rank.Datas]);
        RankingsManager.ResetRankers();
    }
    // 游戏模式
    if (Mode === 2) {
        Send("curRankUid", RankingsManager.GetCurRanking().RankUid);
    }
}
/**
 * 【游戏】点击关闭排行榜页面
*/
function CloseRank() {
    if (Mode === 1)
        return;
    console.log("关闭排行榜");
    Send("Close");
}
/**
 * 设置字体
 * @param {Object} dom 设置的dom元素
 * @param {Object} style data.Style
*/
function SetFont(dom, style) {
    if (dom && dom.style) {
        dom.style.color = style.fontColor;
        dom.style.fontSize = style.fontSize.size + "px";
        dom.style.fontWeight = style.fontStyle.bold ? "bold" : "normal";
        dom.style.fontStyle = style.fontStyle.italic ? "italic" : "normal";
        dom.style.textDecoration = style.fontStyle.underline ? "underline" : "";
    }
}
/**
 * 设置字体（按ID）
 * @param {String} id dom的id
 * @param {Object} style data.Style
*/
function SetFontWithId(id, style) {
    var dom = document.getElementById(id);
    SetFont(dom, style);
}
/**
 * 设置字体（按类）
 * @param {String} classId dom的class
 * @param {Object} style data.Style
*/
function SetFontWithClass(classId, style) {
    var doms = document.getElementsByClassName(classId);
    for (var i in doms) {
        var dom = doms[i];
        SetFont(dom, style);
    }
}

function GetRankFontStyle(type) {
    var style = null;
    if (type === "rankNumStyle") {
        style = DataManager.rankNumStyle;
    }
    if (type === "rankNameStyle") {
        style = DataManager.rankNameStyle;
    }
    if (type === "rankDataStyle") {
        style = DataManager.rankDataStyle;
    }
    if (style) {
        var obj = {
            "font-color": style.fontColor,
            "font-size": style.fontSize.size + "px",
            "font-weight": style.fontStyle.bold ? "bold" : "normal",
            "font-style": style.fontStyle.italic ? "italic" : "normal",
            "text-decoration": style.fontStyle.underline ? "underline" : ""
        }
        return obj;
    }
}

/**
* 数据管理
*/
var DataManager = {
    // 排行榜根源数据
    rootRankingID: "",
    // 是否开启排行榜
    Enable: "",
    // 显示用户头像
    showUserHead: true,
    // 显示用户名称
    showUserName: true,
    // 显示我的排名
    showMyRank: true,
    // 重置时间
    ResetRule: {
        unit: "天",
        TimeCycle: []
    },

    bgImage: "img/bg.jpg", //背景图
    no1Image: "img/n1.png", //第一名
    no2Image: "img/n2.png", //第二名
    no3Image: "img/n3.png", //第三名
    no4Image: "img/no4-bg.png", //其他名
    RankBackgroundImage: "img/btn.png", //按钮底图
    OnRankBackgroundImage: "img/btn-on.png", //按钮底图
    // 排行榜标题底色（竖版）
    rankBGcolor: "#716340",
    // 排行底色
    BGcolor: { "background-color": "#716340" },
    // 历史排行选择底色
    selectColor: { "background-color": "#716340" },
    // 排行榜标题
    mainRankTitle: "排行榜",
    // 排名标题
    rankTitle: "排名",
    // 用户名标题
    userTitle: "玩家",
    // 我的排名标题
    myRankTitle: "我的排名",
    // 排名数字样式
    rankNumStyle: null,
    // 排名玩家名字样式
    rankNameStyle: null,
    // 排名数据样式
    rankDataStyle: null,

    /**
     * 处理DatasConfig的数据
     * @param {Object} data 配置信息
     * @param {Function} success 加载完成成功回调
     */
    HelperForData: function (data, success) {
        if (DataSet[data.ID]) {
            DataSet[data.ID] = data;
            var name = data.Name;

            if (name === "Ranking") {
                DataManager.rootRankingID = data.ID;

                RankingsManager.InitEditRank();
                RankingsManager.curRanking = null;
                ParseInitDatas(data);
            }
            // 通用设置
            // if (name === "Enable") {
            //     if (data.Value && DataManager.Enable !== "") {
            //         // 添加_hide tab02->tab01 tab02->tab01 
            //         Send("Update", DataSet[DataManager.rootRankingID]);
            //     }
            //     if (!data.Value && DataManager.Enable !== "") {
            //         // 去除_hide tab01->tab02 tab01->tab02 
            //         Send("Update", DataSet[DataManager.rootRankingID]);
            //     }
            //     DataManager.Enable = data.Value;
            // }
            if (name === "ShowUserName") {
                DataManager.showUserName = data.Key === "true" ? true : false;
            }
            if (name === "ShowUserHead") {
                DataManager.showUserHead = data.Key === "true" ? true : false;
            }
            if (name === "ShowMyRank") {
                DataManager.showMyRank = data.Key === "true" ? true : false;
            }
            if (name === "ResetRule") {
                var tempResetTime = 1;
                if (data.Key === "1") {
                    DataManager.ResetRule.unit = "天";
                    tempResetTime = 1;
                }
                if (data.Key === "2") {
                    DataManager.ResetRule.unit = "周";
                    tempResetTime = 7;
                }
                if (data.Key === "3") {
                    DataManager.ResetRule.unit = "月";
                    tempResetTime = 30;
                }
                if (data.Key === "4") {
                    DataManager.ResetRule.unit = "季度";
                    tempResetTime = 90;
                }
                if (data.Key === "5") {
                    DataManager.ResetRule.unit = "年";
                    tempResetTime = 365;
                }
                if (data.Key === "7") {
                    DataManager.ResetRule.unit = "个历史排行";
                }
                if (data.Key === "6") {
                    DataManager.ResetRule.TimeCycle.splice(0, DataManager.ResetRule.TimeCycle.length);
                    DataManager.ResetRule.unit = "";
                    tempResetTime = 9999;
                }
                if (ResetTime) {
                    ResetTime.ReadOnly = data.Key === "7" ? false : true;
                    Send("Update", [ResetTime]);
                }
                if (ResetCycle) {
                    ResetCycle.ReadOnly = data.Key === "7" ? false : true;
                    if (data.Key !== "7")
                        ResetCycle.Value = tempResetTime;
                    Send("Update", [ResetCycle]);
                }
                if (HistoryData) {
                    HistoryData.ReadOnly = data.Key === "6" ? true : false;
                    HistoryData.Value = data.Key === "6" ? 0 : HistoryDataValue;
                    Send("Update", [HistoryData]);
                }
            }
            if (name === "ResetTime") {
                ResetTime = data;
            }
            if (name === "ResetCycle") {
                ResetCycle = data;
            }
            if (name === "ShowHistoryRankCount") {
                HistoryData = data;
                HistoryDataValue = data.Value;
                DataManager.ResetRule.TimeCycle.splice(0, DataManager.ResetRule.TimeCycle.length);
                for (var i = 0; i < data.Value; i++) {
                    var tmp = i + 1;
                    DataManager.ResetRule.TimeCycle.push({ id: tmp, name: "前" + tmp });
                }
            }

            // 通用界面设置-界面
            if (data.Type === "Image01" && data.Value === null)
                data.Value = "";
            if (name === "BackgroundImage") {
                DataManager.bgImage = data.Value;
            }
            if (name === "No1Image") {
                DataManager.no1Image = data.Value;
            }
            if (name === "No2Image") {
                DataManager.no2Image = data.Value;
            }
            if (name === "No3Image") {
                DataManager.no3Image = data.Value;
            }
            if (name === "No4Image") {
                DataManager.no4Image = data.Value;
            }
            if (name === "RankBackgroundImage") {
                DataManager.RankBackgroundImage = data.Value;
            }
            if (name === "OnRankBackgroundImage") {
                DataManager.OnRankBackgroundImage = data.Value;
            }
            if (name === "RankBackgroundColor" && data.Value) {
                DataManager.rankBGcolor = data.Value;
                DataManager.selectColor["background-color"] = data.Value;
            }
            if (name === "BackgroundColor" && data.Value) {
                DataManager.BGcolor["background-color"] = data.Value;
            }

            // 通用界面设置-文本
            if (name === "MainRankTitle") {
                DataManager.mainRankTitle = data.Value;
                SetFontWithId("h1", data.Style);
            }
            if (name === "RankTitle") {
                DataManager.rankTitle = data.Value;
                SetFontWithId("th1", data.Style);
            }
            if (name === "UserTitle") {
                DataManager.userTitle = data.Value;
                SetFontWithId("th2", data.Style);
            }
            if (name === "MyRankTitle") {
                DataManager.myRankTitle = data.Value;
                SetFontWithId("h3", data.Style);
            }
            if (name === "NumberStyle") {
                DataManager.rankNumStyle = data.Style;
                SetFontWithClass("rankingNum", data.Style);
            }
            if (name === "UserNameStyle") {
                DataManager.rankNameStyle = data.Style;
                SetFontWithClass("td2", data.Style);
            }
            if (name === "UserDataStyle") {
                DataManager.rankDataStyle = data.Style;
                SetFontWithClass("td3", data.Style);
            }
            if (name === "PageStyle") {
                SetFontWithClass("rank-page", data.Style);
                SetFontWithClass("page-a", data.Style);
            }

            // 排行榜列表-参数
            if (name === "LimitDimension") {
                (function () {
                    var curRanking = RankingsManager.GetCurRanking();
                    if (curRanking.Datas.Datas[0].Datas[0].ID === data.ID) {
                        curRanking.Datas.Datas[0].Datas[0].Key = data.Key;
                    }
                }());
            }
            if (name === "LimitRange") {
                (function () {
                    var curRanking = RankingsManager.GetCurRanking();
                    if (curRanking.Datas.Datas[0].Datas[1].ID === data.ID) {
                        curRanking.Datas.Datas[0].Datas[1].Value = data.Value;
                    }
                }());
            }
            if (name === "SortParam") {
                (function () {
                    var curRanking = RankingsManager.GetCurRanking();
                    if (curRanking.Datas.Datas[0].Datas[2].ID === data.ID) {
                        curRanking.Datas.Datas[0].Datas[2].Key = data.Key;
                    }
                }());
            }
            if (name === "ParamSortBy") {
                (function () {
                    var curRanking = RankingsManager.GetCurRanking();
                    if (curRanking.Datas.Datas[0].Datas[3].ID === data.ID) {
                        curRanking.Datas.Datas[0].Datas[3].Key = data.Key;
                        curRanking.ParamSortBy = data.Key;
                        RankingsManager.SortBy(curRanking.ParamSortBy);
                    }
                }());
            }
            if (name === "CountNumber") {
                (function () {
                    var curRanking = RankingsManager.GetCurRanking();
                    if (curRanking.Datas.Datas[0].Datas[4].ID === data.ID) {
                        curRanking.Datas.Datas[0].Datas[4].Value = data.Value;
                        curRanking.Total = data.Value;
                        RankingsManager.ResetRankers();
                    }
                }());
            }
            // 排行榜列表-文本
            if (name === "Name") {
                (function () {
                    var curRanking = RankingsManager.GetCurRanking();
                    if (curRanking.Datas.Datas[1].Datas[0].ID === data.ID) {
                        curRanking.Datas.Datas[1].Datas[0].Value = data.Value;
                        curRanking.RankingName = data.Value;
                        if (data.Style) {
                            curRanking.Datas.Datas[1].Datas[0].Style = data.Style;
                            SetFontWithId("rout-" + curRanking.domID, data.Style);
                        }
                        // 同步tab03 showName
                        curRanking.Datas.ShowName = data.Value;
                        Send("Update", [curRanking.Datas]);
                    }
                }());
            }

            if (name === "ParamTitle") {
                (function () {
                    var curRanking = RankingsManager.GetCurRanking();
                    if (curRanking.Datas.Datas[1].Datas[1].ID === data.ID) {
                        curRanking.Datas.Datas[1].Datas[1].Value = data.Value;
                        curRanking.Datas.Datas[1].Datas[1].Style = data.Style;
                        curRanking.ParamTitle = data.Value;
                        if (data.Style) {
                            curRanking.Datas.Datas[1].Datas[1].Style = data.Style;
                            SetFontWithId("th3", data.Style);
                        }
                    }
                }());
            }

            DataManager.Apply();
            if (success)
                success();
        }
    }
};

/**
* 排行榜管理
*/
var RankingsManager = {
    // 当前所有排行榜
    Rankings: {
        // "1": {
        //     RankingName: "",
        //     ParamTitle: "",
        //     Total: 100,
        //     ParamSortBy: "Des",
        //     Datas: [],
        //     domID: "dom标签的ID",
        // }
        // 当前编辑的排行榜id
    },
    curRanking: null,
    // 我的排名
    MyRanking: 1,
    // 【游戏】 rankers总数量
    RankersLength: 0,
    // 所有排行榜玩家数据
    allRankers: null,
    // 页面信息
    Page: {
        curPage: 1,   // 当前显示页
        perPage: 10,   // 每一页显示的数据量
        sumPage: 1    // 总显示页数量
    },
    // 将显示的排行榜数据
    showRankers: [],
    /**
     * 创建假数据
     * @param {Number} nums 需要生成的数据数量
     * @param {String} sortby 排序数据
     */
    CreatFakeRankers: function (nums, sortby) {
        RankingsManager.allRankers = [];
        if (!nums)
            nums = 100;
        for (var i = 0; i < nums; i++) {
            var temp = {};
            temp.player_avatar = "img/pic.jpg";
            temp.player_name = "player";
            temp.ranking = Number(i) + 1;
            if (sortby === "Des")
                temp.score = 99999 - i;
            else
                temp.score = i + 1;
            RankingsManager.allRankers.push(temp);
        }
        RankingsManager.GetPages();
        RankingsManager.Page.curPage = 1;
        Send("Page", 1);
    },
    /**
     * 获取排行榜页数
     */
    GetPages: function () {
        var tempLength = 0;
        if (Mode === 1) {
            tempLength = RankingsManager.allRankers.length;
        }
        else if (Mode === 2) {
            tempLength = RankingsManager.RankersLength;
        }
        RankingsManager.Page.sumPage = parseInt(tempLength / RankingsManager.Page.perPage);
        if (tempLength === 0 || tempLength % RankingsManager.Page.perPage)
            RankingsManager.Page.sumPage += 1;
    },
    /**
     * 获取排行榜内信息
     * 若有信息，则返回真信息；若无则返回编辑器用假信息
     */
    GetRankers: function () {
        RankingsManager.showRankers.splice(0, RankingsManager.showRankers.length);

        var start = (RankingsManager.Page.curPage - 1) * RankingsManager.Page.perPage;

        for (var i = start; i < start + RankingsManager.Page.perPage && i < RankingsManager.allRankers.length; i++) {
            RankingsManager.showRankers.push(RankingsManager.allRankers[i]);
        }
    },

    /**
     * 重置排行榜内信息
    */
    ResetRankers: function () {
        if (Mode === 1) {
            if (RankingsManager.curRanking) {
                RankingsManager.CreatFakeRankers(RankingsManager.GetCurRanking().Total, SortType);
            }
            RankingsManager.GetPages();
            RankingsManager.Page.curPage = 1;
            if (RankingsManager.curRanking)
                RankingsManager.SortBy(RankingsManager.GetCurRanking().ParamSortBy);
        }
        if (Mode === 2) {
            RankingsManager.Page.curPage = 1;
            Send("Page", 1);
        }
    },
    /**
     * 排序
     * @param {String} type 排序方式
    */
    SortBy: function (type) {
        if (Mode === 1) {
            SortType = type;
            RankingsManager.CreatFakeRankers(RankingsManager.GetCurRanking().Total, type);
            RankingsManager.GetRankers();
        }
    },
    /**
     * 点击查看下一页数据
     */
    NextPage: function () {
        if (RankingsManager.Page.curPage < RankingsManager.Page.sumPage) {
            RankingsManager.Page.curPage++;
            if (Mode === 1)
                RankingsManager.GetRankers();
            else if (Mode === 2) {
                Send("Page", RankingsManager.Page.curPage);
            }
        }
    },
    /**
     * 点击查看下一页数据
     */
    LastPage: function () {
        if (RankingsManager.Page.curPage > 1) {
            RankingsManager.Page.curPage--;
            if (Mode === 1)
                RankingsManager.GetRankers();
            else if (Mode === 2) {
                Send("Page", RankingsManager.Page.curPage);
            }
        }
    },
    /**
     * 查看历史数据
     * @param {Number} history_index 历史数据编号
     */
    ChangeHistory: function (history_index) {
        if (history_index === null)
            history_index = 0;
        console.log("查看历史数据" + history_index);
        RankingsManager.Page.curPage = 1;
        if (Mode === 2)
            Send("History", history_index);
    },
    /**
     * 【编辑器】初始化排行榜内数据
     */
    InitEditRank: function () {
        RankingIndex = 0;
        if (RankingsManager.allRankers === null) {
            RankingsManager.CreatFakeRankers(100, SortType);
        }
        for (var i in RankingsManager.Rankings) {
            delete RankingsManager.Rankings[i];
        }
        RankingsManager.GetRankers();
    },
    /**
     * @return {Object} 返回当前编辑排行榜的信息
    */
    GetCurRanking: function () {
        if (RankingsManager.curRanking)
            return RankingsManager.Rankings[RankingsManager.curRanking];
    }
};
var app = angular.module("Edbox_Rank", []);
app.controller("DatasCtrl", ["$scope", function ($scope) {
    $scope.DataManager = DataManager;
    $scope.RankingsManager = RankingsManager;
    $scope.DataManager.Apply = function () {
        $scope.$apply();
    };
    $scope.RankingsManager.Apply = function () {
        $scope.$apply();
    };
    $scope.Rankers = RankingsManager.showRankers;
    $scope.Rankings = RankingsManager.Rankings;
    $scope.Page = RankingsManager.Page;
    $scope.CheckRank = CheckRank;
    $scope.ResetRule = DataManager.ResetRule;
    $scope.ChangeHistory = RankingsManager.ChangeHistory;
    $scope.CloseRank = CloseRank;
    $scope.GetRankFontStyle = GetRankFontStyle;
}]);