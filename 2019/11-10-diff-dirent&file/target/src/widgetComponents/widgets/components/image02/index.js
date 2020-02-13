import React, { PureComponent } from 'react';
import { Icon, Upload, Message, Popconfirm } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';
import defaultBg from '@/assets/bg_img.png';

class Image02 extends PureComponent {
  constructor(props) {
    super(props);

    this.props.config.accept = this.changeToStandardAccept(this.props.config.ImageType);

    this.state = {
      config: this.props.config,
      controls: this.props.controls,
      loadingList: [],
    };
  }

  /**
   * 转换 ImageType 为标准的 accept 属性
   *
   * @param imageType {Array} eg:['png', 'jpg']
   * @return accept {String} eg:'image/gif, image/jpeg, image/jpg, image/png'
   */
  changeToStandardAccept(imageType) {
    let arrAcceptTmp = [];
    for(let i = 0; i<imageType.length; i++) {

      arrAcceptTmp.push(`image/${imageType[i]}`);
      // jpg要处理一下,ant默认上传jpg读取到文件类型会是jpeg
      if(imageType[i]==='jpg'){
        arrAcceptTmp.push(`image/jpeg`);
      }
    }
    return arrAcceptTmp.toString();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      config: { ...nextProps.config },
      controls: { ...nextProps.controls },
    });
  }

  handleBeforeUpload(file) {
    // 检查图片大小[暂无需求]
    // 检查文件类型
    const imageType = file.type.split('/')[1];

    if (this.state.config.accept.indexOf(imageType) === -1) {
      Message.info(formatMessage({ id: 'invalid_image_type' }));
      return false;
    }
    const URL = window.URL || window.webkitURL;
    const blob = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = '';
    img.src = blob;

    // 提示无效图片
    img.onerror = () => {
      Message.info(formatMessage({ id: 'invalid_image' }));
      return false;
    };

    img.onload=()=>{
      this.handleUpload(file);
      return true;
    }
  }

  /**
   * 处理图片上传
   * @param File file 文件对象
   */
  handleUpload(file) {
    const { Edbox } = window;
    const ndr = Edbox.NDR;
    const { loadingList } = this.state;
    // Edbox.Start();
    if (!file) {
      return false;
    }

    loadingList.push('loading');
    ndr.GetFileData(file, info => {
      ndr.Post(
        info.Data,
        info.Name,
        (progress, step) => {},
        data => {
          if (data) {
            const { config } = this.state;
            config.Value.push(data.Url);
            config.GUID.push(data.Guid);
            loadingList.pop();
            this.setState({
              config: { ...config },
              loadingList: [...loadingList],
            });
            this.props.onUpdate(config);
          }
        },
        err => {},
      );
    });
  }

  /**
   * 处理图片删除
   * @param {string} 删除的文件id
   */
  handleRemove(index) {
    const { config } = this.state;
    const { Value = [], IsRequired = false } = config;

    if (IsRequired && Value.length === 1) {
      Message.error(formatMessage({ id: 'required_text' }));
      return false;
    }

    config.Value.splice(index, 1);
    config.GUID.splice(index, 1);
    this.setState({
      config: { ...config },
    });

    this.props.onUpdate(config);
  }

  handleEdit(index) {
    const { config } = this.state;
    config.EditIndex = index;
    this.setState({
      config: { ...config },
    });
    this.props.onArouse(config);
  }

  render() {
    const {
      config: { ReadOnly, ImageType, Value, accept, ErrorText_Override },
      loadingList,
    } = this.state;

    let {
      config: { ErrorText = '' },
    } = this.state;

    const uploadBtn = (
      <div className={styles['btn-content']}>
        <Icon type="plus-circle" theme="filled" className={styles['ico-plus']} />
        <p className={styles['hint']}>{formatMessage({ id: 'upload_images' })}</p>
        <p className={styles['rule']}>
          {formatMessage({ id: 'image_accept' }) + ':' + ImageType.join(',')}
        </p>
      </div>
    );

    ErrorText = ErrorText_Override||ErrorText;

    return (
      <div>
        <div className="img-upload clearfix">
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={this.handleBeforeUpload.bind(this)}
            multiple={true}
            disabled={ReadOnly}
            onRemove={this.handleRemove.bind(this)}
            className={styles['btn-upload']}
            accept={accept}
          >
            {uploadBtn}
          </Upload>
          <ul className={`${styles['img-list']} clearfix`}>
            {Value && Value.length
              ? Value.map((url, i) => (
                  <li
                    key={i}
                    style={{ backgroundImage: `url("${url ? url : defaultBg}")` }}
                    className={!url ? styles['img-err'] : ''}
                  >
                    <div className={styles['actions']}>
                      {/* {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <Icon type="eye" />
                        </a>
                      ) : null} */}
                      <Icon type="edit" onClick={this.handleEdit.bind(this, i)} />
                      <Popconfirm
                        title={formatMessage({ id: 'image_delete_title' })}
                        onConfirm={this.handleRemove.bind(this, i)}
                        okText={formatMessage({ id: 'image_delete_ok' })}
                        cancelText={formatMessage({ id: 'image_delete_cancel' })}
                      >
                        <Icon type="delete" />
                      </Popconfirm>
                    </div>
                  </li>
                ))
              : null}
            {loadingList && loadingList.length
              ? loadingList.map((item, i) => (
                  <li key={i}>
                    <Icon type="loading" className={styles['loading']} />
                  </li>
                ))
              : null}
          </ul>
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Image02;
