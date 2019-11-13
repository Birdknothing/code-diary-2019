import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { Spin } from 'antd';
import { Modal } from 'antd-mobile';
import styles from './index.scss';
import defaultIcon from '../../assets/default.jpg';
import noDataImg from '../../assets/img_nocontent.png';

import ScrollTop from '@/components/ScrollTop';
import FullPageIframe from '@/components/FullPageIframe';
import FullPageLoading from '@/components/FullPageLoading';

import InfiniteScroll from 'react-infinite-scroller';
const { Edbox } = window;

/*
 * 体验区游戏列表滚动加载组件（用于类体验区游戏滚动含搜索）
 * @param {String} parentId：滚动容器id，必填
 * @param {Function} onGetData：滚动过程获取数据的函数，必填，该函数的回调一定要传数据(data)、数据总数(count)、封面图数据(imgBox)
 * @param {Object} noDataTip：当列表没有数据时的提示，传html结构比如<p>xxx</p>，必填
 */
@connect(({ lobby, loading }) => ({
  lobby,
  openGameLoading: loading.effects['lobby/openGame']
}))
class GameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      imgBox: [],
      loading: true,
      hasMore: true,
      count: 0,
      playVisible: false,
      unSupportTipVisible: false,
      playGameUrl: '',
      isVertical: true // 是否是竖屏
    };
  }

  componentDidMount() {
    this.getData();
  }

  handleInfiniteOnLoad = () => {
    const { listData, count, page } = this.state;
    this.setState({
      loading: true
    });
    if (listData.length >= count) {
      this.setState({
        hasMore: false,
        loading: false
      });
      return;
    }
    this.getData(page);
  };

  getData = () => {
    this.setState({
      loading: true
    });
    const { onGetData } = this.props;
    onGetData((data, count, imgBox) => {
      // console.log('总条数：', count, data);
      this.setState({
        listData: [...data],
        count,
        imgBox: imgBox,
        loading: false
      });
    });
  };

  // 试玩打开游戏
  handleOpenGame = (e, id) => {
    const { dispatch } = this.props;
    const taskId = Edbox.GetGUID();
    e.stopPropagation();
    dispatch({
      type: 'lobby/openGame',
      payload: {
        appid: id,
        playType: 3,
        version: '',
        taskId: taskId
      },
      callback: data => {
        if (data.Code && data.Code === 'WEBGAME') {
          console.log(data.Message);

          // 打开H5游戏
          this.setState({
            playVisible: true,
            playGameUrl: data.Message.Url,
            // isVertical:false
            isVertical: data.Message.width > data.Message.height ? false : true
          });
        } else {
          // 否则不支持，提示pc打开
          this.setState({
            unSupportTipVisible: true
          });
        }
      }
    });
  };

  handleCtrlModal = (visibleAtrr, val) => {
    this.setState({
      [visibleAtrr]: val
    });
  };

  goToDetail = id => {
    router.push('/Detail/' + id);
  };

  render() {
    const {
      listData,
      loading,
      hasMore,
      count,
      imgBox,
      playVisible,
      playGameUrl,
      unSupportTipVisible,
      isVertical
    } = this.state;
    const { parentId, noDataTip, openGameLoading } = this.props;

    return (
      <Fragment>
        <ScrollTop el={document.getElementById(parentId)} />
        {listData.length ? (
          <InfiniteScroll
            initialLoad={true}
            pageStart={1}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={!loading && hasMore}
            useWindow={false}
            threshold={10}
            getScrollParent={() => document.getElementById(parentId)}
          >
            {listData.map((obj, index) => (
              <div className={`${styles['list-item']} game-list-item`} key={index}>
                <img
                  className={styles['img']}
                  src={imgBox[index] ? imgBox[index] : defaultIcon}
                  alt=""
                  onClick={() => {
                    this.goToDetail(obj.id);
                  }}
                />
                <div className={styles['right-wrap']}>
                  <div
                    className={styles['txt-wrap']}
                    onClick={() => {
                      this.goToDetail(obj.id);
                    }}
                  >
                    <h3 className={styles['tit']}>{obj.game_name}</h3>
                    <p className={styles['intro']}>{obj.tags && obj.tags.join('/')}</p>
                    {obj.game_score > 0 ? (
                      <div className={styles['rank-wrap']}>
                        <p className={styles['rank']}>
                          <span
                            className={styles['active']}
                            style={{ width: `${(obj.game_score / 5) * 100}%` }}
                          ></span>
                          <span className={styles['bg']}></span>
                        </p>
                        <span className={styles['num']}>
                          {Math.floor(obj.game_score * 10) / 10}
                        </span>
                      </div>
                    ) : (
                      <div className={styles['no-rank-tip']}>
                        {formatMessage({ id: 'wh_less_reviews' })}
                      </div>
                    )}
                  </div>
                  <span
                    className={styles['btn-play']}
                    onClick={e => this.handleOpenGame(e, obj.id)}
                  ></span>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        ) : (
          <Fragment>
            {loading ? null : (
              <div className={styles['no-data-wrap']}>
                <div className={styles['no-data']}>
                  <img src={noDataImg} alt="" className={styles['img']} />
                  <div className={styles['txt']}>{noDataTip}</div>
                </div>
              </div>
            )}
          </Fragment>
        )}
        {loading ? (
          <div className={styles['loading-wrap']}>
            <Spin size="large" />
          </div>
        ) : null}
        {!loading && listData.length && listData.length >= count ? (
          <p className={styles['loading-finish-tip']}>{formatMessage({ id: 'wh_loaded_tip' })}</p>
        ) : null}
        <FullPageIframe
          isVertical={isVertical}
          visible={playVisible}
          url={playGameUrl}
          onClose={() => {
            this.handleCtrlModal('playVisible', false);
          }}
        />
        <FullPageLoading visible={openGameLoading} />
        <Modal
          visible={unSupportTipVisible}
          transparent
          maskClosable={true}
          onClose={this.onClose}
          title={formatMessage({ id: 'wh_tip_title' })}
          footer={[
            {
              text: formatMessage({ id: 'layout_btn_sure' }),
              onPress: () => {
                this.handleCtrlModal('unSupportTipVisible', false);
              }
            }
          ]}
        >
          <p className="pop-tip">{formatMessage({ id: 'wh_open_fail_tip' })}</p>
        </Modal>
      </Fragment>
    );
  }
}

export default GameList;
