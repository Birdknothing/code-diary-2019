import React, {Component} from 'react';
import {formatMessage}  from 'umi/locale';
import { RouteContext } from 'react-router'
import {Button, Popover, message, Modal} from 'antd';
import IconFont from '@/components/iconfont';
import WaveSurfer from 'wavesurfer.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import Microphone from 'wavesurfer.js/dist/plugin/wavesurfer.microphone';
import Swiper from 'swiper';
import Header from '@/components/header';
import Name from '@/components/name';
import Loading from '@/components/loading';
import 'swiper/dist/css/swiper.css';
import '@/common.scss';
import router from 'umi/router';
import styles from './index.scss';
import { connect } from 'dva';
import { func } from 'prop-types';


@connect(({ audioSelector }) => ({
    audioSelector
}))


class SoundRecording extends Component {
    constructor(props) {
        super(props);

        this.recData = null; // 录音音频数据
        this.state = {
            recorder:null,
            wavesurfer: null,
            swiper: null,
            name: 'voice_' + new Date().getTime(),
            currTime: 0,
            readyRecord: false, // 录音准备
            recSet: null,   // 录音数据集合
            loading: false,
            recState: 0, // 录音状态 0停止, 1播放, 2暂停
            audioState: 0, // 播放录音状态 0停止, 1播放,
            reclevel:0, // 录音音量等级 (0-100)
            audioEffect: [
                {
                    id: 1,
                    name: 'Monster',
                    image_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557974088&di=d9d619e8a467ff63313da93e64328e61&imgtype=jpg&er=1&src=http%3A%2F%2Fi1.sinaimg.cn%2Ftravel%2F2015%2F0518%2FU8888P704DT20150518165811.jpg'
                },
                {
                    id: 2,
                    name: 'Men',
                    image_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557974088&di=d9d619e8a467ff63313da93e64328e61&imgtype=jpg&er=1&src=http%3A%2F%2Fi1.sinaimg.cn%2Ftravel%2F2015%2F0518%2FU8888P704DT20150518165811.jpg'
                },
                {
                    id: 3,
                    name: 'Girl',
                    image_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557974088&di=d9d619e8a467ff63313da93e64328e61&imgtype=jpg&er=1&src=http%3A%2F%2Fi1.sinaimg.cn%2Ftravel%2F2015%2F0518%2FU8888P704DT20150518165811.jpg'
                },
                {
                    id: 4,
                    name: 'Dog',
                    image_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557974088&di=d9d619e8a467ff63313da93e64328e61&imgtype=jpg&er=1&src=http%3A%2F%2Fi1.sinaimg.cn%2Ftravel%2F2015%2F0518%2FU8888P704DT20150518165811.jpg'
                },
                {
                    id: 5,
                    name: 'Snow',
                    image_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557974088&di=d9d619e8a467ff63313da93e64328e61&imgtype=jpg&er=1&src=http%3A%2F%2Fi1.sinaimg.cn%2Ftravel%2F2015%2F0518%2FU8888P704DT20150518165811.jpg'
                },
                {
                    id: 6,
                    name: 'Other',
                    image_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557974088&di=d9d619e8a467ff63313da93e64328e61&imgtype=jpg&er=1&src=http%3A%2F%2Fi1.sinaimg.cn%2Ftravel%2F2015%2F0518%2FU8888P704DT20150518165811.jpg'
                }
            ]
        }
    }
    componentDidMount() {
        const { Edbox } = window;
        const _this = this;

        // 监听编辑器保存事件
        Edbox.Message.AddMessageHandler("EditSave", function (datas, com) {
            _this.stopHandle();
        });

        // 监听编辑器停止播放
        Edbox.Message.AddMessageHandler("StopAudio", function (datas, com) {       
            _this.stopHandle();
        });

        this.recorderInit();      
        //this.swiperInit();
    }

