import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';

@connect(({ gameDetail, loading }) => ({
  gameDetail,
  loading: loading.models.gameDetail
}))
class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {},
      detailID: null,
      tapIndex: -1
    };
  }

  /**
   * 获取用户评分
   */
  getUserScore = detailID => {
    const { dispatch } = this.props;

    dispatch({
      type: 'gameDetail/getUserScoreInfo',
      payload: {
        appId: detailID
      },
      callback: data => {
        if (data.score) {
          this.setState({
            tapIndex: data.score - 1
          });
        }
      }
    });
  };

  /**
   * 渲染打分星星的 html
   */
  renderRateStar = () => {
    const { tapIndex } = this.state;
    const htmlArr = [];

    for (let i = 0; i < 5; i++) {
      htmlArr.push(
        <i
          className={
            tapIndex > 0 && i <= tapIndex
              ? `${styles['rate-star']} ${styles['active']}`
              : styles['rate-star']
          }
          key={i}
          onClick={() => this.tapStar(i)}
        />,
      );
    }

    return htmlArr;
  };

  /**
   * 点击星星
   *
   * @param {number} index
   */
  tapStar = index => {
    this.setState(
      {
        tapIndex: index
      },
      () => {
        this.uploadScore();
      },
    );
  };

  /**
   * 上传评分
   */
  uploadScore = () => {
    const { detailInfo, detailID, tapIndex } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'gameDetail/gameReview',
      payload: {
        id: detailID,
        score: tapIndex + 1,
        version: detailInfo.ver
      },
      callback: data => {
        message.success(formatMessage({ id: 'detail_rate_success' }), 2, () => {
          this.props.onUpdate();
        });
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    const { detailInfo, detailID } = nextProps;

    if (
      detailID !== this.state.detailID ||
      detailInfo.game_score !== this.state.detailInfo.game_score
    ) {
      this.setState(
        {
          detailInfo: { ...detailInfo },
          detailID: detailID
        },
        () => {
          this.getUserScore(detailID);
        },
      );
    }
  }

  render() {
    const {
      detailInfo: {
        game_score,
        game_reviews_0,
        game_reviews_1,
        game_reviews_2,
        game_reviews_3,
        game_reviews_4,
        ver,
        score_display
      }
    } = this.state;
    const gameScoreNum =
      game_reviews_0 + game_reviews_1 + game_reviews_2 + game_reviews_3 + game_reviews_4;

    return (
      <div className={styles['reviews-block']} key="reviews-block">
        <h3 className={styles['reviews-title']}>{formatMessage({ id: 'detail_reviews' })}</h3>
        <div className={game_score > 0 ? styles['reviews-score'] : styles['reviews-score-0']}>
          {/* <div className={styles['version-box']}>
            {game_score > 0 ? (
              <p className={styles['score']}>
                <em className={styles['num']}>{game_score}</em>/5
              </p>
            ) : (
              <p className={styles['score']}>
                <em className={styles['num']}>0.0</em>/0
              </p>
            )}
            <p className={styles['version']}>
              {formatMessage({ id: 'detail_version' })}:{ver}
            </p>
          </div> */}
          {game_score > 0 ? (
            <div className={styles['version-box']}>
              <p className={styles['score']}>
                <em className={styles['num']}>{game_score}</em>/5
              </p>
              <p className={styles['version']}>
                {formatMessage({ id: 'detail_version' })}:{ver}
              </p>
            </div>
          ) : null}
          {game_score > 0 ? (
            <ul className={styles['reviews-star-box']}>
              <li className={styles['item']}>
                <div className={styles['star-box']}>
                  <i className={styles['light-star']} />
                </div>
                <div className={styles['progress-box']}>
                  <div className={styles['progress-bar']}>
                    <i
                      className={styles['progress-line']}
                      style={{ width: `${(game_reviews_4 / gameScoreNum) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
              <li className={styles['item']}>
                <div className={styles['star-box']}>
                  <i className={styles['light-star']} />
                </div>
                <div className={styles['progress-box']}>
                  <div className={styles['progress-bar']}>
                    <i
                      className={styles['progress-line']}
                      style={{ width: `${(game_reviews_3 / gameScoreNum) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
              <li className={styles['item']}>
                <div className={styles['star-box']}>
                  <i className={styles['light-star']} />
                </div>
                <div className={styles['progress-box']}>
                  <div className={styles['progress-bar']}>
                    <i
                      className={styles['progress-line']}
                      style={{ width: `${(game_reviews_2 / gameScoreNum) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
              <li className={styles['item']}>
                <div className={styles['star-box']}>
                  <i className={styles['light-star']} />
                </div>
                <div className={styles['progress-box']}>
                  <div className={styles['progress-bar']}>
                    <i
                      className={styles['progress-line']}
                      style={{ width: `${(game_reviews_1 / gameScoreNum) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
              <li className={styles['item']}>
                <div className={styles['star-box']}>
                  <i className={styles['light-star']} />
                </div>
                <div className={styles['progress-box']}>
                  <div className={styles['progress-bar']}>
                    <i
                      className={styles['progress-line']}
                      style={{ width: `${(game_reviews_0 / gameScoreNum) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            </ul>
          ) : (
            <p className={styles['no-enough']}>
              {formatMessage({ id: 'detail_less_reviews_num' })}
            </p>
          )}
        </div>
        {score_display === 0 ? (
          <div className={styles['reviews-rate']}>
            <h3 className={styles['tit']}>Tap to Rate</h3>
            <div className={styles['rate-box']}>{this.renderRateStar()}</div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Reviews;
