import React, { Component } from 'react';
import styles from './index.scss';
import { Row, Col,Icon, Button, Dropdown, Menu, message, Modal, Input, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import ProgressLoading from '@/components/ProgressLoading';
import QRCode from 'qrcode.react';
import { pauseAudios, retryServerPic } from '@/utils/helper'
import Iconfont from '@/components/Iconfont';

// 组件引入
import FeedBack from '../FeedBack/FeedBack';

const { Edbox } = window;
const { SubMenu } = Menu;

@connect(({ edit, loading }) => ({
  edit,
  loading: loading.models.edit,
}))



class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: formatMessage({id: 'save'}),
      visible: false,
      saveAsVisible: false,
      modelData: {
        title: undefined,
        tip: undefined,
        cancel: undefined,
        ok: undefined
      },
      modelCode: 1, // 0- 没有其它操作， 1- 为返回大厅， 2- 为未安装错误
      saveAsName: undefined,
      isNameRepeat: false,
      editErrorTxt: undefined,
      saveAsClick: true,
      saveClick: true,
      trailClick: true,
      feedbackVisible: false,
      gameModalVisible: false,
      LoadingVisible: false,
      loadingPercent: 0,
      loadingType: 0,
      loadingTxt: undefined,
      gameModalDatas: {
        Url: undefined,
        Height: 0,
        Width: 0
      },
      QrcodeVisible: false,
      QrcodeSrc: undefined,
      historyList: undefined,
      clickKey: undefined
    }
  }

  
  componentWillMount() {
    //历史纪录
    this.getHistoryList();
  }

  
  
  /**
   * 保存另存为等
   * @param {num} key 1-保存 2-另存为 3-导出当前模板 4-导出exe 5-导出apk 6-清空历史纪录
   */
  handleMenuClick = (e) => {
    const setTime = () => {
      const thisHandler = this;
      const { edit = {} } = this.props;
      const { dataSource ={}, retryServer, hasError } = edit;
      if(hasError) {
        message.error(formatMessage({id: 'has_error'}));
        return
      }
      if(retryServer) {
        message.error(formatMessage({ id: 'tip_msg' }));
        return
      }
      this.setState({
        saveClick: false,
        clickKey: {
          key : e.key*1
        }
      });
    
      const baseInfo = dataSource.Datas.filter(item => item.Name === 'BaseInfo');
      let gameName = baseInfo[0].Datas.length ?  baseInfo[0].Datas.filter(item => item.Name === 'GameName') : [0];
      const CoverImageGuid = baseInfo[0].Datas.length ?  baseInfo[0].Datas.filter(item => item.Name === 'CoverImage') : [0];
      const GameId = Edbox.GameId;
      try {
        switch(e.key*1) {
          case 1: 
            Edbox.Editor.Save(
              dataSource,
              function(e){
                if(e.length > 0) {
                  message.success(formatMessage({id: 'save_success'}));
                }
                thisHandler.setState({
                  saveClick: true,
                  LoadingPercent: 0,
                  LoadingVisible: false,
                  loadingType: 0,
                  loadingTxt: undefined
                })
              },
              function(e){
                if( e*1 !==0 ) {
                  message.error(e);
                }
                thisHandler.setState({
                  saveClick: true,
                  LoadingPercent: 0,
                  LoadingVisible: false,
                  loadingType: 0,
                  loadingTxt: undefined
                })
              },
              function(progress) {
                thisHandler.setState({
                  LoadingPercent: progress,
                  LoadingVisible: true,
                  loadingType: 1,
                  loadingTxt: formatMessage({id: 'loading_save'})
                })
              }
            );
          break;
          case 2:
            if(!!gameName[0]) {
              const valueNum = gameName[0].Value.match(/[1-9]\d*$/);
              const value = !!valueNum ?  gameName[0].Value.replace(/[1-9]\d*$/, valueNum[0]*1+1 ) : gameName[0].Value + '1';
              this.setState({
                saveAsName: value,
                saveAsVisible: true,
                saveClick: true
              })
            }
          break;
          case 3:
            thisHandler.exportGame("ExportEditor")
          break;
          case 4:
            thisHandler.exportGame("ExportExeGame", {gameName, CoverImageGuid, GameId})
          break;
          case 5:
            thisHandler.exportGame("ExportApk", {gameName, CoverImageGuid, GameId})
          break;
          case 6:
            thisHandler.setState({
              visible: true,
              modelCode: 3,
              saveClick: true,
              modelData: {
                title: formatMessage({id: 'clear_history'}),
                tip: formatMessage({id: 'clear_history_msg'}),
                cancel: formatMessage({id: 'model_cancel'}),
                ok: formatMessage({id: 'clear_history_btn'}),
              }
            })
          break;
          default:
            Edbox.Editor.OpenGameEditor(
              e.key,
              e.item.props.version,
              success => {
                thisHandler.setState({
                  saveClick: true
                })
              },
              error => {
                thisHandler.setState({
                  saveClick: true
                })
                message.error(error.toString())
              }
            )
        }
        // if(changeTxt) {
        //   this.setState({
        //     text: e.item.props.children
        //   });
        // }
      }
      catch(e) {
        message.error(e.message);
        this.setState({
          saveClick: true
        })
      }
    }
    setTimeout(setTime, 200)
  }

   /**
   *  uninstall时弹窗数据
   *  @param {Object} error 错误信息
   */
  errorTips = (error) => {
    const errorMsg = {
      UNINSTALL: formatMessage({id: 'tips_noserver'}),
      UNSAVE: formatMessage({id: 'unSave'}),
      CANCEL: formatMessage({id: 'export_cancel'})
    }
    this.setState({
      saveClick: true,
      visible: true,
      modelCode: error.Code !== "UNINSTALL"? 4 : 2,
      modelData: {
        title: formatMessage({id: 'tips'}),
        tip:  `${!!errorMsg[error.Code] ? errorMsg[error.Code]: formatMessage({id: 'export_error'})}`,
        cancel: formatMessage({id: 'model_cancel'}),
        ok: error.Code === "UNINSTALL" 
          ? <a href={error.Message} title="">{formatMessage({id: 'image_delete_ok'})}</a> : formatMessage({id: 'export_repeat'}),
      }, 
      LoadingVisible: false
    })
  }

  /**
   *  导出exe
   *  @param {Object} info 游戏信息  gameName-游戏名, CoverImageGuid-游戏封面Guid, GameId-游戏id
   */
  exportGame = (name, info={}) => {
    const { edit = {} } = this.props
    const { dataSource ={} } = edit
    const taskId = Edbox.GetGUID()
    const thisHandler = this
    let isError = false

    dataSource.taskId = taskId;
    if(name !== "ExportEditor") {
      dataSource.appId  = info.GameId;
      dataSource.icon  = info.CoverImageGuid.length ? info.CoverImageGuid[0].GUID : "";
      dataSource.gameName  = info.gameName.length ? info.gameName[0].Value : "";
    }
    Edbox.Editor[name](
      dataSource, 
      (success = {}) => {
        if(success.Code==="CANCEL") {
          thisHandler.errorTips(success);
        } else {
          if(name === "ExportApk") {
            thisHandler.setState({
              QrcodeVisible: true, 
              QrcodeSrc: success.Message,
            })
          }else {
            message.success(formatMessage({id: 'export_success'}));
          }
         
        }
        thisHandler.getProgress(taskId, true)
        thisHandler.setState({
          saveClick: true, 
          LoadingVisible: false
        })
        isError = true
      }, 
      error => {
        thisHandler.getProgress(taskId, true)
        thisHandler.errorTips(error)
        isError = true
      }
    );
    if(isError) return
    thisHandler.setState({
      LoadingVisible: true
    })
    thisHandler.getProgress(taskId, false)
  }

  /**
   *  轮询获取进度
   *  @param {String} id 游戏taskId
   *  @param {Boolean} isOver 是否成功导出
   * 
   */
  getProgress = (id, isOver) => {
    const thisHandler = this;
    const { LoadingVisible } = this.state;
    let num = 0;
    if(num >= 100 || isOver || !LoadingVisible) {
      clearTimeout(this.getProgressPercent)
      return //大于等于100时不执行
    } 
     Edbox.Editor.GetProgress(
      id, 
      success => {
        num = success
        thisHandler.setState({
          LoadingPercent: success
        })
        if( success < 100 ){
          thisHandler.getProgressPercent = setTimeout(()=> {thisHandler.getProgress(id)} ,100)
        }
      }, 
      error => {}
    );
  }

  //返回首页
  backHandle = e => {
    this.setState({
      visible: true,
      modelCode: 1,
      modelData: {
        title: formatMessage({id: 'model_title'}),
        tip: formatMessage({id: 'model_tip'}),
        cancel: formatMessage({id: 'model_cancel'}),
        ok: formatMessage({id: 'model_save'}),
      }
    });
  }

  //试玩
  trialHandleClick = e => {
    const isOffLine = retryServerPic();
    isOffLine.then(()=>{
      setTimeout(setTime, 200)
    }, ()=> {
      message.error(formatMessage({ id: 'tip_msg' })); 
    })
    const setTime = () => {
      const thisHandler = this;
      const { edit = {} } = this.props;
      const { dataSource ={}, retryServer, hasError } = edit;
      if(retryServer) {
        message.error(formatMessage({ id: 'tip_msg' }));
        return
      }
      if(hasError) {
        message.error(formatMessage({id: 'has_error'}));
        return
      }

      this.setState({
        trailClick: false
      })

    
      try {
        Edbox.Editor.Play(
          dataSource,
          function(e = {}){
            
            thisHandler.setState({
              trailClick: true,
              gameModalVisible: true,
            });
            thisHandler.trialSize(e, true);
            pauseAudios("all");
            Edbox.Message.Broadcast("StopAudio");
          },
          function(e){
            thisHandler.setState({
              trailClick: true
            })
            if( e*1 !==0 ) {
              message.error(e);
            }
          }
        )
      } catch(e) {
        message.error(e.message);
        this.setState({
          trailClick: true
        })
      }
    }
  }

  //试玩窗口大小设置
  trialSize = (e, isFirst) => {
    const defaultW = 1171 //默认最大宽
    const defaultH = 692 //默认最大高
    const defaultP = 86 //默认宽度比例
    const defaultT = 30 //默认上下高度
    const thisHandler = this
    let {Height, Url, Width } = e;
    let wW
    let wH
    Height = Height === 0 ? defaultH : Height
    Width =  Width === 0 ? defaultW : Width
    let w = Width > defaultW ? defaultW : Width;
    let h = w * Height / Width;
    const offsetW = document.body.offsetWidth
    const offsetH = document.body.offsetHeight
    if(isFirst) {
      const iframe =  document.getElementById("trialFrame"); 
      iframe.setAttribute('src', Url)
      Edbox.LocationLoad = function(window, url, type){
        if(type === "Editor") {
          iframe.setAttribute('src', "")
          thisHandler.setState({
            gameModalVisible:false,
            gameModalDatas: {
              Url: undefined,
              Height: 0,
              Width: 0
            }
          })
        }
      }
    }
    if( h > (offsetH-defaultT) ) {
      h = offsetH-defaultT
      w = h * Width / Height
    }
    wW = ( w / offsetW ) * 100;
    wH = ( h / offsetW ) * 100;
    this.setState({
      gameModalDatas: {
        Height : wW > defaultP ? (defaultP * Height / Width) : wH,
        Url,
        Width : wW > defaultP ? defaultP : wW,
      }
    })
    window.addEventListener('resize', this.trailSizeListener);
  }

  //监听试玩窗口大小
  trailSizeListener = () => {
    const {gameModalVisible} = this.state;
      const {gameModalDatas = {}} = this.state;
      const {Height, Url, Width} = gameModalDatas;
      this.trialSize({Height: 1200* (Height / Width), Url, Width: 1200 }, false)

    //关闭试玩时取消监听
    if(!gameModalVisible) {
      window.removeEventListener("resize", this.trailSizeListener);
    }
  }

  //返回弹窗
  hideModal = e => {

    if(e.target.type === "button") {
      const {modelCode} = this.state;
      if(modelCode === 1) {
        Edbox.Editor.GotoLobby();
      }
    }
    
    this.setState({
      'visible': false
    });
  }

  //返回确认
  saveClick = e => {
    const { edit = {} } = this.props;
    const { modelCode, clickKey } = this.state;
    const { dataSource ={}, retryServer, hasError } = edit;
    const thisHandler = this;
    switch (modelCode) {
      case 1: 
        try {
          if(hasError) {
            message.error(formatMessage({id: 'has_error'}));
            return
          }
          if(retryServer) {
            message.error(formatMessage({ id: 'tip_msg' }));
            return
          }
          Edbox.Editor.Save(
            dataSource,
            function(e){
              Edbox.Editor.GotoLobby();
              thisHandler.setState({
                LoadingPercent: 0,
                LoadingVisible: false,
                loadingType: 0,
                loadingTxt:undefined
              })
            },
            function(e){
              if( e*1 !==0 ) {
                message.error(e);
              }
            },
            function(progress) {
              thisHandler.setState({
                LoadingPercent: progress,
                LoadingVisible: true,
                loadingType: 1,
                loadingTxt: formatMessage({id: 'loading_save'})
              })
            }
          );

         
        }
        catch(e) {
          message.error(e.message);
        }
      break;
      case 2 :
        
      break;
      case 3 :
        Edbox.Editor.PostClearEditRecord( 
          success => {
            message.success(formatMessage({id: 'clear_history_success'}))
          },
          (error={}) => {
            message.error(error.Message);
          }
        );
      break;
      case 4 :
        this.handleMenuClick(clickKey);
      break;
      default: 
    }
    this.setState({
      'visible': false
    });

  }

  //另存为弹窗隐藏
  hideNameModal = e => {
    this.setState({
      saveAsVisible: false,
      editErrorTxt: "",
      isNameRepeat: false
    });
  }

  //另存为重名检索
  saveAsClick = e => {
    this.setState({
      saveAsClick: false
    })
    const thisHandler = this;
    const { saveAsName } = this.state;
    const { edit = {}, dispatch } = this.props;
    const { dataSource ={}, currentData = {} } = edit;
    let saveAsDatas = JSON.parse(JSON.stringify(dataSource));
    const baseInfo = saveAsDatas.Datas.filter(item => item.Name === 'BaseInfo');
    let gameName = !!baseInfo[0].Datas[0] ?  baseInfo[0].Datas.filter(item => item.Name === 'GameName') : [0];
    let gameCurrentName;
    const sensitiveText = formatMessage({ id: 'sensitive_text' });
    
    if(saveAsName.length > 0) {
      Edbox.Editor.IsSensitive(
        saveAsName,
        flag => {
          if (flag.is_sensitive) {
            thisHandler.setState({
              editErrorTxt: sensitiveText,
              saveAsClick: true
            })
          }else {

            Edbox.MMO.IsNameDuplicate(
              Edbox.GameId,
              1,
              saveAsName,
              2,
              success => {
                if(!!gameName[0]) {
                  gameName[0].Value = saveAsName;
                }
                Edbox.Message.Broadcast("Update",[gameName[0]]);
                if (!success.is_duplicate) {
                  
                  Edbox.Editor.SaveAs(
                    saveAsDatas,
                    function(e){
                      if(e.length > 0) {
                        message.success(formatMessage({id: 'save_as_success'}));
                      }
                      thisHandler.setState({
                        saveAsVisible: false,
                        saveAsClick: true,
                        editErrorTxt: "",
                        LoadingPercent: 0,
                        LoadingVisible: false,
                        loadingType: 0,
                        loadingTxt: undefined
                      });

                      if(currentData.Name === 'BaseInfo') {
                        gameCurrentName = !!currentData.Datas[0] ? currentData.Datas.filter(item => item.Name === 'GameName') : [0];
                        gameCurrentName[0].Value = saveAsName;
                      }

                      dispatch({
                        type: 'edit/updateData',
                        payload: {
                          dataSource: saveAsDatas,
                          currentData: currentData
                        }
                      });
                    },
                    function(e){
                      if( e*1 !==0 ) {
                        message.error(e);
                      }
                      thisHandler.setState({
                        saveAsClick: true,
                        LoadingPercent: 0,
                        LoadingVisible: false,
                        loadingType: 0,
                        loadingTxt: undefined
                      });
                    },
                    function(progress) {
                      thisHandler.setState({
                        saveAsVisible:false,
                        LoadingPercent: progress,
                        LoadingVisible: true,
                        loadingType: 1,
                        loadingTxt: formatMessage({id: 'loading_saveAs'})
                      })
                    }
                  );
                }else {
                  thisHandler.setState({
                    isNameRepeat: true,
                    editErrorTxt: saveAsName + formatMessage({id: 'name_repeat'}),
                    saveAsClick: true
                  })
                }
              },
              error => {
                thisHandler.setState({
                  saveAsClick: true
                });
                message.error(error);
              }
            );
          }
        }
      )
    }else {
      thisHandler.setState({
        editErrorTxt: formatMessage({ id: 'required_text' }),
        saveAsClick: true
      })
    }
  }

  //另存为输入重名检索
  saveAsNameChange = (e) => {
    const { value } = e.target;
    // const thisHandler = this;
    this.setState({
      saveAsName: value,
      editErrorTxt: ""
    });
    

  }

  // 控制组件显隐
  handleCtrlVisble=(targetAttrStr, targeVal) => {
    this.setState({
      [targetAttrStr]: targeVal,
    });
  };

  //关闭试玩弹窗
  hideGameModal = () => {
    this.setState({
      gameModalVisible:false,
      gameModalDatas: {
        Url: undefined,
        Height: 0,
        Width: 0
      }
    })
  }

  //隐藏二维码
  hideQrcode = () => {
    this.setState({
      QrcodeVisible:false,
      QrcodeSrc: undefined
    })
  }

  //打开帮助手册
  questionClick = () => {
    Edbox.EditorHelp.GoToHelp();
  }

  //发送到手机
  createQRcode = () => {
    this.setState({
      codeVisible:true
    })
  }

  //获取历史纪录
  getHistoryList = () => {
    const thisHandler = this;
    Edbox.Editor.GetEditRecordInfo(
      1,
      5,
      success => {
        thisHandler.setState({
          historyList: success.apps
        })
      },
      error => {
        console.log(error)
      }
    )
  }

  // 控制组件显隐
  handleCtrlVisble=(targetAttrStr, targeVal) => {
    this.setState({
      [targetAttrStr]: targeVal,
    });
  };



  //取消保存
  cancelSave = () => {
    this.setState({
      saveClick: true,
      LoadingPercent: 0,
      LoadingVisible: false,
      loadingType: 0
    });
    Edbox.Editor.SaveCancel();
  }


  render() {
    const { text, visible, saveAsVisible,QrcodeVisible, modelData, QrcodeSrc, saveAsName, saveAsClick, trailClick, saveClick, feedbackVisible, gameModalVisible, gameModalDatas = {}, LoadingVisible, LoadingPercent, historyList = [], codeVisible, editErrorTxt, loadingType, loadingTxt } = this.state;
    const { Height, Width } = gameModalDatas;
    const { edit = {} } = this.props;
    const { dataSource = {}, isHelpVisible } = edit;
    if(!dataSource.Datas || dataSource.Datas.length < 1) {
      return null;
    }
    const baseInfo = dataSource.Datas.filter(item => item.Name === 'BaseInfo');
    const { Datas = [] } = baseInfo[0];
    const gameName = Datas.length ?  baseInfo[0].Datas.filter(item => item.Name === 'GameName') : "";
    const menu = (
      <Menu onClick={(e) => this.handleMenuClick(e, Datas)}  >
        <Menu.Item key="1">{formatMessage({id: 'save'})}</Menu.Item>
        <Menu.Item key="2">{formatMessage({id: 'saveAs'})}</Menu.Item>
        <Menu.Item key="3">{formatMessage({id: 'export_template'})}</Menu.Item>
        <Menu.Item key="4">{formatMessage({id: 'export_exe'})}</Menu.Item>
        <Menu.Item key="5">{formatMessage({id: 'export_apk'})}</Menu.Item>
        {historyList.length ?
          <SubMenu title={formatMessage({id: 'history'})}  >
            {historyList.map((i) => {
               return <Menu.Item key={i.app_id} version={i.version}>{i.app_name}</Menu.Item>
            })}
            <Menu.Item key="6">{formatMessage({id: 'clear_history'})}</Menu.Item>
          </SubMenu> 
        : <SubMenu title={formatMessage({id: 'history'})} ><span className={styles.ahistoric}>{formatMessage({id: 'empty_audio'})}</span></SubMenu> 
        }
      </Menu>
    );
    return (
      <header className={styles.header}>
        <h2 className={styles.logo}>{gameName.length > 0 ? gameName[0].Value : undefined}</h2>
        <Button  className={styles.back} onClick={this.backHandle}><i  className="anticon anticon-left left-icon"></i>{formatMessage({id: 'return'})}</Button>
        <div className={styles.handle}>
        <Popover placement="bottom" mouseEnterDelay={0.4} content={formatMessage({id:'lobby_suggest_feedback'})}><span className={styles[`ico-msg`]} onClick={()=>this.handleCtrlVisble('feedbackVisible',true)} ></span></Popover>
          <Dropdown overlay={menu} className={styles.save} disabled={!saveClick}>
            <Button type="primary" onMouseOver={(e) => this.getHistoryList(e)}>
              {text} <Icon type="down" />
            </Button>
          </Dropdown>
          <Button  className={styles.trial} onClick={this.trialHandleClick} disabled={!trailClick}>{formatMessage({id: 'trial'})}</Button>
        </div>
        {isHelpVisible ? <Icon type="question-circle" className={styles.icon} onClick={this.questionClick} /> : null } 

        {/* 配置弹窗 */}
        <Modal
          title= {modelData.title}
          centered
          visible={visible}
          onOk={this.saveClick}
          onCancel={this.hideModal}
          okText={modelData.ok}
          cancelText={modelData.cancel}
          className='model_style'
          width= {400}
        >
          <p>{modelData.tip}</p>
        </Modal>

        {/* 另存为弹窗 */}
        {
          saveAsVisible
          ? <Modal
              title={formatMessage({id: 'saveAs'})}
              visible={this.state.saveAsVisible}
              onOk={this.saveAsClick}
              onCancel={this.hideNameModal}
              okText={formatMessage({id: 'model_save'})}
              cancelText={formatMessage({id: 'model_cancel'})}
              okButtonProps={{ disabled: !saveAsClick }}
              centered
              className='model_style'
              width= {450}
            >
              <Row >
                <Col span={5}>
                  <p className={styles.gameName} >{formatMessage({id: 'game_name'})}</p>
                </Col>
                <Col span={19}>
                  <Input value={saveAsName.substring(0, 60)} onChange={this.saveAsNameChange} />
                  <span className={styles.errorText}>{editErrorTxt} </span>
                </Col>
              </Row>
            </Modal>
          : null
        }
        {/* 反馈组件 */}
        {
          feedbackVisible
          ? <FeedBack
              close={()=>this.handleCtrlVisble('feedbackVisible',false)}
              visible={feedbackVisible}
            />
          : null
        }

        {/* 试玩弹窗 */}
        <Modal
            title=""
            visible={gameModalVisible}
            onOk={this.saveAsClick}
            onCancel={this.hideGameModal}
            centered
            className='game-trail-iframe'
            footer={null}
            maskClosable={false}
            forceRender = {true}
            destroyOnClose = {true}
            closable={false}
            width={0}
            style={{
              "padding":`${Width / 2 * Height / Width }% ${Width / 2}%`,
            }}
          >
            <Iconfont className="trial-close" type="icon-close" onClick = {() => this.hideGameModal()}/>
            <iframe src="" frameBorder="0" title="game"  width="100%" height="100%" id="trialFrame"/>
          </Modal>

        {/* 导出二维码弹窗 */}
        {QrcodeVisible ?
          <Modal
            title=""
            visible={QrcodeVisible}
            onCancel={this.hideQrcode}
            centered
            className='qrcode'
            footer={null}
            width={270}
          >
            {codeVisible 
              ? <div>
                <QRCode value={QrcodeSrc} size={190} />
                <p>{formatMessage({id: 'qrcode_msg'})}</p>
              </div>
              : <div className={styles.send_phone}>
                <p>{formatMessage({id: 'export_succeed'})}</p>
                <Button  onClick={this.createQRcode} >{formatMessage({id: 'send_phone'})}</Button>
              </div>
            }
            
          </Modal>
          : null
        }

        {/* logo进度 */}
        {LoadingVisible ?
          <ProgressLoading 
            text={loadingTxt ? loadingTxt : formatMessage({id: 'exporting'})} 
            percent={LoadingPercent} 
            type={loadingType} 
            onCancel={(e)=>this.cancelSave(e)}
            /> 
          : null 
        }
    </header>
    )
  };
};

export default Header;
