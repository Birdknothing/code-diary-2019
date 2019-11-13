import React, { Component } from 'react';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { Popover, Icon } from 'antd';
import { formatMessage } from 'umi/locale'

@connect(({ lobby,MyWorks, Warehouse}) => ({
    lobby: lobby,
    MyWorks,
    Warehouse
}))
class LobbySidebar extends Component {
    constructor(props){
        super(props)
        this.state = {
            menuDom: '',
            quickListHistory: [],
            quickListMyWorks: [],
            quickDomHistory: '',
            quickDomMyWorks: '',
            imgBoxH: [],
            imgBoxM:[],
            quick_list:[],
            quickListIcon: false,
        }
        this.state.menu = [
            {
                name:formatMessage({id:'menu_Warehouser'}),
                route:'/Warehouse/Warehouse',
                icon: require('../../assets/layout/icon-mod-house.png')
            },
            // {
            //     name:'Roxbury School',
            //     route:'/Roxbury/Roxbury',
            //     icon: require('../assets/layout/icon-mod-roxbury.png')
            // },
            {
                name:formatMessage({id:'menu_my_games'}),
                route:'/SingleGameList/MyWorks',
                icon: require('../../assets/layout/icon-mod-games.png')
            },
            {
                name:formatMessage({id:'menu_library'}),
                route: 'libUrl',
                icon: require('../../assets/layout/icon-mod-library.png')
            },{
                name:formatMessage({id:'menu_course'}),
                route: 'elearningUrl',
                icon: require('../../assets/layout/icon-mod-course.png')
            },
            // {
            //     name:formatMessage({id:'menu_activity'}),
            //     route:'/',
            //     icon: require('../assets/layout/icon-mod-activity.png')
            // }
        ]
    }

    componentWillMount(){
        const { dispatch } = this.props
        dispatch({
          type:'lobby/getHistoryList',
          payload:{
              page: 1,
              size: 5,
              name: ''
          },
          callback:(data)=>{
            if(data.data){

            }else if(data.length > 0){
                data.slice(0,5).forEach(item=>{
                    this.getGameIcon(item.game_icon,'imgBoxH')
                })
                this.setState({
                    quickListHistory: data.slice(0,5),
                    quickListIcon: true,
                })
            }else{
                dispatch({
                    type:'lobby/getGameList',
                    payload:{
                      page: 1,
                      order: "!popular",
                      cat: '',
                      word: ''
                    },
                    callback:(data)=>{
                        data.slice(0,5).forEach(item=>{
                            this.getGameIcon(item.game_icon,'imgBoxH')
                        })
                        this.setState({
                            quickListHistory: data.slice(0,5),
                            quickListIcon: false,
                        })
                    }
                  })
            }
          }
        })

        dispatch({
            type:'lobby/getEditList',
            payload:{
              page:1,
              size:5,
            },
            callback:(data)=>{
              data.data.forEach(item=>{
                  this.getGameIcon(item.game_icon,'imgBoxM')
              })
              this.setState({
                quickListMyWorks: data.data,
              })
            }
        })
    }


    componentDidMount(){

        this.setState({
            menuDom: this.handleMainModMenu(this.state.menu)
        })
    }

    handleMainModMenu = (menu) =>{
        const location_hash = window.location.hash.replace('#','');
        return(<div className={'main-mod'}>{
            menu.map((item,i)=>{
                return(<div key={i} className={`mod-item ${location_hash.indexOf(item.route) !== -1 ? 'active':''}`} onClick={()=>this.goTo(item.route)}>
                    <span className={'mod-icon'}><img src={item.icon} alt=""/></span>
                    <span className={'mod-name'}>{item.name}</span>
                </div>)
            })
        }</div>)

    }

    getGameIcon = (id,target) =>{
        const { dispatch } = this.props
        return dispatch({
            type: 'lobby/getImageUrl',
            payload:{
                resourceid: id
            },
            callback:(data)=>{
                // console.log(data)
                this.setState(prevState=>({
                    [target]: prevState[target].concat(data)
                }))
            }
        })
    }

    goTo = (url) =>{
        const { dispatch } = this.props
        if(url === this.props.location.pathname){
            return
        }
        if(url.indexOf('libUrl') >= 0){

            dispatch({
                type:'lobby/getLibUrl',
                payload:{},
                callback:(data)=>{
                    window.open(data)
                }
            })
            return
        }
        if(url.indexOf('elearningUrl') >= 0){
            dispatch({
                type:'lobby/getElearningUrl',
                payload:{},
                callback:(data)=>{
                    window.open(data)
                }
            })
            return
        }
        router.push(url)
        this.setState({
            menuDom: this.handleMainModMenu(this.state.menu)
        })
    }

    goToMyWork=()=>{
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
      this.goTo('/SingleGameList/MyWorks');
    }

