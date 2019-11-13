import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';

@connect(({ gameDetail, loading }) => ({
  gameDetail,
  loading: loading.models.gameDetail
}))
class Description extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {},
      detailID: null,
      isShowMore: false
    };
  }

  /**
   * 判断处理，是否展示 “more” 按钮
   */
  handleIsShowMore = () => {
    const DESCRIPTION = document.getElementById('description');
    const containerH = DESCRIPTION.clientHeight;

    this.setState(
      {
        isShowMore: containerH > 108
      },
      () => {
        setTimeout(() => {
          DESCRIPTION.style.maxHeight = '108px';
        }, 500);
      },
    );
  };

  /**
   * 展示更多描述
   */
  showMore = () => {
    const DESCRIPTION = document.getElementById('description');

    DESCRIPTION.style.maxHeight = 'inherit';
    this.setState({
      isShowMore: false
    });
  };

  componentWillReceiveProps(nextProps) {
    const { detailInfo, detailID } = nextProps;

    if (detailID !== this.state.detailID) {
      const flag = detailInfo.game_description !== this.state.detailInfo.game_description;

      this.setState(
        {
          detailInfo: { ...detailInfo },
          detailID: detailID
        },
        () => {
          if (flag) {
            this.handleIsShowMore();
          }
        },
      );
    }
  }

  render() {
    const { detailInfo, isShowMore } = this.state;
    const { game_description } = detailInfo;

    return (
      <div className={styles['desc-block']} key="desc-block">
        <h3 className={styles['tit']}>{formatMessage({ id: 'detail_description' })}</h3>
        <p className={styles['text']} id="description">
          {game_description}
          {isShowMore ? (
            <span className={styles['btn-more']} onClick={() => this.showMore()}>
              {formatMessage({ id: 'detail_more' })}
            </span>
          ) : null}
        </p>
      </div>
    );
  }
}

export default Description;
