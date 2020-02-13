import React, {Component} from 'react';
import {formatMessage, getLocale} from 'umi/locale';
import {connect} from 'dva';
import {Tabs} from 'antd-mobile';
import router from 'umi/router';
import Header from '@/components/Header';
import Search from '@/components/Search';
import Iconfont from '@/components/Iconfont';
import 'swiper/dist/css/swiper.css';
import styles from './index.scss';
import noDataImage from '@/assets/images/no-data.png';

@connect(({onlineImage}) => ({onlineImage}))

class OnlineImage extends Component {
    /**
     * 处理搜索引擎变更
     */
    handleSearchEngineChange(id) {
        const {dispatch} = this.props;
        dispatch({
            type: 'onlineImage/changeSearchEngine',
            payload: id
        })
    }
    /**
     * 处理搜索
     */
    handleSearch() {

    }
    /**
     * 处理图片选择
     */
    handleImageSelect(e, id) {
        e.stopPropagation();
        const {onlineImage, dispatch} = this.props;
        const {imageSelectType, maxSelectImages, imageList, selectedImages} = onlineImage;
        if (!selectedImages) {
            return;
        } 
        for (let i = 0; i < selectedImages.length; i++) {
            if (selectedImages[i].id === id) {
                selectedImages.splice(i, 1);
                dispatch({
                    type: 'onlineImage/handleSelectedImages',
                    payload: selectedImages
                })
                return;
            }
        }
        if (selectedImages.length >= maxSelectImages) {
            return;
        }
        if (imageSelectType === 'single') {
            selectedImages.pop();
        }
        for (let i = 0; i < imageList.length; i++) {
            if (imageList[i].id === id) {
                selectedImages.push(imageList[i]);
                dispatch({
                    type: 'onlineImage/handleSelectedImages',
                    payload: selectedImages
                })
                break;
            }
        }
    }
    handleImagePreview(index) {
        const {onlineImage, dispatch} = this.props;
        const {selectedImages} = onlineImage;
        if (selectedImages.length) {
            dispatch({
                type: 'onlineImage/setPreviewImageIndex',
                payload: index
            });
            router.push('/Edbox_ImageSelector/ImagePreview');
        }
    }
    /**
     * 处理点击头部确认按钮后的操作
     */
    handleConfirm() {
        const {onlineImage, dispatch} = this.props;
        const {selectedImages} = onlineImage;
        if (selectedImages && selectedImages.length) {
            dispatch({
                type: 'onlineImage/setEditImage',
                payload: selectedImages[0]
            })
            dispatch({
                type: 'onlineImage/setPreviewImageIndex',
                payload: 0
            })
            router.push('/Edbox_ImageSelector/EditImage');
        }
    }
    render() {
        const {onlineImage} = this.props;
        const {searchEngineList, searchEngineId, imageTypeList, imageSelectType, imageList, selectedImages} = onlineImage;
        return (
            <div className={`${styles['online-image']} online-image page-wrap ${imageSelectType === 'single' ? styles['single'] : styles['multi']} `}>
                <Header className={styles['header']} title={formatMessage({id: 'online_picture'}).toUpperCase()} theme="white" confirmTxt={formatMessage({id: 'select'})} back onConfirm={this.handleConfirm.bind(this)}/>
                <div className={`${styles['fixed-top']} side-pd`}>
                    <Search className={styles['search']} engineList={searchEngineList} engineId={searchEngineId} onEngineChange={this.handleSearchEngineChange.bind(this)} onSearch={this.handleSearch.bind(this)}/>
                    {imageTypeList && imageTypeList.length ? 
                        <Tabs 
                            animated={false}
                            tabs={
                                imageTypeList.map(type => {
                                    return {title: getLocale() === 'en-US' ? type.englishName : type.chineseName}
                                })
                            }
                        >
                            {
                                imageTypeList.map(type => 
                                    imageList && imageList.length ? 
                                    <ul className={`${styles['img-list']} clearfix`} key={type.id}>
                                        {imageList.map(img => {
                                            let isSelected = 0;
                                            let index = 0;
                                            for(let i = 0; i < selectedImages.length; i++) {
                                                if (selectedImages[i].id === img.id) {
                                                    isSelected = true;
                                                    index = i + 1;
                                                    break;
                                                }
                                            }
                                            return (
                                                <li key={img.id} style={{backgroundImage: `url(${img.url})`}} className={isSelected ? styles['active'] : ''} onClick={isSelected ? this.handleImagePreview.bind(this, index - 1) : null}>
                                                    <span onClick={e => this.handleImageSelect(e, img.id)}>
                                                        {imageSelectType === 'single' ? 
                                                            <Iconfont type="icon-success"/> : (index ? index : null)
                                                        }
                                                    </span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    : 
                                    <div className={styles['no-data']} key={type.id}>
                                        <div className={styles['tips']}>
                                            <img src={noDataImage} alt=''/>
                                            {formatMessage({id: 'no_result_match'}).split('<br>').map((str, i) => <p key={i}>{str}</p>)}
                                        </div>
                                    </div>
                                )
                            }
                        </Tabs>
                        :
                        null
                    }
                </div>
            </div>
        )
    }
}

export default OnlineImage;