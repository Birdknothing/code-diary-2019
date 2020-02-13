import * as MyWorksService from '../services/MyWorks';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';

const errTipId={
  'EDBOX_LOBBY/PRODUCT_RELEASED': 'lobby_product_released',
  'EDBOX_LOBBY/ERROR':'lobby_error',
  'EDBOX_LOBBY/INVALID_ARGUMENT':'lobby_invalid_argument',
  'EDBOX_LOBBY/PLAYER_ABNORMAL':'lobby_player_abnormal',
  'EDBOX_LOBBY/PRODUCT_NAME_DUPLICATE': 'lobby_product_name_duplicate',
  'EDBOX_LOBBY/NOT_EXIST':'lobby_not_exist',
  'EDBOX_LOBBY/ILLEGAL_CHARACTER':'lobby_illegal_character',
  'EDBOX_LOBBY/PRODUCT_CHECK':'lobby_product_check',
  'NameOverLength':'lobby_copy_name_over_length',
  'OnlySpaceError':'lobby_only_space_error',
}
export default {
  namespace: 'MyWorks',
  state: {
    currentTabIndex: 0,
    currentPage: 1,
  },
  reducers: {
    setCurrentTabIndex(state,{payload:{currentTabIndex}}){
      return{...state,currentTabIndex}
    },
    setCurrentPage(state,{payload:{currentPage}}){
      return{...state,currentPage}
    },
  },
  effects: {
    *getEditList(
      {
        payload: { page, size },
        callback,
      },
      { call },
    ) {
      const data = yield call(MyWorksService.getEditList, { page, size });
      if (data.data&&data.data.error) {
        const errStr = errTipId[data.data.content.responseJSON.code]?formatMessage({id:errTipId[data.data.content.responseJSON.code]}):data.data.content.responseJSON.message;
        message.error(errStr);
      } else {
        if (callback) {
          callback(data);
        }
      }
    },
    *gePublishList(
      {
        payload: { page, size, name },
        callback,
      },
      { call },
    ) {
      const data = yield call(MyWorksService.gePublishList, { page, size, name });
      if (data.data&&data.data.error) {
        message.error(data.data.content.responseJSON.message);
      } else {
        if (callback) {
          callback(data);
        }
      }
    },
    *soldOutGame(
      {
        payload: { id },
        callback,
      },
      { call },
    ) {
      const data = yield call(MyWorksService.soldOutGame, { app_id: id });
      if (data.data&&data.data.error) {
        message.error(data.data.content.responseJSON.message);
      } else {
        if (callback) {
          callback(data);
        }
      }
    },
    *cancelPublish(
      {
        payload: { id,version },
        callback,
      },
      { call },
    ) {
      const data = yield call(MyWorksService.cancelPublish, { app_id:id,version });
      if (data.data&&data.data.error) {
        message.error(data.data.content.responseJSON.message);
      } else {
        if (callback) {
          callback(data);
        }
      }
    },
    *deleteGame(
      {
        payload: { id },
        callback,
      },
      { call },
    ) {
      const data = yield call(MyWorksService.deleteGame, { app_id:id });
      if (data.data&&data.data.error) {
        const errStr = errTipId[data.data.content.responseJSON.code]?formatMessage({id:errTipId[data.data.content.responseJSON.code]}):data.data.content.responseJSON.message;
        message.error(errStr);
      } else {
        if (callback) {
          callback(data);
        }
      }
    },
    *copyGame(
      {
        payload: { id,curName,version },
        callback,
      },
      { call },
    ) {
      const data = yield call(MyWorksService.copyGame, { app_id:id,curName,version });

      if (data.data&&data.data.error) {
        const errStr = errTipId[data.data.content.responseJSON.code]?formatMessage({id:errTipId[data.data.content.responseJSON.code]}):data.data.content.responseJSON.message;
        message.error(errStr);
      } else {
        if (callback) {

          callback(data);
        }
      }
    },

    *editGameName(
      {
        payload: { id, name },
        callback,
      },
      { call },
    ) {
      const data = yield call(MyWorksService.editGameName, { app_id:id, new_name: name });
      if (data.data&&data.data.error) {
        const errStr = errTipId[data.data.content.responseJSON.code]?formatMessage({id:errTipId[data.data.content.responseJSON.code]}):data.data.content.responseJSON.message;
        message.error(errStr);
      } else {
        if (callback) {
          callback(data);
        }
      }
    },

    *getQrCodeImg(
      {
        payload: { id },
        callback,
      },
      { call },
    ) {
      // access_type、get_type：这里获取H5游戏才有，对应的字段都是传2
      const data = yield call(MyWorksService.getQrCodeImg, { app_id:id,access_type:2,get_type:2  });
      if (data.data&&data.data.error) {

        const errStr = errTipId[data.data.content.responseJSON.code]?formatMessage({id:errTipId[data.data.content.responseJSON.code]}):data.data.content.responseJSON.message;
        message.error(errStr);
      } else {
        if (callback) {
          callback(data);
        }
      }
    },

    *getAppType(
      {
        payload: { id },
        callback,
      },
      { call },
    ) {
      // access_type、get_type：这里获取H5游戏才有，对应的字段都是传2
      const data = yield call(MyWorksService.getAppType, { app_id:id,access_type:2,get_type:2 });

      if (data.data&&data.data.error) {
        const errStr = errTipId[data.data.content.responseJSON.code]?formatMessage({id:errTipId[data.data.content.responseJSON.code]}):data.data.content.responseJSON.message;
        message.error(errStr);
      } else {
        if (callback) {
          callback(data);
        }
      }
    },
  },
};
