import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';

@connect(({ gameDetail, loading }) => ({
  gameDetail,
  loading: loading.models.gameDetail
}))
class Recent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {},
      detailID: null,
      game_recent_updates: [],
      isShowMore: false
    };
  }

  /**
   * 获取版本记录信息
   *
   * @param {string}  detailID
   */
  getRecentUpdateData = detailID => {
    const { dispatch } = this.props;

    dispatch({
      type: 'gameDetail/getGameRecentUpdate',
      payload: {
        id: detailID
      },
      callback: data => {
        this.setState(
          {
            game_recent_updates: [...data]
          },
          () => {
            this.handleIsShowMore();
          },
        );
      }
    });
  };

  /**
   * 判断处理，是否展示 “more” 按钮
   */
  handleIsShowMore = () => {
    const CONTENT = document.getElementById('content');
    const containerH = CONTENT.clientHeight;

    this.setState(
      {
        isShowMore: containerH > 165
      },
      () => {
        setTimeout(() => {
          CONTENT.style.maxHeight = '165px';
        }, 500);
      },
    );
  };

  /**
   * 展示更多描述
   */
  showMore = () => {
    const CONTENT = document.getElementById('content');

    CONTENT.style.maxHeight = 'inherit';
    this.setState({
      isShowMore: false
    });
  };

  componentWillReceiveProps(nextProps) {
    const { detailInfo, detailID } = nextProps;

    if (detailID !== this.state.detailID) {
      this.setState(
        {
          detailInfo: { ...detailInfo },
          detailID: detailID
        },
        () => {
          this.getRecentUpdateData(detailID);
        },
      );
    }
  }

  render() {
    const { game_recent_updates, isShowMore } = this.state;

    return (
      <div className={styles['recent-block']} key="recent-block">
        <h3 className={styles['title']}>{formatMessage({ id: 'detail_recent_updates' })}</h3>
        <div className={styles['content']} id="content">
          {game_recent_updates.map((item, index) => (
            <div className={styles['part']} key={index}>
              <p className={styles['sub-title']}>
                {formatMessage({ id: 'detail_version' })}:{item.ver}
              </p>
              <p className={styles['text']}>{item.details}</p>
            </div>
          ))}
          {isShowMore ? (
            <span className={styles['btn-more']} onClick={() => this.showMore()}>
              {formatMessage({ id: 'detail_more' })}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Recent;
