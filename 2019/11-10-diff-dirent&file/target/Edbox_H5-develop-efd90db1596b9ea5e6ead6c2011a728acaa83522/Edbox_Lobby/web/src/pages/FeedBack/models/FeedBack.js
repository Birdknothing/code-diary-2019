import * as FeedBackService from '../services/FeedBack';

export default {
    namespace: 'FeedBack',
    state:{

    },
    reducers:{},
    effects: {
        *postFeedBack({ payload: { contact,feed_type,content,scene,subscript,screenshot },callback }, { call, put }) {
            const data = yield call(FeedBackService.postFeedBack, { contact,feed_type,content,scene,subscript,screenshot });
            if(callback){
                callback(data)
            }
        },
        *getFeedBacks({ payload: { page },callback }, { call, put }) {
            let data = yield call(FeedBackService.getFeedBacks, { page });
            if(data.data){
                data.items = []
            }
            if(callback){
                callback(data)
            }
        },
        *getFeedBackReply({ payload: { feedback_id,page },callback }, { call, put }) {
            const data = yield call(FeedBackService.getFeedBackReply, { feedback_id,page });
            if(callback){
                callback(data)
            }
        },
        *refreshFeedBackState({ payload: { feedback_id },callback }, { call, put }) {
            const data = yield call(FeedBackService.refreshFeedBackState, { feedback_id });
            if(callback){
                callback(data)
            }
        },
        *getFeedBackTem({ payload,callback},{call}){
            const  data  = yield call(FeedBackService.getFeedBackTem,{})
            if(callback){
                callback(data)
            }
        },
        *uploadImage({ payload:{file},callback},{call}){
            const data = yield call(FeedBackService.uploadImage,{file})
            if(callback){
                callback(data)
            }
        },
        *postFeedBackReply({ payload:{feedback_id,content },callback},{call}){
            const data = yield call(FeedBackService.postFeedBackReply,{feedback_id,content})
            if(callback){
                callback(data)
            }
        },
        *getImage({ payload:id,callback},{call}){
            const  data  = yield call(FeedBackService.getImage,id)
            if(callback){
                callback(data)
            }
        },
    }
};