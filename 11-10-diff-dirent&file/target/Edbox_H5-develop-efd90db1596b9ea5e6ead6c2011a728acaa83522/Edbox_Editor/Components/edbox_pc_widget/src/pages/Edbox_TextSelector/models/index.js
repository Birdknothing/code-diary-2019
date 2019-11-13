export default {
  namespace: 'textSelector',
  state: {
    "ID": "",
    "Name": "",
    "ShowName": "",
    "Type": "Text01",
    "Value": '之一',
    "Length": 0,
    "ReadOnly": false,
    "StyleEdit": true,
    "Style": {
      "fontFamily": {
        id: 'a39d1544-1cee-4d34-bc94-eafb6a0c6e26',
        name: 'aeDimnahRegular'
      },
      "fontSize": {              // 字体大小
          "size": 21,            // 字体大小 Int类型
          "startNum": 8,         // 最小允许字体大小 Int类型
          "endNum": 72           // 最大允许字体大小 Int类型
      },
      "fontColor": "#F8E71C",    // 字体颜色 String类型
      "fontStyle": {             // 字体样式
          "bold": false,         // 加粗 Boolean类型
          "italic": false,       // 斜体 Boolean类型
          "underline": false    // 下划线 Boolean类型
      },
      "align": 'left'
    }
  },
  reducers: {
    //初始化文字相关信息
    initTextSelector(state, {payload: textSelector}){
      return { ...state, ...textSelector }
    },

    //设置字体样式
    setFontFamily(state, { payload: fontFamily }){
      return { ...state,  Style: { ...state.Style,  fontFamily } }
    },

    //设置字体大小
    setFontSize(state, { payload: fontSize }) {
      return { ...state,  Style: { ...state.Style,  fontSize } }
    },

    //设置字体颜色
    setFontColor(state, { payload: fontColor }) {
      return { ...state,  Style: { ...state.Style,  fontColor: fontColor } }
    },

    //设置字体样式
    setFontStyle(state, { payload: fontStyle }) {
      return { ...state,  Style: { ...state.Style,  fontStyle } }
    },

    //设置文字对齐方式
    setFontAlign(state, { payload: align }) {
      return { ...state,  Style: { ...state.Style,  align: align } }
    },

    //设置项目符号
    setFontSymbol(state, { payload: obj }) {
      return { ...state,  "SymbolValue": obj.SymbolValue,"Value": obj.Value }
    } 
  }
}

