// import request from '../utils/request';
import req from '../utils/req'; // 使用req() 请求edbox方法的数据，requst()获取mock数据
const {Edbox} = window

/**
 * 获取大厅标签
 */
export function getTags() {
    var data = '';
    return req(Edbox.Lobby.GetTagsList, data);
}

/**
 * 获取个人信息
 */
export function getUserInfo() { //获取个人信息
    return req(Edbox.Lobby.GetUserInfo, '');
}

/**
 * 获取图片url
 * @param {obj} payload 
 */
export function getImageUrl(payload) { //使用resourceid 获取图片url
     const { resourceid } = payload
    var data = {};
    data.resourceId = resourceid;
    return req(Edbox.Lobby.GetImage, data);
}

/**
 * 获取历史游戏列表
 * @param {obj} payload 
 */
export function getHistoryList(payload){
    const { page} = payload
    var data = {};
    data.page = page;
    data.size = 5;
    return req(Edbox.Lobby.GetPlayRecord, data);
}

/**
 * 网页初始化调用，success返回的如果是空值， 就不管， 如果是url， 就提示用户去下载
 * @param {*} payload
 */
export function initService(payload){
    // var data = '';
    return req(Edbox.Lobby.CheckEbService,'')
}

/**
 * 打开游戏
 * @param {obj} payload
 * 在创作列表点击播放playType = 1, 在我的作品点击播放playType=2, 在体验库列表点击播放playType = 3
 */
export function openGamePlay(payload){
    const { appid, playType, version, taskId } = payload
    var data = {};
    data.appId = appid
    data.playType = playType
    data.version = version
    data.taskId = taskId
    return req(Edbox.Lobby.OpenGamePlay,data)
}

/**
 * 获取进度条
 * @param {obj} payload 
 */
export function getProgress(payload){
    const { TaskId } = payload;
    var data = {}
    data.taskId = TaskId
    return req(Edbox.Lobby.GetProgress,data)
}

/**
 * 打开游戏编辑器
 * @param {obj} payload 
 */
export function openGameEditor(payload){
    const { taskId, appid, version, accessType } = payload

    var data = {};
    data.taskId = taskId;
    data.appId = appid;
    data.accessType = accessType;
    data.version = version;
    return req(Edbox.Lobby.OpenGameEditor,data)
}

// 验证发布类型
export function getPublishOrigin(payload){
  const { id } = payload;
  var data = {}
  data.appId = id
  return req(Edbox.Lobby.GetPublishOrigin,data)
}

// 敏感词检测
export function isSensitive(payload){
  const { word } = payload;
  var data = {}
  data.word = word
  return req(Edbox.Lobby.IsSensitive,data)
}

// 重名检测
export function isNameDuplicate(payload){
  const { id, releaseMode, accessType, appName  } = payload;
  var data = {}
  data.appId = id;
  data.releaseMode = releaseMode;
  data.accessType = accessType;
  data.appName = appName;
  return req(Edbox.Lobby.IsNameDuplicate,data)
}

/**
 * 获取IM地址
 * @param {*} payload 
 */
export function getWebIMUrl(payload){
    var data = ''
    return req(Edbox.Lobby.GetWebIMUrl,data)
}

/**
 * 获取分享好友列表
 * @param {obj} payload 
 */
export function getFriendList(payload){
    const { 
        offset, //分页
        size, //每页显示条数
        word //搜索关键词
    } = payload

    var data = {};
    data.offset = offset
    data.pagesize = size
    data.key = word

    return req(Edbox.Lobby.GetIMFriendsInfo,data)
}

/**
 * 分享给好友
 * @param {obj} payload 
 */
export function shareApp(payload){
    // const { 
    //     appId, //作品id
    //     receiver, //接收玩家ID
    //     appName,
    //     iconUrl,
    //     access, //访问类型  1-模板 2-个人库 3-体验库
    //     get_type, //获取类型0-显示需求 1-试玩需求 2-分享需求  3-编辑 4-体验区游戏
    //     version,
    //     appDesc
    // } = payload

    return req(Edbox.Lobby.ShareApp2IM,payload)
}



/**
 * 获取图书馆地址接口
 * @param {*} payload 
 */
export function getLibUrl(payload){
    var data = ''
    return req(Edbox.Lobby.GetLibUrl,data)
}

/**
 * 获取图书馆地址接口
 * @param {*} payload 
 */
export function getElearningUrl(payload){
    var data = ''
    return req(Edbox.Lobby.GetElearningUrl,data)
}

/**
 * 初始化
 * @param {*} payload 
 */
export function edboxInit(payload){
    var data = ''
    return req(Edbox.Lobby.Init,data)
}

/**
 * 导出apk
 * @param {obj} payload 
 */
export function exportApk(payload){
    const { 
        taskId,  //任务id
        appId, //作品id
        icon,  //作品图标资源guid
        accessType, //我的作品2，体验区3
        gameName //作品名称
    } = payload

    var data = {}
    data.taskId = taskId
    data.appId = appId
    data.accessType = accessType
    data.gameName = gameName
    data.icon = icon

    return req(Edbox.Lobby.ExportApk,data)
}

/**
 * 导出exe
 * @param {obj} payload 
 */
export function exportExeGame(payload){
    const { 
        taskId,  //任务id
        appId, //作品id
        icon,  //作品图标资源guid
        accessType, //我的作品2，体验区3
        gameName //作品名称
    } = payload

    var data = {}
    data.taskId = taskId
    data.appId = appId
    data.accessType = accessType
    data.gameName = gameName
    data.icon = icon

    return req(Edbox.Lobby.ExportExeGame,data)
}

/**
 * 导出编辑模板
 * @param {obj} payload 
 */
export function exportEditor(payload){
    // const { 
    //     taskId,  //任务id
    //     appId, //作品id
    //     icon,  //作品图标资源guid
    //     gameName //作品名称
    // } = payload

    return req(Edbox.Lobby.ExportEditor,payload)
}

/**
 * 获取是否有未回复的反馈
 * @param {*} payload 
 */
export function getUnReplyFeedBacks(payload){
    return req(Edbox.Lobby.GetUnReplyFeedBacks,payload)
}

/**
 * 获取第三方分享类型
 * @param {*} payload 
 */
export function getThirdPartyShare(payload){
    return req(Edbox.Lobby.GetThirdPartyShare,'')
}

/**
 * 第三方分享
 * @param {obj} payload 
 */
export function sharedAppByThird(payload){
    return req(Edbox.Lobby.SharedAppByThird,payload)
}

/**
 * 监听编辑器关闭
 * @param {*} payload 
 */
export function listenEditorExit(payload){
    return req(Edbox.Lobby.ListenEditorExit,'')
}


/**
 * 点击二维码和链接分享
 * @param {obj} payload 
 */
export function sharedApp(payload){
    const { appId, access, type} = payload
    var data = {};
    data.appId = appId; //作品id
    data.access = access; //访问类型：1-模板 2-个人库 3-体验库
    data.type = type; //分享类型 'Link','QR'
    return req(Edbox.Lobby.SharedApp,data)
}

/**
 * 批量获取图片url
 * @param {obj} payload 
 */
export function getImgBatch(payload) { //使用resourceid 获取图片url
    const { resourceid } = payload
//    var data = {};
//    data.resourceId = resourceid;
   return req(Edbox.NDR.GetList, resourceid);
}