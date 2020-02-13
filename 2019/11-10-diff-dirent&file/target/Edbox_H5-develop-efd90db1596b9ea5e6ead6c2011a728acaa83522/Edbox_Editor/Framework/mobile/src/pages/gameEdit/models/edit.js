export default {
  namespace: 'edit',
  state: {
    text: 'page work',
    list: [],
    recommendList: [],
    showMenu: false,
    showOperation: false,
    dataSource: undefined,
    currentData: undefined,
    currentMenu: undefined,
    widgetData: undefined,
    percentRecommend: undefined,
    isLogin: false,
    urlIframe: undefined,
    controls: undefined,
    currentEditData: undefined,
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    },
    setShowMenu(
      state,
      {
        payload: { showMenu }
      }
    ) {
      return {
        ...state,
        showMenu
      }
    },
    setShowOperation(
      state,
      {
        payload: { showOperation }
      }
    ) {
      return {
        ...state,
        showOperation
      }
    },
    setCurrentData(
      state,
      {
        payload: { currentData, showMenu }
      }
    ) {
      return {
        ...state,
        currentData,
        showMenu
      }
    },
    setNextData(
      state,
      {
        payload: { currentData }
      }
    ) {
      return {
        ...state,
        currentData
      }
    },
    setWidgetData(
      state,
      {
        payload: { widgetData }
      }
    ) {
      return {
        ...state,
        widgetData
      }
    },
    setLogin(
      state,
      {
        payload: { isLogin, urlIframe },
      },
    ) {
      return {
        ...state,
        isLogin,
        urlIframe,
      };
    },
    setCDData(
      state,
      {
        payload: { currentData,dataSource }
      }
    ) {
      return {
        ...state,
        currentData,
        dataSource,
      }
    },
    setRecommendList(
      state,
      {
        payload:{ recommendList }
      }
    ) {
      return {
        ...state,
        recommendList,
      }
    },
    setData(
      state,
      {
        payload: { dataSource },
      },
    ) {
      return {
        ...state,
        dataSource,
      };
    },
    setCurrentOpen(
      state,
      {
        payload: { currentData, navOpenKey, tabActiveKey },
      },
    ) {
      return {
        ...state,
        currentData,
      };
    },
    setPercentRecommend(
      state,
      {
        payload: { percentRecommend, dataSource },
      },
    ) {
      return {
        ...state,
        percentRecommend,
        dataSource
      };
    },
    setControls (
      state,
      {
        payload: { controls },
      },
    ) {
      return {
        ...state,
        controls,
      };
    },
    setCurrentEditData (
      state,
      {
        payload: { currentEditData },
      },
    ) {
      return {
        ...state,
        currentEditData,
      };
    },
    
  }
}