    // 停止录音操作
    stopHandle(){
        const { recState,  audioState} = this.state;

        if (recState === 1){
            this.pauseRecord();
            return;
        }
    
        if (recState === 0 && audioState === 1){
            this.stopAudio();
            return;
        }
    }

    
    componentWillUnmount(){
        const {wavesurfer} = this.state;

        if (wavesurfer !== null) {
            wavesurfer.destroy();
        }
    }
    

    recorderInit() {
        var type = "mp3";
        var bit = 16;
        var sample = 16000;

        const { Recorder } = window;

        const _this = this;

        var rec = Recorder({
            type: type,
            bitRate: bit,
            sampleRate: sample,
            
            // 录音时长计算
            onProcess: function (buffers, level, time, sampleRate) {

                const  rectime = Math.floor(time/1000)
                _this.setState({
                    reclevel : level,
                    currTime: rectime
                })
                
                // 大于十分钟, 则停止录音 
                if (rectime >= 600){
                    _this.stopRecord();
                    // 弹出提示
                    Modal.warning({
                        title: formatMessage({id: 'tips'}),
                        content: formatMessage({id: 'limit_audio_recording'})
                    });     
                }
            }
        });
        rec.open(function () {

            _this.setState({
                readyRecord: true,
                recorder: rec
            })

            _this.refWavRecord();
            //record.State = "Recording";
        }, function (e, isUserNotAllow) {
            //record.SupportHint = (isUserNotAllow ? "UserNotAllow，" : "") + "打开失败：" + e;
            //record.Start();
            return;
        });

        this.setState({
            recorder : rec
        })
    }

    /**
     * 刷新音频录音
     */
    refWavRecord() {

        let {wavesurfer} = this.state;

        if (wavesurfer){
            wavesurfer.destroyAllPlugins();
            wavesurfer.destroy();
        }
        
        let wave = WaveSurfer.create({

            container: '#waveform',
            cursorColor: '#ff0000',
            cursorWidth: 0,
            barWidth: 2, 
            waveColor: '#ccc',
            progressColor: '#ccc',     
            hideScrollbar: true,

            plugins: [
                Microphone.create()
            ]
        });

        const _this = this;
        
        wave.microphone.on('deviceReady', function(stream) {
            console.log('Device ready!', stream);

            _this.setState({
                readyRecord: true
            })
        });

        wave.microphone.on('deviceError', function(code) {
            console.warn('Device error: ' + code);

            _this.setState({
                readyRecord: false
            })
        }); 
        
          
        this.setState({
            wavesurfer: wave
        })

        return wave;
    }


    /**
     * 开始录音
     */
    clickPlayRecord() {

        const {wavesurfer, recState, recorder, readyRecord} = this.state;

        if (!readyRecord) return;

        if (recState === 0){ 

            const wave = this.refWavRecord();
    
            recorder.open(function () {
    
                recorder.start();
                wave.microphone.start();     

            }, function (e, isUserNotAllow) {

                return;
            });


            this.setState({
                recState : 1,
                audioState : 1
            })    
        }
        else if(recState === 2){
            wavesurfer.microphone.play();
            recorder.resume();

            this.setState({
                recState : 1,
                audioState : 1
            })    
        }
        else {
            this.pauseRecord();
        }    
    }

    /**
     * 暂停录音
     */
    pauseRecord(){
        const {wavesurfer, recorder} = this.state;

        wavesurfer.microphone.pause();
        recorder.pause();

        this.setState({
            recState : 2
        })

    }

    /**
     * 停止录音
     */
    stopRecord(callback) {

        var {wavesurfer, recorder} = this.state;
        var {Edbox} = window;
        var _this = this;

        recorder.stop(function (blob, time) {
            Edbox.NDR.BlobToBase64(blob, function (datas) {

                _this.recData = datas

                if (callback){
                    callback(datas);
                }

                recorder.close();

                _this.refWaveSuffer();

            });

            _this.setState({
                recSet : recorder.set
            })

            recorder.close();

        }, function (s) {
            console.log("失败：" + s);
        });

        if (wavesurfer.microphone.active) {
            wavesurfer.microphone.stop();

            _this.setState({
                recState : 0
            })
        }
    }
    
