import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button, Checkbox } from 'antd';
import { formatMessage } from 'umi/locale';
import { controlUrl } from '@/utils/common'
// import styles from './index.scss';

const { Edbox } = window;
@connect(({ edit, loading }) => ({
  edit,
  loading: loading,
}))
class ModalMessage extends Component {

  componentDidUpdate(prevProps, prevState) {
    const { edit } = this.props;
    this.messageHandler(edit);
  }

  //关闭弹窗
  setModalVisible = () => {
    const { dispatch, edit = {} } = this.props;
    const { modalMessage = {} } = edit;
    const {  messageData = {} } = modalMessage;
    dispatch({
      type: 'edit/setModalMessage',
      payload: {
        modalMessage: {
          modalVisible: false,
          messageData: undefined
        },
      },
    });
    Edbox.Message.Broadcast("MessageClose",[messageData]);
  }

  //弹窗按钮
  footerBtn = (ButtonsDatas) => {
     return ButtonsDatas.map((item) => {
      return <Button type={item.Style.toLowerCase()} key={item.ID} onClick={() => this.modalHandler(item)}>{!!item.ShowName_Override ? item.ShowName_Override : item.ShowName}</Button>
    })
  }

  // 点击弹窗按钮时操作
  modalHandler = (item) => {
    const {  edit = {}, dispatch } = this.props;
    const { modalMessage = {} } = edit;
    dispatch({
      type: 'edit/setModalMessage',
      payload: {
        modalMessage: {
          modalVisible: false,
          messageData: undefined
        },
      },
    });
    Edbox.Message.Broadcast("MessageButtonClick",[item,modalMessage.messageData]);
  }

  //复选框
  checkBoxChange = () => {
    const {  edit = {}, dispatch } = this.props;
    const { modalMessage = {} } = edit;
    const { messageData = {} } = modalMessage;
    dispatch({
      type: 'edit/setModalMessage',
      payload: {
        modalMessage: {
          modalVisible: true,
          messageData: {
            ...messageData,
            Switch : {
              ...messageData.Switch,
              Value: !messageData.Switch.Value
            }
          }
        },
      },
    });
  }

   //监听
   messageHandler = (edit) => {
    const { isLogin, toolDatas = {} } = edit;
    const { toolModalVisible, toolData = {} } = toolDatas;
    if (!isLogin || !toolModalVisible ) {
      return;
    }
    const randomNum = Math.random().toString().slice(-6);
    const iframe = document.getElementById('toolIframe');
    iframe.setAttribute('src', Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), controlUrl) + '&d=' + randomNum + '#/Edbox_FrameSelector/SeqMap')

    iframe.onload = () => {
      const windowIframe = iframe.contentWindow;
      Edbox.Message.Get(windowIframe, function(com) {
        com.Stop();

      });

      Edbox.Message.Get(windowIframe, function(com) {
        com.Start();
        com.Send("Init", toolData);
      });
    };
  };

  //隐藏工具弹窗
  hideToolIframe = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/setToolDatas',
      payload: {
        toolDatas: undefined
      },
    });
  }

  render() {
    const {  edit = {} } = this.props;
    const { modalMessage = {}, toolDatas = {} } = edit;
    const { modalVisible, messageData = {} } = modalMessage;
    const { toolModalVisible } = toolDatas;
    const { Buttons = [], Switch } = messageData;
    return (
      <div>
        { modalVisible ?
          <Modal
            title=""
            centered
            visible = {modalVisible}
            footer={this.footerBtn(Buttons)}
            onCancel={this.setModalVisible}
            className='model_style'
            width={286}
            closable={false}
          >
            <p>{!!messageData.ShowName_Override ? messageData.ShowName_Override :messageData.ShowName}</p>
            { !!Switch 
              ? <Checkbox onChange={this.checkBoxChange}>{!!messageData.ShowName_Override ? messageData.ShowName_Override :messageData.ShowName}</Checkbox>
              : null
            }
            
          </Modal>
          :null
        }
        <Modal
        title={formatMessage({ id: 'tool' })}
        visible={toolModalVisible}
        onCancel={this.hideToolIframe}
        centered
        className='tool-model'
        footer={null}
        forceRender = {true}
        width={1100}
      >
        <iframe src="" frameBorder="0" title="tool" width="100%"  height="100%" id="toolIframe"></iframe>
        
      </Modal>
      </div>
        
    );
  }
}

export default ModalMessage;

