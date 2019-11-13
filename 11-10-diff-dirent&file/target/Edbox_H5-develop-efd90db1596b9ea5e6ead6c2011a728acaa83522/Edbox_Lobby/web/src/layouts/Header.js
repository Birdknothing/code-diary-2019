import React, { Component } from 'react';
import { connect } from 'dva'
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { Popover, Modal, Icon, Badge } from 'antd';
import { formatMessage } from 'umi/locale';
import defaultAvatar from '@/assets/personalcenter/avatar_default.jpg';

const { Edbox, secode } = window;
@connect(({ lobby }) => ({
    lobby: lobby
}))
class Header extends Component {
    constructor(props){
        super(props)
        this.state = {
            searchName: '',
            visibleIframe: false,
            webIMUrl: '',
            isWeb: false,
            badge: false
        }
    }
    componentWillMount(){
        const { dispatch, location } = this.props
        dispatch({
            type: 'lobby/getUserInfo',
            payload: {}
        })        

        if(secode === undefined){
            // console.log('非内嵌浏览器')
            this.setState({
                isWeb: true
            })
        }
        const { query, pathname } = location
        // const searchKey = search.indexOf('jump') === -1 ? search : '';
        dispatch({
            type:'lobby/setLobbyRoute',
            payload:{
                lobbyRoute:{
                    index: 0,
                    route: [{
                        pathname: pathname,
                        query:query
                    }]
                }
            }
        })
    }

    handleMini = () =>{
        secode.Minimize();
    }

    handleMax = () =>{
        secode.Maximize();
    }

    handleClose = () =>{
        Edbox.DataStatistic.ClickEvent('CloseLobby','MainPage','')
        secode.Close();
    }

    goBack = () =>{
        // router.goBack()
        const { lobby, dispatch } = this.props
        const { lobbyRoute } = lobby
        const { index, route } = lobbyRoute
        // console.log(index,route.length)
        if(index > 0 && route.length > 1){
            dispatch({
                type:'lobby/setLobbyRoute',
                payload:{
                    lobbyRoute:{
                        ...lobbyRoute,
                        index: index - 1
                    }
                }
            })
            router.push({
                pathname: route[index - 1].pathname,
                query:{
                    ...route[index - 1].query,
                    lobbyjump: 'jump'
                }
            })
        }
    }
    goTo = () =>{
        // router.go(index)
        const { lobby, dispatch } = this.props
        const { lobbyRoute } = lobby
        const { index, route } = lobbyRoute

        if(index < route.length - 1 && route.length !== 0){
            dispatch({
                type:'lobby/setLobbyRoute',
                payload:{
                    lobbyRoute:{
                        ...lobbyRoute,
                        index: index + 1
                    }
                }
            })
            router.push({
                pathname: route[index + 1].pathname,
                query:{
                    ...route[index + 1].query,
                    lobbyjump: 'jump'
                }
            })
        }

    }
    goToHome = (url) =>{
        if(url === this.props.location.pathname){
            return
        }
        router.push(url)
    }

    showFeedBack = () =>{
        this.props.onClickFeedBack()
        Edbox.DataStatistic.ClickEvent('Feedback','MainPage','')
    }

    // 路由跳转
    goToRouter=(routerName)=>{
      router.push(routerName);
      if(routerName === '/PersonalCenter/PersonalCenter'){
        Edbox.DataStatistic.ClickEvent('Profile','MainPage','')
      }
      if(routerName === '/Setting'){
        Edbox.DataStatistic.ClickEvent('Settings','MainPage','')
      }
    }

    handleSearch = e =>{
        const { dispatch, lobby } = this.props
        const { globalSearchIndex } = lobby
        if(e.keyCode === 13){
            dispatch({
                type:'lobby/setGlobalSearchKey',
                payload: {
                    globalSearchKey: e.target.value,
                    globalSearchIndex: globalSearchIndex + 1
                }
            })
        }
    }
    handleClearSearch = () =>{
        this.setState({
            searchName: ''
        })
    }
    handleSearchChange = (e) =>{
        this.setState({
            searchName: e.target.value
        })
    }

    componentWillReceiveProps(nextProps){
        const { dispatch, lobby } = this.props
        const { lobbyRoute={} } = lobby
        const { route, index } = lobbyRoute
        if(nextProps.location.pathname !== this.props.location.pathname){
            dispatch({
                type:'lobby/setGlobalSearchKey',
                payload: {
                    globalSearchKey: '',
                    globalSearchIndex: 0
                }
            })
            // console.log('跳转到：',this.props.location.pathname)
            if(nextProps.location.search.indexOf('lobbyjump') === -1){
                // console.log('保存:',route)
                const nextRoute = {
                    pathname: nextProps.location.pathname,
                    query:nextProps.location.query
                }
                const newRoute = [...route]
                newRoute.splice(index+1,0,nextRoute)
                dispatch({
                    type:'lobby/setLobbyRoute',
                    payload:{
                        lobbyRoute:{
                            index: index+1,
                            route: newRoute
                        }
                    }
                })
            }

        }
        if(nextProps.lobby.globalSearchKey === ''){
            this.setState({
                searchName: ''
            })
        }
    }
    edboxLogout=()=>{
      Edbox.Logout(()=>{
        window.location.hash="";
        window.location.reload();
      });
      Edbox.DataStatistic.ClickEvent('Logout','MainPage','')
    }

    handleIM = () =>{
        const { dispatch } = this.props
        dispatch({
            type:'lobby/getWebIMUrl',
            payload:{},
            callback:(data)=>{
                // console.log(data)
                if(data.data){
                    console.log('启动IM失败',data)
                }else{
                    this.setState({
                        visibleIframe: true,
                        webIMUrl: data
                    })
                }
            }
        })
    }

