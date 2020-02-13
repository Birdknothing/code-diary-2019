import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Row, Upload, Button, message } from 'antd';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import styles from './index.scss';

import BackgroundNull from '@/assets/bg_null.png';
import CtrlHeader from '@/components/CtrlHeader';
import IconButton from '@/components/IconButton';
import OnlinePicture from './OnlinePicture';
import StepGuideModal from '@/components/StepGuideModal';

const { Edbox } = window;

/*
 * 简易图片控件
 * @param {Function} onOk：点击确定回调，返回当前图片的地址，选填
 * @param {Object} imageSelector:图片宽度比例设置，选填，默认{imageConfig:{}}，一般需要传{imageConfig:{Width：100,Height:100,Value:'http:xxx/xx.png',ShowName:''}}
 */
@connect(({ global, simplePictureCtrl }) => ({
  global,
  simplePictureCtrl,
}))
class SimplePictureCtrl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      aspectRatio: 0,
      autoCropArea: 0.96,
      opacityValue: 100,
      okLoading: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      imageSelector: { imageConfig },
      onClose,
    } = this.props;
    if (imageConfig.Value) {
      dispatch({
        type: 'simplePictureCtrl/setSelectedImgData',
        payload: {
          selectedImgData: {
            name: imageConfig.ShowName ? imageConfig.ShowName : '',
            url: imageConfig.Value,
            guid: imageConfig.GUID,
            source: 'online',
          },
        },
      });
    }

    if (onClose) {
      dispatch({
        type: 'simplePictureCtrl/setCloseEvent',
        payload: {
          onClose,
        },
      });
    }
  }

  handleBeforeUpload = (file, fileList) => {
    const { ImageType = [] } = this.props;
    const { type } = file;
    const suffixType = type.split('/')[1];
    const isImage = type.indexOf('image') === -1;

    if (isImage) {
      message.error(formatMessage({ id: 'invalid_image_type' }));
      return false;
    }

    if (ImageType.length) {
      const hasJPG = ImageType.includes('jpg') || ImageType.includes('jpeg');
      let tempArr = ['jpg', 'jpeg'];
      let newArr = ImageType;
      if (hasJPG) {
        newArr = [...ImageType, ...tempArr];
      }

      const isAllowTypeIndex = newArr.findIndex(item => suffixType === item);
      if (isAllowTypeIndex === -1) {
        message.error(`${formatMessage({ id: 'image_type_warning' })}${ImageType.toString()}`);
        return false;
      }
    } else {
      const acceptType = ['png', 'jpg', 'jpeg', 'gif'];
      if (!acceptType.includes(suffixType)) {
        message.error(`${formatMessage({ id: 'image_type_warning' })}${acceptType.toString()}`);
        return false;
      }
    }

    this.setState({
      isGif: suffixType === 'gif',
      scaleValue: 0.96,
      opacityValue: 100,
    });
  };

  handleImageToBase64Data = data => {
    const { imageSelector } = this.props;
    const { imageConfig } = imageSelector;
    const { Width, Height } = imageConfig;
    const { file } = data;
    const { type } = file;
    const cropperWrap = document.getElementById('cropperWrap');
    const cropper = this.refs.cropper;
    const ndr = Edbox.NDR;

    if (!file) {
      return false;
    }

    if (cropperWrap) {
      cropper.enable();
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
          // aspectRatio: Width / Height, // 去掉默认比例控制
          aspectRatio: 0,
          opacityValue: 100,
          isPngType: type.indexOf('image/png') > -1,
          disableCropper: false,
        });
      }

      ndr.GetFileData(data.file, info => {
        const { dispatch } = this.props;
        const selectingImg = {};
        selectingImg.coverURL = info.Data;
        selectingImg.GUID = undefined;
        selectingImg.name = info.Name;

        // this.setState({
        //   selectedImgData: { name: info.Name, data: info.Data },
        // });

        // console.log('上传成功~~~~·');
        this.goToStep(12);

        dispatch({
          type: 'simplePictureCtrl/setSelectedImgData',
          payload: {
            selectedImgData: { name: info.Name, url: info.Data, source: 'local' },
          },
        });

        if (cropper) {
          cropper.enable();
          if (!Width && !Height) {
            cropper.setAspectRatio(0);
          }
        }
      });
    };

    img.onerror = () => {
      message.error(formatMessage({ id: 'invalid_image' }));
      return false;
    };
  };

  handleImageLoaded = () => {
    const { scaleValue } = this.state;
    const { cropper } = this.refs.cropper;
    const checkCropperIsLoaded = setInterval(() => {
      const flag = cropper.loaded;

      if (flag) {
        cropper.scale(scaleValue);
        cropper.disable();
        clearInterval(checkCropperIsLoaded);
      }
    }, 100);
  };

  uploadFileAndSend = (imageData, fileName) => {
    const { onOk } = this.props;
    this.setState({
      okLoading: true,
    });
    Edbox.NDR.Post(
      imageData,
      fileName,
      (progress, step) => {},
      data => {
        if (data) {
          if (onOk) {
            onOk({ name: data.Name, url: data.Url, guid: data.Guid });
          }
          this.setState({
            scaleValue: 0.96,
            opacityValue: 100,
            okLoading: false,
          });
        }
      },
      err => {
        console.log(err);
        this.setState({
          okLoading: false,
        });
      },
    );
  };

  handleOK = () => {
    const {
      onOk,
      simplePictureCtrl: { selectedImgData },
      global: { activeStep },
    } = this.props;
    // 判断本地上传的图片需要上传ndr，线上不需要,直接传出
    if (selectedImgData.source && selectedImgData.source === 'local') {
      this.uploadFileAndSend(selectedImgData.url, selectedImgData.name);
    } else {
      if (onOk) {
        onOk(selectedImgData);
      }
    }

    if(activeStep === 6){
      this.goToStep(7);
    }
    if(activeStep === 12){
      this.goToStep(13);
    }
  };

  changTab = nowOprTab => {
    const { dispatch } = this.props;
    dispatch({
      type: 'simplePictureCtrl/setNowOprTab',
      payload: { nowOprTab },
    });
  };


  // 去往某步
  goToStep = (val) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/setStep',
      payload: {
        activeStep:val,
      },
    });
    dispatch({
      type: 'global/setIsCanOpr',
      payload: {
        isCanOpr: false,
      },
    });
  };

  // 前往在线图片列表
  guideGotoOnlineList = () => {
    this.goToStep(4);
    this.changTab(2);
  };

  // 关闭事件
  closeWidget = () => {
    const {
      simplePictureCtrl: { onClose },
      dispatch,
    } = this.props;
    onClose();
    dispatch({
      type: 'simplePictureCtrl/setNowOprTab',
      payload: {
        nowOprTab: 1,
      },
    });
  };

  render() {
    const {
      ImageType,
      simplePictureCtrl,
      global: { activeStep },
    } = this.props;

    const { nowOprTab, selectedImgData } = simplePictureCtrl;
    const { aspectRatio, autoCropArea, opacityValue, okLoading } = this.state;

    let uploadAccept = '';
    if (ImageType && ImageType.length) {
      if (ImageType.includes('png')) {
        uploadAccept = uploadAccept + ',image/png';
      }

      if (ImageType.includes('jpg') || ImageType.includes('jpeg')) {
        uploadAccept = uploadAccept + ',image/jpeg';
      }

      if (ImageType.includes('gif')) {
        uploadAccept = uploadAccept + ',image/gif';
      }

      uploadAccept = uploadAccept.substr(1);
    } else {
      uploadAccept = 'image/png, image/jpeg, image/gif';
    }
    return (
      <Fragment>
        {nowOprTab === 1 ? (
          <div className={styles['page-wrap']}>
            <div className={styles['page-head']}>
              <CtrlHeader
                className="header"
                title={formatMessage({ id: 'edit_picture' })}
                onClose={this.closeWidget}
              />
            </div>
            <div className={styles['page-body']}>
              <Row>
              {/* 新手引导-本地图片上传 14*/}
                <StepGuideModal
                  isFixed
                  step={11} // 14-3
                  className={styles['btn-wrap']}
                  title={formatMessage({ id: 'g_tip_game_img_local_sel' })}
                >
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
                    />
                  </Upload>
                </StepGuideModal>
                {/* 新手引导-线上图片6 */}
                <StepGuideModal
                  isFixed
                  step={3} // 6-3
                  // handStyle={{ right: '211px', top: '156px', left: 'auto' }}
                  // popStyle={{ right: '316px', top: '67px', left: 'auto' }}
                  // placement="LB"
                  className={styles['btn-wrap']}
                  title={formatMessage({ id: 'g_tip_set_game_cover_online' })}
                >
                  <IconButton
                    iconfont="icon-network-image"
                    toolTip={formatMessage({ id: 'select_online_pictures' })}
                    placement="bottomLeft"
                    onClick={this.guideGotoOnlineList}
                  />
                </StepGuideModal>
                <IconButton
                  iconfont="icon-text"
                  toolTip={formatMessage({ id: 'text_picture' })}
                  placement="bottomLeft"
                />
                <IconButton
                  iconfont="icon-forbid-s-o"
                  toolTip={formatMessage({ id: 'no_picture' })}
                  placement="bottomLeft"
                />
              </Row>
              <Row>
                <div className={styles['image-block-wrap']}>
                  <Row
                    className={styles['image-block']}
                    style={{
                      background: `url(${BackgroundNull}) repeat`,
                    }}
                  >
                    <Row>
                      {selectedImgData.url ? (
                        <div>
                          <Row
                            className={styles['image-block']}
                            style={{
                              background: `url(${BackgroundNull}) repeat`,
                            }}
                          >
                            <div id="cropperWrap" style={{ opacity: `${opacityValue / 100}` }}>
                              <Cropper
                                ref="cropper"
                                key="cropper"
                                src={selectedImgData.url}
                                aspectRatio={aspectRatio}
                                autoCropArea={autoCropArea}
                                zoomOnWheel={false}
                                movable={false}
                              />
                            </div>
                            <img
                              src={selectedImgData.url}
                              alt=""
                              style={{ visibility: 'hidden' }}
                              onLoad={this.handleImageLoaded}
                            />
                          </Row>
                        </div>
                      ) : (
                        <div
                          className={styles['image-block']}
                          style={{ background: `url(${BackgroundNull}) repeat` }}
                        />
                      )}
                    </Row>
                  </Row>
                </div>
              </Row>

            </div>
            <div className={styles['page-foot']}>
                <Button disabled>{formatMessage({ id: 'reset' })}</Button>
                {/* 新手引导-封面图选择完点击确定 6(9-3) /游戏图片选择完点击确定15 (15-3)*/}
                {activeStep ===6||activeStep===12?(
                <StepGuideModal
                  isFixed
                  step={activeStep}
                  placement="TR"
                  width={250}
                  className={styles['btn-ok-wrap']}
                  handDirection="down"
                  title={
                    activeStep === 6
                      ? formatMessage({ id: 'g_tip_game_cover_finished' })
                      : formatMessage({ id: 'g_tip_game_img_finished' })
                  }
                >
                  <Button
                    disabled={!selectedImgData.url}
                    type="primary"
                    loading={okLoading}
                    onClick={this.handleOK}
                  >
                    {formatMessage({ id: 'ok' })}
                  </Button>
                </StepGuideModal>
                ):(
                  <Button
                    disabled={!selectedImgData.url}
                    type="primary"
                    loading={okLoading}
                    onClick={this.handleOK}
                  >
                    {formatMessage({ id: 'ok' })}
                  </Button>
                )}
              </div>
          </div>
        ) : null}
        {nowOprTab === 2 ? <OnlinePicture /> : null}
      </Fragment>
    );
  }
}
SimplePictureCtrl.defaultProps = {
  imageSelector: { imageConfig: {} },
};
export default SimplePictureCtrl;
