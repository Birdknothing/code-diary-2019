export default {
    namespace: 'textEditor',
    state: {
        EnglishName: "",
        ErrorText: "",
        HelpText: "",
        HintText: "",
        ID: "",
        InputHintText: "",
        IsRequired: false,
        Length: 30,
        Name: "gameName",
        ReadOnly: false,
        ShowName: "游戏名称",
        "Style": {
            "fontFamily": {            // 字体类型
                "id": 0,               // 字体编号 Int类型
                "name": 'A Galega'     // 字体名称 String类型
            },
            "fontSize": {              // 字体大小
                "size": 20,            // 字体大小 Int类型
                "startNum": 8,         // 最小允许字体大小 Int类型
                "endNum": 72           // 最大允许字体大小 Int类型
            },
            "fontColor": "#F8E71C",    // 字体颜色 String类型
            "fontStyle": {             // 字体样式
                "bold": false,         // 加粗 Boolean类型
                "italic": false,       // 斜体 Boolean类型
                "underline": false,    // 下划线 Boolean类型
            }
        },
        StyleEdit: true,
        Type: "Text01",
        Value: "文字编辑"
      },
    reducers: {

        //初始化文字相关信息
        initTextSelector(state, {payload: textSelector}){  
            return { ...state, ...textSelector }
        },

        //文本内容修改
        changeValue(state, {payload: Value}) {
            return {...state, Value};
        },

        //修改文字字体
        changeFontFamily(state, {payload: fontFamily}) {          
            return { ...state,  Style: { ...state.Style,  fontFamily } }
        },

        //修改字体大小
        changeFontSize(state, {payload: fontSize}) {    
            return { ...state,  Style: { ...state.Style, fontSize}} 
        },

        //修改字体颜色
        changeFontColor(state, { payload: fontColor }) {
            return { ...state,  Style: { ...state.Style,  fontColor: fontColor } }
        },
    }
}