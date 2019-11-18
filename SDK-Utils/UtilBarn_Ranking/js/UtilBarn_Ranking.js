/**
 * UtilBarn 通用排行榜组件
 * 用于UtilBarn平台游戏排行榜的统一使用
 * @author 温荣泉(201901)
 * @version 1.0.1 (2019年3月12日)
 * @see http://ndsdn.nd.com.cn/index.php?title=UtilBarn%E9%80%9A%E7%94%A8%E6%8E%92%E8%A1%8C%E6%A6%9C%E7%BB%84%E4%BB%B6Html5%E7%89%88
 * Js需求:
 *      jquery
 *      CryptoJS
 *      UtilBarn
 *      UtilBarn_Request
 * */
UtilBarn.Ranking = {
    /**
     * 排行榜ID
     */
    ID: "10",

    /**
     * 显示排行榜界面
     */
    Show: function () {
        var url = UtilBarn.Ranking.ComponentPath + "page/";

        url = UtilBarn.SetQueryString("UtilBarnArgs", UtilBarn.GetLoginInfo(), url);

        var com = document.createElement("iframe");
        com.style.overflow = "hidden";
        com.style.position = "fixed";
        com.style.top = "0";
        com.style.left = "0";
        com.style.height = "100%";
        com.style.width = "100%";
        com.style.margin = "0";
        com.style.padding = "0";
        com.style.border = "0";
        com.style.zIndex = "100";
        com.setAttribute("src", url);
        document.body.appendChild(com);

        function hide(data) {
            if (data.data === "UtilBarn.Ranking.Hide") {
                document.body.removeChild(com);
                window.removeEventListener('message', hide, false);
            }
        }

        // 跨域监听
        window.addEventListener('message', hide, false);
    },

    /**
     * 隐藏排行榜界面
     */
    Hide: function () {
        window.postMessage("UtilBarn.Ranking.Hide", '*');
    },

    /**
     * 获取排行榜列表
     * @param {Number} page 第几页列表
     * @param {Number} size 每页几个数据
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    Get: function (page, size, success, error) {
        var data = "id=" + UtilBarn.Ranking.ID + "&player_id=" + UtilBarn.EbUserId + "&page=" + page + "&size=" + size;
        var url = "/v0.1/api/rank/rank/actions/get_list";
        UtilBarn.Request.Get(UtilBarn.GetHost("MMO"), url, data, success, error);
    },

    /**
     * 提交玩家分数
     * @param {Number} score 玩家分数
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    Post: function (score, success, error) {
        var data = new Object();
        data.ids = UtilBarn.Ranking.ID;
        data.app_id = UtilBarn.GameId;
        data.player_id = UtilBarn.EbUserId - 0;
        data.player_name = UtilBarn.UserName;
        data.player_avatar = UtilBarn.Avatar;
        data.last_play_time = new Date().toDateString();
        data.score = score;
        var url = "/v0.1/api/rank/rank/actions/save_score";
        UtilBarn.Request.Post(UtilBarn.GetHost("MMO"), url, JSON.stringify(data), success, error);
    }
};

// 初始化组件路径
UtilBarn.InitPath(UtilBarn.Ranking);