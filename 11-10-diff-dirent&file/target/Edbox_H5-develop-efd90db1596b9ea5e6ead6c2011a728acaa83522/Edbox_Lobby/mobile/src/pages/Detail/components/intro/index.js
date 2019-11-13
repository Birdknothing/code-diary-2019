import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';

import DefaultImg from '@/assets/default.jpg';

@connect(({ gameDetail, loading }) => ({
  gameDetail,
  loading: loading.models.gameDetail
}))
class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfo: {},
      detailID: null,
      coverImg: null,
      tagsList: [],
      isShowMore: false
    };
  }

  /**
   * 获取游戏封面
   *
   * @param {string} iconID
   */
  getGameCoverImg = iconID => {
    const { dispatch } = this.props;

    dispatch({
      type: 'gameDetail/getImageUrl',
      payload: {
        resourceid: iconID
      },
      callback: data => {
        this.setState({
          coverImg: data
        });
      }
    });
  };

  /**
   * 获取游戏等级
   *
   * @param {number} grade
   */
  getGameLevel = grade => {
    switch (grade) {
      case 1:
        return 'E';
      case 2:
        return 'E10+';
      case 3:
        return 'T';
      case 4:
        return 'M';
      case 5:
        return 'AO';
      default:
        break;
    }
  };

  /**
   * 获取游戏标签数据
   *
   * @param {string} detailID
   */
  getGameTagsList = detailID => {
    const { dispatch } = this.props;

    dispatch({
      type: 'gameDetail/getDetailTags',
      payload: {
        id: detailID
      },
      callback: data => {
        const tempArr =
          data && data.length
            ? data.filter(item => {
                return item.id && item.id !== '';
              })
            : [];
        this.setState(
          {
            tagsList: [...tempArr]
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
    const TAG_CONTAINER = document.getElementById('tagContainer');
    const containerH = TAG_CONTAINER.clientHeight;

    this.setState(
      {
        isShowMore: containerH > 100
      },
      () => {
        setTimeout(() => {
          TAG_CONTAINER.style.maxHeight = '100px';
        }, 500);
      },
    );
  };

  /**
   * 展示更多标签
   */
  showMore = () => {
    const TAG_CONTAINER = document.getElementById('tagContainer');

    TAG_CONTAINER.style.maxHeight = 'inherit';
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
          this.getGameCoverImg(detailInfo.game_icon);
          this.getGameTagsList(detailID);
        },
      );
    }
  }

  render() {
    const { coverImg, detailInfo = {}, tagsList, isShowMore } = this.state;
    const { game_name, game_author_name, game_playing, grade, onlineNumber_display } = detailInfo;

    return (
      <div className={styles['intro-block']} key="intro">
        <div className={styles['intro-top']}>
          <div className={styles['intro-img-box']}>
            <img className={styles['img']} src={coverImg || DefaultImg} alt="" />
          </div>
          <div className={styles['intro-info-box']}>
            <h3 className={styles['title']}>{game_name}</h3>
            <p className={styles['author']}>
              {formatMessage({ id: 'detail_creator' })} | {game_author_name}
            </p>
            <p className={styles['text']}>
              {onlineNumber_display === 0 ? (
                <span className={styles['play']}>
                  <em className={styles['num']}>{game_playing}</em>
                  {formatMessage({ id: 'detail_online' })}
                </span>
              ) : null}
              <span className={styles['level']}>
                {formatMessage({ id: 'detail_level' })}:{this.getGameLevel(grade)}
              </span>
            </p>
          </div>
        </div>
        <div className={styles['intro-tag']}>
          <span className={styles['tit']}>{formatMessage({ id: 'detail_tags' })}</span>
          <ul className={styles['tag-list']} id="tagContainer">
            {tagsList.map(item => (
              <li className={styles['tag-item']} key={item.id}>
                {item.value}
              </li>
            ))}
          </ul>
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

export default Intro;
