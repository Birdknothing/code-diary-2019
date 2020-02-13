import req from '@/utils/req';
const { Edbox } = window;

/**
 * 获取游戏详情
 * @param {obj} payload
 */
function getDetail(payload) {
  const { detail_id } = payload;
  const data = {};
  data.appid = detail_id;
  return req(Edbox.Lobby.GetExperienceAppInfo, data);
}

/**
 * 获取图片url
 * @param {obj} payload
 */
function getImageUrl(payload) {
  const { resourceid } = payload;
  const data = {};
  data.resourceId = resourceid;
  return req(Edbox.Lobby.GetImage, data);
}

/**
 * 获取游戏标签
 * @param {obj} payload
 */
function getDetailTags(payload) {
  const { id } = payload;
  const data = {};
  data.appid = id;
  return req(Edbox.Lobby.GetAppTags, data);
}

/**
 * 批量获取图片url
 * @param {obj} payload
 */
function getImgBatch(payload) {
  const { resourceid } = payload;
  return req(Edbox.NDR.GetList, resourceid);
}

/**
 * 收藏游戏
 * @param {obj} payload
 */
function gameCollect(payload) {
  const { id } = payload;
  const data = {};
  data.appid = id;
  return req(Edbox.Lobby.CollectApp, data);
}

/**
 * 取消收藏
 * @param {obj} payload
 */
function gameCollectCancel(payload) {
  const { id } = payload;
  const data = {};
  data.appid = id;
  return req(Edbox.Lobby.CancelCollectApp, data);
}

/**
 * 获取游戏版本记录
 * @param {obj} payload
 */
function getGameRecentUpdate(payload) {
  const { id } = payload;
  const data = {};
  data.appid = id;
  return req(Edbox.Lobby.GetGameRecentUpdates, data);
}

/**
 * 获取详情页游戏原始模板
 * @param {obj} payload
 */
function getGameOriginalTpl(payload) {
  const { id, version } = payload;
  const data = {};
  data.baseid = id;
  data.base_version = version;
  return req(Edbox.Lobby.GetGameOriginalTpl, data);
}

/**
 * 获取详情页游戏相同模板游戏
 * @param {obj} payload
 */
function getGameSameTpl(payload) {
  const { id } = payload;
  var data = {};
  data.appid = id;
  return req(Edbox.Lobby.GetGameSameTpl, data);
}

/**
 * 游戏打分
 * @param {obj} payload
 */
function gameReview(payload) {
  const { id, score, version } = payload;
  const data = {};
  data.appid = id;
  data.score = score;
  data.version = version;
  return req(Edbox.Lobby.SetAppScore, data);
}

/**
 * 获取用户当前评分
 * @param {obj} payload
 */
function getUserScoreInfo(payload) {
  return req(Edbox.Lobby.GetUserScoreInfo, payload);
}

/**
 * 打开游戏
 * @param {obj} payload
 * 在创作列表点击播放 playType = 1, 在我的作品点击播放 playType=2, 在体验库列表点击播放 playType = 3
 */
function openGamePlay(payload) {
  const { appid, playType, version, taskId } = payload;
  const data = {};
  data.appId = appid;
  data.playType = playType;
  data.version = version;
  data.taskId = taskId;
  return req(Edbox.Lobby.OpenGamePlay, data);
}

export {
  getDetail,
  getImageUrl,
  getDetailTags,
  getImgBatch,
  gameCollect,
  gameCollectCancel,
  getGameRecentUpdate,
  getGameOriginalTpl,
  getGameSameTpl,
  gameReview,
  getUserScoreInfo,
  openGamePlay
};
