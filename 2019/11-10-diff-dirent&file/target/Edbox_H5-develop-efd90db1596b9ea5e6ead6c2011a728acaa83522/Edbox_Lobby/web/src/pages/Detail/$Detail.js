import React, { Component } from 'react';
import { Icon, Popover, Statistic, Modal, Progress, Rate, message, Anchor, Checkbox, Input, Spin } from 'antd';
import { connect } from 'dva'
import router from 'umi/router';
import { formatMessage, getLocale } from 'umi/locale'
import QRCode  from 'qrcode.react';
import styles from './Detail.scss';
import Banner from '../../components/Banner/Banner';
import GameCard from '../../components/GameCard/GameCard';
import defaultIcon from '@/assets/components/gamecard/default.png';
import ShareModal from '../../components/Share';
import ExportGame from '../../components/Export';
import {Helmet} from "react-helmet";

const { Edbox } = window
const { Link } = Anchor;
const { TextArea } = Input;
const handleClick = (e, link) => {
    e.preventDefault();
};

@connect(({ lobby, detail,MyWork }) => ({
    lobby: lobby,
    detail:detail,
    MyWork,
}))
class Detail extends Component {
    constructor(props){
        super(props)
        this.state = {
            game_info: {},
            tags:[],
            tag_more: false,
            tagsDom: [],
            modalVisible: false, //版本记录弹窗
            modalVisibleComplain: false, //举报
            confirmLoadingComplain: false,
            complainLimit: 380,//举报字数限制
            complainLack: false,
            complainType: false,
            complainButtonClose: true,
            complainForm:{
                content: [],
                description: ''
            },
            showWhat: 'about',
            linkDom:'',
            linkDomDes:'',
            previewDom:'',
            bannerCount: false,
            detailImgUrl:{
                game_icon:'',
                game_img_full:[]
            },
            game_recent_updates: [],
            game_original_tem: [],
            game_same_tem: [],
            isCollect: false,
            rate:0,
            isLoading: false,
            progress: 0,
            uninstallUrl: '',
            webGameUrl: '',
            returnTaskid: '',
            visibleDownload: false,
            visibleIframe: false,
            isFromMyWork: false,
            iframeWidth: '',
            iframeHeight: '',
            shareVisible: false,
            isDes: false,
            tagboxVisible: false,
            desBoxVisible: false,
            isMax: this.props.lobby.layoutShow,
            ratio: 1,
            jump: 'noJump',
            detailLoading: true,
            shareGameUrl: ''
        }
        this.linkDom = <Anchor affix={false} bounds={600} onClick={handleClick} getContainer={() => this.props.lobby.el}>
        <Link href="#detailAbout" title={formatMessage({id:'detail_bot_about'})} />
        <Link href="#detailReviews" title={formatMessage({id:'details_bot_reviews'})} />
        </Anchor>

        this.linkDomMyWork = <Anchor affix={false} bounds={300} onClick={handleClick} getContainer={() => this.props.lobby.el}>
        <Link href="#detailAbout" title={formatMessage({id:'detail_bot_about'})} />
        </Anchor>
        this.linkDomDes = <Anchor affix={false} bounds={300} onClick={handleClick} getContainer={() => this.props.lobby.el}>
        <Link href="#detailAbout"/>
        </Anchor>
        this.previewDom = <Anchor affix={false} bounds={300} onClick={handleClick} getContainer={() => this.props.lobby.el}>
        <Link href="#detailReviews"/>
        </Anchor>
    }

    // 获取url参数
    getUrlParam=(name)=>{
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
      regh = new RegExp("(/?|&)" + name + "=([^&]*)(&|$)"),
      r = window.location.search.substr(1).match(reg),
      h = window.location.hash.substr(1).match(regh);
        if (r !== null) {
            return unescape(r[2]);
        } else if (h !== null) {
            return unescape(h[2]);
        } else {
            return '';
        }
    }
    componentWillMount(){
        this.init()
    }

    backHome = () =>{
        router.push('/')
    }

