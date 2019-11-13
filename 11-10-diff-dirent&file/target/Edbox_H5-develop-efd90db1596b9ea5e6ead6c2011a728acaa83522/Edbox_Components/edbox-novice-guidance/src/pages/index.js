import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Affix, Spin,Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './index.scss';
// import lobbyBaseUrl from '@/utils/lobbyBaseUrl';


import NormalModal from '@/components/NormalModal';
import GameCard from '@/components/GameCard/GameCard';
import TagsLobby from '@/components/TagsLobby';
import SortTab from '@/components/SortTab';
import PageLoading from '@/components/PageLoading';

const {Edbox} = window;

@connect(({ global, lobby, loading }) => ({
  global,
  lobby,
  loading: loading.effects['lobby/getGameList'],
}))
class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tagsData: [],
      defaultKey: this.props.lobby.globalTagId || 'all',
      gameList: [],
      page: 1,
      count: 0,
      hasMore: true,
      getInfoLoading: true,
      order: this.props.lobby.wareSort === 0 ? '!popular' : '!releasetime',
      word: '',
      beginGuideVisible: true, // 开始引导弹窗
    };
    this.tag_0 = [
      {
        id: 'all',
        value: formatMessage({ id: 'tag_all' }),
      },
    ];
  }
  componentWillMount() {

    const {
      dispatch,
      lobby: { globalTagId },
    } = this.props;
    const { page, order } = this.state;
    // 获取标签
    dispatch({
      type: 'lobby/getTags',
      payload: {},
      callback: data => {
        this.setState({
          tagsData: this.tag_0.concat(data),
        });
        this.getGameList(globalTagId, page, order, '');
      },
    });

    // 优化刷新页面仍然是处于最开始的第二步
    dispatch({
      type: 'global/setStep',
      payload: {
        activeStep: 0,
      },
    });
  }

  componentDidMount(){
    Edbox.Start();
  }

  getGameList = (word, page, order, cat) => {
    const { dispatch } = this.props;
    const { gameList } = this.state;
    const _this = this;
    dispatch({
      type: 'lobby/getGameList',
      payload: {
        page: page,
        order: order,
        cat: cat,
        word: word,
      },
      callback(data, count) {
        if (data.error) {
          _this.setState({
            gameList: [],
            loading: false,
            getInfoLoading: false,
            count: 0,
          });
        } else {
          _this.setState({
            gameList: gameList.concat(data),
            loading: false,
            getInfoLoading: false,
            count: count,
          });
        }
      },
    });
  };
  handleInfiniteOnLoad = () => {
    const { page, order, gameList, count, word } = this.state;
    if (gameList.length >= count) {
      //模拟数据加载完成
      this.setState({
        hasMore: false,
      });
      return;
    }

    this.getGameList(word, page + 1, order, '');
  };
  handleSortChange = key => {
    const { dispatch } = this.props;
    const { cat, word } = this.state;
    dispatch({
      type: 'lobby/setWareSort',
      payload: {
        wareSort: key,
      },
    });
    this.setState(
      {
        order: key === 0 ? '!popular' : '!releasetime',
        page: 1,
        gameList: [],
        getInfoLoading: true,
        hasMore: true,
      },
      () => {
        this.getGameList(word, 1, this.state.order, cat);
      },
    );
  };
  emptyFunction = () => {};

  // 去往某步
  goToStep = (val) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/setStep',
      payload: {
        activeStep:val,
      },
    });
    dispatch({
      type: 'global/setIsCanOpr',
      payload: {
        isCanOpr: false,
      },
    });
  };

  // 关闭引导
  closeGuide=()=>{
    // window.parent.postMessage('clickNoNeed','*');
    // window.location.href = Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), lobbyBaseUrl+'/#/Warehouse/Warehouse');
    Edbox.Message.Broadcast("GuideFinish",[false]);
    // console.log('点击了关闭引导按钮');
    const {dispatch} = this.props;
    dispatch({
      type: 'global/setIsCanOpr',
      payload: {
        isCanOpr: false,
      },
    });

    this.setState({
      beginGuideVisible: false,
    });
  }

  // 开始引导
  beginGuide=()=>{
    this.setState({
      beginGuideVisible: false,
    },()=>{
      this.goToStep(1);
    });
  }

  render() {
    const { tagsData, defaultKey, gameList, hasMore, getInfoLoading, beginGuideVisible } = this.state;
    const { lobby, loading } = this.props;
    const tabItem = [
      {
        id: 1,
        name: formatMessage({ id: 'cat_sort_1' }),
      },
      {
        id: 2,
        name: formatMessage({ id: 'cat_sort_2' }),
      },
    ];
    return (
      <div className={`${styles.categoriesLayer}`}>
        <Affix offsetTop={0} target={() => lobby.el}>
          <TagsLobby
            fixed={true}
            tags={tagsData}
            switch={true}
            defaultKey={defaultKey}
            onChange={this.emptyFunction}
          />
        </Affix>
        <div className={styles.categoriesMain}>
          <SortTab
            title={formatMessage({ id: 'cat_sort_title' })}
            tabItem={tabItem}
            current={lobby.wareSort}
            onChange={this.handleSortChange}
          />
          {getInfoLoading ? <PageLoading /> : null}
          {gameList.length > 0 ? (
            <div className={`${styles.list}`}>
              <InfiniteScroll
                initialLoad={true}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!loading && hasMore}
                useWindow={false}
                threshold={10}
                getScrollParent={() => lobby.el}
              >
                <GameCard datas={gameList}/>
                {loading && hasMore && (
                  <div style={{ textAlign: 'center', paddingBottom: '60px' }}>
                    <Spin />
                  </div>
                )}
              </InfiniteScroll>
            </div>
          ) : (
            <div className={'empty-list'}>
              <div className={'empty-icon'} />
              <p>{formatMessage({ id: 'empty_tips_list' })}</p>
            </div>
          )}
        </div>
        {/* 开始引导弹窗 */}
        <NormalModal
          visible={beginGuideVisible}
          footer={[
            <Button key="noNeed" onClick={this.closeGuide}>{formatMessage({ id: 'g_btn_no_need' })}</Button>,
            <div className={styles['btn-wrap']} key="ok-btn-wrap"><Button type="primary" onClick={this.beginGuide}>{formatMessage({ id: 'g_btn_ok' })}</Button>
            <span
            className={styles['hand-pointer']}
            alt=""/>
            </div>,
          ]}
        >
          <p>{formatMessage({ id: 'g_tip_welcome' })}</p>
        </NormalModal>
      </div>
    );
  }
}

export default Home;
