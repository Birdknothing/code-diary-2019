import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button } from 'antd';
import { formatMessage } from 'umi/locale';

/*消息弹窗组件(根据iframe通信)
  visible:false,  //可见性,必传
  modalCancel: ()=>{}, // 弹窗关闭函数，必传
  msgTip:'' ,  // 提示文本，必传
 */
@connect()
class NormalTipModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  componentWillMount(){
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

  render() {
    const { visible } = this.state;
    const {
      msgTip,
      footer = [
        <Button type="primary" onClick={this.modalCancel} key="ok">
          {formatMessage({id:'pc_ok'})}
        </Button>,
      ],
    } = this.props;

    return (
      <Modal
        title=""
        centered
        width={286}
        visible={visible}
        className="model-style"
        onCancel={this.modalCancel}
        footer={footer}
        closable={false}
      >
        {msgTip ? <p>{msgTip}</p> : null}
      </Modal>
    );
  }
}

export default NormalTipModal;
