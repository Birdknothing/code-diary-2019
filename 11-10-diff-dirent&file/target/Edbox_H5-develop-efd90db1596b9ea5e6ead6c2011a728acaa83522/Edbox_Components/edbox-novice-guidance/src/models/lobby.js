import {
  getTags,
  getGameList,
  getEditList,
  getHistoryList,
  getElearningUrl,
  getImageUrl,
  getCreatList,
} from '../services/lobby';
import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import DataDefine from '@/data/DataDefine';
import DataDefine_E from '@/data/DataDefine_E';
import DataGameId from '@/data/DataGameId';
import { getLocale} from 'umi/locale';
const {Edbox} = window;

const errTipId = {
  'EDBOX_LOBBY/PRODUCT_RELEASED': 'lobby_product_released',
  'EDBOX_LOBBY/ERROR': 'lobby_error',
  'EDBOX_LOBBY/INVALID_ARGUMENT': 'lobby_invalid_argument',
  'EDBOX_LOBBY/PLAYER_ABNORMAL': 'lobby_player_abnormal',
  'EDBOX_LOBBY/PRODUCT_NAME_DUPLICATE': 'lobby_product_name_duplicate',
  'EDBOX_LOBBY/NOT_EXIST': 'lobby_not_exist',
  'EDBOX_LOBBY/ILLEGAL_CHARACTER': 'lobby_illegal_character',
  'EDBOX_LOBBY/PRODUCT_CHECK': 'lobby_product_check',
  NameOverLength: 'lobby_copy_name_over_length',
  OnlySpaceError: 'lobby_only_space_error',
};

export default {
  namespace: 'lobby',
  state: {
    wareSort: 0,
    layoutShow: true, //侧边栏状态
    resizeMin: false, //分辨率切换
    resizeMax: false, //全屏
    switchStatu: true, //首页模式切换 true为状态1，false为状态2
    el: null,
    globalTagId: '', //头部标签
  },
  reducers: {
    setWareSort(
      state,
      {
        payload: { wareSort },
      },
    ) {
      return { ...state, wareSort };
    },
    setSidebar(
      state,
      {
        payload: { layoutShow },
      },
    ) {
      return {
        ...state,
        layoutShow,
      };
    },
    setResize(
      state,
      {
        payload: { resizeMin },
      },
    ) {
      return { ...state, resizeMin };
    },
    setResizeMax(
      state,
      {
        payload: { resizeMax },
      },
    ) {
      return { ...state, resizeMax };
    },
    setSwitch(
      state,
      {
        payload: { switchStatu },
      },
    ) {
      return { ...state, switchStatu };
    },
    setEl(
      state,
      {
        payload: { el },
      },
    ) {
      return { ...state, el };
    },
    setGlobalTag(
      state,
      {
        payload: { globalTagId },
      },
    ) {
      return { ...state, globalTagId };
    },
  },
  effects: {
    *getTags({ payload, callback }, { call, put }) {
      const { data } = yield call(getTags);
      if (callback) {
        callback(data);
      }
    },
    *getGameList(
      {
        payload: { page, order, cat, word },
        callback,
      },
      { call },
    ) {
      const { data, count } = yield call(getGameList, { page, order, cat, word });
      if (callback) {
        callback(data, count);
      }
    },
    *getEditList(
      {
        payload: { page, size },
        callback,
      },
      { call },
    ) {
      const data = yield call(getEditList, { page, size });
      if (data.data && data.data.error) {
        const errStr = errTipId[data.data.content.responseJSON.code]
          ? formatMessage({ id: errTipId[data.data.content.responseJSON.code] })
          : data.data.content.responseJSON.message;
        message.error(errStr);
      } else {
        if (callback) {
          callback(data);
        }
      }
    },
    *getHistoryList(
      {
        payload: { page, size, name },
        callback,
      },
      { call },
    ) {
      const { data, count } = yield call(getHistoryList, { page, size, name });
      if (callback) {
        callback(data, count);
      }
    },
    *getElearningUrl({ payload, callback }, { call, put }) {
      const data = yield call(getElearningUrl);
      if (callback) {
        callback(data);
      }
    },
    *getImageUrl(
      {
        payload: { resourceid },
        callback,
      },
      { call,  },
    ) {
      //获取图片
      const data = yield call(getImageUrl, { resourceid });
      if (callback) {
        callback(data);
      }
    },
    *getCreatList(
      {
        payload: { page, word },
        callback,
      },
      { call },
    ) {
      const { data, count } = yield call(getCreatList, { page, word });
      if (callback) {
        callback(data, count);
      }
    },
    getCreateFirstFxiedData(
      {
        callback,
      },
    ) {
      const dataDefine = getLocale()==='zh-CN'? DataDefine: DataDefine_E;
      const originData = DataGameId;
      const serverKey = Edbox.ServerKey;
      const dataGameId = originData[serverKey]? originData[serverKey]: originData["Dev"];
      const data ={};
      data.id = dataGameId.game_id;
      data.game_description = dataDefine.Datas[0].Datas.filter(item => item.Name === 'Description')[0].Value;
      data.game_icon = dataDefine.Datas[0].Datas.filter(item => item.Name === 'CoverImage')[0].GUID;
      data.game_name = dataDefine.Datas[0].Datas.filter(item => item.Name === 'GameName')[0].Value;
      data.tags = [];
      data.version = dataGameId.v;
      data.isFixed = true; // 用来特殊指明是假的数据，用于引导

      if (callback) {
        callback(data);
      }
    },
  },
};
