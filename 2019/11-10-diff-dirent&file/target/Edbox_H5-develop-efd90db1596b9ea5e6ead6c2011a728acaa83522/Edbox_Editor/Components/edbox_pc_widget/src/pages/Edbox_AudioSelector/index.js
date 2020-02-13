import React, {Component} from 'react';
import {formatMessage}  from 'umi/locale';
import Link from 'umi/link';
import {message, Button, Radio, Row, Col} from 'antd';
import IconFont from '@/components/iconfont';
import WaveSurfer from 'wavesurfer.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions'
import Header from '@/components/header';
import IconButton from '@/components/iconbutton';
import Name from '@/components/name';
import NumberInput from '@/components/numberinput';
import Loading from '@/components/loading';
import '@/common.scss';
import styles from './index.scss';
import { connect } from 'dva';


/**
 * Edbox音频控件
 * 用于Edbox平台的音频控件功能
 * @author 陈五洲(880123)  UI 孟雁斌 (186905)
 * @version 0.0.2.0 (2019年07月26日 21:00:00)
 * @see 
 * Depend:
 *      音视频剪切服务:http://ndsdn.nd.com.cn/index.php?title=Edbox_音视频剪切服务
 * */


@connect(({ audioSelector }) => ({
    audioSelector
}))

class EditAudio extends Component {
    constructor() {
        super();

        this.audioData = null;

        this.cliping = false;

        this.state = {
            init: false,
            loading: true,
            wavesurfer: null,
            region: null,
            start: 0.00,
            end: 0.01,
            step: 0.01,
            maxTime : 0.00,
            name: '',
            // 波形图加载音频完成
            loadAuido : false,
            // 自由裁剪音频样式
            freeAudio : false,
            // 音频是否播放
            audioPlay: false
        }
    }
    
    // 音频编辑控件数据初始化
    componentWillMount = ()=>{

        const { Edbox } = window;
        Edbox.Start();

        var { dispatch } = this.props;

        // 数据初始化后，loading改为false
        this.setState({
            loading: false
        });

        this.messageHandler();

        var _this = this;

        // 事件监听   
        Edbox.Message.AddMessageHandler("Init", function (datas, com) {

            var audioData = datas[0];

            if (!audioData) {
                alert(formatMessage({ id: 'guid_error' }));
                return;
            }

            if (!audioData.ResourceName){
                audioData.ResourceName = audioData.Name;
            }
                  
            dispatch({
                type: 'audioSelector/initAudioSelector',
                payload: audioData
            });

            _this.setState({
                init: true
            });

            _this.refreshAudio(audioData);

        });

        // 监听编辑器保存事件
        Edbox.Message.AddMessageHandler("EditSave", function (datas, com) {
            
            const {wavesurfer} = _this.state;

            if (wavesurfer.isPlaying())
            {
                wavesurfer.playPause();
            }
          
            _this.setState({
                audioPlay : false
            })
        });

        // 监听编辑器停止播放
        Edbox.Message.AddMessageHandler("StopAudio", function (datas, com) {
            
            if (com.Window === window) return;

            const {wavesurfer} = _this.state;

            if (wavesurfer.isPlaying())
            {
                wavesurfer.playPause();
            }
          
            _this.setState({
                audioPlay : false
            })
        });
    }

    componentWillUnmount(){
        this.destroyRegion();
    }


    /**
     * 处理音频显示区
     * @param {string} time 需要转换的时间
     * @return {float} newtime 抓换后的时间
     */
    conversionTime(time){
        return Math.floor(Number(time) * 100) / 100;
    }

    /**
     * 处理音频显示区
     */
    componentDidMount() {
        var { audioSelector } = this.props;
        var { remoteAudio } = audioSelector;
        if (remoteAudio.GUID === '') return;

        this.setState({
            init: true
        })

        this.refreshAudio(remoteAudio);
    };


    /**
     * 刷新音频显示区
     * @param {Object} audio 音频数据 为空时为无资源
    */
    refreshAudio(audio) {

        this.audioData = null;

        this.refAudio = audio;
       
        if (!audio || !audio.GUID || audio.GUID === ""){
            this.handleNoAudio();
        }
        else{
            // 效验音频guid数据数据
            const {Edbox} = window;
            const _this = this;

            this.cliping = false;
                    
             // a.查询业务服务器,该音频是否在裁切中
             _this.getAudioCut(audio.GUID, (audioData)=>{
                
                let audioGuid = audio.GUID;

                if (audioData !== null){
                    if (audioData.status !== "finish"){
                        audioGuid = audioData.origuid; 
                        _this.cliping = true;
                        _this.audioData = audioData;
                    }
                }
  
                // b.效验资源正确性
                Edbox.NDR.Get(audioGuid, (ndrData)=>{
                    // c. 刷新波形图
                    _this.refreshWaveSuffer(audioGuid, ndrData.Url, ()=>{
          
                        if (_this.cliping){
                            _this.cliping = false;
                            // d.音频裁剪未结束
                            _this.handleAudioPartialRender(_this.audioData.starttime, _this.audioData.endtime);
                        }
                        else{

                            Edbox.MMO.SubStrLen( _this.refAudio.ResourceName, 32, (name)=>{
                                _this.setState({
                                    name: name
                                    //freeAudio : false
                                });
                                
                                _this.clickFixedAudio();        
                            })               
                        }                     

                    }, ()=>{
                        // 提示数据异常
                        //alert(formatMessage({id: 'guid_eror'}));

                        _this.handleNoAudio();

                        _this.setState({
                            loading : false
                        });
                    });
                }, 
                ()=>{
                    // 提示数据异常
                    //alert(formatMessage({id: 'guid_eror'}));

                    _this.handleNoAudio();

                    _this.setState({
                        loading : false
                    });
                }); 
            }); 
        }
    }

