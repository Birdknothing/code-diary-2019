import * as SingleListService from '../services/index';

export default {
    namespace: 'SingleGame',
    state:{

    },
    reducers:{},
    effects: {
        *getHistoryList({ payload: { page, size, name }, callback},{ call }){
            const { data,count } = yield call(SingleListService.getHistoryList,{ page, size, name })
            if(callback){
                callback(data,count)
            }
        },
        *getCollectList({ payload: { page, name }, callback},{ call }){
            const { data,count } = yield call(SingleListService.getCollectList,{ page, name })
            if(callback){
                callback(data,count)
            }
        },
        *getCreatList({ payload: { page, word }, callback},{ call }){
            const { data,count } = yield call(SingleListService.getCreatList,{ page, word })
            if(callback){
                callback(data,count)
            }
        }
    }
};