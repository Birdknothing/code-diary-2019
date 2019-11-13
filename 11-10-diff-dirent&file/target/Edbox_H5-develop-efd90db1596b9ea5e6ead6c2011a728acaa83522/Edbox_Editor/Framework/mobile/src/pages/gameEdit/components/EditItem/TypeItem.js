import React, { Component } from 'react';
import styles from "./index.less";
import { connect } from "dva";
import { Flex } from 'antd-mobile';
import  ImageItem from './components/ImageItem';
import  AudioItem from './components/AudioItem';
import { controlUrl } from '@/utils/common'

const { Edbox } = window;
@connect(({ edit }) => ({
  edit: edit
}))

class TypeItem extends Component {
  constructor(props){
    super(props);
    const { edit } = props
    const { currentData = {} } = edit
    const { Datas=[] } = currentData
    this.state = {
      activeTab: 0,
      editData: Datas.length > 0 ? Datas[0]: undefined,
      iframeHeight: 0.99
    }
  }

  componentDidMount () {
    const { edit } = this.props
    const { controls = {} } = edit
    this.messageHandler(this.props, false, controls.Name);
  }

  componentWillReceiveProps(nextProps) {
    const { edit } = nextProps
    const { currentData = {} , controls = {}, currentEditData= {} } = edit
    const { Datas=[] } = currentData
    if (nextProps.edit.controls !== this.props.edit.controls) {
      
      this.messageHandler(nextProps, true, controls.Name);
    }
    if (nextProps.edit.currentData !== this.props.edit.currentData) {
      this.setState({
        editData: Datas.length > 0 ? Datas[0]: undefined,
        activeTab: 0,
      });
    }

    if (nextProps.edit.currentEditData !== this.props.edit.currentEditData) {
      const currentTabData = Datas.filter((item, i)=> {
        if(currentEditData.Type.indexOf(item.Name) > -1){
          item.index = i
        }
        return currentEditData.Type.indexOf(item.Name) > -1
        
      })
      // console.log(currentTabData, 23123)
      const { dispatch } = this.props
      dispatch({
        type: 'edit/setControls',
        payload: {
          controls: currentTabData.length > 0 ? currentTabData[0] : undefined
        }
      });
      this.setState({
        activeTab: currentTabData.length > 0 ? currentTabData[0].index : 0,
        editData: currentTabData.length > 0 ? currentTabData[0] : undefined,
        iframeHeight: 0.99
      })
      this.messageHandler(nextProps, true, currentEditData.Type);
    }
  }
  // componentDidUpdate ( ) {
  //   this.messageHandler();
  // }

