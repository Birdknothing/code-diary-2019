import React, { Component } from 'react';
import styles from './index.scss';
import { connect } from 'dva';
import { Modal, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { ServerKey } from '@/utils/common';

import PageLoading from '@/components/PageLoading';
import MessageModal from '@/components/MessageModal';

const { Edbox } = window;
Edbox.ServerKey = ServerKey;
@connect(({ loading }) => ({
  loading: loading,
}))
class PictureModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inframeOnLoad: false,
      iframeUrl: '',
      visible: props.visible,
      messageModalVisible: false, // 消息弹窗显隐
      isLogin: false, // 检测当前是否登录，只有在登录情况下才能对iframe进行操作
      imgObj: {
        // 图片对象
        ID: '',
        Name: 'Image01',
        ShowName: '单张图片编辑',
        Type: 'Image01',
        Value: '',
        GUID: '',
        Width: 256,
        Height: 256,
        ReadOnly: false,
        ImageType: ['png', 'jpg', 'jpeg', 'gif'],
        IsShowCloseButton: false,
      },
      messageData: {}, // 消息对象-用于iframe的消息通信
      clickButtonItem: {}, // 判断当前点击的是哪一个按钮
    };
  }
  componentDidMount() {
    // 初始图片数据
    const { initObj, type } = this.props;
    let defaultData = null;
    if (initObj) {
      switch (type) {
        case 'Image01':
          defaultData = {
            ID: '',
            Name: 'Image01',
            ShowName: '单张图片编辑',
            Type: 'Image01',
            Value: '',
            GUID: '',
            Width: 256,
            Height: 256,
            ReadOnly: false,
            ImageType: ['png', 'jpg', 'jpeg', 'gif'],
            IsShowCloseButton: false,
          };
          break;

        case 'Image02':
          defaultData = {
            ID: '113c93d0-401e-11e9-909c-ab890e471017',
            Name: 'Image02',
            ShowName: '多张图片编辑',
            Type: 'Image02',
            Value: [],
            GUID: [],
            Width: 256,
            Height: 256,
            ReadOnly: false,
            ImageType: ['png'],
            IsShowCloseButton: false,
          };
          break;
        default:
          defaultData = {
            ID: '',
            Name: 'Image01',
            ShowName: '单张图片编辑',
            Type: 'Image01',
            Value: '',
            GUID: '',
            Width: 256,
            Height: 256,
            ReadOnly: false,
            ImageType: ['png', 'jpg', 'jpeg', 'gif'],
            IsShowCloseButton: false,
          };
      }

      this.setState(prevState => ({
        imgObj: {
          ...prevState.imgObj,
          ...defaultData,
          ...initObj,
        },
      }));
    }

    // edbox 登录
    Edbox.Start(isLogin => {
      const randomNum = Math.random()
        .toString()
        .slice(-6);
      let controlsFrameNum = 1;
      switch (type) {
        case 'Image01':
          controlsFrameNum = 1;
          break;

        case 'Image02':
          controlsFrameNum = 2;
          break;
        default:
          controlsFrameNum = 1;
      }
      // console.log('111:',controlUrl,'222:',Edbox.GetHost("Component"));
      const controlUrl = window.location.protocol+'//'+Edbox.GetHost("Component")+'/editor/pc_widget/'
      this.setState({
        iframeUrl:
          Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), controlUrl) +
          '&d=' +
          randomNum +
          '&controlsFrame=' +
          controlsFrameNum +
          '/#/Edbox_ImageSelector',
        isLogin: isLogin,
        inframeOnLoad: true,
      });
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
    clearTimeout(this.closeTimerId);
  }

  componentDidUpdate() {
    // modal 组件无法在挂载时候获取内部结构dom的特殊处理（componentDidUpdate处理+setTimeout)
    const { isLogin, imgObj } = this.state;
    if (isLogin) {
      this.timerId = setTimeout(() => {
        const iframe = document.getElementById('controlsFrame');
        if (iframe) {
          iframe.onload = () => {
            Edbox.Message.Get(iframe.contentWindow, function(com) {
              com.Start();
              com.Send('Init', [imgObj]);
            });

            this.setState({
              inframeOnLoad: false,
            });

            this.messageHandler();
            this.updateHandle();
          };
        }
      }, 0);
    }
  }

  // 消息接收监听
  messageHandler = () => {
    // const {clickButtonItem} = this.state;
    // Edbox.Message.AddMessageHandler('Update', data => {
    //   console.log('接收到数据更新：', data);
    //   // 通知父组件更新数据
    //   const { onDataChange } = this.props;
    //   // 如果是重置按钮，不更新数据，只关闭弹窗
    //   if(clickButtonItem.ID==="Message_Buttons_Reset_OK"){
    //     this.handleCtrlVisble('messageModalVisible', false);
    //   }else{
    //     onDataChange(data);
    //   }

    // });

    Edbox.Message.AddMessageHandler('Message', data => {
      this.setState(
        {
          messageData: { ...data[0] },
        },
        () => {
          this.handleCtrlVisble('messageModalVisible', true);
        },
      );
    });
  };

  updateHandle=()=>{
    const { title } = this.props;
    const {clickButtonItem} = this.state;
    Edbox.Message.AddMessageHandler('Update', data => {
      // 通知父组件更新数据
      const { onDataChange } = this.props;
      // 如果是重置按钮，不更新数据，只关闭弹窗
      if(clickButtonItem.ID==="Message_Buttons_Reset_OK"){
        this.handleCtrlVisble('messageModalVisible', false);
        message.success(formatMessage({id:'pc_tip_reset_succefully'}));
      }else{
        onDataChange(data);
        if(title === formatMessage({ id: 'pc_upload_avatar' })){
          Edbox.DataStatistic.ClickEvent('SaveAvatar','Profile','')
        }
      }
    });
  }

  getClickBtn=(item)=>{
    this.setState({
      clickButtonItem:item,
    },()=>{
      this.updateHandle();
    });
  }

  modalCancel = () => {
    const { modalCancel, title } = this.props;
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
    if(title === formatMessage({ id: 'pc_upload_avatar' })){
      Edbox.DataStatistic.ClickEvent('CancelAvatar','Profile','')
    }
  };

  handleCtrlVisble = (targetAttrStr, targeVal) => {
    this.setState({
      [targetAttrStr]: targeVal,
    });
  };


  render() {
    const { inframeOnLoad, iframeUrl, visible, messageModalVisible, messageData } = this.state;
    const {title} = this.props;
    return (
      <div>
        {/* 图片控件 */}
        <Modal
          width={800}
          visible={visible}
          title={title}
          onCancel={this.modalCancel}
          className={styles.picmodal}
          footer={null}
        >
          <div className={styles.items} style={{ height: '636px' }}>
            {inframeOnLoad ? <PageLoading className={styles.pageLoading} /> : null}
            <iframe
              src={iframeUrl}
              frameBorder="0"
              title="edbox"
              width="100%"
              height="100%"
              id="controlsFrame"
              name="controlsname"
            />
          </div>
        </Modal>
        {/* 重新消息弹窗 */}
        {messageModalVisible ? (
          <MessageModal
            visible={messageModalVisible}
            messageData={messageData}
            getClickBtn={this.getClickBtn}
            modalCancel={() => this.handleCtrlVisble('messageModalVisible', false)}
          />
        ) : null}
      </div>
    );
  }
}

export default PictureModal;
