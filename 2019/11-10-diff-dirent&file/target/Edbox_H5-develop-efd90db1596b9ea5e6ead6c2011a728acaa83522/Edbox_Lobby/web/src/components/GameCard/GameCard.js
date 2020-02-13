import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import styles from './GameCard.scss'
import defaultAvatar from '@/assets/personalcenter/avatar_default.jpg';
import defaultIcon from '@/assets/components/gamecard/default.png';
import TypeOne from './OpenGame/TypeOne';
import TypeTwo from './OpenGame/TypeTwo';
import TypeThree from './OpenGame/TypeThree';
import ExportTpl from './ExportTpl';

@connect(({ detail, lobby}) => ({
    detail:detail,
    lobby:lobby
}))
class GameCard extends Component {
    constructor(props){
        super(props)
        this.state = {
            type: this.props.type || 'normal',
            imgBox: []
        }
    }

    componentWillMount(){
        const { datas } = this.props
        this.getImgBatch(this.imgArrGet(datas))
    }

    imgArrGet = (data) =>{
        let result = [];
        for(let i = 0, j = data.length; i < j; i++){
            result.push(data[i].game_icon)
        }
        return result;
    }

    handleLongNum = (num) =>{
        if(parseInt(num) > 1000000 ){
            return Math.round(num/100000)/10 + 'million'
        }else{
            return num
        }
    }

    goTo = (id) =>{
        const { isDetail } = this.props
        if(isDetail === 'disable'){
            return
        }
        router.push('/Detail/'+id)
    }

    getGameIcon = (id) =>{
        const { dispatch } = this.props
        return dispatch({
            type: 'lobby/getImageUrl',
            payload:{
                resourceid: id
            },
            callback:(data)=>{
                if(data.data){
                    this.setState(prevState=>({
                        imgBox: prevState.imgBox.concat('')
                    }))
                }else{
                    this.setState(prevState=>({
                        imgBox: prevState.imgBox.concat(data)
                    }))
                }
                
            }
        })
    }

    getImgBatch = (imgId) =>{
        const { dispatch } = this.props
        dispatch({
            type: 'lobby/getImgBatch',
            payload:{
                resourceid: [...imgId]
            },
            callback:(data)=>{
                let guidValueList = []
                imgId.map((g,i)=>{
                    guidValueList.push(!data[g] ? '' : data[g].Url)
                    return true
                })
                this.setState(prevState =>({
                    imgBox: prevState.imgBox.concat(guidValueList)
                }))
            }
        })
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.datas !== this.props.datas){
            const { imgBox } = this.state
            let newDatas = [...nextProps.datas]
            this.getImgBatch(this.imgArrGet(newDatas.slice(imgBox.length)))
        }
    }

    render() {
        const { isDetail, statisticCategory } = this.props
        const games = this.props.datas
        const { imgBox } = this.state
        return (
            <div className={`${styles.gameCardList} ${this.props.margin === 'nomargin' ? styles.nomargin : ''}`}>
                {
                    games.length > 0 ?
                    games.map((item,i)=>
                    (<dl key={i} className={`${styles.game} clearfix ${isDetail === 'disable' ? styles.noCur : ''}`}>
                        <dt style={{cursor:'initial'}}><img src={imgBox[i] ? imgBox[i] : defaultIcon} alt=""/></dt>
                        <dd>
                        <h2 title={item.game_name}>{item.game_name}</h2>
                            {
                                this.state.type === 'normal' ?
                                <div>
                                    <div title={item.tags && item.tags.join('/')} className={styles.tags}>{item.tags && item.tags.join('/')}</div>
                                    <div className={styles.info}>
                                        {
                                            item.game_score > 0 ?
                                            <div className={styles.star}>
                                                <div className={styles.starbar}>
                                                    <span className={styles.percent} style={{'width':`${(item.game_score/5)*100 + '%'}`}}></span>
                                                </div>
                                                <span className={styles.num}>{Math.floor(item.game_score * 10) / 10}</span>
                                            </div>
                                            :
                                            // <div className={styles.star}>
                                            //     <div className={styles.starbar}>
                                            //         <span className={styles.percent} style={{'width':`0`}}></span>
                                            //     </div>
                                            //     <span className={styles.num}>{0}</span>
                                            // </div>
                                            <span>{formatMessage({id:'detail_less_reviews02'})}</span>
                                        }
                                        {
                                            item.players > 0?
                                            <span className={styles.line}></span>
                                            :null
                                        }
                                        {
                                            item.players > 0?
                                            <div className={styles.players}>
                                                <p>{this.handleLongNum(item.players)} {formatMessage({id:'players'})}</p>
                                            </div>
                                            :null
                                        }
                                    </div>
                                </div>
                                :
                                <div className={styles.brief}>{item.game_description}</div>
                            }
                            
                            <div className={styles.bot}>
                                {
                                    this.state.type === 'normal'?
                                    <TypeOne 
                                    id={item.id}
                                    title={item.game_name}
                                    statisticCategory={statisticCategory}
                                    />
                                    // <span className={styles.play}>PLAY</span>
                                    :
                                    <TypeTwo
                                    id={item.id}
                                    title={item.game_name}
                                    statisticCategory={statisticCategory}
                                     />
                                    // <span className={styles.play}>TRIAL</span>
                                }
                                
                                {this.state.type === 'normal'?
                                    <div className={styles.author}>
                                        <span className={styles.portrait}><img src={item.author_head ? item.author_head : defaultAvatar} alt=""/></span>
                                        <span className={styles.authorName}>{item.author}</span>
                                    </div>
                                    :
                                    <div className={styles['creat-option']}>
                                        <TypeThree
                                        ver={item.version || item.ver}
                                        title={item.game_name}
                                        statisticCategory={statisticCategory}
                                        id={item.id} />
                                        <ExportTpl 
                                        icon={item.game_icon}
                                        appId={item.id}
                                        gameName={item.game_name}
                                        />
                                    </div>
                                    // <span className={styles.create}>CREATE</span>
                                }
                                
                            </div>
                        </dd>
                        {
                            this.state.type === 'normal'?
                            <dd onClick={()=>this.goTo(item.id)} className={styles['game-bot']}></dd>
                            :null
                        }
                    </dl>)
                    )
                    :
                    null
                }
            </div>
        );
    }
}

export default GameCard;