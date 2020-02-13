import React, { PureComponent } from 'react';
import { Modal, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';

class ConfirmModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }
  componentWillUnmount() {
    clearTimeout(this.closeTimerId);
  }
  modalCancel = () => {
    const { modalCancel } = this.props;
    // 优化关闭有动画
    this.setState(
      {
        visible: false,
      },
      () => {
        this.closeTimerId = setTimeout(() => {
          if (modalCancel) {
            modalCancel();
          }
        }, 500);
      },
    );
  };

  submitObj = () => {
    const { onSure } = this.props;
    if (onSure) {
      onSure();
    }
  };

  render() {
    const { visible } = this.state;
    const { txt } = this.props;
    return (
      <Modal
        visible={visible}
        title=""
        className={styles['set-modal']}
        width={288}
        centered
        closable={false}
        footer={[
          <Button key="submit" type="primary" onClick={this.submitObj}>
            {formatMessage({ id: 'set_btn_change' })}
          </Button>,
          <Button key="back" onClick={this.modalCancel}>
            {formatMessage({ id: 'set_btn_cancel' })}
          </Button>,
        ]}
      >
        {txt}
      </Modal>
    );
  }
}

export default ConfirmModal;
