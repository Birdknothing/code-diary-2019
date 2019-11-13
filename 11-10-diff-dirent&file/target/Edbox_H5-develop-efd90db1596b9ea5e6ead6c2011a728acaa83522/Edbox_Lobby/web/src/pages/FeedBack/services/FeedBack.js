// import request from '../../../utils/request';
import req from '../../../utils/req'; // 使用req() 请求edbox方法的数据，requst()获取mock数据

const { Edbox } = window

export function getFeedBacks({ page }) { //获取反馈列表 GetFeedBacks:function(page,success,error)
    // return req(Edbox.GetFeedBacks, guid); 使用req() 请求edbox方法的数据，requst()获取mock数据
    var data = {};
    data.page = page;
    return req(Edbox.Lobby.GetFeedBacks, data); 
    // return request(`/api/getFeedBacks?_page=${page}`);
}

export function getFeedBackReply({ feedback_id ,page}) { //获取反馈回复列表 GetFeedBackReply:function(feedback_id,success,error)
    var data = {};
    data.feedback_id = feedback_id;
    data.page = page;
    return req(Edbox.Lobby.GetFeedBackReply, data); 
    // return request(`/api/getFeedBackReply?_page=${page}`);
} 

export function getFeedBackTem() { //获取反馈模板
    var data = {};
    data.modelName='Edbox_Lobby'
    return req(Edbox.Lobby.GetModelData, data); 
    // return request(`/api/getFeedBackTem`);
} 

export function postFeedBack({contact,feed_type,content,scene,subscript,screenshot}) { //提交反馈信息
    var data = {};
    data.contact=contact;
    data.feed_type=feed_type;
    data.content=content;
    data.scene=scene;
    data.subscript=subscript;
    data.screenshot=screenshot;
    data.modelName = 'Edbox_Lobby'
    return req(Edbox.Lobby.PostFeedBack, data); 
} 

export function refreshFeedBackState({feedback_id}) { //刷新反馈已读状态
    var data = {};
    data.feedback_id=feedback_id;
    return req(Edbox.Lobby.RefreshFeedBackState, data); 
} 

export function uploadImage({file}) { //上传图片 SelectLocalImage: function (success,error,process)
    var data = {}
    data.file=file;
    return req(Edbox.Lobby.UploadImageToCS, data);
    // return request('/api/uploadImage');
} 

export function postFeedBackReply({feedback_id, content}){ //提交反馈回复 PostFeedBackReply:function(feedback_id,content,success,error)
    var data = {};
    data.feedback_id=feedback_id;
    data.content=content;
    return req(Edbox.Lobby.PostFeedBackReply, data); 

    // return request(`/api/getFeedBackReply?feedback_id=${feedback_id}`);
}

export function getImage({id}){ //获取图片
    var data = {};
    data.dentry_id = id;
    return req(Edbox.Lobby.GetCSImageUrl, data); 
}