    handleOk = () =>{
        this.setState({
            visibleIframe: false,
        })
    }

    handleHeadOption = (visible) =>{
        if(visible){
            const { dispatch } = this.props
            dispatch({
                type:'lobby/getUnReplyFeedBacks',
                payload:{},
                callback:(data)=>{
                    if(data){
                        this.setState({
                            badge: false
                        })
                    }else{
                        this.setState({
                            badge: true
                        })
                    }
                }
            })
        }
    }

    render() {
        const { lobby } = this.props
        const { userInfo={}, lobbyRoute } = lobby
        const { index, route } = lobbyRoute
        const { name, avatarUrl } = userInfo
        const { searchName, visibleIframe, webIMUrl, isWeb } = this.state
        const logo = require('../assets/layout/logo.png')
        const entrance_message = require('../assets/pic/pic-entrance-message.png')
        const content = (
            <div className={'header-option'}>
              <p onClick={()=>this.goToRouter('/PersonalCenter/PersonalCenter')}><span className={'icon-man'}></span>{formatMessage({id:'lobby_personal_center'})}</p>
              <p onClick={()=>this.goToRouter('/Setting')}><span className={'icon-install'}></span>{formatMessage({id:'lobby_setting'})}</p>
              <p onClick={this.showFeedBack}><span className={'icon-advise'}></span>
              <Badge dot={this.state.badge}>{formatMessage({id:'lobby_suggest_feedback'})}</Badge></p>
              <p onClick={this.edboxLogout}><span className={'icon-quit'} ></span>{formatMessage({id:'lobby_logout'})}</p>
            </div>
        );
        const imgTitle = (
            <div className={'im-title'}>
                <h1 className={'logo'} onClick={()=>this.goToHome('/')}><img src={logo} alt=""/></h1>
                <span>{formatMessage({id:'layout_message'})}</span>
            </div>
        )
        return (
            <header className={'layout-header clearfix'}>
                <h1 className={'logo'} onClick={()=>this.goToHome('/')}><img src={logo} alt=""/></h1>
                <div className={'btn-router'}>
                    <Popover placement="bottom" mouseEnterDelay={0.4} overlayClassName={'target-tips'} content={formatMessage({id:'layout_back'})}>
                        <span className={`${'router-prev'} ${(index > 0 && route.length > 1) ? '' : 'disable'}`} onClick={()=>this.goBack()}></span>
                    </Popover>
                    <Popover placement="bottom" mouseEnterDelay={0.4} overlayClassName={'target-tips'} content={formatMessage({id:'layout_go'})}>
                        <span className={`${'router-next'} ${(index >= route.length-1 || route.length === 0) ? 'disable' : ''}`} onClick={()=>this.goTo(1)}></span>
                    </Popover>
                </div>
                <div className={'layout-search'}>
                    <i className={'search-icon'}></i>
                    <input
                    value={searchName}
                    onKeyDown={(e)=>this.handleSearch(e)}
                    onChange={(e)=>this.handleSearchChange(e)}
                    placeholder={formatMessage({id:'layout_placeholder'})}/>
                    {
                        searchName !==''?
                        <Icon onClick={this.handleClearSearch} className={'search-clear'} style={{marginLeft:'17px'}} type="close-circle" />
                        :null
                    }
                </div>
                {
                    isWeb ? null :
                    <div className={'window-control'}>
                        <Popover placement="bottom" mouseEnterDelay={0.4} overlayClassName={'target-tips'} content={formatMessage({id:'layout_minimum'})}><span onClick={this.handleMini} className={'window-shrink'}></span></Popover>
                        <Popover placement="bottom" mouseEnterDelay={0.4} overlayClassName={'target-tips'} content={formatMessage({id:'layout_maximize'})}><span onClick={this.handleMax} className={'window-big'}></span></Popover>
                        <Popover placement="bottom" mouseEnterDelay={0.4} overlayClassName={'target-tips'} content={formatMessage({id:'layout_close'})}><span onClick={this.handleClose} className={'window-close'}></span></Popover>
                    </div>
                }

                {(Edbox.ServerKey === "US" || Edbox.ServerKey === "Beta") ? '' : <div className={'option-entrance'}>
                    <Popover placement="bottom" mouseEnterDelay={0.4} overlayClassName={'target-tips'} content={formatMessage({id:'layout_message'})}>
                        <span onClick={this.handleIM} style={{paddingTop:'5px'}}><img src={entrance_message} alt=""/></span>
                    </Popover>
                </div>}
                <Popover onVisibleChange={this.handleHeadOption} overlayClassName={'header-pop'} placement="bottomRight" content={content} trigger="hover">
                <div className={'userinfo'}>
                    <span className={'portrait'}><img src={avatarUrl?avatarUrl:defaultAvatar} onError={(e) => {e.target.onerror = null;e.target.src=defaultAvatar}} alt=""/></span>
                    <span className={'name'}>{name?name:'-'}</span>
                    <i className={'arrow'}></i>
                </div>
                </Popover>
                <Modal
                centered
                visible={visibleIframe}
                onCancel={this.handleOk}
                destroyOnClose={true}
                footer={null}
                title={imgTitle}
                width={960}
                style={{
                    height: '620px',
                    paddingBottom: 0
                }}
                // width={'80%'}
                // style={{
                //     height: '80%',
                // }}
                className="iframeIM"
                >
                <iframe
                src={webIMUrl}
                frameBorder="0"
                title="edbox"
                width="100%"
                height="100%"
                id="controlsFrame"
                name="controlsname"
                />
                </Modal>
            </header>
        );
    }
}

export default withRouter(Header);
