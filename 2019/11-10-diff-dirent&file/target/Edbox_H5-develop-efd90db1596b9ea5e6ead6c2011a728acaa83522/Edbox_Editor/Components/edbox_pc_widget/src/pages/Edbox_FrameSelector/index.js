import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Row, Spin, Button, Upload, message, Popover, Slider, Col, InputNumber, Select } from 'antd';
import { formatMessage } from 'umi/locale'
import Header from '@/components/header';
import BackgroundNull from '@/assets/bg_null.png';
import maskFillet from './img/fillet.png';
import maskEllipse from './img/ellipse.png';
import maskStar from './img/star.png';
import maskHeart from './img/heart.png';
import IconButton from '@/components/iconbutton';
import IconFont from '@/components/iconfont';
import Cropper from 'react-cropper';
import styles from './index.scss';
import 'cropperjs/dist/cropper.css';
import SortGrid from './components/SortGrid';
import MessageModal from './components/MessageModal';
import OptionModal from './components/OptionModal';

const { Edbox, GIF } = window;
let maskCutting = null;
const { Option } = Select;

message.config({
    maxCount: 1
});
@connect(({ frameSelector }) => ({
    frameSelector
}))
class FrameEditor extends Component {
    constructor(props){
        super(props)
        this.state = {
            okLoading: false,
            loading: true,
            canReset: false,
            canSend: false,
            seqVisible: false,
            // debrisImg:[],
            uploadAccept: 'image/png, image/jpeg',
            mapImage: [],
            selectedChipIndex: 0,
            sortGridInit: false,
            isPlay: false,
            framesImage: '',
            tabCurrentList: true,
            cyclicModalVisible: false,
            optionCyclicData: '',
            lengthModalVisible: false,
            optionLengthData: '',
            singleActionCopy: 0,
            singleActionNew: 0,
            //图片控件
            iframeVisible:false,
            iframeOnLoad: false,
            iframeUrl:'',
            messageModalVisible: false, // 消息弹窗显隐
            messageData: {}, // 消息对象-用于iframe的消息通信
            clickButtonItem: {}, // 判断当前点击的是哪一个按钮
            //整体编辑
            aspectRatio: 0,
            autoCropArea: 1,
            scaleMarks: {
                0.5: '',
                1: '',
                1.5: '',
                2: '',
                2.5:'',
                3:''
            },
            minScale: 0.5,
            maxScale: 3,
            scaleStep: 0.01,
            scaleValue: 1,
            zoom: 0,
            rotateOperationList: [
              {
                icon: 'icon-horizontal-flip',
                param: 'horizontal',
                toolTip: formatMessage({ id: 'horizontal_flip' })
              },
              {
                icon: 'icon-vertical-flip',
                param: 'vertical',
                toolTip: formatMessage({ id: 'vertical_flip' })
              },
              {
                icon: 'icon-rotate-left',
                param: 'left',
                toolTip: formatMessage({ id: 'rotate_left' })
              },
              {
                icon: 'icon-rotate-right',
                param: 'right',
                toolTip: formatMessage({ id: 'rotate_right' })
              }
            ],
            horizontalCount: 1,
            verticalCount: 1,
            rotate: 0,
            opacityMarks: {
              0: '',
              50: '',
              100: ''
            },
            minOpacity: 0,
            maxOpacity: 100,
            opacityStep: 1,
            opacityValue: 100,
            presetName: formatMessage({ id: 'free_cut' }),
            isShowPreset: false,
            presetCurrentItem: formatMessage({ id: 'free' }),
            presetCutList: [
              {
                icon: 'icon-polygon',
                className: 'icon-polygon',
                name: formatMessage({ id: 'free' }),
                aspectRatio: 0,
                presetName: formatMessage({ id: 'free_cut' })
              },
              {
                icon: '',
                className: 'shape-1-1',
                name: '1:1',
                aspectRatio: 1 / 1,
                presetName: formatMessage({ id: 'ratio_cut' })
              },
              {
                icon: '',
                className: 'shape-3-4',
                name: '3:4',
                aspectRatio: 3 / 4,
                presetName: formatMessage({ id: 'ratio_cut' })
              },
              {
                icon: '',
                className: 'shape-2-3',
                name: '2:3',
                aspectRatio: 2 / 3,
                presetName: formatMessage({ id: 'ratio_cut' })
              },
              {
                icon: '',
                className: 'shape-1-9',
                name: '1:9',
                aspectRatio: 1 / 9,
                presetName: formatMessage({ id: 'ratio_cut' })
              },
              {
                icon: '',
                className: 'shape-16-9',
                name: '16:9',
                aspectRatio: 16 / 9,
                presetName: formatMessage({ id: 'ratio_cut' })
              }
            ],
            shapeCutList: [
              {
                icon: '',
                className: 'shape-fillet',
                name: 'Fillet'
              },
              {
                icon: 'icon-diamonds',
                className: 'shape',
                name: 'Ellipse'
              },
              {
                icon: 'icon-star',
                className: 'shape',
                name: 'Star'
              },
              {
                icon: 'icon-heart',
                className: 'shape',
                name: 'Heart'
              }
            ]
            // chipCurrent: 0
        }
    }

    componentDidMount(){
        document.addEventListener('click', () => {
            if(this.state.isShowPreset){
                this.setState({ isShowPreset: false });
            }
        });
        this.getInitData()
    }

    // componentWillMount(){
    // }

    getInitData = () =>{
        const { frameSelector, dispatch } = this.props;
        const { frameConfig, initialFrame } = frameSelector;

        Edbox.Start();
        Edbox.Message.AddMessageHandler('Init', datas => {
            // console.log(datas,100000000)
            if(datas[0]){
                if(datas[0].GUID !== ''){
                    this.setState({
                        loading: true
                    })
                    Edbox.FrameAnimation.Get(datas[0].GUID, (data)=>{
                        this.setState({
                            canSend: true,
                            loading: false
                        },()=>{
                            data.map(value=>{
                                value.time = (value.time / 1000).toFixed(2);
                                return value
                            })
                            datas[0].Value = data;
                            dispatch({
                                type: 'frameSelector/setInitData',
                                payload:{
                                    frameConfig: {...datas[0]},
                                    initialFrame: {
                                        ...datas[0],
                                        Style:{
                                            length: (this.summation(data) * 1000).toFixed(0),
                                            loop: 0,
                                            scale: datas[0].Style && datas[0].Style.scale ? datas[0].Style.scale : 1,
                                            transparent: datas[0].Style && datas[0].Style.transparent ? datas[0].Style.transparent : 100
                                        }
                                    },
                                    selectingFrame: [...datas[0].Value],
                                    frameCyclic: datas[0].Style ? datas[0].Style.loop : 0,
                                    frameLength: datas[0].Style ? datas[0].Style.length : 0
                                }
                            })
                        })
                    },(err)=>{
                        // console.log(err,1111111);
                        this.setState({
                            loading: false
                        })
                        datas[0].Value = '';
                        dispatch({
                            type: 'frameSelector/setInitData',
                            payload:{
                                frameConfig: {...datas[0]},
                                initialFrame: {...datas[0]},
                                selectingFrame: [...datas[0].Value],
                                frameCyclic: datas[0].Style ? datas[0].Style.loop : 0,
                                frameLength: datas[0].Style ? datas[0].Style.length : 0
                            }
                        })
                    });
                }else{
                    datas[0].Value = '';
                    dispatch({
                        type: 'frameSelector/setInitData',
                        payload:{
                            frameConfig: {...datas[0]},
                            initialFrame: {...datas[0]},
                            selectingFrame: [...datas[0].Value],
                            frameCyclic: datas[0].Style ? datas[0].Style.loop : 0,
                            frameLength: datas[0].Style ? datas[0].Style.length : 0
                        }
                    })
                }
            }
        })
        
        Edbox.Message.AddMessageHandler('ToolWindowCallback', datas => {
            // console.log(datas,111111)
            dispatch({
                type:'frameSelector/setSelectingFrame',
                payload:{
                    selectingFrame: datas[2]
                }
            })
        })
        
        this.setState({
            loading: false
        })   
    }

