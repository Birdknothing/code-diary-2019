export default {
    namespace: 'frameSelector',
    state:{
        initialFrame:{},
        frameConfig:{},
        selectingFrame:[],
        frameCyclic: 0,
        frameLength: 0,
        radioValue: 1
    },
    reducers:{
        setInitData(state,{
            payload:{ frameConfig, initialFrame, selectingFrame, frameCyclic, frameLength }
        }){
            return{
                ...state,
                frameConfig,
                initialFrame,
                selectingFrame,
                frameCyclic,
                frameLength
            };
        },
        setData(state,{payload:{ frameConfig, selectingFrame }}){
            return {...state, frameConfig, selectingFrame}
        },
        setFrameConfig(state,{ payload: {frameConfig}}){
            return { ...state, frameConfig };
        },
        setSelectingFrame(state,{ payload: {selectingFrame}}){
            return { ...state, selectingFrame };
        },
        setCyclic(state,{payload:{frameCyclic}}){
            return {...state,frameCyclic}
        },
        setTime(state,{payload:{frameLength}}){
            return {...state,frameLength}
        },
        setRadioValue(state,{payload:{radioValue}}){
            return {...state,radioValue}
        }
    }
}