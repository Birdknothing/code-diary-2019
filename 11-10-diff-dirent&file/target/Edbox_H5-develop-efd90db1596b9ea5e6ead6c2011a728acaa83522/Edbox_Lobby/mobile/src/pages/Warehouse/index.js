import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd-mobile';
import { Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';

import HeaderTitle from '@/components/HeaderTitle';
import GameList from '@/components/GameList';

@connect(({ lobby, Warehouse, loading }) => ({
  lobby: lobby,
  Warehouse: Warehouse,
  getGameListLoading: loading.effects['lobby/getGameList'],
  getTagsLoading: loading.effects['lobby/getTags']
}))
class Warehouse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameList: [],
      imgBox: [], // 单独存放封面图
      tagsData: [],
      activeTab: 0,
      word: '',
      cat: '',
      page: 1, // 当前第几页
      pageSize: 8, // 每页条数
      count: 0, // 数据总数
      order: props.Warehouse.wareSort === 0 ? '!popular' : '!releasetime',
      isBegin: false // 是否开始滚动加载
    };
    this.tag_0 = [
      {
        id: 'all',
        value: formatMessage({ id: 'tag_all' })
      }
    ];
  }

  componentDidMount() {
    this.getTags();
  }

  getTags = () => {
    const {
      dispatch,
      lobby: { globalTagId },
      Warehouse: { wareSort }
    } = this.props;
    dispatch({
      type: 'lobby/getTags',
      payload: {},
      callback: data => {
        const newTagsData = this.tag_0.concat(data);
        newTagsData.map(item => {
          return (item.title = item.value);
        });

        // tab数据的初始化
        this.setState(
          {
            tagsData: newTagsData,
            activeTab: this.getIndexFromArr(globalTagId, newTagsData),
            word: globalTagId ? globalTagId : '',
            order: wareSort === 0 ? '!popular' : '!releasetime'
          },
          () => {
            this.setState({
              isBegin: true
            });
          },
        );
      }
    });
  };

  // 从数组里获取对应的索引值
  getIndexFromArr = (id, data) => {
    let index = 0;
    for (let i = 0, n = data.length; i < n; i++) {
      if (data[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

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

  // 分类标签点击
  handleTabClick = (tabData, index) => {
    const { dispatch, getGameListLoading } = this.props;
    if (getGameListLoading) {
      return;
    }

    this.setState(
      {
        isBegin: false
      },
      () => {
        // 设置全局tab
        dispatch({
          type: 'lobby/setGlobalTag',
          payload: {
            globalTagId: tabData.id === 'all' ? '' : tabData.id
          }
        });
        this.setState({
          word: tabData.id === 'all' ? '' : tabData.id,
          page: 1,
          gameList: [],
          imgBox: [],
          isBegin: true,
          activeTab: index
        });
      },
    );
  };

  // 排序方式点击
  handleOrderChange = index => {
    const { dispatch, getGameListLoading } = this.props;
    if (getGameListLoading) {
      return;
    }
    this.setState(
      {
        isBegin: false
      },
      () => {
        // 设置全局排序
        dispatch({
          type: 'Warehouse/setWareSort',
          payload: {
            wareSort: index
          }
        });
        this.setState({
          order: index === 0 ? '!popular' : '!releasetime',
          page: 1,
          gameList: [],
          imgBox: [],
          isBegin: true
        });
      },
    );
  };

  render() {
    const {
      getTagsLoading,
      Warehouse: { wareSort },
      getGameListLoading
    } = this.props;
    const { tagsData, activeTab, isBegin } = this.state;
    const typeData = [
      { title: formatMessage({ id: 'wh_type_popular' }), value: '!popular' },
      { title: formatMessage({ id: 'wh_type_new' }), value: '!releasetime' }
    ];

    return (
      <div className="page-wrap">
        <div className="header bg-gray">
          <HeaderTitle title={formatMessage({ id: 'wh_title' })} />
        </div>
        <div className="main">
          {getTagsLoading ? (
            <div className={styles['loading-wrap']}>
              <Spin size="large" />
            </div>
          ) : (
            <div className={`${styles['content']}`}>
              <div
                className={`${styles['tab-wrap']} ${getGameListLoading ? styles['disable'] : ''}`}
              >
                <Tabs
                  tabBarUnderlineStyle={{ borderBottom: '2px solid red' }}
                  tabs={tagsData}
                  initialPage={activeTab}
                  onChange={this.handleTabClick}
                  renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
                  useOnPan={false}
                >
                  {tagsData.map((item, index) => {
                    return (
                      <div className={styles['cont-item']} key={item.id + 'cont'}>
                        <div className={styles['list-wrap']} id={item.id + 'list'}>
                          {isBegin && activeTab === index ? (
                            <GameList
                              parentId={item.id + 'list'}
                              onGetData={this.getGameList}
                              noDataTip={
                                <Fragment>
                                  <p>{formatMessage({ id: 'wh_no_data_tip' })}</p>
                                </Fragment>
                              }
                            />
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </Tabs>
                <div className={styles['type-tab-wrap']}>
                  {typeData.map((item, index) => (
                    <span
                      className={`${styles['type-item']} ${wareSort === index ? styles['on'] : ''}`}
                      key={index}
                      onClick={() => this.handleOrderChange(index)}
                    >
                      {item.title}
                    </span>
                  ))}
                </div>
              </div>
              {/* <div className={styles['list-wrap']} id="list">
                {isBegin ? (
                  <GameList
                    parentId="list"
                    onGetData={this.getGameList}
                    noDataTip={
                      <Fragment>
                        <p>{formatMessage({ id: 'wh_no_data_tip' })}</p>
                      </Fragment>
                    }
                  />
                ) : null}
              </div> */}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Warehouse;