    init = () =>{
        const { dispatch } = this.props
        const { game_original_tem } = this.state
        const _this = this

        // 判断详情是不是来自我的作品
        const urlParams = _this.getUrlParam('game_type');
        const reqUrl = (urlParams === 'mywork'||urlParams === 'myworkedit')? 'detail/getMyWorkPersonalAppInfo':'detail/getDetail';
        _this.setState({
          isFromMyWork: (urlParams === 'mywork'||urlParams === 'myworkedit')? true: false,
        },()=>{
            this.setState({
                linkDom: this.state.isFromMyWork? this.linkDomMyWork:this.linkDom,
                linkDomDes: this.linkDomDes,
                previewDom:this.previewDom
            })
        });

        dispatch({
            type: reqUrl,
            payload:{
                id:this.props.match.params.Detail
            },
            callback:(data)=>{
                // console.log('详情页数据：',data);
                if(data.error){
                    message.info(formatMessage({id:'game_detail_del'}),2,this.backHome);
                    return;
                }
                this.setState({
                    game_info: data,
                    // bannerCount: data.game_img_full.length,
                    isCollect: data.like,
                    detailLoading: false
                },()=>{
                    if(this.description && (this.description.clientHeight > 210)){
                        this.setState({
                            desBoxVisible: true
                        })
                    }else{
                        this.setState({
                            desBoxVisible: false
                        })
                    }
                    if(data.gameOriginalTpl_display === 0){
                        dispatch({
                            type: 'detail/getGameOriginalTpl',
                            payload:{
                                id: data.baseid,
                                version: data.base_version
                            },
                            callback(data){
                                // console.log(data,666)
                                if(data.error){
                                    return
                                }
                                _this.setState({
                                    game_original_tem: game_original_tem.concat(data)
                                })
                            }
                        })
                    }
                    if(data.gameVersionLog_display === 0){
                        dispatch({
                            type: 'detail/getGameRecentUpdate',
                            payload:{
                                id:this.props.match.params.Detail
                            },
                            callback(data){
                                // console.log(data,22222222)
                                _this.setState({
                                    game_recent_updates: data
                                })
                            }
                        })
                    }
                    if(data.gameSameTpl_display === 0){
                        dispatch({
                            type: 'detail/getGameSameTpl',
                            payload:{
                                id:this.props.match.params.Detail
                            },
                            callback(data){
                                // console.log(data)
                                _this.setState({
                                    game_same_tem: data
                                })
                            }
                        })
                    }
                })
                this.getGameIcon(data.game_icon)
                this.getGameBannerBatch(data.game_img_full)
            }
        })
        dispatch({
            type: 'lobby/edboxInit',
            payload:{},
            callback:(data)=>{
                dispatch({
                    type: 'detail/getDetailTags',
                    payload:{
                        id:this.props.match.params.Detail
                    },
                    callback:(data)=>{
                        this.setState({
                            tags:data.filter(arr => arr !==''),
                            tagsDom: _this.handleTagsDom(data.filter(arr => arr !=='')),
                        },()=>{
                            if(this.tagbox && this.tagbox.clientHeight > 72){
                                this.setState({
                                    tagboxVisible: true
                                })
                            }else{
                                this.setState({
                                    tagboxVisible: false
                                })
                            }
                        })
                    }
                })
                dispatch({
                    type: 'detail/getUserScoreInfo',
                    payload:{
                        appId:this.props.match.params.Detail
                    },
                    callback:(data)=>{
                        // console.log(data)
                        if(data.score){
                            this.setState({
                                rate: data.score
                            })
                        }
                    }
                })
            }
        })
        
    }
    componentDidMount(){
        // const {isFromMyWork } = this.state;
        // this.setState({
        //     linkDom:isFromMyWork? this.linkDomMyWork:this.linkDom,
        //     linkDomDes: this.linkDomDes,
        //     previewDom:this.previewDom
        // })
    }

    getGameIcon = resourceid =>{
        const { dispatch } = this.props
        const { detailImgUrl } = this.state
        const _this = this

        dispatch({
            type: 'lobby/getImageUrl',
            payload: {
                resourceid: resourceid
            },
            callback(data){
                if(data.data){
                    _this.setState({
                        detailImgUrl:{
                            ...detailImgUrl,
                            game_icon: ''
                        }
                    })
                }else{
                    _this.setState({
                        detailImgUrl:{
                            ...detailImgUrl,
                            game_icon: data
                        }
                    })
                }
                
            }
        })
    }

    getGameBannerBatch = (imgId) =>{
        const { dispatch } = this.props
        dispatch({
            type: 'lobby/getImgBatch',
            payload:{
                resourceid: [...imgId]
            },
            callback:(data)=>{
                let guidValueList = []
                imgId.map((g,i)=>{
                    guidValueList.push(!data[g] ? '' : data[g].Url)
                    return true
                })
                this.setState(prevState=>({
                    bannerCount: true,
                    detailImgUrl:{
                        ...prevState.detailImgUrl,
                        game_img_full: guidValueList,
                    },
                }))
            }
        })
    }

    handleTagsDom = (data) =>{
        return(<div className={styles.morePopover}>{
            data.map((item,i)=>{
                return(<p key={item.id || i}>{item.value || item}</p>)
            })
        }</div>)
    }

    handleLongNum = (num) =>{
        if(parseInt(num) > 1000000 ){
            return Math.round(num/100000)/10 + 'million'
        }else{
            return num
        }
    }

    showModal = () => {
        this.setState({
          modalVisible: true,
        });
        Edbox.DataStatistic.ClickEvent('ViewAll','Detail','')
    };

    showModalComplain = () => {
        this.setState({
            modalVisibleComplain: true,
        });
        Edbox.DataStatistic.ClickEvent('OpenReport','Detail','')
    };

    handleCancel = e => {
        this.setState({
            modalVisible: false,
        });
    };

    handleCancelComplain = e =>{
        this.setState({
            modalVisibleComplain: false,
        });
        Edbox.DataStatistic.ClickEvent('CloseReport','Detail','')
    }

    handleCancelComplainBtn = e =>{
        this.setState({
            modalVisibleComplain: false,
        });
        Edbox.DataStatistic.ClickEvent('CancelReport','Detail','')
    }

    complainOnChange = (checkedValues) =>{ //举报多选框
        const { complainForm } = this.state
        this.setState({
            complainForm: {
                ...complainForm,
                content: checkedValues
            },
            complainType: checkedValues.length > 0 ? true : false
        })

    }
    textareaOnChange = (e) =>{ //举报输入框
        // console.log('area =', e.target.value)
        this.count(e.target.value)
        const { complainForm } = this.state
        this.setState({
            complainForm: {
                ...complainForm,
                description: e.target.value
            },

        })
    }

    count = (value) =>{
        const max = 380;
        let len = 0;
        if(value.length < 15){
            this.setState({
                complainLack: false
            })
            return;
        }else{
            this.setState({
                complainLack: true
            })
        }
        for(var i=0;i<value.length;i++){
            const single = value.charCodeAt(i);
            if ((single >= 0x0001 && single <= 0x007e) || (0xff60<=single && single<=0xff9f)) {
                len++;
				if(len > max){
					len--;
					break;
		        }
            }
            else {
                len+=2;
				if(len > max){
					len-=2;
					break;
		        }
            }
        }
        this.setState({
            complainLimit: max-len
        })
    }