    componentDidUpdate() {
        this.messageHandler();
    }

    /**
     * message 通信的按钮监听
     */
    messageHandler = () =>{
        Edbox.Message.AddMessageHandler('MessageButtonClick', (datas, com) => {
            if(datas && datas.length){
                const callbackData = datas[0];
                const { ID } = callbackData;
                switch(ID){
                    case 'Message_Buttons_Reset_OK':
                        this.handleResetCallbackOK();
                        break;
                    default:
                        break;
                }
            }
        })
    }

    /**
     * 按钮回传监听
     * 点击重置后，对应接入的页面呼出确认弹窗，点击“确定”后，触发该事件
     */
    handleResetCallbackOK = () =>{
        const cropper = this.refs.cropper;
        const { frameSelector, dispatch } = this.props;
        const { initialFrame, frameConfig } = frameSelector;
        // if(initialFrame.Value){
            // console.log(initialFrame.Value, 1213)
            frameConfig.Value = initialFrame.Value
            this.setState({
                debrisInit:  new Date().getTime(),
                zoom: 0,
                scaleValue: 1,
                opacityValue: 100,
                rotate: 0,
                horizontalCount:1, 
                verticalCount:1,
                // debrisImg: [...initialFrame.Value],
                canReset: false
            })

            dispatch({
                type:'frameSelector/setData',
                payload:{
                    frameConfig: frameConfig,
                    selectingFrame: initialFrame.Value
                }
            })
            dispatch({
                type:'frameSelector/setCyclic',
                payload:{
                    frameCyclic: initialFrame.Style ? initialFrame.Style.loop : 0
                }
            })
            dispatch({
                type:'frameSelector/setTime',
                payload:{
                    frameLength: initialFrame.Style ? initialFrame.Style.length : 0
                }
            })
            Edbox.Message.Get(window, com => {
                com.Start();
                Edbox.Message.Broadcast('Update', [initialFrame]);
            });
        // }
        
        if(initialFrame.Value.length > 0){
            cropper.reset()
        }
    }

    handleReset = () =>{
        const messageData = {
            ID: 'Message',
            Name: 'Message',
            ShowName: formatMessage({ id: 'restore_picture_warning' }),
            Type: 'Message',
            Buttons: [
              {
                ID: 'Message_Buttons_Reset_Cancel',
                Name: 'Cancel',
                ShowName: formatMessage({ id: 'cancel' }),
                Type: 'MessageButton',
                Style: 'Default'
              },
              {
                ID: 'Message_Buttons_Reset_OK',
                Name: 'OK',
                ShowName: formatMessage({ id: 'ok' }),
                Type: 'MessageButton',
                Style: 'Primary'
              }
            ]
        };
        Edbox.Message.Broadcast('Message', [messageData]);
    }
    
    handleBeforeUpload = (file, fileList, action) => { //上传多帧、新增帧图
        const { dispatch } = this.props;
        const { type } = file;
        const acceptType = ['png', 'jpg', 'jpeg'];
        const suffixType = type.split('/')[1];
        const isImage = type.indexOf('image') === -1;
        if(action === 'upload'){
            this.setState({
                // debrisImg: [],
                debrisInit: new Date().getTime(),
                horizontalCount: 1, 
                verticalCount: 1,
                canReset: true
            })
            dispatch({
                type:'frameSelector/setSelectingFrame',
                payload:{
                    selectingFrame: []
                }
            })
        }else{
            if(this.props.frameSelector.selectingFrame.length >= 100){
                message.info(formatMessage({id:'max_chip'}));
                return false;
            }else{
                this.setState(preState =>({
                    singleActionNew: preState.singleActionNew + 1
                }))
            }
            
        }
        
        if (isImage) {
        message.error(formatMessage({ id: 'invalid_image_type' }));
        return false;
        }

        if (!acceptType.includes(suffixType)) {
        message.error(`${formatMessage({ id: 'image_type_warning' })}${acceptType.join(', ')}`);
        return false;
        }
    };
    
    handleBeforeUploadFrames = (file, fileList, action) => { //上传多帧、新增帧图(需切割)
        const { dispatch } = this.props;
        const { type } = file;
        const acceptType = ['png','jpg', 'jpeg'];
        const suffixType = type.split('/')[1];
        const isImage = type.indexOf('image') === -1;
        if(action === 'upload'){
            this.setState({
                // debrisImg: [],
                debrisInit:  new Date().getTime(),
                horizontalCount: 1, 
                verticalCount: 1,
                canReset: true
            })
            dispatch({
                type:'frameSelector/setSelectingFrame',
                payload:{
                    selectingFrame: []
                }
            })
        }
        if (isImage) {
            message.error(formatMessage({ id: 'invalid_image_type' }));
            return false;
        }

        if (!acceptType.includes(suffixType)) {
            message.error(`${formatMessage({ id: 'image_type_warning' })}${acceptType.join(', ')}`);
            return false;
        }
    };


    handleClickNav = nav =>{
        const { dispatch } = this.props;
        if (nav === 'none') {
            this.setState({
                // debrisImg: [],
                selectedChipIndex: 0,
                canReset: true
            })
            dispatch({
                type:'frameSelector/setSelectingFrame',
                payload:{
                    selectingFrame: []
                }
            })
        }
        this.setState({ isShowPreset: false });
    }

    handleUploadImageChip = data =>{
        const { dispatch } = this.props;
        const { file } = data;
        const cropperWrap = document.getElementById('cropperWrap');
        if (cropperWrap) {
            cropperWrap.setAttribute('class', '');
        }
        this.getBase64(file, imageUrl => {
            const { frameSelector } = this.props;
            const { selectingFrame } = frameSelector;
            this.setState(prevState=>({
                // debrisImg: [
                //     ...prevState.debrisImg,
                //     {
                //         chip:imageUrl,
                //         time: 0.05
                //     }
                // ],
                presetCurrentItem: formatMessage({ id: 'free' }),
                presetName: formatMessage({ id: 'free_cut' }),
                scaleValue: 1,
                radiusValue: 0,
                opacityValue: 100,
                canReset: true
            }))
            if(selectingFrame.length >= 100){
                return;
            }
            dispatch({
                type:'frameSelector/setSelectingFrame',
                payload:{
                    selectingFrame: [
                        ...selectingFrame,
                        {
                            clip:imageUrl,
                            time: 0.01
                        }
                    ]
                }
            })
        })
        
    }

