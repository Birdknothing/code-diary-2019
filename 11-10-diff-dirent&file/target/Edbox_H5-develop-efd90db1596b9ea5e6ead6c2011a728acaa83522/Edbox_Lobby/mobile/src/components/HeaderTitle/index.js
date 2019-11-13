import React, { Component, Fragment } from 'react';
import styles from './index.scss';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';

import SearchBar from '@/components/SearchBar';

/*
 * 标题头部组件
 * @param {String} title: 页面标题，选填，默认为空
 * @param {Boolean} hasBtnBack：是否需要返回按钮，选填，默认true
 * @param {Boolean} hasSearch：是否需要搜索框，选填，默认false
 * @param {Function} onSearch：当hasSearch为真，搜索事件，选填，默认空函数
 * @param {Function} onChange：当hasSearch为真，搜索框内容的改变，选填
 * @param {Function} onFocus：当hasSearch为真，搜索框聚焦事件，选填
 * @param {String} defaultValue：当hasSearch为真，搜索框的默认值，选填
 * @param {Boolean} useAnimation：当hasSearch为真，是否需要进入动画
 */
@connect(({ lobby }) => ({
  lobby: lobby
}))
class HeaderTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // 返回上一页
  // goBack = () => {
  //   router.go(-1);
  // };
  goBack = () => {
    // router.goBack()
    const { lobby, dispatch } = this.props;
    const { lobbyRoute } = lobby;
    const { index, route } = lobbyRoute;
    if (index > 0 && route.length > 1) {
      dispatch({
        type: 'lobby/setLobbyRoute',
        payload: {
          lobbyRoute: {
            ...lobbyRoute,
            index: index - 1
          }
        }
      });
      router.push({
        pathname: route[index - 1].pathname,
        query: {
          ...route[index - 1].query,
          lobbyjump: 'jump'
        }
      });
    }else{
      router.push({
        pathname: '/'
      });
    }
  };

  goToSearch = () => {
    // 设置全局搜索关键词
    const {dispatch} = this.props;
    dispatch({
      type:'lobby/setGlobalSearchKey',
      payload:{globalSearchKey:''}
    });

    router.push({
      pathname: '/Search/'
    });
  };

  render() {
    const {
      title = '',
      hasBtnBack = true,
      hasSearch = false,
      onSearch = () => {},
      onChange,
      defaultValue,
      onFocus,
      useAnimation = false
    } = this.props;
    return (
      <div className={`${styles['back-header-bar']} ${useAnimation ? styles['animation'] : ''}`}>
        <div className={styles['left-opr']}>
          {hasBtnBack ? <span className={styles['btn-back']} onClick={this.goBack}></span> : null}
        </div>
        {hasSearch ? (
          <div className={styles['search']}>
            <SearchBar
              placeholder={formatMessage({ id: 'layout_placeholder' })}
              onSearch={onSearch}
              onChange={onChange}
              onFocus={onFocus}
              defaultValue={defaultValue}
            />
          </div>
        ) : (
          <Fragment>
            <h2 className={styles['tit']}>{title}</h2>
            <div className={styles['right-opr']}>
              <span className={styles['ico-search']} onClick={this.goToSearch}></span>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default HeaderTitle;