    handleOkComplain = () => {
        const { Edbox } = window 
        const { complainForm } = this.state
        const { dispatch } = this.props
        const { content, description } = complainForm
        const _this = this
        this.setState({
            confirmLoadingComplain: true,
        });
        // console.log(this.state.game_info)
        dispatch({
            type:'detail/complainGame',
            payload:{
                id: this.props.match.params.Detail,
                userId: Edbox.EbUserId,
                version: this.state.game_info.ver,
                content: content.join(','),
                description: description
            },
            callback(data){
                // console.log('举报提交:',data)
                if(data.data && data.data.error){
                    if(data.data.content === '您已举报该作品，请耐心等待审核结果'){
                        message.info(formatMessage({id:'complain_submit_failure'}))
                    }else{
                        message.info(formatMessage({id:'complain_submit_failure02'}))
                    }
                    _this.setState({
                        modalVisibleComplain: false,
                        confirmLoadingComplain: false,
                        complainLack: false,
                        complainForm: {
                            content: [],
                            description: '',
                        }
                    });
                }else{
                    message.success(formatMessage({id:'complain_submit_success'}))
                    _this.setState({
                        modalVisibleComplain: false,
                        confirmLoadingComplain: false,
                        complainLack: false,
                        complainForm: {
                            content: [],
                            description: '',
                        }
                    });
                }
                Edbox.DataStatistic.ClickEvent('CommitReport','Detail','')
            }
        })
    }

    onChangeRate = value => { //打分
        const { dispatch } = this.props
        const { game_info} = this.state
        dispatch({
            type:'detail/gameReview',
            payload:{
                id: this.props.match.params.Detail,
                score: value,
                version: game_info.ver
            },
            callback:(data)=>{
                this.setState({
                    rate: value,
                    game_original_tem:[],
                    detailImgUrl:{
                        game_icon:'',
                        game_img_full:[]
                    },
                },()=>{
                    message.success(formatMessage({id:'detail_message_rate'}));
                    this.init()
                });
                Edbox.DataStatistic.ClickEvent('ScoreGame','Detail','')
            }
        })
    };

    handleCollect = ()=>{
        const { dispatch } = this.props
        dispatch({
            type: 'detail/gameCollect',
            payload:{
                id: this.props.match.params.Detail
            },
            callback:(data)=>{
                this.setState({
                    isCollect: true
                })
                // message.success(formatMessage({id:'detail_collect_success'}));
                Edbox.DataStatistic.ClickEvent('CollectGame','Detail','')
            }
        })
    }

    handleCollectCancel = ()=>{
        const { dispatch } = this.props
        dispatch({
            type: 'detail/gameCollectCancel',
            payload:{
                id: this.props.match.params.Detail
            },
            callback:(data)=>{
                this.setState({
                    isCollect: false
                })
                // message.success(formatMessage({id:'detail_cancel_success'}));
            }
        })
    }

    handleOpenGame = id =>{
        const { dispatch, location, lobby } = this.props
        const { query } = location
        const { isLoading } = this.state
        const taskId =  Edbox.GetGUID()
        if(isLoading){
            return
        }
        this.setState({
            isLoading: true
        },()=>{
            this.handleProgress(taskId)
        })
        dispatch({
            type:'lobby/openGame',
            payload:{
                appid: id,
                playType: query.game_type === 'mywork' ? 2 : 3,
                version: '',
                taskId: taskId
            },
            callback:(data)=>{
                this.reflash = setTimeout(()=>{
                    dispatch({
                        type:'lobby/setPlayStatu',
                        payload:{
                            playStatu: lobby.playStatu + 1
                        }
                    })
                },500)
                if(data.data && data.data.error && data.data.content.Code !== 'UNINSTALL' ){
                    this.setState({
                        isLoading: false,
                        progress:0
                    })
                    message.info(formatMessage({id:'open_failed'}));
                    clearInterval(this.progress);
                }
                if(data.data && data.data.content.Code === 'UNINSTALL'){
                    clearInterval(this.progress);
                    this.setState({
                        uninstallUrl: data.data.content.Message,
                        visibleDownload: true,
                        isLoading: false,
                        progress:0
                    })
                }
                if(data.Code && data.Code === "WEBGAME"){
                    clearInterval(this.progress);
                    const gameW = data.Message.width
                    const gameH = data.Message.height
                    const windowW = document.documentElement.clientWidth
                    const windowH = document.documentElement.clientHeight
                    if(gameW !== 0 && gameH !== 0){
                        if(gameW/gameH > 1){
                            this.setState({
                                webGameUrl: data.Message.Url,
                                iframeWidth: windowW > 1358 ? '1171px' : '86%',
                                iframeHeight: windowW > 1358 ? (1171) / (gameW/gameH) : (windowW * 0.86) / (gameW/gameH),
                                visibleIframe: true,
                                isLoading: false,
                                progress:0,
                                ratio: gameW/gameH
                            })
                        }else{
                            this.setState({
                                webGameUrl: data.Message.Url,
                                iframeWidth: (windowH - 28) * (gameW/gameH),
                                iframeHeight: windowH - 28,
                                visibleIframe: true,
                                isLoading: false,
                                progress:0,
                                ratio: gameW/gameH
                            })
                        }
                    }else{
                        this.setState({
                            webGameUrl: data.Message.Url,
                            iframeWidth: windowW > 1358 ? '1171px' : '86%',
                            iframeHeight: windowW > 1358 ? '659px' : (windowW * 0.86) / (1171/659),
                            visibleIframe: true,
                            isLoading: false,
                            progress:0
                        })
                    }
                    
                    dispatch({
                        type:'lobby/listenEditorExit',
                        payload:{},
                        callback:(data)=>{  
                            if(data.data && data.data.error){
                                return
                              }
                            console.log('关闭编辑器')
                            this.handleOk();
                        }
                    })
                    const _this = this;
                    Edbox.LocationLoad = function(window, url, type){
                        // 设置URL变更时的处理方法
                         // 如果type = "Editor" 变成编辑器的样式
                        // 如果type = "Studio" 关闭子窗口
                        // console.log(["子窗口加载回调", window, url, type]);
                        if(type === 'Studio'){
                            _this.handleOk();
                        }
                        if(type === 'Editor'){
                            _this.setState({
                                iframeWidth: '100%',
                                iframeHeight:'100%',
                                jump: 'editor'
                            })
                        }
                    }
                }
                if(data.Code === "SUCCESS"){
                    this.setState({
                        isLoading: false,
                        progress:0
                    })
                    clearInterval(this.progress);
                }
                Edbox.DataStatistic.ClickEvent('PlayGame','Detail',this.state.game_info.game_name)
            }
        })
    }