    /**
     * 停止录音 开始播放声音
     */
    playAudio(){

        var {wavesurfer} = this.state;

        if (wavesurfer){

            wavesurfer.play();  
            this.setState({
                recState: 0,
                audioState: 1
            })
        }
    }

    /**
     * 刷新播放的音频数据
     */
    refWaveSuffer(){

        let {wavesurfer} = this.state;
        
        if (wavesurfer){
            wavesurfer.destroyAllPlugins();
            wavesurfer.destroy();
        }

        let wave = WaveSurfer.create({

            container: '#waveform',
            cursorColor: '#ff0000',
            cursorWidth: 2,
            waveColor: '#ccc', 
            interact : false,
            plugins: [
                this.timelineInit()
            ]
        }); 
        
        wave.load(this.recData);

        this.setState({
            wavesurfer: wave
        });

        wave.on('ready', () => {                          
            this.setState({
                recState : 0,
                audioState : 0
            })
            wave.initPlugin('timeline');

        });

        wave.on('finish', () => {                               
            this.setState({
                recState : 0,
                audioState : 0
            })

            wave.setCurrentTime(0);
        }); 
        
    }

    /**
     * 
     */
    stopAudio(){
        var {wavesurfer} = this.state;
        
        this.setState({
            recState : 0,
            audioState : 0
        })
     
        wavesurfer.stop();
    }

    /**
     * 停止播放声音/播放声音
     */
    clickPlayAudio() {

        let {audioState, recState, wavesurfer, readyRecord} = this.state;

        if (!readyRecord) return;
        
        // 音频停止
        if (audioState === 0){

            if (recState === 1){
                wavesurfer.unAll();
                // 录音中 结束录音
                this.stopRecord((datas)=>{
                    this.setState({
                        recState : 0,
                        audioState : 0
                    })
                });
            }
            else {
                // 录音已经结束结束
                if (wavesurfer.microphone && wavesurfer.microphone.active)
                    this.stopRecord((datas)=>{
                        this.playAudio(datas);
                    });
                else{
                    if (this.recData){
                        this.playAudio(this.recData);
                    }
                }
            } 
        }
        // 音频播放中
        else {
            const microphone = wavesurfer.microphone;
            if (microphone && microphone.active){
                    this.stopRecord((datas)=>{  
                        this.stopAudio();                       
                });
            }
            else{
                this.stopAudio();
            }
        }
    }
    
    /**
     * 重置录音
     */
    clickResetRecord() {

        const {wavesurfer, recorder} = this.state;

        if (recorder){
            recorder.stop();
        }

        if (wavesurfer){

            if ( wavesurfer.microphone){
                wavesurfer.microphone.stop();
                wavesurfer.microphone.stopDevice();
            }

            wavesurfer.destroy();

            this.setState({
                wavesurfer: null
            })
        }

        this.setState({
            recState : 0,
            currTime : 0,
            audioState : 0
        });
    }

