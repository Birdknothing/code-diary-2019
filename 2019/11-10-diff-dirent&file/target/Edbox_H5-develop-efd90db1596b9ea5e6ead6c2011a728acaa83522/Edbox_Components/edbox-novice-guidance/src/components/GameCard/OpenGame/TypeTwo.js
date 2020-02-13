import React, { Component } from 'react';
import { connect } from 'dva'
import { Modal, message, Icon } from 'antd';
import { formatMessage } from 'umi/locale'
import styles from '../GameCard.scss'

const { Edbox } = window

@connect(({ lobby }) => ({
    lobby:lobby
}))
class TypeTwo extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
            progress: 0,
            uninstallUrl: '',
            webGameUrl: '',
            returnTaskid: '',
            visibleDownload: false,
            visibleIframe: false,
            iframeWidth: '',
            iframeHeight: ''
        }
    }

    handleOpenGame = id =>{
        const { dispatch, lobby } = this.props
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
                playType: 1,
                version: '',
                taskId: taskId
            },
            callback:(data)=>{
                // console.log(data)
                dispatch({
                    type:'lobby/setPlayStatu',
                    payload:{
                        playStatu: lobby.playStatu + 1
                    }
                })
                if(data.data && data.data.error){
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
                    this.setState({
                        webGameUrl: data.Message.Url,
                        iframeWidth: data.Message.width + 'px',
                        iframeHeight: data.Message.height + 'px',
                        // iframeWidth: 750 + 'px',
                        // iframeHeight: 1334 + 'px',
                        visibleIframe: true,
                        isLoading: false,
                        progress:0
                    })
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



        // this.handleProgress()
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
                    console.log(data)
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

    componentWillUnmount(){
        clearInterval(this.progress);
    }

    render() {
        const { id } = this.props
        const { isLoading, progress, visibleDownload, visibleIframe, webGameUrl, iframeWidth, iframeHeight } = this.state
        return (
            <div className={`${styles['btn-option02']} ${isLoading ? styles['loading'] : ''}`}>
                <span onClick={()=>this.handleOpenGame(id)} className={`${styles['play02']} ${isLoading ? styles['loading'] : ''}`}>{isLoading? <Icon type="loading" style={{ fontSize: 12,position:'absolute',top:'50%',left:'5px',marginTop:'-5px' }} spin /> : ''}{isLoading ? 'Loading' : formatMessage({id:'play'})}</span>
                <span style={{width: progress + '%'}} className={styles['progress']}></span>
                <Modal
                title={formatMessage({id:'download'})}
                visible={visibleDownload}
                onOk={this.handleOkDownload}
                onCancel={this.handleOk}
                >
                <p>{formatMessage({id:'tips_noserver'})}</p>
                </Modal>
                <Modal
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
                className="iframeGame"
                >
                <iframe
                src={webGameUrl}
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

export default TypeTwo;