    /**
     * 处理音频显示区
     */
    waveSurferInit (url, ready, finish, error) {
 
        var wavesurfer = WaveSurfer.create({
            container: '#waveform',
            cursorColor: '#ff0000',
            cursorWidth: 2,
            barWidth: 2,
            hideScrollbar: true,
            waveColor: '#ccc',
            progressColor: '#ccc',
            responsive: true,
            plugins: [
                this.timelineInit(),                   
                this.regionsInit()
                //this.cursorInit(),
            ]
        });

        wavesurfer.load(url);

        wavesurfer.clearRegions();

        wavesurfer.on('ready', ()=>{ready(wavesurfer)});

        wavesurfer.on('finish', ()=>{finish(wavesurfer)});

        wavesurfer.on('pause', ()=>{finish(wavesurfer)});

        wavesurfer.on('error', error);

    }

    /**
     * 时间线配置初始化
     */
    timelineInit () {
        let timeline = Timeline.create({
            container: '#timeline',
            notchPercentHeight: 40,
            unlabeledNotchColor: '#ccc',
            primaryColor: '#ccc',
            secondaryColor: '#ccc',
            primaryFontColor: '#666',
            secondaryFontColor: '#666',
            fontSize: 12,
            timeInterval: (pxPerSec) => {
                let interval = this.conversionTime(1 / (pxPerSec / 20));
                interval = interval ? interval : 0.003;
                return interval;
            },
            primaryLabelInterval: (pxPerSec) => {
                return 5;
            },
            secondaryLabelInterval: (pxPerSec) => {
            },
            formatTimeCallback: (seconds, pxPerSec) => this.formatTimeCallback(seconds, pxPerSec)
        })

        return timeline;
    }

    /**
     * 根据guid获取音频任务状态
     * @param {string} guid 音频guid
     * @param {Function} success 成功回调 为空说明无次裁切任务 {
     *                              {string} guid 裁切后的guid
     *                              {string} origuid 裁切的原guid
     *                              {string} status 状态 任务状态,init：任务初始化，download:文件下载完成，handle:文件处理完成, finish:文件上传到ndr成功
     *                              {number} starttime 开始时间
     *                              {number} endtime 结束时间
     * }
     * @param {Function} error 出错回调
     */
    getAudioCut(guid, success ,error) {
        const _this = this;
        const { Edbox } = window;
        var subUrl = "/v0.1/api/videoEditor/videoEditor/actions/get_video_task_by_guid?guids=" + guid ;
        
        Edbox.Request.Get(Edbox.GetHost("MMO"), subUrl, null, (suc)=>{
            
            if (suc.items.length < 1){
                if (success) success(null);
                return;
            }

            let item = suc.items[0];
            item.params = JSON.parse(item.params);
            let data = {
                guid: item.new_guid,
                origuid: item.guid,
                status: item.status,
                starttime: _this.strTime2Seconds(item.params.start_position),
                endtime: _this.strTime2Seconds(item.params.start_position) + _this.strTime2Seconds(item.params.cut_time)
            };

            if (success) success(data);

        }, (err)=>{
                alert(err.code);
                if (error) error(err);
        });
    }

    /**
     * 根据选中音频刷新波形图
     * @param {string} guid 音频guid
     * @param {string} url 音频链接地址
     */
    refreshWaveSuffer (guid, url, success, error){

        const _this = this;
        const { freeAudio } = this.state;

        var waveready = (wavesurfer) => {
                
            console.log("refreshWaveSuffer is refresh end" );
    
            _this.setState({        
                loadAuido : true,
                wavesurfer: wavesurfer,
                maxTime :  this.conversionTime(wavesurfer.getDuration())
            }, ()=>{
                if (freeAudio){
                    _this.switchFreeAudio();
                }
                else{
                    _this.switchFixedAudio();
                }
            })

            if (success) success();

            _this.setState({        
                loading : false
            })
        };

        var wavefinish = (wavesurfer)=>{

            _this.setState({
                audioPlay : false
            });

            const { region } = this.state;
            
            wavesurfer.setCurrentTime(region.start);

        };

        var waverror = (err) => {
            console.log(err);
            if (error) error();
        };

        if (guid === "" || url === "") return;

        console.log("refreshWaveSuffer is refresh begin" );   
        
        var {wavesurfer} = this.state;

        this.setState({        
            loading : true
        })

        if (wavesurfer === null){
            this.waveSurferInit(url, waveready, wavefinish, waverror);
        }
        else{
            wavesurfer.load(url);      
        }
    }

