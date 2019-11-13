import React, { Component } from 'react';
import { connect } from 'dva'
import withRouter from 'umi/withRouter';
import { Tabs, Popover, Icon } from 'antd';
import styles from './TagsLobby.scss';
import { formatMessage } from 'umi/locale'

const { TabPane } = Tabs;
const { Edbox } = window;

@connect(({ lobby}) => ({
    lobby: lobby
}))
class TagsLobby extends Component {
    constructor(props){
        super(props)
        this.state={
            popVisible: this.props.more || 1,
            visible: false,
            tagsDom: '',
            tagsId: this.props.defaultKey || '0',
            isMax: this.props.lobby.layoutShow
        }
    }

    handleTagsDom = (data,activeKey) =>{
        const thisKey = (activeKey === '' || activeKey === '0') ? 'all' : activeKey
        return(<div className={styles.morePopover}>{
            data.map((item,i)=>{
                return(<p className={thisKey === item.id  ? styles.active : ''} key={item.id} data-id={i+''} data-key={item.id} onClick={(e)=>this.handlePopoverClick(e)}>{item.value}</p>)
            })
        }</div>)
    }

    handlePopoverClick = (e) =>{
        if(e.target.getAttribute('data-key') === 'all'){
            Edbox.DataStatistic.ClickEvent('Recommended','MainPage','')
        }
        this.setState({
            tagsId:e.target.getAttribute('data-key'),
            tagsDom:this.handleTagsDom(this.props.tags,e.target.getAttribute('data-key'))
        })
        this.props.onChange(e.target.getAttribute('data-key'),e.target.getAttribute('data-key'))
    }
    showPopover = () =>{
        const { tagsId } = this.state
        this.setState({
            tagsDom:this.handleTagsDom(this.props.tags,tagsId === 'all' ? '0' : tagsId),
            visible: true
        })
    }
    hide = () =>{
        this.setState({
            visible: false
        })
    }
    handleVisibleChange = visible =>{
        this.setState({ visible })
    }

    handleSwitchChange = () =>{
        const { dispatch, lobby = {} } = this.props;
        const { switchStatu } = lobby;
        dispatch({
            type: 'lobby/setSwitch',
            payload: {
                switchStatu: !switchStatu,
            }
        })
    }

    handlTabsChange = (activeKey) =>{
        if(activeKey === 'all'){
            Edbox.DataStatistic.ClickEvent('Recommended','MainPage','')
        }
        
        if(activeKey === '0'){
            Edbox.DataStatistic.ClickEvent('TabMyWorks','MyWorks','')
        }
        if(activeKey === '1'){
            Edbox.DataStatistic.ClickEvent('TabRecents','MyWorks','')
        }
        if(activeKey === '2'){
            Edbox.DataStatistic.ClickEvent('TabFavorites','MyWorks','')
        }
        this.setState({
            tagsId:activeKey,
            tagsDom:this.handleTagsDom(this.props.tags,activeKey)
        },()=>{
            // this.props.onChange(this.props.tags[parseInt(activeKey)].id,activeKey)
            this.props.onChange(activeKey,activeKey)
        })
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.defaultKey !== this.props.defaultKey){
            this.setState({
                tagsId: nextProps.defaultKey
            })
        }
        if(nextProps.lobby.layoutShow !== this.props.lobby.layoutShow){
            this.setState({
                isMax: nextProps.lobby.layoutShow
            })
        }
    }

    render() {
        const { fixed } = this.props
        const { tagsDom,tagsId, isMax } = this.state
        const title = <span>{formatMessage({id:'show_all'})}</span>
        return (
            <div className={`${styles.tags} ${fixed ? styles.fixed : ''} ${isMax ? styles.max : styles.min}`}>
                <div className={styles.tagsList}>
                <Tabs defaultActiveKey={(tagsId === 'all' || tagsId === '') ? 'all' : tagsId} activeKey={(tagsId === 'all' || tagsId === '') ? 'all' : tagsId} tabPosition={'top'} onChange={(activeKey)=>this.handlTabsChange(activeKey)} tabBarGutter={35} style={{ height: 44 }}>
                {this.props.tags.map((item,i) => (
                    <TabPane tab={item.value} key={item.id}></TabPane>
                ))}
                </Tabs>
                </div>
                {
                    this.state.popVisible === 1 ?
                    <Popover placement="bottomRight" overlayClassName="tagspop" title={title} content={tagsDom} trigger="click" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
                    <div className={styles.more} onClick={()=>this.showPopover()}>
                        <i></i>
                        <i></i>
                        <i></i>
                    </div>
                    </Popover>
                    :
                    null
                }
                
            </div>
        );
    }
}

export default withRouter(TagsLobby);