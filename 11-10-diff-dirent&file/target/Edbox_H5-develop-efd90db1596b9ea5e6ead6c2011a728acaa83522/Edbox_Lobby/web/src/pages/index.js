import React, { Component } from 'react';
import { Affix } from 'antd';
import { connect } from 'dva'
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import Swiper from 'swiper3/swiper3';
import 'swiper3/swiper3.css'
import styles from './index.scss';
import { formatMessage } from 'umi/locale'
import TagsLobby from '../components/TagsLobby/TagsLobby';

const hot_list = [
  {
    img: require('../assets/pic/pic-hot02.jpg'),
    title:'大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大大大大大大大大大大大大大大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大'
  },{
    img: require('../assets/pic/pic-hot01.jpg'),
    title:'大大大大'
  },
]
@connect(({ lobby}) => ({
  lobby: lobby
}))
class Home extends Component {
    constructor(props){
      super(props)
      this.state = {
        hotDom: '',
        tagsData: []
      }
      
      this.tag_0 = [{
        id: 'all',
        value: formatMessage({id:'tag_all'})
      }]
    }
    componentWillMount(){
      router.push('/Warehouse/Warehouse')
      // const { dispatch } = this.props
      // dispatch({
      //   type:'lobby/getTags',
      //   payload:{},
      //   callback:(data)=>{
      //     this.setState({
      //       tagsData: this.tag_0.concat(data)
      //     })
      //   }
      // })
    }
    componentDidMount(){
      // const { lobby } = this.props
      // const { resizeMin, resizeMax} = lobby
      // let skewNum = 246;
      // if(resizeMin){
      //   skewNum = 471
      // }
      // if(resizeMax){
      //   skewNum = 137
      // }
      // this.swiper = new Swiper('#certify .swiper-container', {
      //   watchSlidesProgress: true,
      //   // setWrapperSize :false,
      //   slidesPerView: 'auto',
      //   centeredSlides: true,
      //   loop: true,
      //   loopedSlides: 6,
      //   // width: 640,
      //   // autoplay: 3000,
      //   prevButton: '.swiper-button-prev',
      //   nextButton: '.swiper-button-next',
      //   pagination: '.swiper-pagination',
      //   //paginationClickable :true,
      //   onProgress: function(swiper, progress) {
      //     for (let i = 0; i < swiper.slides.length; i++) {
      //       var slide = swiper.slides.eq(i);
      //       var slideProgress = swiper.slides[i].progress;
      //       let modify = 1;
      //       if (Math.abs(slideProgress) > 1) {
      //         modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
      //       }
      //       let translate = slideProgress * modify * skewNum + 'px';
      //       let scale = 1 - Math.abs(slideProgress) / 5;
      //       let zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
      //       slide.transform('translateX(' + translate + ') scale(' + scale + ')');
      //       slide.css('zIndex', zIndex);
      //       slide.css('opacity', 1);
      //       if (Math.abs(slideProgress) > 3) {
      //         slide.css('opacity', 0);
      //       }
      //     }
      //   },
      //   onSetTransition: function(swiper, transition) {
      //     for (var i = 0; i < swiper.slides.length; i++) {
      //       var slide = swiper.slides.eq(i)
      //       slide.transition(transition);
      //     }
      
      //   },
      //   //处理分页器bug
      //   onSlideChangeStart: function(swiper) {
      //     if (swiper.activeIndex === 4) {
      //       swiper.bullets.eq(9).addClass('swiper-pagination-bullet-active');
      //       console.log(swiper.bullets.length);
      //     }
      //   }
      // })
      // this.setState({
      //   hotDom: this.handleHotList(resizeMax ? hot_list : hot_list.slice(0,11))
      // })
    }
    componentWillUnmount() {
      if (this.swiper) { // 销毁swiper
       this.swiper.destroy()
      }
    }
    componentDidUpdate(data){
      
    }

