import * as lobbyService from '../services/lobby';

export default {
    namespace: 'lobby',
    state:{
        layoutShow: true, //侧边栏状态
        switchStatu: true, //首页模式切换 true为状态1，false为状态2
        tabTagsId: undefined,// 首页头部tab
        el: undefined,
        resizeMin: false, //分辨率切换
        resizeMax: false, //全屏
        globalSearchKey: '',
        globalSearchIndex: 0,
        userInfo:{},
        globalTagId: '',//头部标签
        lobbyRoute:{
            index:0,
            route:[]
        },
        isShowPlay: false,
        playStatu: 0,
        editStatu:0,
        isOpenUnityEditor: false, // 用于判断是否是打开unity编辑器，unity编辑器要手动用输入移入页面自动刷新列表
        openUnityEditorRefreshFun:()=>{}, // 打开unity编辑器的全局刷新事件，事件触发绑在最外层的body上
        isNeedRefreshMyWork: false, // 用于判断是否需要刷新当前的我的作品中的编辑界面
        thirdParty:[],
        hotSearchType:'set', // 热词搜索类型：“base”模板库，“set”体验区，个人库没有搜索功能
        isPlay: false
    },
    reducers:{
        setSidebar(
            state,
            {
                payload: {layoutShow}
            }
        ){
            return{
                ...state,
                layoutShow
            }
        },
        setPlayStatu(state,{payload:{playStatu}}){
            return{...state,playStatu}
        },
        setEditStatu(state,{payload:{editStatu}}){
            return{...state,editStatu}
        },
        setDetailPlay(state,{payload:{isShowPlay}}){
            return{...state,isShowPlay}
        },
        setLobbyRoute(state,{payload:{lobbyRoute}}){
            return{...state,lobbyRoute}
        },
        setSwitch(state,{payload:{switchStatu}}){
            return{...state,switchStatu}
        },
        settabTagsId(state,{payload:{tabTagsId}}){
            return{...state,tabTagsId}
        },
        setEl(state,{payload:{el}}){
            return{...state,el}
        },
        setResize(state,{payload:{resizeMin}}){
            return{...state,resizeMin}
        },
        setResizeMax(state,{payload:{resizeMax}}){
            return{...state,resizeMax}
        },
        setGlobalSearchKey(state,{payload:{globalSearchKey,globalSearchIndex}}){
            return{...state,globalSearchKey,globalSearchIndex}
        },
        setUserInfo(state,{payload:{userInfo}}){
            return{...state,userInfo:{...state.userInfo,...userInfo}}
        },
        setGlobalTag(state,{payload:{globalTagId}}){
            return{...state,globalTagId}
        },
        setIsOpenUnityEditor(state,{payload:{isOpenUnityEditor}}){
           return{...state,isOpenUnityEditor}
        },
        setOpenUnityEditorRefreshFun(state,{payload:{openUnityEditorRefreshFun}}){
          return{...state,openUnityEditorRefreshFun}
        },
        setIsNeedRefreshMyWork(state,{payload:{isNeedRefreshMyWork}}){
          return{...state,isNeedRefreshMyWork}
        },
        setThirdParty(state,{payload:{thirdParty}}){
           return{...state,thirdParty}
        },
        setHotSearchType(state,{payload:{hotSearchType}}){
          return{...state,hotSearchType}
        },
        setPlay(state,{payload:{isPlay}}){
          return{...state,isPlay}
        }
    },
    effects: {
        *getUserInfo({ payload,callback }, { call, put }) {
            const {data} = yield call(lobbyService.getUserInfo);
            yield put({ type: 'setUserInfo', payload: {userInfo:data} });
        },
        *getTags({ payload,callback }, { call, put }) {
            const {data} = yield call(lobbyService.getTags);
            if(callback){
                callback(data)
            }
        },
        *getImageUrl({ payload:{resourceid},callback }, { call, put }) { //获取图片
            const data = yield call(lobbyService.getImageUrl,{ resourceid });
            if(callback){
                callback(data)
            }
        },
        *getHistoryList({ payload: { page = 1 }, callback},{ call }){
            const { data } = yield call(lobbyService.getHistoryList,{ page })
            if(callback){
                callback(data)
            }
        },
        *initService({ payload, callback},{ call }){
            const data = yield call(lobbyService.initService)
            if(callback){
                callback(data)
            }
        },
        *openGame({ payload:{ appid, playType, version, taskId }, callback},{ call }){
            const data  = yield call(lobbyService.openGamePlay,{ appid, playType, version, taskId })
            if(callback){
                callback(data)
            }
        },
        *openEditor({ payload:{ taskId, appid, version, accessType }, callback},{ call }){
            const data  = yield call(lobbyService.openGameEditor,{ taskId, appid, version, accessType })
            if(callback){
                callback(data)
            }
        },
        *getProgress({ payload:{ TaskId }, callback},{ call }){
            const data = yield call(lobbyService.getProgress,{TaskId})
            if(callback){
                callback(data)
            }
        },
        *getPublishOrigin({ payload:{ id }, callback},{ call }){
          const data = yield call(lobbyService.getPublishOrigin,{id})
          if(callback){
              callback(data)
          }
        },
        *isSensitive({ payload:{ word }, callback},{ call }){
          const data = yield call(lobbyService.isSensitive,{word})
          if(callback){
              callback(data)
          }
        },
        *isNameDuplicate({ payload:{ id, releaseMode, accessType, appName }, callback},{ call }){
          const data = yield call(lobbyService.isNameDuplicate,{id, releaseMode, accessType, appName})
          if(callback){
              callback(data)
          }
        },
        *getWebIMUrl({ payload, callback},{ call }){
          const data = yield call(lobbyService.getWebIMUrl)
          if(callback){
              callback(data)
          }
        },
        *getFriendList({ payload:{ offset, size, word }, callback},{ call }){
          const data = yield call(lobbyService.getFriendList,{ offset, size, word })
          if(callback){
              callback(data)
          }
        },
        *shareApp({ payload:{ appId, receiver, appName, iconUrl, access, get_type, version }, callback},{ call }){
          const data = yield call(lobbyService.shareApp,{ appId, receiver, appName, iconUrl, access, get_type, version })
          if(callback){
              callback(data)
          }
        },
        *getLibUrl({ payload, callback},{ call,put }){
          const data = yield call(lobbyService.getLibUrl)
          if(callback){
              callback(data)
          }
        },
        *getElearningUrl({ payload, callback},{ call,put }){
          const data = yield call(lobbyService.getElearningUrl)
          if(callback){
              callback(data)
          }
        },
        *edboxInit({ payload, callback},{ call }){
          const data = yield call(lobbyService.edboxInit)
          if(callback){
              callback(data)
          }
        },
        *exportApk({ payload:{
            taskId,  //任务id
            appId, //作品id
            icon,  //作品图标资源guid
            accessType, //我的作品2，体验区3
            gameName //作品名称
        }, callback},{ call }){
          const data = yield call(lobbyService.exportApk,{
            taskId,  //任务id
            appId, //作品id
            icon,  //作品图标资源guid
            accessType, //我的作品2，体验区3
            gameName //作品名称
        })
          if(callback){
              callback(data)
          }
        },
        *exportExeGame({ payload:{ taskId, appId, icon, accessType, gameName }, callback},{ call }){
          const data = yield call(lobbyService.exportExeGame,{ taskId, appId, icon, accessType, gameName })
          if(callback){
              callback(data)
          }
        },
        *exportEditor({ payload:{ taskId, appId, icon, gameName }, callback},{ call }){
          const data = yield call(lobbyService.exportEditor,{ taskId, appId, icon, gameName })
          if(callback){
              callback(data)
          }
        },
        *getUnReplyFeedBacks({ payload, callback},{ call }){
          const data = yield call(lobbyService.getUnReplyFeedBacks)
          if(callback){
              callback(data)
          }
        },
        *getThirdPartyShare({ payload, callback},{ call,put }){
          const data = yield call(lobbyService.getThirdPartyShare)
          console.log(data,333)
          if(data.data && data.data.error){
              return
          }
          yield put({ type: 'setThirdParty', payload: {thirdParty:data} });
          if(callback){
              callback(data)
          }
        },
        *sharedAppByThird({ payload:{ appId, access, type }, callback},{ call }){
          const data = yield call(lobbyService.sharedAppByThird,{ appId, access, type })
          if(callback){
              callback(data)
          }
        },
        *listenEditorExit({ payload, callback},{ call }){
          const data = yield call(lobbyService.listenEditorExit)
          if(callback){
              callback(data)
          }
        },
        *sharedApp({ payload:{ appId, access, type}, callback},{ call }){
            const data = yield call(lobbyService.sharedApp,{ appId, access, type})
            if(callback){
                callback(data)
            }
        },
        *getImgBatch({ payload:{resourceid},callback }, { call, put }) { //获取图片
            const data = yield call(lobbyService.getImgBatch,{ resourceid });
            if(callback){
                callback(data)
            }
        },
        *getGameList({ payload: { page, order, cat, word,size }, callback},{ call }){
            const { data, count } = yield call(lobbyService.getGameList,{ page, order, cat, word,size })
            if(callback){
                callback(data, count)
            }
        },
        *getHotWordList({ payload, callback }, { call }) {
          const { data } = yield call(lobbyService.getHotWordList, payload);
          if (callback) {
            callback(data);
          }
        }
    }
}