    /**
     * 选取部分波形渲染
     */
    handleAudioPartialRender(defaultStart, defaultEnd) {

        const {wavesurfer} = this.state;
        if (wavesurfer === null) return;

        const originalBuffer = wavesurfer.backend.buffer;

        const frameCount =  Math.ceil((defaultEnd - defaultStart) * originalBuffer.sampleRate);

        let newBuffer = wavesurfer.backend.ac.createBuffer( // 创建新buffer
            originalBuffer.numberOfChannels,
            frameCount, // 获取想要获取的波形范围
            originalBuffer.sampleRate
        );

        for (let i = 0; i < originalBuffer.numberOfChannels; i++) { // 遍历获取所需的波形数据
            let fromChannelData = originalBuffer.getChannelData(i);
            let toChannelData = newBuffer.getChannelData(i);
            for (var j = 0, f = Math.ceil(defaultStart*originalBuffer.sampleRate), t = 0; j < frameCount; j++, f++, t++) {
                toChannelData[t] = fromChannelData[f];
            }
        }

        wavesurfer.empty(); // 清空现有绘制内容
        wavesurfer.loadDecodedBuffer(newBuffer); // 绘制新buffer数据    
    }

    /**
     * 选中区配置初始化
     */
    regionsInit () {
        
        return Regions.create({
            regions: [
                {
                    start: 0.01,
                    end: 0.01,
                    drag: true,
                    resize: true,
                    color: 'rgba(207, 1, 0, 0.3)'
                }
            ]     
        }) 
    }


    timeInterval(pxPerSec){
        console.log(pxPerSec)

        if (pxPerSec >= 25) {
            return 1;
          } else if (pxPerSec * 5 >= 25) {
            return 5;
          } else if (pxPerSec * 15 >= 25) {
            return 15;
          }
    
          return Math.ceil(0.5 / pxPerSec) * 60;
    }


    /**
     * 时间线时间格式化
     * @param {int} seconds 当前秒数
     */
    formatTimeCallback(seconds, pxPerSec) {
        const waveform = this.refs.waveform;
        var min = 0;
        var sec = 0;
        let hour = 0;
        hour = Math.floor(seconds / 60 / 60);
        hour = hour < 10 ? `0${hour}` : hour;
        min = Math.floor(seconds / 60);
        min = min < 10 ? `0${min}` : min;
        sec = this.conversionTime(seconds % 60);
        sec = sec < 10 ? `0${sec}` : sec;
        if (waveform && seconds * pxPerSec + 55 > waveform.clientWidth) {
            return '';
        }
        if (!parseInt(hour)) {
            return `${min}:${sec}`;
        } else {
            return `${hour}:${min}:${sec}`;
        }
    }

     /**
     * 时间线时间格式化
     * @param {string} strTime 时间格式  00:00:22.810
     * @return {number}  当前秒数 22.81
     */
    strTime2Seconds(strTime) {

        let times = strTime.split(":");

        let sec = this.conversionTime(parseFloat(times[2]));
        let min = parseInt(times[1]);
        let hour = parseInt(times[0]);
        
        return Number(hour * 3600 + min * 60 + sec);
    }

    /**
     * 时间线时间格式化
     * @param {number} seconds 当前秒数
     */
    getTotalTime(seconds){
        seconds = Number(seconds);
        var number = this.conversionTime() - Math.floor(seconds);
        var des = parseInt(number * 100);
        if (des < 10) {
            des = '0' + des;      
        }
        else{
            des = des + '';
        }
        return this.formatTimeCallback(Math.floor(seconds)) + ':' + des;
    }

    /**
     * 总时间线时间 (获取小数点后两位 并向下取整))
     * @param {number} seconds 当前秒数
     */
    getTitleTotalTime(seconds){
        seconds = Number(seconds);

        var des = parseInt(seconds * 100 - Math.floor(seconds) * 100);

        if (des < 10) {
            des = '0' + des;      
        }
        else{
            des = des + '';
        }

        function formatTimeCallback(seconds) {
            
            var min = 0;
            var sec = 0;
            let hour = 0;
            hour = Math.floor(seconds / 60 / 60);
            hour = hour < 10 ? `0${hour}` : hour;
            min = Math.floor(seconds / 60);
            min = min < 10 ? `0${min}` : min;
            sec = Math.floor(seconds % 60);
            sec = sec < 10 ? `0${sec}` : sec;

            if (!parseInt(hour)) {
                return `${min}:${sec}`;
            } else {
                return `${hour}:${min}:${sec}`;
            }
        }

        return formatTimeCallback(Math.floor(seconds)) + '.' + des;
    }

