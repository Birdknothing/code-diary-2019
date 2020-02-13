import React, { Component } from 'react';
import { connect } from 'dva'
import { message, Modal } from 'antd';
import { formatMessage } from 'umi/locale'

const { Edbox } = window
@connect(({ lobby }) => ({
    lobby: lobby
}))
class ExportGame extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
            progress: 0,
            visibleDownload: false
        }
    }

    handleExport = () =>{
        const { dispatch, type, appId, icon, accessType, gameName, isEnable } = this.props
        const { isLoading } = this.state
        const taskId =  Edbox.GetGUID()
        if(isLoading){
            return
        }
        if(isEnable === 2){
            message.info(formatMessage({id:'export_tips_error'}))
            return
        }
        this.setState({
            isLoading: true
        },()=>{
            this.handleProgress(taskId)
        })
        const api = type === 'exe' ? 'lobby/exportExeGame' : 'lobby/exportApk'
        dispatch({
            type:api,
            payload:{
                taskId: taskId,  //任务id
                appId: appId, //作品id
                icon: icon,  //作品图标资源guid
                accessType: accessType, //我的作品2，体验区3
                gameName: gameName //作品名称
            },
            callback:(data)=>{
                console.log(data,'11111')
                if(data.data && data.data.content.Code === 'UNINSTALL'){
                    clearInterval(this.progress);
                    this.setState({
                        uninstallUrl: data.data.content.Message,
                        visibleDownload: true,
                        isLoading: false,
                        progress:0
                    })
                }
                if(data.Code && data.Code ==='SUCCESS'){
                    message.success(formatMessage({id:'export_success'}))
                    this.setState({
                        isLoading: false,
                        progress:0
                    })
                    clearInterval(this.progress);
                }

                if(data.Code && data.Code !== 'SUCCESS'){
                    if(data.Message !== '' && data.Code !== 'CANCEL'){
                        message.info(data.Message)
                    }
                    this.setState({
                        isLoading: false,
                        progress:0
                    })
                    clearInterval(this.progress);
                }
                if(data.data && data.data.content.Code !== 'UNINSTALL'){
                    if(data.data.content.Message && data.data.content.Message !== ''){
                        message.info(data.data.content.Message)
                    }
                    this.setState({
                        isLoading: false,
                        progress:0
                    })
                    clearInterval(this.progress);
                }
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
                    // console.log('进度：',data,'===taskId:',id)
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

    componentWillUnmount(){
        clearInterval(this.progress);
    }

    handleOk = (e) =>{
        e.stopPropagation();
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

    render() {
        const { txt } = this.props
        const { isLoading, progress, visibleDownload } = this.state
        return (
            <div className={'export-btn'} onClick={this.handleExport}>
            {/* <div className={'export-btn'}> */}
                <span>{txt}</span>
                {
                    isLoading ?
                    <div className={'export-progress'}>
                        <div  style={{width: progress + '%'}} className={'export-span'}></div>
                    </div>
                    :null
                }
                <Modal
                cancelText={formatMessage({id:'cancel'})}
                okText={formatMessage({id:'feedback_confirm'})}
                title={formatMessage({id:'download'})}
                visible={visibleDownload}
                onOk={this.handleOkDownload}
                onCancel={this.handleOk}
                >
                <p>{formatMessage({id:'tips_noserver'})}</p>
                </Modal>
            </div>
        );
    }
}

export default ExportGame;