    goToDetail = id => {
        router.push('/Detail/' + id);
    };
    goToDetailMyWork = id => {
        router.push('/Detail/' + id +'?game_type=mywork');
    };

    handleSidebarStatu = () =>{ //侧边栏收起展开
        const { dispatch, lobby = {} } = this.props;
        const { layoutShow } = lobby;
        const showStatu = !layoutShow;

        dispatch({
            type: 'lobby/setSidebar',
            payload: {
                layoutShow: showStatu,
            }
        })
    }
    componentWillReceiveProps(nextProps){
        const { dispatch } = this.props
        if(this.props.location.pathname !== nextProps.location.pathname){
            this.setState({
                menuDom: this.handleMainModMenu(this.state.menu)
            })
        }
        if(nextProps.lobby.playStatu !== this.props.lobby.playStatu){
            this.setState({
                imgBoxH: [],
            })
            dispatch({
                type:'lobby/getHistoryList',
                payload:{
                    page: 1,
                    size: 5,
                    name: ''
                },
                callback:(data)=>{
                  if(data.data){

                  }else if(data.length > 0){
                      data.slice(0,5).forEach(item=>{
                          this.getGameIcon(item.game_icon,'imgBoxH')
                      })
                      this.setState({
                          quickListHistory: data.slice(0,5),
                          quickListIcon: true,
                      })
                  }else{
                      dispatch({
                          type:'lobby/getGameList',
                          payload:{
                            page: 1,
                            order: "!popular",
                            cat: '',
                            word: ''
                          },
                          callback:(data)=>{
                              data.slice(0,5).forEach(item=>{
                                  this.getGameIcon(item.game_icon,'imgBoxH')
                              })
                              this.setState({
                                  quickListHistory: data.slice(0,5),
                                  quickListIcon: false,
                              })
                          }
                        })
                  }
                }
              })
        }
        if(nextProps.lobby.editStatu !== this.props.lobby.editStatu){
            this.setState({
                imgBoxM: [],
            })
            dispatch({
                type:'lobby/getEditList',
                payload:{
                  page:1,
                  size:5,
                },
                callback:(data)=>{
                  data.data.forEach(item=>{
                      this.getGameIcon(item.game_icon,'imgBoxM')
                  })
                  this.setState({
                    quickListMyWorks: data.data,
                  })
                }
            })
        }
    }
    render() {
        const { quickListHistory, quickListMyWorks, quickListIcon, imgBoxH, imgBoxM } = this.state
        return (
            <div className={`layout-sidebar ${this.props.show ? 'open' : 'close'}`}>
                <div className={'main-mod'}>
                    {this.state.menuDom}
                </div>
                <div className={'quick-list'}>
                    {
                        quickListHistory.length > 0 && quickListIcon ?
                        <div className="tit-wrap">
                            <div className={'tit'}>{formatMessage({id:'sidebar_history'})}</div>
                            <div className={'ico icon-history'}></div>
                        </div>
                        :null
                    }
                    {
                        quickListHistory.length > 0 && !quickListIcon ?
                        <div className="tit-wrap">
                            <div className={'tit'}>{formatMessage({id:'sidebar_recommend'})}</div>
                            {/* <div className={'ico icon-history'} onClick={()=>this.goTo('/Warehouse/Warehouse')}></div> */}
                            <Icon className={'ico icon-recommend'} type="star" theme="filled" />
                        </div>
                        :null
                    }
                    {
                        quickListHistory.map((item,i)=>(
                            <div key={item.id} className={'quick-item'}>
                                <span className={'game-icon'}><img src={imgBoxH[i]} alt=""/></span>
                                <span className={'game-name'}>{item.game_name}</span>
                            </div>
                        ))
                    }
                    {
                        quickListMyWorks.length > 0 ?
                        <div className="tit-wrap">
                            <div className={'tit'}>{formatMessage({id:'sidebar_my_work'})}</div>
                            <div className={'ico icon-like'}></div>
                        </div>
                        :null
                    }
                    {
                        quickListMyWorks.map((item,i)=>(
                            <div key={item.id} className={'quick-item'} title={item.game_name}>
                                <span className={'game-icon'}><img src={imgBoxM[i]} alt=""/></span>
                                <span className={'game-name'}>{item.game_name}</span>
                            </div>
                        ))
                    }
                </div>
                    <div className={'btn-bot toppest'} onClick={()=>this.handleSidebarStatu()}>
                        {
                            this.props.show ?
                            <i></i>
                            :
                            <Popover
                            placement={'top'}
                            mouseEnterDelay={0.4} content={this.props.show ? formatMessage({id:'sidebar_pack_up'}) : formatMessage({id:'sidebar_unfold'})}>
                                    <i></i>
                            </Popover>
                        }
                        <span>{formatMessage({id:'pack_up'})}</span>
                    </div>
            </div>
        );
    }
}

export default withRouter(LobbySidebar);