    /**
     * 修改名字
     */
    handleChangeName(value) {
        
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

    /**
     * 保存上传
     */
    clickSaveRecord() {

        const { wavesurfer} = this.state;
        
        if (!wavesurfer) return;

        const { recorder, recState, name} = this.state;
        const { Edbox } = window;
        const _this = this;
        var { dispatch } = this.props;
            
        // 还在录音操作中,停止录音并上传
        if (recState !== 0){
            this.stopRecord((datas)=>{
                this.PostToNDR(datas, null, (data)=>{

                    _this.setState({
                        loading : false
                    })
    
                    Edbox.MMO.SubStrLen(name, 32, (newName)=>{
        
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

                        router.push('/Edbox_AudioSelector');
                    })
                })
            })
        }
        else{
            if (wavesurfer.microphone){
                wavesurfer.microphone.stop();
                wavesurfer.microphone.stopDevice(); 
            }
            
            if (recorder){
                recorder.stop();
            }
    
            this.setState({
                recSet : 0,
                currTime: 0
            })
    
            this.PostToNDR(this.recData, null, (data)=>{
                _this.setState({
                    loading : false
                })

                Edbox.MMO.SubStrLen(name, 32, (newName)=>{
    
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

                    router.push('/Edbox_AudioSelector');
                })
            })
        }
        //wavesurfer.play();
    }

    /**
     * 上传录音
     */
    PostToNDR (datas, progress, success, error) {
        // 资源名称检查
        const {name} = this.state;

        const _this = this;

        if (datas === null) {
            datas = this.recData;
        }

        if (datas === null){
            message.error(formatMessage({id: 'empty_file_rec'}));
            return;
        }

        function NameCheck(success, error) {
            if (!name) {
                message.error(formatMessage({id: 'empty_file_name'}));
                return;
            }

            if(name.match(/[\\\/:*?"<>|#]/)){
                message.error(formatMessage({id: 'illegal_file_name'}));
                return;
            }

            if (success){
                success();
            }
        }
    
        NameCheck(function () {
            const {Edbox} = window;

            _this.setState({
                loading: true
            });

            Edbox.NDR.Post(datas, name, ()=>{}, (data)=>{
                if (success) {
                    _this.setState({
                        loading: false
                    });
                    success(data);
                }
            }, error);
        }, error);
    };

    /**
     * 时间线配置初始化
     */
    timelineInit() {

        function conversionTime(time){
            return Math.floor(Number(time) * 100) / 100;
        }

        let timeline = Timeline.create({
            container: '#timeline',
            notchPercentHeight: 40,
            unlabeledNotchColor: '#ccc',
            primaryColor: '#ccc',
            secondaryColor: '#ccc',
            primaryFontColor: '#666',
            secondaryFontColor: '#666',
            fontSize: 12,
            deferInit: true,
            timeInterval: (pxPerSec) => {
                let interval = conversionTime(1 / (pxPerSec / 20));
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
    };

    swiperInit() {
        const thumbSwiper = new Swiper('#thumbSwiper', {
            slidesPerView: 5,
            spaceBetween: 4,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true
        })
        new Swiper('#mainSwiper', {
            navigation: {
                nextEl: '#swiperBtnNext',
                prevEl: '#swiperBtnPrev'
            },
            thumbs: {
                swiper: thumbSwiper
            }
        });
        this.setState({
            swiper: thumbSwiper
        });
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
     * 时间线时间格式化
     * @param {int} seconds 当前秒数
     * @param {float} pxPerSec 每秒px数
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
        sec = (seconds % 60).toFixed(2);
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

    setAsyncRouteLeaveHook(router, route, hook) {
        let withinHook = false
        let finalResult = undefined
        let finalResultSet = false
        router.setRouteLeaveHook(route, nextLocation => {
          withinHook = true
          if (!finalResultSet) {
            hook(nextLocation).then(result => {
              finalResult = result
              finalResultSet = true
              if (!withinHook && nextLocation) {
                router.replace(nextLocation)
              }
            })
          }
          let result = finalResultSet ? finalResult : false
          withinHook = false
          finalResult = undefined
          finalResultSet = false
          return result
        })
      }
   
    goBack(){
        const {currTime} = this.state;

        this.stopHandle();

        if (Number(currTime) > 0.01 ){
            const { confirm } = Modal;
            confirm({
                title: formatMessage({id: 'tips'}),
                content: formatMessage({id: 'recording_not_saved_warning'}),
                okText: formatMessage({id: 'ok'}),
                cancelText: formatMessage({id: 'cancel'}),
                onOk() {
                    router.push('/Edbox_AudioSelector');
                },
                onCancel() {             
                }
            })
        }
        else{
            router.push('/Edbox_AudioSelector');
        }
        
    }

    render() {

        const {name, loading, currTime, readyRecord, recState, audioState, reclevel} = this.state;
        return (
            <div className="page-wrap">
                {
                    loading ? <Loading loading={true}/> : null
                }
                <div className={styles['header']}>
                    <IconFont type="icon-arrow-go-back-fill" className={styles['ico-back']} onClick={this.goBack.bind(this)}></IconFont>
                    <span>  {formatMessage({id: 'sound_recording'})}</span>
                
                </div>
                <Name className="row" defaultValue={name} value={name} onChange={this.handleChangeName.bind(this)}/>
                <div className="row2">
                    <time className={styles['current-time']}>{ this.getTitleTotalTime(currTime)}</time>
                    <div id="waveform" className={styles['waveform']}></div>
                    <div id="timeline" className={styles['timeline']}></div>
                </div>
                <div className={ readyRecord ? `${styles['actions']} `: `${styles['actions']} ${styles['disabled']}` }>
                    <span onClick={this.clickResetRecord.bind(this)}>
                        <IconFont type="icon-reload" className={`${styles['ico-reload']} ${styles['actions-ico']}`}/>
                    </span> 
                    <Button className= { `${styles['btn-record']}` } onClick={this.clickPlayRecord.bind(this)}>
                        {                                             
                            recState === 1 ?
                            <IconFont type="icon-pause" className={`${styles['ico-pause']} ${styles['actions-ico']}`}/> // 暂停状态
                            :
                            <IconFont type="icon-resume" className={`${styles['ico-resume']} ${styles['actions-ico']}`}/> // 继续录音 
                            // <IconFont type="icon-microphone" className={`${styles['ico-record']} ${styles['actions-ico']}`}/> // 录音状态                   
                        }
                        {
                            readyRecord ? null : 
                            <IconFont type="icon-forbid-s-o" className={`${styles['ico-forbid']} ${styles['actions-ico']}`}/>
                        }
                    </Button>
                    <span onClick={this.clickPlayAudio.bind(this)}>
                    {
                        Number(currTime) > 0.01 ?

                            recState === 1 || recState > 0 ?
                            <IconFont type="icon-stop" className={`${styles['ico-play']} ${styles['actions-ico']}`}/> // 停止状态
                            : 
                            audioState === 0 ? <IconFont type="icon-play" className={`${styles['ico-play']} ${styles['actions-ico']}`} /> // 播放状态 
                                            : 
                                            <IconFont type="icon-stop" className={`${styles['ico-play']} ${styles['actions-ico']}`}/> // 停止状态     
                        :  

                        <IconFont type="icon-stop" className={`${styles['ico-play']} ${styles['actions-ico']} ${styles['disabled']}`}/> // 停止状态

                    }
                     </span>         
                    {
                        // 检测是否满足录音条件
                        readyRecord ?  <p className={styles['warning-info']}></p> 
                        :
                        <p className={styles['warning-info']}>
                        {formatMessage({id: 'microphone_not_connetced'})}
                        <Popover placement="topLeft" content={formatMessage({id: 'check_microphone'}).split('<br>').map((str, i) => <span><span key={'rec'+i}>{str}</span><br/></span>)}>
                            <i>?</i>
                        </Popover>
                    </p>
                    }
                    {
                        reclevel < 1  && recState === 1 ? <p className={styles['record-tips']}>{formatMessage({id: 'speak_to_microphone'})}</p> :null
                    }
                </div>
                <div className="btm-btns">
                    <Button type="primary" disabled={!readyRecord} onClick={this.clickSaveRecord.bind(this)} className={styles['btn-ok']}>{formatMessage({'id': 'ok'})} </Button>
                </div>
            </div>
        )
    }
}
export default SoundRecording;