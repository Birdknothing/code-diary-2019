// import request from '../../../utils/request';
import req from '../../../utils/req';

const { Edbox } = window

/**
 * 获取发布原始数据用于初始化展示
 * @param {object} payload 
 */
export function getPublishOrigin(payload) {
    // id: 发布的游戏id
    //'GET /api/publishOrigin' (yfb.js文件查看接口定义)
    const { id } = payload
    var data = {}
    data.appId = id
    return req(Edbox.Lobby.GetPublishOrigin,data)
    // return request(`/api/publishOrigin?id=${id}`);
}

// /**
//  * 从游戏详情获取标签包含游戏、教育、其他标签
//  * @param {object} payload 
//  */
// export function getTags(payload) {
//     // id: 发布的游戏id
//     //'GET /api/publishOriginTags' (yfb.js文件查看接口定义)
//     const { id } = payload
//     return request(`/api/publishOriginTags?id=${id}`);
// }

/**
 * 获取用户剩余发布时间
 * @param {*} payload 
 */
export function getPublishCountDown(payload){
    var data = ''
    return req(Edbox.Lobby.GetPublishCountDown,data)
}

/**
 * 发布游戏
 * @param {object} payload
 */
export function postGameInfo(payload){
    const { 
        id,//游戏id
        game_icon,
        game_name, //游戏名称
        introduction, //游戏描述简介
        tags, //游戏标签 obj
        ver, //游戏平台
        immediately, //是否立即发布 true:立即发布 false:定时发布
        publish_date, // 定时发布时传 发布时间
        game_update, //更新内容
        screenshot //截图传图片id数组 array
    } = payload

    // tags:{ //游戏标签格式 obj
    //     tags_game:[{
    //         id: 'T232323', //标签id 新增标签 id为空
    //         value: '' //标签值
    //     }],
    //     tags_edu:[],
    //     tags_other:[]
    // }

    var data = {}
    data.id = id;
    data.game_icon = game_icon;
    data.game_name = game_name;
    data.introduction = introduction;
    data.tags = tags
    data.ver = ver;
    data.immediately = immediately;
    data.publish_date = publish_date;
    data.game_update = game_update;
    data.screenshot = screenshot;
    return req(Edbox.Lobby.PublishApp,data)
}

/**
 * 添加标签
 * @param {obj} payload 
 */
export function addTag(payload){
    const { value } = payload
    // var data = value
    return req(Edbox.Lobby.AddTag,value)
}

/**
 * 删除标签
 * @param {obj} payload 
 */
export function deleteTag(payload){
    const { value } = payload
    // var data = value
    return req(Edbox.Lobby.DeleteTag,value)
}


/**
 * 验证版本号
 * @param {obj} payload 
 */
export function checkVersion(payload){
    const { value } = payload
    return req(Edbox.Lobby.CheckVersion,value)
}