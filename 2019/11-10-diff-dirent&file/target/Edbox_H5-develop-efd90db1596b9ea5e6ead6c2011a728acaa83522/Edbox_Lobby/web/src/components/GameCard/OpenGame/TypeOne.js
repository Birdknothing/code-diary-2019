import React, { Component } from 'react';
import { connect } from 'dva'
import { Modal, message, Icon } from 'antd';
import { formatMessage } from 'umi/locale'
import styles from '../GameCard.scss'

const { Edbox } = window

@connect(({ lobby }) => ({
    lobby:lobby
}))
class TypeOne extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
            progress: 0,
            uninstallUrl: '',
            webGameUrl: '',
            visibleDownload: false,
            visibleIframe: false,
            iframeWidth: '',
            iframeHeight: '',
            ratio:1,
            jump: 'noJump'
        }
    }

    handleOpenGame = (e,id) =>{
        const { dispatch, lobby, title, statisticCategory } = this.props
        const { isLoading } = this.state
        const taskId =  Edbox.GetGUID()
        e.stopPropagation();
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
                playType: 3,
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
                    // console.log(data)
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
                            this.handleOkPlay();
                        }
                    })
                    const _this = this;
                    Edbox.LocationLoad = function(window, url, type){
                        // 设置URL变更时的处理方法
                         // 如果type = "Editor" 变成编辑器的样式
                        // 如果type = "Studio" 关闭子窗口
                        // console.log(["子窗口加载回调", window, url, type]);
                        if(type === 'Studio'){
                            _this.handleOkPlay();
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
            }
        })
        Edbox.DataStatistic.ClickEvent(statisticCategory === 'Detail' ? 'PlayRelatedGame':'PlayGame',statisticCategory,title)
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
    handleOk = (e) =>{
        e.stopPropagation();
        this.setState({
          visibleDownload: false,
          visibleIframe: false
        })
    }

    handleOkPlay = ()=>{
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

    componentWillUnmount(){
        clearInterval(this.progress);
        clearTimeout(this.reflash)
    }

    render() {
        const { id } = this.props
        const logo = require('@/assets/layout/logo.png')
        const { isLoading, progress, visibleDownload, visibleIframe, webGameUrl, iframeWidth, iframeHeight, jump } = this.state
        return (
            <div className={styles['btn-option']}>
                <span onClick={(e)=>this.handleOpenGame(e,id)} className={`${styles['play']} ${isLoading ? styles['loading'] : ''}`}>{isLoading? <Icon type="loading" style={{ fontSize: 12,position:'absolute',top:'50%',left:'5px',marginTop:'-5px' }} spin /> : ''}<span>{isLoading ? 'Loading' : formatMessage({id:'play'})}</span></span>
                <span style={{width: progress + '%'}} className={styles['progress']}></span>
                <Modal
                centered={true}
                cancelText={formatMessage({id:'cancel'})}
                okText={formatMessage({id:'feedback_confirm'})}
                title={formatMessage({id:'download'})}
                visible={visibleDownload}
                onOk={this.handleOkDownload}
                onCancel={this.handleOk}
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
            </div>
        );
    }
}

export default TypeOne;
