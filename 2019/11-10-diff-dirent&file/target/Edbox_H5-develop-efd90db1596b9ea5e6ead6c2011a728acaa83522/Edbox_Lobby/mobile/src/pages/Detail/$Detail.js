import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal, Toast } from 'antd-mobile';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import Intro from './components/intro';
import Carousel from './components/carousel';
import Description from './components/description';
import Reviews from './components/reviews';
import Recent from './components/recent';
import Original from './components/original';
import Base from './components/base';
import FullPageIframe from '@/components/FullPageIframe';
import FullPageLoading from '@/components/FullPageLoading';
import styles from './index.scss';

const { Edbox } = window;

@connect(({ lobby, gameDetail, loading }) => ({
  lobby,
  gameDetail,
  loading: loading.models.gameDetail
}))
class GameDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {},
      detailID: null,
      coverImg: '',
      tagsList: [],
      thumbnailList: [],
      originalList: [],
      sameTemplateList: [],
      playGameUrl: '',
      isVertical: true,
      playVisible: false,
      unSupportTipVisible: false
    };
  }

  /**
   *  返回上一级
   */
  goBack = () => {
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
    } else {
      router.push({
        pathname: '/'
      });
    }
  };

  /**
   * 获取游戏详情
   */
  getDetailInfo = detailID => {
    const { dispatch, match } = this.props;
    const {
      params: { Detail = null }
    } = match;

    dispatch({
      type: 'gameDetail/getDetail',
      payload: {
        detail_id: detailID || Detail
      },
      callback: data => {
        if (data.baseid) {
          this.setState(
            {
              detailInfo: data,
              detailID: detailID || Detail
            },
            () => {
              this.getOriginalTemplateData(data.baseid, data.base_version);
              this.getSameTemplateData(detailID || Detail);
            },
          );
        }
      }
    });
  };

  /**
   * 获取原始模板数据
   *
   * @param {string} base_id
   * @param {string} base_version
   */
  getOriginalTemplateData = (base_id, base_version) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'gameDetail/getGameOriginalTpl',
      payload: {
        id: base_id,
        version: base_version
      },
      callback: data => {
        if (data.error) {
          return false;
        }

        this.handleOriginalTemplateData(data);
      }
    });
  };

  /**
   * 处理原始模板数据
   *
   * @param {object} datas
   */
  handleOriginalTemplateData = datas => {
    const { dispatch } = this.props;

    dispatch({
      type: 'gameDetail/getImageUrl',
      payload: {
        resourceid: datas.game_icon
      },
      callback: data => {
        const tempArr = [
          {
            URL: data,
            game_description: datas.game_description,
            game_name: datas.game_name,
            id: datas.id
          }
        ];
        this.setState({
          originalList: tempArr
        });
      }
    });
  };

  /**
   * 获取相同模板数据
   *
   * @param {string} detailID
   */
  getSameTemplateData = detailID => {
    const { dispatch } = this.props;

    dispatch({
      type: 'gameDetail/getGameSameTpl',
      payload: {
        id: detailID
      },
      callback: data => {
        if (data.error) {
          return false;
        }

        this.handleSameTemplateData(data);
      }
    });
  };

  /**
   * 处理相同模板数据
   *
   * @param {array} datas
   */
  handleSameTemplateData = datas => {
    const { dispatch } = this.props;
    const tempArr = datas.map(item => {
      return item.game_icon;
    });

    dispatch({
      type: 'gameDetail/getImgBatch',
      payload: {
        resourceid: [...tempArr]
      },
      callback: imgData => {
        const sameTemplateList = tempArr.map((item, index) => {
          return {
            Guid: imgData[item].Guid,
            Url: imgData[item].Url,
            id: datas[index].id,
            game_name: datas[index].game_name,
            tags: datas[index].tags,
            game_score: datas[index].game_score
          };
        });

        this.setState({
          sameTemplateList: [...sameTemplateList]
        });
      }
    });
  };

  onArouseGameModal = id => {
    const { dispatch } = this.props;
    const taskId = Edbox.GetGUID();

    dispatch({
      type: 'gameDetail/openGame',
      payload: {
        appid: id,
        playType: 3,
        version: '',
        taskId: taskId
      },
      callback: data => {
        if (data.Code && data.Code === 'WEBGAME') {
          // 打开H5游戏
          this.setState({
            playVisible: true,
            playGameUrl: data.Message.Url,
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

  /**
   * 关闭窗口
   */
  handleCtrlModal = (visibleAttr, val) => {
    this.setState({
      [visibleAttr]: val
    });
  };

  /**
   * 控制收藏
   *
   * @param {number} like
   */
  toggleCollectGame = like => {
    const { detailInfo, detailID } = this.state;
    const { dispatch } = this.props;

    detailInfo.like = like === 1 ? 0 : 1;
    this.setState(
      {
        detailInfo: { ...detailInfo }
      },
      () => {
        if (like === 1) {
          dispatch({
            type: 'gameDetail/gameCollectCancel',
            payload: {
              id: detailID
            },
            callback: data => {
              if (data && data.error) {
                console.log(data);
                return false;
              }

              Toast.success(formatMessage({ id: 'detail_collect_cancel' }));
            }
          });
        } else {
          dispatch({
            type: 'gameDetail/gameCollect',
            payload: {
              id: detailID
            },
            callback: data => {
              if (data && data.error) {
                console.log(data);
                return false;
              }

              Toast.success(formatMessage({ id: 'detail_collect' }));
            }
          });
        }
      },
    );
  };

  componentWillMount() {
    this.getDetailInfo();
  }

  componentWillReceiveProps(nextProps) {
    const { match } = nextProps;
    const {
      params: { Detail = null }
    } = match;

    if (Detail !== this.props.match.params.Detail) {
      this.getDetailInfo(Detail);
    }
  }

  render() {
    const {
      detailInfo,
      detailID,
      originalList,
      sameTemplateList,
      playGameUrl,
      isVertical,
      playVisible,
      unSupportTipVisible
    } = this.state;
    const { gameOriginalTpl_display, gameSameTpl_display, like } = detailInfo;
    const { loading } = this.props;

    return (
      <div className={styles['detail-page-wrap']}>
        <FullPageLoading visible={loading} />
        <div className={styles['detail-page']}>
          <header className={styles['header']}>
            <span className={styles['btn-back']} onClick={() => this.goBack()}>
              <i className={styles['ico-back']} />
            </span>
          </header>
          <div className={styles['body']} id="main">
            <div className={styles['general-block']}>
              <Intro detailInfo={detailInfo} detailID={detailID} />
            </div>
            <div className={styles['general-block']}>
              <Carousel detailInfo={detailInfo} detailID={detailID} />
            </div>
            <div className={styles['general-block']}>
              <Description detailInfo={detailInfo} detailID={detailID} />
            </div>
            <div className={styles['general-block']}>
              <Reviews
                detailInfo={detailInfo}
                detailID={detailID}
                onUpdate={() => this.getDetailInfo()}
              />
            </div>
            <div className={styles['general-block']}>
              <Recent detailInfo={detailInfo} detailID={detailID} />
            </div>
            {gameOriginalTpl_display === 0 && originalList.length ? (
              <div className={styles['general-block']}>
                <Original
                  detailID={detailID}
                  originalList={originalList}
                  onArouseGame={this.onArouseGameModal}
                />
              </div>
            ) : null}
            {gameSameTpl_display === 0 && sameTemplateList.length ? (
              <div className={styles['general-block']}>
                <Base
                  detailID={detailID}
                  sameTemplateList={sameTemplateList}
                  onArouseGame={this.onArouseGameModal}
                />
              </div>
            ) : null}
          </div>
          <footer className={styles['footer']}>
            <span className={styles['btn-collect']} onClick={() => this.toggleCollectGame(like)}>
              <i
                className={
                  like === 1
                    ? `${styles['ico-collect']} ${styles['active']}`
                    : styles['ico-collect']
                }
              />
            </span>
            <Button
              type="primary"
              className={styles['btn-play']}
              onClick={() => this.onArouseGameModal(detailID)}
            >
              {formatMessage({ id: 'detail_play' })}
            </Button>
          </footer>
        </div>
        <FullPageIframe
          isVertical={isVertical}
          visible={playVisible}
          url={playGameUrl}
          onClose={() => {
            this.handleCtrlModal('playVisible', false);
          }}
        />

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
      </div>
    );
  }
}

export default GameDetail;
