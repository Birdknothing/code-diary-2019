import * as detailService from '../services/index';

export default {
  namespace: 'gameDetail',
  state: {},
  reducers: {},
  effects: {
    *getDetail(
      {
        payload: { detail_id },
        callback
      },
      { call, put },
    ) {
      const { data } = yield call(detailService.getDetail, { detail_id });
      if (callback) {
        callback(data);
      }
    },
    *getImageUrl(
      {
        payload: { resourceid },
        callback
      },
      { call, put },
    ) {
      const data = yield call(detailService.getImageUrl, { resourceid });
      if (callback) {
        callback(data);
      }
    },
    *getDetailTags(
      {
        payload: { id },
        callback
      },
      { call, put },
    ) {
      const { data } = yield call(detailService.getDetailTags, { id });
      if (callback) {
        callback(data);
      }
    },
    *getImgBatch(
      {
        payload: { resourceid },
        callback
      },
      { call, put },
    ) {
      const data = yield call(detailService.getImgBatch, { resourceid });
      if (callback) {
        callback(data);
      }
    },
    *gameCollect(
      {
        payload: { id },
        callback
      },
      { call, put },
    ) {
      const { data } = yield call(detailService.gameCollect, { id });
      if (callback) {
        callback(data);
      }
    },
    *gameCollectCancel(
      {
        payload: { id },
        callback
      },
      { call, put },
    ) {
      const { data } = yield call(detailService.gameCollectCancel, { id });
      if (callback) {
        callback(data);
      }
    },
    *getGameRecentUpdate(
      {
        payload: { id },
        callback
      },
      { call, put },
    ) {
      const data = yield call(detailService.getGameRecentUpdate, { id });
      if (callback) {
        callback(data);
      }
    },
    *getGameOriginalTpl(
      {
        payload: { id, version },
        callback
      },
      { call, put },
    ) {
      const { data } = yield call(detailService.getGameOriginalTpl, { id, version });
      if (callback) {
        callback(data);
      }
    },
    *getGameSameTpl(
      {
        payload: { id },
        callback
      },
      { call, put },
    ) {
      const { data } = yield call(detailService.getGameSameTpl, { id });
      if (callback) {
        callback(data);
      }
    },
    *gameReview(
      {
        payload: { id, score, version },
        callback
      },
      { call, put },
    ) {
      const { data } = yield call(detailService.gameReview, { id, score, version });
      if (callback) {
        callback(data);
      }
    },
    *getUserScoreInfo(
      {
        payload: { appId },
        callback
      },
      { call, put },
    ) {
      const { data } = yield call(detailService.getUserScoreInfo, { appId });
      if (callback) {
        callback(data);
      }
    },
    *openGame(
      {
        payload: { appid, playType, version, taskId },
        callback
      },
      { call },
    ) {
      const data = yield call(detailService.openGamePlay, { appid, playType, version, taskId });
      if (callback) {
        callback(data);
      }
    }
  }
};
