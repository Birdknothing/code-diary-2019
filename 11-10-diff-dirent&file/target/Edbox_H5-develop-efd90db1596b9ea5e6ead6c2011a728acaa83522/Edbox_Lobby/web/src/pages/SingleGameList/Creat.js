import React, { Component } from 'react';
// import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { Affix, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale'
import InfiniteScroll from 'react-infinite-scroller';
import TagsLobby from '../../components/TagsLobby/TagsLobby';
import styles from './SingleGameList.scss';
import GameCard from '../../components/GameCard/GameCard';
import PageLoading from '@/components/PageLoading';

@connect(({ lobby, SingleGame, Warehouse}) => ({
    lobby: lobby,
    Warehouse: Warehouse,
    SingleGame: SingleGame
}))
class Creat extends Component {
    constructor(props){
        super(props)
        this.state = {
            tagsData: [],
            gameList: [],
            loading: false,
            hasMore: true,
            page: 1,
            cat: '',
            getInfoLoading: true,
            count: 0,
            defaultKey: 'all'
        }
        this.tag_0 = [{
          id: 'all',
          value: formatMessage({id:'tag_all'})
        }]
    }

    componentWillMount(){
      const { dispatch } = this.props
      const { page } = this.state;
      dispatch({
        type:'Warehouse/getTags',
        payload:{},
        callback:(data)=>{
          this.setState({
            tagsData: this.tag_0.concat(data),
            word:this.props.lobby.globalSearchKey
          })
          console.log(this.props.lobby.globalSearchKey)
          this.getGameList(this.props.lobby.globalSearchKey,page,data[0].id)
        }
      })

    }

    TagsLobbyChange = (id) =>{
      const catId = id === 'all' ? '' : id
      this.setState({
        word: catId,
        cat: id,
        page: 1,
        gameList: [],
        getInfoLoading: true,
        hasMore: true,
        searchTips: false,
        defaultKey:catId,
      },()=>{
        this.getGameList(catId,1,id)
      })
    }

    getGameList = (word,page,cat) =>{
        const { dispatch } = this.props
        const { gameList } = this.state
        const _this = this
        dispatch({
          type:'SingleGame/getCreatList',
          payload:{
            page: page,
            word: word
          },
          callback(data,count){
            _this.setState({
              gameList: gameList.concat(data),
              loading: false,
              getInfoLoading: false,
              count: count
            })
          }
        })
    }

    handleInfiniteOnLoad = () =>{
        const { page, count, gameList, word } = this.state;
        this.setState({
          loading: true
        });
        if(gameList.length >= count){ //模拟数据加载完成
          this.setState({
            hasMore: false,
            loading: false,
          })
          return;
        }
        this.setState({
          page: page + 1
        })
        this.getGameList(word,page+1)
    }

    componentWillReceiveProps(nextProps){
      const { cat } = this.state
      if(nextProps.lobby.globalSearchIndex !== this.props.lobby.globalSearchIndex){
        this.setState({
          page: 1,
          gameList: [],
          getInfoLoading: true,
          defaultKey:'all',
          searchTips: true,
          hasMore: true,
          word:nextProps.lobby.globalSearchKey,
        },()=>{
          this.getGameList(nextProps.lobby.globalSearchKey,1,cat)
        })
      }
    }
    render() {
        const { tagsData, gameList, getInfoLoading, defaultKey, searchTips } = this.state
        return (
            <div className={styles.singleGameList}>
            <Affix offsetTop={0} target={() => this.props.lobby.el}>
              <TagsLobby
                tags={tagsData}
                defaultKey={defaultKey}
                switch={false}
                onChange={this.TagsLobbyChange}
              />
              </Affix>
            <div className={styles.main}>
              {getInfoLoading ? <PageLoading /> : null}
              {
                gameList.length > 0 ?
                    <InfiniteScroll
                        initialLoad={true}
                        pageStart={0}
                        loadMore={this.handleInfiniteOnLoad}
                        hasMore={!this.state.loading && this.state.hasMore}
                        useWindow={false}
                        threshold={10}
                        getScrollParent={()=>this.props.lobby.el}
                      >
                    <GameCard
                        datas={gameList}
                        type="simple"
                        isDetail="disable"
                        statisticCategory='Template'
                    />
                    {this.state.loading && this.state.hasMore && (
                      <div style={{textAlign:'center',paddingBottom:'60px'}}>
                        <Spin />
                      </div>
                    )}
                    </InfiniteScroll>
                :
                <div className={'empty-list'}>
                    <div className={'empty-icon'}></div>
                    <p>{searchTips ? formatMessage({id:'empty_tips_search'}) : formatMessage({id:'empty_tips_list'})}</p>
                </div>
              }

              </div>
            </div>
        );
    }
}

export default withRouter(Creat);
