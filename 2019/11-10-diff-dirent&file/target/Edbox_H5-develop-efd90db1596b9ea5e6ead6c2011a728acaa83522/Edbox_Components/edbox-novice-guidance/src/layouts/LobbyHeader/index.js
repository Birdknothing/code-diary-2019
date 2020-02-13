import React, { Component } from 'react';
import { connect } from 'dva'
import withRouter from 'umi/withRouter';
import { Popover,Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import defaultAvatar from '@/assets/avatar_default.jpg';
import logo from '@/assets/layout/logo.png';
import entrance_message from '@/assets/layout/pic-entrance-message.png'

@connect(({ global }) => ({
  global,
}))
class LobbyHeader extends Component {
    constructor(props){
        super(props)
        this.state = {
          isWeb: true,
        }
    }

    componentDidMount() {
      // 获取头像和昵称
      const {dispatch} = this.props;
      dispatch({
        type:'global/getUserInfo',
      });
    }

    render() {
        const { global } = this.props
        const { userInfo={} } = global
        const { name, avatarUrl } = userInfo
        const { searchName, isWeb } = this.state
        const content = (
            <div className={'header-option'} style={{display:'none'}}>
              <p><span className={'icon-man'}></span>{formatMessage({id:'lobby_personal_center'})}</p>
              <p><span className={'icon-install'}></span>{formatMessage({id:'lobby_setting'})}</p>
              <p><span className={'icon-advise'}></span>{formatMessage({id:'lobby_suggest_feedback'})}</p>
              <p><span className={'icon-quit'} ></span>{formatMessage({id:'lobby_logout'})}</p>
            </div>
        );
        return (
            <header className={'layout-header clearfix'}>
                <h1 className={'logo'}><img src={logo} alt=""/></h1>
                <div className={'btn-router'}>
                    <Popover placement="bottom" mouseEnterDelay={0.4} overlayClassName={'target-tips'} content={formatMessage({id:'layout_back'})}>
                        <span className={`${'router-prev'} disable`} ></span>
                    </Popover>
                    <Popover placement="bottom" mouseEnterDelay={0.4} overlayClassName={'target-tips'} content={formatMessage({id:'layout_go'})}>
                        <span className={`${'router-next'} disable`}></span>
                    </Popover>
                </div>
                <div className={'layout-search'}>
                    <i className={'search-icon'}></i>
                    <input
                    onKeyDown={(e)=>this.handleSearch(e)}
                    placeholder={formatMessage({id:'layout_placeholder'})}/>
                    {
                        searchName !==''?
                        <Icon className={'search-clear'} style={{marginLeft:'17px'}} type="close-circle" />
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

                <div className={'option-entrance'}>
                    <Popover placement="bottom" mouseEnterDelay={0.4} overlayClassName={'target-tips'} content={formatMessage({id:'layout_message'})}>
                        <span style={{paddingTop:'5px'}}><img src={entrance_message} alt=""/></span>
                    </Popover>
                </div>
                <Popover overlayClassName={'header-pop'} placement="bottomRight" content={content} trigger="click">
                <div className={'userinfo'}>
                    <span className={'portrait'}><img src={avatarUrl?avatarUrl:defaultAvatar} alt=""/></span>
                    <span className={'name'}>{name?name:'-'}</span>
                    <i className={'arrow'}></i>
                </div>
                </Popover>
            </header>
        );
    }
}

export default withRouter(LobbyHeader);
