// import request from '../../../utils/request';
import req from '../../../utils/req';
const {Edbox} = window

export function getDetail(payload) { 
    const { id } = payload
    var data = {};
    data.appid = id;
    //使用req() 请求edbox方法的数据，requst()获取mock数据
    return req(Edbox.Lobby.GetExperienceAppInfo, data);
    // var data = { // 请求参数
    //     id: '',//游戏id
    // }
    // '/api/getDetail' //返回参数定义(yfb.js查看)
    // return request(`/api/getDetail?post=${id}`);
}

export function gameCollect(payload) { //收藏游戏，当游戏未收藏时可以调用

    // var data = { // 请求参数
    //     id: '',//游戏id
    // }
    // '/api/gameCollect' //返回参数定义(yfb.js查看)
    const { id } = payload
    var data = {};
    data.appid = id;
    //使用req() 请求edbox方法的数据，requst()获取mock数据
    return req(Edbox.Lobby.CollectApp, data);
}

export function gameCollectCancel(payload) { //取消收藏，当游戏收藏时可以调用

    // var data = { // 请求参数
    //     id: '',//游戏id
    // }
    // '/api/gameCollectCancel' //返回参数定义(yfb.js查看)
    const { id } = payload
    var data = {};
    data.appid = id;
    //使用req() 请求edbox方法的数据，requst()获取mock数据
    return req(Edbox.Lobby.CancelCollectApp, data);
}

export function gameExport(payload) { //导出游戏，两种格式apk、exe

    // var data = { // 请求参数
    //     id: '',//游戏id
    //     file_typs: 'apk', //游戏格式 apk、exe
    // }
    // '/api/gameExport' //返回参数定义(yfb.js查看)
}

export function gameReview(payload) { //游戏打分

    // var data = { // 请求参数
    //     id: '',//游戏id
    //     score: 1, //游戏分数 1:1星，2:2星，3:3星，4:4星，5:5星
    //     score: version, //游戏版本， 详情里的ver字段
    // }
    // '/api/gameReview' //返回参数定义(yfb.js查看)
    const { id,score,version } = payload
    var data = {};
    data.appid = id;
    data.score = score;
    data.version = version;
    //使用req() 请求edbox方法的数据，requst()获取mock数据
    return req(Edbox.Lobby.SetAppScore, data);

}

export function getGameRecentUpdate(payload) { //游戏版本记录

    const { id } = payload
    var data = {};
    data.appid = id;
    return req(Edbox.Lobby.GetGameRecentUpdates, data);
    // var data = { // 请求参数
    //     id: '',//游戏id
    // }
    // '/api/getGameRecentUpdate' //返回参数定义(yfb.js查看)
    // return request(`/api/getGameRecentUpdate?id=${id}`);
}

export function getGameOriginalTpl(payload) { //获取详情页游戏原始模板
     const { id, version } = payload
    var data = {};
    data.baseid = id;
    data.base_version = version;
    return req(Edbox.Lobby.GetGameOriginalTpl, data);

    // var data = { // 请求参数
    //     id: '',//游戏id
    // }
    // '/api/getGameOriginalTpl' //返回参数定义(yfb.js查看)
    // return request(`/api/getGameOriginalTpl?id=${id}`);
}

export function getGameSameTpl(payload) { //获取详情页游戏相同模板游戏
     const { id } = payload
    var data = {};
    data.appid = id;
    return req(Edbox.Lobby.GetGameSameTpl, data);

    // var data = { // 请求参数
    //     id: '',//游戏id
    // }
    // '/api/getGameSameTpl' //返回参数定义(yfb.js查看)
    // return request(`/api/getGameSameTpl?id=${id}`);
}

export function complainGame(payload) { //举报游戏
    const { id, userId, version, content, description } = payload
	var data = {};
    data.gameId = id;
    data.playerId = userId;
    data.gameVersion = version;
    data.reportContent = content;
    data.reportDesc = description;
    // var data = { // 请求参数
    //     id: '',//被举报的游戏id
    //     userId: '',//用户id
    //     version: '',//版本
    //     content: ["游戏封面", "更新说明", "游戏截图", "游戏有效"],//举报内容
    //     description: ''//内容描述
    // }
    // '/api/complainGame' //返回参数定义(yfb.js查看)
    //return request(`/api/complainGame?id=${JSON.stringify(payload)}`);
	return req(Edbox.Lobby.ReportApp,data);
}

export function getDetailTags(payload) { //获取标签
    const { id } = payload
    // var data = { // 请求参数
    //     id: '',//对应详情的id
    // }
    // '/api/getTags' //返回参数定义(yfb.js查看)
    // return request(`/api/getTags?id=${id}`);
    var data = {};
    data.appid = id;
    return req(Edbox.Lobby.GetAppTags, data);
}

// 获取我的作品详情
export function getMyWorkPersonalAppInfo(payload){
  const { id} = payload;
  var data = {};
  data.appid = id;
  return req(Edbox.Lobby.GetPersonalAppInfo, data);
}

/**
 * 获取用户当前评分
 * @param {obj} payload 
 */
export function getUserScoreInfo(payload){
    return req(Edbox.Lobby.GetUserScoreInfo, payload)
}