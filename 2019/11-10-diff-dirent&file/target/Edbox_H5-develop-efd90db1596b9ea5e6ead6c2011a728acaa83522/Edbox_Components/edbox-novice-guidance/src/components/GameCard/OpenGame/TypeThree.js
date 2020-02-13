import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, message, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../GameCard.scss';
import { stringify } from 'qs';
import logo from '@/assets/layout/logo.png';
import StepGuideModal from '@/components/StepGuideModal';

const { Edbox } = window;

@connect(({ global,edit,lobby }) => ({
  global,
  edit,
  lobby: lobby,
}))
class TypeThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      progress: 0,
      uninstallUrl: '',
      webGameUrl: '',
      returnTaskid: '',
      visibleDownload: false,
      visibleIframe: false,
      iframeWidth: '',
      iframeHeight: '',
    };
  }

  handleOpenGame = (id, ver) => {
    const { dispatch } = this.props;
    const { isLoading } = this.state;
    const taskId = Edbox.GetGUID();
    if (isLoading) {
      return;
    }
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.handleProgress(taskId);
      },
    );
    dispatch({
      type: 'lobby/openEditor',
      payload: {
        appid: id,
        accessType: 1,
        version: ver,
        taskId: taskId,
      },
      callback: data => {
        // console.log(data,123123)
        if (data.data && data.data.error) {
          this.setState({
            isLoading: false,
            progress: 0,
          });
          message.info(formatMessage({ id: 'open_failed' }));
          clearInterval(this.progress);
        }
        if (data.data && data.data.content.Code === 'UNINSTALL') {
          clearInterval(this.progress);
          this.setState({
            uninstallUrl: data.data.content.Message,
            visibleDownload: true,
            isLoading: false,
            progress: 0,
          });
        }
        if (data.Code && data.Code === 'WEBGAME') {
          console.log(data.Message.Url, 44444);
          clearInterval(this.progress);
          this.setState(
            {
              webGameUrl: data.Message.Url,
              iframeWidth: 80 + '%',
              iframeHeight: 80 + '%',
              visibleIframe: true,
              isLoading: false,
              progress: 0,
            },
            () => {
              this.timer = setTimeout(() => {
                console.log('监听。。。');
                this.messageHandler();
              }, 500);
            },
          );
        }
        if (data.Code === 'SUCCESS') {
          this.setState({
            isLoading: false,
            progress: 0,
          });
          clearInterval(this.progress);
        }
      },
    });

    // this.handleProgress()
  };

  handleProgress = id => {
    const { dispatch } = this.props;
    this.progress = setInterval(() => {
      const { progress } = this.state;
      dispatch({
        type: 'lobby/getProgress',
        payload: {
          TaskId: id,
        },
        callback: data => {
          // console.log(data)
          if (progress < 100) {
            this.setState(prevState => ({
              progress: data,
            }));
          } else {
            this.setState({
              isLoading: false,
              progress: 0,
            });
            clearInterval(this.progress);
          }
        },
      });
    }, 500);
  };
  handleOk = () => {
    const { dispatch, lobby } = this.props;
    this.setState({
      visibleDownload: false,
      visibleIframe: false,
    });
    dispatch({
      type: 'lobby/setEditStatu',
      payload: {
        editStatu: lobby.editStatu + 1,
      },
    });
    clearTimeout(this.timer);
  };
  handleOkDownload = () => {
    const { uninstallUrl } = this.state;
    window.open(uninstallUrl);
    this.setState({
      visibleDownload: false,
    });
  };

  messageHandler = () => {
    Edbox.Message.AddMessageHandler('EditorExit', data => {
      console.log('通信=========：', data);
    });
  };

  componentWillUnmount() {
    clearInterval(this.progress);
    clearTimeout(this.timer);
  }

// 去往某步
goToStep = (val) => {
  const { dispatch } = this.props;
  dispatch({
    type: 'global/setStep',
    payload: {
      activeStep:val,
    },
  });
  dispatch({
    type: 'global/setIsCanOpr',
    payload: {
      isCanOpr: false,
    },
  });
};

  // 引导页-前往编辑器
  guideGoToEditor=()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'edit/getDataGameId',
      callback: data=>{
        this.goToStep(3);
        const goToBaseUrl = window.location.href.split('#')[0];
        this.setState({
          // webGameUrl: window.location.protocol+'//'+window.location.host+'/?'+stringify(data)+'#/Editor/BaseInfo',
          // webGameUrl: Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), goToBaseUrl+'?'+stringify(data)+'#/Editor/BaseInfo'),
          webGameUrl: Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), goToBaseUrl+'#/Editor/BaseInfo'),
          iframeWidth: 100 + '%',
          iframeHeight: 100 + '%',
          visibleIframe: true,
          isLoading: false,
          progress: 100,
        });
        // router.push({
        //   pathname:'/Editor/BaseInfo',
        //   query:data,
        // });
      }
    });

  }

  render() {
    const { id, ver, data } = this.props;
    const {
      isLoading,
      progress,
      visibleDownload,
      visibleIframe,
      webGameUrl,
      iframeWidth,
      iframeHeight,
    } = this.state;
    return (
      <div className={styles['btn-option']}>
        {/* 创作游戏按钮-新手引导2 */}
        {data && data.isFixed ? (
          <StepGuideModal
            isFixed
            step={2}
            placement="TL"
            width={246}
            className={styles.bot}
            title={formatMessage({ id: 'g_tip_click_creat' })}
            popStyle={{marginLeft:'20px',marginBottom:'6px'}}
          >
            <span
              onClick={this.guideGoToEditor}
              className={`${styles['creat']} ${isLoading ? styles['loading'] : ''}`}
            >
              {isLoading ? (
                <Icon
                  type="loading"
                  style={{
                    fontSize: 12,
                    position: 'absolute',
                    top: '50%',
                    left: '5px',
                    marginTop: '-5px',
                  }}
                  spin
                />
              ) : (
                ''
              )}
              {isLoading ? 'Loading' : formatMessage({ id: 'creat' })}
            </span>
          </StepGuideModal>
        ) : (
          <span
            onClick={() => this.handleOpenGame(id, ver)}
            className={`${styles['creat']} ${isLoading ? styles['loading'] : ''}`}
          >
            {isLoading ? (
              <Icon
                type="loading"
                style={{
                  fontSize: 12,
                  position: 'absolute',
                  top: '50%',
                  left: '5px',
                  marginTop: '-5px',
                }}
                spin
              />
            ) : (
              ''
            )}
            {isLoading ? 'Loading' : formatMessage({ id: 'creat' })}
          </span>
        )}
        <span style={{ width: progress + '%' }} className={styles['progress']} />
        <Modal
          cancelText={formatMessage({ id: 'cancel' })}
          okText={formatMessage({ id: 'feedback_confirm' })}
          title={formatMessage({ id: 'download' })}
          visible={visibleDownload}
          onOk={this.handleOkDownload}
          onCancel={this.handleOk}
        >
          <p>{formatMessage({ id: 'tips_noserver' })}</p>
        </Modal>
        <Modal
          centered={true}
          maskClosable={false}
          visible={visibleIframe}
          onOk={this.handleOk}
          // onCancel={this.handleOk}
          destroyOnClose={true}
          footer={null}
          width={iframeWidth}
          style={{
            height: iframeHeight,
          }}
          className="iframeEdit"
          title={<h1 className={'logo'}><img src={logo} alt=""/></h1>}
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

export default TypeThree;
