import React, {Component} from 'react';
import {formatMessage} from 'umi/locale';
import router from 'umi/router';
import {connect} from 'dva';
import Swiper from 'swiper';
import Header from '@/components/Header';
import 'swiper/dist/css/swiper.css';
import styles from './index.scss';

@connect(({onlineImage}) => ({onlineImage}))

class ImagePreview extends Component {
    swiperInit() {
        const {onlineImage, dispatch} = this.props;
        const {previewImageIndex} = onlineImage;
        const thumbSwiper = new Swiper('#thumbSwiper', {
            slidesPerView: 4,
            spaceBetween: 4,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true
        })
        new Swiper('#mainSwiper', {
            initialSlide: previewImageIndex,
            navigation: {
                nextEl: '#swiperBtnNext',
                prevEl: '#swiperBtnPrev'
            },
            thumbs: {
                swiper: thumbSwiper
            },
            on: {
                slideChange() {
                    dispatch({
                        type: 'onlineImage/setPreviewImageIndex',
                        payload: this.activeIndex
                    })
                }
            }
        });
        this.setState({
            swiper: thumbSwiper
        });
    }
    /**
     * 处理点击头部确认按钮后的操作
     */
    handleConfirm() {
        const {onlineImage, dispatch} = this.props;
        const {selectedImages, previewImageIndex} = onlineImage;
        dispatch({
            type: 'onlineImage/setEditImage',
            payload: selectedImages[previewImageIndex]
        })
        router.push('/Edbox_ImageSelector/EditImage');
    }
    componentDidMount() {
        this.swiperInit();
    }
    render() {
        const {onlineImage} = this.props;
        const {imageSelectType, selectedImages} = onlineImage;
        return (
            <div className={`${styles['online-image']} online-image page-wrap ${imageSelectType === 'single' ? styles['single'] : styles['multi']} `}>
                <Header className={styles['header']} title={formatMessage({id: 'online_picture'}).toUpperCase()} theme="white" confirmTxt={formatMessage({id: 'select'})} back onConfirm={this.handleConfirm.bind(this)}/>
                <div className="swiper">
                    <div id="mainSwiper" className={`main-swiper ${selectedImages.length <= 1 ? 'center' : ''}`}>
                        <div className="swiper-wrapper">
                            {selectedImages.map(item => 
                                <div className="swiper-slide" key={item.id}>
                                    <img src={item.url} alt={item.name}/>
                                </div>
                            )}
                        </div>
                    </div>
                    <div id="thumbSwiper" className={`thumb-swiper ${selectedImages.length <= 1 ? 'hidden' : ''}`}>
                        <div className="swiper-wrapper">
                            {selectedImages.map((item, index) => 
                                <div className="swiper-slide selected" key={item.id} style={{backgroundImage: `url(${item.url})`}}>
                                    <span>{index + 1}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ImagePreview;