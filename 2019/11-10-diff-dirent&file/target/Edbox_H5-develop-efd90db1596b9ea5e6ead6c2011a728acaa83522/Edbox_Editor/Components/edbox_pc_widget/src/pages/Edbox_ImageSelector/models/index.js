export default {
  namespace: 'imageSelector',
  state: {
    initialImage: {},
    imageConfig: {},
    selectingImg: {},
    isSelectForTextImg: false,
    textImageData: {},
    hasSensitive: false
  },
  reducers: {
    setInitData(
      state,
      {
        payload: { imageConfig, selectingImg, initialImage }
      },
    ) {
      return {
        ...state,
        imageConfig,
        selectingImg,
        initialImage
      };
    },
    setData(
      state,
      {
        payload: { imageConfig, selectingImg }
      },
    ) {
      return { ...state, imageConfig, selectingImg };
    },
    setImageConfig(state, { payload: imageConfig }) {
      return { ...state, imageConfig };
    },
    setSelectingImg(state, { payload: selectingImg }) {
      return { ...state, selectingImg };
    },
    setFlag(
      state,
      {
        payload: { isSelectForTextImg }
      },
    ) {
      return { ...state, isSelectForTextImg };
    },
    setTextImageData(state, { payload: textImageData }) {
      return { ...state, textImageData };
    },
    setTextImageSetting(
      state,
      {
        payload: { isSelectForTextImg, textImageData, hasSensitive }
      },
    ) {
      return { ...state, isSelectForTextImg, textImageData, hasSensitive };
    },
    setTextIsSensitive(
      state,
      {
        payload: { hasSensitive }
      },
    ) {
      return { ...state, hasSensitive };
    }
  }
};
