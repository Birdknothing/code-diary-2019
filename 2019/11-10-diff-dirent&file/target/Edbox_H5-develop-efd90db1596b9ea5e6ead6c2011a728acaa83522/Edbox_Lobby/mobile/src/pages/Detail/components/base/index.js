import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';
import DefaultImg from '@/assets/default.jpg';

@connect(({ gameDetail, loading }) => ({
  gameDetail,
  loading: loading.models.gameDetail
}))
class Base extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailID: null,
      sameTemplateList: []
    };
  }

  /**
   * 路由跳转
   *
   * @param {string} detailID
   */
  handleLink = detailID => {
    router.push(`/Detail/${detailID}`);
  };

  componentWillReceiveProps(nextProps) {
    const { detailID, sameTemplateList } = nextProps;

    if (detailID !== this.state.detailID) {
      this.setState({
        detailID: detailID,
        sameTemplateList: sameTemplateList
      });
    }
  }

  render() {
    const { sameTemplateList } = this.state;

    return (
      <div className={styles['base-block']} key="base-block">
        <h3 className={styles['title']}>{formatMessage({ id: 'detail_same_template' })}</h3>
        <ul className={styles['game-list']}>
          {sameTemplateList.map(item => {
            return (
              <li className={styles['item']} key={item.id}>
                <div className={styles['img-box']} onClick={() => this.handleLink(item.id)}>
                  <img className={styles['img']} src={item.Url || DefaultImg} alt="" />
                </div>
                <div className={styles['text-box']} onClick={() => this.handleLink(item.id)}>
                  <h3 className={styles['tit']}>{item.game_name}</h3>
                  <p className={styles['desc']}>{item.tags.join('/')}</p>
                  <div className={styles['rate-star']}>
                    {item.game_score > 0 ? (
                      <div className={styles['rate-box']}>
                        <p className={styles['star']}>
                          <i
                            className={styles['light-star']}
                            style={{
                              width: `${(parseInt(item.game_score) / 5) * 100}%`
                            }}
                          />
                        </p>
                        <em className={styles['rate']}>{item.game_score}</em>
                      </div>
                    ) : (
                      <p className={styles['no-enough']}>
                        {formatMessage({ id: 'detail_less_reviews' })}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={styles['btn-play']}
                  onClick={() => this.props.onArouseGame(item.id)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Base;
