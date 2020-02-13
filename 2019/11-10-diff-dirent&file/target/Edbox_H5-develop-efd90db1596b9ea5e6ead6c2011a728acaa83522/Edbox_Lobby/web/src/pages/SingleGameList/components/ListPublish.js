import React, { Component,Fragment } from 'react';
import { Popover, Statistic, Modal, message, Icon } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { formatMessage,getLocale } from 'umi/locale';
import list from './list.scss';
// import ProgressLoadingModal from '@/components/ProgressLoadingModal';
import ProgressLoading from '@/components/progressLoading/index';
import ShareModal from '@/components/Share';

const { Edbox } = window;
const { Countdown } = Statistic;

function toThousands(num) {
  var result = [],
    counter = 0;
  num = (num || 0).toString().split('');
  for (var i = num.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(num[i]);
    if (!(counter % 3) && i !== 0) {
      result.unshift(',');
    }
  }
  return result.join('');
}

@connect(({ lobby, MyWorks, loading }) => ({
  lobby: lobby,
  MyWorks: MyWorks,
  soldOutLoading: loading.effects['MyWorks/soldOutGame'],
  cancelPublishLoading: loading.effects['MyWorks/cancelPublish'],
}))
class ListPublish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleOut: false,
      visibleCancel: false,
      timeLenTipVisible: true,
      nowQrCodeImgUrl: '', // 当前二维码地址
      progressVisible: false,
      progress: 0,
      uninstallUrl: '',
      webGameUrl: '',
      visibleDownload: false,
      visibleIframe: false,
      iframeWidth: '',
      iframeHeight: '',
      ratio: 1,
      jump:'noJump'
    };
  }

  accuracy = value => {
    const value_1 = Math.round(value * 100) / 100;
    const value_2 = value_1.toString().split('.');
    if (value_2.length === 1) {
      return value_1.toString() + '.0';
    } else {
      return value_1;
    }
  };

  handleLongNum = value => {
    const _num = parseInt(value);
    if (_num <= 999 && _num >= 0) {
      return _num;
    } else if (_num >= 1000 && _num <= 9999) {
      return toThousands(_num);
    } else if (_num >= 10000 && _num <= 99999) {
      return Math.round((_num / 1000) * 100) / 100 + 'K+';
    } else if (_num >= 100000 && _num <= 999999) {
      return Math.round((_num / 1000) * 100) / 100 + 'K+';
    } else {
      return Math.round(_num / 1000) + 'K+';
    }
  };

  handleSoldOut = id => {
    this.setState({
      visibleOut: true,
      soldOutId: id,
    });
    Edbox.DataStatistic.ClickEvent('Withdraw','MyWorks','')
  };
  handleCancelPublish = item => {
    this.setState({
      visibleCancel: true,
      soldOutId: item.id,
      soldOutVersion: item.ver,
    });
  };
  handleOk = e => {
    const { dispatch } = this.props;
    const { soldOutId } = this.state;
    const _this = this;

    dispatch({
      type: 'MyWorks/soldOutGame',
      payload: {
        id: soldOutId,
      },
      callback(data) {
        message.success(formatMessage({ id: 'mw_soldout_success' }));
        _this.setState(
          {
            visibleOut: false,
          },
          () => {
            const { onReGetGameList } = _this.props;
            onReGetGameList();
          },
        );
      },
    });
  };

  handleOkCancel = e => {
    const { dispatch } = this.props;
    const { soldOutId,soldOutVersion } = this.state;
    const _this = this;

    dispatch({
      type: 'MyWorks/cancelPublish',
      payload: {
        id: soldOutId,
        version: soldOutVersion,
      },
      callback(data) {
        message.success(formatMessage({ id: 'mw_cancel_success' }));
        _this.setState(
          {
            visibleCancel: false,
          },
          () => {
            const { onReGetGameList } = _this.props;
            onReGetGameList();
          },
        );
      },
    });
  };

  handleCancel = e => {
    this.setState({
      visibleOut: false,
      visibleCancel: false,
    });
  };

  onFinish = () => {
    this.setState({
      timeLenTipVisible: false,
    });
  };

  formateTime = time => {
    const fTime = moment(time).valueOf();
    return moment(fTime).format('MM.DD.YYYY');
  };

  goTo = id => {
    router.push('/Detail/' + id + '?game_type=mywork');
  };

  formateTimeStamp = time => {
    // const fTime = moment(time).valueOf()+ 900000 * 60 * 60 * 24 * 2 + 1000 * 30;
    const fTime = moment(time).valueOf();
    return fTime;
  };

  getQrCodeImg = id => {
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'MyWorks/getQrCodeImg',
        payload: {
          id,
        },
        callback: res => {
          this.setState({
            nowQrCodeImgUrl: res,
          });
        },
      });
      Edbox.DataStatistic.ClickEvent('HoverQRCode','MyWorks','')
    }
  };

  arrayNotUndefined = arr => {
    const newArr = [];
    for (let i = 0, n = arr.length; i < n; i++) {
      if (arr[i]) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  };

  handleFinish = () => {
    this.setState({
      progressVisible: false,
      progress: 0,
    });
    clearInterval(this.progress);
  };

  handleOpenGame = id => {
    const { dispatch, lobby } = this.props;
    const taskId = Edbox.GetGUID();
    this.setState(
      {
        progressVisible: true,
        progress: 0,
      },
      () => {
        this.handleProgress(taskId);
      },
    );
    dispatch({
      type: 'lobby/openGame',
      payload: {
        appid: id,
        playType: 2,
        version: '',
        taskId: taskId,
      },
      callback: data => {
        // console.log(data);

        dispatch({
          type:'lobby/setPlayStatu',
          payload:{
              playStatu: lobby.playStatu + 1
          }
        })
        if (data.data && data.data.error) {
          this.setState({
            progressVisible: false,
            progress: 0,
          });
          clearInterval(this.progress);
          message.info(formatMessage({ id: 'open_failed' }));
        }
        if (data.data && data.data.content.Code === 'UNINSTALL') {
          clearInterval(this.progress);
          this.setState({
            uninstallUrl: data.data.content.Message,
            visibleDownload: true,
            progressVisible: false,
          });
        }
        if (data.Code && data.Code === 'WEBGAME') {
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
                      ratio: gameW/gameH
                  })
              }else{
                  this.setState({
                      webGameUrl: data.Message.Url,
                      iframeWidth: (windowH - 28) * (gameW/gameH),
                      iframeHeight: windowH - 28,
                      visibleIframe: true,
                      progressVisible: false,
                      ratio: gameW/gameH
                  })
              }
          }else{
              this.setState({
                  webGameUrl: data.Message.Url,
                  iframeWidth: windowW > 1358 ? '1171px' : '86%',
                  iframeHeight: windowW > 1358 ? '659px' : (windowW * 0.86) / (1171/659),
                  visibleIframe: true,
                  progressVisible: false,
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
        if (data.Code === 'SUCCESS') {
          this.setState({
            progressVisible: false,
            progress: 0,
          });
          clearInterval(this.progress);
        }
      },
    });
    Edbox.DataStatistic.ClickEvent('PlayGame','MyWorks','')
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
          console.log(data);
          if (progress < 100) {
            this.setState(prevState => ({
              progress: data,
            }));
          } else {
            this.setState({
              progressVisible: false,
              progress: 0,
            });
            clearInterval(this.progress);
          }
        },
      });
    }, 500);
  };

  handleOkPlay = () => {
    this.setState(
      {
        visibleIframe: false,
      }
    );
  };
  
  handlePopover = (visible, id, icon, name, ver) => {
    if (visible) {
      this.setState({
        share_id: id,
        share_game_icon: icon,
        share_game_name: name,
        share_game_ver: ver
      });
      Edbox.DataStatistic.ClickEvent('Share','MyWorks','')
    }
  };
  handleShareVisble = (targetAttrStr, targeVal) => {
    this.setState({
      [targetAttrStr]: targeVal,
    });
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
          // if(data && data.data.error){
          //     return
          // }else{
          //     window.open(data)
          // }
        }
    })
  }
  handleCancelDownload = () => {
    this.setState({
      visibleDownload: false,
    });
  };
  handleOkDownload = () => {
    const { uninstallUrl } = this.state;
    window.open(uninstallUrl);
    this.setState({
      visibleDownload: false,
    });
  };

  componentWillUnmount() {
    clearInterval(this.progress);
  }

  render() {
    const {
      progressVisible,
      progress,
      visibleDownload,
      visibleIframe,
      webGameUrl,
      iframeWidth,
      iframeHeight,
      jump
    } = this.state;
    const logo = require('@/assets/layout/logo.png')
    const { count, data, soldOutLoading, cancelPublishLoading } = this.props;
    const { share_id, share_game_icon, share_game_name, shareVisible, share_game_ver } = this.state
    const { timeLenTipVisible, nowQrCodeImgUrl } = this.state;
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

    return (
      <div className={list['list-layer']}>
        <div className={list['head']}>
          <div style={{ width: '30%' }}>
          <strong>{formatMessage({ id: 'mw_name' })}</strong>
            {getLocale() !=='en-US'?(
              <Fragment>（
              {formatMessage({id:'mw_total'})}<span> {count}</span> {formatMessage({id:'mw_game'})}）
              </Fragment>
            ):(
              <Fragment>
              {'('}<span>{`${count}`}</span> {formatMessage({id:'mw_game'})}{')'}
              </Fragment>
            )}
          </div>
          <div style={{ width: '12%' }}>
            <strong>{formatMessage({ id: 'mw_user' })}</strong>
          </div>
          <div style={{ width: '16%' }}>
            <strong>{formatMessage({ id: 'mw_tags' })}</strong>
          </div>
          <div style={{ width: '12%' }}>
            <strong>{formatMessage({ id: 'mw_update_time' })}</strong>
          </div>
          <div style={{ width: '14%' }}>
            <strong>{formatMessage({ id: 'mw_score' })}</strong>
          </div>
          <div style={{ width: '16%' }}>
            <strong>{formatMessage({ id: 'mw_opration' })}</strong>
          </div>
        </div>
        <div className={list['content']}>
          {data.map((item, i) => (
            <div key={item.id} className={list['item']}>
              <div className={list['col']} style={{ width: '30%' }}>
                <span
                  onClick={() => this.goTo(item.id)}
                  className={list['img']}
                  title={item.game_name}
                >
                  <img src={item.game_icon} alt="" />
                </span>
                <div className={list['name']} title={item.game_name}>
                  <p>
                    <span onClick={() => this.goTo(item.id)} className={list['txt']}>
                      {item.game_name}
                    </span>
                  </p>
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
                </div>
                {item.game_type && item.game_type === 'Html' ? (
                  <Popover
                    overlayClassName={list['qrcode-pop']}
                    placement="bottom"
                    onMouseEnter={() => {
                      this.getQrCodeImg(item.id);
                    }}
                    content={
                      nowQrCodeImgUrl ? (
                        <img
                          alt="qrcode"
                          style={{ width: '180px', height: '180px' }}
                          src={nowQrCodeImgUrl}
                        />
                      ) : null
                    }
                  >
                    <span className={list['qrcode']} />
                  </Popover>
                ) : null}
              </div>
              <div className={list['col']} style={{ width: '12%' }}>
                <Statistic
                  groupSeparator=","
                  valueStyle={{ fontSize: '14px', color: '#666' }}
                  formatter={this.handleLongNum}
                  value={item.game_playing}
                />
              </div>
              <div className={list['col']} style={{ width: '16%' }}>
                <p className={list['elli']}>{this.arrayNotUndefined(item.tags).join('/')}</p>
              </div>
              <div className={list['col']} style={{ width: '12%' }}>
                <p>{this.formateTime(item.update_time)}</p>
              </div>
              <div className={list['col']} style={{ width: '14%' }}>
                {Number(item.game_score) < 0 ? (
                  <span>{formatMessage({ id: 'detail_less_reviews02' })}</span>
                ) : (
                  <div className={list.star}>
                    <div className={list.starbar}>
                      <span
                        className={list.percent}
                        style={{ width: `${(item.game_score / 5) * 100 + '%'}` }}
                      />
                    </div>
                    <span className={list.num}>
                      {this.accuracy(Number(item.game_score) < 0 ? 0 : item.game_score)}
                    </span>
                  </div>
                )}
              </div>
              <div
                className={list['col']}
                style={{ width: '16%' }}
                ref={node => (this.containerMore = node)}
              >
                {/* 下架按钮：已发布作品0 显示*/}
                {item.statu === 0 ? (
                  <span
                    title={formatMessage({ id: 'mw_btn_off_shelf' })}
                    onClick={() => this.handleSoldOut(item.id)}
                    className={list['opbtn']}
                  >
                    <i className={list['icon-out']} />
                  </span>
                ) : null}
                {/* 取消发布：已审核通过，但定时发布时间没到的状态7 显示 */}
                {item.statu === 7 ? (
                  <span
                    title={formatMessage({ id: 'mw_btn_cancel_publish' })}
                    onClick={() => this.handleCancelPublish(item)}
                    className={list['opbtn']}
                  >
                    <i className={list['icon-cancel']} />
                  </span>
                ) : null}
                {/* 试玩按钮 */}
                <span
                  title={formatMessage({ id: 'mw_btn_try_play' })}
                  onClick={() => this.handleOpenGame(item.id)}
                  className={list['opbtn']}
                >
                  <i className={list['icon-play']} />
                </span>
                {/* 分享 */}
                <Popover
                  overlayClassName={list['no-padding']}
                  placement="bottom"
                  content={share}
                  onVisibleChange={visible => this.handlePopover(visible, item.id, item.game_icon, item.game_name, item.ver)}
                  trigger="hover"
                >
                  <span className={list['opbtn']}>
                    <i className={list['icon-share']} />
                  </span>
                </Popover>
              </div>
            </div>
          ))}
          <Modal
            centered
            closable={false}
            bodyStyle={{ textAlign: 'center' }}
            visible={this.state.visibleOut}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            confirmLoading={soldOutLoading}
          >
            <h2>{formatMessage({ id: 'mw_tips' })}</h2>
            <p>{formatMessage({ id: 'mw_soldout_tips' })}</p>
          </Modal>
          <Modal
            centered
            closable={false}
            bodyStyle={{ textAlign: 'center' }}
            visible={this.state.visibleCancel}
            onOk={this.handleOkCancel}
            onCancel={this.handleCancel}
            confirmLoading={cancelPublishLoading}
            cancelButtonProps={{ disabled: cancelPublishLoading }}
            maskClosable={false}
          >
            <h2>{formatMessage({ id: 'mw_tips' })}</h2>
            <p>{formatMessage({ id: 'mw_cancelpublish_tips' })}</p>
          </Modal>
          {/* {progressVisible ? (
            <ProgressLoadingModal
              visible={progressVisible}
              nowProgress={progress + '%'}
              onFinish={this.handleFinish}
            />
          ) : null} */}
          {progressVisible ? (
            <ProgressLoading
              text={formatMessage({id:'mw_modal_tip_game'})}
              percent={progress}
              type={0}
            />
          ) : null}
          <Modal
            centered
            title={formatMessage({ id: 'download' })}
            visible={visibleDownload}
            onOk={this.handleOkDownload}
            onCancel={this.handleCancelDownload}
          >
            <p>{formatMessage({ id: 'tips_noserver' })}</p>
          </Modal>
          <Modal
            title={jump === 'editor' ? <h1 className={'logo'}><img src={logo} alt=""/></h1> : null}
            centered={true}
            visible={visibleIframe}
            onOk={this.handleOkPlay}
            onCancel={this.handleOkPlay}
            destroyOnClose={true}
            footer={null}
            width={iframeWidth}
            style={{
              height: iframeHeight,
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

export default withRouter(ListPublish);
