import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';

@connect(({ gameDetail, loading }) => ({
  gameDetail,
  loading: loading.models.gameDetail
}))
class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {},
      detailID: null,
      thumbnailList: []
    };
  }

  /**
   * 获取游戏 banner
   *
   * @param {array} imgId
   */
  getGameBannerBatch = imgId => {
    const { dispatch } = this.props;

    dispatch({
      type: 'gameDetail/getImgBatch',
      payload: {
        resourceid: [...imgId]
      },
      callback: data => {
        const tempArr = Object.keys(data).length
          ? imgId.map(item => {
              return {
                Guid: data[item].Guid,
                Url: data[item].Url
              };
            })
          : [];
        this.setState({
          thumbnailList: [...tempArr]
        });
      }
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
          this.getGameBannerBatch(detailInfo.game_img_thumbnail);
        },
      );
    }
  }

  render() {
    const {
      detailInfo: {
        game_score,
        game_experienced,
        game_reviews,
        reviews_display,
        experienced_display
      },
      thumbnailList
    } = this.state;

    return (
      <div className={styles['carouse-block']} key="carouse-block">
        {game_score > 0 ? (
          <div className={styles['carouse-head']}>
            <em className={styles['num']}>{game_score}</em>
            <p className={styles['star-box']}>
              <i
                className={styles['light-star']}
                style={{
                  width: `${(parseInt(game_score) / 5) * 100}%`
                }}
              />
            </p>
            <p className={styles['text']}>
              {experienced_display === 0 ? (
                <span>
                  {game_experienced} {formatMessage({ id: 'detail_experienced' })} ·
                </span>
              ) : null}
              {reviews_display === 0 ? (
                <span>
                  {game_reviews} {formatMessage({ id: 'detail_reviews' })}
                </span>
              ) : null}
            </p>
          </div>
        ) : (
          <div className={styles['carouse-head']}>
            <em className={styles['num']}>0.0</em>
            <div className={styles['no-enough']}>
              {formatMessage({ id: 'detail_less_reviews_num' })}
            </div>
          </div>
        )}
        {thumbnailList.length ? (
          <div className={styles['carouse-main']}>
            <div
              className={styles['img-block']}
              style={{ width: `${460 * thumbnailList.length - 20}px` }}
            >
              {thumbnailList.map(item => (
                <img
                  className={thumbnailList.length === 1 ? styles['one-img'] : styles['img']}
                  src={item.Url}
                  key={item.Guid}
                  alt=""
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Carousel;
