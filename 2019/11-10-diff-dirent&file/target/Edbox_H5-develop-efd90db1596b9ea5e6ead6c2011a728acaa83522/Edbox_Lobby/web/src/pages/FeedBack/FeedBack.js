import React, { Component } from 'react';
import { Input, Modal, Button, Avatar, Icon, Upload, Message, Radio, Spin, Badge } from 'antd';
import { formatMessage } from 'umi/locale'
import { connect } from 'dva'
import InfiniteScroll from 'react-infinite-scroller';
import feed from './FeedBack.scss';
import CustomTag from './components/CustomTag';
import UploadImages from './components/UploadImages/UploadImages';
import List from './components/List';
import kefu from '../../assets/icon-kefu.png'
import defaultBg from '@/assets/bg_img.png';
import ListDetail from './components/ListDetail';


const { TextArea } = Input;
@connect(({ lobby, FeedBack }) => ({
    lobby: lobby,
    FeedBack: FeedBack
}))
class FeedBack extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentIndex: 0,
            confirmLoading: false,
            mineList: [],
            DetailFeedBacks: [],
            detailVisible: false,
            loadingList: [],
            config:{ //提交建议截图
                Value:[],
                ImageType: ["png","jpeg","jpg"],
                dentyID:[]
            },
            configContinue: { //提交回复截图
                Value:[],
                dentyID:[]
            },
            ImageType:['png','jpeg','jpg'],
            template: {},
            sFeedbackType:"",
            model_field:{
                scene:[]
            },
            number: 0,
            numberContact: 0,
            subscript: '',
            contact:'',
            replyContent: '',
            sendLoading: false,
            thisDetailFeedbackId: undefined,
            scrollLoading: false,
            hasMore:true,
            hasMoreReply: true,
            pageFeed: 1,
            pageReply: 1,
            confirmVisible:false,
            confirmDetailVisible: false,
            contactValidateStatus: true,
            isDestory: false,
            autoScroll: false,
            badge: false
        }
    }

    componentWillMount(){
        const { dispatch } = this.props
        const _this = this
        dispatch({
            type:'FeedBack/getFeedBackTem',
            callback(data){
                _this.setState({
                    template: data,
                })
            }
        })
    }

    componentDidMount(){
        const { dispatch } = this.props
        const _this = this
        dispatch({
            type: 'FeedBack/getFeedBacks',
            payload: {
                page: this.state.pageFeed
            },
            callback(data){
                if(data.data && data.data.error){
                    return
                }
                _this.setState({
                    mineList: data.items,
                    mineCount: data.count
                })
            }
        })
        this.updateUnReplay()
    }

    close = () =>{
        const { contact, sFeedbackType, model_field, config, subscript } = this.state
        
        if(contact !== '' || sFeedbackType !=='' || model_field.scene.length >0 || config.dentyID.length > 0 || subscript!==''  ){
            this.setState({
                confirmVisible: true
            })
        }else{
            this.setState({
                visible: false,
                contact: '',
                sFeedbackType: '',
                model_field:{
                    scene: []
                },
                config:{
                    Value:[],
                    ImageType: ["png","jpeg","jpg"],
                    dentyID:[]
                },
                subscript: '',
                currentIndex: 0,
                number: 0,
                numberContact: 0,
                hasMore:true
            })
            this.updateUnReplay()
            this.props.close()
        }
        
    }

    realClose = () =>{
        this.setState({
            visible: false,
            confirmVisible: false,
            contact: '',
            sFeedbackType: '',
            model_field:{
                scene: []
            },
            config:{
                Value:[],
                ImageType: ["png","jpeg","jpg"],
                dentyID:[]
            },
            subscript: '',
            currentIndex: 0,
            number: 0,
            numberContact: 0,
            hasMore:true
        })
        this.updateUnReplay()
        this.props.close()
    }

    handleConfirmStatus = () =>{
        this.setState({
            confirmVisible: false,
            confirmDetailVisible: false
        })
    }

    handleClick = (value,children,target) =>{
        const { model_field } = this.state
        model_field[target] = [...model_field[target] || []] 
        if(value){
            this.setState({
                model_field : {
                    ...model_field,
                    [target]: model_field[target].concat(children)
                }
            })
        }else{
            this.setState({
                model_field:{
                    ...model_field,
                    [target]: model_field[target].filter(item=>item !== children)
                }
            })
        }
    }

    handleRadioType = (e) =>{
        this.setState({
            sFeedbackType: e.target.value
        })
    }
    handleRadio = (e) =>{
        const { model_field } = this.state
        this.setState({
            model_field:{
                ...model_field,
                scene: e.target.value
            }
        })
    }

    handleUploadForm = config =>{
        this.setState({config})
    }

    handleTab = index =>{
        const { dispatch } = this.props
        this.setState({
            currentIndex: index
        })
        if(index === 1){
            dispatch({
                type: 'FeedBack/getFeedBacks',
                payload: {
                    page: 1
                },
                callback:(data)=>{
                    if(data.data && data.data.error){
                        return
                    }
                    this.setState({
                        mineList:[...data.items],
                        mineCount: data.count,
                        pageFeed: 1
                    })
                }
            })
        }else{
            this.setState({
                isDestory: false
            })
        }
        this.updateUnReplay()
    }

    handleDetail = (id,data) =>{ //查看反馈列表详情
        const { dispatch } = this.props
        const { DetailFeedBacks } = this.state
        const { type, scene, content, date_created, screenshot,feedback_type } = data
        const _this = this
        var lz = [{
            content: content,
            type:0,
            reply_time: date_created,
            id:id,
            screenshot: screenshot,
            isLz: true,
            feedback_type:feedback_type
        }]
        this.setState({
            detail_type: type,
            detail_scene: scene,
            thisDetailFeedbackId: id,
            replyId: id,
            DetailFeedBacks: lz.concat(DetailFeedBacks),
            lz:lz
        })
        
        dispatch({
            type: 'FeedBack/getFeedBackReply',
            payload: {
                feedback_id: id,
                page:1
            },
            callback(data){
                if(data.data && data.data.error){
                    Message.info(formatMessage({id:'feedback_del_tips'}))
                    dispatch({
                        type: 'FeedBack/getFeedBacks',
                        payload: {
                            page: 1
                        },
                        callback:(data)=>{
                            _this.setState({
                                mineList:[...data.items],
                                mineCount: data.count,
                                pageFeed: 1
                            })
                        }
                    })
                    return
                }
                _this.setState({
                    DetailFeedBacks: [...lz.concat(data.replys)],
                    detailVisible: true,
                    replyCount: data.count,
                    pageReply: 1,
                    hasMoreReply: true,
                })
            }
        })
        dispatch({
            type: 'FeedBack/refreshFeedBackState',
            payload: {
                feedback_id: id
            },
            callback:(data)=>{
                this.updateUnReplay()
            }
        })
    }

    handleDetailReflash = (id) =>{ //刷新反馈列表详情
        const { dispatch } = this.props
        const { lz } = this.state
        const _this = this
        this.setState({
            thisDetailId: id
        })
        
        dispatch({
            type: 'FeedBack/getFeedBackReply',
            payload: {
                feedback_id: id,
                page:1
            },
            callback:(data)=>{
                // console.log(data)
                _this.setState({
                    DetailFeedBacks: [...lz.concat(data.replys)],
                    replyCount: data.count,
                    hasMoreReply: true,
                    autoScroll: true
                },()=>{
                    this.timerScroll = setTimeout(()=>{
                        this.containerReply.scrollTop = this.containerReply.scrollHeight
                    },500)
                })
            }
        })
        dispatch({
            type: 'FeedBack/refreshFeedBackState',
            payload: {
                feedback_id: id
            },
            callback:(data)=>{
                this.updateUnReplay()
            }
        })
    }

    closeDetail = () =>{
        const { replyContent, configContinue } = this.state
        const { dispatch } = this.props
        if(replyContent !== '' || configContinue.dentyID.length > 0){
            this.setState({
                confirmDetailVisible: true
            })
        }else{
            this.setState({
                detailVisible: false,
                replyContent: '',
                configContinue: {
                    Value:[],
                    dentyID: []
                },
                autoScroll: false
            })
            dispatch({
                type: 'FeedBack/getFeedBacks',
                payload: {
                    page: 1
                },
                callback:(data)=>{
                    this.setState({
                        mineList:[...data.items],
                        mineCount: data.count,
                        pageFeed: 1
                    })
                }
            })
        }
    }

    realCloseDetail = () =>{
        const { dispatch } = this.props
        this.setState({
            confirmDetailVisible: false,
            detailVisible: false,
            replyContent: '',
            configContinue: {
                Value:[],
                dentyID: []
            },
            autoScroll: false
        })
        dispatch({
            type: 'FeedBack/getFeedBacks',
            payload: {
                page: 1
            },
            callback:(data)=>{
                this.setState({
                    mineList:[...data.items],
                    mineCount: data.count,
                    pageFeed: 1
                })
            }
        })
    }

    handleBeforeUpload= file => { //提交回复图片上传前处理
        // 检查图片大小[暂无需求]
        // 检查文件类型
        const imageType = file.type.split('/')[1];
        const size = file.size / 1024 / 1024 < 5
        if (this.state.ImageType.indexOf(imageType) === -1) {
          Message.info(formatMessage({ id: 'invalid_image_type' }));
          return false;
        }
        if (!size) {
            Message.info(formatMessage({ id: 'publish_image_size_error' }));
            return false;
        }
        this.handleUpload(file);
        return true;
    }

    handleUpload = file =>{ //提交回复图片上传
        const { dispatch } = this.props
        const { loadingList, configContinue } = this.state;
        const _this = this
        if(!file){
            return false;
        }
        loadingList.push('loading');
        this.setState({
            loadingList: [...loadingList]
        })
        dispatch({
            type:'FeedBack/uploadImage',
            payload: {file},
            callback(data){
                if(data.data && data.data.error){
                    Message.info(formatMessage({ id: 'feedback_error_file' }));
                    loadingList.pop();
                    _this.setState({
                        configContinue:{ ...configContinue },
                        loadingList: [...loadingList]
                    })
                }else{
                    loadingList.pop();
                    configContinue.Value.push(data.url)
                    configContinue.dentyID.push(data.dentry_id)
                    _this.setState({
                        configContinue:{ ...configContinue },
                        loadingList: [...loadingList]
                    })
                }
            }
        })
    }

    handleRemove = index =>{ //提交回复删除
        const { configContinue } = this.state;
        configContinue.Value.splice(index, 1);
        configContinue.dentyID.splice(index,1)
        this.setState({
            configContinue: { ...configContinue },
        });
    }

    handleSubscript = (e) =>{
        const max = 500;
        let value = e.target.value;
        let len = 0;
        if(value){
            for(var i=0;i<value.length;i++){
                    len++;
                    if(len > max){
                        len--;
                        break;
                    }
            }
            if(value.length > i){
                value = value.substring(0,i)
            }
        }
        this.setState({
            subscript: value,
            number: len
        })
    }

    handleContact = (e) =>{
        var reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/g;
        var regTel = /^1[3456789]\d{9}$/;

        if(e.target.value.length !== 0){
            if(!regTel.test(e.target.value) && !reg.test(e.target.value)){
                Message.info(formatMessage({id:'feedback_error_contact'}))
                this.setState({
                    contactValidateStatus: false
                })
            }else{
                this.setState({
                    contactValidateStatus: true
                })
            }
        }else{
            this.setState({
                contactValidateStatus: true
            })
        }
    }
    handleContact02 = (value) =>{
        var reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/g;
        var regTel = /^1[3456789]\d{9}$/;

        if(value.length !== 0){
            if(!regTel.test(value) && !reg.test(value)){
                return false
            }else{
                return true
            }
        }else{
            return true
        }
    }
    handleContactChange = (e)=>{
        const max = 64;
        let value = e.target.value;
        let len = 0;
        if(value){
            for(var i=0;i<value.length;i++){
                    len++;
                    if(len > max){
                        len--;
                        break;
                    }
            }
            if(value.length > i){
                value = value.substring(0,i)
            }
        }
        this.setState({
            contact: value,
            numberContact: len
        })
    }

    handleReplyChange = (e) =>{ //回复信息
        this.setState({
            replyContent: e.target.value
        })
    }

    handleSendReply = () =>{
        const { dispatch } = this.props
        const { replyContent, configContinue, thisDetailFeedbackId, replyId } = this.state
        const _this = this
        let flag = true;
        this.setState({
            sendLoading: true
        })
        const imgHtml = configContinue.dentyID.length >0 ? `<dentryId>${configContinue.dentyID.join(',')}</dentryId>` : '';
        const sendTxt = replyContent + imgHtml;
        if(replyContent.length > 500){
            Message.info(formatMessage({id:'feedback_error_reply'}))
            this.setState({
                sendLoading: false,
            })
            flag = false
        }
        if(sendTxt === ''){
            Message.info(formatMessage({id:'feedback_error_replay'}))
            this.setState({
                sendLoading: false,
            })
            flag = false
        }
        if(flag){
            dispatch({
                type: 'FeedBack/postFeedBackReply',
                payload:{
                    feedback_id: thisDetailFeedbackId,
                    content: sendTxt
                },
                callback(data){
                    if(data.data && data.data.error){
                        Message.info(formatMessage({id:'feedback_del_tips'}))
                        dispatch({
                            type: 'FeedBack/getFeedBacks',
                            payload: {
                                page: 1
                            },
                            callback:(data)=>{
                                _this.setState({
                                    mineList:[...data.items],
                                    mineCount: data.count,
                                    pageFeed: 1,
                                    sendLoading: false,
                                    replyContent: '',
                                    configContinue: {
                                        Value:[],
                                        dentyID: []
                                    },
                                    detailVisible: false,
                                    autoScroll: false
                                })
                            }
                        })
                        return
                    }
                    _this.setState({
                        sendLoading: false,
                        replyContent: '',
                        configContinue: {
                            Value:[],
                            dentyID: []
                        },
                        // detailVisible:false,
                        pageReply: 1
                    })
                    _this.handleDetailReflash(replyId)
                    Message.info(formatMessage({id:'feedback_success_replay'}))
                    dispatch({
                        type: 'FeedBack/getFeedBacks',
                        payload: {
                            page: 1
                        },
                        callback:(data)=>{
                            _this.setState({
                                mineList:[...data.items],
                                mineCount: data.count,
                                pageFeed: 1
                            })
                        }
                    })
                }
            })
            
        }
    }

    handleInfiniteOnLoad = () =>{
        const { dispatch } = this.props
        const { mineList, pageFeed, mineCount } = this.state
        const _this = this
        this.setState({
            loading: true
        })
        if(mineList.length >= mineCount){ //根据接口的count
            this.setState({
              hasMore: false,
              loading: false,
            })
            return;
        }
        dispatch({
            type: 'FeedBack/getFeedBacks',
            payload: {
                page: pageFeed + 1
            },
            callback(data){
                _this.setState({
                    mineList: [...mineList.concat(data.items)],
                    pageFeed: pageFeed + 1,
                    loading: false,
                })
            }
        })

    }

    handleInfiniteOnLoadReply = () =>{
        const { dispatch } = this.props
        const { DetailFeedBacks, replyId, pageReply, replyCount, autoScroll } = this.state
        const _this = this
        this.setState({
            loadingReply: true
        })
        if(DetailFeedBacks.length >= replyCount){ //根据接口的count
            this.setState({
                hasMoreReply: false,
                loadingReply: false,
            })
            return;
        }
        dispatch({
            type: 'FeedBack/getFeedBackReply',
            payload: {
                feedback_id: replyId,
                page: pageReply + 1
            },
            callback:(data)=>{
                _this.setState({
                    DetailFeedBacks: DetailFeedBacks.concat(data.replys),
                    loadingReply: false,
                    replyCount: data.count,
                    pageReply: pageReply +1
                },()=>{
                    this.timerScroll = setTimeout(()=>{
                        if(autoScroll){
                            this.containerReply.scrollTop = this.containerReply.scrollHeight
                        }
                    },0)
                })
            }
        })
    }

    submit = () =>{
        const { contact, sFeedbackType, model_field, config, subscript } = this.state
        const { dispatch } = this.props
        let flag = true;
        const _this = this
        this.setState({
            confirmLoading: true,
        });

        if(sFeedbackType === ''){
            Message.info(formatMessage({id:'feedback_error_type'}))
            flag = false
                this.setState({
                    confirmLoading: false
                })
            return
        }
        if(model_field.scene.length <=0){
            Message.info(formatMessage({id:'feedback_error_scene'}))
            flag = false
            this.setState({
                confirmLoading: false
            })
            return
        }
        if(!this.handleContact02(contact)){
            flag = false
            Message.info(formatMessage({id:'feedback_error_contact'}))
            this.setState({
                confirmLoading: false
            })
            return
        }

        if(flag){
            dispatch({
                type: 'FeedBack/postFeedBack',
                payload: {
                    contact: contact,
                    feed_type: sFeedbackType,
                    content: 'EdboxLobby意见',
                    scene:model_field.scene,
                    subscript:subscript,
                    screenshot:config.dentyID
                },
                callback:(data)=>{
                    this.setState({
                        confirmLoading: false,
                        contact: '',
                        sFeedbackType: '',
                        model_field:{
                            scene: []
                        },
                        config:{
                            Value:[],
                            ImageType: ["png","jpeg","jpg"],
                            dentyID:[]
                        },
                        subscript: '',
                        currentIndex: 1,
                        isDestory: true,
                        number: 0,
                        numberContact: 0,
                    })
                    // this.props.close()
                    Message.info(formatMessage({id:'feedback_success_send'}))
                    dispatch({
                        type: 'FeedBack/getFeedBacks',
                        payload: {
                            page: 1
                        },
                        callback:(data)=>{
                            _this.setState({
                                mineList:[...data.items],
                                mineCount: data.count,
                                pageFeed: 1
                            })
                        }
                    })
                }
            })
        }else{
            this.setState({
                confirmLoading: false,
            })
        }
    }

    componentWillUnmount(){
        clearTimeout(this.timerScroll)
    }

    updateUnReplay = () =>{
        const { dispatch } = this.props
        dispatch({
            type:'lobby/getUnReplyFeedBacks',
            payload:{},
            callback:(data)=>{
                // console.log(data)
                if(data){
                    this.setState({
                        badge: false
                    })
                }else{
                    this.setState({
                        badge: true
                    })
                }
            }
        })
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.visible !== this.props.visible){
            this.updateUnReplay()
            this.setState({
                isDestory: false
            })
        }
    }

    render() {
        const { currentIndex, mineList, detailVisible, config, configContinue:{Value}, loadingList, DetailFeedBacks, template, number, subscript, contact, confirmLoading, detail_type, detail_scene, sendLoading, replyContent, confirmVisible, confirmDetailVisible, numberContact, isDestory } = this.state
        const { feedback_type=[], scene=[], scenetype } = template
        const title = <div className={feed['title-tab']}>
            <span onClick={()=>this.handleTab(0)} className={`${currentIndex === 0 ? feed['active']:''}`}>{formatMessage({id:'feedback'})}</span>
            <span onClick={()=>this.handleTab(1)} className={`${currentIndex === 1 ? feed['active']:''}`}><Badge dot={this.state.badge}>{formatMessage({id:'mine'})}</Badge></span>
        </div>
        const uploadBtn = (
            <span className={feed['btn']}><Icon type="plus-circle" /></span>
        )
        return (
            <Modal
            centered={true}
            className={feed['feedback']}
            width={870}
            title={title}
            visible={this.props.visible}
            footer={null}
            onCancel={this.close}
            maskClosable={false}
            destroyOnClose={true}
            >
                <div className={`${feed['form']} ${currentIndex === 0 ? '' : feed['hide']}`}>
                    <div className={`${feed['group']} clearfix`}>
                        <div className={`${feed['label']} ${feed['require']}`}><i></i>{formatMessage({id:'feedback_type'})}:</div>
                        {
                            !isDestory ?
                            <div className={feed['option']}>
                                <Radio.Group buttonStyle="solid">
                                {feedback_type.map((item,i)=>(
                                    <Radio.Button key={i} value={item} onClick={this.handleRadioType}>{item}</Radio.Button>
                                ))}
                                </Radio.Group>
                            </div>
                            :
                            null
                        }
                        
                    </div>
                    {
                        !isDestory ?
                        (
                            scenetype === 2 ?
                            <div className={`${feed['group']} clearfix`}>
                                <div className={`${feed['label']} ${feed['require']}`}><i></i>{formatMessage({id:'feedback_scene'})}:</div>
                                <div className={feed['option']}>
                                    {scene.map((son,j)=>(
                                        <CustomTag key={j} checked={false} onChange={(value,children)=>this.handleClick(value,children,'scene')}>{son}</CustomTag>
                                    ))}
                                </div>
                            </div>
                            :
                            <div className={`${feed['group']} clearfix`}>
                                <div className={`${feed['label']} ${feed['require']}`}><i></i>{formatMessage({id:'feedback_scene'})}:</div>
                                <div className={feed['option']}>
                                    <Radio.Group buttonStyle="solid">
                                    {scene.map((son,j)=>(
                                        <Radio.Button key={j} value={son} onClick={(e)=>this.handleRadio(e)}>{son}</Radio.Button>
                                    ))}
                                    </Radio.Group>
                                </div>
                            </div>
                        )
                        :
                        null
                    }

                    
                    <div className={`${feed['group']} clearfix`}>
                        <div className={`${feed['label']}`}><i></i>{formatMessage({id:'feedback_subscript'})}:</div>
                        <div className={feed['option']}>
                            <TextArea 
                            value={subscript}
                            onChange={(e)=>this.handleSubscript(e)}
                            rows={4} 
                            style={{resize:'none'}}
                            placeholder={formatMessage({id:'feedback_placeholder_subscript'})} />
                            <p className={feed.limit}>{number}/500</p>
                        </div>
                    </div>
                    <div className={`${feed['group']} clearfix`}>
                        <div className={`${feed['label']}`}><i></i>{formatMessage({id:'feedback_screenshot'})}:</div>
                        <div className={feed['option']}>
                            <UploadImages 
                                config={config}
                                onUpdate={this.handleUploadForm}
                            />
                        </div>
                    </div>
                    <div className={`${feed['group']} clearfix`}>
                        <div className={`${feed['label']}`}><i></i>{formatMessage({id:'feedback_contact'})}:</div>
                        <div className={feed['option']}>
                            <Input 
                            // size="small"
                            value={contact}
                            onChange={(e)=>this.handleContactChange(e)}
                            // onBlur={this.handleContact}
                            placeholder={formatMessage({id:'feedback_placeholder_contact'})}
                            />
                            <p className={feed.limit}>{numberContact}/64</p>
                        </div>
                    </div>
                    <div className={`${feed['group']} ${feed['btn']} clearfix`}>
                        <Button onClick={this.close} >{formatMessage({id:'cancel'})}</Button>
                        <Button loading={confirmLoading} onClick={this.submit} type="primary">{formatMessage({id:'submit'})}</Button>
                    </div>
                </div>
                <Modal
                centered={true}
                visible={confirmVisible}
                title={formatMessage({id:'layout_close'})}
                onOk={this.realClose}
                onCancel={this.handleConfirmStatus}
                maskClosable={false}
                closable={false}
                cancelText={formatMessage({id:'feedback_continue'})}
                okText={formatMessage({id:'feedback_confirm'})}
                >
                    <p>{formatMessage({id:'feedback_cancel_tips'})}</p>
                </Modal>
                <div className={`${feed['mine']} ${currentIndex === 1 ? '' : feed['hide']}`}
                 ref={node=>{this.container=node}}
                >
                    <InfiniteScroll
                      initialLoad={false}
                      pageStart={1}
                      loadMore={this.handleInfiniteOnLoad}
                      hasMore={!this.state.loading && this.state.hasMore}
                      useWindow={false}
                      threshold={50}
                      getScrollParent={()=>this.container}
                    >
                    {
                        mineList.length > 0 ?
                        mineList.map((item,i)=>(
                        <List 
                        key={item.id}
                        data={item}
                        onDetail={this.handleDetail}
                        />
                        ))
                        :
                        <div className={'empty-list'}>
                          <div className={'empty-icon'}></div>
                          <p style={{textAlign:'center'}}>{formatMessage({id:'feedback_empty_tips'})}</p>
                        </div>
                    }
                    {this.state.loading && this.state.hasMore && (
                      <div style={{textAlign:'center',paddingBottom:'60px'}}>
                        <Spin />
                      </div>
                    )}
                    </InfiniteScroll>

                </div>
                <Modal
                className={feed['detail']}
                title={formatMessage({id:'details'})}
                visible={detailVisible}
                width={870}
                footer={null}
                destroyOnClose={true}
                onCancel={this.closeDetail}
                maskClosable={false}
                >
                    <div className={`${feed['reply-layer']}`}
                    ref={node=>{this.containerReply=node}}
                    >
                    <InfiniteScroll
                      initialLoad={false}
                      pageStart={1}
                      loadMore={this.handleInfiniteOnLoadReply}
                      hasMore={!this.state.loadingReply && this.state.hasMoreReply}
                      useWindow={false}
                      threshold={50}
                      getScrollParent={()=>this.containerReply}
                    >
                    { DetailFeedBacks.map((item,i)=>(
                        <div 
                        key={item.id}>
                            <div className={feed['me']}>
                                {
                                    item.type === 0 ?
                                    <Avatar src={this.props.lobby.userInfo.avatarUrl} />
                                    :
                                    <Avatar src={kefu} />
                                }
                                {
                                    item.type === 0 ?
                                    <span className={feed['name']}>{this.props.lobby.userInfo.name}</span>
                                    :
                                    <span className={feed['name']}>{formatMessage({id:'feedback_customer_system'})}</span>
                                }
                            </div>
                            <ListDetail
                            className={feed['card-detail']}
                            type={detail_type}
                            scene={detail_scene}
                            data={item}
                            />
                        </div>
                    ))}
                    </InfiniteScroll>
                    </div>
                    <Modal
                    centered={true}
                    visible={confirmDetailVisible}
                    title={formatMessage({id:'layout_close'})}
                    onOk={this.realCloseDetail}
                    onCancel={this.handleConfirmStatus}
                    maskClosable={false}
                    closable={false}
                    cancelText={formatMessage({id:'feedback_continue'})}
                    okText={formatMessage({id:'feedback_confirm'})}
                    >
                        <p>{formatMessage({id:'feedback_cancel_tips'})}</p>
                    </Modal>
                    <div className={`${feed['reply']} clearfix`}>
                        <div className={feed['upload-layer']}>
                            <Upload
                                showUploadList={false}
                                beforeUpload={this.handleBeforeUpload}
                                multiple={false}
                                // disabled={loadingList.length > 0}
                                accept={'.jpg,.png,.jpeg'}
                            >
                                {Value.length >= 5 ? null : uploadBtn}
                            </Upload>
                            <ul className={`${feed['img-list']} clearfix`}>
                                {Value && Value.length
                                ? Value.map((url, i) => (
                                    <li
                                        key={i}
                                        style={{ backgroundImage: `url(${url ? url : defaultBg})` }}
                                        className={!url ? feed['img-err'] : ''}
                                    >
                                        <div className={feed['actions']}>
                                        <Icon type="close" onClick={this.handleRemove} />
                                        </div>
                                    </li>
                                    ))
                                : null}
                                {loadingList && loadingList.length
                                ? loadingList.map((item, i) => (
                                    <li key={i}>
                                        <Icon type="loading" className={feed['loading']} />
                                    </li>
                                    ))
                                : null}
                            </ul>
                        </div>
                        <div className={feed['send-area']}>
                            <Input value={replyContent} onPressEnter={this.handleSendReply} onChange={this.handleReplyChange}/>
                            <Button 
                            loading={sendLoading}
                            onClick={this.handleSendReply} 
                            className={feed['send']} 
                            type="primary">{formatMessage({id:'submit'})}</Button>
                        </div>
                    </div>
                </Modal>
            </Modal>
        );
    }
}

export default FeedBack;