export default {
  namespace: 'simplePictureCtrl',
  state: {
    nowOprTab: 1, // 当前操作图片编辑器的第几个操作
    selectedImgData:{ // 当前的图片对象
      name: '',
      url: '',
      guid:'',
    },
    onClose: ()=>{}, // 点击关闭按钮事件
  },
  reducers: {
    setNowOprTab(
      state,
      {
        payload: { nowOprTab },
      },
    ) {
      return {
        ...state,
        nowOprTab,
      };
    },
    setSelectedImgData(state,
      {
        payload: { selectedImgData },
      },){
        return {
          ...state,
          selectedImgData:{...selectedImgData},
        };
      },
    setCloseEvent(state,{payload:{onClose}}){
      return {
        ...state,
        onClose,
      };
    },
  },
};