    /**
     * 选取本地音频
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    OpenLocalFile (progress, success, error) {

         // 后缀检测 只支持(mp3, ogg, wav)
        function checkAudio(str){
            if (str.toLowerCase().match(/(.ogg|.mp3|.wav)$/)){
                return true;
            }else{
                return false;
            }
        }
    
        const _this = this;
        let input = document.createElement("input");
        input.type = "File";
        input.accept = "audio/mp3, audio/ogg, audio/wav";
        input.onchange = function () {
            if (!input.files || !input.files[0]) {
                if (error) error("None Select");
                return;
            }

            const {Edbox} = window;
            let file = input.files[0];
             // 后缀检测
            if (!checkAudio(file.name)){
                message.error(formatMessage({ id: 'audio_suffix_error' }));
                return;
            }      

            // 敏感词检测
            _this.IsSensitive(file.name, ()=>{
               
                    Edbox.NDR.GetFileData(file, function (info) {
                        _this.setState({
                            loading : true
                        })
                        _this.PostToNDR(info, progress, (suc)=>{
                            if (success) 
                                success(suc, info.Name);
                        }, error);
                    });
                }, error => {
                    console.log(error);
                    return;
            }, error => {
                console.log(error);
                return;
            });
        };
        input.click();

    };


    /**
     * 提交数据到NDR
     * @param {Object} info 文件数据 info{Name,Data}
     * @param {Function} progress 进度显示
     * @param {Function} success 成功回调,带参数Data:{Guid,Url,Type,Name}
     * @param {Function} error 出错回调
     */
    PostToNDR (info, progress, success, error) {
  
        const {Edbox} = window;
        //if (func.GetInfo) func.GetInfo(info);
        Edbox.NDR.Post(info.Data, info.Name, progress, success, error);
   
    };
 
