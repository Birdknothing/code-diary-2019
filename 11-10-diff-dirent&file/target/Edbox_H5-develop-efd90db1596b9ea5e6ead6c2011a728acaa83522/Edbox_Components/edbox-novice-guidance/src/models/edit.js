import { formatMessage } from 'umi/locale';
import DataDefine from '@/data/DataDefine';
import DataDefine_E from '@/data/DataDefine_E';
import DataGameId from '@/data/DataGameId';
import { getLocale} from 'umi/locale';
const {Edbox} = window;

export default {
  namespace: 'edit',
  state: {
    dataSource: undefined,
    dataSourceIndex: undefined,
    currentData: undefined,
    iframeStyle: {
      cursor: 'default',
      width: '40%',
      display: 'none',
    },
    urlIframe: undefined,
    navOpenKey: undefined,
    tabActiveKey: undefined,
    collapseKey: undefined,
    isLogin: false,
    loadingItem: false,
    controls: undefined,
    xMax: 320,
    modalMessage: {
      modalVisible: false,
      messageData: undefined,
    },
    retryServer: false,
    management: false,
    managementTxt: formatMessage({ id: 'manage' }),
    activeLevelDatas: undefined,
    deleteModelData: {
      deleteModelVisible: false,
      deleteData: undefined,
      pid: undefined,
    },
    hasError: false,
    isShowEditorPlane:false, // 框架面板显隐
    nowImgEditorObj:{}, // 当前图片编辑对象
    nowGameIdObj:{}, // 当前游戏id对象，用于放在编辑器路由里
  },
  reducers: {
    setLoadingItem(
      state,
      {
        payload: { loadingItem },
      },
    ) {
      return {
        ...state,
        loadingItem,
      };
    },
    setXMax(
      state,
      {
        payload: { xMax },
      },
    ) {
      return {
        ...state,
        xMax,
      };
    },
    setControls(
      state,
      {
        payload: { controls, xMax },
      },
    ) {
      return {
        ...state,
        controls,
        xMax,
      };
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
    setCurrentData(
      state,
      {
        payload: { currentData },
      },
    ) {
      return {
        ...state,
        currentData,
      };
    },
    setNavOpenKey(
      state,
      {
        payload: { navOpenKey },
      },
    ) {
      return {
        ...state,
        navOpenKey,
      };
    },
    setIframeStyle(
      state,
      {
        payload: { iframeStyle },
      },
    ) {
      return {
        ...state,
        iframeStyle,
      };
    },
    setLogin(
      state,
      {
        payload: { isLogin, urlIframe, locale },
      },
    ) {
      return {
        ...state,
        isLogin,
        urlIframe,
        locale,
      };
    },
    setdefaultOpen(
      state,
      {
        payload: { currentData, navOpenKey, tabActiveKey, management, managementTxt },
      },
    ) {
      return {
        ...state,
        navOpenKey,
        currentData,
        tabActiveKey,
        management,
        managementTxt,
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
        navOpenKey,
        tabActiveKey,
      };
    },
    setMenuClick(
      state,
      {
        payload: {
          currentData,
          tabActiveKey,
          loadingItem,
          controls,
          xMax,
          management,
          managementTxt,
        },
      },
    ) {
      return {
        ...state,
        currentData,
        tabActiveKey,
        controls,
        xMax,
        management,
        managementTxt,
      };
    },
    setTabActiveKey(
      state,
      {
        payload: { tabActiveKey, controls, xMax, management, managementTxt },
      },
    ) {
      return {
        ...state,
        tabActiveKey,
        controls,
        management,
        xMax,
        managementTxt,
      };
    },
    updateData(
      state,
      {
        payload: { currentData, dataSource },
      },
    ) {
      return {
        ...state,
        currentData,
        dataSource,
      };
    },
    setTabClick(
      state,
      {
        payload: { navOpenKey, currentData, tabActiveKey, collapseKey, controls, xMax },
      },
    ) {
      return {
        ...state,
        navOpenKey,
        currentData,
        tabActiveKey,
        collapseKey,
        controls,
        xMax,
      };
    },
    setCollapseKey(
      state,
      {
        payload: { collapseKey },
      },
    ) {
      return {
        ...state,
        collapseKey,
      };
    },
    setControlsData(
      state,
      {
        payload: { controls, xMax },
      },
    ) {
      return {
        ...state,
        controls,
        xMax,
      };
    },
    updateValue(
      state,
      {
        payload: { currentData, dataSource },
      },
    ) {
      return {
        ...state,
        currentData,
        dataSource,
      };
    },
    setModalMessage(
      state,
      {
        payload: { modalMessage },
      },
    ) {
      return {
        ...state,
        modalMessage,
      };
    },
    setDataControls(
      state,
      {
        payload: { dataSource, currentData, controls, xMax },
      },
    ) {
      return {
        ...state,
        dataSource,
        currentData,
        controls,
        xMax,
      };
    },
    setRetryServer(
      state,
      {
        payload: { retryServer },
      },
    ) {
      return {
        ...state,
        retryServer,
      };
    },
    setManagement(
      state,
      {
        payload: { management, managementTxt },
      },
    ) {
      return {
        ...state,
        management,
        managementTxt,
      };
    },
    setDataSourceIndex(
      state,
      {
        payload: { dataSourceIndex },
      },
    ) {
      return {
        ...state,
        dataSourceIndex,
      };
    },
    setAddData(
      state,
      {
        payload: { currentData, dataSource, collapseKey },
      },
    ) {
      return {
        ...state,
        currentData,
        dataSource,
        collapseKey,
      };
    },
    setActiveLevelDatas(
      state,
      {
        payload: { activeLevelDatas, collapseKey, controls, xMax },
      },
    ) {
      return {
        ...state,
        activeLevelDatas,
        collapseKey,
        controls,
        xMax,
      };
    },
    setAddUpdateDatas(
      state,
      {
        payload: { currentData, dataSource, activeLevelDatas, collapseKey, controls, xMax },
      },
    ) {
      return {
        ...state,
        currentData,
        dataSource,
        activeLevelDatas,
        collapseKey,
        controls,
        xMax,
      };
    },
    setDeleteModelData(
      state,
      {
        payload: { deleteModelData },
      },
    ) {
      return {
        ...state,
        deleteModelData,
      };
    },
    setDeleteData(
      state,
      {
        payload: {
          currentData,
          dataSource,
          deleteModelData,
          activeLevelDatas,
          collapseKey,
          controls,
          xMax,
        },
      },
    ) {
      return {
        ...state,
        currentData,
        dataSource,
        deleteModelData,
        activeLevelDatas,
        collapseKey,
        controls,
        xMax,
      };
    },
    setGlobalError(
      state,
      {
        payload: { hasError },
      },
    ) {
      return {
        ...state,
        hasError,
      };
    },
    setIsShowEditorPlane(
      state,
      {
        payload: { isShowEditorPlane },
      },
    ) {
      return {
        ...state,
        isShowEditorPlane,
      };
    },
    setNowImgEditorObj(
      state,
      {
        payload: { nowImgEditorObj },
      },
    ) {
      return {
        ...state,
        nowImgEditorObj,
      };
    },
    setNowGameIdObj(state,{payload:{nowGameIdObj}}){
      return {
        ...state,
        nowGameIdObj,
      };
    },

  },
  effects: {
    getDataSource({ callback },) {
      const data = getLocale()==='zh-CN'? DataDefine: DataDefine_E;
      if (callback) {
        callback(data);
      }
    },
    *getDataGameId({callback},{put}){
      const originData = DataGameId;
      const serverKey = Edbox.ServerKey;
      const data = originData[serverKey]? originData[serverKey]: originData["Dev"];
      yield put({ type: 'setNowGameIdObj',payload:{nowGameIdObj:data} });
      if (callback) {
        callback(data);
      }
    }
  },
};
