import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';
import { Modal } from 'antd-mobile';
import defaultIcon from '../assets/default.jpg';
import styles from './index.scss';
import 'swiper/dist/css/swiper.css';

import HeaderTitle from '@/components/HeaderTitle';
import FullPageLoading from '@/components/FullPageLoading';
import Swiper from 'swiper';

// 首页
@connect(({ lobby,Warehouse, loading }) => ({
  lobby,
  Warehouse,
  getTagsLoading: loading.effects['lobby/getTags'],
  getGameListLoading: loading.effects['lobby/getGameList'],
  getGameImgLoading: loading.effects['lobby/getImgBatch']
}))
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tagsData: [],
      defaultKey: props.lobby.globalTagId || 'all',
      hotData: [], // 热门取前10条
      hotImgBox: [], // 热门封面图数据
      newData: [], // 新品取前10条
      newImgBox: [] // 新品封面图数据
    };
    this.tag_0 = [
      {
        id: 'all',
        value: formatMessage({ id: 'tag_all' })
      }
    ];
  }

  componentDidMount() {
    // 获取标签
    this.getTags();
    // 获取热门
    this.getGameList({ order: '!popular' }, (data, imgbox) => {
      this.setState(
        {
          hotData: data,
          hotImgBox: imgbox ? imgbox : []
        },
        () => {
          this.initSwiper(`.${styles['swiper-container-hot']}`);
        },
      );
    });
    // 获取新品
    this.getGameList({ order: '!releasetime' }, (data, imgbox) => {
      this.setState(
        {
          newData: data,
          newImgBox: imgbox ? imgbox : []
        },
        () => {
          this.initSwiper(`.${styles['swiper-container-new']}`);
        },
      );
    });

    // 清空状态
    const {dispatch} = this.props;
    dispatch({
      type:'lobby/setGlobalTag',
      payload:{
        globalTagId:''
      }
    });
    dispatch({
      type: 'Warehouse/setWareSort',
      payload: {
        wareSort: 0
      }
    });
  }

  getTags = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lobby/getTags',
      payload: {},
      callback: data => {
        this.setState(
          {
            tagsData: this.tag_0.concat(data).slice(0, 4)
          },
          () => {
            console.log('11111', this.state);
          },
        );
      }
    });
  };

  initSwiper = el => {
    const elStr = el ? el : 'swiper-container';
    this.mySwiper = new Swiper(elStr, {
      slidesPerView: 2.88,
      spaceBetween: 30,
      freeMode: true,
      autoplay: {
        delay: 3000,
        stopOnLastSlide: true,
        disableOnInteraction: true,
        reverseDirection: true
      }
    });
  };

  getGameList = (parmas, cb) => {
    const { dispatch } = this.props;
    const { word = '', order = '!popular', page = 1, cat = '', pageSize = 10 } = parmas;

    dispatch({
      type: 'lobby/getGameList',
      payload: {
        page,
        order,
        cat,
        word,
        size: pageSize
      },
      callback: (data, count) => {
        if (data.error) {
          cb([], []);
        } else {
          // console.log('78787878：', data);
          // 获取封面图
          this.getImgBatch(this.imgArrGet(data), newImgBox => {
            if (cb) {
              cb(data, newImgBox);
            }
          });

          if (cb) {
            cb(data);
          }
        }
      }
    });
  };

  getImgBatch = (imgId, cb) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lobby/getImgBatch',
      payload: {
        resourceid: [...imgId]
      },
      callback: data => {
        let guidValueList = [];
        imgId.map(item => {
          guidValueList.push(!data[item] ? '' : data[item].Url);
          return true;
        });
        cb(guidValueList);
      }
    });
  };

  imgArrGet = data => {
    let result = [];
    for (let i = 0, j = data.length; i < j; i++) {
      result.push(data[i].game_icon);
    }
    return result;
  };

  // 去往体验区首页
  handleClickWareHouseMore = () => {
    router.push('/Warehouse/');
  };

  // 去往体验区某个特殊分类
  handleGoToWarehouseType = (id, index) => {
    const {dispatch} = this.props;
    dispatch({
      type:'lobby/setGlobalTag',
      payload:{
        globalTagId:id === 'all' ? '' : id
      }
    });
    router.push('/Warehouse/');
  };

  // 去往体验区某个排序
  handleGoToWarehouseSort = index => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Warehouse/setWareSort',
      payload: {
        wareSort: index
      }
    });
    router.push('/Warehouse/');
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  goToDetail = id => {
    router.push('/Detail/' + id);
  };

  render() {
    const { getTagsLoading, getGameListLoading, getGameImgLoading } = this.props;
    const { tagsData, hotData, hotImgBox, newData, newImgBox } = this.state;
    return (
      <div className={`page-wrap`}>
        <div className={`header bg-gray`}>
          <HeaderTitle hasBtnBack={false} title={formatMessage({ id: 'layout_title' })} />
        </div>
        <div className="main">
          {/* 热门 */}
          <div className={styles['section']}>
            <div className={styles['sec-tit-wrap']}>
              <h2 className={styles['sec-tit']}>{formatMessage({ id: 'layout_tit_hot' })}</h2>
              <span
                className={styles['more']}
                onClick={() => {
                  this.handleGoToWarehouseSort(0);
                }}
              >
                {formatMessage({ id: 'layout_more' })}
              </span>
            </div>
            <div className={`${styles['sec-cont']} hot-swiper`}>
              <div className={`swiper-container ${styles['swiper-container-hot']}`}>
                <div className={`swiper-wrapper`}>
                  {hotData.map((item, index) => (
                    <div
                      className="swiper-slide"
                      key={item.id}
                      onClick={() => {
                        this.goToDetail(item.id);
                      }}
                    >
                      <p title={item.game_name} className={styles['hot-item']}>
                        <img
                          src={hotImgBox[index] ? hotImgBox[index] : defaultIcon}
                          alt={item.game_name}
                        />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* 新品 */}
          <div className={styles['section']}>
            <div className={styles['sec-tit-wrap']}>
              <h2 className={styles['sec-tit']}>{formatMessage({ id: 'layout_tit_new' })}</h2>
              <span
                className={styles['more']}
                onClick={() => {
                  this.handleGoToWarehouseSort(1);
                }}
              >
                {formatMessage({ id: 'layout_more' })}
              </span>
            </div>
            <div className={`${styles['sec-cont']} hot-swiper`}>
              <div className={`swiper-container ${styles['swiper-container-new']}`}>
                <div className={`swiper-wrapper`}>
                  {newData.map((item, index) => (
                    <div
                      className="swiper-slide"
                      key={item.id}
                      onClick={() => {
                        this.goToDetail(item.id);
                      }}
                    >
                      <p title={item.game_name} className={styles['hot-item']}>
                        <img
                          src={newImgBox[index] ? newImgBox[index] : defaultIcon}
                          alt={item.game_name}
                        />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* 大厅体验区分类 */}
          <div className={styles['section']}>
            <h2 className={styles['sec-tit']}>{formatMessage({ id: 'layout_tit_popular' })}</h2>
            <div className={styles['sec-cont']}>
              {tagsData.map((item, index) => (
                <p
                  key={item.id}
                  onClick={() => {
                    this.handleGoToWarehouseType(item.id, index);
                  }}
                  title={item.value}
                  className={styles['pop-item']}
                >
                  <span className={styles['tit']}>{item.value}</span>
                </p>
              ))}
              <p title="" className={styles['pop-item']} onClick={this.handleClickWareHouseMore}>
                {formatMessage({ id: 'layout_pop_more' })}
              </p>
            </div>
          </div>
        </div>

        <FullPageLoading visible={getTagsLoading || getGameListLoading || getGameImgLoading} />
        <Modal
          visible={this.state.visible}
          transparent
          maskClosable={true}
          onClose={this.onClose}
          title="Title"
          footer={[
            {
              text: 'Ok',
              onPress: () => {
                this.onClose();
              }
            }
          ]}
        >
          <p className="pop-tip">
            The game is temporarily unavailable for mobile experienceBefore tackling the technical
            difficulties, you can go to the PC
          </p>
        </Modal>
      </div>
    );
  }
}

export default Home;
