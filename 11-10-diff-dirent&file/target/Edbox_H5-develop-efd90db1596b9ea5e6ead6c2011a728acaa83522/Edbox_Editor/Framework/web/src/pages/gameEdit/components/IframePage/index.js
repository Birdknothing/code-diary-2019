import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.scss';
import IframeHandler from './../IframeHandler';
import { windowHost } from '@/utils/common'

const { Edbox } = window;

@connect(({ edit, loading }) => ({
  edit
}))
class IframePage  extends Component {

  componentDidMount() { 
    const { edit } = this.props;
    this.messageHandler(edit);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.edit.currentData.ID !== this.props.edit.currentData.ID) {
      this.messageHandler(nextProps.edit);
    }
  }

  //监听
  messageHandler = (edit) => {
    const { isLogin, currentData, dataSource } = edit;
    const { Class } = currentData;
    if (!isLogin) {
      return;

    }
    const randomNum = Math.random().toString().slice(-6);
    const iframe = document.getElementById('LoadFrame');
    const iframeUrl = {
      Loading: "/coms/Loading/Game/index.html",
      Ranking: "/coms/Ranking/index.html",
      Share: "/coms/Share/index.html",
    }
    iframe.setAttribute('src', Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(),"//" + windowHost + iframeUrl[Class]) + '&d=' + randomNum )

    iframe.onload = () => {
      const windowIframe = iframe.contentWindow;
      Edbox.Message.Get(windowIframe, function(com) {
        com.Stop();

      });

      Edbox.Message.Get(windowIframe, function(com) {
        com.Start();
        if(Class === "Share") {
          com.Send("Init", [dataSource]);
        }else {
          com.Send("Init", [currentData]);
        }
        
      });     
    };
  };



  //数组索引
  dealDatas = (data) => {
    let newDatas = JSON.parse(JSON.stringify(data));
    let newTabData = {};
    const { dispatch } = this.props;
    const tab1Loop = (item=[], i, index="") => {
      
        let {  Datas=[], ID } = item;
        const hasChild = Datas.length> 0;
        newTabData[ID] = {
          index:  index + `[${i}]`
        }
        if(hasChild){
          Datas.map((item, cIndex)=>tab1Loop(item, cIndex, index + `[${i}].Datas`))
        }
        return true
    }
    newDatas.Datas.map((item, i)=>tab1Loop(item, i, []))
    dispatch({
      type: 'edit/setDataSourceIndex',
      payload: {
        dataSourceIndex: newTabData
      },
    });
    
  }

  render() {
    const { edit } = this.props;
    const {  isLogin,  dataSource = {}  } = edit;
    const { GlobalConfig = {} } = dataSource;
    const { Height = 0, Width = 0 } = GlobalConfig; //全局横竖屏配置
    const rate = Height ? Height / Width : 1344 / 750; //如果没有设置就用默认竖屏尺寸
    const defaultWidth = rate > 1 ? 440 : 640
    if (!isLogin) {
      return null;
    }
    return (
      <div className={styles.loading}>
        <div className={styles.iframe_box}>
          <iframe
            src=""
            className={styles.iframe}
            frameBorder="0"
            title="edbox"
            id="LoadFrame"
            style = {{ height: `${defaultWidth * rate }px`, width: `${defaultWidth}px`, "margin": `-${defaultWidth * rate / 2 + 30 }px 0 0 -${defaultWidth / 2}px` }}
          />
        </div>
        <IframeHandler  />
      </div>
    );
  }
}

export default IframePage;
