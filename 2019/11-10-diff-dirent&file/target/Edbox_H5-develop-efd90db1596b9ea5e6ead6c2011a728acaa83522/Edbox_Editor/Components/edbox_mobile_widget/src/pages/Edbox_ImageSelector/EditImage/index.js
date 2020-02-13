import React, {Component} from 'react';
import {formatMessage} from 'umi/locale';
import router from 'umi/router';
import {connect} from 'dva';
import {Flex, Slider} from 'antd-mobile';
import Cropper from 'react-cropper';
import Header from '@/components/Header';
import ActionSheet from '@/components/ActionSheet';
import Iconfont from '@/components/Iconfont';
import 'cropperjs/dist/cropper.css';
import styles from './index.scss';

const FlexItem = Flex.Item;
@connect(({onlineImage}) => ({onlineImage}))

class EditImage extends Component {
    constructor(props) {
        super(props);
        const currentAction = 0;
        this.state = {
            currentAction: currentAction, // 0=>默认界面，1=>透明度; 2=>旋转; 3=>裁剪;
            actionSheetHeight: this.getActionHeight(currentAction), // 如果是只有单张图的话不显示图片列表，多张是显示图片列表，高度不同
            selectedCutTypeIndex: -1, // 选中的裁剪类型
            isHideCropper: currentAction !== 0 && currentAction !== 3, // 是否隐藏裁剪框
            dragable: true,
            slideRows: 1,
        }
    }
    /**
     * swiper初始化
     */
    swiperInit() {
        const {onlineImage} = this.props;
        const {selectedImages} = onlineImage;
        const {currentAction} = this.state;
        if (!(currentAction === 0 && selectedImages && selectedImages.length > 1) && currentAction !== 3) {
            return;
        }
        const {slideRows} = this.state;
        const oHlistWrap = document.querySelector('.h-list .swiper-wrapper');
        const oHlistItem = oHlistWrap.querySelectorAll('.swiper-slide');
        const gap = parseFloat(window.getComputedStyle(oHlistItem[0]).marginRight);
        if (oHlistWrap && oHlistItem && oHlistItem.length) {
            if (Math.ceil(oHlistItem.length / slideRows) > 5) {
                oHlistWrap.style.width = `${(oHlistItem[0].clientWidth + gap + 0.2) * Math.ceil(oHlistItem.length  / slideRows) + gap}px`;
            } else {
                oHlistWrap.style.width = `${((oHlistItem[0].clientWidth + gap) * 5 + gap)}px`;
            }
        }  
    }
    /**
     * 处理图片选择
     * @param {integer} index 选中的图片索引值
     * @param {object} item 图片信息 
     */
    handleImageSelect(index, item) {
        const {dispatch} = this.props;
        dispatch({
            type: 'onlineImage/setPreviewImageIndex',
            payload: index
        })
        dispatch({
            type: 'onlineImage/setEditImage',
            payload: item
        })
    }
    /**
     * 处理裁剪类型选择
     * @param {integer} index 选中的裁剪类型索引值
     */
    handleCutTypeSelect(index) {
        this.setState({
            selectedCutTypeIndex: index
        })
        if (index === -7) {
            router.push('/Edbox_ImageSelector/OnlineCutType');
        }
    }
    //图片控件3个标签切换
    handleActionChange(id) {
        const isHideCropper = (id !== 0 && id !== 3);
        let {dragable} = this.state; 
        switch (id) {
            case 0:
                dragable = true;
                break;
            case 1:
                dragable = false;
                break;
            case 2:
                dragable = false;
                break;
            case 3:
                dragable = true;
                break;
            default:
                break;
        }
        this.setState({
            currentAction: id,
            actionSheetHeight: this.getActionHeight(id),
            isHideCropper,
            dragable
        })
    }
    /**
     * 处理取消操作
     */
    handleCancel() {
        this.handleActionChange(0);
    }
    /**
     * 处理保存操作
     */
    handleSave() {
        this.handleActionChange(0);
    }
    /**
     * 获取面板高度
     * @param {integer} id 面板操作id
     */
    getActionHeight(id) {
        const {onlineImage} = this.props;
        const {selectedImages} = onlineImage;
        let actionSheetHeight = 100;
        switch (id) {
            case 0:
                if (selectedImages.length > 1) {
                    actionSheetHeight = 341;
                }else {
                    actionSheetHeight = 100;
                }
                break;
            case 1:
                actionSheetHeight = 211;
                break;
            case 2:
                actionSheetHeight = 210;
                break;
            case 3:
                actionSheetHeight = 342;
                break;
            default:
                break;
        }
        return actionSheetHeight;
    }
    /**
     * 处理透明度修改
     * @param {integer} val 透明度值
     */
    handleOpacityChange(val) {
        const {dispatch} = this.props;
        dispatch({
            type: 'onlineImage/setImageOpacity',
            payload: val
        })
        const img = document.querySelector('.cropper-canvas img');
        img.style.opacity = val / 100;
    }
    /**
     * 处理图片翻转
     * @param {string} direction 翻转方向，x或y
     */
    handleFlip(direction) {
        const {onlineImage, dispatch} = this.props;
        const {editImageProperties} = onlineImage;
        const {flipX, flipY} = editImageProperties;
        const img = document.querySelector('.cropper-canvas img');
        if (direction === 'x') {
            dispatch({
                type: 'onlineImage/setImageFlipX',
                payload: - flipX
            })
            img.style.transform = `scaleX(${- flipX})`;
        } else {
            dispatch({
                type: 'onlineImage/setImageFlipY',
                payload: - flipY
            })
            img.style.transform = `scaleY(${- flipY})`;
        }
    }
    /**
     * 处理图片旋转
     * @param {integer} deg 旋转的角度值
     */
    handleRotate(deg) {
        const {dispatch} = this.props;
        const img = document.querySelector('.cropper-canvas img');
        dispatch({
            type: 'onlineImage/setImageRotate',
            payload: deg
        })
        img.style.transform = `rotate(${deg}deg)`;
    }

