import React, { Component } from 'react';
import { connect } from 'dva'
import { message, Popover, Modal } from 'antd';
import { formatMessage } from 'umi/locale'
import styles from '../GameCard.scss'
import index from './index.scss'
import ProgressLoading from '../../progressLoading/index';

const { Edbox } = window
@connect(({ lobby }) => ({
    lobby: lobby
}))
class ExportTpl extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
            progress: 0,
            visibleDownload: false
        }
    }

    handleExport = () =>{
        const { dispatch, appId, icon, gameName } = this.props
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
            type:'lobby/exportEditor',
            payload:{
                taskId: taskId,
                appId: appId,
                icon: icon,
                gameName: gameName
            },
            callback:(data)=>{
                // console.log(data)
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
                    message.success(formatMessage({id:'export_success_editor'}))
                    this.setState({
                        isLoading: false,
                        progress:100
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
        const { isLoading, progress, visibleDownload } = this.state
        const content = (
            <div className={styles['export-option']}>
              <p onClick={this.handleExport}><span className={styles['icon-export']}></span>{formatMessage({id:'creat_export'})}</p>
            </div>
        );
        return (
            <div className={styles['export-tpl']}>
                <Popover overlayClassName={styles['export-pop']} placement="bottomRight" content={content} trigger="hover">
                <span className={styles['export-arrow']}></span>
                </Popover>
                {/* <Modal
                    title=""
                    centered
                    width={358}
                    visible={isLoading && progress>0}
                    maskStyle={{opacity:'0'}}
                    className={index['progress-modal']}
                    footer={null}
                    closable={false}
                >
                <p className={index['txt']}>{progress + '%'}</p>
                <div className={index['progress-wrap']}>
                    <div className={index['now-progress']} style={{width:`${progress}%`}}></div>
                </div>
                </Modal> */}
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
                {
                    isLoading && progress >0 ?
                    <ProgressLoading text={formatMessage({id:'export_edit_tem'})} percent={progress} type={0}/>
                    :
                    null
                }
            </div>
        );
    }
}

export default ExportTpl;