  messageHandler = (nextProps, isNext, Type) => {
    const {  edit ={}  } = nextProps;
    let { controls , currentData = {} , currentEditData = {}} = edit;
    const { Datas = [] } = currentData;
    const controlThis = this;
    const iframe =  document.getElementById("controlsFrame");  
    if(Datas.length < 1) {
      return;
    } 
    if( !controls ) {
      controls = Datas.length > 0 ? Datas[0] : undefined
    }
    switch (Type) {
      case 'Text01' :
      case 'Text02' :
      case 'Text' :
        iframe.setAttribute('src', Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), controlUrl) + '&d=1/#/Edbox_TextSelector')
        break;
      case 'Image01' :
      case 'Image02' :
      case 'Image' :
        iframe.setAttribute('src', Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), controlUrl) + '&d=1/#/Edbox_ImageSelector')
        break;
      case 'Audio01' :
      case 'Audio' :
        iframe.setAttribute('src', Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), controlUrl) + '&d=1/#/Edbox_AudioSelector')
        break;
      default:
       return
    }
    let messageCom = null;
    if (controls.Name === 'Text') {
      if(isNext ) {
        controlThis.AddMessage(controlThis, messageCom, iframe.contentWindow, nextProps, currentEditData)
      }
      
      iframe.onload = () => {
        controlThis.AddMessage(controlThis, messageCom, iframe.contentWindow, nextProps, currentEditData)
      }
    }
  }

  closeMenu = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/setShowOperation',
      payload: {
        showOperation: false
      }
    });
  }

  handleClick = (e, item) => {
    e.stopPropagation();
  }

  renderTab = (data = {}, i) => {
    const { activeTab } = this.state;
    const { Type, ID,  ShowName, Name} = data
    const isTab = Type === 'Tab03'
    if (isTab ) {
      return (<Flex.Item className={`${Name} ${ i === activeTab ? 'active': null }`} key={ID}  onTouchStart={(e) => this.touchstartHandle(e, i, data)}><span>{ShowName}</span></Flex.Item>)
    }
  }

  touchstartHandle = (e, i, data) => {
    const { dispatch } = this.props
    dispatch({
      type: 'edit/setControls',
      payload: {
        controls: data
      }
    });
    this.setState({
      activeTab: i,
      editData: data,
      iframeHeight: 0.99
    })
    Edbox.Message.Broadcast("TabClick", [data]);
  }

  

  AddMessage = (controlThis, messageCom, windowIframe, nextProps, currentEditData) => {
    const {  dispatch } = nextProps;
    Edbox.Message.Get(windowIframe, function (com) {
      com.Stop();
    });

    Edbox.Message.Get(windowIframe, function (com) {
      com.Start();
      com.Send("Init", currentEditData);
      messageCom =com;
    });

    //更新
    Edbox.Message.AddMessageHandler("Update", function (datas, com) {
      if( messageCom === com ) {
        controlThis.handleUpdate(datas);
      }
    });

    //Close
    Edbox.Message.AddMessageHandler("Close", function (datas, com) {
      if( messageCom === com ) {
        dispatch({
          type: 'edit/setControls',
          payload: {
            controls: undefined,
            xMax: 320
          },
        });
      }
    });

    //Message
    Edbox.Message.AddMessageHandler("Message", function (datas, com) {
      if( messageCom === com ) {
        controlThis.setState({
          modalVisible: false
        })
      }
    });

    //监听tab
    Edbox.Message.AddMessageHandler("TabClick", function (datas, com) {
      if( messageCom === com ) {
        controlThis.setState({
          iframeHeight: (datas.Height / 100)
        })
        // console.log('接受更新数据', controls)
      }
    });

    

  }

  handleUpdate = widgetConfig => {
    const {  edit,  dispatch } = this.props;
    const { currentData={}, dataSource={}, recommendList = [] } = edit;
    const { Recommend } = currentData;
    const widgetConfigID = widgetConfig.ID;
    const loop = (oldData, key, newData) => {
      return oldData.map(item => {
        if (item.ID === key) {
          item = { ...newData };
        }
        if (item.Datas && item.Datas.length) {
          if(!!item) {
            item.Datas = loop(item.Datas, key, newData);
          }
        }
        return item;
      });
    };

    const computeData = loop(currentData.Datas, widgetConfigID, widgetConfig);
    if (!/Tab0(1|2|3)/.test(computeData[0].Type) && dataSource) {
      const currentDataID = currentData.ID;
      currentData.Datas = computeData;
      const index = dataSource.Datas.find(i => i.ID === currentDataID);
      if (index > -1) {
        dataSource.Datas[index] = { ...currentData };
      }
    }
    if(Recommend) {
      recommendList.push(currentData.ID)
      const recommend = new Set(recommendList);
      dispatch({
        type: 'edit/setRecommendList',
        payload: {
          recommendList: [...recommend ] 
        }
      })
    }
    dispatch({
      type: 'edit/updateData',
      payload: {
        currentData: currentData,
        dataSource: dataSource
      },
    });
    window.Edbox.Message.Broadcast('Update', [widgetConfig]);
  };

  render() {
    const { edit } = this.props
    const { editData = {}, iframeHeight } = this.state
    const { currentData = {} } = edit
    const { Datas=[] } = currentData
    return (
      <div className={`${styles.resizeIframe} ${iframeHeight === 1 ?  styles.resizeFull : ''}`}  >
          { editData.Name === "Image" 
            ?<ImageItem imageData = {editData} />
            :  editData.Name === "Audio" 
            ? <AudioItem audioData = {editData} style={{height: "5rem"}} />
            : null
          }
          <span 
            className={`${styles.iframeStyle} ${iframeHeight === 1 ?  styles.iframeResizeFull : ''}`}
            style={
              iframeHeight === 1 ? {display: editData.Name === "Text" ?'block': 'none'} : {height: iframeHeight+  "rem", display: editData.Name === "Text" ?'block': 'none'}
            }
          >
            <iframe 
              src="" 
              frameBorder="0" 
              title="edbox" 
              width="100%"
              id="controlsFrame"
              height="100%;"
              allowtransparency="true"  
              onTouchMove={e => e.stopPropagation()}
            />
          </span>
          <div className={styles.menuItem}  onClick={this.handleClick}>
            <Flex  className='operationList'>
              {Datas.map((item, i) => this.renderTab(item, i))}
            </Flex>
          </div>
        </div>
    );
  }
}

export default TypeItem;


