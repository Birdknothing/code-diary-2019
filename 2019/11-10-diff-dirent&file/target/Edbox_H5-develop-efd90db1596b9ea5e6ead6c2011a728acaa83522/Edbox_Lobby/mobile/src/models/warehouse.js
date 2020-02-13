// import * as WareService from '../services/warehouse';

export default {
  namespace: 'Warehouse',
  state: {
    wareSort: 0
  },
  reducers: {
    setWareSort(
      state,
      {
        payload: { wareSort }
      },
    ) {
      return { ...state, wareSort };
    }
  },
  effects: {
    // *getTags({ payload,callback }, { call, put }) {
    //     const { data } = yield call(WareService.getTags);
    //     if(callback){
    //         callback(data)
    //     }
    // },
    // *getGameList({ payload: { page, order, cat, word,size }, callback},{ call }){
    //     const { data, count } = yield call(WareService.getGameList,{ page, order, cat, word,size })
    //     if(callback){
    //         callback(data, count)
    //     }
    // },
    // *getHotWordList({ payload, callback }, { call }) {
    //   const { data } = yield call(WareService.getHotWordList, payload);
    //   if (callback) {
    //     callback(data);
    //   }
    // }
  }
};
