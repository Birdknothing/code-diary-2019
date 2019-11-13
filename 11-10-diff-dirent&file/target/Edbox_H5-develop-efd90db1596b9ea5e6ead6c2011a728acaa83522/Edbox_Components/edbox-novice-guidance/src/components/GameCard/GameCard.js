import React, { Component } from 'react';
// import router from 'umi/router';
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import styles from './GameCard.scss'
import defaultAvatar from '@/assets/avatar_default.jpg';
import defaultIcon from '@/assets/components/gamecard/default.jpg';
import TypeOne from './OpenGame/TypeOne';
import TypeTwo from './OpenGame/TypeTwo';
import TypeThree from './OpenGame/TypeThree';

@connect(({ lobby}) => ({
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
        datas.forEach(item=>{
            this.getGameIcon(item.game_icon)
        })
    }

    handleLongNum = (num) =>{
        if(parseInt(num) > 1000000 ){
            return Math.round(num/100000)/10 + 'million'
        }else{
            return num
        }
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
                        imgBox: [...prevState.imgBox.concat('')]
                    }))
                }else{
                    this.setState(prevState=>({
                        imgBox: [...prevState.imgBox.concat(data)]
                    }),()=>{
                        // console.log(this.state.imgBox)
                    })
                }

            }
        })
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.datas !== this.props.datas){
            nextProps.datas.forEach(item=>{
                this.getGameIcon(item.game_icon)
            })
        }
    }

    render() {
        const { isDetail } = this.props
        const games = this.props.datas
        const { imgBox } = this.state;
        // console.log(games);
        return (
            <div className={`${styles.gameCardList} ${this.props.margin === 'nomargin' ? styles.nomargin : ''}`}>
                {
                    games.length > 0 ?
                    games.map((item,i)=>
                    (<dl key={item.id} className={`${styles.game} clearfix ${isDetail === 'disable' ? styles.noCur : ''}`}>
                        <dt style={{cursor:'initial'}}><img src={imgBox[i] ? imgBox[i] : defaultIcon} alt=""/></dt>

                        <dd>
                        <h2 style={{cursor:'initial'}}>{item.game_name}</h2>
                            {
                                this.state.type === 'normal' ?
                                <div>
                                    <div className={styles.tags}>{item.tags && item.tags.join('/')}</div>
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
                                    />
                                    :
                                    <TypeTwo
                                    id={item.id}
                                     />
                                }

                                {this.state.type === 'normal'?
                                    <div className={styles.author}>
                                        <span className={styles.portrait}><img src={item.author_head ? item.author_head : defaultAvatar} alt=""/></span>
                                        <span className={styles.authorName}>{item.author}</span>
                                    </div>
                                    :
                                    <div className={styles['creat-option']}>
                                        <TypeThree
                                        ver={item.version}
                                        id={item.id}
                                        data={item}
                                        />
                                        {/* <ExportTpl
                                        icon={item.game_icon}
                                        appId={item.id}
                                        gameName={item.game_name}
                                        /> */}
                                    </div>
                                    // <span className={styles.create}>CREATE</span>
                                }

                            </div>
                        </dd>
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
