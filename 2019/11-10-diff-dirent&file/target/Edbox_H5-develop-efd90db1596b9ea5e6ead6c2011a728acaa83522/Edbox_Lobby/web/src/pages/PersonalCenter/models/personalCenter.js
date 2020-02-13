import { getPersonalInfo,saveInfoByItem,validateEmail } from '../services/personalCenter';
import { message } from 'antd';



export default {
  namespace: 'personalCenter',
  state: {},

  effects: {

    *getPersonalInfo({ payload, callback }, { call }) {
      const {data} = yield call(getPersonalInfo, payload);
      if(data.error){
        message.error(data.error);
      }else{
        if (callback) {
          callback(data);
        }
      }
    },
    *saveAvatarUrl({ payload, callback }, { call }) {
      const {data} = yield call(saveInfoByItem, payload);
      if(data.error){
        message.error(data.error);
      }else{
        if (callback) {
          callback(data);
        }
      }
    },
    *saveName({ payload, callback }, { call }) {
      const {data} = yield call(saveInfoByItem, payload);
      if(data.error){
        message.error(data.content.responseJSON.code);
      }else{
        if (callback) {
          callback(data);
        }
      }
    },
    *saveBirthday({ payload, callback }, { call }) {
      const {data} = yield call(saveInfoByItem, payload);
      if(data.error){
        console.log('请求出错这里：',data);
        message.error(data.error);
      }else{
        if (callback) {
          callback(data);
        }
      }
    },
    *saveSex({ payload, callback }, { call }) {
      const {data} = yield call(saveInfoByItem, payload);
      if(data.error){
        message.error(data.error);
      }else{
        if (callback) {
          callback(data);
        }
      }
    },
    *validateEmail({ payload, callback }, { call }) {
      const {data} = yield call(validateEmail, payload);
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
