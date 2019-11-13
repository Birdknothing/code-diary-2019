import React, { Component,Fragment } from 'react';
import { Popover, Modal, message, Icon, Statistic } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { formatMessage, getLocale} from 'umi/locale';
import list from './list.scss';
import EditTitleModal from './EditTitleModal';
// import ProgressLoadingModal from '@/components/ProgressLoadingModal';
import ProgressLoading from '@/components/progressLoading/index';
import ShareModal from '@/components/Share';

const { Edbox } = window
const { Countdown } = Statistic;
@connect(({ lobby, MyWorks, PublishGame, loading}) => ({
  lobby: lobby,
  MyWorks: MyWorks,
  PublishGame: PublishGame,
  cancelPublishLoading: loading.effects['MyWorks/cancelPublish'],
}))
class ListEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleCancel: false,
      visibleEdit: false,
      soldOutId: '',
      soldOutVersion: '', // 取消发布版本
      popoverId: '',
      delstatu: '',
      editTitleVisible: false,
      editObj: {}, // 编辑对象
      timeLenTipVisible: true,
      nowQrCodeImgUrl:'', // 当前二维码地址
      progressVisible: false,
      progress: 0,
      uninstallUrl: '',
      webGameUrl: '',
      visibleDownload: false,
      visibleIframe: false,
      iframeWidth: '',
      iframeHeight: '',
      type:'game', // 用户区别点击的是试玩还是编辑器
      isEditor: false,
      ratio: 1
    };
  }

  handleCancelPublish = item => {
    const {lobby:{isNeedRefreshMyWork}} = this.props;
    if(!isNeedRefreshMyWork){
      this.setState({
        visibleCancel: true,
        soldOutId: item.id,
        soldOutVersion: item.ver,
      });
    }

  };
  handleDeleteGame = id => {
    const {lobby:{isNeedRefreshMyWork}} = this.props;
    if(!isNeedRefreshMyWork){
      const { delstatu } = this.state;
      this.setState({
        visibleDelete: true,
        deleteMsg:
          delstatu === 4
            ? formatMessage({ id: 'mw_delete_tips2' })
            : formatMessage({ id: 'mw_delete_tips' }),
      });
      Edbox.DataStatistic.ClickEvent('DeleteGame','MyWorks','')
    }
  };

  handleCancel = e => {
    const {lobby:{isNeedRefreshMyWork}} = this.props;
    if(!isNeedRefreshMyWork){
      this.setState({
        visibleCancel: false,
        visibleDelete: false,
        visibleEdit: false,
      });
    }

  };

  handleOkCancel = e => {
    const {lobby:{isNeedRefreshMyWork}} = this.props;
    if(!isNeedRefreshMyWork){
    const { dispatch } = this.props;
    const { soldOutId, soldOutVersion } = this.state;
    const _this = this;

    dispatch({
      type: 'MyWorks/cancelPublish',
      payload: {
        id: soldOutId,
        version: soldOutVersion,
      },
      callback(data) {
        message.success(formatMessage({ id: 'mw_cancel_success' }));
        _this.setState({
          visibleCancel: false,
        },()=>{
          const { onReGetGameList } = _this.props;
          onReGetGameList();
        });
      },
    });
  }
  };

  handleOkDelete = e => {
    const { dispatch,lobby:{isNeedRefreshMyWork} } = this.props;
    const { popoverId } = this.state;
    const _this = this;
    if(!isNeedRefreshMyWork){
    dispatch({
      type: 'MyWorks/deleteGame',
      payload: {
        id: popoverId,
      },
      callback(data) {
        message.success(formatMessage({ id: 'mw_delete_success' }));
        _this.setState(
          {
            visibleDelete: false,
          },
          () => {
            // 重新请求列表
            const { onReGetGameList,dispatch,lobby } = _this.props;
            onReGetGameList('delete');
            // 刷新侧边
            dispatch({
              type:'lobby/setEditStatu',
              payload:{
                editStatu: lobby.editStatu + 1
              }
            })
          },
        );
      },
    });
  }
  };

  getPublishOrigin = id => {
    const {lobby:{isNeedRefreshMyWork}} = this.props;
    if(!isNeedRefreshMyWork){
      router.push('/PublishGame/' + id);
      Edbox.DataStatistic.ClickEvent('PublishGame','MyWorks','')
    }

  };

  handlePopover = (visible, id, statu, icon, name, ver) => {
    if (visible) {
      this.setState({
        popoverId: id,
        delstatu: statu,
        share_id: id,
        share_game_icon: icon,
        share_game_name: name,
        share_game_ver: ver
      });
      Edbox.DataStatistic.ClickEvent('MoreAction','MyWorks','')
    }
  };

  handlePopoverShare = visible =>{
    if(visible){
      Edbox.DataStatistic.ClickEvent('Share','MyWorks','')
    }
  }

  goTo = id => {
    const {lobby:{isNeedRefreshMyWork}} = this.props;
    if(!isNeedRefreshMyWork){
    router.push('/Detail/' + id +'?game_type=mywork');
    }
  };

  handleNameEdit = (e, item) => {
    e.preventDefault();
    const { id, game_name } = item;
    const {lobby:{isNeedRefreshMyWork}} = this.props;
    if(!isNeedRefreshMyWork){
    this.setState(
      {
        editObj: {
          id,
          title: game_name,
        },
      },
      () => {
        this.handleCtrlVisble('editTitleVisible', true);
      },
    );

    Edbox.DataStatistic.ClickEvent('UpdateName','MyWorks','')
    }
  };

  // 显隐控制
  handleCtrlVisble = (targetAttrStr, targeVal) => {
    this.setState({
      [targetAttrStr]: targeVal,
    });
  };

  handleOkEditName = () => {};

  onFinish = () => {
    this.setState({
      timeLenTipVisible: false,
    });
  };

  formateTime = time => {
    const fTime = moment(time).valueOf();
    return moment(fTime).format('MM.DD.YYYY');
  };

  formateTimeStamp = time => {
    // const fTime = moment(time).valueOf()+ 900000 * 60 * 60 * 24 * 2 + 1000 * 30;
    const fTime = moment(time).valueOf();
    return fTime;
  };

  getQrCodeImg = (id)=>{
    const {dispatch} = this.props;
    if(id) {
      dispatch({
        type:'MyWorks/getQrCodeImg',
        payload:{
          id,
        },
        callback:res=>{
          this.setState({
            nowQrCodeImgUrl:res,
          });
        }
      });
      Edbox.DataStatistic.ClickEvent('HoverQRCode','MyWorks','')
    }

  }

  arrayNotUndefined=(arr)=>{
    const newArr = [];
    for(let i=0, n=arr.length; i<n; i++) {
      if(arr[i]){
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

  handleFinish = () =>{
    this.setState({
      progressVisible: false,
      progress:0
    })
    clearInterval(this.progress);
  }

  handleOpenGame = id =>{
    const { dispatch, lobby } = this.props
    const {isNeedRefreshMyWork} = lobby;
    const taskId =  Edbox.GetGUID()
    if(!isNeedRefreshMyWork){
    this.setState({
      progressVisible: true,
      progress: 0,
      type:'game',
    },()=>{
      this.handleProgress(taskId)
    })
    dispatch({
      type:'lobby/openGame',
      payload:{
          appid: id,
          playType: 2,
          version: '',
          taskId: taskId
      },
      callback:(data)=>{
          dispatch({
            type:'lobby/setPlayStatu',
            payload:{
                playStatu: lobby.playStatu + 1
            }
          })
          if(data.data && data.data.error && data.data.content.Code !== 'UNINSTALL' ){
            this.setState({
              progressVisible: false,
              progress:0
            })
            clearInterval(this.progress);
            message.info(formatMessage({id:'open_failed'}));
          }
          if(data.data && data.data.content.Code === 'UNINSTALL'){
              clearInterval(this.progress);
              this.setState({
                  uninstallUrl: data.data.content.Message,
                  visibleDownload: true,
                  progressVisible: false
              })
          }
          if(data.Code && data.Code === "WEBGAME"){
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
                          progressVisible: false,
                          ratio: gameW/gameH,
                          isEditor: false
                      })
                  }else{
                      this.setState({
                          webGameUrl: data.Message.Url,
                          iframeWidth: (windowH - 28) * (gameW/gameH),
                          iframeHeight: windowH - 28,
                          visibleIframe: true,
                          progressVisible: false,
                          ratio: gameW/gameH,
                          isEditor: false
                      })
                  }
              }else{
                  this.setState({
                      webGameUrl: data.Message.Url,
                      iframeWidth: windowW > 1358 ? '1171px' : '86%',
                      iframeHeight: windowW > 1358 ? '659px' : (windowW * 0.86) / (1171/659),
                      visibleIframe: true,
                      progressVisible: false,
                      isEditor: false
                  })
              }
              
              dispatch({
                type:'lobby/listenEditorExit',
                payload:{},
                callback:(data)=>{
                  
                  if(data.data && data.data.error){
                    return
                  }
                    // console.log('关闭编辑器')
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
                          isEditor: 'iframeEdit'
                      })
                  }
              }
          }
          if(data.Code === "SUCCESS"){
              this.setState({
                  progressVisible: false,
                  progress:0
              })
              clearInterval(this.progress);
          }
      }
    })
    Edbox.DataStatistic.ClickEvent('PlayGame','MyWorks','')
  }
  }

  handleOpenEditor = (id,ver,e) =>{
    const { dispatch,lobby:{isNeedRefreshMyWork} } = this.props
    const taskId =  Edbox.GetGUID()
    if(!isNeedRefreshMyWork){
    this.setState({
      progressVisible: true,
      progress: 0,
      type:'editor',
    },()=>{
      this.handleProgress(taskId)
    })
    dispatch({
      type:'lobby/openEditor',
      payload:{
          appid: id,
          accessType: 2,
          version: ver,
          taskId: taskId
      },
      callback:(data)=>{
          if(data.data && data.data.error && data.data.content.Code !== 'UNINSTALL' ){
            this.setState({
                progressVisible: false,
                progress:0
            })
            if(data.data.content.Code === 'NOTSUPPORTED'){
              message.info(data.data.content.Message);
            }else{
              message.info(formatMessage({id:'open_failed'}));
            }
            clearInterval(this.progress);
          }
          if(data.data && data.data.content.Code === 'UNINSTALL'){
              clearInterval(this.progress);
              this.setState({
                  uninstallUrl: data.data.content.Message,
                  visibleDownload: true,
                  progressVisible: false
              })
          }

          if(data.Code && data.Code === "WEBGAME"){
              clearInterval(this.progress);
              this.setState({
                webGameUrl: data.Message.Url,
                // iframeWidth: data.Message.width + 'px',
                // iframeHeight: data.Message.height + 'px',
                  iframeWidth: 100 + '%',
                  iframeHeight: 100 + '%',
                  visibleIframe: true,
                  progressVisible: false,
                  isEditor: true
              },()=>{
                dispatch({
                    type:'lobby/listenEditorExit',
                    payload:{},
                    callback:(data)=>{
                        if(data.data && data.data.error){
                          return
                        }
                        // console.log('关闭编辑器')
                        this.handleOkPlay();
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
                  progressVisible: false,
                  progress:0
              })
              clearInterval(this.progress);

          }
      }
    })
    Edbox.DataStatistic.ClickEvent('EditGame','MyWorks','')
  }
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
                        progressVisible: false,
                        progress:0
                    })
                    clearInterval(this.progress);
                }

            }
        })
    },500)
  }
  handleOkPlay = () =>{
    this.setState({
      visibleIframe: false
    },()=>{
      const {type} = this.state;
      if(type==='editor'){
        const { onReGetGameList, dispatch, lobby } = this.props;
        dispatch({
            type:'lobby/setEditStatu',
            payload:{
                editStatu: lobby.editStatu + 1
            }
        })
        Edbox.DataStatistic.EditExit();
        onReGetGameList();
        clearTimeout(this.timer)
      }
    })
  }

  handleCancelDownload = () =>{
    this.setState({
      visibleDownload: false,
    })
  }
  handleOkDownload = () =>{
      const { uninstallUrl } = this.state
      window.open(uninstallUrl)
      this.setState({
        visibleDownload: false
      })
  }


  handleShareVisble = (targetAttrStr, targeVal) => {
    const {lobby:{isNeedRefreshMyWork}} = this.props;
    if(!isNeedRefreshMyWork){
    this.setState({
      [targetAttrStr]: targeVal,
    });
  }
  };

  handleShare = (type) =>{
    const { dispatch } = this.props
    const { share_id } = this.state
    dispatch({
        type:'lobby/sharedAppByThird',
        payload:{
            appId: share_id,
            access: 2,
            type: type
        },
        callback:(data)=>{
          // console.log(data,2)
          // if(data && data.data.error){
          //     return
          // }else{
          //     window.open(data)
          // }
        }
    })
  }

  componentWillUnmount(){
    clearInterval(this.progress);
    clearTimeout(this.timer)
  }

  render() {
    const { progressVisible, progress, visibleDownload, visibleIframe, webGameUrl, iframeWidth, iframeHeight,type, isEditor, shareVisible } = this.state
    const { share_id, share_game_icon, share_game_name, share_game_ver } = this.state
    const { count, copyOpr, onReGetGameList, data,cancelPublishLoading } = this.props;
    const { deleteMsg, editTitleVisible, editObj, timeLenTipVisible,nowQrCodeImgUrl } = this.state;
    const logo = require('@/assets/layout/logo.png')
    const share = (
      <div className={list['more-pop']}>
        <div onClick={()=>this.handleShareVisble('shareVisible',true)} className={list['item-more']}>
          <Icon className={list['share-icon']} type="user" />
          {formatMessage({ id: 'mw_share_im' })}
        </div>
        {/* {
          (this.props.lobby.thirdParty.indexOf('QQ') > -1) ?
          <div onClick={()=>this.handleShare('QQ')} className={list['item-more']}>
            <Icon className={list['share-icon']} type="qq" />
            {formatMessage({ id: 'mw_share_qq' })}
          </div>
          :
          <div onClick={()=>this.handleShare('Fackbook')} className={list['item-more']}>
            <Icon className={list['share-icon']} type="facebook" />
            Facebook
          </div>
        }
        {
          (this.props.lobby.thirdParty.indexOf('QQ') > -1) ?
          <div onClick={()=>this.handleShare('Weibo')} className={list['item-more']}>
            <Icon className={list['share-icon']} type="weibo" />
            {formatMessage({ id: 'mw_share_weibo' })}
          </div>
          :
          <div onClick={()=>this.handleShare('Twitter')} className={list['item-more']}>
            <Icon className={list['share-icon']} type="twitter" />
            Twitter
          </div>
        } */}
      </div>
    );
    // const opmore = (
    //   <div className={list['more-pop']}>
    //     <div onClick={this.handleDeleteGame} className={list['item-more']}>
    //       <span className={list['icon-del']} />
    //       {formatMessage({ id: 'mw_delete' })}
    //     </div>
    //     <div className={list['item-more']} onClick={()=>{copyOpr(item,i)}}>
    //       <span className={list['icon-copy']} />
    //       {formatMessage({ id: 'mw_copy' })}
    //     </div>
    //     <Popover
    //       overlayClassName={list['no-padding']}
    //       placement="right"
    //       content={share}
    //       trigger="click"
    //     >
    //       <div className={list['item-more']}>
    //         <span className={list['icon-share']} />
    //         {formatMessage({ id: 'mw_share' })}
    //       </div>
    //     </Popover>
    //   </div>
    // );

    return (
      <div className={list['list-layer']}>
        <div className={list['head']}>
          <div style={{ width: '30%' }}>
            <strong>{formatMessage({ id: 'mw_name' })}</strong> (
            {getLocale() !=='en-US'?(
              <Fragment>
              {formatMessage({id:'mw_total'})}<span> {count}</span> {formatMessage({id:'mw_game'})}
              </Fragment>
            ):(
              <Fragment>
              <span>{count}</span> {formatMessage({id:'mw_game'})}
              </Fragment>
            )} )
          </div>
          <div style={{ width: '12%' }}>
            <strong>{formatMessage({ id: 'mw_version' })}</strong>
          </div>
          <div style={{ width: '26%' }}>
            <strong>{formatMessage({ id: 'mw_tags' })}</strong>
          </div>
          <div style={{ width: '16%' }}>
            <strong>{formatMessage({ id: 'mw_time' })}</strong>
          </div>
          <div style={{ width: '16%' }}>
            <strong>{formatMessage({ id: 'mw_opration' })}</strong>
          </div>
        </div>
        <div className={list['content']}>
          {data.map((item, i) => (
            <div key={item.id} className={list['item']}>
              <div className={`${list['col']}`} style={{ width: '30%' }}>
                <span onClick={() => this.goTo(item.id)} className={list['img']} title={item.game_name}>
                  <img src={item.game_icon} alt="" />
                </span>
                <div className={list['name']} title={item.game_name}>
                  <p>
                    <span onClick={() => this.goTo(item.id)} className={list['txt']}>{item.game_name}</span>
                    <span onClick={e => this.handleNameEdit(e, item)} className={list['edit-name']}>
                      <Icon type="edit" />
                    </span>
                  </p>
                  {/* 下架(mw_down)(已下架的作品，等同于未发布的状态（显示未发布）) */}
                  {item.statu === 4 ? (
                    <p className={list['statu']} title={formatMessage({id:'mw_unpublish'})}>{formatMessage({id:'mw_unpublish'})}</p>
                  ) : null}
                  {/* 未审核 */}
                  {item.statu === 5 ? (
                    <p className={list['statu']} title={formatMessage({id:'mw_unauditing'})}>{formatMessage({id:'mw_unauditing'})}</p>
                  ) : null}
                  {/* 未发布 */}
                  {item.statu === 6 ? (
                    <p className={list['statu']} title={formatMessage({id:'mw_unpublish'})}>{formatMessage({id:'mw_unpublish'})}</p>
                  ) : null}
                   {/* 取消审核(mw_cancle_auditing) （其中已发布未审核情况下进行取消审核，等同于未发布状态（显示未发布））*/}
                   {item.statu === 8 ? (
                    <p className={list['statu']} title={formatMessage({id:'mw_unpublish'})}>{formatMessage({id:'mw_unpublish'})}</p>
                  ) : null}
                  {/* 审核通过服务端打包中 */}
                  {item.statu === 9 ? (
                    <p className={list['statu']} title={formatMessage({id:'mw_release_packing'})}>{formatMessage({id:'mw_release_packing'})}</p>
                  ) : null}
                  {/* 审核中 */}
                  {item.statu === 3 ? (
                    <p className={list['statu']} title={formatMessage({ id: 'mw_statu_inreview' })}>{formatMessage({ id: 'mw_statu_inreview' })}</p>
                  ) : null}
                  {/* 审核失败 */}
                  {item.statu === 2 ? (
                    <Popover placement="bottomLeft" content={item.failure_tips?item.failure_tips:formatMessage({id:'mw_reasons_failure'})} trigger="hover">
                      <p className={`${list['statu']} ${list['error']}`}>
                        {formatMessage({ id: 'mw_statu_failure' })}
                      </p>
                    </Popover>
                  ) : null}
                  {/* 审核通过，待发布（定时）7*/}
                  {item.statu === 7 && timeLenTipVisible ? (
                    <p className={`${list['statu']}`}>
                      {formatMessage({ id: 'mw_release_time' })}
                      <Countdown
                        title=""
                        value={moment(this.formateTimeStamp(item.release_time)).valueOf()}
                        onFinish={this.onFinish}
                      />
                    </p>
                  ) : null}
                  {/* 已发布 */}
                  {item.statu === 0 ? (
                    <p className={`${list['statu']} ${list['published']}`} title={formatMessage({ id: 'mw_statu_published' })}>
                      {formatMessage({ id: 'mw_statu_published' })}
                    </p>
                  ) : null}
                </div>
                {item.game_type && item.game_type === 'Html' ? (
                  <Popover
                    overlayClassName={list['qrcode-pop']}
                    placement="bottom"
                    onMouseEnter={()=>{this.getQrCodeImg(item.id)}}
                    content={ nowQrCodeImgUrl?(
                      <img
                          alt="qrcode"
                          style={{ width: '180px', height: '180px' }}
                          src={nowQrCodeImgUrl}
                        />
                        ):null
                    }
                  >
                    <span className={list['qrcode']} />
                  </Popover>
                ) : null}
                <div onClick={() => this.goTo(item.id)} className={list['jump-area']} />
              </div>
              <div className={list['col']} style={{ width: '12%' }}>
                <p>v{item.ver}</p>
              </div>
              <div className={list['col']} style={{ width: '26%' }}>
                <p className={list['elli']}>{this.arrayNotUndefined(item.tags).join('/')}</p>
              </div>
              <div className={list['col']} style={{ width: '16%' }}>
                <p>{this.formateTime(item.creation_time)}</p>
              </div>
              <div className={list['col']} style={{ width: '16%' }}>
                {/* 取消发布按钮：未审核5、审核中3、审核通过7显示 */}
                {item.statu ===5||item.statu ===3||item.statu ===7? (
                  <span title={formatMessage({id:'mw_btn_cancel_publish'})} onClick={() => this.handleCancelPublish(item)} className={list['opbtn']}>
                    <i className={list['icon-cancel']} />
                  </span>
                ):null}
                {/* 发布按钮：已发布0、未发布6，审核失败2、下架4、取消审核8显示(下架4策划说要显示了) */}
                {item.statu ===0 ||item.statu ===6 ||item.statu ===2||item.statu ===4||item.statu ===8?(
                    <span title={formatMessage({id:'mw_btn_publish'})} onClick={() => this.getPublishOrigin(item.id)} className={list['opbtn']}>
                      <i className={list['icon-publish']} />
                    </span>
                ):null}
                {/* 试玩按钮 */}
                <span title={formatMessage({id:'mw_btn_try_play'})} onClick={()=>this.handleOpenGame(item.id)} className={list['opbtn']}>
                  <i className={list['icon-play']} />
                </span>
                {/* 编辑按钮：已发布0、审核失败2、未发布6、下架4、取消审核8显示(QA说审核通过的定时发布的作品不显示) */}
                {item.statu === 0||item.statu === 2||item.statu === 4 ||item.statu === 6||item.statu === 8? (
                <span title={formatMessage({id:'mw_btn_edit'})} onClick={(e)=>this.handleOpenEditor(item.id,item.ver,e)} className={list['opbtn']}>
                  <i className={list['icon-edit']} />
                </span>
                ):null}
                {/* 更多操作 */}
                <Popover
                  overlayClassName={list['no-padding']}
                  placement="bottom"
                  onVisibleChange={visible => this.handlePopover(visible, item.id, item.statu, item.game_icon, item.game_name, item.ver)}
                  trigger="hover"
                  content={
                    <div className={list['more-pop']}>
                      {/* 删除：未审核5、定时距离发布还有XX:XX 7 不显示*/}
                      {item.statu === 5||item.statu === 7? null:(
                        <div onClick={this.handleDeleteGame} className={list['item-more']}>
                          <span className={list['icon-del']} />
                          {formatMessage({ id: 'mw_delete' })}
                        </div>
                      )}
                      <div
                        className={list['item-more']}
                        onClick={() => {
                          copyOpr(item, i);
                        }}
                      >
                        <span className={list['icon-copy']}/>
                        {formatMessage({ id: 'mw_copy' })}
                      </div>
                      <Popover
                        overlayClassName={list['no-padding']}
                        placement="right"
                        content={share}
                        trigger="hover"
                        onVisibleChange={visible=>this.handlePopoverShare(visible)}
                      >
                        <div className={list['item-more']}>
                          <span className={list['icon-share']} />
                          {formatMessage({ id: 'mw_share' })}
                        </div>
                      </Popover>
                    </div>
                  }
                >
                  <span className={list['opbtn']}>
                    <i className={list['icon-more']} />
                  </span>
                </Popover>
              </div>
            </div>
          ))}
          <Modal
            closable={false}
            centered
            bodyStyle={{ textAlign: 'center' }}
            visible={this.state.visibleCancel}
            onOk={this.handleOkCancel}
            onCancel={this.handleCancel}
            confirmLoading={cancelPublishLoading}
          >
            <h2>{formatMessage({ id: 'mw_tips' })}</h2>
            <p>{formatMessage({ id: 'mw_cancelpublish_tips' })}</p>
          </Modal>
          <Modal
            closable={false}
            centered
            bodyStyle={{ textAlign: 'center' }}
            visible={this.state.visibleDelete}
            onOk={this.handleOkDelete}
            onCancel={this.handleCancel}
          >
            <h2>{formatMessage({ id: 'mw_tips' })}</h2>
            <p>{deleteMsg}</p>
          </Modal>
          <Modal
            title={formatMessage({ id: 'mw_edit_name_title' })}
            centered
            bodyStyle={{ textAlign: 'center' }}
            visible={this.state.visibleEdit}
            onOk={this.handleOkEditName}
            onCancel={this.handleCancel}
          >
            <p>{deleteMsg}</p>
          </Modal>
          {editTitleVisible && editObj.id ? (
            <EditTitleModal
              visible={editTitleVisible}
              title={editObj.title}
              id={editObj.id}
              modalCancel={() => this.handleCtrlVisble('editTitleVisible', false)}
              onSure={onReGetGameList}
            />
          ) : null}
          {/* {progressVisible?(
          <ProgressLoadingModal
            visible={progressVisible}
            nowProgress={progress + '%'}
            onFinish={this.handleFinish}
            type={type}
          />
          ):null} */}

          {progressVisible ? (
            <ProgressLoading
              text={type==='editor'?formatMessage({id:'mw_modal_tip_edit'}):formatMessage({id:'mw_modal_tip_game'})}
              percent={progress}
              type={0}
            />
          ) : null}
          <Modal
          centered
          title={formatMessage({id:'download'})}
          visible={visibleDownload}
          onOk={this.handleOkDownload}
          onCancel={this.handleCancelDownload}
          >
          <p>{formatMessage({id:'tips_noserver'})}</p>
          </Modal>
          <Modal
          title={isEditor && <h1 className={'logo'} onClick={()=>this.goToHome('/')}><img src={logo} alt=""/></h1>}
          centered
          visible={visibleIframe}
          onOk={this.handleOkPlay}
          onCancel={this.handleOkPlay}
          destroyOnClose={true}
          footer={null}
          width={iframeWidth}
          style={{
              height: iframeHeight
          }}
          className={isEditor ? "iframeEdit" : (this.state.ratio >= 1 ? "iframePlay ratioW" : "iframePlay")}
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

          <ShareModal
              appId={share_id}
              appName={share_game_name}
              iconUrl={share_game_icon}
              visible={shareVisible}
              access={2}
              version={share_game_ver}
              onChange={()=>this.handleShareVisble('shareVisible',false)}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(ListEdit);
