import React, { Component } from 'react';
import { connect } from 'dva'
import { Modal, message, Icon } from 'antd';
import { formatMessage } from 'umi/locale'
import styles from '../GameCard.scss'

const { Edbox } = window

@connect(({ lobby }) => ({
    lobby:lobby
}))
class TypeThree extends Component {
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

    handleOpenGame = (id,ver,e) =>{
        const { dispatch, title, statisticCategory } = this.props
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
            type:'lobby/openEditor',
            payload:{
                appid: id,
                accessType: 1,
                version: ver,
                taskId: taskId
            },
            callback:(data)=>{
                // console.log(data,123123)
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
                    // console.log(data.Message.Url,44444)
                    clearInterval(this.progress);
                    this.setState({
                        webGameUrl: data.Message.Url,
                        iframeWidth: 100 + '%',
                        iframeHeight: 100 + '%',
                        visibleIframe: true,
                        isLoading: false,
                        progress:0
                    },()=>{
                        dispatch({
                            type:'lobby/listenEditorExit',
                            payload:{},
                            callback:(data)=>{
                                console.log(data,333333333)
                                if(data.data && data.data.error){
                                    return
                                }
                                console.log('关闭编辑器')
                                this.handleOk();
                            }
                        })
                    })
                }
                if(data.Code === "SUCCESS"){
                  e.stopPropagation();
                  // 设置当前打开的是unity编辑器
                  dispatch({
                    type:'lobby/setIsOpenUnityEditor',
                    payload:{isOpenUnityEditor: true},
                  });
                    this.setState({
                        isLoading: false,
                        progress:0
                    })
                    clearInterval(this.progress);
                }
            }
        })
        Edbox.DataStatistic.ClickEvent('CreateGame',statisticCategory,title)
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
        const { dispatch, lobby } = this.props
        this.setState({
          visibleDownload: false,
          visibleIframe: false
        })
        dispatch({
            type:'lobby/setEditStatu',
            payload:{
                editStatu: lobby.editStatu + 1
            }
        })
        Edbox.DataStatistic.EditExit();
        Edbox.DataStatistic.ClickEvent('CloseEditor','Editor','')
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
        const { id, ver } = this.props
        const logo = require('@/assets/layout/logo.png')
        const { isLoading, progress, visibleDownload, visibleIframe, webGameUrl, iframeWidth, iframeHeight } = this.state
        return (
            <div className={styles['btn-option']}>
                <span onClick={(e)=>this.handleOpenGame(id,ver,e)} className={`${styles['creat']} ${isLoading ? styles['loading'] : ''}`}>{isLoading? <Icon type="loading" style={{ fontSize: 12,position:'absolute',top:'50%',left:'5px',marginTop:'-5px' }} spin /> : ''}{isLoading ? 'Loading' : formatMessage({id:'creat'})}</span>
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
                title={<h1 className={'logo'}><img src={logo} alt=""/></h1>}
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
                className="iframeEdit"
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

export default TypeThree;
