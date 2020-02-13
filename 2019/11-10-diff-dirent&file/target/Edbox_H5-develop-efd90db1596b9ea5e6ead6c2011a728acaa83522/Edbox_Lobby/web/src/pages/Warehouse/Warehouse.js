import React, { Component } from 'react';
import { Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'dva'
import styles from './Warehouse.scss';
import { formatMessage } from 'umi/locale'
import TagsLobby from '../../components/TagsLobby/TagsLobby';
import SortTab from '../../components/SortTab/SortTab';
import GameCard from '../../components/GameCard/GameCard';
import PageLoading from '@/components/PageLoading';


const { Edbox } = window;

@connect(({ lobby, Warehouse}) => ({
  lobby: lobby,
  Warehouse: Warehouse
}))
class Warehouse extends Component {
    constructor(props){
      super(props)
      this.state = {
        gameList: [],
        tagsData: [],
        loading: false,
        hasMore: true,
        page: 1,
        cat: '',
        order: this.props.Warehouse.wareSort === 0 ? "!popular" : "!releasetime",
        getInfoLoading: true,
        count: 0,
        defaultKey: this.props.lobby.globalTagId || 'all',
        word: '',
        searchTips: false
      }
      this.tag_0 = [{
        id: 'all',
        value: formatMessage({id:'tag_all'})
      }]
    }

    componentWillMount(){
      const { dispatch, lobby } = this.props
      const { globalTagId } = lobby
      const { page, order } = this.state;
      // console.log(globalTagId === '0' ? '' : globalTagId,43333)
      dispatch({
        type:'Warehouse/getTags',
        payload:{},
        callback:(data)=>{
          this.setState({
            tagsData: this.tag_0.concat(data)
          })
          this.getGameList(globalTagId,page,order,'')
        }
      })
    }

    getGameList = (word,page,order,cat) =>{
      const { dispatch } = this.props
      const { gameList } = this.state
      const _this = this
      dispatch({
        type:'Warehouse/getGameList',
        payload:{
          page: page,
          order: order,
          cat: cat,
          word: word
        },
        callback(data,count){
          if(data.error){
            _this.setState({
              gameList: [],
              loading: false,
              getInfoLoading: false,
              count: 0
            })
          }else{
            _this.setState({
              gameList: gameList.concat(data),
              loading: false,
              getInfoLoading: false,
              count: count
            })
          }
          
        }
      })
    }

    handleInfiniteOnLoad = () =>{
      const { page, order, cat, gameList, count, word } = this.state;
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
        page: page + 1,
      })
      this.getGameList(word,page+1,order,cat)
    }

    handleSortChange = (key) =>{
      const { dispatch } = this.props
      const { cat, word } = this.state;
      console.log(key,'========')
      dispatch({
        type:'Warehouse/setWareSort',
        payload:{
          wareSort: key
        }
      })      
      this.setState({
        order: key === 0 ? "!popular" : "!releasetime",
        page: 1,
        gameList: [],
        getInfoLoading: true,
        hasMore: true,
      },()=>{
        this.getGameList(word,1,this.state.order,cat)
      })

      Edbox.DataStatistic.ClickEvent(key === 0 ? 'MostPopular' : 'MostRecent','MainPage','')
    }

    TagsLobbyChange = (id) =>{
      const catId = id === 'all' ? '' : id
      const { order } = this.state;
      const { dispatch } = this.props
      this.setState({
        cat: catId,
        page: 1,
        gameList: [],
        getInfoLoading: true,
        word: catId,
        hasMore: true,
        searchTips: false,
        defaultKey:catId,
      },()=>{
        this.getGameList(catId,1,order,catId)
      })
      dispatch({
        type:'lobby/setGlobalTag',
        payload:{
          globalTagId: catId
        }
      })
    }

    componentWillReceiveProps(nextProps){
      const { order, cat } = this.state
      if(nextProps.lobby.globalSearchIndex !== this.props.lobby.globalSearchIndex){
        // console.log(nextProps.lobby.globalSearchIndex,this.props.lobby.globalSearchIndex,666666666)
        this.setState({
          page: 1,
          gameList: [],
          getInfoLoading: true,
          defaultKey:'all',
          hasMore: true,
          word:nextProps.lobby.globalSearchKey,
          searchTips: true
        },()=>{
          this.getGameList(nextProps.lobby.globalSearchKey,1,order,cat)
        })
      }
    }

    render() {
        const { gameList,tagsData, getInfoLoading, defaultKey, searchTips } = this.state
        const { Warehouse } = this.props
        const { wareSort } = Warehouse
        const tabItem = [
          {
            id:1,
            name:formatMessage({id:'cat_sort_1'})
          },
          {
            id:2,
            name:formatMessage({id:'cat_sort_2'})
          }
        ]
        return (
            <div className={styles.categoriesLayer}>
              {/* <Affix offsetTop={0} target={() => this.props.lobby.el}> */}
              <TagsLobby
                fixed={true}
                tags={tagsData}
                defaultKey={defaultKey}
                switch={false}
                onChange={this.TagsLobbyChange}
              />
              {/* </Affix> */}
                <div className={styles.categoriesMain}>
                <SortTab
                    title={formatMessage({id:'cat_sort_title'})}
                    tabItem={tabItem}
                    current={wareSort}
                    onChange={this.handleSortChange}
                  />
                  {getInfoLoading ? <PageLoading /> : null}
                {
                  gameList.length > 0 ? 
                    
                    <div className={styles.list}>
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
                        statisticCategory='MainPage'
                      />
                      {this.state.loading && this.state.hasMore && (
                        <div style={{textAlign:'center',paddingBottom:'60px'}}>
                          <Spin />
                        </div>
                      )}
                      </InfiniteScroll>
                      
                    </div>
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

export default Warehouse;