import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Row, Input, Icon, Button, message, Popover, Upload } from 'antd';
import { SketchPicker } from 'react-color';
import router from 'umi/router';
import html2canvas from 'html2canvas';
import IconFont from '@/components/iconfont';
import IconButton from '@/components/iconbutton';
import FontSize from '@/components/fontsize';
import FontColor from '@/components/color';
import BackgroundNull from '@/assets/bg_null.png';
import styles from './index.scss';

const { TextArea } = Input;
const { Edbox } = window;

@connect(({ imageSelector, loading }) => ({
  imageSelector,
  loading: loading.models.imageSelector
}))
class TextPicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cacheTextareaValue: '', // 缓存输入的文本
      sketchpadSize: 350, //画布尺寸
      canCreatPng: true, // 是否可以生成图片
      isShowColorPicker: false, // 是否显示颜色选择器
      uploadAccept: 'image/png, image/jpeg, image/gif', // 上传允许的图片格式
      fontSize: {
        size: 14,
        startNum: 12,
        endNum: 72
      }, // 字体大小
      isImageCreating: false // 是否在生成图片
    };
  }

  /**
   * 初始化数据
   */
  handleInitData = () => {
    const { sketchpadSize, fontSize } = this.state;
    const { size } = fontSize;
    const { imageSelector, dispatch } = this.props;
    const { imageConfig, textImageData } = imageSelector;
    const { Width, Height, ImageType = ['png'] } = imageConfig;
    const { fontSizeNum, cacheTextareaValue } = textImageData;

    const canCreatPng = ImageType.includes('png');
    let sketchpadWidth = sketchpadSize;
    let sketchpadHeight = sketchpadSize;
    fontSize.size = fontSizeNum ? fontSizeNum : 14;

    // 根据出入数据的宽高，按比例决定生成图片的宽高
    if (Width && Height) {
      if (Width > Height) {
        sketchpadWidth = sketchpadSize;
        sketchpadHeight = parseInt((sketchpadSize * Height) / Width);
        const tempCol = Math.floor((sketchpadSize - 15 * 2 - 11 * 2) / size);
        const tempRow = Math.floor((sketchpadSize - 15 * 2) / (size * 1.5));
        textImageData.textareaLength = tempCol * tempRow;
        textImageData.textareaRow = tempRow;
      } else if (Width < Height) {
        sketchpadWidth = parseInt((sketchpadSize * Width) / Height);
        sketchpadHeight = sketchpadSize;
        const tempCol = Math.floor((sketchpadSize - 15 * 2 - 11 * 2) / size);
        const tempRow = Math.floor((sketchpadSize - 15 * 2) / (size * 1.5));
        textImageData.textareaLength = tempCol * tempRow;
        textImageData.textareaRow = tempRow;
      } else {
        sketchpadWidth = sketchpadSize;
        sketchpadHeight = sketchpadSize;
        textImageData.textareaLength = 315;
        textImageData.textareaRow = 15;
      }
    }

    this.setState({
      cacheTextareaValue: cacheTextareaValue,
      sketchpadWidth: sketchpadWidth,
      sketchpadHeight: sketchpadHeight,
      canCreatPng: canCreatPng,
      fontSize: {
        ...fontSize
      }
    });

    dispatch({
      type: 'imageSelector/setTextImageData',
      payload: {
        ...textImageData
      }
    });
  };

  /**
   * 监听事件
   */
  messageHandler = () => {
    Edbox.Message.AddMessageHandler('MessageButtonClick', (datas, com) => {
      if (datas && datas.length) {
        const callbackData = datas[0];
        const { ID } = callbackData;
        switch (ID) {
          case 'Message_Buttons_Apply_OK':
            this.handleApplyCallbackConserve();
            break;
          default:
            break;
        }
      }
    });
  };

  /**
   * 返回图片编辑首页
   */
  goBack = () => {
    router.push('/Edbox_ImageSelector');
  };

  /**
   * 关闭图片编辑区域
   */
  closeWidget = () => {
    Edbox.Message.Broadcast('Close', []);
  };

  /**
   * 自动聚焦文本输入
   */
  handleTextareaFocus = () => {
    this.refs.textArea.focus();
  };

  /**
   * 文本输入变化处理
   *
   * @param e object event对象
   */
  handleChangeTextarea = e => {
    const { imageSelector, dispatch } = this.props;
    const { textImageData } = imageSelector;
    const { textareaLength } = textImageData;
    const value = e.target.value;
    const cacheTextareaValue = value.substring(0, textareaLength);

    textImageData.textareaValue = cacheTextareaValue;
    textImageData.cacheTextareaValue = cacheTextareaValue;
    dispatch({
      type: 'imageSelector/setTextImageData',
      payload: {
        ...textImageData
      }
    });
    this.setState({
      cacheTextareaValue: cacheTextareaValue
    });
  };

  /**
   * 设置无背景
   * 去除背景色与背景图片
   */
  handleCheckSensitive = () => {
    const { cacheTextareaValue } = this.state;
    const { imageSelector, dispatch } = this.props;
    const { hasSensitive } = imageSelector;

    if (cacheTextareaValue) {
      Edbox.MMO.IsSensitive(
        cacheTextareaValue,
        flag => {
          if (flag.is_sensitive) {
            message.error(formatMessage({ id: 'sensitive_words' }));
            dispatch({
              type: 'imageSelector/setTextIsSensitive',
              payload: {
                hasSensitive: true
              }
            });
            return false;
          } else {
            if (hasSensitive) {
              dispatch({
                type: 'imageSelector/setTextIsSensitive',
                payload: {
                  hasSensitive: false
                }
              });
            }
          }
        },
        error => {
          console.log(error);
        },
      );
    } else {
      if (hasSensitive) {
        dispatch({
          type: 'imageSelector/setTextIsSensitive',
          payload: {
            hasSensitive: false
          }
        });
      }
    }
  };

  setNoBackground = () => {
    const { imageSelector, dispatch } = this.props;
    const { textImageData } = imageSelector;

    textImageData.backgroundColor = 'transparent';
    textImageData.coverURL = '';

    dispatch({
      type: 'imageSelector/setTextImageSetting',
      payload: {
        isSelectForTextImg: false,
        textImageData: {
          ...textImageData
        }
      }
    });
  };

  /**
   * 阻止默认事件
   */
  stopPropagation = e => {
    e.nativeEvent.stopImmediatePropagation();
  };

  /**
   * 颜色选择的开关控制
   *
   * @param e object event对象
   */
  handleToggleColorPick = e => {
    this.stopPropagation(e);

    const { isShowColorPicker } = this.state;
    this.setState({
      isShowColorPicker: !isShowColorPicker
    });
  };

  /**
   * 颜色拾取
   *
   * @param color object 选中的颜色对象
   */
  handleChangeColorPicker = color => {
    const { imageSelector, dispatch } = this.props;
    const { textImageData } = imageSelector;
    const { rgb } = color;
    const colorRgba = `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;

    textImageData.backgroundColor = colorRgba;
    textImageData.coverURL = '';

    dispatch({
      type: 'imageSelector/setTextImageData',
      payload: {
        ...textImageData
      }
    });
  };

  /**
   * 设置背景图片
   * 点击 online 进入在线图库
   *
   * @param menu string 设置图片的方式，分别为 local 和 online
   */
  handleSelectBackgroundImg = menu => {
    const { dispatch } = this.props;

    dispatch({
      type: 'imageSelector/setFlag',
      payload: {
        isSelectForTextImg: true
      }
    });

    if (menu === 'online') {
      router.push('/Edbox_ImageSelector/online_pictures');
    }
  };

  /**
   * 上传文件之前的钩子
   * 判断是否是图片，并属于 png、jpg、jpeg、gif 格式，默认为 true，阻止下一步需返回 false
   *
   * @param file object 上传的文件
   * @param fileList object 上传的文件列表
   */
  handleBeforeUpload = (file, fileList) => {
    const { imageSelector } = this.props;
    const { imageConfig } = imageSelector;
    const { ImageType = [] } = imageConfig;
    const { type } = file;
    const isImage = type.indexOf('image') === -1;
    const suffixType = type.split('/')[1];

    if (isImage) {
      message.error(`${formatMessage({ id: 'invalid_image_type' })}${ImageType.toString()}`);
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
    }
  };

  /**
   * 自定义的上传实现
   * 只有在 beforeUpload 返回 true 的情况下才会触发
   *
   * @param data object 上传的文件对象
   */
  handleUploadImage = data => {
    const { imageSelector, dispatch } = this.props;
    const { textImageData } = imageSelector;
    const { NDR } = Edbox;

    if (!data.file) {
      return false;
    }

    NDR.GetFileData(data.file, info => {
      textImageData.backgroundColor = 'transparent';
      textImageData.coverURL = info.Data;

      dispatch({
        type: 'imageSelector/setTextImageData',
        payload: {
          ...textImageData
        }
      });
    });
  };

  /**
   * 设置字体大小
   * 文本区域会根据字体大小变化而改变
   *
   * @param config object 选中的字体大小对象
   */
  handleUpdateFontSize = config => {
    const { sketchpadSize, cacheTextareaValue } = this.state;
    const { imageSelector, dispatch } = this.props;
    const { textImageData } = imageSelector;
    const { size } = config;
    const tempCol = Math.floor((sketchpadSize - 15 * 2 - 11 * 2) / size); // 外框宽度 - 外框的 padding 值 * 2 - textarea 的 padding值 * 2
    const tempRow = Math.floor((sketchpadSize - 15 * 2) / (size * 1.5)); // (外框高度 - 外框的 padding 值* 2)  / (textarea 的行高 * 1.5)
    const tempLength = tempCol * tempRow;
    const tempValue = cacheTextareaValue.substring(0, tempLength);
    const tempHeight = tempValue
      ? Math.ceil(tempValue.length / tempCol) * Math.ceil(size * 1.5) + 8
      : Math.ceil(size * 1.5) + 8;

    textImageData.textareaValue = tempValue;
    textImageData.textareaLength = tempLength;
    textImageData.textareaRow = tempRow;
    textImageData.fontSizeNum = size;

    this.setState({
      fontSize: { ...config }
    });

    dispatch({
      type: 'imageSelector/setTextImageData',
      payload: {
        ...textImageData
      }
    });

    // textarea 的宽高无法立即响应，通过延时处理
    setTimeout(() => {
      const oTextArea = document.getElementById('textArea');
      oTextArea.style.height = `${tempHeight}px`;
      oTextArea.style.maxHeight = `${tempHeight}px`;
    }, 150);
  };

  /**
   * 设置字体颜色
   *
   * @param color object 选中的颜色对象
   */
  handleUpdateFontColor = color => {
    const { imageSelector, dispatch } = this.props;
    const { textImageData } = imageSelector;

    textImageData.fontColor = color;

    dispatch({
      type: 'imageSelector/setTextImageData',
      payload: {
        ...textImageData
      }
    });
  };

  /**
   * 应用
   */
  handleApplyCanvasImage = () => {
    const messageData = {
      ID: 'Message',
      Name: 'Message',
      ShowName: formatMessage({ id: 'apply_image_conserve_waring' }),
      Type: 'Message',
      Buttons: [
        {
          ID: 'Message_Buttons_Apply_Cancel',
          Name: 'Cancel',
          ShowName: formatMessage({ id: 'cancel' }),
          Type: 'MessageButton',
          Style: 'Default'
        },
        {
          ID: 'Message_Buttons_Apply_OK',
          Name: 'OK',
          ShowName: formatMessage({ id: 'conserve' }),
          Type: 'MessageButton',
          Style: 'Primary'
        }
      ]
    };
    Edbox.Message.Broadcast('Message', [messageData]);
  };

  /**
   * 点击“确定”按钮后的回调函数
   * 使用 html2canvas 来生成图片
   */
  handleApplyCallbackConserve = () => {
    const { imageSelector, dispatch } = this.props;
    const { imageConfig, selectingImg, textImageData } = imageSelector;
    const { backgroundColor = 'transparent' } = textImageData;
    const { canCreatPng, sketchpadSize } = this.state;
    const oCloneTextarea = document.getElementById('cloneTextarea');

    html2canvas(oCloneTextarea, {
      backgroundColor: backgroundColor === 'transparent' ? 'null' : backgroundColor,
      useCORS: true,
      width: sketchpadSize,
      height: sketchpadSize
    }).then(canvas => {
      this.setState(
        {
          isImageCreating: true
        },
        () => {
          const textPictureName = 'text_picture';
          let type, suffix, imgData;

          type = canCreatPng ? 'image/png' : 'image/jpeg';
          suffix = type === 'image/png' ? '.png' : '.jpg';
          imgData = canvas.toDataURL(type);

          Edbox.NDR.Post(
            imgData,
            `${textPictureName}${suffix}`,
            (progress, step) => {},
            data => {
              if (data) {
                const { EditIndex } = imageConfig;
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

                dispatch({
                  type: 'imageSelector/setData',
                  payload: {
                    imageConfig,
                    selectingImg
                  }
                });

                message.success(formatMessage({ id: 'application_succeeded' }), 1.5, () => {
                  router.push('/Edbox_ImageSelector');
                });
              }
            },
            err => {
              console.log(err);
              this.setState({
                isImageCreating: false
              });
            },
          );
        },
      );
    });
  };

  componentWillMount() {
    this.handleInitData();
  }

  componentDidMount() {
    this.messageHandler();

    document.addEventListener('click', () => {
      this.setState({ isShowColorPicker: false });
    });
  }

  render() {
    const { imageSelector } = this.props;
    const { imageConfig, textImageData, hasSensitive } = imageSelector;
    const { IsShowCloseButton = true } = imageConfig;
    const {
      textareaValue = '',
      textareaLength = 315,
      textareaRow = 15,
      backgroundColor = 'transparent',
      coverURL = '',
      fontSizeNum = 14,
      fontColor = '#333'
    } = textImageData;
    const {
      sketchpadSize,
      canCreatPng,
      isShowColorPicker,
      uploadAccept,
      fontSize,
      isImageCreating
    } = this.state;

    return (
      <div className={styles['picture-page-wrap']}>
        <div className={styles['picture-page-head']}>
          <div className={styles['header']}>
            <IconFont
              type="icon-arrow-go-back-fill"
              className={styles['ico-back']}
              onClick={this.goBack}
            />
            {IsShowCloseButton ? (
              <IconFont
                type="icon-close"
                className={styles['ico-close']}
                onClick={this.closeWidget}
              />
            ) : null}
          </div>
        </div>
        <div className={styles['picture-page-body']}>
          <Row
            className={styles['image-block']}
            style={{
              width: sketchpadSize,
              height: sketchpadSize,
              background: `url(${BackgroundNull}) repeat`
            }}
          >
            <div
              style={{
                backgroundColor: backgroundColor,
                backgroundImage: coverURL ? `url(${coverURL})` : 'none'
              }}
              className={styles['textarea-box']}
              onClick={() => this.handleTextareaFocus()}
            >
              <TextArea
                id="textArea"
                ref="textArea"
                style={{
                  fontSize: fontSizeNum,
                  color: fontColor
                }}
                className={styles['textArea']}
                value={textareaValue}
                placeholder={formatMessage({ id: 'input_text_placeholder' })}
                maxLength={textareaLength}
                autosize={{
                  maxRows: textareaRow
                }}
                onChange={this.handleChangeTextarea}
                onBlur={() => this.handleCheckSensitive()}
              />
              <div
                id="cloneTextarea"
                className={styles['clone-container']}
                style={{
                  width: sketchpadSize,
                  height: sketchpadSize,
                  backgroundImage: coverURL ? `url(${coverURL})` : 'none',
                  fontSize: fontSizeNum,
                  color: fontColor
                }}
              >
                <div className={styles['canvas']}>
                  <div className={styles['inner']}>
                    <p>{textareaValue}</p>
                  </div>
                </div>
              </div>
            </div>
          </Row>
          <Row>
            <h3 className={styles['title']}>{formatMessage({ id: 'background' })}</h3>
            <Row>
              <Popover content={formatMessage({ id: 'no_background' })} placement="bottomLeft">
                <span className={styles['btn-no-background']} onClick={this.setNoBackground} />
              </Popover>
              <div className={styles['inline-block']} onClick={e => this.handleToggleColorPick(e)}>
                <IconButton
                  iconfont="icon-paint"
                  toolTip={formatMessage({ id: 'select_background' })}
                  placement="bottomLeft"
                />
              </div>
              <div className={`${styles['inline-block']} ${styles['btn-background-image-block']}`}>
                <span className={styles['btn-background-image']}>
                  <IconFont type="icon-image-with-text" />
                </span>
                <div className={styles['menu-block']}>
                  <ul className={styles['menu-list']}>
                    <li
                      className={styles['menu-item']}
                      onClick={() => this.handleSelectBackgroundImg('online')}
                    >
                      {formatMessage({ id: 'select_online_pictures' })}
                    </li>
                    <li
                      className={styles['menu-item']}
                      onClick={() => this.handleSelectBackgroundImg('locale')}
                    >
                      <Upload
                        className={styles['inline-block']}
                        accept={uploadAccept}
                        showUploadList={false}
                        beforeUpload={this.handleBeforeUpload}
                        customRequest={this.handleUploadImage}
                      >
                        {formatMessage({ id: 'upload_local_pictures' })}
                      </Upload>
                    </li>
                  </ul>
                </div>
              </div>
              {isShowColorPicker ? (
                <div className={styles['color-picker']} onClick={this.stopPropagation}>
                  <SketchPicker
                    className={styles['color-picker-panel']}
                    color={backgroundColor === 'transparent' ? '#fff' : backgroundColor}
                    disableAlpha={!canCreatPng}
                    onChange={this.handleChangeColorPicker}
                  />
                </div>
              ) : null}
            </Row>
          </Row>
          <Row className={styles['size']}>
            <h3 className={styles['title']}>{formatMessage({ id: 'font_size' })}</h3>
            <FontSize config={fontSize} onUpdate={this.handleUpdateFontSize} />
          </Row>
          <Row className={styles['color']}>
            <h3 className={styles['title']}>{formatMessage({ id: 'font_color' })}</h3>
            <FontColor color={fontColor} onUpdate={this.handleUpdateFontColor} />
          </Row>
        </div>
        <Row className={styles['page-foot']}>
          <Button
            disabled={!textareaValue || hasSensitive}
            onClick={() => this.handleApplyCanvasImage()}
          >
            {formatMessage({ id: 'apply' })}
          </Button>
        </Row>
        {isImageCreating ? (
          <div className={styles['mask']}>
            <div className={styles['loading-box']}>
              <Icon className={styles['icon']} type="loading" />
              <p className={styles['tip']}>{formatMessage({ id: 'apply_image_warning' })}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default TextPicture;
