import { editGame,getUserInfo } from '../services/global';
import { message } from 'antd';

export default {
  namespace: 'global',
  state: {
    activeStep: 0, // 当前激活步骤
    isCanBeSetStep: true, // 是否可以设置步骤
    userInfo:{}, // 当前用户信息
    isCanOpr: true, // 判断用户是否可以操作,防止可能在页面请求过程中被操作
  },
  reducers: {
    setStep(state,{payload: { activeStep },},) {
      return {
        ...state,
        activeStep,
      };

    },
    setUserInfo(state,{payload:{userInfo}}){
      return{...state,userInfo:{...state.userInfo,...userInfo}}
    },
    setIsCanBeSetStep(state,{payload:{isCanBeSetStep}}){
      return{...state,isCanBeSetStep}
    },
    setIsCanOpr(state,{payload:{isCanOpr}}){
      return{...state,isCanOpr}
    },
  },
  effects: {
    *editGame({payload,callback},{call,put}){
      const {data} = yield call(editGame);
      if(data&&data.error){
        message.error(data.content.message)
      }
      if(callback){
        callback(data);
      }
      // yield put({ type: 'setUserInfo', payload: {userInfo:data} });
    },
    *getUserInfo({ callback }, { call, put }) {
      const {data} = yield call(getUserInfo);
      if(data&&data.error){
        message.error(data.content.message)
      }
      if(callback){
        callback(data);
      }
      yield put({ type: 'setUserInfo', payload: {userInfo:data} });
    },
    *setActiveStep({payload:{activeStep} ,callback }, { put }){

      yield put({ type: 'setStep', payload: {activeStep} });
      if(callback){
        callback();
      }
    },
  }

};
