import React, { Component } from 'react';
import { Affix,Icon, Popover, Statistic, Progress, Rate, Anchor } from 'antd';
import withRouter from 'umi/withRouter';
import styles from './PreView.scss';
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import Banner from '../../../components/Banner/Banner';

const { Link } = Anchor;
const handleClick = (e, link) => {
    e.preventDefault();
};
@connect(({ lobby, PublishGame }) => ({
    lobby: lobby,
    PublishGame:PublishGame,
}))
class PreVIew extends Component {
    constructor(props){
        super(props)
        this.state = {
            game_info: this.props.PublishGame.publishGame,
            tags:[],
            tag_more: false,
            tagsDom: [],
            modalVisible: false, //版本记录弹窗
            modalVisibleComplain: false, //举报
            confirmLoadingComplain: false,
            complainLimit: 380,//举报字数限制
            complainLack: false,
            showWhat: 'about',
            linkDom:'',
            linkDomDes:''
        }
        this.linkDom = <Anchor affix={false} bounds={300} onClick={handleClick} getContainer={() => this.props.lobby.el}>
        <Link href="#detailAbout" title={formatMessage({id:'detail_bot_about'})} />
        <Link href="#detailReviews" title={formatMessage({id:'details_bot_reviews'})} />
        </Anchor>
        this.linkDomDes = <Anchor affix={false} bounds={300} onClick={handleClick} getContainer={() => this.props.lobby.el}>
        <Link href="#detailAbout"/>
        </Anchor>
    }
    componentWillMount(){
        const { tags_game, tags_edu, tags_other } = this.props.PublishGame.publishGame

        this.setState({
            tags: tags_game.concat(tags_edu,tags_other),
            tagsDom: this.handleTagsDom(tags_game.concat(tags_edu,tags_other))
        })
    }
    componentDidMount(){
        if(this.refs.tagBox.clientHeight > 72){
            this.setState({
                tag_more: true
            })
        }
        this.setState({
            linkDom:this.linkDom,
            linkDomDes: this.linkDomDes
        })
    }

    handleTagsDom = (data) =>{
        return(<div className={styles.morePopover}>{
            data.map((item,i)=>(
                item.checked ? <p key={i}>{item.value}</p> : null
            ))
        }</div>)
    }

    back = () =>{
        // router.push('/PublishGame/PublishGame')
        this.props.onChange();
    }

