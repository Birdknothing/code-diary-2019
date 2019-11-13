export default {
  namespace: 'audioSelector',

  state: {

    // 外部传入音频信息
    remoteAudio : {
      AudioType: [],
      Name: '',
      GUID:'',
      ReadOnly: false,
      ShowName: '',
      Value:'',
      ResourceName: '',
      // 可选配置
      Property:{
         // 预设裁剪长度 毫秒
        DefaultLength: 0
      }
    },

    // 外部传入音频信息
    defAudio : {
      AudioType: [],
      Name: '',
      GUID:'',
      ReadOnly: false,
      ShowName: '',
      Value:'',
      ResourceName: '',
      Property:{
        // 预设裁剪长度
       DefaultLength: 0
      }
    }
 
  },


  reducers: {
    
    // 初始化音频相关信息
    initAudioSelector(state, {payload: remoteAudio}){

      state.remoteAudio = remoteAudio;
      state.defAudio = JSON.parse(JSON.stringify(remoteAudio));

      return { ...state, remoteAudio }
    },

    // 设置音频数据
    setSound(state, {payload: data}){

      state.remoteAudio.GUID = data.guid;
      state.remoteAudio.ResourceName = data.name;  
      state.remoteAudio.Value = data.url;


      return { ...state, data}
    },

    setRemoteAudio(state, { payload: remoteAudio }) {
      return { ...state, remoteAudio };
    },

    // 重置音频
    resetAudio(state, {payload: datas}) {

      state.remoteAudio = JSON.parse(JSON.stringify(state.defAudio));


      return { ...state };
    }
  }
}