    handleProgress = (id) =>{
        const { dispatch } = this.props
        this.progress = setInterval(()=>{
            const { progress } = this.state
            dispatch({
                type: 'lobby/getProgress',
                payload:{
                    TaskId: id
                },
                callback:(data)=>{
                    // console.log(data)
                    if(progress < 100){
                        this.setState(prevState=>({
                            progress: data
                        }))
                    }else{
                        this.setState({
                            isLoading: false,
                            progress:0
                        })
                        clearInterval(this.progress);
                    }

                }
            })
        },500)
    }
    handleOk = () =>{
        this.setState({
          visibleDownload: false,
          visibleIframe: false
        })
    }
    handleOkDownload = () =>{
        const { uninstallUrl } = this.state
        window.open(uninstallUrl)
        this.setState({
          visibleDownload: false
        })
    }

    handleShareVisble = (targetAttrStr, targeVal) => {
        this.setState({
          [targetAttrStr]: targeVal,
        });
    };

    getShareGameUrl = (id) =>{
        const { location } = this.props
        const { query } = location

        Edbox.Lobby.GetH5AppUrl({
            app_id: id,
            access_type: query.game_type === 'mywork' ? 2 : 3
        },(data)=>{
            // console.log('OK:',data)
            this.setState({
                shareGameUrl: data === '' ? window.location.href : data
            })
        },(err)=>{
            // console.log('err:',err)
            this.setState({
                shareGameUrl: window.location.href
            })
        })
    }

    sharePopChange = (visible) =>{
        const { shareGameUrl } = this.state;
        if(visible){
            if(shareGameUrl === ''){
                this.getShareGameUrl(this.props.match.params.Detail);
            }
            Edbox.DataStatistic.ClickEvent('ShareGame','Detail','')
        }
    }

    handleShare = (type) =>{
        const { dispatch, location } = this.props
        const { query } = location
        dispatch({
            type:'lobby/sharedAppByThird',
            payload:{
                appId: this.props.match.params.Detail,
                access: query.game_type === 'mywork' ? 2 : 3,
                type: type
            },
            callback:(data)=>{
                // console.log(data,1111)
            //     if(data && data.data.error){
            //         return
            //     }else{
            //         window.open(data)
            //     }
            }
        })
    }

    handleQr = (visible) =>{
        const { dispatch, location } = this.props
        const { query } = location
        if(visible){
            dispatch({
                type: 'lobby/sharedApp',
                payload:{
                    appId: this.props.match.params.Detail,
                    access: query.game_type === 'mywork' ? 2 : 3,
                    type:'QR'
                },
                callback:(data)=>{
                }
            })
        }
    }

    handleCopyLink = () =>{
        const { dispatch, location } = this.props
        const { query } = location
        this.copy((res)=>{
            if(res === 1){
                dispatch({
                    type: 'lobby/sharedApp',
                    payload:{
                        appId: this.props.match.params.Detail,
                        access: query.game_type === 'mywork' ? 2 : 3,
                        type:'Link'
                    },
                    callback:(data)=>{
                    }
                })
                message.success(formatMessage({id:'copy_success'}))
            }else{
                message.success(formatMessage({id:'copy_failure'}))
            }
        })
    }

    copy = (callback) =>{
        const { shareGameUrl } = this.state;
        if(document.execCommand('Copy')){
            //创建input
            var inputZ = document.createElement('input');
            //添加Id,用于后续操作
            inputZ.setAttribute('id','inputCopy');
            //获取当前链接
            inputZ.value = shareGameUrl;
            //创建的input添加到body
            document.body.appendChild(inputZ);
            //选中input中的值
            document.getElementById('inputCopy').select();
            //把值复制下来
            document.execCommand('Copy')
            //删除添加的input
            document.body.removeChild(inputZ);
            // 成功回調1
            callback(1);
        }else{
            // 失敗回調2
            callback(2);
        }
    }

    showDes = () =>{
        this.setState({
            isDes: true,
            desBoxVisible: false
        })
    }