    render() {
        const { game_info, tag_more, tagsDom, tags,linkDom, linkDomDes, } = this.state
        const { lobby } = this.props
        const { isShowPlay } = lobby
        return (
            <div className={styles.main}>
                <Affix offsetTop={0} target={() => this.props.lobby.el}>
                <div className={styles.topBar}>
                    <span className={styles.icon}><img src={game_info.game_icon_url} alt=""/></span>
                    <span className={styles.name}>{game_info.game_name}</span>
                    {isShowPlay&&<div className={`btn-play ${styles.play}`}>{formatMessage({id:'play'})}</div>}
                    <div onClick={this.back} className={`btn-play ${styles.back}`}>{formatMessage({id:'back'})}</div>
                </div>
                </Affix>
                <div className={styles.container}>
                    <div className={`${styles.mainTop} clearfix`}>

                        <Banner
                            full={game_info.image_config['Value']}
                            thumbnail={game_info.image_config['Value']}
                        />
                        <div className={styles.gameInfo}>
                            <div className={`${styles.gameCard} clearfix`}>
                                <div className={styles.gameIcon}><img src={game_info.game_icon_url} alt=""/></div>
                                <div className={styles.gameTitle}>
                                    <h2>{game_info.game_name}<span>(v{game_info.ver})</span></h2>
                                    <div className={styles.gameAuthor}>
                                        {/* <span className={styles.portrait}><img src={game_info.game_author_img} alt=""/></span>
                                        <span className={styles.authorName}>{game_info.game_author_name}</span> */}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.gameDes}>
                                <div className={styles.title}>{formatMessage({id:'detail_description'})}</div>
                                <div className={styles.contentbox}>
                                    {linkDomDes}
                                    <div className={styles.content}>{game_info.game_description}</div>
                                </div>
                            </div>
                            <div className={styles.Tag}>
                                <div className={styles.title}>{formatMessage({id:'detail_tag'})}</div>
                                <div className={styles.contentbox}>
                                    <div ref="tagBox">
                                        {
                                            tags.map((item,i)=>{
                                                const isLongTag = item.value.length > 10;
                                                const tagElem = (
                                                    item.checked ? <p key={item.id}>{isLongTag ? `${item.value.slice(0, 10)}...` : item.value}</p> : null
                                                )
                                                return isLongTag ? (
                                                    <Popover content={item.value} key={item.id}>
                                                        {tagElem}
                                                    </Popover>
                                                ):(tagElem)
                                            })
                                        }
                                    </div>
                                    {
                                        tag_more ?
                                        <Popover placement="bottomRight" content={tagsDom} trigger="click">
                                        <div className={styles.more}>
                                            <p><Icon type="down" style={{'fontSize': '12px','color':'#ccc','cursor':'pointer'}} /></p>
                                        </div>
                                        </Popover>
                                        :
                                        null
                                    }

                                </div>
                            </div>

                            <div className={styles.score}>
                                <div className={styles.title}>{formatMessage({id:'detail_score'})}</div>
                                <div className={`${styles.contentbox} clearfix`}>
                                    {/* <div className={styles.num}><Statistic valueStyle={{color:'#111',fontSize:'40px',fontWeight:'bold',lineHeight:'1'}} value={0} precision={1} /></div> */}
                                    <div className={styles.right}>
                                    <div className={styles.tips}>{formatMessage({id:'detail_less_reviews'})}</div>
                                        {/* <div className={styles.rightInfo}>
                                            <span>0 {formatMessage({id:'detail_experienced'})}</span>
                                            <em>·</em>
                                            <span>0 {formatMessage({id:'detail_reviews'})}</span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.bot}>
                                <div className={`${styles.bot1} clearfix`}>
                                    {/* <span className={styles.playing}>0 {formatMessage({id:'detail_playing'})}</span> */}
                                    <span className={styles.complain}>{formatMessage({id:'detail_complain'})}</span>
                                </div>
                                <div className={`${styles.bot2} clearfix`}>
                                    <span className={styles.play}>{formatMessage({id:'play'})}</span>

                                    {/* <span className={styles.other}><Icon type="export" /></span>
                                    <span className={styles.other}><Icon type="share-alt" /></span>
                                    <span className={styles.other}><Icon type="heart" /></span> */}
                                    <div className={styles['other-box']}>
                                    <span className={styles.other}><i className={styles['icon-export']}></i> <span>{formatMessage({id:'export'})}</span></span>
                                    </div>
                                    <div className={styles['other-box']}>
                                    <span className={styles.other}><Icon type="share-alt" /> <span>{formatMessage({id:'share'})}</span></span>
                                    </div>
                                    <div className={styles['other-box']}>
                                    <span className={styles.other}><Icon type="heart" /> <span>{formatMessage({id:'favorite'})}</span></span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.mainBot}>
                        <div className={styles.detailTab}>
                            {linkDom}
                        </div>
                        <div className={`${styles.contentbox} clearfix`}>
                            <div className={styles.tabContent}>
                                <div className={styles.about}>
                                    <div className={styles.description}>
                                        <h2 id="detailAbout" className={styles.aboutTitle}>{formatMessage({id:'detail_description'})}</h2>
                                        <div className={styles.info}>
                                            {game_info.game_description}
                                        </div>
                                    </div>
                                    <div className={styles.recent}>
                                        <h2 className={styles.aboutTitle}>
                                        {formatMessage({id:'detail_recent_updates'})}
                                        </h2>
                                        {
                                            game_info.ver ?
                                            <div>
                                                <h3 className={styles.recentTitle}>{formatMessage({id:'detail_version'})} {game_info.ver}</h3>
                                                <div className={styles.txt}>
                                                    {game_info.game_update}
                                                </div>
                                            </div>
                                            :
                                            null

                                        }
                                    </div>
                                </div>
                                <div className={styles.reviews}>
                                    <h2  id="detailReviews" className={styles.aboutTitle}>{formatMessage({id:'details_bot_reviews'})}</h2>
                                    <div className={styles.recentTitle}>{formatMessage({id:'details_bot_score'})}:</div>
                                    <div className={`${styles.botReviews} clearfix`}>
                                        <div className={styles.left}>
                                        <div className={styles.tips}>{formatMessage({id:'detail_less_reviews'})}</div>
                                            <p>{formatMessage({id:'detail_bot_last_ver'})} {game_info.ver}</p>
                                        </div>
                                        <div className={styles.right}>
                                            <div className={styles.item}>
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':'100%'}}></span>
                                                </div>
                                                <Progress percent={0} strokeWidth={10} strokeColor="#da0301" showInfo={false} />
                                            </div>
                                            <div className={styles.item}>
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':'80%'}}></span>
                                                </div>
                                                <Progress percent={0} strokeWidth={10} strokeColor="#da0301" showInfo={false} />
                                            </div>
                                            <div className={styles.item}>
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':'60%'}}></span>
                                                </div>
                                                <Progress percent={0} strokeWidth={10} strokeColor="#da0301" showInfo={false} />
                                            </div>
                                            <div className={styles.item}>
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':'40%'}}></span>
                                                </div>
                                                <Progress percent={0} strokeWidth={10} strokeColor="#da0301" showInfo={false} />
                                            </div>
                                            <div className={styles.item}>
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':'20%'}}></span>
                                                </div>
                                                <Progress percent={0} strokeWidth={10} strokeColor="#da0301" showInfo={false} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.comments}>
                                        <div className={styles.recentTitle}>{formatMessage({id:'details_tab_to_rate'})}:</div>
                                        <div className={styles.star}>
                                        <Rate
                                        disabled
                                        style={{fontSize:'43px',color:'#da0301',WebkitTextStroke:'1px #000'}}
                                        />
                                        </div>
                                        <p className={styles.tips}>{formatMessage({id:'detail_bot_tips'})}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(PreVIew);
