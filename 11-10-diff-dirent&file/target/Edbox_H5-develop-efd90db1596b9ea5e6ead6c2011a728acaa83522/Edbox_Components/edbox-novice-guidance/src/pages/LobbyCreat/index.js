import React, { Component } from 'react';
// import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { Affix,Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import InfiniteScroll from 'react-infinite-scroller';
import TagsLobby from '@/components/TagsLobby';
import styles from './index.scss';
import GameCard from '@/components/GameCard/GameCard';
import PageLoading from '@/components/PageLoading';
import lobbyBaseUrl from '@/utils/lobbyBaseUrl';

const {Edbox} = window;

@connect(({ lobby,loading }) => ({
  lobby,
  loading: loading.effects['lobby/getCreatList'],
}))
class LobbyCreat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagsData: [],
      gameList: [],
      hasMore: true,
      page: 1,
      getInfoLoading: true,
      count: 0,
      defaultKey: 'all',
      word: '',
    };
    this.tag_0 = [
      {
        id: 'all',
        value: formatMessage({ id: 'tag_all' }),
      },
    ];
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'lobby/getCreateFirstFxiedData',
      callback:res=>{
        dispatch({
          type: 'lobby/getTags',
          payload: {},
          callback: data => {
            this.setState({
              tagsData: this.tag_0.concat(data),
              word: '',
            });
            this.getGameList('', page,res);
          },
        });
        // 优化刷新页面仍然是处于最开始的第二步
        dispatch({
          type: 'global/setStep',
          payload: {
            activeStep: 2,
          },
        });
      }
    });



  }

  componentDidMount(){
    Edbox.Start();
    // 监听消息
    window.addEventListener("message",(e)=>{
        // 引导完成去往我的作品
        if(e.data==='clickGoToMyWork'){
          // window.location.href = Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), lobbyBaseUrl+'/#/SingleGameList/MyWorks');
          Edbox.Message.Broadcast("GuideFinish",[true]);
          // console.log('点击了去往我的作品按钮');
        }
    });
  }

  getGameList = (word, page, unshiftData) => {
    const { dispatch } = this.props;
    const { gameList } = this.state;
    const _this = this;
    dispatch({
      type: 'lobby/getCreatList',
      payload: {
        page: page,
        word: word,
      },
      callback(data, count) {
        // console.log('创作返回的数据：',data,unshiftData);
        // 当前仅当第一页的时候插入第一条固定数据
        if(page ===1&&unshiftData){
          gameList.unshift(unshiftData);
        }

        _this.setState({
          page,
          gameList: gameList.concat(data),
          getInfoLoading: false,
          count: count,
        });
      },
    });
  };

  handleInfiniteOnLoad = () => {
    const { page, count, gameList, word } = this.state;
    if (gameList.length >= count) {
      //模拟数据加载完成
      this.setState({
        hasMore: false,
      });
      return;
    }
    this.getGameList(word, page + 1);
  };
  emptyFunction = () => {};

  render() {
    const { tagsData, gameList, getInfoLoading, defaultKey,hasMore } = this.state;
    const {loading} = this.props;
    return (
      <div className={`${styles.singleGameList}`}>
        <Affix offsetTop={0} target={() => this.props.lobby.el}>
          <TagsLobby
            tags={tagsData}
            defaultKey={defaultKey}
            switch={false}
            onChange={this.emptyFunction}
          />
        </Affix>
        <div className={styles.main}>
          {getInfoLoading ? <PageLoading /> : null}
          {gameList.length > 0 ? (
            <InfiniteScroll
              initialLoad={true}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!loading &&hasMore}
              useWindow={false}
              threshold={10}
              getScrollParent={() => this.props.lobby.el}
            >
              <GameCard datas={gameList} type="simple" isDetail="disable" />
              {loading && hasMore && (
                <div style={{ textAlign: 'center', paddingBottom: '60px' }}>
                  <Spin />
                </div>
              )}
            </InfiniteScroll>
          ) : (
            <div className={'empty-list'}>
              <div className={'empty-icon'} />
              <p>{formatMessage({ id: 'empty_tips_list' })}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(LobbyCreat);
