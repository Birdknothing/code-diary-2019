import React, { Component, Fragment } from 'react';
import styles from './index.scss';
import { Row, Col,Icon, Button,  message, Modal, Input, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import logo from '@/assets/layout/logo.png';
import StepGuideModal from '@/components/StepGuideModal';
// import lobbyBaseUrl from '@/utils/lobbyBaseUrl';

const { Edbox } = window;

@connect(({global, edit, loading }) => ({
  global,
  edit,
  loading: loading.models.edit,
}))
class EditorHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: formatMessage({ id: 'save' }),
      visible: false,
      saveAsVisible: false,
      modelData: {
        title: undefined,
        tip: undefined,
        cancel: undefined,
        ok: undefined,
      },
      saveAsName: undefined,
      isNameRepeat: false,
      saveAsClick: true,
      saveClick: true,
      trailClick: true,
      feedbackVisible: false,
      gameModalVisible: false,
      gameModalDatas: {
        Url: undefined,
        Height: 0,
        Width: 0,
      },
      saveSuccessTipVisible: false, // 保存成功提示弹窗
    };
  }

  /**
   * 保存与另存为
   * @param {num} key 1-保存 2-另存为
   */
  handleMenuClick = e => {
    const setTime = () => {
      const thisHandler = this;
      const { edit = {} } = this.props;
      const { dataSource = {}, retryServer, hasError } = edit;
      if (hasError) {
        message.error(formatMessage({ id: 'has_error' }));
        return;
      }
      if (retryServer) {
        message.error(formatMessage({ id: 'tip_msg' }));
        return;
      }
      this.setState({
        text: e.item.props.children,
        saveClick: false,
      });

      const baseInfo = dataSource.Datas.filter(item => item.Name === 'BaseInfo');
      let gameName = !!baseInfo[0].Datas[0]
        ? baseInfo[0].Datas.filter(item => item.Name === 'GameName')
        : [0];

      try {
        if (e.key * 1 === 1) {
          // console.log('要保存的数据11111：', dataSource);
          Edbox.Editor.Save(
            dataSource,
            function(e) {
              message.success(formatMessage({ id: 'save_success' }));
              thisHandler.setState({
                saveClick: true,
              });
            },
            function(e) {
              message.error(e);
              thisHandler.setState({
                saveClick: true,
              });
            },
          );
        } else {
          if (!!gameName[0]) {
            const valueNum = gameName[0].Value.match(/[1-9]\d*$/);
            const value = !!valueNum
              ? gameName[0].Value.replace(/[1-9]\d*$/, valueNum[0] * 1 + 1)
              : gameName[0].Value + '1';
            this.setState({
              saveAsName: value,
              saveAsVisible: true,
              saveClick: true,
            });
          }
        }
      } catch (e) {
        message.error(e.message);
        this.setState({
          saveClick: true,
        });
      }
    };
    setTimeout(setTime, 200);
  };

  // 纯保存按钮
  saveButtonClick = () => {
    const setTime = () => {
      const thisHandler = this;
      const { edit = {} } = this.props;
      const { dataSource = {}, retryServer, hasError } = edit;
      if (hasError) {
        message.error(formatMessage({ id: 'has_error' }));
        return;
      }
      if (retryServer) {
        message.error(formatMessage({ id: 'tip_msg' }));
        return;
      }
      this.setState({
        saveClick: false,
      });

      try {
        // console.log('要保存的数据11111：', dataSource);
        Edbox.Editor.Save(
          dataSource,
          function(e) {
            // message.success(formatMessage({ id: 'save_success' }));

            thisHandler.setState({
              saveClick: true,
              saveSuccessTipVisible: true, // 保存成功弹窗提示
            });
            thisHandler.goToStep(15);
          },
          function(e) {
            message.error(e);
            thisHandler.setState({
              saveClick: true,
            });
          },
        );
      } catch (e) {
        message.error(e.message);
        this.setState({
          saveClick: true,
        });
      }
    };
    setTimeout(setTime, 200);
  };

  //返回首页
  backHandle = e => {
    this.setState({
      visible: true,
      modelData: {
        title: formatMessage({ id: 'model_title' }),
        tip: formatMessage({ id: 'model_tip' }),
        cancel: formatMessage({ id: 'model_cancel' }),
        ok: formatMessage({ id: 'model_save' }),
      },
    });
  };

  //试玩
  trialHandleClick = e => {
    const setTime = () => {
      const thisHandler = this;
      const { edit = {},dispatch } = this.props;
      const { dataSource = {}, retryServer, hasError } = edit;
      if (retryServer) {
        message.error(formatMessage({ id: 'tip_msg' }));
        return;
      }
      if (hasError) {
        message.error(formatMessage({ id: 'has_error' }));
        return;
      }

      this.setState({
        trailClick: false,
      });

      try {
        Edbox.Editor.Play(
          dataSource,
          function(e = {}) {
            const { Height, Url, Width } = e;
            const wW = (Width / document.body.offsetWidth) * 100;
            const wH = (Height / document.body.offsetWidth) * 100;
            thisHandler.setState({
              trailClick: true,
              gameModalVisible: true,
              gameModalDatas: {
                Height: wH > 80 ? '80' : wH,
                Url,
                Width: wW > 80 ? '80' : wW,
              },
            },()=>{
              dispatch({
                type: 'global/setStep',
                payload: {
                  activeStep: 1000,
                },
              });

              dispatch({
                type: 'global/setIsCanOpr',
                payload: {
                  isCanOpr: false,
                },
              });

            });
          },
          function(e) {
            thisHandler.setState({
              trailClick: true,
            });
            // console.log('出错0：',e);
            message.error(e);
          },
        );
      } catch (e) {
        message.error(e.message);
        console.log('出错：',e);
        this.setState({
          trailClick: true,
        });
      }
    };
    setTimeout(setTime, 200);
  };

  //返回弹窗
  hideModal = e => {
    Edbox.Editor.GotoHomePage();
    this.setState({
      visible: false,
    });
  };

  //返回确认
  saveClick = e => {
    const { edit = {} } = this.props;
    const { dataSource = {} } = edit;
    try {
      Edbox.Editor.Save(
        dataSource,
        function(e) {
          message.success(formatMessage({ id: 'save_success' }));
        },
        function(e) {
          message.error(e);
        },
      );
    } catch (e) {
      message.error(e.message);
    }

    this.setState({
      visible: false,
    });
  };

  //另存为弹窗隐藏
  hideNameModal = e => {
    this.setState({
      saveAsVisible: false,
      isNameRepeat: false,
    });
  };

  //另存为重名检索
  saveAsClick = e => {
    this.setState({
      saveAsClick: false,
    });
    const thisHandler = this;
    const { saveAsName } = this.state;
    const { edit = {}, dispatch } = this.props;
    const { dataSource = {}, currentData = {} } = edit;
    let saveAsDatas = JSON.parse(JSON.stringify(dataSource));
    const baseInfo = saveAsDatas.Datas.filter(item => item.Name === 'BaseInfo');
    let gameName = !!baseInfo[0].Datas[0]
      ? baseInfo[0].Datas.filter(item => item.Name === 'GameName')
      : [0];
    let gameCurrentName;
    if (!!gameName[0]) {
      gameName[0].Value = saveAsName;
    }
    Edbox.MMO.IsNameDuplicate(
      Edbox.GameId,
      1,
      saveAsName,
      2,
      success => {
        if (!success.is_duplicate) {
          // console.log('另存为的提交数据：', saveAsDatas);
          Edbox.Editor.SaveAs(
            saveAsDatas,
            function(e) {
              message.success(formatMessage({ id: 'save_as_success' }));
              thisHandler.setState({
                saveAsVisible: false,
                saveAsClick: true,
              });

              if (currentData.Name === 'BaseInfo') {
                gameCurrentName = !!currentData.Datas[0]
                  ? currentData.Datas.filter(item => item.Name === 'GameName')
                  : [0];
                gameCurrentName[0].Value = saveAsName;
              }

              dispatch({
                type: 'edit/updateData',
                payload: {
                  dataSource: saveAsDatas,
                  currentData: currentData,
                },
              });
            },
            function(e) {
              message.error(e);
              thisHandler.setState({
                saveAsClick: true,
              });
            },
          );
        } else {
          thisHandler.setState({
            isNameRepeat: true,
            saveAsClick: true,
          });
        }
      },
      error => {
        message.error(error);
      },
    );
  };

  //另存为输入重名检索
  saveAsNameChange = e => {
    const { value } = e.target;
    const thisHandler = this;
    this.setState({
      saveAsName: value,
    });
    Edbox.MMO.IsNameDuplicate(
      Edbox.GameId,
      1,
      value,
      2,
      success => {
        if (!success.is_duplicate) {
          thisHandler.setState({
            isNameRepeat: false,
          });
        } else {
          thisHandler.setState({
            isNameRepeat: true,
          });
        }
      },
      error => {
        message.error(error);
      },
    );
  };

  // 控制组件显隐
  handleCtrlVisble = (targetAttrStr, targeVal) => {
    this.setState({
      [targetAttrStr]: targeVal,
    });
  };

  //关闭试玩弹窗
  hideGameModal = () => {
    const {dispatch} =this.props;
    this.setState({
      gameModalVisible: false,
      gameModalDatas: {
        Url: undefined,
        Height: 0,
        Width: 0,
      },
    },()=>{
      dispatch({
        type: 'global/setStep',
        payload: {
          activeStep: 14,
        },
      });

      dispatch({
        type: 'global/setIsCanOpr',
        payload: {
          isCanOpr: false,
        },
      });
    });
  };

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

  // 返回大厅真正的我的游戏作品页面
  guideGoToRealLobbyMyWorks=()=>{
    const {dispatch} = this.props;
    // 通知父页面返回我的游戏
    window.parent.postMessage('clickGoToMyWork','*');
    // window.parent.parent.postMessage('clickGoToMyWork','*');
    this.setState({
      saveSuccessTipVisible: false,
    });
    dispatch({
      type: 'global/setStep',
      payload: {
        activeStep: -2,
      },
    });
    dispatch({
      type: 'global/setIsCanOpr',
      payload: {
        isCanOpr: false,
      },
    });


  }

  render() {
    const {
      visible,
      saveAsVisible,
      modelData,
      saveAsName,
      isNameRepeat,
      saveAsClick,
      trailClick,
      saveClick,
      gameModalVisible,
      gameModalDatas = {},
      saveSuccessTipVisible,
    } = this.state;
    const { Height, Url, Width } = gameModalDatas;
    const { edit = {} } = this.props;
    const { dataSource = {} } = edit;
    if (!dataSource.Datas || dataSource.Datas.length < 1) {
      return null;
    }
    const baseInfo = dataSource.Datas.filter(item => item.Name === 'BaseInfo');
    const { Datas = [] } = baseInfo[0];
    const gameName = Datas.length ? baseInfo[0].Datas.filter(item => item.Name === 'GameName') : '';

    return (
      <Fragment>
      {/* <div className={styles['simple-header']}>
        <h1 className={'logo'} onClick={()=>this.goToHome('/')}><img src={logo} alt=""/></h1>
        <Icon className={styles['btn-close']} type="close" />
      </div>
       */}
      <header className={styles.header}>
        <h2 className={styles.logo}>{gameName.length > 0 ? gameName[0].Value : undefined}</h2>
      <Button  className={styles.back} onClick={this.backHandle}><Icon type="left" />{formatMessage({id: 'return'})}</Button>
        <Row className={styles.handle}>
          <Col span={10}>
          {/* 新手引导-试玩16*/}
          <StepGuideModal
            isFixed
            placement="LT"
            popStyle={{top:'1px'}}
            step={13} // 16-3
            className={styles['btn-top-wrap']}
            title={formatMessage({ id: 'g_tip_game_try_play' })}
          >
            <Button className={styles.trial} onClick={this.trialHandleClick} disabled={!trailClick}>
              {formatMessage({ id: 'trial' })}
            </Button>
            </StepGuideModal>
          </Col>
          <Col span={10} offset={0.5}>
            {/*  荣泉说拿掉另存为
            <Dropdown overlay={menu} className={styles.save} disabled={!saveClick}>
              <Button type="primary" >
                {text} <Icon type="down" />
              </Button>
            </Dropdown>
             */}
             {/* 新手引导-保存17*/}
             <StepGuideModal
             isFixed
             placement="LT"
            popStyle={{top:'1px'}}
            step={14} // 17-3
            className={styles['btn-top-wrap']}
            title={formatMessage({ id: 'g_tip_game_save' })}
             >
              <Button type="primary" onClick={this.saveButtonClick} disabled={!saveClick}>
                {formatMessage({ id: 'save' })}
              </Button>
            </StepGuideModal>
          </Col>
          <Col span={4}>
            <Popover
              placement="bottom"
              mouseEnterDelay={0.4}
              content={formatMessage({ id: 'lobby_suggest_feedback' })}
            >
              <span
                className={styles[`ico-msg`]}
                onClick={() => this.handleCtrlVisble('feedbackVisible', true)}
              />
            </Popover>
          </Col>
        </Row>
        {/*<Icon type="question-circle" className={styles.icon} />*/}
        <Modal
          title={modelData.title}
          centered
          visible={visible}
          onOk={this.saveClick}
          onCancel={this.hideModal}
          okText={modelData.ok}
          cancelText={modelData.cancel}
          className="model_style no-after-modal"
          width={400}
        >
          <p>{modelData.tip}</p>
        </Modal>

        {saveAsVisible ? (
          <Modal
            title={formatMessage({ id: 'saveAs' })}
            visible={this.state.saveAsVisible}
            onOk={this.saveAsClick}
            onCancel={this.hideNameModal}
            okText={formatMessage({ id: 'model_save' })}
            cancelText={formatMessage({ id: 'model_cancel' })}
            okButtonProps={{ disabled: !saveAsClick }}
            centered
            className="model_style no-after-modal"
          >
            <Row>
              <Col span={5}>
                <p className={styles.gameName}>{formatMessage({ id: 'game_name' })}</p>
              </Col>
              <Col span={19}>
                <Input
                  placeholder="Basic usage"
                  defaultValue={saveAsName}
                  onChange={this.saveAsNameChange}
                />
                {isNameRepeat ? (
                  <span className={styles.errorText}>
                    {' '}
                    “{saveAsName}” {formatMessage({ id: 'name_repeat' })}
                  </span>
                ) : null}
              </Col>
            </Row>
          </Modal>
        ) : null}
        <Modal
          title=""
          visible={gameModalVisible}
          onOk={this.saveAsClick}
          onCancel={this.hideGameModal}
          centered
          className="game-trail-iframe no-after-modal"
          footer={null}
          width={Width === 0 ? '80%' : Width + '%'}
          height={Height === 0 ? '80%' : Height + '%'}
        >
          <iframe src={Url} frameBorder="0" title="game" width="100%" height="100%" />
        </Modal>
        {/* 新手引导-保存成功确认18*/}
        <Modal
        title={formatMessage({id:'g_tip_tip_tit'})}
        visible={saveSuccessTipVisible}
        centered
        mask={false}
        width={286}
        closable={false}
        className={styles['save-success-tip-modal']}
        footer={
          [<StepGuideModal
            isFixed
            isNeedModal={false}
            step={15} // 18-3
            className={styles['btn-wrap']}
            title=''
            key="btn-sure-wrap"
            >
            <Button type="primary"  onClick={this.guideGoToRealLobbyMyWorks} >
                {formatMessage({ id: 'ok' })}
            </Button>
            </StepGuideModal>,]
        }
      >
        <p className={styles['tip-txt']}> {formatMessage({ id: 'g_tip_game_save_success_tip' })}</p>
      </Modal>
      </header>
      </Fragment>
    );
  }
}

export default EditorHeader;
