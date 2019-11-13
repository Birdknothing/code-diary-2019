import React, { Component } from 'react';
import { Spin } from 'antd';
import { Modal } from 'antd-mobile';
import styles from './index.scss';

/*
 * 全屏覆盖加载组件
 * @param {Boolean} visible：可见性，必填
 */
class FullPageLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      // 去掉遮罩层颜色
      setTimeout(() => {
        const maskEl = document.getElementsByClassName('am-modal-mask')[0];
        maskEl.style.backgroundColor = 'transparent';
      }, 0);
    }
  }

  render() {
    const { visible } = this.props;
    return (
      <Modal
        visible={visible}
        onClose={this.onClose}
        className={styles['full-loading-modal']}
        transitionName="none"
      >
        <div className={styles['full-loading-wrap']}>
          <div className={styles['page-loading-wrap']}>
            <Spin size="large" />
          </div>
        </div>
      </Modal>
    );
  }
}

export default FullPageLoading;
