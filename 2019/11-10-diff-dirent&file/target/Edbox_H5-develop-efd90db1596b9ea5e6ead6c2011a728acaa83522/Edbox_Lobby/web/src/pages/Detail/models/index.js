import * as detailService from '../services/index';

export default {
    namespace: 'detail',
    state:{
        game_info: undefined,
    },
    reducers:{
        setGameInfo(state,{payload:{data:game_info}}){
            return{...state,game_info}
        }
    },
    effects: {
        *getDetail({ payload: { id },callback }, { call, put }) {
          const {data} = yield call(detailService.getDetail, { id });
          if(callback){
              callback(data)
          }
        },
        *getGameRecentUpdate({ payload: { id },callback }, { call, put }) {
          const data = yield call(detailService.getGameRecentUpdate, { id });
          if(callback){
              callback(data)
          }
        },
        *getGameOriginalTpl({ payload: { id, version },callback }, { call, put }) {
          const {data} = yield call(detailService.getGameOriginalTpl, { id, version });
          if(callback){
              callback(data)
          }
        },
        *getGameSameTpl({ payload: { id },callback }, { call, put }) {
          const {data} = yield call(detailService.getGameSameTpl, { id });
          if(callback){
              callback(data)
          }
        },
        *complainGame({ payload: { id, userId, version, content, description },callback }, { call, put }) {
            const data = yield call(detailService.complainGame, { id, userId, version, content, description });
            if(callback){
                callback(data)
            }
        },
        *getDetailTags({ payload: { id },callback }, { call, put }) {
            const {data} = yield call(detailService.getDetailTags, { id });
            if(callback){
                callback(data)
            }
        },
        *gameReview({ payload: { id,score,version },callback }, { call, put }) {
            const {data} = yield call(detailService.gameReview, { id,score,version });
            if(callback){
                callback(data)
            }
        },
        *gameCollect({ payload: { id },callback }, { call, put }) {
            const {data} = yield call(detailService.gameCollect, { id });
            if(callback){
                callback(data)
            }
        },
        *gameCollectCancel({ payload: { id },callback}, { call, put }) {
            const {data} = yield call(detailService.gameCollectCancel, { id });
            if(callback){
                callback(data)
            }
        },
        *getMyWorkPersonalAppInfo({ payload: { id },callback}, { call, put }) {
          const {data} = yield call(detailService.getMyWorkPersonalAppInfo, { id });
          if(callback){
              callback(data)
          }
        },
        *getUserScoreInfo({ payload: { appId },callback}, { call, put }) {
          const {data} = yield call(detailService.getUserScoreInfo, { appId });
          if(callback){
              callback(data)
          }
        },
    },
};