    getBase64 = (img,callback) =>{
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    getBase64Canvas = (img) =>{
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const dataURL = canvas.toDataURL("image/png");  // 可选其他值 image/jpeg
        return dataURL;
    }
    
    handleUploadImageFrames = data =>{
        const { file } = data;
        const cropperWrap = document.getElementById('cropperWrap');
        if (cropperWrap) {
            cropperWrap.setAttribute('class', '');
        }
        const URL = window.URL || window.webkitURL;
        let messageCom = null;
        this.setState({
            framesImage: URL.createObjectURL(file),
            // seqVisible: true,
            presetCurrentItem: formatMessage({ id: 'free' }),
            presetName: formatMessage({ id: 'free_cut' }),
            scaleValue: 1,
            radiusValue: 0,
            opacityValue: 100,
            canReset: true
        },()=>{
            const GUID = Edbox.GetGUID();
            Edbox.Message.Broadcast("OpenToolWindow",[GUID,'CutFrameAnimation',this.state.framesImage]);
            // this.handleVisible('seqVisible',true)
            // this.buildIframeTimer = setTimeout(()=>{
            //     // const randomNum = Math.random().toString().slice(-6);
            //     const iframeSeq =  document.getElementById("controlsSeq");
            //     iframeSeq.onload = () =>{
            //         this.AddMessageMap(this,messageCom,iframeSeq.contentWindow,this.state.framesImage)
            //     }
            // })
        })
    }
    
    AddMessageMap = (controlThis, messageCom, windowIframe, imgSource) =>{
        const { dispatch } = this.props;
        Edbox.Message.Get(windowIframe, function (com) {
            com.Stop();
        });

        Edbox.Message.Get(windowIframe, function (com) {
            com.Start();
            com.Send("Init", imgSource);
            messageCom =com;
        });

        Edbox.Message.AddMessageHandler('chipping', data => {
            // console.log(data)
            controlThis.setState({
                // debrisImg: data,
                seqVisible: false
            })
            dispatch({
                type:'frameSelector/setSelectingFrame',
                payload:{
                    selectingFrame: data
                }
            })
        });

        //Close
        Edbox.Message.AddMessageHandler("Close", function (datas, com) {
            if( messageCom === com ) {
                controlThis.setState({
                    seqVisible: false
                })
            }
        });
    }

    handleSelect = (index) =>{
        this.setState({
            selectedChipIndex: index
        })
    }

    handleCopyChip = () =>{ //复制帧
        const { dispatch, frameSelector } = this.props;
        const { selectingFrame } = frameSelector;

        const { selectedChipIndex } = this.state
        let origin = selectingFrame
        if(origin.length === 0){
            return;
        }
        if(origin.length >= 100){
            message.info(formatMessage({id:'max_chip'}))
            return;
        }
        const targetCopyChip = origin[selectedChipIndex];
        origin.splice(selectedChipIndex,0,targetCopyChip)
        this.setState({
            // debrisImg: [...origin],
            canReset: true,
            singleActionCopy: new Date().getTime()
        },()=>{
            message.info(formatMessage({id:'copy_success'}))
        })
        dispatch({
            type:'frameSelector/setSelectingFrame',
            payload:{
                selectingFrame: [...origin]
            }
        })
    }

    handleDelChip = () =>{ //删除帧
        const { dispatch, frameSelector } = this.props;
        const { selectingFrame } = frameSelector;
        const { selectedChipIndex } = this.state
        let origin = [...selectingFrame]
        if(origin.length === 1){
            message.info(formatMessage({id:'clip_limit_tips'}))
            return;
        }

        if(origin.length > 1){
            origin.splice(selectedChipIndex,1)
            this.setState({
                // debrisImg: [...origin],
                selectedChipIndex: selectedChipIndex,
                canReset: true
            },()=>{
                message.info(formatMessage({id:'delete_success'}))
            })
            dispatch({
                type:'frameSelector/setSelectingFrame',
                payload:{
                    selectingFrame: [...origin]
                }
            })
        }
    }

    handlePlayChip = () =>{
        const { frameSelector } = this.props;
        const { selectingFrame } = frameSelector;
        const { isPlay } = this.state;
        if(selectingFrame.length === 0){
            return;
        }
        if(!isPlay){
            this.setState({
                isPlay: true
            })
        }else{
            this.setState({
                isPlay: false
            })
        }
    }

    handlePause = () =>{
        this.setState({
            isPlay: false
        })
    }

    /**
     * 编辑单帧
     */
    handleEditorChip = () =>{
        const { frameSelector } = this.props;
        const { selectingFrame } = frameSelector;
        const { selectedChipIndex } = this.state
        const controlThis = this;
        if(selectingFrame[selectedChipIndex] === undefined){
            return 
        }
        
        let messageCom = null;
        this.setState({
            iframeVisible: true,
            iframeOnLoad:true
        },()=>{
            const randomNum = Math.random().toString().slice(-6);
            const iframe =  document.getElementById("imageFrame");
            const controlUrl = window.location.protocol+'//'+Edbox.GetHost("Component")+'/editor/pc_widget/';
            iframe.setAttribute('src', Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), controlUrl) + '&d=' + randomNum + '&controlsFrame=2/#/Edbox_ImageSelector')
            iframe.onload = () => {
                const imgObj = {
                    // 图片对象
                    ID: '',
                    Name: 'Image01',
                    ShowName: '单张图片编辑',
                    Type: 'Image01',
                    Value: selectingFrame[selectedChipIndex].clip,
                    // Value: data.Url,
                    GUID: '',
                    Width: 0,
                    Height: 0,
                    ReadOnly: false,
                    ImageType: ['png', 'jpg', 'jpeg'],
                    IsShowCloseButton: true,
                    IsRequired: true,
                    Resetable: false
                }
                controlThis.AddMessage(controlThis, messageCom, iframe.contentWindow, imgObj)
                this.setState({
                    iframeOnLoad:false
                });
            }
        })
        
    }

    AddMessage = (controlThis, messageCom, windowIframe, imgObj) =>{
        const { dispatch, frameSelector } = this.props;
        const { selectingFrame } = frameSelector;
        const { selectedChipIndex } = this.state
        const imgList = [...selectingFrame];
        Edbox.Message.Get(windowIframe, function (com) {
            com.Stop();
        });

        Edbox.Message.Get(windowIframe, function (com) {
            com.Start();
            com.Send("Init", [imgObj]);
            messageCom =com;
        });

        Edbox.Message.AddMessageHandler('Update', (data,com) => {
            if(messageCom === com){
                console.log('update:',data)
                const image = new Image();
                image.src = data[0].Value + '?v=' + Math.random(); // 处理缓存
                image.crossOrigin = "*"; 
                image.onload = function(){
                    const base64 = controlThis.getBase64Canvas(image);
                    // console.log(base64)
                    imgList.splice(selectedChipIndex,1,{
                        clip: base64,
                        time: selectingFrame[selectedChipIndex].time
                    })
                    controlThis.setState({
                        // iframeVisible: false,
                        canReset: true,
                        iframeVisible: false
                    })
                    dispatch({
                        type:'frameSelector/setSelectingFrame',
                        payload:{
                            selectingFrame: [...imgList]
                        }
                    })
                }
            }
            
        });

        Edbox.Message.AddMessageHandler("Message", function (datas, com) {
            if(messageCom === com){
                controlThis.setState({
                    messageData:{...datas[0]}
                },()=>{
                    controlThis.handleVisible('messageModalVisible', true);
                })
            }
        });

        //Close
        Edbox.Message.AddMessageHandler("Close", function (datas, com) {
            if( messageCom === com ) {
                controlThis.setState({
                    iframeVisible: false
                })
            }
        });
    }

    handleVisible = (targetAttrStr, targeVal) => {
        this.setState({
          [targetAttrStr]: targeVal
        });
    };

    componentWillUnmount(){
        clearTimeout(this.buildIframeTimer)
    }

    handleSortGrip = (data,type) =>{
        const { dispatch } = this.props;
        this.setState({
            canReset: true
        })
        dispatch({
            type:'frameSelector/setSelectingFrame',
            payload:{
                selectingFrame: data
            }
        })
    }

    /**
     * 时长求和
     * @param {array} data //切片数组
     */
    summation = (data) =>{
        var len = 0;
        for(var i = 0;i < data.length;i++){
            len = len + parseFloat(data[i].time)
        }
        return len;
    }

    //整体编辑代码开始

    handleCyclic = value =>{
        const { dispatch, frameSelector } = this.props;
        const { frameCyclic } = frameSelector;
        if(value !== frameCyclic && value !== -1){
            this.setState({
                canReset: true
            })
            dispatch({
                type:'frameSelector/setCyclic',
                payload:{
                    frameCyclic: value
                }
            })
        }

        if(value === -1){
            this.setState({
                // canReset: true,
                cyclicModalVisible: true,
                optionCyclicData: frameCyclic === 0 ? 1 : frameCyclic
            })
        }
    }

    handleLength = () =>{
        const { dispatch, frameSelector } = this.props;
        const { frameLength, selectingFrame } = frameSelector;

        this.setState({
            lengthModalVisible: true,
            optionLengthData: {
                timeLength: frameLength/1000,
                chipLength: selectingFrame.length
            }
        })
    }

    handleOptionModalOk = (data,type,radio) =>{
        const { dispatch, frameSelector } = this.props
        const { selectingFrame } = frameSelector;
        let newArray = [];
        newArray = this.copyArray(selectingFrame);
        if(type === 0){
            this.setState({
                canReset: true
            })
            dispatch({
                type:'frameSelector/setCyclic',
                payload:{
                    frameCyclic: data
                }
            })
        }
        if(type === 1){
            this.setState({
                canReset: true
            })
            dispatch({
                type:'frameSelector/setTime',
                payload:{
                    frameLength: data*1000
                }
            })

            if(radio === 1){ //等比例分配
                const len = (data/newArray.length).toFixed(2);
                newArray.map(value =>{
                    value.time = len;
                    return value
                })

                dispatch({
                    type:'frameSelector/setSelectingFrame',
                    payload:{
                        selectingFrame: newArray
                    }
                })
            }

            if(radio === 2){ //按原有比例
                const newTotalLen = data;
                const oldTotalLen = this.summation(newArray);
                newArray.map(value =>{
                    value.time = ((value.time/oldTotalLen)*newTotalLen).toFixed(2) < 0.01 ? 0.01 :((value.time/oldTotalLen)*newTotalLen).toFixed(2);
                    return value;
                })

                dispatch({
                    type:'frameSelector/setSelectingFrame',
                    payload:{
                        selectingFrame: newArray
                    }
                })
            }
        }
    }

    handleChangeScale = value => {
        const cropper = this.refs.cropper;
    
        this.setState(prevState=>({
          scaleValue: value,
          zoom: value - prevState.scaleValue,
          canReset: true
        }),()=>{
            cropper.zoom(this.state.zoom)
        });
        // cropper.scale(value);
        // console.log(cropper.getData())
    };

    /**
   * 图片居中处理
   */
    setCropAlignCenter = () => {
        const cropper = this.refs.cropper;
        const containerData = cropper.getContainerData();
        const cropBoxData = cropper.getCropBoxData();
        const canvasData = cropper.getCanvasData();
        const boxLeft = (containerData.width - cropBoxData.width) / 2;
        const boxTop = (containerData.height - cropBoxData.height) / 2;
        const canvasLeft = (containerData.width - canvasData.width) / 2;
        const canvasTop = (containerData.height - canvasData.height) / 2;

        cropper.setCropBoxData({
        left: boxLeft,
        top: boxTop,
        width: cropBoxData.width,
        height: cropBoxData.height
        });

        cropper.setCanvasData({
        left: canvasLeft,
        top: canvasTop,
        width: canvasData.width,
        height: canvasData.height
        });

        this.setState({
        canReset: true
        });
    };

    handleChangeOpacity = value => {
        const tempVal = Math.round(value);
        let realVal;
        if (!tempVal && tempVal !== 0) {
          realVal = 100;
        } else {
          realVal = tempVal;
        }
    
        this.setState({
          opacityValue: realVal,
          canReset: true
        });
    };

    stopPropagation = e => {
        e.nativeEvent.stopImmediatePropagation();
    };

    handleTogglePreset = e => {
        this.stopPropagation(e);
        const { isShowPreset } = this.state;
        this.setState({
          isShowPreset: !isShowPreset,
          canReset: true
        });
    };

    handlePresetSelected = data => {
      const cropperWrap = document.getElementById('cropperWrap');
      const cropper = this.refs.cropper;
  
      cropperWrap.setAttribute('class', '');
  
      this.setState({
        aspectRatio: data.aspectRatio,
        presetName: data.presetName,
        presetCurrentItem: data.name,
        canReset: true
      });
  
      cropper.setAspectRatio(data.aspectRatio);
      cropper.enable();
    };

    handleShapeSelected = data =>{
        const cropper = this.refs.cropper;
        const cropperWrap = document.getElementById('cropperWrap');
        const cropperViewBox = document.querySelector('.cropper-view-box');
        const cropperFace = document.querySelector('.cropper-face');
        const classStr = `mask-${data.name.toLowerCase()}`;

        
        cropperWrap.setAttribute('class', classStr);
        cropperViewBox.style.borderRadius = 0;
        cropperFace.style.borderRadius = 0;

        this.setState({
            scaleValue: 1,
            presetName: formatMessage({ id: 'shape_cut' }),
            presetCurrentItem: data.name,
            canReset: true
        });
        
        cropper.setAspectRatio(0);
        // cropper.rotateTo(0);
        cropper.setCropBoxData({
            left: 0,
            top: 0,
            width: 350,
            height: 350
        });

        // cropper.disable();
    }
    
    handleChangeRotate = (direction) =>{
        const { horizontalCount, verticalCount, rotate } = this.state;
        const cropper = this.refs.cropper;
        switch (direction) {
            case 'horizontal':
              const rotateHorizontalCount = -horizontalCount;
              cropper.scaleX(rotateHorizontalCount);
              this.setState({
                horizontalCount: rotateHorizontalCount,
                canReset: true
              });
              break;
            case 'vertical':
              const rotateVerticalCount = -verticalCount;
      
              cropper.scaleY(rotateVerticalCount);
              this.setState({
                verticalCount: rotateVerticalCount,
                canReset: true
              });
              break;
            case 'left':
              cropper.rotate(-90);
              const rotateLeft = rotate - 90;
              this.setState({
                rotate: rotateLeft === -360 ? 0 : rotateLeft,
                canReset: true
              });
              break;
            case 'right':
              cropper.rotate(90);
              const rotateRight = rotate + 90;
              this.setState({
                rotate:  rotateRight === 360 ? 0 : rotateRight,
                canReset: true
              });
              break;
            default:
              break;
        }
    }

    /**
     *  剪裁成功更新切片数组并还原操作面板
     *  @param {obj} croppedFrameList //处理后的切片数组
     */
    handleUpdateFrame = (croppedFrameList) =>{
        const { dispatch } = this.props;
        const { presetCurrentItem, opacityValue, scaleValue } = this.state
        const shapList = [];
        const shapeList = ['Fillet', 'Ellipse', 'Star', 'Heart'];
        const isShapeCut = shapeList.includes(presetCurrentItem);
        let maskImage = null;
        let fileName = 'default.png';
        // console.log(croppedFrameList)
        if(isShapeCut){
            // console.log('特殊剪裁')
            switch (presetCurrentItem) {
                case 'Fillet':
                  maskImage = maskFillet;
                  fileName = 'fillet.png';
                  break;
                case 'Ellipse':
                  maskImage = maskEllipse;
                  fileName = 'ellipse.png';
                  break;
                case 'Star':
                  maskImage = maskStar;
                  fileName = 'star.png';
                  break;
                case 'Heart':
                  maskImage = maskHeart;
                  fileName = 'heart.png';
                  break;
                default:
                  break;
            }
            

            for (let i = 0, len = croppedFrameList.length; i < len; i++) {
                maskCutting = new Edbox.MaskCutting({
                    width: 350,
                    height: 350,
                    mask: maskImage,
                    quality: 0.8
                });
                maskCutting.Start(
                    croppedFrameList[i].clip,
                    datas => {
                        shapList.push({
                            clip:datas,
                            time:croppedFrameList[i].time
                        });
                        if (i === len - 1) {
                            this.setState({
                                // debrisImg: shapList,
                                debrisInit:  new Date().getTime(),
                                scaleValue: 1,
                                zoom: 0,
                                opacityValue: 100,
                                rotate: 0,
                                horizontalCount:1, 
                                verticalCount:1,
                                canReset: true
                            })
                            dispatch({
                                type:'frameSelector/setSelectingFrame',
                                payload:{
                                    selectingFrame: shapList
                                }
                            })
                            this.handleUploadFrame(opacityValue, scaleValue, 'clip');
                        }
                    },
                    err => {
                        console.log(err);
                    },
                )
            }
        }else{
            this.setState({
                // debrisImg: croppedFrameList,
                debrisInit:  new Date().getTime(),
                scaleValue: 1,
                zoom: 0,
                opacityValue: 100,
                rotate: 0,
                horizontalCount:1, 
                verticalCount:1,
                canReset: true
            })
            dispatch({
                type:'frameSelector/setSelectingFrame',
                payload:{
                    selectingFrame: croppedFrameList
                }
            })
            this.handleUploadFrame(opacityValue, scaleValue, 'clip');
        }
    }

    handleUploadFrame = (opacityValue, scaleValue, type) =>{
        const { frameSelector } = this.props;
        const { selectingFrame, frameCyclic } = frameSelector;
        // const { opacityValue, scaleValue } = this.state;
        
        let uploadData = [];
        let croppedFrameList =[];
        if(type === 'clip'){
            uploadData = this.copyArray(selectingFrame);
            // croppedFrameList = this.copyClipArray(selectingFrame);
            croppedFrameList = selectingFrame;
            // console.log(this.handleGifPreview(this.copyClipArray(selectingFrame)))
            let imgObjList = [];
            let count = 0;
            const workerURL = './static/js/gif.worker.js';
            const gifMerge = new GIF({
                repeat: frameCyclic === 1 ? -1 : (frameCyclic === 0 ? 0 : frameCyclic-1),
                quality: 30,
                workers: 2,
                workerScript: workerURL,
                // transparent: 'rgba(0,0,0,0)'
            });
            // console.log(frameCyclic,'==============')
            const generateGif = imgObjList => {
              for (let i = 0; i < imgObjList.length; i++) {
                gifMerge.addFrame(imgObjList[i].clip, { delay: imgObjList[i].time * 1000 });
              }
              gifMerge.render();
            };
            gifMerge.on('finished', blob => {
              let file = new FileReader();
              file.readAsDataURL(blob);
              file.onload = () => {
                const gifData = file.result;
                // console.log(gifData)
                // this.setState({
                //     previewData: gifData
                // })
                Edbox.FrameAnimation.Set(uploadData,gifData,'',function(msg,progress){
                    // console.log([msg,progress]);
                }, (guid)=>{
                    // console.log(guid);
                    Edbox.FrameAnimation.GetPreview(guid, (data)=>{
                        // console.log(data,11111)
                        // console.log(this.copyClipArray(selectingFrame));
                        
                        this.handlePreview(guid,uploadData,data,opacityValue, scaleValue)
                    },(err)=>{
                        // console.log(err,2222222)
                        this.handlePreview(guid,uploadData,'',opacityValue, scaleValue)
                    });
                },(err)=>{
                    console.log(err);
                });
              };
            });
            croppedFrameList.map(item => {
              const tmpImg = new Image();
            //   imgObjList.push({
            //       clip:tmpImg,
            //       time:item.time
            //   });
              tmpImg.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext("2d");
                canvas.width = tmpImg.width;   
                canvas.height = tmpImg.height;
                context.fillStyle = "#fff";   
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(tmpImg, 0, 0);
                this.getJpegBase64(canvas,(dataUrl)=>{
                    const newImg = new Image();
                    newImg.onload = () =>{
                        imgObjList.push({
                            clip:newImg,
                            time:item.time
                        });
                        count++;
                        if (count === croppedFrameList.length) {
                          generateGif(imgObjList);
                        }
                    }
                    newImg.src = dataUrl;
                })
              };
              tmpImg.src = item.clip;
              return true;
            });
        }

        if(type === 'none'){
            Edbox.FrameAnimation.Set(uploadData,'','',function(msg,progress){
                // console.log([msg,progress]);
            }, (guid)=>{
                // console.log(guid);
                this.handlePreview(guid,uploadData,'',opacityValue, scaleValue)
            },(err)=>{
                console.log(err);
            });
        }
    }

    getJpegBase64 = (canvas, callback) => {   
        var dataURL = canvas.toDataURL("image/jpeg");   
  
        if(typeof callback !== undefined) {   
            callback(dataURL);   
        }   
    }

    copyArray = (oldData) =>{
        let uploadData = [];

        for(var i in oldData){
            var v = oldData[i]
            var obj = {};
            obj.clip = v.clip;
            obj.time = v.time*1000;
            uploadData.push(obj)
        }

        return uploadData
    }

    copyClipArray = (oldData) =>{
        let uploadData = [];

        for(var i in oldData){
            var v = oldData[i]
            uploadData.push(v.clip)
        }

        return uploadData
    }

    handlePreview = (guid,uploadData,preview,opacityValue, scaleValue) =>{
        const { frameSelector } = this.props;
        const { frameConfig, frameCyclic, frameLength } = frameSelector;
        const updateData = {
            ...frameConfig,
            Value:uploadData,
            Preview: preview,
            Style:{
                length: frameLength,
                loop: frameCyclic,
                transparent: opacityValue,
                scale: scaleValue
            },
            GUID:guid
        }

        Edbox.Message.Get(window, com => {
            com.Start();
            Edbox.Message.Broadcast('Update', [updateData]);
        });
        // console.log('保存：',uploadData)
        this.setState({
            okLoading: false
        })
    }

    /**
     * 图片批量缩放、旋转、剪裁
     * @param {array} frameList //帧图切片数组 base64
     * @param {obj} cropBoxData //cropper 剪裁框数据
     * @param {obj} cropImgData //cropper 源图片数据
     * @param {obj} cropData //剪裁框相对图片位置信息
     */
    handleFrameOption = (frameList,cropBoxData,cropImgData,cropData) =>{ //对图片进行整体处理
        const { height, width } = cropBoxData;
        const { scaleValue, opacityValue, horizontalCount, verticalCount, rotate } = this.state
        const multiple = (cropImgData.naturalWidth / cropImgData.width).toFixed(2);
        const croppedFrameList = [];
        // console.log(cropBoxData,cropImgData,cropData)
        
        for (let i = 0, len = frameList.length; i < len; i++) {
            const cropImg = new Image();
            cropImg.crossOrigin = '';
            cropImg.onload = () => {
                const cropCanvas = document.createElement('canvas');
                const cropCanvas02 = document.createElement('canvas');
                const cropCanvas03 = document.createElement('canvas');
                cropCanvas.width = width*multiple*scaleValue;
                cropCanvas.height = height*multiple*scaleValue;
                const ctx = cropCanvas.getContext('2d');
                const ctx02 = cropCanvas02.getContext('2d');
                const ctx03 = cropCanvas03.getContext('2d');
                const left = (cropData.x);
                const top = (cropData.y);
                // ctx.globalAlpha = opacityValue / 100;
                // ctx.translate(cropCanvas.width/2,cropCanvas.height/2);
                // ctx.scale(horizontalCount, verticalCount);
                // ctx.translate(-1*cropCanvas.width/2,-1*cropCanvas.height/2);
                
                if(rotate === 90 || rotate === 270 || rotate === -90 || rotate === -270){ //旋转90°，先把图片渲染在canvs，再进行旋转切，最后切割
                    cropCanvas.width = cropImgData.naturalWidth*scaleValue;
                    cropCanvas.height = cropImgData.naturalHeight*scaleValue;
                    
                    ctx.globalAlpha = opacityValue / 100;
                    ctx.translate(cropCanvas.width/2,cropCanvas.height/2);
                    ctx.scale(horizontalCount, verticalCount);
                    ctx.translate(-1*cropCanvas.width/2,-1*cropCanvas.height/2);
                    ctx.drawImage(
                        cropImg,
                        0,
                        0,
                        cropImgData.naturalWidth,
                        cropImgData.naturalHeight,
                        0,
                        0,
                        cropImgData.naturalWidth*scaleValue,cropImgData.naturalHeight*scaleValue
                    );

                    cropCanvas02.width = cropImgData.naturalHeight*scaleValue;
                    cropCanvas02.height = cropImgData.naturalWidth*scaleValue;
                    ctx02.save();
                    ctx02.translate(cropCanvas02.width/2,cropCanvas02.height/2);
                    ctx02.rotate(rotate * Math.PI / 180);
                    ctx02.translate(-1*cropCanvas02.width/2,-1*cropCanvas02.height/2);
                    ctx02.drawImage(
                        cropCanvas,
                        (cropImgData.naturalHeight-cropImgData.naturalWidth)*scaleValue/2,
                        -(cropImgData.naturalHeight-cropImgData.naturalWidth)*scaleValue/2,
                    )
                    ctx02.restore();
                    
                    const imageData = ctx02.getImageData(left*scaleValue,top*scaleValue,cropBoxData.width*multiple*scaleValue,cropBoxData.height*multiple*scaleValue)
                    // console.log(left*scaleValue,top*scaleValue,cropBoxData.width*multiple*scaleValue,cropBoxData.height*multiple*scaleValue)
                    cropCanvas03.width = cropBoxData.width*multiple*scaleValue;
                    cropCanvas03.height = cropBoxData.height*multiple*scaleValue;
                    ctx03.putImageData(imageData,0,0);
                    const cropGifFrameData = cropCanvas03.toDataURL();
                    croppedFrameList.push({
                        clip:cropGifFrameData,
                        time:frameList[i].time
                    });
                }
                if(rotate === 180 || rotate === 0 || rotate === -180){ //180°直接进行切割
                    
                    ctx.globalAlpha = opacityValue / 100;
                    ctx.translate(cropCanvas.width/2,cropCanvas.height/2);
                    ctx.scale(horizontalCount, verticalCount);
                    ctx.translate(-1*cropCanvas.width/2,-1*cropCanvas.height/2);
                    ctx.drawImage(
                        cropImg,
                        left,
                        top,
                        width*multiple,
                        height*multiple,
                        0,
                        0,
                        cropCanvas.width,cropCanvas.height
                    );
                    cropCanvas02.width = cropCanvas.width;
                    cropCanvas02.height = cropCanvas.height;
                    ctx02.save();
                    ctx02.translate(cropCanvas02.width/2,cropCanvas02.height/2);
                    ctx02.rotate(rotate * Math.PI / 180);
                    ctx02.translate(-1*cropCanvas02.width/2,-1*cropCanvas02.height/2);
                    ctx02.drawImage(
                        cropCanvas,
                        0,0
                    )
                    ctx02.restore();
                    const cropGifFrameData = cropCanvas02.toDataURL();
                    croppedFrameList.push({
                        clip:cropGifFrameData,
                        time:frameList[i].time
                    });
                    
                }
                if (i === len - 1) {
                    this.handleUpdateFrame(croppedFrameList);
                }
            };
            cropImg.src = frameList[i].clip;
        }
    }

    handleOK = () =>{
        const { frameSelector } = this.props;
        const { selectingFrame } = frameSelector;
        console.log(selectingFrame.length)
        if(selectingFrame.length === 0){
            this.handleUploadFrame(100,1,'none')
            return
        }
        const cropper = this.refs.cropper;
        const cropData = cropper.getData();
        const cropBoxData = cropper.getCropBoxData();
        const cropImgData = cropper.getImageData();
        // const cropCanvasData = cropper.getCanvasData();
        // const { debrisImg } = this.state
        this.setState({
            okLoading: true
        })
        this.handleFrameOption(selectingFrame,cropBoxData,cropImgData,cropData)
    }

    componentWillReceiveProps(nextProps){
        const { dispatch } = this.props;
        if(nextProps.frameSelector.selectingFrame && nextProps.frameSelector.selectingFrame !== this.props.frameSelector.selectingFrame){
            if(nextProps.frameSelector.selectingFrame.length > 0){
                this.setState({
                    canSend: true
                })
            }else{
                // console.log(this.props.frameSelector.initialFrame)
                // const { IsRequired = false } = this.props.frameSelector.initialFrame
                // this.setState({
                //     canSend: !IsRequired
                // })
            }
            dispatch({
                type:'frameSelector/setTime',
                payload:{
                    frameLength: (this.summation(nextProps.frameSelector.selectingFrame)*1000).toFixed(0)
                }
            })
        }
    }

    render() {
        const { frameSelector } = this.props;
        const { frameConfig, selectingFrame, frameCyclic, frameLength } = frameSelector;
        const { 
            canReset,
            canSend,
            seqVisible,
            uploadAccept,
            // debrisImg,
            loading,
            selectedChipIndex,
            isPlay,
            tabCurrentList,
            debrisInit,
            messageModalVisible,
            messageData,
            //整体编辑
            minScale,
            maxScale,
            scaleStep,
            scaleValue,
            scaleMarks,
            rotateOperationList,
            opacityMarks,
            minOpacity,
            maxOpacity,
            opacityStep,
            opacityValue,
            presetName,
            isShowPreset,
            presetCutList,
            presetCurrentItem,
            aspectRatio,
            autoCropArea,
            iframeUrl,
            iframeVisible,
            iframeOnLoad,
            shapeCutList,
            cyclicModalVisible,
            optionCyclicData,
            lengthModalVisible,
            optionLengthData,
            singleActionCopy,
            singleActionNew
        } = this.state
        const { Property = {
            Resetable: true, IsRequired: false, IsShowCloseButton: true
        } } = frameConfig;
        const { Resetable = true, IsRequired = false, IsShowCloseButton = true } = Property;
        return (
            <div className="wrapper">
                <div className="wrapper-border">
                {loading ? 
                    <div className={styles['loading-block']}>
                        <Spin size="large" className={'index-loading-box'} />
                    </div>    
                    :
                    <div className={styles['page-wrap']}>
                        {IsShowCloseButton ? <div className={styles['page-head']}>
                            <Header className="header" title={formatMessage({ id: 'editor_frame' })} />
                        </div> : null}
                        
                        <div className={styles['page-body']}>
                            <Row>
                                <Upload
                                    className={styles['inline-block']}
                                    accept={uploadAccept}
                                    showUploadList={false}
                                    multiple={true}
                                    beforeUpload={(file, fileList)=>this.handleBeforeUpload(file, fileList,'upload')}
                                    customRequest={this.handleUploadImageChip}
                                >
                                    <IconButton
                                    iconfont="icon-upload-chips"
                                    toolTip={formatMessage({id:'upload_chips'})}
                                    placement="bottomLeft"
                                    onClick={() => this.handleClickNav('uploadImgArr')}
                                    />
                                </Upload>
                                <Upload
                                    className={styles['inline-block']}
                                    accept={uploadAccept}
                                    showUploadList={false}
                                    beforeUpload={(file, fileList)=>this.handleBeforeUploadFrames(file, fileList,'upload')}
                                    customRequest={this.handleUploadImageFrames}
                                >
                                    <IconButton
                                    iconfont="icon-upload-frames"
                                    toolTip={formatMessage({id:'upload_frame'})}
                                    placement="bottomLeft"
                                    onClick={() => this.handleClickNav('uploadImgArr')}
                                    />
                                </Upload>
                                {IsRequired ? null : <IconButton
                                iconfont="icon-forbid-s-o"
                                toolTip={formatMessage({ id: 'no_frame' })}
                                placement="bottomLeft"
                                onClick={() => this.handleClickNav('none')}
                                />}
                            </Row>
                            
                            <Row style={{width:'350px',textAlign:'center'}}>
                                <div className={styles['tab']}>
                                    <span onClick={()=>this.handleVisible('tabCurrentList',true)} className={`${tabCurrentList ? styles['active'] : ''}`}>{formatMessage({id:'frame_editor'})}</span>
                                    <span onClick={()=>this.handleVisible('tabCurrentList',false)} className={`${tabCurrentList ? '' : styles['active']}`}>{formatMessage({id:'global_editor'})}</span>
                                </div>
                            </Row>

                            {/* 单帧编辑 */}
                            <Row>
                                <div
                                className={styles['play-block']}
                                style={{ background: `url(${BackgroundNull}) repeat`, display: tabCurrentList ? 'block' : 'none' }}>
                                    {
                                        selectingFrame.length !== 0 && selectingFrame.length > selectedChipIndex ?
                                        <img src={selectingFrame[selectedChipIndex].clip} alt=""/>
                                        :null
                                    }
                                    {
                                        selectingFrame.length !== 0 && selectingFrame.length === selectedChipIndex ?
                                        <img src={selectingFrame[selectedChipIndex-1].clip} alt=""/>
                                        :null
                                    }
                                </div>
                                <div
                                className={styles['image-block']}
                                style={{ background: `url(${BackgroundNull}) repeat` }}>
                                    <div id="cropperWrap" style={{ opacity: `${opacityValue / 100}`}}>
                                        {/* {selectingFrame.length !==0 && selectingFrame[0].clip ?
                                        <Cropper
                                            ref="cropper"
                                            key="cropper"
                                            src={selectingFrame[0].clip}
                                            aspectRatio={aspectRatio}
                                            autoCropArea={autoCropArea}
                                            zoomOnWheel={false}
                                            movable={false}
                                        />
                                        : null } */}
                                        <div style={{visibility: selectingFrame.length !==0 && selectingFrame[0].clip ? 'visible' : 'hidden'}}>
                                        <Cropper
                                            ref="cropper"
                                            key="cropper"
                                            src={ selectingFrame.length !==0 && selectingFrame[0].clip ? selectingFrame[0].clip : ''}
                                            aspectRatio={aspectRatio}
                                            autoCropArea={autoCropArea}
                                            zoomOnWheel={false}
                                            movable={false}
                                        />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles['tool']} style={{display: tabCurrentList ? 'block' : 'none'}}>
                                    {
                                        isPlay ?
                                        <Popover placement={'bottom'} content={formatMessage({id:'stop'})}>
                                        <span  onClick={this.handlePlayChip} className={`${styles['tool-item']} ${styles['left']}`}><IconFont type={'icon-stop'} /></span>
                                        </Popover>
                                        :
                                        <Popover placement={'bottom'} content={formatMessage({id:'play'})}>
                                        <span  onClick={this.handlePlayChip} className={`${styles['tool-item']} ${styles['left']}`}><IconFont type={'icon-play'} /></span>
                                        </Popover>
                                    }
                                    
                                    <Popover placement={'bottom'} content={formatMessage({id:'delete_frame'})}>
                                    <span onClick={this.handleDelChip} className={`${styles['tool-item']} ${styles['right']}`}><IconFont type={'icon-delete'} /></span></Popover>

                                    <Popover placement={'bottom'} content={formatMessage({id:'copy_frame'})}>
                                    <span onClick={this.handleCopyChip} className={`${styles['tool-item']} ${styles['right']}`}><IconFont type={'icon-copy'} /></span></Popover>

                                    <Popover placement={'bottom'} content={formatMessage({id:'editor_frame'})}>
                                    <span onClick={this.handleEditorChip} className={`${styles['tool-item']} ${styles['right']}`}><IconFont type={'icon-editor'} /></span></Popover>

                                    
                                    <Upload
                                        className={`${styles['tool-item']} ${styles['right']}`}
                                        accept={uploadAccept}
                                        showUploadList={false}
                                        multiple={true}
                                        beforeUpload={(file, fileList)=>this.handleBeforeUpload(file, fileList,'add')}
                                        customRequest={this.handleUploadImageChip}
                                    >
                                        <Popover placement={'bottom'} content={formatMessage({id:'add_frame'})}>
                                        <IconFont type={'icon-add'} /></Popover>
                                    </Upload>
                                </div>
                            </Row>
                            <Row style={{display: tabCurrentList ? 'block' : 'none',overflowY:'scroll',overflowX:'hidden',maxHeight:'calc(100% - 505px)',marginTop:'15px'}}>
                                <SortGrid 
                                    items={selectingFrame}
                                    init={debrisInit}
                                    onChange={this.handleSortGrip}
                                    onSelect={this.handleSelect}
                                    play={isPlay}
                                    pause={this.handlePause}
                                    singleActionCopy={singleActionCopy}
                                    singleActionNew={singleActionNew}
                                />
                            </Row>

                            {/* 整体编辑 */}
                            {selectingFrame.length > 0 ?
                                <div>
                                    {/* 循环次数 */}
                                    <div style={{display: tabCurrentList ? 'none' : 'block'}}>
                                        <h3 className={styles['title']}>{formatMessage({ id: 'cyclic' })}</h3>
                                        <Row gutter={8}>
                                            <Col span={15}>
                                                <Select
                                                    defaultValue={ (frameCyclic !== 0 && frameCyclic !== 1 && frameCyclic !== 3) ? -1 : frameCyclic }
                                                    value={(frameCyclic !== 0 && frameCyclic !== 1 && frameCyclic !== 3) ? -1 : frameCyclic}
                                                    style={{ width: 177 }}
                                                    onSelect={this.handleCyclic}
                                                >
                                                    <Option className={'frame-select-option'} value={1}>{formatMessage({id:"cyclic_1"})} <IconFont type={'icon-frame-select'} /></Option>
                                                    <Option className={'frame-select-option'} value={3}>{formatMessage({id:"cyclic_3"})} <IconFont type={'icon-frame-select'} /></Option>
                                                    <Option className={'frame-select-option'} value={0}>{formatMessage({id:"cyclic_0"})} <IconFont type={'icon-frame-select'} /></Option>
                                                    <Option className={'frame-select-option'} value={-1}>{formatMessage({id:"cyclic_customize"})}{(frameCyclic !== 0 && frameCyclic !== 1 && frameCyclic !== 3) ? ':'+frameCyclic : ''} <IconFont type={'icon-frame-select'} /></Option>
                                                </Select>
                                            </Col>
                                        </Row>
                                    </div>

                                    {/* 总时长 */}
                                    <div style={{display: tabCurrentList ? 'none' : 'block'}}>
                                        <h3 className={styles['title']}>{formatMessage({ id: 'length' })}</h3>
                                        <Row gutter={8}>
                                            <Col>
                                                <div className={styles['length']}>
                                                    <span className={styles['length-n']}>{(frameLength/1000).toFixed(2)}</span>
                                                    <span className={styles['length-s']}>s</span>
                                                </div>
                                                <div className={styles['length-edit']}>
                                                <IconButton
                                                iconfont="icon-edit"
                                                placement="bottomLeft"
                                                onClick={this.handleLength}
                                                />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                    {/* 剪裁 */}
                                    <Row style={{display: tabCurrentList ? 'none' : 'block'}} gutter={8}>
                                        <h3 className={styles['title']}>{formatMessage({ id: 'cut_method' })}</h3>
                                        <Col span={15}>
                                            <div className={isShowPreset ? styles['preset-select-box'] : null}>
                                                <div
                                                    className={styles['preset-select-render']}
                                                    onClick={e => this.handleTogglePreset(e)}
                                                >
                                                    <IconButton className={styles['icon-clip']} iconfont="icon-clip" />
                                                    <span className={styles['preset-select-result']}>{presetName}</span>
                                                    <IconButton
                                                    className={styles['icon-arrow']}
                                                    iconfont="icon-arrow"
                                                    />
                                                </div>
                                                <div
                                                    className={styles['preset-select-list-block']}
                                                    onClick={this.stopPropagation}
                                                >
                                                    <ul className={styles['preset-select-list']}>
                                                        {presetCutList.map((item, index) => {
                                                            return (
                                                            <li
                                                                key={`preset_li_${index}`}
                                                                className={
                                                                item.name === presetCurrentItem ? styles['active'] : null
                                                                }
                                                                onClick={() => this.handlePresetSelected(item)}
                                                            >
                                                                {item.name === formatMessage({ id: 'preset' }) ||
                                                                item.name === formatMessage({ id: 'free' }) ? (
                                                                <IconButton
                                                                    className={styles[item.className]}
                                                                    iconfont={item.icon}
                                                                />
                                                                ) : (
                                                                <span className={styles[item.className]} />
                                                                )}
                                                                <p>{item.name}</p>
                                                            </li>
                                                            );
                                                        })}
                                                    </ul>

                                                    {/* 形状剪裁 */}
                                                    <dl className={styles['shape-list']}>
                                                    <dt className={styles['shape-title']}>
                                                        {formatMessage({ id: 'other_shapes' })}
                                                    </dt>
                                                    {shapeCutList.map((item, index) => {
                                                        return (
                                                        <dd
                                                            key={`shape_dd_${index}`}
                                                            className={
                                                            item.name === presetCurrentItem
                                                                ? `${styles['shape-list-item']} ${styles['active']}`
                                                                : styles['shape-list-item']
                                                            }
                                                            onClick={() => this.handleShapeSelected(item)}
                                                        >
                                                            {item.name === 'Circular' || item.name === 'Fillet' ? (
                                                            <span className={styles[`${item.className}`]} />
                                                            ) : (
                                                            <IconButton
                                                                className={styles[`${item.className}`]}
                                                                iconfont={item.icon}
                                                            />
                                                            )}
                                                            <p className={styles['name']}>{item.name}</p>
                                                        </dd>
                                                        );
                                                    })}
                                                    </dl>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* 缩放 */}
                                    <div style={{display: tabCurrentList ? 'none' : 'block'}} className={styles['shrink-block']}>
                                        <h3 className={styles['title']}>
                                        {formatMessage({ id: 'image_shrink' })}
                                        </h3>
                                        <Row gutter={8}>
                                            <Col span={15}>
                                                <div className={styles['slider-block']}>
                                                <Slider
                                                    min={minScale}
                                                    max={maxScale}
                                                    step={scaleStep}
                                                    value={scaleValue}
                                                    marks={scaleMarks}
                                                    onChange={this.handleChangeScale}
                                                />
                                                </div>
                                            </Col>
                                            <Col span={2}>
                                                <IconButton
                                                iconfont="icon-target-lock"
                                                toolTip={formatMessage({ id: 'align_center' })}
                                                placement="bottomLeft"
                                                onClick={() => this.setCropAlignCenter()}
                                                />
                                            </Col>
                                        </Row>
                                    </div>

                                    {/* 旋转 */}
                                    <div style={{display: tabCurrentList ? 'none' : 'block'}}>
                                        <h3 className={styles['title']}>{formatMessage({ id: 'rotate' })}</h3>
                                        <Row>
                                            {rotateOperationList.map((item, index) => {
                                            return (
                                                <IconButton
                                                key={index}
                                                iconfont={item.icon}
                                                toolTip={item.toolTip}
                                                placement="bottomLeft"
                                                onClick={() => this.handleChangeRotate(item.param)}
                                                />
                                            );
                                            })}
                                        </Row>
                                    </div>

                                    {/* 透明度 */}
                                    <div style={{display: tabCurrentList ? 'none' : 'block'}}>
                                        <h3 className={styles['title']}>{formatMessage({ id: 'opacity' })}</h3>
                                        <Row gutter={8}>
                                            <Col span={15}>
                                            <div className={styles['slider-block']}>
                                                <Slider
                                                min={minOpacity}
                                                max={maxOpacity}
                                                step={opacityStep}
                                                marks={opacityMarks}
                                                value={opacityValue}
                                                onChange={this.handleChangeOpacity}
                                                />
                                            </div>
                                            </Col>
                                            <Col className={styles['opacity-box']} span={9}>
                                            <InputNumber
                                                value={opacityValue}
                                                min={0}
                                                max={100}
                                                onChange={this.handleChangeOpacity}
                                            />
                                            %
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                :
                                null
                            }
                        </div>
                        <Row className={styles['page-foot']}>
                            {Resetable ? <Button onClick={this.handleReset} disabled={!canReset || this.state.okLoading}>
                                {formatMessage({ id: 'reset' })}
                            </Button> : null}
                            <Button loading={this.state.okLoading}  disabled={!canSend} type="primary" onClick={() => this.handleOK()}>
                                {formatMessage({ id: 'ok' })}
                            </Button>
                        </Row>
                    </div>
                }

                {/* 模拟编辑器大厅的切割弹窗 */}
                <Modal
                className={styles['test-mode']}
                title={formatMessage({id:'cut_tool'})}
                visible={seqVisible}
                footer={null}
                width={1024}
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>this.handleVisible('seqVisible',false)}
                >
                    <div style={{height: '730px'}}>
                    <iframe
                    src={window.location.origin + '/#/Edbox_FrameSelector/SeqMap'}
                    frameBorder="0"
                    title="edbox"
                    width="100%"
                    height="100%"
                    id="controlsSeq"
                    name="controlsname"
                    />
                    </div>
                </Modal>

                {/* 自定义循环次数弹窗 */}
                {cyclicModalVisible ? (
                    <OptionModal
                        visible={cyclicModalVisible}
                        type={0}
                        data={optionCyclicData}
                        modalCancel={() => this.handleVisible('cyclicModalVisible', false)}
                        modalOk={this.handleOptionModalOk}
                    />
                ):null}
                
                {/* 自定义时间弹窗 */}
                {lengthModalVisible ? (
                    <OptionModal
                        visible={lengthModalVisible}
                        type={1}
                        data={optionLengthData}
                        modalCancel={() => this.handleVisible('lengthModalVisible', false)}
                        modalOk={this.handleOptionModalOk}
                    />
                ):null}


                {/* 重新消息弹窗 */}
                {messageModalVisible ? (
                <MessageModal
                    visible={messageModalVisible}
                    messageData={messageData}
                    modalCancel={() => this.handleVisible('messageModalVisible', false)}
                />
                ) : null}
                </div>

                {/* 引入图片编辑控件 */}
                {iframeVisible ? <div className={styles['imgSelect-layer']}>
                    {iframeOnLoad ? 
                        <div className={styles['loading-block']}>
                            <Spin size="large" className={'index-loading-box'} />
                        </div>:null
                    }
                    <iframe
                    src={iframeUrl}
                    frameBorder="0"
                    title="edbox"
                    width="100%"
                    height="100%"
                    id="imageFrame"
                    name="imagename"
                    />
                </div> : null}
            </div>
        );
    }
}

export default FrameEditor;