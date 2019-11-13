import React, { Component } from 'react';
import { Modal, List, Avatar, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import InfiniteScroll from 'react-infinite-scroller';
import share from './index.scss';
import ButtonShare from './ButtonShare';

@connect(({ lobby }) => ({
    lobby: lobby
}))
class ShareModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            list:[],
            loading: true,
            hasMore: true,
            count: 0,
            word: '',
            offset: 0
        }
    }

    componentDidMount(){
        // this.init()
    }

    init = () =>{
        const { dispatch } = this.props
        dispatch({
            type:'lobby/getFriendList',
            payload:{
                offset: 0,
                size: 10,
                word: ''
            },
            callback:(data)=>{
                // console.log(data,123)
                if(data.data && data.data.error){
                    return
                }
                this.setState({
                    list: data.items,
                    count: data.total,
                    loading: false,
                    hasMore: true,
                })
            }
        })
    }

    getFriendList = (word,offset) =>{
        const { dispatch } = this.props
        const { list } = this.state;
        dispatch({
            type:'lobby/getFriendList',
            payload:{
                offset: offset,
                size: 10,
                word: word
            },
            callback:(data)=>{
                // console.log(data)
                this.setState({
                    list: list.concat(data.items),
                    count: data.total,
                    offset: offset + 10,
                    hasMore: data.items.length < 10 ? false : true,
                    loading: false,
                });
            }
        })
    }

    close = () =>{
        this.props.onChange()
    }
    handleSearch = (e) =>{
        const { dispatch } = this.props
        const value = e.target.value
        if(e.keyCode === 13){
            this.setState({
                word: value,
                loading: true
            },()=>{
                dispatch({
                    type:'lobby/getFriendList',
                    payload:{
                        offset: 0,
                        size: 10,
                        word: value
                    },
                    callback:(data)=>{
                        this.setState({
                            list: data.items,
                            count: data.total,
                            hasMore: true,
                            loading: false,
                        })
                    }
                })
            })
        }
    }
    handleInfiniteOnLoad = (page) =>{
        const { hasMore, offset, word } = this.state;
        // console.log(page,'当前页码')
        this.setState({
            loading: true,
        });
        if (!hasMore) {
            // console.log('加载完毕')
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        // console.log(word,offset+1)
        this.getFriendList(word,offset+(page*10))
        this.setState({
            offset: offset + (page*10)
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible !== this.props.visible && nextProps.visible){
            this.setState({
                list:[],
                loading: true,
                hasMore: true,
                count: 0,
                word: '',
                offset: 0
            },()=>{
                this.init()
            })
        }
    }
    render() {
        const { visible, appId, appName, iconUrl, access, version } = this.props
        const { loading, hasMore, list } = this.state
        return (
            <Modal
            className={share['share']}
            width={644}
            title={formatMessage({id:'share_friends'})}
            visible={visible}
            footer={null}
            onCancel={this.close}
            maskClosable={false}
            destroyOnClose={true}
            >
                <div className={share.search}>
                      <i></i>
                      <input onKeyDown={(e)=>this.handleSearch(e)} placeholder={formatMessage({id:'search'})}/>
                </div>
                <div className={share['share-list']}  ref={node=>{this.container=node}} >
                    {
                        visible ?
                        <InfiniteScroll
                        initialLoad={false}
                        pageStart={0}
                        loadMore={this.handleInfiniteOnLoad}
                        hasMore={!loading && hasMore}
                        useWindow={false}
                        threshold={10}
                        getScrollParent={()=>this.container}
                        >
                            <List
                                dataSource={list}
                                renderItem={(item,i) => (
                                <List.Item key={item.uri}>
                                    <List.Item.Meta
                                    avatar={
                                        <Avatar
                                        size={40}
                                        src={item.iconUrl} />
                                    }
                                    title={item.nickname}
                                    />
                                    <div><ButtonShare 
                                    appId={appId}
                                    appName={appName}
                                    iconUrl={iconUrl}
                                    access={access}
                                    version={version}
                                    id={item.uri}/></div>
                                </List.Item>
                                )}
                                split={false}
                                locale={{emptyText:formatMessage({id:'share_list_empty'})}}
                            >
                                {loading && hasMore && (
                                <div className={share.loading}>
                                    <Spin />
                                </div>
                                )}
                            </List>
                        </InfiniteScroll>
                        :null
                    }
                    
                </div>
            </Modal>
        );
    }
}

export default ShareModal;