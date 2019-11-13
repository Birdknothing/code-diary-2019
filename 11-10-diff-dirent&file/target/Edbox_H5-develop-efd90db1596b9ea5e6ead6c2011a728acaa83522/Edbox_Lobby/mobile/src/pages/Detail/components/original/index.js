import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';

import DefaultImg from '@/assets/default.jpg';

@connect(({ gameDetail, loading }) => ({
  gameDetail,
  loading: loading.models.gameDetail
}))
class Original extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailID: null,
      originalList: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { detailID, originalList } = nextProps;

    if (detailID !== this.state.detailID) {
      this.setState({
        detailID: detailID,
        originalList: originalList
      });
    }
  }

  render() {
    const { originalList } = this.state;

    return (
      <div className={styles['original-block']} key="original-block">
        <h3 className={styles['title']}>{formatMessage({ id: 'detail_original_template' })}</h3>
        <ul className={styles['game-list']}>
          {originalList.map(item => (
            <li className={styles['item']} key={item.id}>
              <div className={styles['img-box']}>
                <img className={styles['img']} src={item.URL || DefaultImg} alt="" />
              </div>
              <div className={styles['text-box']}>
                <h3 className={styles['tit']}>{item.game_name}</h3>
                <p className={styles['desc']}>{item.game_description}</p>
              </div>
              <span
                className={styles['btn-play']}
                onClick={() => this.props.onArouseGame(item.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Original;
