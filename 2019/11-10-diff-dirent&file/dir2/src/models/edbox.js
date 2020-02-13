

export default {
  namespace: 'edbox',
  state: {
    locale: undefined
  },
  reducers: {
    setLocale(state, { payload: {  locale } }) {
      return {
        ...state,
        locale
      };
    }
  }
}