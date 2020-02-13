import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';
import defaultAvatar from '@/assets/personalcenter/avatar_default.jpg';

import PictureModal from '@/components/PictureModal';

// 头像上传组件
/*
  initImgUrl: 初始化图片地址，必传
  onChange： 头像改变事件，必传，形参返回的新的图片地址
 */
@connect(({ loading }) => ({
  loading: loading.models.personalCenter,
}))
class Avatar extends PureComponent {
  constructor(props) {
    super(props);
    // console.log('接收到的头像：',props.initImgUrl);
    this.state = {
      visible: false, // 图片弹窗显隐
      imgUrl: props.initImgUrl ? props.initImgUrl : '', // 初始图片地址
    };
  }

  componentWillReceiveProps(nextProps){
     const {initImgUrl} = this.props;
     if(initImgUrl !==nextProps.initImgUrl){
       this.setState({
        imgUrl:nextProps.initImgUrl,
       });
     }
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleCtrlVisble = (targetAttrStr, targeVal) => {
    this.setState({
      [targetAttrStr]: targeVal,
    });
  };

  changeImgUrl = data => {
    // console.log('父组件接收到的更新：', data);
    this.setState(
      {
        imgUrl: data[0].Value,
        visible: false,
      },
      () => {
        const { imgUrl } = this.state;
        const { onChange } = this.props;

        // 设置头像地址
        onChange(imgUrl);
      },
    );
  };

  render() {
    const {  imgUrl, visible } = this.state;
    const {disabled} = this.props;
    return (
      <div>
        <div
          className={styles['avatar-wrap']}
        >
          <div className={styles['img-wrap']}>
            <img src={imgUrl ? imgUrl : defaultAvatar}  onError={(e) => {e.target.onerror = null;e.target.src=defaultAvatar}} alt="" />
            {disabled?null:(
            <span title={formatMessage({ id: 'pc_modify_s' })} onClick={() => this.handleCtrlVisble('visible', true)} className={styles['tip']}>{formatMessage({ id: 'pc_modify_s' })}</span>
            )}
          </div>
        </div>
        {visible ? (
          <PictureModal
            visible={visible}
            title={formatMessage({ id: 'pc_upload_avatar' })}
            modalCancel={() => this.handleCtrlVisble('visible', false)}
            onDataChange={this.changeImgUrl}
            type="Image01"
            initObj={{
              Height: 250,
              Width: 250,
              Value: imgUrl,
              ImageType:['jpg','jpeg'],
            }}
          />
        ) : null}
      </div>
    );
  }
}

export default Avatar;
