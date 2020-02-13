import React, { Component } from 'react';
import styles from './index.scss';
import { Layout, message } from 'antd';
import HeaderDom from './components/Header';
import Nav from './components/Nav';
import EditItem from './components/EditItem';
import ModalMessage from './components/ModalMessage';
import Controls from './components/Controls';
import IframeWindow from './components/IframeWindow';
import GameHandler from './components/GameHandler';
import LevelNav from './components/LevelNav';
import IframePage from './components/IframePage';
import PageLoading from '@/components/PageLoading';
import { ServerKey } from '@/utils/common';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { setLocale , getLocale } from 'umi/locale';
import { retryServerPic } from '@/utils/helper'


const { Edbox } = window;
Edbox.ServerKey = ServerKey;
const { Sider } = Layout;


@connect(({ edit, loading }) => ({
  edit,
  loading: true,
}))
class GameEdit extends Component {
  constructor(props) {
    super(props);
    const { dataSource = {} } = props;
    const { GloabalConfig = {} } = dataSource;
    const { Width = 0, Height = 0 } = GloabalConfig;
    this.state = {
      loading: props.loading,
      iframeStyle: {
        cursor: 'default',
        width: '900',
        display: 'none',
        isVertical:  (Width > Height) ? false : true
      },
      modalVisible : false,
      messageData: undefined, 
      collapsible: false,
      collapsed: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { edit = {} } = nextProps
    const { edit: tEdit = {} } = this.props
    const { currentData = {}, dataSource = {}  } = edit
    const { currentData: tCurrentData = {}, dataSource:tDataSource ={} } = tEdit
    const { GlobalConfig = {} } = dataSource;
    const { GlobalConfig: tGlobalConfig = {} } = tDataSource;
    const { Height = 0, Width = 0 } = GlobalConfig; //全局横竖屏配置
    const { Height: tHeight = 0, Width: tWidth = 0 } = tGlobalConfig;
    const { PageWidth = 900,  Class="Default", PageType = "Default"  } = currentData
    const isV = (Width > Height) ? false : true;  //判断横屏竖屏
    const tIsV = (tWidth > tHeight) ? false : true;
    const isLevel = Class === "LevelEdit"&& PageType === "Default" //判断是否关卡可视化
    const normal = document.getElementById('normal');
    const normalWidth = normal.offsetWidth
    
    const isMinHorizontal = isV && PageType === "Default" && normalWidth <= 1480
    const isMinVertical = !isV && PageType === "Default" && normalWidth <= 1680
    if (nextProps.loading !== this.state.loading) {
      this.setState({
        loading: true,
      });
    }
    if(currentData.ID !== tCurrentData.ID ){
      if(Class === "LevelEdit") {
        normal.style.minWidth = "1850px";
      }else {
        normal.style.minWidth = "1280px";
      }

      if(isLevel || isMinHorizontal || isMinVertical ) {
        this.setState({
          collapsible: true,
          collapsed: true
        })
      }else {
        this.setState({
          collapsible: false,
          collapsed: false
        })
      }
    }
    //默认配置的宽度
    if(currentData.ID !== tCurrentData.ID || isV !== tIsV ||  Class === "LevelEdit" ) {
      const main = document.getElementById('main');
      const resizeMe = document.getElementById('resizeMe');
      const defaultW = 800
      const mainW = main.offsetWidth;
      const resizeMeMinW = Class === "LevelEdit" ? 1122 : (Height && Width) ? isV ? 480 : 680 : 480;
      const resizeMeW = PageWidth < resizeMeMinW //判断设置宽度是否小于最小宽度， 小于值设置为最小宽度
                          ? resizeMeMinW  
                          :  (mainW - PageWidth) < defaultW  // 判断右侧的区间是否小于默认值，小于值设置为全部减去默认
                            ? mainW - defaultW 
                            : PageWidth; 
      resizeMe.style.width= ( Class === "LevelEdit" ? 1122 : resizeMeW < resizeMeMinW ? resizeMeMinW : resizeMeW) + "px";
    }
    //断网监听
    const isOffLine = retryServerPic();
    isOffLine.then(()=>{}, ()=> {
      message.error(formatMessage({ id: 'tip_msg' })); 
    })
    
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // Edbox.HideLogin();
    Edbox.Start(isLogin => {
      const url = Edbox.GetQueryString('Page');
      const pageurl = Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), url) + '&d=1';
      const { Language } = Edbox;
      const locale = {
        "English": 'en-US',
        "SimplifiedChinese": 'zh-CN',
        "TraditionalChinese": "zh-HK",
        "TraditionalChinese_TW": "zh-TW"
      }
      setLocale(locale[Language]);
      if(!url) {
        message.error(formatMessage({ id: 'error_address' }),0);
      }
     
      dispatch({
        type: 'edit/setLogin',
        payload: {
          isLogin: true,
          urlIframe: pageurl,
          locale: getLocale() === 'en-US' ? 'English' : 'Chinese'
        },
      });
      Edbox.EditorHelp.Init(
        success => {
          dispatch({
            type: 'edit/setHelpVisible',
            payload: {
              isHelpVisible: success
            },
          });
        }, 
        error => {});
      
    });

