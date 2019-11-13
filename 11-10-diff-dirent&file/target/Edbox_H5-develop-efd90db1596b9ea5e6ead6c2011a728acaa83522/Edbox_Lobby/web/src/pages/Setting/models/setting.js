import { getUpdateLog } from '../services/setting';
import { message } from 'antd';



export default {
  namespace: 'setting',
  state: {},

  effects: {
    *getUpdateLog({ payload, callback }, { call }) {
      const {data} = yield call(getUpdateLog, payload);
      if(data.error){
        message.error(data.error);
      }else{
        if (callback) {
          callback(data);
        }
      }
    },
  },
  reducers: {
    // 根据属性名保存数据
    saveStateByAttr(state, action) {
      const {attr, val} = action.payload;
      return {
        ...state,
        [attr]: val,
      };
    },
  },
};
