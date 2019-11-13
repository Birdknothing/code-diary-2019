import React, { Component } from 'react';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { Affix } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale'
import InfiniteScroll from 'react-infinite-scroller';
import TagsLobby from '../../components/TagsLobby/TagsLobby';
import styles from './SingleGameList.scss';
import GameCard from '../../components/GameCard/GameCard';
import PageLoading from '@/components/PageLoading';

@connect(({ lobby, SingleGame}) => ({
    lobby: lobby,
    SingleGame: SingleGame
}))
class Collect extends Component {
    constructor(props){
        super(props)
        this.state = {
            tagsData: '',
            gameList: [],
            page: 1,
            loading: false,
            hasMore: true,
            getInfoLoading: true,
            count: 0
        }
        this.tags = [
            {
                id:'0',
                route: '/SingleGameList/MyWorks',
                value: formatMessage({id:'sidebar_my_work'})
            },
            {
              id:'1',
              route: '/SingleGameList/History',
              value: formatMessage({id:'game_history'})
            },
            {
              id:'2',
              route: '/SingleGameList/Collect',
              value: formatMessage({id:'game_like'})
            }
        ]
    }

    componentWillMount(){
        const { page } = this.state;
        this.setState({
            tagsData: this.tags
        })
        this.getGameList(page,'')
    }

    TagsLobbyChange = (id) =>{
        const route = this.tags.filter(tags=>tags.id === id)
        if(this.props.location.pathname === route[0]['route']){
            return
        }
        router.push(route[0]['route'])
    }

    getGameList = (page,name) =>{
        const { dispatch } = this.props
        const { gameList } = this.state
        const _this = this
        dispatch({
          type:'SingleGame/getCollectList',
          payload:{
            page: page,
            word: name,
            size: 20
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
        const { page, gameList, count } = this.state;
        const { lobby } = this.props
        const { globalSearchKey } = lobby
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
        this.getGameList(page+1,globalSearchKey)
    }

    // componentWillReceiveProps(nextProps){
    //   if(nextProps.lobby.globalSearchKey !== this.props.lobby.globalSearchKey){
    //     console.log(nextProps.lobby.globalSearchKey)
    //     this.setState({
    //       page: 1,
    //       gameList: []
    //     },()=>{
    //       this.getGameList(1,nextProps.lobby.globalSearchKey)
    //     })
    //   }
    // }
    render() {
        const { tagsData, gameList, getInfoLoading } = this.state
        return (
            <div className={styles.singleGameList}>
            <Affix offsetTop={0} target={() => this.props.lobby.el}>
              <TagsLobby
                tags={tagsData}
                switch={false}
                more={2}
                defaultKey="2"
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
                    />
                    </InfiniteScroll>
                :
                <div className={'empty-list'}>
                    <div className={'empty-icon'}></div>
                    <p>{formatMessage({id:'empty_tips'})}</p>
                </div>
              }
              
              </div>
            </div>
        );
    }
}

export default withRouter(Collect);