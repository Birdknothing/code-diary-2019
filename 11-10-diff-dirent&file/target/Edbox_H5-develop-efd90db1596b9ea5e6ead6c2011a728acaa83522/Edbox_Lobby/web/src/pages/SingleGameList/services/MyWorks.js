// import request from '../../../utils/request';
import req from '../../../utils/req'; // 使用req() 请求edbox方法的数据，requst()获取mock数据
const { Edbox } = window
// 我的游戏-获取编辑列表
// {
//     page:1,//当前页码
//     per: 16,//每页显示
// }
export function getEditList(payload){
    // const { page,size } = payload;
    return req(Edbox.Lobby.GetPersonalEditorApps, payload);
}


// 我的游戏-获取发布列表
// {
//     page:1,//当前页码
//     per: 16,//每页显示
// }
export function gePublishList(payload){
    // const { page,size } = payload
    return req(Edbox.Lobby.GetPersonalPublishApps, payload);
}

// 我的游戏-下架
// {
//     app_id:'',//游戏app_id
// }
export function soldOutGame(payload){
    // const { app_id } = payload
    return req(Edbox.Lobby.SoldoutPersonalApp, payload);

}

// 我的游戏-取消发布
// {
//     app_id:'',//游戏app_id
// }
export function cancelPublish(payload){
    // const { app_id ,version} = payload
    return req(Edbox.Lobby.CancelPublishPersonalApp, payload);

}

// 我的游戏-删除游戏
// {
//     app_id:'',//游戏app_id
// }
export function deleteGame(payload){
    // const { app_id } = payload
    return req(Edbox.Lobby.DeletePersonalApp, payload);

}

export function copyGame(payload){
  // const { app_id,curName } = payload
  return req(Edbox.Lobby.CopyPersonalApp, payload);

}

// 编辑游戏名字
export function editGameName(payload){
  // const { app_id,new_name } = payload
  return req(Edbox.Lobby.RenamePersonalAppName, payload);

}

// 获取二维码
export function getQrCodeImg(payload){
  // const { app_id ,access_type,get_type} = payload;
  return req(Edbox.Lobby.GetTryPlayingInfo, payload);
}

// 获取游戏类型
export function getAppType(payload){
  // const { app_id ,access_type,get_type} = payload;
  return req(Edbox.Lobby.GetAppType, payload);
}


