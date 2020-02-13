import React, { Component } from 'react';
import styles from './index.scss';
import { connect } from 'dva';
import { controlUrl } from '@/utils/common'
import PageLoading from '@/components/PageLoading';

const { Edbox } = window;
@connect(({ edit, loading }) => ({
  edit,
  loading: loading,
}))
class Controls extends Component {

  constructor(props){
    super(props);
    this.state = {
      inframeOnLoad: false
    }
  }
  componentDidMount () {
    this.messageHandler(this.props, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.edit.controls !== this.props.edit.controls) {
      this.messageHandler(nextProps, true);
    }
    // if (nextProps.edit.currentData !== this.props.edit.currentData) {
    //   this.messageHandler(nextProps, true);
    // }
  }

  messageHandler = (nextProps, isNext) => {
    const {  edit ={}  } = nextProps;
    const { controls = {} } = edit;
    const controlThis = this;
    const randomNum = Math.random().toString().slice(-6);
    const iframe =  document.getElementById("controlsFrame"); 
    this.setState({
      inframeOnLoad:true
    });
    switch (controls.Type) {
      case 'Text01' :
      case 'Text02' :
      case 'Text03' :
        iframe.setAttribute('src', Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), controlUrl) + '&d=' + randomNum + '&controlsFrame=1/#/Edbox_TextSelector')
        break;
      case 'Image01' :
      case 'Image02' :
        iframe.setAttribute('src', Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), controlUrl) + '&d=' + randomNum + '&controlsFrame=2/#/Edbox_ImageSelector')
        break;
      case 'Audio01' :
        iframe.setAttribute('src', Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), controlUrl) + '&d=' + randomNum + '&controlsFrame=3/#/Edbox_AudioSelector')
        iframe.setAttribute("allow", "microphone")
        break;
      case 'Animation01':
        iframe.setAttribute('src', Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), controlUrl) + '&d=' + randomNum + '/#/Edbox_FrameSelector' )
        break;
      default:
       break;
    }
    let messageCom = null;
    
    // if(isNext) {
    //   this.setState({
    //     inframeOnLoad:false
    //   });
    //   controlThis.AddMessage(controlThis, messageCom, iframe.contentWindow, nextProps)
    // }
    
    iframe.onload = () => {
      controlThis.AddMessage(controlThis, messageCom, iframe.contentWindow, nextProps)
      this.setState({
        inframeOnLoad:false
      });
    }
  }

  AddMessage = (controlThis, messageCom, windowIframe, nextProps) => {
    const {  dispatch, edit ={}  } = nextProps;
    const { controls = {} } = edit;
    Edbox.Message.Get(windowIframe, function (com) {
      com.Stop();
    });

    Edbox.Message.Get(windowIframe, function (com) {
      com.Start();
      com.Send("Init", [controls]);
      messageCom =com;
    });


    //Close
    Edbox.Message.AddMessageHandler("Close", function (datas, com) {
      if( messageCom === com ) {
        dispatch({
          type: 'edit/setControls',
          payload: {
            controls: undefined,
            xMax: 400
          },
        });
      }
    });
  }
  
  render() {
    const { inframeOnLoad } = this.state;
    return (
      <div className={styles.items} >
        {inframeOnLoad ?<PageLoading   className={styles.pageLoading} /> : null}
        <iframe src="" frameBorder="0" title="edbox" width="100%" height="100%" id="controlsFrame" name="controlsname" ></iframe>
      </div>
    );
  }
}

export default Controls;