    window.onresize = () => {
      const { edit = {} } = this.props;
      const { currentData = {}, dataSource = {}  } = edit
      const { GlobalConfig = {} } = dataSource;
      const { Height = 0, Width = 0 } = GlobalConfig; //全局横竖屏配置
      const { PageType = "Default", Class } = currentData
      if(PageType !== "Default" || Class === "LevelEdit") { //关卡界面和不是可视化界面直接返回
        return;
      }
      const normal = document.getElementById('normal');
      const normalWidth = normal.offsetWidth
      const isV = (Width > Height) ? false : true;  //判断横屏竖屏
      const isMinHorizontal = isV && normalWidth <= 1480
      const isMinVertical = !isV && normalWidth <= 1680
      
      if( isMinHorizontal || isMinVertical ) {
        this.setState({
          collapsible: true,
          collapsed: true
        })
      }else {
        this.setState({
          collapsible: false,
          collapsed: false
        })
      }
      
    }
    // this.retryServerTest();
  }

  componentDidUpdate(nextProps) {
    // if (nextProps.edit.isLogin !== this.props.edit.isLogin) {
    //   // this.messageHandler();
    // }
    if (nextProps.loading === this.state.loading) {
      this.setState({
        loading: false,
      });
    }
    
  }




  onCollapse=(collapsed, type)=> {
    this.setState({
      collapsed: collapsed
    })
  }


  render() {
    const { edit =　{} } = this.props;
    const { iframeStyle, collapsible, collapsed} = this.state;
    const { currentData = {}, isLogin, controls } = edit;
    const { width } = iframeStyle;
    const { PageType = 'Default', Datas= [], IsLevelEdit, Class, Property = {}  } = currentData;
    const { ShowRestoreButton = false, ShowAddButton = false, ShowDeleteButton = false, ShowPageControl = false } = Property;
    
    const defaultShowHandler = !ShowRestoreButton && !ShowAddButton && !ShowDeleteButton && !ShowPageControl
    if (!isLogin) {
      return null;
    }
    //判断是否显示可视化关卡编辑
    let showLevelNav
    const hasTab = Datas.length? Datas[0].Type === "Tab02": false ;
    if (!hasTab) {
      showLevelNav = IsLevelEdit
    }else {
      showLevelNav = false
    }
    return (
      <Layout className={styles.layout}>
        {!currentData.ID ? <PageLoading /> : null}
        <HeaderDom />
        <Layout className={styles.edit}>
          <Sider collapsed={collapsed} collapsible={collapsible}  collapsedWidth="0" className="sider-nav" width= {220} onCollapse={this.onCollapse}>
            <Nav />
          </Sider>
          {(showLevelNav || Class === "LevelEdit" ) && PageType === 'Default' ?
            <LevelNav />
            : null
          }
          <Layout>
            <div
              className={styles.main}
              id="main"
            >
              <div
                className={
                  PageType === 'Default'
                    ? 'resizeMe'
                    : PageType === 'FullGame'
                    ? 'resizeMe'
                    : 'resizeMe resizeMeNone'
                }
                id="resizeMe"
                style={
                  PageType === 'Default'
                    ? {  width: width ? width : "40%" }
                    : PageType === 'FullGame'
                    ? { width: '100%' }
                    : null
                }
              >
                <span className={styles.hoverIframe}  id="hoverIframe" />
                <span className={styles.dragIframe} />
                { (PageType === 'Default' || PageType === 'FullGame') && !defaultShowHandler ?
                  <GameHandler />
                  : null
                }
                {(Class === "Loading" || Class === "Ranking" || Class === "Share") ? <IframePage iframeHeight = {showLevelNav ? true : false} /> : null}
                <IframeWindow iframeHeight = {(PageType === 'Default' || PageType === 'FullGame') && !defaultShowHandler  ? true : false} />
                
              </div>
              <div className={`${ PageType === 'Default'?  styles.drag : styles.dragHide}`} id="dragHandler"></div>
              {PageType === 'FullGame' ? null : (
                <div className={styles.items} id="leftItems">
                  <EditItem />
                </div>
              )}
              {!controls ? null : <Controls />}
            </div>
          </Layout>
        </Layout>
        <ModalMessage />
      </Layout>
    );
  }
}

export default GameEdit;