    componentWillUnmount(){
        clearInterval(this.progress);
        clearTimeout(this.reflash)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.match.params.Detail !== this.props.match.params.Detail || nextProps.location.query.game_type !== this.props.location.query.game_type){
            this.setState({
                game_original_tem:[],
                detailImgUrl:{
                    game_icon:'',
                    game_img_full:[]
                },
                rate: 0,
                bannerCount: false,
                shareGameUrl: ''
            },()=>{
                this.init()
            })
        }
        if(nextProps.lobby.layoutShow !== this.props.lobby.layoutShow){
            this.setState({
                isMax: nextProps.lobby.layoutShow
            })
        }
    }

    render() {
        const { lobby, location } = this.props
        const { isShowPlay } = lobby
        const logo = require('@/assets/layout/logo.png')
        const { game_info, tagsDom, tags,linkDom, linkDomDes, previewDom, complainLimit, complainLack, detailImgUrl, bannerCount, game_recent_updates, game_original_tem, game_same_tem, complainType, complainForm, isCollect, rate, shareVisible, isDes, isMax, jump } = this.state
        const { isLoading, progress, visibleDownload, visibleIframe, webGameUrl ,isFromMyWork, iframeWidth, iframeHeight, tagboxVisible, desBoxVisible} = this.state
        const { collect_display, experienced_display, gameOriginalTpl_display, gameSameTpl_display, onlineNumber_display, report_display, reviews_display, score_display, gameVersionLog_display} = game_info
        const { game_icon, game_img_full } = detailImgUrl
        const { game_reviews, game_reviews_0, game_reviews_1, game_reviews_2, game_reviews_3, game_reviews_4, } = game_info
        const complain_options=[
            {label:formatMessage({id:'complain_item01'}),value: formatMessage({id:'complain_item01'})},
            {label:formatMessage({id:'complain_item02'}),value:formatMessage({id:'complain_item02'})},
            {label:formatMessage({id:'complain_item03'}),value:formatMessage({id:'complain_item03'})},
            {label:formatMessage({id:'complain_item04'}),value:formatMessage({id:'complain_item04'})},
            {label:formatMessage({id:'complain_item05'}),value:formatMessage({id:'complain_item05'})},
            {label:formatMessage({id:'complain_item06'}),value:formatMessage({id:'complain_item06'})},
            {label:formatMessage({id:'complain_item07'}),value:formatMessage({id:'complain_item07'})},
            {label:formatMessage({id:'complain_item08'}),value:formatMessage({id:'complain_item08'})},
            {label:formatMessage({id:'complain_item09'}),value:formatMessage({id:'complain_item09'})},
        ]
        const content = (
            <div className={'header-option detail'}>
                <ExportGame
                txt='exe'
                type='exe'
                appId={this.props.match.params.Detail}
                icon={game_info.game_icon}
                accessType={isFromMyWork ? 2 : 3}
                gameName={game_info.game_name}
                />
                <ExportGame
                txt='apk'
                type='apk'
                appId={this.props.match.params.Detail}
                icon={game_info.game_icon}
                accessType={isFromMyWork ? 2 : 3}
                gameName={game_info.game_name}
                isEnable={game_info.exportapk_enable}
                />
              {/* <p>exe</p>
              <p>apk</p> */}
            </div>
        );

        
        const qrCodeContent = (
            <div className={styles['qrcode-box']}>
                <div className={styles['qrcode-img']}>{this.state.shareGameUrl !== '' ? <QRCode size={142} value={this.state.shareGameUrl} /> : ''}</div>
                {/* <div className={styles['qrcode-img']}><img src={this.state.shareGameUrl} alt=""/></div> */}
                <p>{formatMessage({id:"qrcode_tips"})}</p>
            </div>
        )
        const shareContent =(
            <div className={styles['share-box']}>
                <div onClick={()=>this.handleShareVisble('shareVisible',true)} className={`${styles['share-item']} ${styles['share-friend']}`}></div>
                {
                    (this.props.lobby.thirdParty.indexOf('Fackbook') > -1) && location.query.game_type !== 'mywork' && 
                    <div onClick={()=>this.handleShare('Fackbook')} className={`${styles['share-item']} ${styles['share-facebook']}`}></div>
                }
                {
                    (this.props.lobby.thirdParty.indexOf('Twitter') > -1) && location.query.game_type !== 'mywork' && 
                    <div onClick={()=>this.handleShare('Twitter')} className={`${styles['share-item']} ${styles['share-twitter']}`}></div>
                }
                {
                    (this.props.lobby.thirdParty.indexOf('QQ') > -1) && location.query.game_type !== 'mywork' && 
                    <div onClick={()=>this.handleShare('QQ')} className={`${styles['share-item']} ${styles['share-qq']}`}></div>
                }
                {
                    (this.props.lobby.thirdParty.indexOf('Weibo') > -1) && location.query.game_type !== 'mywork' && 
                    <div onClick={()=>this.handleShare('Weibo')} className={`${styles['share-item']} ${styles['share-weibo']}`}></div>
                }
                <Popover onVisibleChange={this.handleQr} overlayClassName={styles['qrcode-pop']} placement="bottom" content={qrCodeContent} trigger="hover">
                <div className={`${styles['share-item']} ${styles['share-qrcode']}`}></div>
                </Popover>
                <div onClick={this.handleCopyLink} className={`${styles['share-item']} ${styles['share-link']}`}></div>
            </div>
        )
        if(!this.state.detailLoading){
        return (

            <div className={styles.main}>
                <Helmet>
                     {/* facebook shared */}
                    <meta charSet="utf-8" />
                    <meta property="fb:app_id"  content="654723381692290" />
                    <meta property="og:title"  content={game_info.game_name} />
                    <meta property="og:description" content={game_info.game_description} />
                    <meta property="og:image"content={game_icon === '' ? defaultIcon : game_icon} />
                    <meta property="og:image:width"content="256" />
                    <meta property="og:image:heigh"content="256" />

                    {/* twitter shared */}
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content="@nytimesbits" />
                    <meta name="twitter:creator" content="@nickbilton" />
                    <meta property="og:url" content={Edbox.GetHost('Lobby')+"/edbox/?channel=Default#/Detail/" + this.props.match.params.Detail} />
                    <meta property="og:title" content={game_info.game_name}/>
                    <meta property="og:description" content={game_info.game_description} />
                    <meta property="og:image" content={game_icon === '' ? defaultIcon : game_icon} />
                </Helmet>

                {/* <Affix offsetTop={0} target={() => this.props.lobby.el}> */}

                <div className={`${styles.topBar} ${styles.fixed} ${isMax ? styles.max : styles.min}`}>
                    <span className={styles.icon}><img src={game_icon === '' ? defaultIcon : game_icon} alt=""/></span>
                    <span className={styles.name}>{game_info.game_name}</span>
                    {
                        isShowPlay ? 
                        <div className={styles['play-box']}>
                            <div onClick={()=>this.handleOpenGame(this.props.match.params.Detail)} className={`${styles['play']} ${isLoading ? styles['loading'] : ''}`}>{isLoading ? 'Loading' : formatMessage({id:'play'})}</div>
                            <span style={{width: progress + '%'}} className={styles['progress']}></span>
                        </div>
                        :null
                    }
                </div>
                {/* </Affix> */}
                <div className={styles.container}>
                    <div className={`${styles.mainTop} clearfix`}>
                        {
                            bannerCount ?
                            <Banner
                            full={game_img_full}
                            thumbnail={game_img_full}
                            />
                            :
                            <div style={{
                                textAlign:'center',
                                paddingTop: '220px',
                                width: '750px',
                                height: '530px',
                                backgroundColor: '#efefef',
                                borderRadius: '5px',
                                overflow:'hidden',
                                float: 'left',
                            }}>
                            <Spin size="large" />
                            </div>
                        }

                        <div className={styles.gameInfo}>
                            <div className={`${styles.gameCard} clearfix`}>
                                <div className={styles.gameIcon}><img src={game_icon === '' ? defaultIcon : game_icon} alt=""/></div>
                                <div className={styles.gameTitle}>
                                    <h2>{game_info.game_name}<span>(v{game_info.ver})</span></h2>
                                    <div className={styles.gameAuthor}>
                                        <span className={styles.portrait}><img src={game_info.game_author_img} alt=""/></span>
                                        <span className={styles.authorName}>{game_info.game_author_name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.gameDes}>
                                <div className={styles.title}>{formatMessage({id:'detail_description'})}</div>
                                <div className={styles.contentbox}>
                                    {linkDomDes}
                                    <div className={styles.content}>{game_info.game_description}</div>
                                </div>
                            </div>
                            <div className={styles.Tag}>
                                <div className={styles.title}>{formatMessage({id:'detail_tag'})}</div>
                                <div className={styles.contentbox}>
                                    <div ref={node=>this.tagbox = node}>
                                        {
                                            tags.map((item,i)=>(
                                                <p key={i}>{item.value || item}</p>
                                            ))
                                        }
                                    </div>
                                    {
                                        tagboxVisible ?
                                        <Popover placement="bottomRight" content={tagsDom} trigger="click">
                                        <div className={styles.more}>
                                            <p><Icon type="down" style={{'fontSize': '12px','color':'#ccc','cursor':'pointer'}} /></p>
                                        </div>
                                        </Popover>
                                        :
                                        null
                                    }

                                </div>
                            </div>

                            <div className={styles.score}>
                                {
                                    score_display === 0?
                                    <div className={styles.title}>{formatMessage({id:'detail_score'})}</div>
                                    :null
                                }
                                <div className={`${styles.contentbox} clearfix`}>
                                    {
                                        game_reviews >= 5 ?
                                        <div className={styles.num}><Statistic valueStyle={{color:'#111',fontSize:'40px',fontWeight:'bold',lineHeight:'1'}} value={game_info.game_score} precision={1} /></div>
                                        :
                                        null
                                    }

                                    <div className={styles.right}>
                                        {
                                            score_display === 0?
                                            <div>
                                            {
                                                game_reviews >= 5 ?
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':`${(game_info.game_score/5)*100 + '%'}`}}></span>
                                                </div>
                                                :
                                                <div className={styles.tips}>{formatMessage({id:'detail_less_reviews'})}</div>
                                            }
                                            </div>
                                            :null
                                        }
                                        

                                        <div className={styles.rightInfo}>
                                            {
                                                (experienced_display === 0 && game_info.game_experienced > 0)?
                                                <span>{this.handleLongNum(game_info.game_experienced)} {formatMessage({id:'detail_experienced'})}</span>
                                                :null
                                            }
                                            {
                                                (experienced_display === 0 && reviews_display === 0 && game_info.game_experienced > 0 && game_reviews > 0)?
                                                <em>·</em>:null
                                            }
                                            
                                            {
                                                (reviews_display === 0 && game_reviews > 0)?
                                                <span style={{position:'relative',display:'inline-block'}}>{previewDom}{this.handleLongNum(game_reviews)} {formatMessage({id:'detail_reviews'})} <Icon type="edit" /></span>
                                                :null
                                            }
                                            
                                        </div>
                                    </div>
                                    {
                                        game_info.grade === 0 ?
                                        <div className={styles.rated}>
                                            {formatMessage({id:'game_rated'})} : -
                                        </div>
                                        :null
                                    }
                                    {
                                        game_info.grade === 1 ?
                                        <div className={styles.rated}>
                                            {formatMessage({id:'game_rated'})} : E
                                        </div>
                                        :null
                                    }
                                    {
                                        game_info.grade === 2 ?
                                        <div className={styles.rated}>
                                            {formatMessage({id:'game_rated'})} : E10+
                                        </div>
                                        :null
                                    }
                                    {
                                        game_info.grade === 3 ?
                                        <div className={styles.rated}>
                                            {formatMessage({id:'game_rated'})} : T
                                        </div>
                                        :null
                                    }
                                    {
                                        game_info.grade === 4 ?
                                        <div className={styles.rated}>
                                            {formatMessage({id:'game_rated'})} : M
                                        </div>
                                        :null
                                    }
                                    {
                                        game_info.grade === 5 ?
                                        <div className={styles.rated}>
                                            {formatMessage({id:'game_rated'})} : AO
                                        </div>
                                        :null
                                    }
                                </div>
                            </div>

                            <div className={styles.bot}>
                                <div className={`${styles.bot1} clearfix`}>
                                    {
                                        (onlineNumber_display === 0 && game_info.game_playing) ?
                                        <span className={styles.playing}>{this.handleLongNum(game_info.game_playing)} {formatMessage({id:'detail_playing'})}</span>
                                        :null
                                    }
                                    {
                                        report_display === 0 ?
                                        <span onClick={()=>this.showModalComplain()} className={styles.complain}>{formatMessage({id:'detail_complain'})}</span>
                                        :null
                                    }
                                    
                                </div>
                                <div className={`${styles.bot2} clearfix`}>
                                    <div onClick={()=>this.handleOpenGame(this.props.match.params.Detail)} className={styles['play-loading']}>
                                        <span className={`${styles['play']} ${isLoading ? styles['loading'] : ''}`}>{isLoading ? 'Loading' : formatMessage({id:'play'})}</span>
                                        <span style={{width: progress + '%'}} className={styles['progress']}></span>
                                    </div>

                                    <Popover overlayClassName={'header-pop detail'} placement="bottomRight" content={content} trigger="click">
                                    <div className={styles['other-box']}>
                                    <span className={styles.other}><i className={styles['icon-export']}></i> <span>{formatMessage({id:'export'})}</span></span>
                                    </div>
                                    </Popover>
                                    <Popover overlayClassName={styles['share-pop']} onVisibleChange={(visible)=>this.sharePopChange(visible)} placement="bottomRight" content={shareContent} trigger="hover">
                                    <div className={styles['other-box']}>
                                    <span className={styles.other}><Icon type="share-alt" /> <span>{formatMessage({id:'share'})}</span></span>
                                    </div>
                                    </Popover>
                                    {
                                        collect_display === 0 ? 
                                        <div className={styles['other-box']}>
                                        {
                                            !isCollect ?
                                            <span onClick={this.handleCollect} className={styles.other}><Icon type="heart" /> <span>{formatMessage({id:'favorite'})}</span></span>
                                            :
                                            <span onClick={this.handleCollectCancel} className={styles.other}><Icon type="heart" style={{color:'#da0301'}} theme="filled" /> <span>{formatMessage({id:'favorite'})}</span></span>
                                        }
                                        </div>
                                        :null
                                    }
                                    <Modal
                                    cancelText={formatMessage({id:'cancel'})}
                                    okText={formatMessage({id:'feedback_confirm'})}
                                    title={formatMessage({id:'detail_complain'})}
                                    visible={this.state.modalVisibleComplain}
                                    onOk={this.handleOkComplain}
                                    confirmLoading={this.state.confirmLoadingComplain}
                                    onCancel={this.handleCancelComplain}
                                    cancelButtonProps={{
                                        onClick:this.handleCancelComplainBtn
                                    }}
                                    okButtonProps={{ disabled: !(complainType && complainLack) }}
                                    >
                                    <div style={{marginBottom:'15px'}}>
                                        <label style={{marginBottom:'5px',display:'inline-block'}}>{formatMessage({id:'complain_game'})}</label>
                                        <div>{game_info.game_name}</div>
                                    </div>
                                    <div style={{marginBottom:'15px'}}>
                                        <label style={{marginBottom:'5px',display:'inline-block'}}>{formatMessage({id:'complain_content'})}</label>
                                        <Checkbox.Group
                                        value={complainForm.content}
                                        options={complain_options}
                                        onChange={this.complainOnChange} />
                                    </div>
                                    <div style={{marginBottom:'15px'}}>
                                        <label style={{marginBottom:'5px',display:'inline-block'}}>{formatMessage({id:'complain_brief'})}</label>
                                        <div>
                                        <TextArea
                                        value={complainForm.description}
                                        placeholder={formatMessage({id:'complain_tips'})} rows={4}
                                        onChange={this.textareaOnChange} />
                                        </div>
                                        {
                                            !complainLack ?
                                            <p style={{textAlign:'right'}}>{formatMessage({id:'complain_limit'})}</p>
                                            :
                                            <p style={{textAlign:'right'}}>{formatMessage({id:'complain_limit01'})}{complainLimit}{formatMessage({id:'complain_limit02'})}</p>
                                        }

                                    </div>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.mainBot}>
                        <div className={styles.detailTab}>
                            {linkDom}
                        </div>
                        <div className={`${styles.contentbox} clearfix`}>
                            <div className={styles.tabContent}>
                                <div className={styles.about}>
                                    <div className={styles.description}>
                                        <h2 id="detailAbout" className={styles.aboutTitle}>{formatMessage({id:'detail_description'})}</h2>
                                        <div className={`${styles.desBox} ${isDes ? styles.un : ''}`}>
                                            <div className={styles.info}  ref={node=>this.description = node} >
                                                {game_info.game_description}
                                            </div>
                                        </div>
                                        {
                                            desBoxVisible ?
                                            <div onClick={this.showDes} className={styles.btn}>{formatMessage({id:'detail_view_all'})}</div>
                                            :
                                            null
                                        }
                                    </div>
                                    {
                                        gameVersionLog_display === 0?
                                        <div className={styles.recent}>
                                            <h2 className={styles.aboutTitle}>
                                            {formatMessage({id:'detail_recent_updates'})}
                                            </h2>
                                            {
                                                game_recent_updates.length > 0 ?
                                                <div>
                                                    <h3 className={styles.recentTitle}>{formatMessage({id:'detail_version'})} {game_recent_updates[0].ver}</h3>
                                                    <div className={styles.txt}>
                                                        {game_recent_updates[0].details}
                                                    </div>
                                                    <div style={{textAlign:'right'}}><span className={styles.btn} onClick={this.showModal}>{formatMessage({id:'detail_view_all'})}</span></div>
                                                    <Modal
                                                    title={formatMessage({id:'detail_recent_updates'})}
                                                    visible={this.state.modalVisible}
                                                    onCancel={this.handleCancel}
                                                    width={700}
                                                    footer={null}
                                                    >
                                                    {
                                                        game_recent_updates.map((item,i)=>(
                                                            <div key={i} style={{marginBottom:'15px',borderBottom:'1px solid #e2e2e2e2',paddingBottom:'15px'}}>
                                                                <h3 style={{fontSize:'16px',color:'#333',fontWeight:'bold'}}>{formatMessage({id:'detail_version'})} {item.ver}</h3>
                                                                <div style={{fontSize:'16px',color:'#333',marginBottom:'30px',lineHeight:'30px'}}>
                                                                    {item.details}
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                    </Modal>
                                                </div>
                                                :
                                                null

                                            }
                                        </div>
                                        :null
                                    }
                                </div>
                                {score_display === 0?(
                                <div className={styles.reviews}>
                                    <h2  id="detailReviews" className={styles.aboutTitle}>{formatMessage({id:'details_bot_reviews'})}</h2>
                                    <div className={styles.recentTitle}>{formatMessage({id:'details_bot_score'})}:</div>
                                    <div className={`${styles.botReviews} clearfix`}>
                                        <div className={styles.left}>
                                            {
                                                game_reviews >= 5 ?
                                                <div className={styles.num}><Statistic valueStyle={{color:'#111',fontSize:'72px',fontWeight:'bold',lineHeight:'1'}} suffix={formatMessage({id:'detail_bot_out'})} value={game_info.game_score} precision={1} /></div>
                                                :
                                                <div className={styles.tips}>{formatMessage({id:'detail_less_reviews'})}</div>
                                            }
                                            {
                                                game_reviews >= 5 ?
                                                <p>{this.handleLongNum(game_reviews)} {formatMessage({id:'detail_reviews'})}</p>
                                                :null
                                            }

                                            <p>{formatMessage({id:'detail_bot_last_ver'})} {game_info.ver}</p>
                                        </div>
                                        <div className={styles.right}>
                                            <div className={styles.item}>
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':'100%'}}></span>
                                                </div>
                                                <Progress percent={game_reviews >= 5? (game_reviews_4/game_reviews)*100 : 0} strokeWidth={10} strokeColor="#da0301" showInfo={false} />
                                            </div>
                                            <div className={styles.item}>
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':'80%'}}></span>
                                                </div>
                                                <Progress percent={game_reviews >= 5? (game_reviews_3/game_reviews)*100 : 0} strokeWidth={10} strokeColor="#da0301" showInfo={false} />
                                            </div>
                                            <div className={styles.item}>
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':'60%'}}></span>
                                                </div>
                                                <Progress percent={game_reviews >= 5? (game_reviews_2/game_reviews)*100 : 0} strokeWidth={10} strokeColor="#da0301" showInfo={false} />
                                            </div>
                                            <div className={styles.item}>
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':'40%'}}></span>
                                                </div>
                                                <Progress percent={game_reviews >= 5? (game_reviews_1/game_reviews)*100 : 0} strokeWidth={10} strokeColor="#da0301" showInfo={false} />
                                            </div>
                                            <div className={styles.item}>
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':'20%'}}></span>
                                                </div>
                                                <Progress percent={game_reviews >= 5? (game_reviews_0/game_reviews)*100 : 0} strokeWidth={10} strokeColor="#da0301" showInfo={false} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.comments}>
                                        <div className={styles.recentTitle}>{formatMessage({id:'details_tab_to_rate'})}:</div>
                                        <div className={styles.star}>
                                        <Rate
                                        value={rate}
                                        style={{fontSize:'43px',color:'#da0301',WebkitTextStroke:'1px #000'}}
                                        onChange={this.onChangeRate}
                                        />
                                        </div>
                                        <p className={styles.tips}>{formatMessage({id:'detail_bot_tips'})}</p>
                                    </div>
                                </div>
                                ):null}
                            </div>
                            <div className={styles.template}>
                            {
                                game_original_tem.length > 0 && gameOriginalTpl_display === 0 ?
                                <div>
                                    <h2 className={styles.aboutTitle}>{formatMessage({id:'detail_original_template'})}</h2>
                                    <GameCard
                                        margin='nomargin'
                                        datas={game_original_tem}
                                        type="simple"
                                        isDetail="disable"
                                        statisticCategory='Detail'
                                    />
                                </div>
                                :
                                null
                            }
                            {
                                game_same_tem.length > 0 && gameSameTpl_display === 0 ?
                                <div>
                                    <h2 className={styles.aboutTitle}>{formatMessage({id:'detail_same_template'})}</h2>
                                    <GameCard
                                        margin='nomargin'
                                        datas={game_same_tem}
                                        statisticCategory='Detail'
                                    />
                                </div>
                                :
                                null
                            }
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                centered={true}
                title={formatMessage({id:'download'})}
                visible={visibleDownload}
                onOk={this.handleOkDownload}
                onCancel={this.handleOk}
                cancelText={formatMessage({id:'cancel'})}
                okText={formatMessage({id:'feedback_confirm'})}
                >
                <p>{formatMessage({id:'tips_noserver'})}</p>
                </Modal>
                <Modal
                title={jump === 'editor' ? <h1 className={'logo'}><img src={logo} alt=""/></h1> : null}
                centered={true}
                maskClosable={false}
                visible={visibleIframe}
                onOk={this.handleOk}
                onCancel={this.handleOk}
                destroyOnClose={true}
                footer={null}
                width={iframeWidth}
                style={{
                    height: iframeHeight
                }}
                className={jump === 'editor' ? 'iframeEdit' : (this.state.ratio >= 1 ? "iframePlay ratioW" : 'iframePlay')}
                >
                <iframe
                src={webGameUrl}
                allow="microphone"
                frameBorder="0"
                title="edbox"
                width="100%"
                height="100%"
                id="controlsFrame"
                name="controlsname"
                />
                </Modal>
                <ShareModal 
                    appId={this.props.match.params.Detail}
                    appName={game_info.game_name}
                    iconUrl={game_icon}
                    access={isFromMyWork ? 2 : 3}
                    visible={shareVisible}
                    version={game_info.ver}
                    onChange={()=>this.handleShareVisble('shareVisible',false)}
                />
            </div>
        )}else{
            return (<div style={{
                textAlign:'center',
                width: '100%',
                height: '100%',
                paddingTop: '100px'
            }}>
                <Spin size="large" />
              </div>)
        }
    }
}

export default Detail;
