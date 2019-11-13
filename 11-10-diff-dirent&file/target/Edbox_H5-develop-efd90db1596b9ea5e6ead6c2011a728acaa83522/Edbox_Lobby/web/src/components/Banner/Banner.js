import React, { Component } from 'react';
import { connect } from 'dva'
import { getLocale } from 'umi/locale'
import Swiper from 'swiper3/swiper3';
import 'swiper3/swiper3.css'
import styles from './Banner.scss';
// import defaultBanner from '@/assets/layout/default-detail.jpg';

@connect(({ lobby }) => ({
    lobby: lobby,
}))
class Banner extends Component {
    constructor(props){
        super(props)
        this.state = {
            full: this.props.full,
            thumbnail: this.props.thumbnail,
            swiperIndex: 0,
            game_img_full:[]
        }
    }

    componentWillMount(){
        // this.getGameBanner(this.props.full)
        // const _this = this
    }

    getGameBanner = arr =>{
        const { dispatch } = this.props
        const _this = this
        arr.forEach((item,i)=>{
            const { game_img_full } = this.state
            console.log(i, 111)
            dispatch({
                type: 'lobby/getImageUrl',
                payload: {
                    resourceid: item
                },
                callback(data){
                    _this.setState({
                        game_img_full: game_img_full.concat(data.data.url)
                    })
                }
            })
        })
    }

    componentDidMount(){
        const { full } = this.state
        const _this = this
        _this.index = 0;
        this.thumbnailSwiper = new Swiper('#thumbnailSwiper',{
            slidesPerView : 5,
            spaceBetween : 10,
            observer:true,
        })
        _this.thumbnailSwiper = this.thumbnailSwiper
        this.fullSwiper = new Swiper('#fullSwiper',{
            effect : 'fade',
            autoplay: full.length > 1 ? 3000 : 0,
            fade: {
                crossFade: true,
            },
            loop: true,
            observer:true,
            autoplayDisableOnInteraction : false,
            onSlideChangeEnd: function(swiper){
                _this.thumbnailSwiper.slideTo(swiper.realIndex,1000,false)
                _this.setState({
                    swiperIndex: swiper.realIndex
                })
            }
        })
    }
    componentWillUnmount(){
        if (this.fullSwiper) { // 销毁fullSwiper
            this.fullSwiper.destroy()
        }
        if (this.thumbnailSwiper) { // 销毁thumbnailSwiper
            this.thumbnailSwiper.destroy()
        }
    }

    fullSwiperChange = (index) =>{
        this.fullSwiper.slideTo(index+1,1000,false)
        this.setState({
            swiperIndex: index
        })
    }

    render() {
        const { full,swiperIndex} = this.state;
        const defaultBanner = getLocale() === 'zh-CN' ? require('@/assets/layout/default-detail.jpg') : require('@/assets/layout/default-detail-en.jpg')
        return (
            <div className={styles.banner}>
                <div id="fullSwiper" className={`swiper-container ${styles.full}`}
                    onMouseOver={()=>this.fullSwiper.stopAutoplay()}
                    onMouseLeave={()=>this.fullSwiper.startAutoplay()}
                >
                    <div className="swiper-wrapper">
                        {
                            full.length !==0 ? full.map((item,i)=>(
                                <div key={i} className="swiper-slide"><img src={item} alt=""/></div>
                            )):
                            [defaultBanner].map((item,i)=>(
                                <div key={i} className="swiper-slide"><img src={item} alt=""/></div>
                            ))
                        }
                        {/* {
                            full.map((item,i)=>(
                                <div key={i} className="swiper-slide"><img src={item} alt=""/></div>
                            ))
                        } */}
                    </div>
                </div>
                <div id="thumbnailSwiper" className={`swiper-container ${styles.thumbnail}`}>
                    <div className="swiper-wrapper">
                        {
                            full.length !==0 ? full.map((item,i)=>(
                                <div key={i} onClick={()=>this.fullSwiperChange(i)} className={`swiper-slide ${swiperIndex=== i? 'active' : ''}`}><img src={item} alt=""/><span></span></div>
                            )): 
                            [defaultBanner].map((item,i)=>(
                                <div key={i} onClick={()=>this.fullSwiperChange(i)} className={`swiper-slide ${swiperIndex=== i? 'active' : ''}`}><img src={item} alt=""/><span></span></div>
                            ))
                        }
                        {/* {
                            full.map((item,i)=>(
                                <div key={i} onClick={()=>this.fullSwiperChange(i)} className={`swiper-slide ${swiperIndex=== i? 'active' : ''}`}><img src={item} alt=""/><span></span></div>
                            ))
                        } */}
                    </div>
                </div>
            </div>
        );
    }
}

export default Banner;