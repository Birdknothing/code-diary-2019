import * as publishService from '../services/publishgame';

export default {
    namespace: 'PublishGame',
    state:{
        feedBackVisible: false,
        publishGame: {
            game_icon: '',
            game_icon_url:'',
            game_name: '',
            game_description:'',
            tags_game:[
            ],
            tags_edu:[
            ],
            tags_other:[
            ],
            platform: 1,
            ver: '',
            immediately: true,
            publish_date: '',
            game_update: '',
            price: 1,
            image_config: {
                ID:[],
                ImageType: ["png","jpeg","jpg"],
                Value:[]
            },
        },
        tags:{
            tags_game:[
            ],
            tags_edu:[
            ],
            tags_other:[
            ],
        }
    },
    reducers:{
        setPublish(state,{payload:{publishGame}}){
            return{...state,publishGame}
        },
        setTags(state,{payload}){
            return{...state,tags:{...payload}}
        },
        setFeedBackVisible(state,{payload:{feedBackVisible}}){
            return{...state,feedBackVisible}
        },
        setOriginPublish(state,{payload:{ data: publishGame }}){
            if(publishGame){
                // publishGame.image_config = {
                //     ID:["81591a1f-8b66-414b-88aa-05a2305c910e"],
                //     ImageType: ["png","jpeg","jpg"],
                //     Value:[]
                // }
                publishGame.image_config.Value=[]
                // publishGame.image_config.ID = []
            }
            return{...state,publishGame}
        },
    },
    effects: {
        *getPublishOrigin({ payload: { id },callback }, { call, put }) {
          const {data} = yield call(publishService.getPublishOrigin, { id });
        //   yield put({ type: 'setOriginPublish', payload: {data} });
          if(callback){
              callback(data)
          }
        },
        *getPublishCountDown({ payload,callback }, { call, put }) {
          const data = yield call(publishService.getPublishCountDown);
          if(callback){
              callback(data)
          }
        },
        *postGameInfo({ payload: { id, game_name, game_icon, introduction, tags, ver,immediately, publish_date, game_update, screenshot },callback }, { call, put }) {
          const data = yield call(publishService.postGameInfo, { id, game_name, game_icon, introduction, tags, ver, immediately, publish_date, game_update, screenshot });
          if(callback){
              callback(data)
          }
        },
        *addTag({ payload: { value },callback }, { call, put }) {
          const data = yield call(publishService.addTag, { value });
          if(callback){
              callback(data)
          }
        },
        *deleteTag({ payload: { value },callback }, { call, put }) {
          const data = yield call(publishService.deleteTag, { value });
          if(callback){
              callback(data)
          }
        },
        *checkVersion({ payload: { value },callback }, { call, put }) {
          const data = yield call(publishService.checkVersion, { value });
          if(callback){
              callback(data)
          }
        },
    },
}
