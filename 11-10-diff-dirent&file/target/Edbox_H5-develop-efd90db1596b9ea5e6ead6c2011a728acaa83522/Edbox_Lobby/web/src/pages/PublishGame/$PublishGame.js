import React, { Component } from 'react';
import { Form, Input, message, Button, Statistic, Anchor, Popover, Icon, Radio, Modal, DatePicker } from 'antd';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import moment from 'moment';
import { connect } from 'dva'
import { formatMessage, getLocale } from 'umi/locale'
import styles from './PublishGame.scss';
import CustomTag from './components/CustomTag/CustomTag';
import UploadImages from './components/UploadImages/UploadImages';
import SinglePic from './components/SinglePic';
import PreVIew from './PreView/PreVIew';

const { Link } = Anchor;
const { Countdown } = Statistic;
const { TextArea } = Input;
const handleClick = (e, link) => {
    e.preventDefault();
};

@connect(({ lobby, PublishGame,}) => ({
    lobby: lobby,
    PublishGame: PublishGame,
}))
class PublishForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            anchorDom: '',
            visiblePicSingle: false,
            visiblePreview: false,
            introduction:{
                number: 0,
            },
            name:{
                number:0
            },
            modalGame:{
                visible: false,
                confirmLoading: false,
            },
            modalEdu:{
                visible: false,
                confirmLoading: false,
            },
            modalOther:{
                visible: false,
                confirmLoading: false,
            },
            modalGameForm:{
                number: 0,
                value: '',
                buttonClose: true
            },
            modalEduForm:{
                number: 0,
                value: '',
                buttonClose: true
            },
            modalOtherForm:{
                number: 0,
                value: '',
                buttonClose: true
            },
            tags_game:[],
            tags_edu:[],
            tags_other:[],
            defaultVer: 0,
            defaultPlatform: 1,
            isTiming: false,
            update:{
                number: 0
            },
            publishGame: this.props.PublishGame.publishGame,
            isSensitive: false,
            nameError:{
                value: false,
                msg: ''
            },
            abstractError:{
                value: false,
                msg: ''
            },
            updateError:{
                value: false,
                msg: ''
            },
            remainVisible: false,
            remainTime: 0,
            closeVisible: false,
            delVisible: false,
            isPost: false
        }
        this.anchorDom = <Anchor bounds={300} onClick={handleClick} getContainer={() => this.props.lobby.el}>
        <Link href="#publishBasic" title={formatMessage({id:'publish_basic_info'})} />
        <Link href="#publishInfo" title={formatMessage({id:'publish_info'})} />
        <Link href="#publishPrice" title={formatMessage({id:'publish_price'})} />
        <Link href="#publishScreenshots" title={formatMessage({id:'publish_screenshots'})} />
        <Button className={styles.topBtn} onClick={this.handleClosePublish} type="primary">{formatMessage({id:'layout_close'})}</Button>
        </Anchor>
    }

    componentDidMount(){
        const { dispatch } = this.props
        dispatch({
            type: 'PublishGame/getPublishOrigin',
            payload: {
                id: this.props.match.params.PublishGame
            },
            callback: (data)=>{
                // console.log(data)
                dispatch({
                    type: 'PublishGame/setPublish',
                    payload:{
                        publishGame:{
                            ...data,
                            image_config: {
                                ID: [...data.image_config.ID.filter(id=>id !== '')],
                                ImageType: ["png","jpeg","jpg"],
                                Value:[]
                            }
                        }
                    }
                })
                this.init()
            }
        })
    }

    init = () =>{
        const { dispatch, PublishGame } = this.props
        const { publishGame} = PublishGame
        const { game_name, game_description, game_update, game_icon, image_config, ver, platform } = publishGame;
        const { name, introduction, update } = this.state
        dispatch({
            type: 'lobby/getImageUrl',
            payload: {
                resourceid: game_icon
            },
            callback:(data)=>{
                this.coverTimer = setTimeout(()=>{
                    dispatch({
                        type: 'PublishGame/setPublish',
                        payload:{
                            publishGame:{
                                ...publishGame,
                                game_icon_url: data
                            }
                        }
                    })
                },100)
            }
        })

        image_config.ID.forEach((item)=>{
            item !== '' && dispatch({
                type: 'lobby/getImageUrl',
                payload:{
                    resourceid: item
                },
                callback:(data)=>{
                    this.screenshotTimer = setTimeout(()=>{
                        dispatch({
                            type: 'PublishGame/setPublish',
                            payload:{
                                publishGame:{
                                    ...this.props.PublishGame.publishGame,
                                    image_config: {
                                        ...image_config,
                                        Value: this.props.PublishGame.publishGame.image_config.Value.concat(data)
                                    }
                                }
                            }
                        })
                    },100)
                }
            })
        })

        this.setState({
            anchorDom: this.anchorDom,
            defaultVer: ver,
            defaultPlatform: platform,
            name: {
                ...name,
                value: game_name,
                number: this.defaultLimit(game_name)
            },
            introduction: {
                ...introduction,
                value: game_description,
                number: this.defaultLimit(game_description)
            },
            update: {
                ...update,
                value: game_update,
                number: this.defaultLimit(game_update)
            },
            isTiming: false,
        })
        if(game_description === ''){
            this.setState({
                abstractError:{
                    value: true,
                    msg: formatMessage({id:'publish_abstract_empty'})
                }
            })
        }
        if(game_update === ''){
            this.setState({
                updateError:{
                    value: true,
                    msg: formatMessage({id:'publish_update_empty'})
                }
            })
        }
        dispatch({
            type: 'lobby/isNameDuplicate',
            payload:{
                id: this.props.match.params.PublishGame,
                releaseMode: 2,
                accessType: 3,
                appName: game_name
            },
            callback:(data)=>{
                if(data.is_duplicate === 0){
                    this.setState({
                        nameError:{
                            value: false,
                            msg: ''
                        }
                    })
                }else{
                    this.setState({
                        nameError:{
                            value: true,
                            msg: formatMessage({id:'game_duplicate'})
                        }
                    })
                }
            }
        })
        
        this.props.form.validateFields();
    }

    componentWillUnmount(){
        clearTimeout(this.screenshotTimer)
        clearTimeout(this.coverTimer)
    }

    handleSubmit = e =>{
        const { PublishGame, dispatch } = this.props
        const { publishGame } = PublishGame
        const { tags_game, tags_edu, tags_other } = publishGame
        const { immediately, game_update,image_config, game_icon } = publishGame

        const tags_game_filter = tags_game.filter(tag=>tag.checked === true);
        const tags_edu_filter = tags_edu.filter(tag=>tag.checked === true);
        const tags_other_filter = tags_other.filter(tag=>tag.checked === true);
        const tags_game_value = [];
        const tags_edu_value = [];
        const tags_other_value = [];

        tags_game_filter.forEach((item)=>{
            const obj = {}
            obj.id = item.id ? item.id : ''
            obj.value = item.value
            tags_game_value.push(obj)
        })
        tags_edu_filter.forEach((item)=>{
            const obj = {}
            obj.id = item.id ? item.id : ''
            obj.value = item.value
            tags_edu_value.push(obj)
        })
        tags_other_filter.forEach((item)=>{
            const obj = {}
            obj.id = item.id ? item.id : ''
            obj.value = item.value
            tags_other_value.push(obj)
        })

        e.preventDefault();
        this.props.form.validateFields((err,fieldsValue)=>{
            if(!err){
                const GTMTIME = fieldsValue['timing'] ? new Date(fieldsValue['timing'].format('YYYY/MM/DD HH:mm')) - 8*60*60*1000 : new Date()
                const GTMTIMESTR = new Date(GTMTIME)
                
                const datas ={
                    id: this.props.match.params.PublishGame,
                    game_icon: game_icon,
                    game_name: fieldsValue['name'],
                    introduction: fieldsValue['abstract'],
                    tags:{
                        tags_game:tags_game_value,
                        tags_edu:tags_edu_value,
                        tags_other:tags_other_value
                    },
                    ver: fieldsValue['ver'] + '',
                    // immediately: immediately !== 2 ? true : false,
                    immediately: !this.state.isTiming,
                    publish_date: fieldsValue['timing'] ? moment(GTMTIMESTR).format('YYYY/MM/DD HH:mm') : '',
                    game_update: game_update,
                    screenshot: image_config.ID
                }
                this.setState({
                    datas: datas,
                    isPost: true
                },()=>{
                    // console.log(datas,'==')
                    // console.log(immediately,'==')
                })
                

                dispatch({
                    type:'PublishGame/getPublishCountDown',
                    payload:{},
                    callback:(data)=>{
                        // console.log(data,'倒计时')
                        if(data.remain === 0){
                            dispatch({
                                type:'PublishGame/postGameInfo',
                                payload:{
                                    ...datas
                                },
                                callback:(data)=>{
                                    if(data.data && data.data.content && data.data.content.responseJSON){
                                        message.info(formatMessage({id:'lobby_product_check'}))
                                        this.setState({
                                            isPost: false
                                        })
                                    }

                                    if(data.app_id !== '' && data.app_id !== undefined){
                                        router.push('/SingleGameList/MyWorks?tab=1');
                                    }
                                }
                            })
                        }else{
                            this.setState({
                                remainVisible: true,
                                remainTime: Date.now() + 1000*data.remain,
                                isPost: false
                            })
                        }
                    }
                })

            }
        })

    }

    handleClosePublish = () =>{
        this.setState({
            closeVisible: true
        })
    }

    handleCancelCloseVisible = () =>{
        this.setState({
            closeVisible: false
        })
    }

    handleOkCloseVisible = () =>{
        // this.setState({
        //     closeVisible: true
        // })
        router.push('/SingleGameList/MyWorks');
    }

    onFinishRemain = () =>{
        const { dispatch } = this.props
        const { datas } = this.state
        this.setState({
            remainVisible: false,
            remainTime: 0,
            isPost: true
        })
        dispatch({
            type:'PublishGame/getPublishCountDown',
            payload:{},
            callback:(data)=>{
                if(data.remain === 0){
                    dispatch({
                        type:'PublishGame/postGameInfo',
                        payload:{
                            ...datas
                        },
                        callback(data){
                            if(data.data && data.data.content && data.data.content.responseJSON){
                                message.info(formatMessage({id:'lobby_product_check'}))
                                this.setState({
                                    isPost: false
                                })
                            }

                            if(data.app_id !== '' && data.app_id !== undefined){
                                router.push('/SingleGameList/MyWorks?tab=1');
                            }
                        }
                    })
                }else{
                    this.setState({
                        remainVisible: true,
                        remainTime: Date.now() + 1000*data.remain,
                        isPost: false
                    })
                }
            }
        })
    }

    handleOkRemainVisible =()=>{
        this.setState({
            remainVisible: false
        })
    }

    defaultLimit = (value) =>{
        if (value == null) return 0;
        if (typeof value != "string"){
            value += "";
        }
        return value.replace(/[^\x00-\xff]/g,"01").length;
    }

    validateLimit = (value,num) =>{
        const reg = /[\u0060|\u0021|\u0040|\u0023|\u0024|\u0025|\u005e|\u0026|\u005f|\u002b|\u003d|\u005b|\u005d|\u007b|\u007d|\'|\u002c|\u002e|\u003f|\u007c|\uffe5|\uff01|\u2026\u2026|\u2014|\u2018|\u2019|\uff0c|\u3002|\u3001|\uff1f]/g;
        let max = num
        let len = 0;
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
        if(value.length > i){
            value = value.substring(0,i)
        }
        if(value.length === 0 || value.trim().length === 0){
            return{
                number: len,
                value: value,
                validateStatus: 'error',
                errorMsg: formatMessage({id:'publish_placeholder_addtag'}),
                buttonClose: true
            };
        }
        
        if(reg.test(value) || value === "'"){
            // console.log(reg.test(value))
            const setArr = Array.from(new Set(value.match(reg)));
            let errHtml = '';
            // setArr.forEach((item)=>{
            //     errHtml = errHtml + '“' + item + '”'
            // })
            errHtml = '“' + setArr[0] + '”'
            return{
                number: len,
                value: value,
                validateStatus: 'error',
                errorMsg: formatMessage({id:'publish_addtag_error'}) + errHtml,
                buttonClose: true
            };
        }
        return{
            number: len,
            value: value,
            validateStatus: 'success',
            errorMsg: null,
            buttonClose: false
        };
    }

    handleReg = (value) =>{ //正则匹配特色字符
        const { dispatch } = this.props
        // const { publishGame={} } = PublishGame
        // const { isNew } = publishGame
        const reg = /[\u3001|\u2572|\u002a|\u201c|\u201d|\<|\>|\u007c]/g;
        if(value === ''){
            
        }else{
            if(reg.test(value)){
                const setArr = Array.from(new Set(value.match(reg)));
                let errHtml = '';
                // setArr.forEach((item)=>{
                //     errHtml = errHtml + '“' + item + '”'
                // })
                errHtml = '“' + setArr[0] + '”'
                this.setState({
                    nameError:{
                        value: true,
                        msg: formatMessage({id:'publish_addtag_error'}) + errHtml
                    }
                })
            }else{
                dispatch({
                type: 'lobby/isSensitive',
                payload:{
                    word: value
                },
                callback:(data)=>{
                    if(data.is_sensitive){
                        this.setState({
                            nameError:{
                                value: true,
                                msg: formatMessage({id:'game_sensitive'})
                            }
                        })
                    }else if(value !== ''){
                        dispatch({
                            type: 'lobby/isNameDuplicate',
                            payload:{
                                id: this.props.match.params.PublishGame,
                                releaseMode: 2,
                                accessType: 3,
                                appName: value
                            },
                            callback:(data)=>{
                                if(data.is_duplicate === 0){
                                    this.setState({
                                        nameError:{
                                            value: false,
                                            msg: ''
                                        }
                                    })
                                }else{
                                    this.setState({
                                        nameError:{
                                            value: true,
                                            msg: formatMessage({id:'game_duplicate'})
                                        }
                                    })
                                }
                            }
                        })

                    }
                }
                })

            }
        }
    }

    handleNameBlur = e =>{
        const value = e.target.value
        this.setState({
            name:{
               ...this.validateLimit(e.target.value,60),
            }
        })
        if(value !== '' && value.trim().length > 0){
            this.handleReg(value)
        }else{
            this.setState({
                nameError:{
                    value: true,
                    msg: formatMessage({id:'publish_name_empty'})
                }
            })
        }
    }
    handleAbstractBlur = e =>{
        const { dispatch, PublishGame } = this.props;
        const { publishGame = {}} = PublishGame
        const value = e.target.value
        // console.log(value)
        if(value !== '' && value.trim().length > 0){
            
            dispatch({
                type: 'lobby/isSensitive',
                payload:{
                    word: value
                },
                callback:(data)=>{
                    if(data.is_sensitive){
                        this.setState({
                            abstractError:{
                                value: true,
                                msg: formatMessage({id:'abstract_sensitive'})
                            }
                        })
                    }else{
                        dispatch({
                            type: 'PublishGame/setPublish',
                            payload:{
                                publishGame:{
                                    ...publishGame,
                                    game_description: this.validateLimit(value,1000).value
                                }
                            }
                        })
                    }
                }
            })
        }else{
            this.setState({
                abstractError:{
                    value: true,
                    msg: formatMessage({id:'publish_abstract_empty'})
                }
            })
        }
    }
    handleUpdateBlur = e =>{
        const { dispatch, PublishGame } = this.props;
        const { publishGame = {}} = PublishGame
        const value = e.target.value
        // console.log(value)
        if(value !== '' && value.trim().length > 0){
            dispatch({
                type: 'lobby/isSensitive',
                payload:{
                    word: value
                },
                callback:(data)=>{
                    if(data.is_sensitive){
                        this.setState({
                            updateError:{
                                value: true,
                                msg: formatMessage({id:'update_sensitive'})
                            }
                        })
                    }else{
                        dispatch({
                            type: 'PublishGame/setPublish',
                            payload:{
                                publishGame:{
                                    ...publishGame,
                                    game_update: this.validateLimit(value,1000).value
                                }
                            }
                        })
                    }
                }
            })
        }else{
            this.setState({
                updateError:{
                    value: true,
                    msg: formatMessage({id:'publish_update_empty'})
                }
            })
        }
    }
    handleAbstractChange = e =>{ //设置字符长度
        const value = e.target.value
        this.setState({
            introduction:{
               ...this.validateLimit(value,1000),
            }
        })

        if(value !== ''){
            this.setState({
                abstractError:{
                    value: false,
                    msg: ''
                }
            })
        }else{
            this.setState({
                abstractError:{
                    value: true,
                    msg: formatMessage({id:'publish_abstract_empty'})
                }
            })
        }
    }

    handleNameChange = e =>{ //设置字符长度
        const { dispatch, PublishGame } = this.props;
        const { publishGame = {}} = PublishGame
        const value = e.target.value
        this.setState({
            name:{
               ...this.validateLimit(e.target.value,60),
            }
        })

        if(value === ''){
            this.setState({
                nameError:{
                    value: true,
                    msg: formatMessage({id:'publish_name_empty'})
                }
            })
        }

        dispatch({
            type: 'PublishGame/setPublish',
            payload:{
                publishGame:{
                    ...publishGame,
                    game_name: this.validateLimit(e.target.value,60).value
                }
            }
        })
    }

    handleLimit = (rule, value, callback) =>{ //校验字符长度
        const max = rule.field === 'name' ? 60 : 1000
        let len = 0;
        if(value){
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
            if(value.length > i){
                value = value.substring(0,i)
            }
        }


        this.props.form.setFieldsValue({
            [rule.field]: value
        })

        if(len === 0){

            // callback(msg)
        }
        callback()
    }

    handleTagSelect = (checked,id,arr) =>{
        const { dispatch, PublishGame } = this.props;
        const {publishGame={}} = PublishGame

        const target_tag = publishGame[arr].filter(tag=>tag.id === id)
        target_tag[0].checked = checked;
        const select_tag = publishGame[arr].map(item=>item.id === id ? item=target_tag[0] : item)
        dispatch({
            type: 'PublishGame/setPublish',
            payload:{
                publishGame:{
                    ...publishGame,
                    [arr]: select_tag
                }
            }
        })
    }

    showModalTag = (targetState) =>{
        const visible = { visible: true }
        this.setState({
            [targetState]:{
                ...visible,
                confirmLoading: false
            }
        })
    }
    handleCancelAdd = (targetState) =>{
        const visible = { visible: false }
        this.setState({
            [targetState]:{
                ...visible,
                confirmLoading: false
            },
            modalGameForm:{
                number: 0,
                value: '',
                buttonClose: true
            }
        })
    }

    handleTagFormChange = (targetState,e) =>{
        this.setState({
            [targetState]:{
               ...this.validateLimit(e.target.value,20),
            }
        })
    }

    handleTagFormBlur = (targetState,e) =>{
        const { dispatch } = this.props;
        const { number } = this.state[targetState];
        const value = e.target.value;
        if(value !== ''){
            dispatch({
                type: 'lobby/isSensitive',
                payload:{
                    word: value
                },
                callback:(data)=>{
                    if(data.is_sensitive){
                        this.setState({
                            [targetState]:{
                                number: number,
                                value: value,
                                validateStatus: 'error',
                                errorMsg: formatMessage({id:'lobby_has_sensitive'}),
                                buttonClose: true
                            }
                        })
                    }
                    
                }
            })
        }
    }

    handleOkAddGame = (arr,form,modal) =>{
        const { dispatch, PublishGame } = this.props;
        const { publishGame={}} = PublishGame;
        // let game_arr = this.state[arr]
        let game_form = this.state[form]
        let game_arr = publishGame[arr]
        const isRepeat = game_arr.filter(tag=>tag.value === game_form.value)
        if(isRepeat.length > 0){
            this.setState({
                [form]:{
                    ...game_form,
                    validateStatus: 'error',
                    errorMsg: formatMessage({id:'publish_tags_repeat_tips'}),
                    buttonClose: true
                }
            })
            return;
        }
        if(game_form.validateStatus !== 'error'){
            dispatch({
                type: 'lobby/isSensitive',
                payload:{
                    word: game_form.value
                },
                callback:(data)=>{
                    console.log(data)
                    if(data.is_sensitive){
                        this.setState({
                            [form]:{
                                number: game_form.number,
                                value: game_form.value,
                                validateStatus: 'error',
                                errorMsg: formatMessage({id:'lobby_has_sensitive'}),
                                buttonClose: true
                            }
                        })
                    }else{
                        this.setState({
                            [modal]:{
                                visible: true,
                                confirmLoading: true,
                            }
                        })
                        //新增标签 (模拟ajax)
                        const temTag = {
                            id: game_form.value,
                            value: game_form.value,
                            checked: true,
                            undo:false,
                            candel:true
                        }
                        if(temTag && game_arr.indexOf(temTag) === -1){
                            game_arr = [...game_arr,temTag]
                            dispatch({
                                type:'PublishGame/addTag',
                                payload:{
                                    value: temTag.value
                                },
                                callback:(data)=>{
                                    // console.log(data,213123)
                                    if(data === ''){
                                        this.setState({
                                            // [arr]:game_arr,
                                            [modal]:{
                                                visible: false,
                                                confirmLoading: false,
                                            },
                                            [form]:{
                                                number: 0,
                                                value: '',
                                                buttonClose: true
                                            }
                                        })
                        
                                        dispatch({
                                            type: 'PublishGame/setPublish',
                                            payload:{
                                                publishGame:{
                                                    ...publishGame,
                                                    [arr]: game_arr
                                                }
                                            }
                                        })
                                    }else{
                                        this.setState({
                                            // [arr]:game_arr,
                                            [modal]:{
                                                visible: true,
                                                confirmLoading: false,
                                            },
                                            [form]:{
                                                number: this.state[form].number,
                                                value: temTag.value,
                                                validateStatus: 'error',
                                                errorMsg: data.data.content,
                                                buttonClose: true
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                    
                }
            })
            
        }
    }

    handleTagDelete = (id,arr) =>{
        let arr_name = '';
        if(arr === 'tags_game'){
            arr_name = formatMessage({id:'publish_game_tags01'})
        }else if(arr === 'tags_edu'){
            arr_name = formatMessage({id:'publish_edu_tags01'})
        }else if(arr === 'tags_other'){
            arr_name = formatMessage({id:'publish_other_tags01'})
        }
        this.setState({
            delVisible: true,
            nowTagsGroup: arr_name,
            nowTagsArr: arr,
            nowTags: id
        })
    }

    handleOkDelVisible = () =>{
        const { dispatch, PublishGame } = this.props;
        const { publishGame={}} = PublishGame
        const { nowTagsArr, nowTags } = this.state
        const newTags = publishGame[nowTagsArr].filter(tag=>tag.id !== nowTags)
        // console.log(nowTags,2)
        dispatch({
            type:'PublishGame/deleteTag',
            payload:{
                value: nowTags
            },
            callback:(data)=>{
                if(data === ''){
                    dispatch({
                        type: 'PublishGame/setPublish',
                        payload:{
                            publishGame:{
                                ...publishGame,
                                [nowTagsArr]: newTags
                            }
                        }
                    })
                    this.setState({
                        delVisible: false
                    })
                }else{
                    message.info(data)
                }
                
                
            }
        })
    }

    handleCancelDelVisible = () =>{
        this.setState({
            delVisible: false
        })
    }


    //发布信息
    handleVer = (rule,value,callback) =>{
        const { dispatch, PublishGame } = this.props;
        const { publishGame = {}} = PublishGame
        if(value){
            if(value < this.state.defaultVer){
                dispatch({
                    type:'PublishGame/checkVersion',
                    payload:{
                        value:this.state.defaultVer
                    },
                    callback:(data)=>{
                        // console.log(data,11111)
                        this.props.form.setFieldsValue({
                            ver: data
                        })
                        dispatch({
                            type: 'PublishGame/setPublish',
                            payload:{
                                publishGame:{
                                    ...publishGame,
                                    ver: data
                                }
                            }
                        })
                    }
                })

                // this.props.form.setFieldsValue({
                //     ver: this.state.defaultVer
                // })
                // dispatch({
                //     type: 'PublishGame/setPublish',
                //     payload:{
                //         publishGame:{
                //             ...publishGame,
                //             ver: this.state.defaultVer
                //         }
                //     }
                // })
            }else{
                dispatch({
                    type:'PublishGame/checkVersion',
                    payload:{
                        value:this.accuracy(value)
                    },
                    callback:(data)=>{
                        // console.log(data,22222)
                        this.props.form.setFieldsValue({
                            ver: data
                        })
                        dispatch({
                            type: 'PublishGame/setPublish',
                            payload:{
                                publishGame:{
                                    ...publishGame,
                                    ver: data
                                }
                            }
                        })
                    }
                })
                // this.props.form.setFieldsValue({
                //     ver: this.accuracy(value)
                // })
                // dispatch({
                //     type: 'PublishGame/setPublish',
                //     payload:{
                //         publishGame:{
                //             ...publishGame,
                //             ver: this.accuracy(value)
                //         }
                //     }
                // })
            }
        }else{
            dispatch({
                type:'PublishGame/checkVersion',
                payload:{
                    value:this.state.defaultVer
                },
                callback:(data)=>{
                    this.props.form.setFieldsValue({
                        ver: data
                    })
                    dispatch({
                        type: 'PublishGame/setPublish',
                        payload:{
                            publishGame:{
                                ...publishGame,
                                ver: data
                            }
                        }
                    })
                }
            })
        }

        callback()
    }

    accuracy = (value) =>{
        const value_1 = Math.round(value * 100) /100;
        const value_2 = value_1.toString().split('.');
        if(isNaN(value_1)){
            return this.state.defaultVer
        }else if(parseInt(value_1) >= 1000){
            return (value_1 % 1000) + '.00'
        }else{
            if(value_2.length === 1){
                return value_1.toString() + ".00";
            }else if(value_2.length > 1){
                if(value_2[1].length < 2){
                    return value_1.toString() + '0';
                }else{
                    return value_1
                }
            }else{
                return value_1
            }
        }
        
    }

    handleTiming = e =>{
        const { dispatch, PublishGame } = this.props;
        const { publishGame = {}} = PublishGame
        const isTiming = e.target.value === 2 ? true : false
        this.setState({ isTiming },()=>{
            this.props.form.validateFields(['timing'], { force: true });
        })
        dispatch({
            type: 'PublishGame/setPublish',
            payload:{
                publishGame:{
                    ...publishGame,
                    immediately: isTiming ? 2 : 1
                }
            }
        })
    }

    disabledDate = (current) =>{
        return current && current < moment(moment().startOf('minute') + 3*24*60*60*1000);
    }

    handleUpdateChange = e =>{
        const { dispatch, PublishGame } = this.props;
        const { publishGame = {}} = PublishGame
        const value = e.target.value
        this.setState({
            update:{
               ...this.validateLimit(e.target.value,1000),
            }
        })
        if(value !== ''){
            this.setState({
                updateError:{
                    value: false,
                    msg: ''
                }
            })
        }else{
            this.setState({
                updateError:{
                    value: true,
                    msg: formatMessage({id:'publish_abstract_empty'})
                }
            })
        }
        dispatch({
            type: 'PublishGame/setPublish',
            payload:{
                publishGame:{
                    ...publishGame,
                    game_update: this.validateLimit(e.target.value,1000).value
                }
            }
        })
    }

    handleUpload = config =>{
        const { dispatch, PublishGame } = this.props;
        const { publishGame = {}} = PublishGame
        const { ID, ImageType, Value } = config
        dispatch({
            type: 'PublishGame/setPublish',
            payload:{
                publishGame:{
                    ...publishGame,
                    image_config: {
                        ID: ID.filter(x=>x !== ''),
                        ImageType: ImageType,
                        Value: Value.filter(x=>x !== ''),
                    }
                }
            }
        })
    }

    hasErrors = fieldsError =>{
        const { publishGame = {} } = this.props.PublishGame;
        const { image_config = {}, game_icon } = publishGame
        const { nameError, abstractError, updateError } = this.state
        return !Object.keys(fieldsError).some(field => fieldsError[field]) && (image_config.Value.length > 0 ? true : false) && !nameError.value && !abstractError.value && !updateError.value && game_icon !== '';
    }
    preView = () =>{
        // router.push('/PublishGame/PreView/PreVIew')
        this.setState({
            visiblePreview: true
        })
    }
    handlePreviewBack = () =>{
        this.setState({
            visiblePreview: false
        })
    }

    updateGameIconUrl = avatarUrl => {
        const { dispatch, PublishGame } = this.props;
        const { publishGame = {}} = PublishGame
        const { Value, GUID } = avatarUrl
        dispatch({
            type: 'PublishGame/setPublish',
            payload:{
                publishGame:{
                    ...publishGame,
                    game_icon: GUID,
                    game_icon_url: Value
                }
            }
        })
    };

    render() {
        const { introduction, name, update, modalGame, modalEdu, modalOther, modalGameForm, modalEduForm, modalOtherForm, visiblePreview, defaultPlatform, nameError, abstractError, updateError, remainVisible, remainTime, closeVisible, delVisible, nowTagsGroup, nowTags } = this.state
        const { publishGame = {} } = this.props.PublishGame
        const { image_config = {}, ver, game_name , game_description, game_update,game_icon_url } = publishGame
        const {tags_game, tags_edu, tags_other} = publishGame;
        const { getFieldDecorator, getFieldsError } = this.props.form;

        const countTags = tags_game.filter(j=>j.candel === true).length + tags_edu.filter(j=>j.candel === true).length + tags_other.filter(j=>j.candel === true).length

        const formTextAreaLayout = {
            wrapperCol: { span: 10 },
        };
        const nowDate = new Date();
        return (
            <div className={styles.PublishGame}>
                {
                !visiblePreview ?
                <div>
                <div className={styles.publishAnchor}>
                {this.state.anchorDom}
                </div>
                <Form onSubmit={this.handleSubmit} layout='vertical'>
                <div className={styles.main} ref={node=>{this.container=node}}>
                    {/* 基础信息 */}
                    <div className={styles.item}>
                        <h2 className={styles.h2} id="publishBasic">
                            {formatMessage({id:'publish_basic_info'})}
                            <Popover
                            placement="bottomLeft"
                            overlayClassName="tipsPop"
                            autoAdjustOverflow={false}
                            getPopupContainer={()=>this.container}
                            content={formatMessage({id:'publish_base_tit_tips'})}>
                            <span className={styles.tipsQue}>？</span>
                            </Popover>
                        </h2>

                        <p className={`${styles.label} ${styles.require}`}>{formatMessage({id:'publish_icon'})}</p>

                        <SinglePic
                            initImgUrl={game_icon_url}
                            onChange={this.updateGameIconUrl}
                        />
                        <p className={`${styles.label} ${styles.require}`}>{formatMessage({id:'publish_name'})}</p>
                        <div className={`${styles.floor}`}>
                            <Form.Item
                            validateStatus={nameError.value ? 'error' : ''}
                            help={nameError.value ? nameError.msg :''}
                            wrapperCol={{span:8}}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id:'publish_name_empty'}),
                                    },{
                                        // validator: this.handleReg
                                    }
                                ],
                                initialValue: game_name,
                                getValueFromEvent: function(e){
                                    let len = 0
                                    for(var i=0;i<e.target.value.length;i++){
                                        const single = e.target.value.charCodeAt(i);
                                        if ((single >= 0x0001 && single <= 0x007e) || (0xff60<=single && single<=0xff9f)) {
                                            len++;
                                            if(len > 60){
                                                len--;
                                                break;
                                            }
                                        }
                                        else {
                                            len+=2;
                                            if(len > 60){
                                                len-=2;
                                                break;
                                            }
                                        }
                                    }
                                    return e.target.value.substring(0,i)
                                }
                            })(<Input
                            placeholder={formatMessage({id:'publish_placeholder_name'})}
                            allowClear
                            onBlur={(e)=>this.handleNameBlur(e)}
                            onChange={(e)=>this.handleNameChange(e)} /> )}
                            <span className={styles.limit02}>{name.number}/60</span>
                            </Form.Item>
                        </div>

                        <p className={`${styles.label} ${styles.require}`}>{formatMessage({id:'publish_abstract'})}</p>
                        <div className={styles.floor}>
                            <Form.Item
                            validateStatus={abstractError.value ? 'error' : ''}
                            help={abstractError.value ? abstractError.msg :''}
                            {...formTextAreaLayout}
                            >
                            {getFieldDecorator('abstract', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id:'publish_abstract_empty'}),
                                    }
                                ],
                                initialValue: game_description,
                                getValueFromEvent: function(e){
                                    let len = 0
                                    for(var i=0;i<e.target.value.length;i++){
                                        const single = e.target.value.charCodeAt(i);
                                        if ((single >= 0x0001 && single <= 0x007e) || (0xff60<=single && single<=0xff9f)) {
                                            len++;
                                            if(len > 1000){
                                                len--;
                                                break;
                                            }
                                        }
                                        else {
                                            len+=2;
                                            if(len > 1000){
                                                len-=2;
                                                break;
                                            }
                                        }
                                    }
                                    return e.target.value.substring(0,i)
                                }
                            })(<TextArea
                                rows={4}
                                autosize={false}
                                onBlur={(e)=>this.handleAbstractBlur(e)}
                                onChange={(e)=>this.handleAbstractChange(e)}
                                placeholder={formatMessage({id:'publish_placeholder_abstract'})} />)}
                                <p className={styles.limit}>{introduction.number}/1000</p>
                            </Form.Item>
                        </div>
                        {/* 游戏标签 */}
                        <p className={styles.label}>
                            {formatMessage({id:'publish_game_tags'})}
                            <Popover
                            placement="bottomLeft"
                            overlayClassName="tipsPop"
                            autoAdjustOverflow={false}
                            getPopupContainer={()=>this.container}
                            content={formatMessage({id:'publish_game_tips'})}>
                            <span className={styles.tipsQue}>？</span>
                            </Popover>
                        </p>
                        <div className={`${styles.floor} ${styles.colTag}`}>
                            {tags_game.map((tag,index)=>{
                                // const isLongTag = tag.value.length > 10;
                                const tagElem = (
                                    <div className={styles.tagbox} key={index} >
                                    <CustomTag id={tag.id} checked={tag.checked} onChange={(checked,id)=>this.handleTagSelect(checked,id,'tags_game')} default={tag.undo}>
                                        {/* {isLongTag ? `${tag.value.slice(0, 10)}...` : tag.value} */}
                                        {tag.value}
                                    </CustomTag>
                                    {tag.candel ? <span onClick={()=>this.handleTagDelete(tag.id,'tags_game')} className={styles.del}><Icon type="minus-circle" /></span> : ''}
                                    </div>
                                );
                                // return isLongTag ? (
                                //     <Popover content={tag.value} key={tag.id}>
                                //         {tagElem}
                                //     </Popover>
                                // ):(tagElem);
                                return tagElem
                            })}
                            {
                                countTags < 20 ?
                                <span className={styles.addTag} onClick={()=>this.showModalTag('modalGame')}><Icon type="plus" /></span>
                                :null
                            }
                            <Modal
                                centered={true}
                                cancelText={formatMessage({id:'cancel'})}
                                okText={formatMessage({id:'feedback_confirm'})}
                                title={formatMessage({id:'publish_add_title'})}
                                visible={modalGame.visible}
                                onOk={()=>this.handleOkAddGame('tags_game','modalGameForm','modalGame')}
                                confirmLoading={modalGame.confirmLoading}
                                onCancel={()=>this.handleCancelAdd('modalGame')}
                                okButtonProps={{ disabled: modalGameForm.buttonClose }}
                            >
                                <Form.Item
                                validateStatus={modalGameForm.validateStatus}
                                help={modalGameForm.errorMsg}
                                wrapperCol={{span:20}}>
                                    <Input
                                    value={modalGameForm.value}
                                    onChange={(e)=>this.handleTagFormChange('modalGameForm',e)}
                                    placeholder={formatMessage({id:'publish_placeholder_addtag02'})} />
                                    <span style={{position:'absolute',bottom:'-12px',right:'-44px',fontSize:'14px',color:'#999',textAlign:'right'}}>{modalGameForm.number}/20</span>
                                </Form.Item>
                            </Modal>
                        </div>
                        {/* 教育标签 */}
                        <p className={styles.label}>
                            {formatMessage({id:'publish_edu_tags'})}
                            <Popover
                            placement="bottomLeft"
                            overlayClassName="tipsPop"
                            autoAdjustOverflow={false}
                            getPopupContainer={()=>this.container}
                            content={formatMessage({id:'publish_edu_tips'})}>
                            <span className={styles.tipsQue}>？</span>
                            </Popover>
                        </p>
                        <div className={`${styles.floor} ${styles.colTag}`}>
                            {tags_edu.map((tag,index)=>{
                                // const isLongTag = tag.value.length > 10;
                                const tagElem = (
                                    <div className={styles.tagbox}  key={index} >
                                    <CustomTag id={tag.id} checked={tag.checked} onChange={(checked,id)=>this.handleTagSelect(checked,id,'tags_edu')} default={tag.undo}>
                                        {/* {isLongTag ? `${tag.value.slice(0, 10)}...` : tag.value} */}
                                        {tag.value}
                                    </CustomTag>
                                    {tag.candel ? <span onClick={()=>this.handleTagDelete(tag.id,'tags_edu')} className={styles.del}><Icon type="minus-circle" /></span> : ''}
                                    </div>
                                );
                                // return isLongTag ? (
                                //     <Popover content={tag.value} key={tag.id}>
                                //         {tagElem}
                                //     </Popover>
                                // ):(tagElem);
                                return tagElem
                            })}
                            {
                                countTags < 20 ?
                                <span className={styles.addTag} onClick={()=>this.showModalTag('modalEdu')}><Icon type="plus" /></span>
                                :null
                            }
                            <Modal
                                centered={true}
                                cancelText={formatMessage({id:'cancel'})}
                                okText={formatMessage({id:'feedback_confirm'})}
                                title={formatMessage({id:'publish_add_title'})}
                                visible={modalEdu.visible}
                                onOk={()=>this.handleOkAddGame('tags_edu','modalEduForm','modalEdu')}
                                confirmLoading={modalEdu.confirmLoading}
                                onCancel={()=>this.handleCancelAdd('modalEdu')}
                                okButtonProps={{ disabled: modalEduForm.buttonClose }}
                            >
                                <Form.Item
                                validateStatus={modalEduForm.validateStatus}
                                help={modalEduForm.errorMsg}
                                wrapperCol={{span:20}}>
                                    <Input
                                    value={modalEduForm.value}
                                    onChange={(e)=>this.handleTagFormChange('modalEduForm',e)}
                                    placeholder={formatMessage({id:'publish_placeholder_addtag02'})} />
                                    <span style={{position:'absolute',bottom:'-12px',right:'-44px',fontSize:'14px',color:'#999',textAlign:'right'}}>{modalEduForm.number}/20</span>
                                </Form.Item>
                            </Modal>
                        </div>
                        {/* 其他标签 */}
                        <p className={styles.label}>
                            {formatMessage({id:'publish_other_tags'})}
                            <Popover
                            placement="bottomLeft"
                            autoAdjustOverflow={false}
                            overlayClassName="tipsPop"
                            getPopupContainer={()=>this.container}
                            content={formatMessage({id:'publish_other_tips'})}>
                            <span className={styles.tipsQue}>？</span>
                            </Popover>
                        </p>
                        <div className={`${styles.floor} ${styles.colTag}`}>
                            {tags_other.map((tag,index)=>{
                                // const isLongTag = tag.value.length > 10;
                                const tagElem = (
                                    <div className={styles.tagbox}  key={index} >
                                    <CustomTag id={tag.id} checked={tag.checked} onChange={(checked,id)=>this.handleTagSelect(checked,id,'tags_other')} default={tag.undo}>
                                        {/* {isLongTag ? `${tag.value.slice(0, 10)}...` : tag.value} */}
                                        {tag.value}
                                    </CustomTag>
                                    {tag.candel ? <span onClick={()=>this.handleTagDelete(tag.id,'tags_other')} className={styles.del}><Icon type="minus-circle" /></span> : ''}
                                    </div>
                                );
                                // return isLongTag ? (
                                //     <Popover content={tag.value} key={tag.id}>
                                //         {tagElem}
                                //     </Popover>
                                // ):(tagElem);
                                return tagElem
                            })}
                            {
                                countTags < 20 ?
                                <span className={styles.addTag} onClick={()=>this.showModalTag('modalOther')}><Icon type="plus" /></span>
                                :null
                            }
                            <Modal
                                centered={true}
                                cancelText={formatMessage({id:'cancel'})}
                                okText={formatMessage({id:'feedback_confirm'})}
                                title={formatMessage({id:'publish_add_title'})}
                                visible={modalOther.visible}
                                onOk={()=>this.handleOkAddGame('tags_other','modalOtherForm','modalOther')}
                                confirmLoading={modalOther.confirmLoading}
                                onCancel={()=>this.handleCancelAdd('modalOther')}
                                okButtonProps={{ disabled: modalOtherForm.buttonClose }}
                            >
                                <Form.Item
                                validateStatus={modalOtherForm.validateStatus}
                                help={modalOtherForm.errorMsg}
                                wrapperCol={{span:20}}>
                                    <Input
                                    value={modalOtherForm.value}
                                    onChange={(e)=>this.handleTagFormChange('modalOtherForm',e)}
                                    placeholder={formatMessage({id:'publish_placeholder_addtag02'})} />
                                    <span style={{position:'absolute',bottom:'-12px',right:'-44px',fontSize:'14px',color:'#999',textAlign:'right'}}>{modalOtherForm.number}/20</span>
                                </Form.Item>
                            </Modal>
                        </div>
                    </div>

                    {/* 发布信息 */}
                    <div className={styles.item}>
                        <h2 className={styles.h2} id="publishInfo">{formatMessage({id:'publish_info'})}</h2>
                        <p className={`${styles.label} ${styles.require}`}>
                            {formatMessage({id:'publish_platform'})}
                            
                        </p>
                        <div className={styles.floor}>
                            <Form.Item>
                            {getFieldDecorator('platform',{
                                initialValue: defaultPlatform
                            })(
                                <Radio.Group>
                                <Radio disabled={defaultPlatform === 1 ? false : true} value={1}>{formatMessage({id:'publish_platform_pc'})}</Radio>
                                <Radio disabled={defaultPlatform === 3 ? false : true} value={3}>{formatMessage({id:'publish_platform_h5'})}</Radio>
                                <Radio disabled={defaultPlatform === 2 ? false : true} value={2}>{formatMessage({id:'publish_platform_mobile'})}</Radio>
                                <Popover
                                placement="bottomLeft"
                                autoAdjustOverflow={false}
                                overlayClassName="tipsPop"
                                getPopupContainer={()=>this.container}
                                content={formatMessage({id:'publish_platform_tips'})}>
                                <span className={styles.tipsQue}>？</span>
                                </Popover>
                                </Radio.Group>,
                            )}
                            </Form.Item>
                            
                        </div>

                        <p className={`${styles.label} ${styles.require}`}>{formatMessage({id:'publish_ver'})}</p>
                        <div className={styles.floor}>
                            <Form.Item wrapperCol={{span:3}}>
                                {getFieldDecorator('ver', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id:'publish_ver_tips'}),
                                        },{
                                            validator: this.handleVer
                                        }
                                    ],
                                    validateTrigger:'onBlur',
                                    initialValue: ver
                                })(<Input prefix="v"/> )}
                            </Form.Item>
                        </div>

                        <p className={`${styles.label}`}>{formatMessage({id:'publish_time'})}</p>
                        <div className={`${styles.floor} ${styles.flex}`}>
                            <Radio.Group
                            onChange={this.handleTiming}
                            defaultValue={this.state.isTiming ? 2 : 1}>
                            <Radio value={1}>{formatMessage({id:'publish_immediately'})}</Radio>
                            <Radio value={2}>{formatMessage({id:'publish_timing'})}</Radio>
                            </Radio.Group>
                            <Form.Item>
                            {getFieldDecorator('timing', {
                                rules: [
                                    {
                                        type: 'object',
                                        required: this.state.isTiming,
                                        message: formatMessage({id:'publish_timing_tips'})
                                    }
                                ],
                                initialValue: moment(new Date(nowDate.setDate(nowDate.getDate() + 3)))
                            })(
                                <DatePicker
                                allowClear={false}
                                disabled={!this.state.isTiming}
                                disabledDate={this.disabledDate}
                                showTime format="YYYY-MM-DD HH:mm:ss" />,
                            )}
                            </Form.Item>
                        </div>

                        <p className={`${styles.label} ${styles.require}`}>{formatMessage({id:'publish_update'})}</p>
                        <div className={styles.floor}>
                            <Form.Item
                            {...formTextAreaLayout}
                            validateStatus={updateError.value ? 'error' : ''}
                            help={updateError.value ? updateError.msg :''}
                            >
                            {getFieldDecorator('update', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id:'publish_update_empty'}),
                                    },{
                                        validator: this.handleLimit
                                    }
                                ],
                                initialValue: game_update,
                                getValueFromEvent: function(e){
                                    let len = 0
                                    for(var i=0;i<e.target.value.length;i++){
                                        const single = e.target.value.charCodeAt(i);
                                        if ((single >= 0x0001 && single <= 0x007e) || (0xff60<=single && single<=0xff9f)) {
                                            len++;
                                            if(len > 1000){
                                                len--;
                                                break;
                                            }
                                        }
                                        else {
                                            len+=2;
                                            if(len > 1000){
                                                len-=2;
                                                break;
                                            }
                                        }
                                    }
                                    return e.target.value.substring(0,i)
                                }
                            })(<TextArea
                                rows={4}
                                autosize={false}
                                onChange={(e)=>this.handleUpdateChange(e)}
                                onBlur={(e)=>this.handleUpdateBlur(e)}
                                placeholder={formatMessage({id:'publish_placeholder_update'})} />)}
                                <p className={styles.limit}>{update.number}/1000</p>
                            </Form.Item>
                        </div>
                    </div>

                    {/* 价格信息 */}
                    <div className={styles.item}>
                        <h2 className={styles.h2} id="publishPrice">{formatMessage({id:'publish_price'})}</h2>

                        <p className={`${styles.label} ${styles.require}`}>
                        {formatMessage({id:'publish_price_02'})}
                        <Popover
                        placement="bottomLeft"
                        overlayClassName="tipsPop"
                        autoAdjustOverflow={false}
                        getPopupContainer={()=>this.container}
                        content={formatMessage({id:'publish_price_tips'})}>
                        <span className={styles.tipsQue}>？</span>
                        </Popover>
                        </p>
                        <div className={styles.floor}>
                            <Radio.Group
                            defaultValue={1}>
                            <Radio value={1}>{formatMessage({id:'publish_free'})}</Radio>
                            </Radio.Group>
                        </div>
                    </div>

                    {/* 游戏截图 */}
                    <div className={styles.item}>
                        <h2 className={styles.h2} id="publishScreenshots">{formatMessage({id:'publish_screenshots'})}</h2>

                        <p className={`${styles.label} ${styles.require}`}>{formatMessage({id:'publish_screen'})}</p>
                        <div className={styles.floor}>
                            <UploadImages
                                config={image_config}
                                onUpdate={this.handleUpload}
                            />
                        </div>
                    </div>
                    <div className={styles.floor}>
                        <Form.Item>
                            <Button loading={this.state.isPost} disabled={!this.hasErrors(getFieldsError())} className={styles['btn-publish']} type="primary" htmlType="submit">{formatMessage({id:'publish_submit'})}</Button>
                            <Button onClick={this.preView} disabled={!this.hasErrors(getFieldsError())} className={styles['btn-preview']}>{formatMessage({id:'publish_preview'})}</Button>
                            {/* <Button onClick={this.handleTest} className={styles['btn-preview']}>TTT</Button> */}
                        </Form.Item>
                    </div>
                </div>
                </Form>
                </div>
                :
                <PreVIew
                onChange={this.handlePreviewBack}
                />
                }
                <Modal
                centered={true}
                cancelText={formatMessage({id:'cancel'})}
                okText={formatMessage({id:'feedback_confirm'})}
                maskClosable={false}
                visible={remainVisible}
                onOk={this.handleOkRemainVisible}
                onCancel={this.handleOkRemainVisible}
                >
                    <div>
                    {formatMessage({id:'publish_countdown'})}
                    <span style={{display:'inline-block'}}><Countdown valueStyle={{fontSize:'14px'}} value={remainTime} format="mm:ss" onFinish={this.onFinishRemain} /></span>
                    {formatMessage({id:'publish_countdown02'})}</div>
                </Modal>
                <Modal
                centered={true}
                cancelText={formatMessage({id:'publish_close_no'})}
                okText={formatMessage({id:'publish_close_yes'})}
                maskClosable={false}
                visible={closeVisible}
                onOk={this.handleOkCloseVisible}
                onCancel={this.handleCancelCloseVisible}
                >
                    <p style={{textAlign:'center'}}>{formatMessage({id:'publish_close_tips'})}</p>
                    <p style={{textAlign:'center',marginBottom:'0'}}>({formatMessage({id:'publish_close_tips02'})})</p>
                </Modal>
                <Modal
                centered={true}
                cancelText={formatMessage({id:'set_btn_cancel'})}
                okText={formatMessage({id:'confirm'})}
                maskClosable={false}
                visible={delVisible}
                onOk={this.handleOkDelVisible}
                onCancel={this.handleCancelDelVisible}
                >
                    <p style={{textAlign:'center'}}><strong>{formatMessage({id:'publish_tags_del_tips'})}</strong></p>
                    {
                        getLocale() === 'en-US' ?
                        <p style={{textAlign:'center',marginBottom:'0'}}>{formatMessage({id:'publish_tags_del_tips01'})}"{nowTags}"{formatMessage({id:'publish_tags_del_tips02'})}[{nowTagsGroup}]?</p>
                        :
                        <p style={{textAlign:'center',marginBottom:'0'}}>{formatMessage({id:'publish_tags_del_tips01'})}【{nowTagsGroup}】{formatMessage({id:'publish_tags_del_tips02'})}“{nowTags}”{formatMessage({id:'publish_tags_del_tips03'})}</p>
                    }
                    
                </Modal>
            </div>
        );
    }
}
const PublishGame = Form.create({ name: 'publish_form' })(PublishForm);
export default withRouter(PublishGame);
