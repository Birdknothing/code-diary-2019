import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Row, Col, Upload, Button, Slider, Spin, message, InputNumber } from 'antd';
import Link from 'umi/link';
import Header from '@/components/header';
import IconButton from '@/components/iconbutton';
import Cropper from 'react-cropper';
import BackgroundNull from '@/assets/bg_null.png';
import maskFillet from './img/fillet.png';
import maskEllipse from './img/ellipse.png';
import maskStar from './img/star.png';
import maskHeart from './img/heart.png';
import 'cropperjs/dist/cropper.css';
import styles from './index.scss';

const { Edbox, SuperGif, GIF } = window;
let maskCutting = null;

@connect(({ imageSelector, loading }) => ({
  imageSelector,
  loading: loading.models.imageSelector
}))
class ImageSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, // 是否加载中
      canvasSize: 350, // 画布尺寸
      uploadAccept: 'image/png, image/jpeg, image/gif', // 允许上传的图片类型
      curNav: 'cut', // 头部导航
      scaleMarks: {
        0.5: '',
        1: '',
        1.5: '',
        2: ''
      }, // 缩放的倍数范围，0.5 ~ 2
      minScale: 0.5, // 最小缩放倍数
      maxScale: 2, // 最大缩放倍数
      scaleStep: 0.01, // 缩放改变的梯度值
      scaleValue: 0.96, // 当前缩放值
      aspectRatio: 0, // 裁剪的图片比例
      autoCropArea: 0.95, // 裁剪的区域
      presetName: '', // 预设名称
      presetCurrentItem: '', // 选中的预设项
      presetCutList: [
        {
          icon: 'icon-polygon',
          className: 'icon-polygon',
          name: formatMessage({ id: 'free' }),
          aspectRatio: 0,
          presetName: formatMessage({ id: 'free_cut' })
        },
        {
          icon: '',
          className: 'shape-1-1',
          name: '1:1',
          aspectRatio: 1 / 1,
          presetName: formatMessage({ id: 'ratio_cut' })
        },
        {
          icon: '',
          className: 'shape-3-4',
          name: '3:4',
          aspectRatio: 3 / 4,
          presetName: formatMessage({ id: 'ratio_cut' })
        },
        {
          icon: '',
          className: 'shape-2-3',
          name: '2:3',
          aspectRatio: 2 / 3,
          presetName: formatMessage({ id: 'ratio_cut' })
        },
        {
          icon: '',
          className: 'shape-1-9',
          name: '1:9',
          aspectRatio: 1 / 9,
          presetName: formatMessage({ id: 'ratio_cut' })
        },
        {
          icon: '',
          className: 'shape-16-9',
          name: '16:9',
          aspectRatio: 16 / 9,
          presetName: formatMessage({ id: 'ratio_cut' })
        }
      ], // 预设数组
      shapeCutList: [
        {
          icon: '',
          className: 'shape-fillet',
          name: 'Fillet'
        },
        {
          icon: 'icon-diamonds',
          className: 'shape',
          name: 'Ellipse'
        },
        {
          icon: 'icon-star',
          className: 'shape',
          name: 'Star'
        },
        {
          icon: 'icon-heart',
          className: 'shape',
          name: 'Heart'
        }
      ], // 蒙版形状数组
      disableCropper: false, // 是否可以裁剪
      isShowPreset: false, // 是否展示预设下拉区域
      minRadius: 0, // 最小圆角值
      maxRadius: 50, // 最大圆角值
      radiusStep: 1, // 圆角改变梯度值
      radiusMarks: {
        0: '',
        25: '',
        50: ''
      }, // 圆角范围，0 ~ 50
      radiusValue: 0, // 当前圆角值
      rotateOperationList: [
        {
          icon: 'icon-horizontal-flip',
          param: 'horizontal',
          toolTip: formatMessage({ id: 'horizontal_flip' })
        },
        {
          icon: 'icon-vertical-flip',
          param: 'vertical',
          toolTip: formatMessage({ id: 'vertical_flip' })
        },
        {
          icon: 'icon-rotate-left',
          param: 'left',
          toolTip: formatMessage({ id: 'rotate_left' })
        },
        {
          icon: 'icon-rotate-right',
          param: 'right',
          toolTip: formatMessage({ id: 'rotate_right' })
        }
      ], // 旋转操作数组
      horizontalCount: 0, // 点击水平旋转的次数
      verticalCount: 0, // 点击垂直旋转的次数
      opacityMarks: {
        0: '',
        50: '',
        100: ''
      }, // 不透明度范围， 0 ~ 100
      minOpacity: 0, // 最小不透明值
      maxOpacity: 100, // 最大不透明度
      opacityStep: 1, // 不透明度改变梯度值
      opacityValue: 100, // 当前的不透明度值
      isShowMore: false, // 是否展示更多工具
      toolsList: [
        {
          URL:
            Edbox.Area === 'CHN'
              ? formatMessage({ id: 'online_ps_cn_url' })
              : formatMessage({ id: 'online_ps_us_url' }),
          name:
            Edbox.Area === 'CHN'
              ? formatMessage({ id: 'online_ps_cn' })
              : formatMessage({ id: 'online_ps_us' }),
          toolIcon: 'tools-logo-ps'
        },
        {
          URL:
            Edbox.Area === 'CHN'
              ? formatMessage({ id: 'cutout_cn_url' })
              : formatMessage({ id: 'cutout_us_url' }),
          name:
            Edbox.Area === 'CHN'
              ? formatMessage({ id: 'cutout_cn' })
              : formatMessage({ id: 'cutout_us' }),
          toolIcon: 'tools-logo-cutout'
        },
        {
          URL:
            Edbox.Area === 'CHN'
              ? formatMessage({ id: 'gif_production_cn_url' })
              : formatMessage({ id: 'gif_production_us_url' }),
          name:
            Edbox.Area === 'CHN'
              ? formatMessage({ id: 'gif_production_cn' })
              : formatMessage({ id: 'gif_production_us' }),
          toolIcon: 'tools-logo-gif'
        }
      ], // 更多工具数据
      canReset: false, // 是否可以重置
      canSend: false // 是否可以确定
    };
  }

  /**
   * 获取初始信息
   */
  getInitData = () => {
    const { imageSelector, dispatch } = this.props;
    const { selectingImg, initialImage } = imageSelector;

    Edbox.Start();
    Edbox.Message.AddMessageHandler('Init', datas => {
      const config = { ...datas[0] };
      const { EditIndex } = config;

      // 针对通用控件的多图控件的特殊处理
      if (EditIndex || EditIndex === 0) {
        selectingImg.coverURL = config.Value[EditIndex];
        selectingImg.GUID = config.GUID[EditIndex];

        initialImage.Value = config.Value[EditIndex];
        initialImage.GUID = config.GUID[EditIndex];
      } else {
        selectingImg.coverURL = config.Value;
        selectingImg.GUID = config.GUID;

        initialImage.Value = config.Value;
        initialImage.GUID = config.GUID;
      }
      selectingImg.name = undefined;

      dispatch({
        type: 'imageSelector/setInitData',
        payload: {
          imageConfig: { ...config },
          selectingImg: selectingImg,
          initialImage: initialImage
        }
      });

      this.setState(
        {
          loading: false
        },
        () => {
          this.handleInitData();
        },
      );
    });
  };

  /**
   * 处理通过 message 获取的数据
   */
  handleInitData = () => {
    const { presetCutList } = this.state;
    const { imageSelector } = this.props;
    const { imageConfig } = imageSelector;
    const { Width, Height } = imageConfig;

    // 传入的数据是否有设置宽高
    if (Width && Height) {
      const hasPresetParam = presetCutList[0].presetName === formatMessage({ id: 'preset_cut' });
      if (!hasPresetParam) {
        const tempObj = {
          icon: 'icon-picture',
          className: 'icon-polygon',
          name: formatMessage({ id: 'preset' }),
          aspectRatio: null,
          presetName: formatMessage({ id: 'preset_cut' })
        };
        presetCutList.unshift(tempObj);
      }

      this.setState({
        aspectRatio: Width / Height,
        presetCurrentItem: formatMessage({ id: 'preset' }),
        presetName: formatMessage({ id: 'preset_cut' }),
        presetCutList: presetCutList,
        loading: false
      });
    } else {
      this.setState({
        presetCurrentItem: formatMessage({ id: 'free' }),
        presetName: formatMessage({ id: 'free_cut' }),
        loading: false
      });
    }
  };

  /**
   * 重置文本生成图片的配置
   */
  handleInitTextPictureSetting = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'imageSelector/setTextImageSetting',
      payload: {
        isSelectForTextImg: false,
        textImageData: {},
        hasSensitive: false
      }
    });
  };

  /**
   * message 通信的按钮监听
   */
  messageHandler = () => {
    Edbox.Message.AddMessageHandler('MessageButtonClick', (datas, com) => {
      if (datas && datas.length) {
        const callbackData = datas[0];
        const { ID } = callbackData;
        switch (ID) {
          case 'Message_Buttons_Reset_OK':
            this.handleResetCallbackOK();
            break;
          default:
            break;
        }
      }
    });
  };

  /**
   * 裁剪的图片加载完成后触发的回调
   */
  handleImageLoaded = () => {
    const { scaleValue } = this.state;
    const { cropper } = this.refs.cropper;

    const checkCropperIsLoaded = setInterval(() => {
      const flag = cropper.ready;
      if (flag) {
        const cropperViewBox = document.querySelector('.cropper-view-box');
        const cropperViewBoxImg = cropperViewBox.querySelector('img');

        cropper.scale(scaleValue);
        if (cropperViewBoxImg.complete) {
          this.setState({
            canSend: true
          });
          clearInterval(checkCropperIsLoaded);
        }
      }
    }, 300);
  };

  /**
   * 头部操作项的点击事件
   *
   * @param nav string 当前的操作项，分别为 upload、online、text、none
   */
  handleClickNav = nav => {
    const { canSend } = this.state;
    const { imageSelector, dispatch } = this.props;
    const { selectingImg } = imageSelector;

    if (!canSend && nav !== 'cut') {
      return false;
    }

    if (nav === 'none') {
      selectingImg.coverURL = '';
      selectingImg.GUID = '';

      dispatch({
        type: 'imageSelector/setSelectingImg',
        payload: selectingImg
      });
    } else if (nav === 'cut') {
      Edbox.EbService.OpenScreenShooter(
        {
          taskId: Edbox.GetGUID()
        },
        success => {
          selectingImg.coverURL = success.Message;
          selectingImg.GUID = undefined;

          dispatch({
            type: 'imageSelector/setSelectingImg',
            payload: selectingImg
          });
        },
        error => {
          console.log(error);
          message.error(error.Message);
        },
      );
    }

    this.setState({
      curNav: nav,
      canReset: true
    });
  };

  /**
   * 上传文件之前的钩子
   * 判断是否是图片，并属于 png、jpg、jpeg、gif 格式，默认为 true，阻止下一步需返回 false
   *
   * @param file object 上传的文件
   * @param fileList object 上传的文件列表
   */
  handleBeforeUpload = (file, fileList) => {
    const { type } = file;
    const acceptType = ['png', 'jpg', 'jpeg', 'gif'];
    const suffixType = type.split('/')[1];
    const isImage = type.indexOf('image') === -1;

    if (isImage) {
      message.error(formatMessage({ id: 'invalid_image_type' }));
      return false;
    }

    if (!acceptType.includes(suffixType)) {
      message.error(`${formatMessage({ id: 'image_type_warning' })}${acceptType.join(', ')}`);
      return false;
    }
  };

  /**
   * 自定义的上传实现
   * 只有在 beforeUpload 返回 true 的情况下才会触发
   *
   * @param data object 上传的文件对象
   */
  handleImageToBase64Data = data => {
    const { imageSelector, dispatch } = this.props;
    const { imageConfig, selectingImg } = imageSelector;
    const { Width, Height } = imageConfig;
    const { file } = data;
    const cropperWrap = document.getElementById('cropperWrap');
    const cropper = this.refs.cropper;
    const ndr = Edbox.NDR;

    if (!file) {
      return false;
    }

    const URL = window.URL || window.webkitURL;
    const blob = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = '';
    img.src = blob;
    img.onload = () => {
      if (cropperWrap) {
        cropperWrap.setAttribute('class', '');
      }

      if (Width && Height) {
        this.setState({
          aspectRatio: Width / Height,
          presetCurrentItem: formatMessage({ id: 'preset' }),
          presetName: formatMessage({ id: 'preset_cut' }),
          scaleValue: 0.96,
          radiusValue: 0,
          opacityValue: 100,
          disableCropper: false,
          canReset: true
        });
      } else {
        this.setState({
          presetCurrentItem: formatMessage({ id: 'free' }),
          presetName: formatMessage({ id: 'free_cut' }),
          scaleValue: 0.96,
          radiusValue: 0,
          opacityValue: 100,
          disableCropper: false,
          canReset: true
        });
      }

      ndr.GetFileData(data.file, info => {
        selectingImg.coverURL = info.Data;
        selectingImg.GUID = undefined;
        selectingImg.name = info.Name;

        if (cropper) {
          cropper.enable();

          if (!Width && !Height) {
            cropper.setAspectRatio(0);
          }
        }

        dispatch({
          type: 'imageSelector/setSelectingImg',
          payload: selectingImg
        });
      });
    };

    // 提示无效图片
    img.onerror = () => {
      message.error(formatMessage({ id: 'invalid_image' }));
      return false;
    };
  };

  /**
   * 图片缩放处理
   *
   * @param value number 缩放倍数值
   */
  handleChangeScale = value => {
    const cropper = this.refs.cropper;

    this.setState({
      scaleValue: value,
      canReset: true
    });

    cropper.scale(value);
  };

  /**
   * 图片居中处理
   */
  setCropAlignCenter = () => {
    const cropper = this.refs.cropper;
    const containerData = cropper.getContainerData();
    const cropBoxData = cropper.getCropBoxData();
    const canvasData = cropper.getCanvasData();
    const boxLeft = (containerData.width - cropBoxData.width) / 2;
    const boxTop = (containerData.height - cropBoxData.height) / 2;
    const canvasLeft = (containerData.width - canvasData.width) / 2;
    const canvasTop = (containerData.height - canvasData.height) / 2;

    cropper.setCropBoxData({
      left: boxLeft,
      top: boxTop,
      width: cropBoxData.width,
      height: cropBoxData.height
    });

    cropper.setCanvasData({
      left: canvasLeft,
      top: canvasTop,
      width: canvasData.width,
      height: canvasData.height
    });

    this.setState({
      canReset: true
    });
  };

  /**
   * 阻止默认事件
   */
  stopPropagation = e => {
    e.nativeEvent.stopImmediatePropagation();
  };

  /**
   * 显示/隐藏 裁剪下拉框
   *
   * @param e object event对象
   */
  handleTogglePreset = e => {
    this.stopPropagation(e);
    const { isShowPreset } = this.state;
    this.setState({
      isShowPreset: !isShowPreset,
      canReset: true
    });
  };

  /**
   * 选择裁剪方式
   *
   * @param data object 选中的裁剪项
   */
  handlePresetSelected = data => {
    const cropperWrap = document.getElementById('cropperWrap');
    const cropper = this.refs.cropper;

    cropperWrap.setAttribute('class', '');

    this.setState({
      disableCropper: false,
      aspectRatio: data.aspectRatio,
      presetName: data.presetName,
      presetCurrentItem: data.name,
      canReset: true
    });

    cropper.setAspectRatio(data.aspectRatio);
    cropper.enable();
  };

  /**
   * 选择蒙版裁剪方式
   * 蒙版与裁剪比例不兼容，与圆角设置也不兼容
   *
   * @param data object 选中的蒙版选项
   */
  handleShapeSelected = data => {
    const cropper = this.refs.cropper;
    const cropperWrap = document.getElementById('cropperWrap');
    const cropperViewBox = document.querySelector('.cropper-view-box');
    const cropperFace = document.querySelector('.cropper-face');
    const classStr = `mask-${data.name.toLowerCase()}`;

    // 去除圆角的表现样式
    cropperWrap.setAttribute('class', classStr);
    cropperViewBox.style.borderRadius = 0;
    cropperFace.style.borderRadius = 0;

    this.setState({
      disableCropper: true,
      scaleValue: 0.96,
      presetName: formatMessage({ id: 'shape_cut' }),
      presetCurrentItem: data.name,
      radiusValue: 0,
      canReset: true
    });

    cropper.setAspectRatio(0);
    cropper.rotateTo(0);
    cropper.setCropBoxData({
      left: 7,
      top: 7,
      width: 336,
      height: 336
    });
    cropper.disable();
  };

  /**
   * 选择蒙版裁剪方式
   * 蒙版与裁剪比例不兼容，与圆角设置也不兼容
   *
   * @param value number 选中的蒙版选项
   */
  handleChangeRadius = value => {
    const tempVal = parseInt(value);
    const cropper = this.refs.cropper;
    const cropBoxData = cropper.getCropBoxData();
    const cropBoxH = Math.ceil(cropBoxData.height);
    const cropBoxW = Math.ceil(cropBoxData.width);
    const cropperViewBox = document.querySelector('.cropper-view-box');
    const cropperFace = document.querySelector('.cropper-face');

    let realRadiusPercent;
    if (!tempVal && tempVal !== 0) {
      realRadiusPercent = 0;
    } else {
      realRadiusPercent = tempVal;
    }

    if (cropBoxH === cropBoxW) {
      cropperViewBox.style.borderRadius = `${realRadiusPercent}%`;
      cropperFace.style.borderRadius = `${realRadiusPercent}%`;
    } else {
      const maxVal = Math.max(cropBoxH, cropBoxW);
      const tempRadiusVal = parseInt((maxVal * realRadiusPercent) / 100);
      cropperViewBox.style.borderRadius = `${tempRadiusVal}px`;
      cropperFace.style.borderRadius = `${tempRadiusVal}px`;
    }

    this.setState({
      radiusValue: realRadiusPercent,
      canReset: true
    });
  };

  /**
   * 旋转处理
   *
   * @param direction string 旋转操作项，分别为 horizontal、vertical、left、right
   */
  handleChangeRotate = direction => {
    const { horizontalCount, verticalCount, scaleValue } = this.state;
    const cropper = this.refs.cropper;

    switch (direction) {
      case 'horizontal':
        const rotateHorizontalCount = horizontalCount + 1;
        const scaleX = rotateHorizontalCount % 2 === 0 ? scaleValue : -scaleValue;

        cropper.scaleX(scaleX);
        this.setState({
          horizontalCount: rotateHorizontalCount,
          canReset: true
        });
        break;
      case 'vertical':
        const rotateVerticalCount = verticalCount + 1;
        const scaleY = rotateVerticalCount % 2 === 0 ? scaleValue : -scaleValue;

        cropper.scaleY(scaleY);
        this.setState({
          verticalCount: rotateVerticalCount,
          canReset: true
        });
        break;
      case 'left':
        cropper.rotate(-90);
        this.setState({
          canReset: true
        });
        break;
      case 'right':
        cropper.rotate(90);
        this.setState({
          canReset: true
        });
        break;
      default:
        break;
    }
  };

  /**
   * 不透明度处理
   *
   * @param value number 不透明度数值
   */
  handleChangeOpacity = value => {
    const tempVal = parseInt(value);
    let realVal;
    if (!tempVal && tempVal !== 0) {
      realVal = 100;
    } else {
      realVal = tempVal;
    }

    this.setState({
      opacityValue: realVal,
      canReset: true
    });
  };

  /**
   * 显示/隐藏 更多工具
   */
  handleToggleShowMoreTools = () => {
    const { isShowMore } = this.state;

    this.setState({
      isShowMore: !isShowMore
    });
  };

  /**
   * 重置操作
   */
  handleReset = () => {
    const messageData = {
      ID: 'Message',
      Name: 'Message',
      ShowName: formatMessage({ id: 'restore_picture_warning' }),
      Type: 'Message',
      Buttons: [
        {
          ID: 'Message_Buttons_Reset_Cancel',
          Name: 'Cancel',
          ShowName: formatMessage({ id: 'cancel' }),
          Type: 'MessageButton',
          Style: 'Default'
        },
        {
          ID: 'Message_Buttons_Reset_OK',
          Name: 'OK',
          ShowName: formatMessage({ id: 'ok' }),
          Type: 'MessageButton',
          Style: 'Primary'
        }
      ]
    };
    Edbox.Message.Broadcast('Message', [messageData]);
  };

  /**
   * 按钮回传监听
   * 点击重置后，对应接入的页面呼出确认弹窗，点击“确定”后，触发该事件
   */
  handleResetCallbackOK = () => {
    const { imageSelector, dispatch } = this.props;
    const { imageConfig, selectingImg, initialImage } = imageSelector;
    const { EditIndex, Width, Height } = imageConfig;
    const cropper = this.refs.cropper;
    const cropperWrap = document.getElementById('cropperWrap');
    const cropperViewBox = document.querySelector('.cropper-view-box');
    const cropperFace = document.querySelector('.cropper-face');

    this.setState(
      {
        curNav: 'local',
        scaleValue: 0.96,
        opacityValue: 100,
        presetCurrentItem:
          Width && Height ? formatMessage({ id: 'preset' }) : formatMessage({ id: 'free' }),
        presetName:
          Width && Height ? formatMessage({ id: 'preset_cut' }) : formatMessage({ id: 'free_cut' }),
        disableCropper: false,
        radiusValue: 0,
        canReset: false
      },
      () => {
        if (cropper && initialImage.Value) {
          cropper.enable();
          cropper.reset();
          cropper.scale(0.96);
        }

        if (cropperWrap) {
          cropperWrap.setAttribute('class', '');
          cropperViewBox.style.borderRadius = 0;
          cropperFace.style.borderRadius = 0;
        }

        if (EditIndex || EditIndex === 0) {
          imageConfig.Value[EditIndex] = initialImage.Value;
          imageConfig.GUID[EditIndex] = initialImage.GUID;
        } else {
          imageConfig.Value = initialImage.Value;
          imageConfig.GUID = initialImage.GUID;
        }

        selectingImg.coverURL = initialImage.Value;
        selectingImg.name = undefined;
        selectingImg.GUID = initialImage.GUID;

        dispatch({
          type: 'imageSelector/setData',
          payload: {
            imageConfig: imageConfig,
            selectingImg: selectingImg
          }
        });

        // 通过 postMessage 发送 imageConfig
        Edbox.Message.Get(window, com => {
          com.Start();
          Edbox.Message.Broadcast('Update', [imageConfig]);
        });
      },
    );
  };

  /**
   * 确定操作
   */
  handleOK = () => {
    const { canvasSize, curNav, presetCurrentItem, opacityValue, radiusValue } = this.state;
    const { imageSelector } = this.props;
    const { selectingImg, imageConfig } = imageSelector;
    const { ImageType = ['png', 'jpg', 'gif'] } = imageConfig;
    const { coverURL } = selectingImg;
    const cropper = this.refs.cropper;
    const isGIF =
      ImageType.includes('gif') &&
      (coverURL.indexOf('image/gif') > -1 || coverURL.indexOf('.gif') > -1);
    const isPNG =
      ImageType.includes('png') &&
      (coverURL.indexOf('image/png') > -1 || coverURL.indexOf('.png') > -1);

    this.setState({
      canReset: true,
      canSend: false
    });

    // 不是 “无图片”
    if (curNav !== 'none' && coverURL) {
      // gif的处理
      if (isGIF) {
        const cropBoxData = cropper.getCropBoxData();
        const cropCanvasData = cropper.getCanvasData();
        const cropGIF = document.getElementById('cropGIF');
        const gifImg = document.createElement('img');
        gifImg.crossOrigin = '';
        gifImg.setAttribute('rel:animated_src', coverURL);
        gifImg.setAttribute('rel:auto_play', '0');
        cropGIF.appendChild(gifImg);
        const superGifList = new SuperGif({ gif: gifImg });

        superGifList.load(() => {
          const { naturalWidth, naturalHeight } = cropCanvasData;
          let gifFrameList = [];
          let tempWidth, tempHeight;

          if (naturalWidth <= canvasSize && naturalHeight <= canvasSize) {
            tempWidth = canvasSize;
            tempHeight = canvasSize;
          } else {
            if (naturalWidth > naturalHeight) {
              tempWidth = canvasSize;
              tempHeight = (canvasSize * naturalHeight) / naturalWidth;
            } else if (naturalWidth < naturalHeight) {
              tempWidth = (canvasSize * naturalWidth) / naturalHeight;
              tempHeight = canvasSize;
            } else {
              tempWidth = canvasSize;
              tempHeight = canvasSize;
            }
          }

          const len = superGifList.get_length();
          for (let i = 1; i <= len; i++) {
            superGifList.move_to(i);
            const frameCanvas = superGifList.get_canvas();
            const frameImg = frameCanvas.toDataURL();
            const tempCanvas = document.createElement('canvas');
            const tempImg = new Image();
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = tempWidth;
            tempCanvas.height = tempHeight;
            tempImg.onload = () => {
              tempCtx.drawImage(tempImg, 0, 0, tempWidth, tempHeight);
              const tempImgData = tempCanvas.toDataURL();

              gifFrameList.push(tempImgData);
              if (i === len) {
                this.handleCropGifFrame(gifFrameList, cropBoxData);
              }
            };

            tempImg.src = frameImg;
          }
        });

        cropGIF.innerHTML = '';
        return false;
      }

      // png 的处理
      if (isPNG) {
        const shapeList = ['Fillet', 'Ellipse', 'Star', 'Heart'];
        const isShapeCut = shapeList.includes(presetCurrentItem);
        let maskImage = null;
        let fileName = 'default.png';

        if (isShapeCut) {
          switch (presetCurrentItem) {
            case 'Fillet':
              maskImage = maskFillet;
              fileName = 'fillet.png';
              break;
            case 'Ellipse':
              maskImage = maskEllipse;
              fileName = 'ellipse.png';
              break;
            case 'Star':
              maskImage = maskStar;
              fileName = 'star.png';
              break;
            case 'Heart':
              maskImage = maskHeart;
              fileName = 'heart.png';
              break;
            default:
              break;
          }

          maskCutting = new Edbox.MaskCutting({
            width: canvasSize,
            height: canvasSize,
            mask: maskImage,
            quality: 0.8
          });
          maskCutting.Start(
            coverURL,
            datas => {
              if (opacityValue === 100) {
                this.uploadFileAndSend(datas, fileName);
              } else {
                this.handleImageOpacity(datas, opacityValue, fileName);
              }
            },
            err => {
              console.log(err);
            },
          );
        } else {
          if (opacityValue === 100) {
            if (radiusValue === 0) {
              this.handleCropImage();
            } else {
              this.handleImageRadius();
            }
          } else {
            if (radiusValue === 0) {
              const newCanvasData = cropper.getCanvasData();
              const newCropBoxData = cropper.getCropBoxData();
              const newCropData = cropper.getCroppedCanvas().toDataURL();
              const multiple = (newCanvasData.naturalWidth / newCanvasData.width).toFixed(2);
              const cropBoxData = {
                naturalWidth: newCropBoxData.width * multiple,
                naturalHeight: newCropBoxData.height * multiple
              };
              this.handleImageOpacity(newCropData, opacityValue, fileName, cropBoxData);
            } else {
              this.handleImageRadius();
            }
          }
        }

        this.setState({
          canSend: false
        });
        maskCutting = null;
        return false;
      }

      // jpg 的处理
      this.handleCropImage();
    } else {
      this.handleCommunicationUpdate();
    }
  };

  /**
   * gif 的每一帧的裁剪
   *
   * @param frameList array 由 gif 生成的每一帧组成的数组
   * @param cropBoxData object 裁剪的区域数据
   */
  handleCropGifFrame = (frameList, cropBoxData) => {
    const { left, top, height, width } = cropBoxData;
    const croppedFrameList = [];
    for (let i = 0, len = frameList.length; i < len; i++) {
      const cropImg = new Image();
      cropImg.crossOrigin = '';
      cropImg.onload = () => {
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = width;
        cropCanvas.height = height;
        const ctx = cropCanvas.getContext('2d');
        ctx.drawImage(cropImg, -left, -top);

        const cropGifFrameData = cropCanvas.toDataURL();
        croppedFrameList.push(cropGifFrameData);

        if (i === len - 1) {
          this.handleMergeGifFrame(croppedFrameList);
        }
      };
      cropImg.src = frameList[i];
    }
  };

  /**
   * 将裁剪后的每一帧图合并成 gif
   *
   * @param croppedFrameList array 裁剪后的每一帧图的数组
   */
  handleMergeGifFrame = croppedFrameList => {
    let imgObjList = [];
    let count = 0;
    const workerURL = './static/js/gif.worker.js';
    const gifMerge = new GIF({
      quality: 10,
      workers: 2,
      workerScript: workerURL,
      transparent: 'rgba(0,0,0,0)'
    });
    const generateGif = imgObjList => {
      for (let i = 0; i < imgObjList.length; i++) {
        gifMerge.addFrame(imgObjList[i], { delay: 100 });
      }
      gifMerge.render();
    };

    gifMerge.on('finished', blob => {
      let file = new FileReader();
      file.readAsDataURL(blob);
      file.onload = () => {
        const gifData = file.result;

        this.uploadFileAndSend(gifData, 'cropped.gif');
      };
    });

    croppedFrameList.map(item => {
      const tmpImg = new Image();
      imgObjList.push(tmpImg);
      tmpImg.onload = () => {
        count++;
        if (count === croppedFrameList.length) {
          generateGif(imgObjList);
        }
      };
      tmpImg.src = item;
      return true;
    });
  };

  /**
   * 上传 NDR 并更新数据
   *
   * @param imageData object 待上传图片的 base64 数据
   * @param fileName string 待上传图片的名称
   */
  uploadFileAndSend = (imageData, fileName) => {
    const { imageSelector, dispatch } = this.props;
    const { imageConfig, selectingImg } = imageSelector;
    const { EditIndex } = imageConfig;
    const cropper = this.refs.cropper;

    Edbox.NDR.Post(
      imageData,
      fileName,
      (progress, step) => {},
      data => {
        if (data) {
          if (EditIndex || EditIndex === 0) {
            imageConfig.Value[EditIndex] = data.Url;
            imageConfig.GUID[EditIndex] = data.Guid;
          } else {
            imageConfig.Value = data.Url;
            imageConfig.GUID = data.Guid;
          }

          selectingImg.coverURL = data.Url;
          selectingImg.GUID = data.Guid;
          selectingImg.name = undefined;

          // 通过 postMessage 发送 imageConfig
          Edbox.Message.Get(window, com => {
            com.Start();
            Edbox.Message.Broadcast('Update', [imageConfig]);
          });

          cropper.enable();

          dispatch({
            type: 'imageSelector/setData',
            payload: {
              imageConfig,
              selectingImg
            }
          });

          this.setState({
            scaleValue: 0.96,
            opacityValue: 100,
            radiusValue: 0,
            canSend: false
          });
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  /**
   *  图片圆角的处理
   */
  handleImageRadius = () => {
    const { radiusValue, opacityValue } = this.state;
    const cropper = this.refs.cropper;
    const newCanvasData = cropper.getCanvasData();
    const newCropBoxData = cropper.getCropBoxData();
    const multiple = newCanvasData.naturalWidth / newCanvasData.width;
    const realWidth = (newCropBoxData.width * multiple).toFixed(2);
    const realHeight = (newCropBoxData.height * multiple).toFixed(2);
    const image = new Image();
    const imageData = cropper.getCroppedCanvas().toDataURL();

    image.crossOrigin = '';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const radius = parseInt((Math.min(realWidth, realHeight) * radiusValue) / 100);

      canvas.width = realWidth;
      canvas.height = realHeight;
      context.globalAlpha = opacityValue / 100;

      const pattern = context.createPattern(image, 'no-repeat');
      context.beginPath();
      context.moveTo(radius, 0);
      context.arcTo(realWidth, 0, realWidth, realHeight, radius);
      context.arcTo(realWidth, realHeight, 0, realHeight, radius);
      context.arcTo(0, realHeight, 0, 0, radius);
      context.arcTo(0, 0, realWidth, 0, radius);
      context.closePath();
      context.fillStyle = pattern;
      context.fill();

      const newImageData = canvas.toDataURL('image/png');
      const fileName = 'radius.png';
      this.uploadFileAndSend(newImageData, fileName);
    };
    image.src = imageData;
  };

  /**
   * 图片的不透明度的处理
   */
  handleImageOpacity = (data, opacity, fileName, cropBoxData) => {
    const { canvasSize } = this.state;
    const img = new Image();
    img.crossOrigin = '';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const realWidth = cropBoxData ? cropBoxData.naturalWidth : canvasSize;
      const realHeight = cropBoxData ? cropBoxData.naturalHeight : canvasSize;
      canvas.width = realWidth;
      canvas.height = realHeight;
      ctx.globalAlpha = opacity / 100;
      ctx.drawImage(img, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      this.uploadFileAndSend(imageData, fileName);
    };
    img.src = data;
  };

  /**
   * 裁剪图片
   */
  handleCropImage = () => {
    const { imageSelector } = this.props;
    const { imageConfig } = imageSelector;
    const { ImageType = [] } = imageConfig;
    const cropper = this.refs.cropper;
    const type = ImageType.length ? ImageType[0] : 'jpg';

    let imageData;
    if (type === 'jpg' || type === 'jpeg') {
      imageData = cropper
        .getCroppedCanvas({
          fillColor: '#fff'
        })
        .toDataURL();
    } else {
      imageData = cropper.getCroppedCanvas().toDataURL();
    }

    this.uploadFileAndSend(imageData, `cropper.${type}`);
  };

  /**
   * 无图片操作的下一步操作
   * 直接重置掉 GUID 与 Value，并回传
   *
   * @memberof ImageSelector
   */
  handleCommunicationUpdate = () => {
    const { imageSelector, dispatch } = this.props;
    const { imageConfig, selectingImg } = imageSelector;
    const { EditIndex } = imageConfig;

    if (EditIndex || EditIndex === 0) {
      imageConfig.Value[EditIndex] = selectingImg.coverURL;
      imageConfig.GUID[EditIndex] = selectingImg.GUID;
    } else {
      imageConfig.Value = selectingImg.coverURL;
      imageConfig.GUID = selectingImg.GUID;
    }

    // 通过 postMessage 发送 imageConfig
    Edbox.Message.Get(window, com => {
      com.Start();
      Edbox.Message.Broadcast('Update', [imageConfig]);
    });

    dispatch({
      type: 'imageSelector/setImageConfig',
      payload: imageConfig
    });

    this.setState({
      scaleValue: 0.96,
      opacityValue: 100,
      radiusValue: 0,
      canReset: true,
      canSend: true
    });
  };

  componentWillMount() {
    this.handleInitData();
    this.getInitData();
    this.handleInitTextPictureSetting();
  }

  componentDidUpdate() {
    this.messageHandler();
  }

  componentDidMount() {
    document.addEventListener('click', () => {
      this.setState({ isShowPreset: false });
    });
  }

  render() {
    const { imageSelector } = this.props;
    const { imageConfig, selectingImg } = imageSelector;
    const {
      loading,
      uploadAccept,
      scaleMarks,
      minScale,
      maxScale,
      scaleValue,
      scaleStep,
      autoCropArea,
      aspectRatio,
      presetName,
      presetCurrentItem,
      presetCutList,
      shapeCutList,
      disableCropper,
      isShowPreset,
      minRadius,
      maxRadius,
      radiusStep,
      radiusMarks,
      radiusValue,
      rotateOperationList,
      opacityMarks,
      minOpacity,
      maxOpacity,
      opacityStep,
      opacityValue,
      isShowMore,
      toolsList,
      canReset,
      canSend
    } = this.state;
    const { Resetable = true, IsRequired = false, IsShowCloseButton = true } = imageConfig;
    const { coverURL } = selectingImg;
    const isPngType = coverURL ? /(.png$)|(^data:image\/png;base64)/gi.test(coverURL) : false; // 判断是否是 png 图片
    const isGif = coverURL ? /(.gif$)|(^data:image\/gif;base64)/gi.test(coverURL) : false; // 判断是否是 gif 图片

    return (
      <div className="wrapper">
        <div className="wrapper-border">
          {/* 加载判断 */}
          {loading ? (
            <div className={styles['loading-block']}>
              <div className={styles['loading-head']}>
                {/* 是否隐藏头部 */}
                {IsShowCloseButton ? <Header title={' '} /> : null}
              </div>
              <Spin size="large" className={'index-loading-box'} />
            </div>
          ) : (
            <div className={styles['page-wrap']}>
              {/* 是否隐藏头部 */}
              {IsShowCloseButton ? (
                <div className={styles['page-head']}>
                  <Header className="header" title={formatMessage({ id: 'edit_picture' })} />
                </div>
              ) : null}
              <div className={styles['page-body']}>
                <Row>
                  <Upload
                    className={styles['inline-block']}
                    accept={uploadAccept}
                    showUploadList={false}
                    beforeUpload={this.handleBeforeUpload}
                    customRequest={this.handleImageToBase64Data}
                  >
                    <IconButton
                      iconfont="icon-image-upload"
                      toolTip={formatMessage({ id: 'upload_local_pictures' })}
                      placement="bottomLeft"
                      onClick={() => this.handleClickNav('upload')}
                    />
                  </Upload>
                  <Link to="/Edbox_ImageSelector/online_pictures">
                    <IconButton
                      iconfont="icon-network-image"
                      toolTip={formatMessage({ id: 'select_online_pictures' })}
                      placement="bottomLeft"
                      onClick={() => this.handleClickNav('online')}
                    />
                  </Link>
                  <Link to="/Edbox_ImageSelector/text_picture">
                    <IconButton
                      iconfont="icon-text"
                      toolTip={formatMessage({ id: 'text_picture' })}
                      placement="bottomLeft"
                      onClick={() => this.handleClickNav('text')}
                    />
                  </Link>
                  <IconButton
                    iconfont="icon-cut1"
                    toolTip={formatMessage({ id: 'screen_capture' })}
                    placement="bottomLeft"
                    onClick={() => this.handleClickNav('cut')}
                  />
                  {IsRequired ? null : (
                    <IconButton
                      iconfont="icon-forbid-s-o"
                      toolTip={formatMessage({ id: 'no_picture' })}
                      placement="bottomLeft"
                      onClick={() => this.handleClickNav('none')}
                    />
                  )}
                </Row>
                <Row>
                  {coverURL ? (
                    <div>
                      {/* 裁剪区域 */}
                      <Row
                        className={styles['image-block']}
                        style={{
                          background: `url(${BackgroundNull}) repeat`
                        }}
                      >
                        <div id="cropperWrap" style={{ opacity: `${opacityValue / 100}` }}>
                          <Cropper
                            ref="cropper"
                            key="cropper"
                            src={coverURL}
                            aspectRatio={aspectRatio}
                            autoCropArea={autoCropArea}
                            zoomOnWheel={false}
                            movable={false}
                          />
                          <div id="cropGIF" style={{ visibility: 'hidden' }} />
                        </div>
                        {/* 用于图片加载完成的判断 */}
                        <img
                          src={coverURL}
                          alt=""
                          style={{ visibility: 'hidden' }}
                          onLoad={this.handleImageLoaded}
                        />
                      </Row>
                      <div className={styles['mt6']}>
                        {/* gif 屏蔽缩放功能 */}
                        {isGif || disableCropper ? null : (
                          // 缩放与对齐操作
                          <div>
                            <h3 className={styles['title']}>
                              {formatMessage({ id: 'image_shrink' })}
                            </h3>
                            <Row gutter={8}>
                              <Col span={15}>
                                <div className={styles['slider-block']}>
                                  <Slider
                                    min={minScale}
                                    max={maxScale}
                                    step={scaleStep}
                                    value={scaleValue}
                                    marks={scaleMarks}
                                    onChange={this.handleChangeScale}
                                  />
                                </div>
                              </Col>
                              <Col span={2}>
                                <IconButton
                                  iconfont="icon-target-lock"
                                  toolTip={formatMessage({ id: 'align_center' })}
                                  placement="bottomLeft"
                                  onClick={() => this.setCropAlignCenter()}
                                />
                              </Col>
                            </Row>
                          </div>
                        )}
                        {/* 裁剪方式 */}
                        <div>
                          <h3 className={styles['title']}>{formatMessage({ id: 'cut_method' })}</h3>
                          <Row className={styles['preset-select-block']} gutter={8}>
                            <Col span={15}>
                              <div className={isShowPreset ? styles['preset-select-box'] : null}>
                                <div
                                  className={styles['preset-select-render']}
                                  onClick={e => this.handleTogglePreset(e)}
                                >
                                  <IconButton
                                    className={styles['icon-clip']}
                                    iconfont="icon-clip"
                                  />
                                  <span className={styles['preset-select-result']}>
                                    {presetName}
                                  </span>
                                  <IconButton
                                    className={styles['icon-arrow']}
                                    iconfont="icon-arrow"
                                  />
                                </div>
                                {/* 裁剪方式的下拉选项 */}
                                <div
                                  className={styles['preset-select-list-block']}
                                  onClick={this.stopPropagation}
                                >
                                  <ul className={styles['preset-select-list']}>
                                    {presetCutList.map((item, index) => {
                                      return (
                                        <li
                                          key={`preset_li_${index}`}
                                          className={
                                            item.name === presetCurrentItem
                                              ? styles['active']
                                              : null
                                          }
                                          onClick={() => this.handlePresetSelected(item)}
                                        >
                                          {item.name === formatMessage({ id: 'preset' }) ||
                                          item.name === formatMessage({ id: 'free' }) ? (
                                            <IconButton
                                              className={styles[item.className]}
                                              iconfont={item.icon}
                                            />
                                          ) : (
                                            <span className={styles[item.className]} />
                                          )}
                                          <p>{item.name}</p>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                  {/* png 图片才可以显示蒙版裁剪 */}
                                  {isPngType ? (
                                    <dl className={styles['shape-list']}>
                                      <dt className={styles['shape-title']}>
                                        {formatMessage({ id: 'other_shapes' })}
                                      </dt>
                                      {shapeCutList.map((item, index) => {
                                        return (
                                          <dd
                                            key={`shape_dd_${index}`}
                                            className={
                                              item.name === presetCurrentItem
                                                ? `${styles['shape-list-item']} ${styles['active']}`
                                                : styles['shape-list-item']
                                            }
                                            onClick={() => this.handleShapeSelected(item)}
                                          >
                                            {item.name === 'Circular' || item.name === 'Fillet' ? (
                                              <span className={styles[`${item.className}`]} />
                                            ) : (
                                              <IconButton
                                                className={styles[`${item.className}`]}
                                                iconfont={item.icon}
                                              />
                                            )}
                                            <p className={styles['name']}>{item.name}</p>
                                          </dd>
                                        );
                                      })}
                                    </dl>
                                  ) : null}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      {/* png 图片才可以设置圆角， 并且 disableCropper = false（与蒙版不兼容） */}
                      {isPngType && !disableCropper ? (
                        <div>
                          <h3 className={styles['title']}>
                            {formatMessage({ id: 'rounded_comer' })}
                          </h3>
                          <Row gutter={8}>
                            <Col span={15}>
                              <div className={styles['slider-block']}>
                                <Slider
                                  min={minRadius}
                                  max={maxRadius}
                                  step={radiusStep}
                                  marks={radiusMarks}
                                  value={radiusValue}
                                  onChange={this.handleChangeRadius}
                                />
                              </div>
                            </Col>
                            <Col className={styles['input-number-box']} span={9}>
                              <InputNumber
                                value={radiusValue}
                                min={0}
                                max={50}
                                onChange={this.handleChangeRadius}
                              />
                              %
                            </Col>
                          </Row>
                        </div>
                      ) : null}
                      {/* gif 图片 与 disableCropper = true（选中蒙版） 无法操作旋转 */}
                      {isGif || disableCropper ? null : (
                        <div>
                          <h3 className={styles['title']}>{formatMessage({ id: 'rotate' })}</h3>
                          <Row>
                            {rotateOperationList.map((item, index) => {
                              return (
                                <IconButton
                                  key={index}
                                  iconfont={item.icon}
                                  toolTip={item.toolTip}
                                  placement="bottomLeft"
                                  onClick={() => this.handleChangeRotate(item.param)}
                                />
                              );
                            })}
                          </Row>
                        </div>
                      )}
                      {/* png 图片才可以设置不透明度 */}
                      {isPngType ? (
                        <div>
                          <h3 className={styles['title']}>{formatMessage({ id: 'opacity' })}</h3>
                          <Row gutter={8}>
                            <Col span={15}>
                              <div className={styles['slider-block']}>
                                <Slider
                                  min={minOpacity}
                                  max={maxOpacity}
                                  step={opacityStep}
                                  marks={opacityMarks}
                                  value={opacityValue}
                                  onChange={this.handleChangeOpacity}
                                />
                              </div>
                            </Col>
                            <Col className={styles['input-number-box']} span={9}>
                              <InputNumber
                                value={opacityValue}
                                min={0}
                                max={100}
                                onChange={this.handleChangeOpacity}
                              />
                              %
                            </Col>
                          </Row>
                        </div>
                      ) : null}
                      {/* 更多工具 */}
                      <div className={styles['more-tools']}>
                        <h3
                          className={styles['title']}
                          onClick={() => this.handleToggleShowMoreTools()}
                        >
                          {formatMessage({ id: 'more_tools' })}
                          <i
                            className={isShowMore ? styles['ico-arrow'] : styles['ico-arrow-hide']}
                          />
                        </h3>
                        {isShowMore ? (
                          <ul className={styles['tools-list']}>
                            {toolsList.map((item, index) => (
                              <li className={styles['tools-item']} key={`tools-item-${index}`}>
                                <a href={item.URL} target="_blank" rel="noopener noreferrer">
                                  <i className={styles[`${item.toolIcon}`]} />
                                  <p className={styles['tools-item-name']}>{item.name}</p>
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    // 无图片
                    <div
                      className={styles['image-block']}
                      style={{ background: `url(${BackgroundNull}) repeat` }}
                    />
                  )}
                </Row>
              </div>
              <Row className={styles['page-foot']}>
                {Resetable ? (
                  <Button disabled={!canReset || !canSend} onClick={() => this.handleReset()}>
                    {formatMessage({ id: 'reset' })}
                  </Button>
                ) : null}
                <Button type="primary" disabled={!canSend} onClick={() => this.handleOK()}>
                  {formatMessage({ id: 'ok' })}
                </Button>
              </Row>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ImageSelector;
