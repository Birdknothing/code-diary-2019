import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd-mobile';
import styles from './index.scss';

/*
 * 全屏iframe组件
 * @param {Boolean} visible：可见性，必填
 * @param {String} url：iframe地址，必填
 * @param {Boolean} isVertical：横竖判断，必填
 */
@connect(({ lobby }) => ({
  lobby: lobby
}))
class FullPageIframe extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      // dispatch({
      //   type: 'lobby/setPlay',
      //   payload:{
      //     isPlay: false
      //   }
      // })
      onClose();
    }
  };

  // componentWillReceiveProps(nextProps){
  //   const { dispatch } = this.props;
  //   if(nextProps.visible !== this.props.visible && nextProps.visible){
  //     dispatch({
  //       type: 'lobby/setPlay',
  //       payload:{
  //         isPlay: true
  //       }
  //     })
  //   }
  // }

  render() {
    const { visible, url,isVertical=true } = this.props;

    return (
      <Modal visible={visible} onClose={this.onClose} className={styles['full-iframe-modal']}>
        <div className={styles['full-iframe-wrap']}>
          <span className={`${styles['btn-close']} ${isVertical?'':styles['rb']}`} onClick={this.onClose}></span>
          <div className={styles['iframe-layout']}>
            <iframe
              title="iframe"
              className={'full-iframe'}
              src={url ? url : ''}
              frameBorder="0"
              width="100%"
              height="100%"
              marginHeight="0"
              marginWidth="0"
            ></iframe>
          </div>
        </div>
      </Modal>
    );
  }
}

export default FullPageIframe;