    /**
     * 处理翻转和旋转
     * @param {integer} index 选中的tab索引值
     */
    handleFlipAndRotate(index) {
        const {onlineImage} = this.props;
        const {editImageProperties} = onlineImage;
        const {rotate} = editImageProperties;
        switch (index) {
            case 0:
                this.handleFlip('x');
                break;
            case 1:
                this.handleFlip('y');
                break;
            case 2:
                this.handleRotate(rotate - 90);
                break;
            case 3:
                this.handleRotate(rotate + 90);
                break;
            default:
                break;
        }
    }
    /**
     * 处理面板拖拽
     * @param {int} height 面板高度
     */
    handleActionSheetDrag(height) {
        const {dragable} = this.state;
        if (!dragable) {
            return;
        }
        const oHList = document.querySelector('.h-list');
        const oHListItems = oHList.querySelectorAll('.swiper-slide'); 
        const oActionHeight = document.querySelector(`.${styles['actions']}`).clientHeight;
        let {slideRows} = this.state;
        let rows = parseInt((height - oActionHeight - parseInt(window.getComputedStyle(oHList).paddingBottom) - parseInt(window.getComputedStyle(oHList).paddingTop)) / oHListItems[0].clientHeight);
        if (rows && rows !== slideRows) {
            this.setState({
                slideRows: rows
            }, () => {
                this.swiperInit();
            })
        }
    }
    componentDidMount() {
        this.swiperInit();
    }
    componentDidUpdate() {
        this.swiperInit();
    }
    render() {
        const {onlineImage} = this.props;
        const {currentAction, actionSheetHeight, selectedCutTypeIndex, isHideCropper, dragable} = this.state;
        const {selectedImages, editImage, previewImageIndex, imageCutTypeList, editImageProperties} = onlineImage;
        const {opacity} = editImageProperties;
        return (
            <div className={`page-wrap black ${styles['image-editor']} image-editor ${isHideCropper ? 'hide-cropper' : ''}`}>
                <Header back confirmBtn={formatMessage({id: 'ok'})}/>
                <div className={styles['edit-area']}>
                    <Cropper src={editImage.url} alt={editImage.name} style={{height: '100%', transform: `translate(0, -${actionSheetHeight / window.designWidth / 2}rem)`}}/>
                </div>
                <ActionSheet height={actionSheetHeight} drag={dragable} onDrag={this.handleActionSheetDrag.bind(this)}>
                    {
                        // 多张图片时显示的图片列表
                        currentAction === 0 && selectedImages && selectedImages.length > 1 ?
                        <div id="imageSwiper" className="h-list swiper-container">
                            <div className="swiper-wrapper" onTouchMove={e => e.stopPropagation()}>
                                {selectedImages.map((item, index) => 
                                    <div className={`swiper-slide ${previewImageIndex === index ? 'active' : ''}`} key={item.id} style={{backgroundImage: `url(${item.url})`}} onClick={this.handleImageSelect.bind(this, index, item)}></div>
                                )}
                            </div>
                        </div>
                        : null
                    }
                    {
                        // 透明度
                        currentAction === 1 ?
                        <div className={`${styles['opacity']} opacity`}>
                            <Slider value={opacity} min={0} max={100} onChange={val => this.handleOpacityChange(val)}/>
                            <div className={styles['input-wrap']}>
                                <input type="number" pattern="[0-9]*" max={100} min={0} value={opacity} onChange={e => this.handleOpacityChange(e.target.value)}/>%
                            </div>
                        </div>
                        : null
                    }
                    {
                        // 旋转
                        currentAction === 2 ?
                        <Flex className={styles['flip-rotate']}>
                            <FlexItem className={styles['item']} onClick={this.handleFlipAndRotate.bind(this, 0)}>
                                <Iconfont type="icon-horizontal-flip"/>
                            </FlexItem>
                            <FlexItem className={styles['item']} onClick={this.handleFlipAndRotate.bind(this, 1)}>
                                <Iconfont type="icon-vertical-flip"/>
                            </FlexItem>
                            <FlexItem className={styles['item']} onClick={this.handleFlipAndRotate.bind(this, 2)}>
                                <Iconfont type="icon-rotate1"/>
                            </FlexItem>
                            <FlexItem className={styles['item']} onClick={this.handleFlipAndRotate.bind(this, 3)}>
                                <Iconfont type="icon-rotate2"/>
                            </FlexItem>
                        </Flex>
                        : null
                    }
                    {
                        // 裁剪类型列表
                        currentAction === 3 ?
                        <div id="cutTypeSwiper" className="h-list swiper-container">
                            <div className="swiper-wrapper" onTouchMove={e => e.stopPropagation()}>
                                <div className={`swiper-slide d-type cut-default ${selectedCutTypeIndex === -1 ? 'active' : ''}`} onClick={this.handleCutTypeSelect.bind(this, -1)}>{formatMessage({id: 'default'})}</div>
                                <div className={`swiper-slide d-type cut-free ${selectedCutTypeIndex === -2 ? 'active' : ''}`} onClick={this.handleCutTypeSelect.bind(this, -2)}>
                                    <div className="content">{formatMessage({id: 'free_form'}).split('<br>').map((str, index) => <p key={index}>{str}</p>)}</div>
                                </div>
                                <div className={`swiper-slide d-type cut-1-1 ${selectedCutTypeIndex === -3 ? 'active' : ''}`}onClick={this.handleCutTypeSelect.bind(this, -3)}>1:1</div>
                                <div className={`swiper-slide d-type cut-3-4 ${selectedCutTypeIndex === -4 ? 'active' : ''}`} onClick={this.handleCutTypeSelect.bind(this, -4)}>3:4</div>
                                <div className={`swiper-slide d-type cut-2-3 ${selectedCutTypeIndex === -5 ? 'active' : ''}`} onClick={this.handleCutTypeSelect.bind(this, -5)}>2:3</div>
                                <div className={`swiper-slide d-type cut-9-16 ${selectedCutTypeIndex === -6 ? 'active' : ''}`} onClick={this.handleCutTypeSelect.bind(this, -6)}>9:16</div>
                                {imageCutTypeList.map((item, index) => 
                                    <div className={`swiper-slide ${selectedCutTypeIndex === index ? 'active' : ''}`} key={item.id} style={{backgroundImage: `url(${item.url})`}} onClick={this.handleCutTypeSelect.bind(this, index)} data-id={item.id}>
                                        {
                                            (() => {
                                                let icon = null;
                                                switch (item.status) {
                                                    case 0:
                                                        icon = <Iconfont type="icon-download" className={styles['ico-download']}/>;
                                                        break;
                                                    case 1:
                                                        icon = <Iconfont type="icon-loading" className={styles['ico-loading']}/>;
                                                        break;
                                                    default:
                                                        break;
                                                }
                                                return icon;
                                            })()
                                        }
                                    </div>
                                )}
                                <div className={`swiper-slide d-type cut-more ${selectedCutTypeIndex === -7 ? 'active' : ''}`} onClick={this.handleCutTypeSelect.bind(this, -7)}>
                                    <Iconfont type="icon-more"/>
                                </div>
                            </div>
                        </div>
                        : null
                    }
                    <Flex className={styles['actions']}>
                        {
                            currentAction !== 0 ?
                                <FlexItem className={styles['item']} onClick={this.handleCancel.bind(this)}>
                                    <Iconfont type="icon-close" className={styles['ico-close']}/>
                                </FlexItem>
                            : null
                        }
                        {
                            currentAction === 0 || currentAction === 1 ? 
                                <FlexItem className={styles['item']} onClick={this.handleActionChange.bind(this, 1)}>
                                    <Iconfont type="icon-opacity"/>
                                </FlexItem>
                            : null
                        }
                        {
                            currentAction === 0 ||currentAction === 2 ?
                                <FlexItem className={styles['item']} onClick={this.handleActionChange.bind(this, 2)}>
                                    <Iconfont type="icon-rotate1"/>
                                </FlexItem>
                            : null
                        }
                        {
                            currentAction === 0 || currentAction === 3 ?
                                <FlexItem className={styles['item']} onClick={this.handleActionChange.bind(this, 3)}>
                                    <Iconfont type="icon-cut"/>
                                </FlexItem>
                            : null
                        }
                        {
                            currentAction !== 0 ?
                                <FlexItem className={styles['item']} onClick={this.handleSave.bind(this)}>
                                    <Iconfont type="icon-success"/>
                                </FlexItem>
                            : null
                        }
                    </Flex>
                </ActionSheet>
            </div>
        )
    }
}

export default EditImage;