    handleHotList = (data) =>{
      return(<div className={styles.hotList}>{
        data.map((item,i)=>{
          return(<dl key={i} className={`${styles.item} ${i ===0 ? styles.large : ''}`}>
            <dt>
              <img src={item.img} alt=""/>
              <span className={styles.play}></span>
            </dt>
            <dd>
              <p>{item.title}</p>
            </dd>
          </dl>)
        })
      }</div>)
    }
    TagsLobbyChange = (key,id) =>{
      const { dispatch } = this.props
      // console.log(id,213333331)
      dispatch({
        type:'lobby/setGlobalTag',
        payload:{
          globalTagId: id === 'all' || id === '0' ? '' : id
        }
      })
      router.push('/Warehouse/Warehouse')
    }
    componentWillReceiveProps(nextProps){
      const { lobby } = nextProps
      const { resizeMin, resizeMax} = lobby
      let skewNum = 246;
      if(resizeMin){
        skewNum = 471
      }
      if(resizeMax){
        skewNum = 137
      }
      if((nextProps.lobby.resizeMin !== this.props.lobby.resizeMin) || (nextProps.lobby.resizeMax !== this.props.lobby.resizeMax)){
        this.swiper.destroy()
        this.swiper = new Swiper('#certify .swiper-container', {
          watchSlidesProgress: true,
          // setWrapperSize :false,
          slidesPerView: 'auto',
          centeredSlides: true,
          loop: true,
          loopedSlides: 6,
          // width: 640,
          // autoplay: 3000,
          prevButton: '.swiper-button-prev',
          nextButton: '.swiper-button-next',
          pagination: '.swiper-pagination',
          //paginationClickable :true,
          onProgress: function(swiper, progress) {
            for (let i = 0; i < swiper.slides.length; i++) {
              var slide = swiper.slides.eq(i);
              var slideProgress = swiper.slides[i].progress;
              let modify = 1;
              if (Math.abs(slideProgress) > 1) {
                modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
              }
              let translate = slideProgress * modify * skewNum + 'px';
              let scale = 1 - Math.abs(slideProgress) / 5;
              let zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
              slide.transform('translateX(' + translate + ') scale(' + scale + ')');
              slide.css('zIndex', zIndex);
              slide.css('opacity', 1);
              if (Math.abs(slideProgress) > 3) {
                slide.css('opacity', 0);
              }
            }
          },
          onSetTransition: function(swiper, transition) {
            for (var i = 0; i < swiper.slides.length; i++) {
              var slide = swiper.slides.eq(i)
              slide.transition(transition);
            }
        
          },
          //处理分页器bug
          onSlideChangeStart: function(swiper) {
            if (swiper.activeIndex === 4) {
              swiper.bullets.eq(9).addClass('swiper-pagination-bullet-active');
              console.log(swiper.bullets.length);
            }
          }
        })
        this.setState({
          hotDom: this.handleHotList(resizeMax ? hot_list : hot_list.slice(0,11))
        },()=>{
          console.log(this.state.hotDom)
        })
      }
    }

    render() {
        const img01 = require('../assets/pic/pic-home-banner.png')
        const { hotDom, tagsData } = this.state
        return (
            <div className={'ware-layer'}
            ref={node=>{
              this.container = node
            }}
            >
              <Affix offsetTop={0} target={() => this.props.lobby.el}>
              <TagsLobby
              tags={tagsData}
              switch={true}
              defaultKey={'none'}
              onChange={this.TagsLobbyChange}
              />
              </Affix>
              <div className={'ware-banner'}>
                <div id="certify">
                    <div className="swiper-container">
                    <div className="swiper-wrapper">
                    <div className="swiper-slide"><img src={img01} alt=""/></div>
                    <div className="swiper-slide"><img src={img01} alt="" /></div>
                    <div className="swiper-slide"><img src={img01} alt="" /></div>
                    <div className="swiper-slide"><img src={img01} alt="" /></div>
                    <div className="swiper-slide"><img src={img01} alt="" /></div>
                    <div className="swiper-slide"><img src={img01} alt="" /></div>
                    </div>
                    </div>
                    <div className="swiper-pagination"></div>
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>
                </div>
              </div>
              <div className={'wrapper'}>
                <div className={styles.hotLayer}>
                  <div className={'module-title'}>
                    <h2 className={'hot'}>{formatMessage({id:'hottest_game_zone'})}</h2>
                    <span>{formatMessage({id:'show_all'})}</span>
                  </div>
                </div>
                {hotDom}
              </div>
            </div>
        );
    }
}

export default withRouter(Home);