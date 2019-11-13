// 全局相关services

// import request from '../utils/request';
import req from '../utils/req'; // 使用req() 请求edbox方法的数据，requst()获取mock数据
const {Edbox} = window

/**
 * 编辑游戏
 */
export function editGame(payload){
  const { word } = payload;
  var data = {}
  data.word = word
  return req(Edbox.Lobby.IsSensitive,data)
}

/**
 * 获取个人信息
 */
export function getUserInfo() { //获取个人信息
  return req(Edbox.Lobby.GetUserInfo, '');
}
