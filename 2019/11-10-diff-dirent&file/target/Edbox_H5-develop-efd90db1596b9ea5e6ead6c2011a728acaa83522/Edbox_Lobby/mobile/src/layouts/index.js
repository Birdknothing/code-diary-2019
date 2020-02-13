import React, { Component } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import { setLocale } from 'umi/locale';
import styles from './index.scss';

const { Edbox } = window;
Edbox.Start(() => {
  Edbox.Lobby.Init();
});

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

@connect(({ lobby }) => ({
  lobby: lobby
}))
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLandscape: false
    };
    // this.resize = this.resizeListener.bind(this);
  }
  componentWillMount() {
    const { dispatch, location } = this.props;
    const { query, pathname } = location;
    console.log('query:', query, 'pathname:', pathname);
    this.checkMobile();
    dispatch({
      type: 'lobby/setLobbyRoute',
      payload: {
        lobbyRoute: {
          index: 0,
          route: [
            {
              pathname: pathname,
              query: query
            }
          ]
        }
      }
    });
    // this.resizeListener();
  }

  // componentDidMount(){
  //   // this.screenChange();
  // }

  screenChange = () => {
    window.addEventListener('resize', this.resize);
  };

  resizeListener(){
    const { lobby } = this.props;
    const { isPlay } = lobby;
    if(document.documentElement.clientWidth > document.documentElement.clientHeight && !isPlay){
      this.setState({
        isLandscape: true
      })
    }else{
      this.setState({
        isLandscape: false
      })
    }
  }
  
  checkMobile = () =>{
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(
            /iphone|ipod|ios|android|nokia|Windows Phone OS|blackberry|webos|MeeGo|smartphone|symbian|s60|Series60|ucweb|uc brower|opera mini|opera mobi|mini 9.5|320x320|240x320|176x220|320*480|480*320|240*320|320*320|176*220|vx1000|lge|m800|e860|u940|ux840|compal|wireless|mobi|ahong|lg380|lgku|lgu900|lg210|lg47|lg920|lg840|lg370|sam-r|mg50|s55|g83|t66|vx400|mk99|d615|d763|el370|sl900|mp500|samu3|samu4|vx10|xda_|samu5|samu6|samu7|samu9|a615|b832|m881|s920|n210|s700|c-810|_h797|mob-x|sk16d|848b|mowser|s580|r800|471x|v120|rim8|c500foma:|160x|x160|480x|x640|t503|w839|i250|sprint|w398samr810|m5252|c7100|mt126|x225|s5330|s820|htil-g1|fly v71|s302|-x113|novarra|k610i|-three|8325rc|8352rc|sanyo|vx54|c888|nx250|n120|mtk |c5588|s710|t880|c5005|i;458x|p404i|s210|c5100|teleca|s940|c500|s590|foma|samsu|vx8|vx9|a1000|_mms|myx|a700|gu1100|bc831|e300|ems100|me701|me702m-three|sd588|s800|8325rc|ac831|mw200|brew |d88|htc\/|htc_touch|355x|m50|km100|d736|p-9521|telco|sl74|ktouch|m4u\/|me702|8325rc|kddi|phone|lg |sonyericsson|samsung|240x|x320|vx10|nokia|sony cmd|motorola|up.browser|up.link|mmp|symbian|smartphone|midp|wap|vodafone|o2|pocket|mobile|psp|treo/i
        )) {
        // console.log('移动端')
        
    }else{
      window.location.href = window.location.origin + '/web' //移动端地址
    }
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, lobby } = this.props;
    const { lobbyRoute = {} } = lobby;
    const { route, index } = lobbyRoute;
    if (nextProps.location.pathname !== this.props.location.pathname) {
      if (nextProps.location.search.indexOf('lobbyjump') === -1) {
        const nextRoute = {
          pathname: nextProps.location.pathname,
          query: nextProps.location.query
        };
        const newRoute = [...route];
        newRoute.splice(index + 1, 0, nextRoute);
        dispatch({
          type: 'lobby/setLobbyRoute',
          payload: {
            lobbyRoute: {
              index: index + 1,
              route: newRoute
            }
          }
        });
      }
    }
  }
  render() {
    return <div className={styles['lobby-page-wrap']}>{this.props.children}</div>;
  }
}

export default withRouter(BasicLayout);