    /**
     * 选中本地音频文件
    */
    handleLocalAudio() {
    
        var { props } = this;
        var _this = this;
        this.OpenLocalFile(function(prg){

        }, function(data, name){

            if(name.match(/[\\\/:*?"<>|#]/)){
                message.error(formatMessage({id: 'illegal_file_name'}));
                return;
            }

            // 上传成功后发送给业务服务器guid
            _this.uploadGuid(data.Guid, ()=>{
                _this.setState({
                    loading : false
                })

                const { Edbox } = window;

                Edbox.MMO.SubStrLen(name, 32, (newName)=>{
        
                    var { dispatch, audioSelector } = props;
                    var { remoteAudio } = audioSelector;
    
                    dispatch({
                        type: 'audioSelector/setSound',
                        payload: {
                            guid: data.Guid,
                            // 音频名称
                            name: newName,
                            // 音频url
                            url: data.Url
                        }
                    })

                    _this.refreshAudio(remoteAudio);   
                })
    
            }, function(err){
                
                _this.setState({
                    loading : false
                })
                
                if (err === 'Illegal File Name'){
                    alert(formatMessage({id: 'illegal_file_name'}));
                }
            });      
        })
    
    }

    
    /** 
    * 上传需要转码的音频
    * @param {string} guid 文件id
     * @param {Function} success 成功回调,guid
     * @param {Function} error 出错回调
    */
    uploadGuid = (guid, success, error) =>{

        const { Edbox } = window;
        const subUrl = "/v0.1/api/videoEditor/videoEditor/actions/upload_guid";

        function getEnv(){
            if (Edbox.ServerKey === "Beta" || Edbox.ServerKey === "US"){
                return 1;
            }

            return 0;
        }

        let data = {
            guids : guid,
            env : getEnv()
        };   

        
        Edbox.Request.Post(Edbox.GetHost("MMO"), subUrl, JSON.stringify(data), (suc)=>{
            if (success) success(suc.new_guid);

        }, (err)=>{
                alert(err.code);
                if (error) error(err);
        });          
    }


    /** 
    * 置空音频数据
    */
    handleNoAudio() {
   
        var sound = {
            guid: '',
            // 音频名称
            name: '',
            // 音频url
            url: '',
            // 音频时间 毫秒
            duration: 0,
            time: '',
            type:''
        };

        var { dispatch } = this.props;
        dispatch({
            type: 'audioSelector/setSound',
            payload: {
                guid: '',
                // 音频名称
                name: '',
                // 音频url
                url: ''
            }
        })  

        this.setState({
            name: sound.name,   // 默认名称
            freeAudio : false,
            loadAuido : false,
            maxTime : 0
        });

        var { wavesurfer } = this.state;

        if (wavesurfer != null) {
            wavesurfer.destroy();
        }

        this.setState({
            wavesurfer : null,
            region : null
        });

        this.clickFixedAudio();
    }

    /**
     * 获取音频后缀名
     */
    getAudioExtend(name) {
        var index = name.lastIndexOf(".");
        return name.substring(index + 1, name.length).toLowerCase();
    }

    /**
     * url转base64
     */
    Audio2Base64(url, success, error) {

        var reload = 0;
        var maxreload = 3;
        // Initialize the XMLHttpRequest and wait until file is loaded
        var xhr = new XMLHttpRequest();

        var _this = this;

        xhr.onload = function () {
            // Create a Uint8Array from ArrayBuffer            
            var base64 = btoa(
                new Uint8Array(xhr.response)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );      
            

            var fmt = _this.getAudioExtend(url);

            if (success){
                console.log("Audio2Base64 Finish");
                success('data:audio/' + fmt + ';base64,' + base64);
            }
        };

        xhr.onerror = function () {
            ++reload;

            if (reload < maxreload){
                xhr.send(); 
            }
            else{
                if (error) error();
            }
        };


        // Send HTTP request and fetch file as ArrayBuffer
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.send(); 
    }


    /**
     * 敏感词检测
     */
    IsSensitive(str, succ, error){
        if(str.match(/[\\\/:*?"<>|#]/)){
            message.error(formatMessage({id: 'illegal_file_name'}));

            if (error) error();
            return;
        }
        // 空资源检测
        if (str === ""){
            if (succ) succ();
            return;
        }

        const {Edbox} = window;

        Edbox.MMO.IsSensitive(str, flag=>{
            if (flag.is_sensitive) {
                message.error(formatMessage({ id: 'sensitive_words' }));
                if (error) error();
                return;
            }
            else{
                if (succ) succ();
            }
        }, error);
    }

    /**
     * 选中音频 并关闭界面
     */
    handleOK =()=> {

        var { dispatch,audioSelector } = this.props;
        var { remoteAudio } = audioSelector;
        var { Edbox } = window;

        var {name, start, end, wavesurfer} = this.state;

        var _this = this;

        // 检测是否满足裁切条件
        function IsCutAudio(wavesurfer, start, end, success, error){

            if (!wavesurfer){
                if (error) error();
                return;
            }

            const cutTime = end - start;
            // 效验裁剪的最小时间不能超过0.05s
            if (cutTime < 0.05) {
                message.info(formatMessage({id: "audio_cut_short"}));
            
                if (error) error();
                return;     
            }

            const lastTime = _this.conversionTime(wavesurfer.getDuration());
            if ( cutTime > lastTime) {
                message.info(formatMessage({id: "audio_cut_long"}));
                if (error) error();
                return;
            }
            else if(cutTime < lastTime) {
                if (success) success(true);
                return;
            }

            if (success) success(false);

        }  

        // 音频名称检测
        if (remoteAudio.GUID !== "" && name.length <= 0){
            message.info(formatMessage({id: "empty_file_name"}));
            return;
        }

        // 空音频处理
        if (remoteAudio.GUID === ""){

            Edbox.Message.Get(window, com => {
                com.Start();
                remoteAudio.ResourceName = name;
                let datas = [];
                datas.push(remoteAudio)
                Edbox.Message.Broadcast('Update', datas);

                message.success(formatMessage({id: "audio_set_succ"}));
            });
            return;
        }

        // 敏感词检测
        this.IsSensitive(name,()=>{ 

            // 判断是否有裁剪
            IsCutAudio(wavesurfer, start, end, (bcut)=>{
                if (bcut){
                    _this.setState({
                        loading : true
                    })
        
                    // 查询业务服务器,该音频是否在裁切中
                    _this.getAudioCut(remoteAudio.GUID, (data)=>{
        
                        let cutGuid = remoteAudio.GUID;
                        let startTime = parseFloat(start);
                        let endTime = parseFloat(end);
        
        
                        if (data !== null) {
                            // 资源尚未更新到
                            if (data.status !== "finish"){
                                cutGuid = data.origuid;
                                startTime = this.conversionTime(startTime + data.starttime);
                                endTime = this.conversionTime(endTime + data.starttime);
        
                                // 开始时间 结束时间 验证
                                endTime = Math.min(endTime, data.endtime);
                                startTime = Math.max(Number(startTime), data.starttime);
                                endTime = Math.max(Number(startTime), endTime);
                            }
                        }
        
                        _this.handleSendCutAudio(cutGuid, startTime, endTime - startTime , (newguid)=>{
                            _this.setState({
                                loading : false
                            })                 
                            
                            //console.log("handleSendCutAudio is success" ); 
                            message.success(formatMessage({id: "audio_set_succ"}));
        
                            Edbox.MMO.SubStrLen(name, 32, (newName)=>{
                        
                                dispatch({
                                    type: 'audioSelector/setSound',
                                    payload: {
                                        guid: newguid,
                                        name: newName,
                                        url: ""
                                    }
                                });
                                _this.refreshAudio(remoteAudio);
                
                                Edbox.Message.Get(window, com => {
                                    com.Start();
                                    remoteAudio.ResourceName = newName;
                                    let datas = [];
                                    datas.push(remoteAudio)
                                    Edbox.Message.Broadcast('Update', datas);
                                });
                            })            
                                            
                        }, (err)=>{
                            message.error(err);
                            _this.setState({
                                loading : false
                            })
                        }); 
                    })
                }
                else{
                    // 通过 postMessage 发送 audio
                    Edbox.Message.Get(window, com => {
                        com.Start();
                        remoteAudio.ResourceName = name;
                        let datas = [];
                        datas.push(remoteAudio)
                        Edbox.Message.Broadcast('Update', datas);
        
                        message.success(formatMessage({id: "audio_set_succ"}));
                    });
                }
      
            }, error => {
                console.log(error);
                return;
            });
        });
    }

    // 消息事件绑定
    messageHandler = () => {

        const {Edbox} = window;

        Edbox.Message.AddMessageHandler('MessageButtonClick', (datas, com) => {
            if (datas && datas.length) {
                const callbackData = datas[0];
                const { ID } = callbackData;
                switch (ID) {
                    case 'Message_Buttons_Reset_OK':
                    this.handleResetCallbackOK();
                        break;
                    default:
                        break;
                }
            }
        });
    };

    // 确认重置
    handleResetCallbackOK() {

        const { audioSelector } = this.props;      
        const { remoteAudio, defAudio } = audioSelector;

        if (remoteAudio.GUID === defAudio.GUID){
            return;
        }

        const { dispatch } = this.props;
        dispatch({
            type: 'audioSelector/resetAudio',
            playload: {}
        });

        this.refreshAudio(defAudio);

        const {Edbox} = window;

        Edbox.Message.Get(window, com => {
            com.Start();
            let datas = [];
            datas.push(defAudio)
            Edbox.Message.Broadcast('Update', datas);
        });
    }


    /**
     * 重置音频 并关闭界面
     */
    handleReset() {     

        const {Edbox} = window;

        const messageData = {
            ID: 'Message',
            Name: 'Message',
            ShowName: formatMessage({ id: 'restore_audio_warning' }),
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


    /**
     * 拖动保持播放/暂停音频
    */
   dragPlayAudio (region) {

        const {wavesurfer} = this.state;

        if (region === null){
            return;
        }

        wavesurfer.setCurrentTime(region.start)      
    }

    /**
     * 播放/暂停音频
    */
    clickPlayAudio (){
        const {wavesurfer, region} = this.state;

        if (wavesurfer.isPlaying())
        {
            wavesurfer.playPause();
        }
        else{

            const {Edbox} = window;

            Edbox.Message.Broadcast("StopAudio", [], function () {
                if (region != null){
                    wavesurfer.play(region.start, region.end);
                }
                else{
                    wavesurfer.play();
                }
            });    
        }   

        this.setState({
            audioPlay : wavesurfer.isPlaying()
        })
    }


    onStartChange (value){

        if (typeof(value) === 'number') {

            var {end, wavesurfer} = this.state;
            value = Math.min(Number(end) - 0.01, value)

            this.setState({
                start : this.conversionTime(value)
            })

            const { region} = this.state;

            region.update({
                start: value
            })

            if (wavesurfer){
                wavesurfer.setCurrentTime(value);
            }

        }
    }

    onEndChange (value){

        if (typeof(value) === 'number') {
               
            var {start} = this.state;
            value = Math.max(Number(start) + 0.01, value)

            this.setState({
                end: this.conversionTime(value)
            })

            const {region} = this.state;

            if (region === null) return;

            region.update({
                end: value
            })
        }   
    }
     /**
     * 裁切音频数据
     * 消息wiki: http://ndsdn.nd.com.cn/index.php?title=Edbox_%E9%9F%B3%E8%A7%86%E9%A2%91%E5%89%AA%E5%88%87%E6%9C%8D%E5%8A%A1
     * @param {string} 需要裁切的音频guid
     * @param {number} 开始时间 
     * @param {number} 裁剪时间 
     * @param {Function} success 成功回调,带参数Data:{Guid}
     * 
     */
    handleSendCutAudio (audioGuid, startTime, cutTime, success, error) {     
    
        const { Edbox } = window;
        const subUrl = "/v0.1/api/videoEditor/videoEditor/actions/cut_audio";

        let data = {
            guid : audioGuid,
            start_position : this.conversionTime(startTime).toFixed(3),
            cut_time : this.conversionTime(cutTime).toFixed(3)
        };  

        Edbox.Request.Post(Edbox.GetHost("MMO"), subUrl, JSON.stringify(data), (suc)=>{

        if (success) success(suc.guid);
            
        }, (err)=>{

            let tip = "audio_clip_error";

            switch(err.code){
                case 'VIDEOEDITOR_CUTAUDIO/START_POSITION_PARAMS_ERROR':
                    tip = "audio_starttime_error";
                    break;
                case 'VIDEOEDITOR_CUTAUDIO/CUT_TIME_PARAMS_ERROR':
                    tip = "audio_cuttime_error";
                    break; 
                case 'VIDEOEDITOR_CUTAUDIO/DOWNLOAD_NDR_FILE_ERROR':
                    tip = "audio_file_error";
                    break;  
                case 'VIDEOEDITOR_CUTAUDIO/FFMPEG_HANLDE_ERROR':
                    tip = "audio_hanlde_error";
                    break; 
                case 'VIDEOEDITOR_CUTAUDIO/FILE_NOT_EXISTS':
                    tip = "audio_cutnotexist_error";
                    break; 
                case 'VIDEOEDITOR_CUTAUDIO/FILE_SIZE_IS_ZERO':
                    tip = "audio_cutzero_error";
                    break; 
                 case 'VIDEOEDITOR_CUTAUDIO/UPLOAD_FILE_TO_NDR_ERROR':
                    tip = "audio_upload_error";
                    break;     
                    
                default:
                    break;                         
            }

            //alert(formatMessage({id: tip}));

            if (error) {error(formatMessage({id: tip}))}
        });
    }


    /**
     * 刷新波形区域区域
     */
    refreshRegion(start, end, resize){

        const {wavesurfer} = this.state;
        if (wavesurfer == null) return

        const {region} = this.state;  

        if (region !== null){
            this.destroyRegion();
        }
    
        this.createRegion(start, end, resize)  
    }

    /**
     * 创建波形区域区域
     */
    createRegion(start, end, resize){

        const {wavesurfer} = this.state;
        if (wavesurfer == null) return

        var region = wavesurfer.addRegion({
            start:start,
            end: end, //wavesurfer.getDuration().toFixed(2),
            color: 'rgba(207, 1, 0, 0.3)',
            resize: resize
        })

        this.setState({
            region : region
        })

        wavesurfer.enableDragSelection({
            color: 'rgba(207, 1, 0, 0.3)',
            loop: true
        });

        var region_count = 0;

        wavesurfer.on('region-created',  (region, e) => {
            // Limit to one region hacky way
            if (region_count >= 1) {
                region_count = 0;
                wavesurfer.clearRegions();
                //wavesurfer.addRegion(au_opt); 
            }

            this.setState({
                region: region,
                start: this.conversionTime(region.start),
                end: this.conversionTime(region.end)
            })

            region_count += 1;
        });

        wavesurfer.on('region-updated',  (region, e) => {
            // Limit to one region hacky way
  
            this.setState({
                start: this.conversionTime(region.start),
                end: this.conversionTime(region.end)
            })

        });
 
        // 当拖动或改变尺寸结束时触发
        wavesurfer.on('region-update-end',  (region) => {
            // Limit to one region hacky way
 
            this.setState({
                start: this.conversionTime(region.start),
                end: this.conversionTime(region.end)
            })

            this.dragPlayAudio(region);

        });

        // 被销毁
        wavesurfer.on('region-removed',  () => {    
        });

    }

    /**
     * 销毁波形图片区域
     */
    destroyRegion (){

        var {wavesurfer} = this.state;

        if (wavesurfer == null) return;

        wavesurfer.clearRegions();
    
    }

    /**
     * 重置音频
     */
    resetAudio (){

        const {wavesurfer} = this.state;

        this.setState({
            audioPlay : false,  
            start: 0.00,
            end: wavesurfer ? this.conversionTime(wavesurfer.getDuration()) : 0.01
        })

        if (wavesurfer != null){       
            wavesurfer.stop();
        }
    }


    /**
     * 切换预制长度裁剪音频模式
     */
    clickFixedAudio (){
        
        const {freeAudio} = this.state;

        if (!freeAudio) return;

        this.switchFixedAudio();
    }

    switchFixedAudio(){

        this.setState({
            freeAudio: false
        })

        this.resetAudio();

        //this.destroyRegion();

        const { audioSelector } = this.props;      
        const { remoteAudio } = audioSelector;
        const { wavesurfer } = this.state;

        if (wavesurfer === null) return;

        const start = 0.00;
        const time =  this.conversionTime(wavesurfer.getDuration());
        // 获取预设长度
        let length = remoteAudio.Property ? remoteAudio.Property.DefaultLength ? this.conversionTime(remoteAudio.Property.DefaultLength / 1000) : time : time;
        length = parseFloat(length);

        const end = Math.min(this.conversionTime(wavesurfer.getDuration()), this.conversionTime(length));

        this.setState({
            start: start,
            end: end
        });

        this.refreshRegion(start, end, false);
    }

    /**
     * 切换自由裁剪音频模式
     */
    clickFreeAudio (){

        const {freeAudio} = this.state;

        if (freeAudio) return;
        
        this.switchFreeAudio();
    }

    switchFreeAudio(){
        this.setState({
            freeAudio: true
        })

        //this.resetAudio(); 
        
        const {region} = this.state;  

        if (region === null) return;

        this.refreshRegion(region.start, region.end, true);
    }

    /**
     * 更改资源名称
     */
    changeAudioName(value) {

        const {Edbox} = window;
        const _this = this;

        Edbox.MMO.GetStrLen(value.target.value, (len)=>{
            if (len <= 32){
                _this.setState({
                    name : value.target.value
                })
            }
        })
        
    }

    render() {
        const {Edbox} = window;
        const { audioSelector } = this.props;
        const { remoteAudio, defAudio } = audioSelector;
        const {init, loading, start, end, step, maxTime, freeAudio, loadAuido, name, audioPlay} = this.state;
        const RadioButton = Radio.Button;
        const RadioGroup = Radio.Group;

        return (
        <div className="wrapper">
            {
                loading ? <Loading loading={true}/> : null
            }
            <div className="wrapper-border">
                <div className="page-wrap">
                <Header title={formatMessage({id: 'edit_audio'})}/>
                <div className="row">
                    <IconButton 
                        iconfont="icon-upload-audio" disabled={!loadAuido} toolTip={formatMessage({id: 'upload_local_audio'})} placement="bottomLeft"
                        onClick={this.handleLocalAudio.bind(this)}></IconButton>

                    <Link to="/Edbox_AudioSelector/audio_library">
                        <IconButton iconfont="icon-network-audio" disabled={!loadAuido} toolTip={formatMessage({id: 'select_online_audio'})} placement="bottomLeft"/>
                    </Link>
                    {
                        Edbox.Protocol === "https" ?
                        <Link to="/Edbox_AudioSelector/sound_recording">
                            <IconButton iconfont="icon-microphone1" disabled toolTip={formatMessage({id: 'record_audio'})}/>
                        </Link>
                        : null
                    }
                    <IconButton iconfont="icon-forbid-s-o" disabled={!loadAuido} toolTip={formatMessage({id: 'no_audio'})} onClick={this.handleNoAudio.bind(this)}/>
                </div>
                
                <Name className="row"   disabled={remoteAudio.GUID === ''}   defaultValue={
                    name === '' ? formatMessage({id: 'none'}) : name} value={remoteAudio.GUID === '' ? formatMessage({id: 'none'}) : name} onChange={this.changeAudioName.bind(this)} />
                {
                    !init || remoteAudio.GUID === '' ? null :
                    <div>
                    <div className="row">
                        <RadioGroup defaultValue={0} value={freeAudio ? 1 : 0} className={styles['cut-length']}>
                            <RadioButton value={0} disabled={!loadAuido} onClick={this.clickFixedAudio.bind(this)}>
                                <IconFont type="icon-fixed-length-cut"/>
                                {formatMessage({'id': 'preset_length'})}
                            </RadioButton>
                            <RadioButton value={1} disabled={!loadAuido} onClick={this.clickFreeAudio.bind(this)}>
                                <IconFont type="icon-free-length-cut" />
                                {formatMessage({'id': 'free_length'})}
                            </RadioButton>
                        </RadioGroup>
                    </div>
                    <div className="row">
                        <time className={styles['current-time']}>{ this.getTitleTotalTime(maxTime)}</time>
                        <div id="waveform" className={styles['waveform']} ref="waveform"></div>   
                        <div id="timeline" className={styles['timeline']}></div>            
                    </div>
                    <div className="row2">
                        <Row gutter={24}> {}
                            <Col span={12}>
                                <NumberInput name={formatMessage({id: 'start'})} defaultValue={0.00} step={step} value={start} min={0.00} max={end} disabled={!(freeAudio && loadAuido)} onChange={this.onStartChange.bind(this)}/>
                            </Col>
                            <Col span={12}>
                                <NumberInput name={formatMessage({id: 'end'})} defaultValue={0.01} step={step} value={end} min={start + 0.01} max={ maxTime} disabled={!(freeAudio && loadAuido)} onChange={this.onEndChange.bind(this)} /> 
                            </Col>
                        </Row>
                    </div>
                    <div className={`${styles['zoomer']} wave-zoomer row2`}>
                        { 
                            //<div className={styles['slider-main']} id="thumbwave"></div>
                            //<Slider className={styles['slider']} range defaultValue={[0, 100]}/>
                        }
                    </div>
                    <div className={`${styles['actions']} row2`}>
                        <Button className={styles['btn-play']}  disabled={!loadAuido} onClick={this.clickPlayAudio.bind(this)} >
                        {
                            <IconFont type= { audioPlay ? "icon-pause" : "icon-play" } className={styles['ico-play']} /> // 播放状态
                        }
                        </Button>             
                    </div>
                    </div> 
                }

                <div className="btm-btns">
                    <Button onClick={this.handleReset.bind(this)} disabled={remoteAudio.GUID === defAudio.GUID} 
                    >{formatMessage({ id: 'reset' })}</Button>
                    <Button type="primary" onClick={this.handleOK.bind(this)} className={styles['btn-reset']}>{formatMessage({id: 'ok'})} </Button>
                </div>           
            </div>           
            </div>
          
        </div>
        
        );
    }
}
export default EditAudio;