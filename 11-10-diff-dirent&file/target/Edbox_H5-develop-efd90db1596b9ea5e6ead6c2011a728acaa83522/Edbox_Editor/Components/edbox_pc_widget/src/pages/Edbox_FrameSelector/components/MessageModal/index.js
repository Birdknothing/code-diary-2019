import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button } from 'antd';

const { Edbox } = window;


/*消息弹窗组件(根据iframe通信)
  visible:false,  //可见性,必传
  modalCancel: ()=>{}, // 弹窗关闭函数，必传
  messageData:{},  // 消息数据（目前只针对按钮，提示信息做处理），必传
 */
@connect()
class MessageModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible
    };
  }


  modalCancel = () => {
    const { modalCancel, messageData } = this.props;

    // 优化关闭有动画
    this.setState(
      {
        visible: false
      },
      () => {
        this.closeTimerId = setTimeout(() => {
          if (modalCancel) {
            modalCancel();
          }
        }, 500);
      },
    );

    // 广播关闭事件
    Edbox.Message.Broadcast('MessageClose', [messageData]);
  };

  //弹窗按钮
  footerBtn = ButtonsDatas => {
    return ButtonsDatas.map(item => {
      return (
        <Button
          type={item.Style.toLowerCase()}
          key={item.ID}
          onClick={() => this.modalHandlerButtonClick(item)}
        >
          {item.ShowName}
        </Button>
      );
    });
  };

  // 按钮点击事件绑定
  modalHandlerButtonClick = item => {
    const { messageData } = this.props;
    Edbox.Message.Broadcast('MessageButtonClick', [item, messageData]);
    this.modalCancel();
  };

  render() {
    const { visible } = this.state;
    const {
      messageData: { Buttons = [], ShowName = '' },
    } = this.props;

    return (
      <Modal
        title=""
        centered
        width={286}
        visible={visible}
        className="model-style"
        onCancel={this.modalCancel}
        footer={this.footerBtn(Buttons)}
        closable={false}
      >
        {/* 情况1：消息文本提示 */}
        {ShowName ? <p>{ShowName}</p> : null}
      </Modal>
    );
  }
}

export default MessageModal;
