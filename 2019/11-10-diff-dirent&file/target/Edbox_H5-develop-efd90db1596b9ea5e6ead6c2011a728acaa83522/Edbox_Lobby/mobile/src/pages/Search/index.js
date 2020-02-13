import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import styles from './index.scss';
import { formatMessage } from 'umi/locale';
import { Modal } from 'antd-mobile';

import HeaderTitle from '@/components/HeaderTitle';
import GameList from '@/components/GameList';

// 搜索页
@connect(({ lobby, Warehouse, loading }) => ({
  lobby,
  Warehouse,
  hotLoading: loading.effects['lobby/getHotWordList']
}))
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hotWordList: [],
      gameList: [],
      imgBox: [], // 单独存放封面图
      word: '',
      cat: '',
      page: 1, // 当前第几页
      pageSize: 8, // 每页条数
      count: 0, // 数据总数
      order: props.Warehouse.wareSort === 0 ? '!popular' : '!releasetime',
      isBegin: false, // 是否开始滚动加载
      isShowHotWord: true,
      emptySearchVisible: false
    };
  }

  componentDidMount() {
    // const {dispatch,lobby:{hotSearchType}} = this.props;
    // dispatch({
    //   type:'lobby/getHotWordList',
    //   payload:{
    //     type:hotSearchType
    //   },
    //   callback:data=>{
    //     if(data.error){
    //       this.setState({
    //         hotWordList:[]
    //       });
    //     }else{
    //       this.setState({
    //         hotWordList:data
    //       });
    //     }
    //   }
    // });

    this.setState({
      hotWordList: ['拼图', '切水果', '11', '22', '33', '44', '55', '测试']
    });

    // 如果有搜索词，就执行搜索页
    const {
      lobby: { globalSearchKey }
    } = this.props;
    if (globalSearchKey) {
      this.handleHotSearch(globalSearchKey);
    }
  }

  getGameList = cb => {
    const { dispatch } = this.props;
    const { word, page, order, cat, pageSize } = this.state;

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
          this.setState(
            {
              gameList: [],
              count: 0
            },
            () => {
              if (cb) {
                cb([], 0, []);
              }
            },
          );
        } else {
          // console.log('78787878：', data);
          this.setState(
            prevState => ({
              gameList: prevState.gameList.concat(data),
              loading: false,
              getInfoLoading: false,
              count: count,
              page: page + 1
            }),
            () => {
              const { gameList, imgBox } = this.state;
              // 获取封面图
              this.getImgBatch(this.imgArrGet(data), newImgBox => {
                if (cb) {
                  cb(gameList, count, newImgBox);
                }
              });

              if (cb) {
                cb(gameList, count, imgBox);
              }
            },
          );
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
        this.setState(
          prevState => ({
            imgBox: prevState.imgBox.concat(guidValueList)
          }),
          () => {
            const { imgBox } = this.state;
            if (cb) {
              cb(imgBox);
            }
          },
        );
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

  // 执行搜索
  handleSearch = val => {
    // 设置全局搜索关键词
    const { dispatch } = this.props;
    dispatch({
      type: 'lobby/setGlobalSearchKey',
      payload: { globalSearchKey: val }
    });

    if (val.match(/^\s*$/)) {
      this.setState({
        word: '',
        emptySearchVisible: true
      });
    } else {
      const searchKey = val.trim();
      this.setState(
        {
          isBegin: false,
          emptySearchVisible: false
        },
        () => {
          this.setState({
            word: searchKey,
            page: 1,
            gameList: [],
            imgBox: [],
            isBegin: true,
            isShowHotWord: false
          });
        },
      );
    }
  };

  // 搜索聚焦
  handleSearchFocus = () => {
    this.setState({
      isShowHotWord: true
    });
  };

  // 搜索改变值
  handleSearchChange = val => {
    this.setState({
      word: val
    });
  };

  // 热词搜索
  handleHotSearch = val => {
    this.handleSearch(val);
  };

  handleCtrlModal = (visibleAtrr, val) => {
    this.setState({
      [visibleAtrr]: val
    });
  };

  render() {
    const { isBegin, isShowHotWord, word, emptySearchVisible, hotWordList } = this.state;
    const { hotLoading } = this.props;
    // const hotWordData = ['拼图', '切水果', '11', '22', '33', '44', '55','测试'];

    return (
      <div className={`page-wrap ${styles['search-page']}`}>
        <div className="header">
          <HeaderTitle
            useAnimation
            hasSearch
            onSearch={this.handleSearch}
            onFocus={this.handleSearchFocus}
            defaultValue={word}
            onChange={this.handleSearchChange}
          />
        </div>
        <div className={styles['content']}>
          {isShowHotWord ? (
            <div className={styles['hot-layout']}>
              {hotWordList.length ? (
                <dl className={styles['hot-word-wrap']}>
                  <dt className={styles['tit']}>{formatMessage({ id: 'layout_hot_serch' })}</dt>
                  <dd className={styles['list']}>
                    <div className={styles['item-list']}>
                      {hotWordList.map((item, index) => (
                        <span
                          key={index}
                          className={styles['word-item']}
                          onClick={() => {
                            this.handleHotSearch(item);
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </dd>
                </dl>
              ) : null}
              {hotLoading ? (
                <div className={styles['hot-loading-wrap']}>
                  <Spin />
                </div>
              ) : null}
            </div>
          ) : null}
          <div className={styles['list-wrap']} id="list">
            {isBegin ? (
              <GameList
                parentId="list"
                onGetData={this.getGameList}
                noDataTip={
                  <Fragment>
                    <p>{formatMessage({ id: 'wh_search_tip' })}</p>
                    <p>{formatMessage({ id: 'wh_search_tip2' })}</p>
                    <p>{formatMessage({ id: 'wh_search_tip3' })}</p>
                  </Fragment>
                }
              />
            ) : null}
          </div>
        </div>
        <Modal
          visible={emptySearchVisible}
          transparent
          maskClosable={true}
          onClose={this.onClose}
          title={formatMessage({ id: 'wh_tip_title' })}
          footer={[
            {
              text: formatMessage({ id: 'layout_btn_sure' }),
              onPress: () => {
                this.handleCtrlModal('emptySearchVisible', false);
              }
            }
          ]}
        >
          <p className="pop-tip">{formatMessage({ id: 'wh_empty_search_tip' })}</p>
        </Modal>
      </div>
    );
  }
}

export default Search;
