import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Affix, Modal } from 'antd';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { formatMessage } from 'umi/locale';
import { setLocale } from 'umi/locale';
import { connect } from 'dva';
import Header from './header';
import Sidebar from './Sidebar';
import FeedBack from '../pages/FeedBack/FeedBack';
// import { ServerKey } from '@/utils/common';

const { Edbox } = window;

// 语言缓存判断
// const settinglanVal = cookie.load('settinglanVal');
// if(Edbox.ServerKey!=='Beta'&& Edbox.ServerKey!=='HK'&&Edbox.ServerKey!=='US'){
//   if (settinglanVal && !Edbox.IsLogin) {
//     Edbox.SetLanguage(settinglanVal);
//   } else {
//     cookie.save('settinglanVal', Edbox.Language, { path: '/' });
//   }
// }


// Edbox.Start();
// Edbox.Host.MMO.Dev = "172.24.140.210:80";
// Edbox.Lobby.Init();
// Edbox.ServerKey = 'QA';
// Edbox.Start();
// Edbox.Host.MMO.QA = "172.24.140.210:8081";
// Edbox.Host.MMO.Dev = "192.168.211.12:8081";

@connect(({ lobby, PublishGame, MyWorks, loading }) => ({
  lobby: lobby,
  PublishGame: PublishGame,
  MyWorks,
  reFreshLoding: loading.models.MyWorks,
}))
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeChangeCount: false,
      isShow: false,
      feedBackVisible: false,
      isEdboxStart: false
    };
    this.resize = this.resizeListener.bind(this);
    this.bindScroll = this.bindScroll.bind(this);
  }
  componentWillMount() {
    const { dispatch, lobby } = this.props;
    const { isLogin } = lobby
    this.checkMobile();
    Edbox.Start(()=>{
      Edbox.Lobby.Init();

      if(!isLogin){
        dispatch({
          type:'lobby/setLogin',
          payload:{
            isLogin: true
          }
        })
      }
      this.setState({
        isEdboxStart: true,
      });
    });
    // const { Language } = Edbox
    // setLocale(Language === 'SimplifiedChinese' ? 'zh-CN' : 'en-US')
    if (document.documentElement.clientWidth < 1600) {
      const showStatu = false;
      dispatch({
        type: 'lobby/setSidebar',
        payload: {
          layoutShow: showStatu,
        },
      });
      dispatch({
        type: 'lobby/setResize',
        payload: {
          resizeMin: true,
        },
      });
    }
    if (document.documentElement.clientWidth > 1850) {
      dispatch({
        type: 'lobby/setResizeMax',
        payload: {
          resizeMax: true,
        },
      });
    }
  }
  componentDidMount() {
    this.screenChange();
    const { dispatch } = this.props;
    
    dispatch({
      type: 'lobby/setEl',
      payload: {
        el: this.el,
      },
    });

    dispatch({
      type:'lobby/getThirdPartyShare',
      payload:{}
    })
  }

  initService = () => {
    const { dispatch } = this.props;
    const _this = this;
    this.ser = setTimeout(function() {
      dispatch({
        type: 'lobby/initService',
        payload: {},
        callback: data => {
          // console.log('1223123',data)
          if (data !== '') {
            _this.setState({
              visibleDownload: true,
              downloadUrl: data,
            });
          }
        },
      });
    }, 3000);
  };

  stopInitService = () => {
    clearTimeout(this.ser);
  };

  handleOk = () => {
    this.setState({
      visibleDownload: false,
    });
  };

  handleOkDownload = () => {
    const { downloadUrl } = this.state;
    window.open(downloadUrl);
    this.setState({
      visibleDownload: false,
    });
  };

  screenChange = () => {
    window.addEventListener('resize', this.resize);
  };

  resizeListener() {
    const { dispatch } = this.props;
    if (document.documentElement.clientWidth < 1600) {
      const showStatu = false;
      dispatch({
        type: 'lobby/setSidebar',
        payload: {
          layoutShow: showStatu,
        },
      });
      dispatch({
        type: 'lobby/setResize',
        payload: {
          resizeMin: true,
        },
      });
    } else {
      dispatch({
        type: 'lobby/setResize',
        payload: {
          resizeMin: false,
        },
      });
    }

    if (document.documentElement.clientWidth >= 1850) {
      dispatch({
        type: 'lobby/setResizeMax',
        payload: {
          resizeMax: true,
        },
      });
    } else {
      dispatch({
        type: 'lobby/setResizeMax',
        payload: {
          resizeMin: false,
        },
      });
    }
  }

  changeRoute = () => {
    this.setState({
      routeChangeCount: !this.state.routeChangeCount,
    });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    // this.stopInitService()
  }

  checkMobile = () =>{
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(
            /iphone|ipod|ios|android|nokia|Windows Phone OS|blackberry|webos|MeeGo|smartphone|symbian|s60|Series60|ucweb|uc brower|opera mini|opera mobi|mini 9.5|320x320|240x320|176x220|320*480|480*320|240*320|320*320|176*220|vx1000|lge|m800|e860|u940|ux840|compal|wireless|mobi|ahong|lg380|lgku|lgu900|lg210|lg47|lg920|lg840|lg370|sam-r|mg50|s55|g83|t66|vx400|mk99|d615|d763|el370|sl900|mp500|samu3|samu4|vx10|xda_|samu5|samu6|samu7|samu9|a615|b832|m881|s920|n210|s700|c-810|_h797|mob-x|sk16d|848b|mowser|s580|r800|471x|v120|rim8|c500foma:|160x|x160|480x|x640|t503|w839|i250|sprint|w398samr810|m5252|c7100|mt126|x225|s5330|s820|htil-g1|fly v71|s302|-x113|novarra|k610i|-three|8325rc|8352rc|sanyo|vx54|c888|nx250|n120|mtk |c5588|s710|t880|c5005|i;458x|p404i|s210|c5100|teleca|s940|c500|s590|foma|samsu|vx8|vx9|a1000|_mms|myx|a700|gu1100|bc831|e300|ems100|me701|me702m-three|sd588|s800|8325rc|ac831|mw200|brew |d88|htc\/|htc_touch|355x|m50|km100|d736|p-9521|telco|sl74|ktouch|m4u\/|me702|8325rc|kddi|phone|lg |sonyericsson|samsung|240x|x320|vx10|nokia|sony cmd|motorola|up.browser|up.link|mmp|symbian|smartphone|midp|wap|vodafone|o2|pocket|mobile|psp|treo/i
        )) {
        // console.log('移动端')
        window.location.href = window.location.origin + '/mobile' //移动端地址
    }
  }

  handleFeedBack = () => {
    this.setState({
      feedBackVisible: true,
    });
  };
  handleFeebClose = () => {
    this.setState({
      feedBackVisible: false,
    });
  };

  goTo = url => {
    const { dispatch, lobby } = this.props
    const { globalSearchIndex, globalSearchKey } = lobby

    if(globalSearchKey !== ''){
      dispatch({
        type:'lobby/setGlobalSearchKey',
        payload: {
            globalSearchKey: '',
            globalSearchIndex: globalSearchIndex + 1
        }
      })
    }
    if (url === this.props.location.pathname) {
      return;
    }
    
    router.push(url);
    if(url === '/SingleGameList/Creat'){
      Edbox.DataStatistic.ClickEvent('CreateGame','MainPage','')
    }
  };

  bindScroll = e => {
    const { dispatch, location } = this.props;
    if (
      location.pathname.indexOf('Detail') !== -1 ||
      location.pathname.indexOf('PublishGame') !== -1
    ) {
      if (this.el.scrollTop > 560) {
        dispatch({
          type: 'lobby/setDetailPlay',
          payload: {
            isShowPlay: true,
          },
        });
      } else {
        dispatch({
          type: 'lobby/setDetailPlay',
          payload: {
            isShowPlay: false,
          },
        });
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      const { dispatch } = this.props;
      dispatch({
        type: 'PublishGame/setPublish',
        payload: {
          publishGame: {
            game_icon: '',
            game_icon_url: '',
            game_name: '',
            game_description: '',
            tags_game: [],
            tags_edu: [],
            tags_other: [],
            platform: 1,
            ver: '',
            immediately: 1,
            publish_date: '',
            game_update: '',
            price: 1,
            image_config: {
              ID: [],
              ImageType: ['png', 'jpeg', 'jpg'],
              Value: [],
            },
          },
        },
      });
    }
  }

  autoReFreshWhenUnity = () => {
    const { dispatch, lobby, MyWorks, location, reFreshLoding } = this.props;
    const oldEditStatu = lobby.editStatu;
    if (!reFreshLoding) {
      // 我的作品的编辑页面打开unity编辑器
      if (location.pathname === '/SingleGameList/MyWorks' && MyWorks.currentTabIndex === 0) {
        // console.log('是否需要刷新本页：',lobby.isNeedRefreshMyWork);
         if(lobby.isNeedRefreshMyWork){
          dispatch({
            type: 'lobby/setIsNeedRefreshMyWork',
            payload: { isNeedRefreshMyWork: false },
          });
          lobby.openUnityEditorRefreshFun();
          if(MyWorks.currentPage===1){
            dispatch({
              type: 'lobby/setEditStatu',
              payload: {
                editStatu: oldEditStatu + 1,
              },
            });
          }
         }

      }else{
        dispatch({
          type: 'lobby/setIsNeedRefreshMyWork',
          payload: { isNeedRefreshMyWork: false },
        });
      }

      // 创作列表打开unity编辑器
      if (location.pathname === '/SingleGameList/Creat') {
        if (lobby.isOpenUnityEditor) {
          dispatch({
            type: 'lobby/setEditStatu',
            payload: {
              editStatu: oldEditStatu + 1,
            },
          });
        }
      }
    }
  };

  // cancelIsOpenUnityEditor = () => {
  //   const { dispatch, lobby } = this.props;
  //   if (lobby.isOpenUnityEditor) {
  //     dispatch({
  //       type: 'lobby/setIsOpenUnityEditor',
  //       payload: { isOpenUnityEditor: false },
  //     });
  //   }
  // };

  needRefresh=()=>{
    const {dispatch,lobby} = this.props;
    if(!lobby.isNeedRefreshMyWork){
      dispatch({
        type: 'lobby/setIsNeedRefreshMyWork',
        payload: { isNeedRefreshMyWork: true },
      });
    }

  }

  render() {
    const { feedBackVisible, visibleDownload, isEdboxStart } = this.state;
    const { lobby } = this.props;

    if(isEdboxStart){
      // 语言缓存判断
      const settinglanVal = cookie.load('settinglanVal');
      if(Edbox.ServerKey!=='Beta'&& Edbox.ServerKey!=='HK'&&Edbox.ServerKey!=='US'){
        if (settinglanVal && !Edbox.IsLogin) {
          Edbox.SetLanguage(settinglanVal);
        } else {
          cookie.save('settinglanVal', Edbox.Language, { path: '/' });
        }
      }
      const { Language } = Edbox;
      switch(Language){
        case 'SimplifiedChinese':
          setLocale('zh-CN');
          break;
        case 'English':
          setLocale('en-US');
          break;
        case 'TraditionalChinese_TW':
          setLocale('zh-TW');
          break;
        case 'TraditionalChinese':
          setLocale('zh-HK');
          break;
        default:
          setLocale('zh-CN');
      }
      
    }
    
    if (this.props.location.pathname === '/FeedBack/FeedBack/') {
      return this.props.children;
    }
    return (
      <div
        className={'edboxLayout'}
        onClick={this.autoReFreshWhenUnity}
        onMouseLeave={this.needRefresh}
      >
        {lobby.isLogin ? <Header onClickFeedBack={this.handleFeedBack} /> : null}
        <section className={'edbox-main'}>
          {lobby.isLogin ? <Sidebar show={this.props.lobby.layoutShow} /> : null}
          <div
            className={'edbox-view'}
            ref={el => {
              this.el = el;
            }}
            onScrollCapture={() => this.bindScroll()}
          >
            {!lobby.isLogin ? null : this.props.children}
          </div>
        </section>
        <Affix offsetBottom={15} style={{ position: 'absolute', right: 15 }} target={() => this.el}>
          <div onClick={() => this.goTo('/SingleGameList/Creat')} className={'edbox-creat'} />
        </Affix>
        <FeedBack close={this.handleFeebClose} visible={feedBackVisible} />
        <Modal
          centered={true}
          cancelText={formatMessage({ id: 'cancel' })}
          okText={formatMessage({ id: 'feedback_confirm' })}
          title={formatMessage({ id: 'download' })}
          visible={visibleDownload}
          onOk={this.handleOkDownload}
          onCancel={this.handleOk}
        >
          <p>{formatMessage({ id: 'tips_noserver' })}</p>
        </Modal>
      </div>
    );
  }
}

export default withRouter(BasicLayout);
