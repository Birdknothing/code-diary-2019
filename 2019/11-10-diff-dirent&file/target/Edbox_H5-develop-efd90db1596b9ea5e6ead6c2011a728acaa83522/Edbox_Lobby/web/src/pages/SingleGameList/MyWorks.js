import React, { Component } from 'react';
import router from 'umi/router';
import { Affix, Pagination, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import TagsLobby from '../../components/TagsLobby/TagsLobby';
import styles from './SingleGameList.scss';
import SortTab from '../../components/SortTab/SortTab';
import ListEdit from './components/ListEdit';
import ListPublish from './components/ListPublish';
import PageLoading from '@/components/PageLoading';

const { Edbox } = window;
@connect(({ lobby, MyWorks, loading }) => ({
  lobby: lobby,
  MyWorks: MyWorks,
  listLoading: loading.effects['MyWorks/getEditList'],
  listPublishLoading: loading.effects['MyWorks/gePublishList'],
  lobbyInitLoading: loading.effects['lobby/edboxInit'],
}))
class MyWorks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagsData: [],
      gameList: [],
      current: 0,
      page: 1,
      count: 0,
      sort: 0,
      currentPage: 1,
      name: '',
      isClickTab: false,
      isInitOver: false,
    };
    this.tags = [
      {
        id: '0',
        route: '/SingleGameList/MyWorks',
        value: formatMessage({ id: 'sidebar_my_work' }),
      },
      {
        id: '1',
        route: '/SingleGameList/History',
        value: formatMessage({ id: 'game_history' }),
      },
      {
        id: '2',
        route: '/SingleGameList/Collect',
        value: formatMessage({ id: 'game_like' }),
      },
    ];
  }

  // 获取url参数
  getUrlParam = name => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
      regh = new RegExp('(/?|&)' + name + '=([^&]*)(&|$)'),
      r = window.location.search.substr(1).match(reg),
      h = window.location.hash.substr(1).match(regh);
    if (r !== null) {
      return unescape(r[2]);
    } else if (h !== null) {
      return unescape(h[2]);
    } else {
      return '';
    }
  };

  componentWillUnmount(){
    clearTimeout(this.timerId);
  }

  componentWillMount() {
    this.setState({
      tagsData: this.tags,
    });
    const {MyWorks,dispatch} = this.props;
    dispatch({
      type: 'lobby/edboxInit',
      payload:{},
      callback:(data)=>{
        // console.log(data)
        // 解决初始化空隙的问题,暂时没有想到很好的方案，目前先延迟请求状态结束时间
        this.timerId=setTimeout(()=>{
          this.setState({
            isInitOver: true,
          });
        },1000);

        // 检测当前默认tab
        if (this.getUrlParam('tab') === '1'|| MyWorks.currentTabIndex===1) {
          dispatch({
            type:'MyWorks/setCurrentTabIndex',
            payload:{
              currentTabIndex:1,
            }
          });
          dispatch({
            type:'MyWorks/setCurrentPage',
            payload:{
              currentPage:1,
            },
          });
          this.setState(
            {
              current: 1,
              sort:1,
              currentPage: MyWorks.currentPage,
            },
            () => {
              this.getGamePublishList();
            },
          );
        } else {
          dispatch({
            type:'MyWorks/setCurrentTabIndex',
            payload:{
              currentTabIndex:0,
            }
          });
          dispatch({
            type:'MyWorks/setCurrentPage',
            payload:{
              currentPage:1,
            },
          });
          this.setState({
            current: 0,
            sort:0,
            currentPage: MyWorks.currentPage,
          },()=>{
            this.getGameEditList();
          });

        }
      }
    })

  }

  componentDidMount(){
    const {dispatch} = this.props;
    // 设置unity刷新事件
    dispatch({
      type:'lobby/setOpenUnityEditorRefreshFun',
      payload:{openUnityEditorRefreshFun: ()=>{
        this.getGameEditList();
      }},
    });
  }
  TagsLobbyChange = id => {
    const route = this.tags.filter(tags => tags.id === id);
    // 我的作品清除当前页面和tab记录
    const {dispatch} = this.props;
    dispatch({
      type:'MyWorks/setCurrentTabIndex',
      payload:{
        currentTabIndex:0,
      }
    });
    dispatch({
      type:'MyWorks/setCurrentPage',
      payload:{
        currentPage:1,
      },
    });

    if (this.props.location.pathname === route[0]['route']) {
      return;
    }

    router.push(route[0]['route']);
  };

  getGameEditList = (specialCurrentPage,oprType) => {
    const { dispatch } = this.props;
    const { name, currentPage,count,gameList } = this.state;
    const _this = this;
    let page = specialCurrentPage? specialCurrentPage:currentPage;
    // 如果是删除类型，要判断是否是最后一页并且只有一条，是要请求前一页
    if(oprType==='delete'&& currentPage>1){
      if(currentPage ===Math.ceil(count/8)&&gameList.length===1){
        page = currentPage-1;
        this.setState({
          currentPage:page,
        });
      }
    }
    dispatch({
      type: 'MyWorks/getEditList',
      payload: {
        page,
        size: 8,
        name: name,
      },
      callback(data) {
        _this.setState(
          {
            gameList: [...data.data],
            count: data.count,
          },
          () => {
            const { gameList } = _this.state;
            for (let i = 0, n = gameList.length; i < n; i++) {
              // _this.getCoverImg(gameList[i].game_icon, i);
              _this.getAppType(gameList[i].id, i);
            }
            _this.getImgBatch(_this.imgArrGet(gameList))
          },
        );
      },
    });
  };

  getGamePublishList = (specialCurrentPage) => {
    const { dispatch } = this.props;
    const { name, currentPage } = this.state;
    const _this = this;
    dispatch({
      type: 'MyWorks/gePublishList',
      payload: {
        page: specialCurrentPage? specialCurrentPage:currentPage,
        size: 8,
        name: name,
      },
      callback(data) {
        _this.setState(
          {
            gameList: [...data.data],
            count: data.count,
          },
          () => {
            const { gameList } = _this.state;
            for (let i = 0, n = gameList.length; i < n; i++) {
              // _this.getCoverImg(gameList[i].game_icon, i);
              _this.getAppType(gameList[i].id, i);
            }
            _this.getImgBatch(_this.imgArrGet(gameList))
          },
        );
      },
    });
  };

  handleSortChange = key => {
    const { listLoading, listPublishLoading ,dispatch,lobby:{isNeedRefreshMyWork},MyWorks:{currentTabIndex}} = this.props;
    const canRequest = currentTabIndex===0? !isNeedRefreshMyWork: true;
    if (!listPublishLoading && !listLoading&&canRequest) {
      let oldIndex = 0; // 如果当前是高亮就不用重复点击
      this.setState(prevState=>{
        oldIndex = prevState.sort;
        return {
          sort: key,
          page: 1,
          currentPage: 1,
          current: key,
          isClickTab: true,
        }
      },()=>{
        // 当前tab索引保存到全局
        dispatch({
          type:'MyWorks/setCurrentTabIndex',
          payload:{
            currentTabIndex:key,
          }
        });
        dispatch({
          type:'MyWorks/setCurrentPage',
          payload:{
            currentPage:1,
          }
        });
        if (key === 0 && oldIndex !==0) {
          this.getGameEditList(1);
          Edbox.DataStatistic.ClickEvent('SortEditing','MyWorks','')
        }
        if (key === 1 && oldIndex !==1) {
          this.getGamePublishList(1);
          Edbox.DataStatistic.ClickEvent('SortPublished','MyWorks','')
        }
      });
    }
  };

  handlePagination = pageNumber => {
    const { sort } = this.state;
    const {dispatch} = this.props;
    const _this = this;
    const {lobby:{isNeedRefreshMyWork}} = this.props;
    if(!isNeedRefreshMyWork){
    // 保存当前的页面到redux
    dispatch({
      type:'MyWorks/setCurrentPage',
      payload:{
        currentPage:pageNumber,
      }
    });
    this.setState(
      {
        currentPage: pageNumber,
      },
      () => {
        if (sort === 0) {
          _this.getGameEditList();
        }
        if (sort === 1) {
          _this.getGamePublishList();
        }
      },
    );
  }
  };

  handleSearch = e => {
    const { sort } = this.state;
    const _this = this;

    if (e.keyCode === 13) {
      this.setState(
        {
          currentPage: 1,
          name: e.target.value,
        },
        () => {
          if (sort === 0) {
            _this.getGameEditList();
          }
          if (sort === 1) {
            _this.getGamePublishList();
          }
        },
      );
    }
  };

  copyOpr = (item, i) => {
    const { dispatch,lobby:{isNeedRefreshMyWork},lobby } = this.props;
    if(!isNeedRefreshMyWork){
    dispatch({
      type: 'MyWorks/copyGame',
      payload: {
        id: item.id,
        curName: item.game_name,
        version: item.ver,
      },
      callback: res => {
        if (res) {
          message.success(formatMessage({ id: 'mw_copy_game_success' }));
          this.setState(
            {
              currentPage: 1,
            },
            () => {
              this.getGameEditList();
              // 刷新侧边
                dispatch({
                  type:'lobby/setEditStatu',
                  payload:{
                      editStatu: lobby.editStatu + 1
                  }
                })
            },
          );
        }
      },
    });
    Edbox.DataStatistic.ClickEvent('CopyGame','MyWorks','')
  }
  };

  getAppType = (id, index) => {
    const { dispatch } = this.props;
    if (id) {
      // 先判断是否是H5,如果是才显示二维码
      dispatch({
        type: 'MyWorks/getAppType',
        payload: {
          id,
        },
        callback: typeRes => {
          this.setState(prevState => {
            if(prevState.gameList[index]){
              prevState.gameList[index].game_type = typeRes;
            }
            return {
              gameList: [...prevState.gameList],
            };
          });
        },
      });
    }
  };

  getCoverImg = (id, index) => {
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'lobby/getImageUrl',
        payload: {
          resourceid: id,
        },
        callback: res => {
          this.setState(prevState => {
            prevState.gameList[index].game_icon = res;
            return {
              data: [...prevState.gameList],
            };
          });
        },
      });
    }
  };

  imgArrGet = (data) =>{
    let result = [];
    for(let i = 0, j = data.length; i < j; i++){
        result.push(data[i].game_icon)
    }
    return result;
  }

  getImgBatch = (imgId) =>{
    const { dispatch } = this.props
    const { gameList } = this.state;
    dispatch({
        type: 'lobby/getImgBatch',
        payload:{
            resourceid: [...imgId]
        },
        callback:(data)=>{
            // let guidValueList = []
            gameList.map((g,i)=>{
                // guidValueList.push(!data[g] ? '' : data[g].Url)
                g.game_icon = !data[g.game_icon] ? '' : data[g.game_icon].Url
                return true
            })
            this.setState(prevState =>({
              data: [...gameList]
            }))
        }
    })
  }

  stopPropagation=(e)=>{
    const {lobby} = this.props;
    if(!lobby.isNeedRefreshMyWork){
       e.stopPropagation();
    }
  }

  render() {
    const { tagsData, gameList, current, count, sort, currentPage,isInitOver } = this.state;
    const { listLoading, listPublishLoading,lobbyInitLoading } = this.props;
    const tabItem = [
      {
        id: 1,
        name: formatMessage({ id: 'mywork_editing' }),
      },
      {
        id: 2,
        name: formatMessage({ id: 'mywork_published' }),
      },
    ];
    return (
      <div className={styles.singleGameList} onClick={(e)=>{this.stopPropagation(e)}}>
        <Affix offsetTop={0} target={() => this.props.lobby.el}>
          <TagsLobby
            tags={tagsData}
            switch={false}
            more={2}
            defaultKey="0"
            onChange={this.TagsLobbyChange}
          />
        </Affix>
        <div className={styles.main}>
          <SortTab
            border={2}
            title={formatMessage({ id: 'cat_sort_title' })}
            tabItem={tabItem}
            currentCountByParent={current}
            onChange={this.handleSortChange}
          />
          {/*
                <div className={styles.search}>
                      <i></i>
                      <input onKeyDown={(e)=>this.handleSearch(e)} placeholder={formatMessage({id:'layout_placeholder'})}/>
                </div>
                */}
          {lobbyInitLoading||(!isInitOver)||listLoading|| listPublishLoading ? <PageLoading /> : null}
          {gameList.length > 0 ? (
            <div className={styles['mw-list']}>
              {sort === 0 ? (
                <ListEdit
                  count={count}
                  data={gameList}
                  copyOpr={this.copyOpr}
                  onReGetGameList={(oprType)=>this.getGameEditList(currentPage,oprType)}
                />
              ) : (
                <ListPublish
                  count={count}
                  data={gameList}
                  onReGetGameList={this.getGamePublishList}
                />
              )}
              {count>8?(
                <Pagination
                  showQuickJumper
                  defaultCurrent={1}
                  total={count}
                  pageSize={8}
                  current={currentPage}
                  onChange={this.handlePagination}
                />
              ):null}
            </div>
          ) : (
            <div className={'empty-list'}>
              <div className={'empty-icon'} />
              {sort === 0 ? (
                <p>{formatMessage({ id: 'mw_empty_edit' })}</p>
              ) : (
                <p>{formatMessage({ id: 'mw_empty_publish' })}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MyWorks;
