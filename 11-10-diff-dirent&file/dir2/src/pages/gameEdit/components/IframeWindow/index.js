import React, { Component } from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { getGuidData, setSourceValue } from '@/utils/helper';
import styles from './index.scss';
import { pauseAudios } from '@/utils/helper'

const { Edbox } = window;

@connect(({ edit, loading }) => ({
  edit
}))
class IframeWindow extends Component {

  componentDidMount() { 
    this.messageHandler();
    const thisHandler = this;
    const dragHandler = document.getElementById('dragHandler');
    const resizeMe = document.getElementById('resizeMe');
    const b = document.getElementById('body');
    const main = document.getElementById('main');
    const hoverIframe = document.getElementById('hoverIframe');
    const navW = 220; //侧边宽度
    const collapseW = 400; //右边宽度
    dragHandler.addEventListener("mousedown", function(ed) {
        let flag=true;
        hoverIframe.style.display = "block";
        const { edit } = thisHandler.props;
        const { currentData = {}, dataSource = {} } = edit;
        const { GlobalConfig = {} } = dataSource;
        const { Height = 0, Width = 0 } = GlobalConfig; //全局横竖屏配置
        const {  Class } = currentData;
        if(Class === "LevelEdit") {
          flag= false;
        }
        b.addEventListener("mousemove",function(em){
          const mainW = main.offsetWidth;
          const resizeMeMinW = (Height && Width) ? Width > Height ? 680 : 480 : 480;
          if(flag){
            if( (mainW + navW - em.clientX) <= collapseW ) {
              // flag = false;
              resizeMe.style.width = mainW - navW - collapseW;
            }
            else if( (em.clientX - navW) <= resizeMeMinW ) {
              resizeMe.style.width = resizeMeMinW;
            }
            else{
              resizeMe.style.width=em.clientX-navW+"px"; 
            }
          }
        });
        b.addEventListener("mouseup",function(){
            flag=false;
            hoverIframe.style.display = "none";
        });
        

    });
  }
  componentDidUpdate(nextProps) {
    if (nextProps.edit.isLogin !== this.props.edit.isLogin) {
      this.messageHandler();
    }
  }

  //监听
  messageHandler = () => {
    const { dispatch, edit } = this.props;
    const messageThis = this;
    const { isLogin } = edit;
    let isInt= false;
    if (!isLogin) {
      return;
    }
    let messageCom = null;
    const iframe = document.getElementById('GameFrame');
    iframe.addEventListener('mouseover', () => {
      iframe.focus();
    });
    iframe.onload = () => {
      const windowIframe = iframe.contentWindow;
      let toolMessageCom = null
      Edbox.Message.Get(windowIframe, function(com) {
        com.Stop();
      });

      Edbox.Message.Get(windowIframe, function(com) {
        com.Start();
        messageCom = com;
      });
      //初始化
      Edbox.Message.AddMessageHandler('Init', function(datas, com) {
        
        if (messageCom === com) {
          isInt = true
          // messageThis.dealDatas(datas[0]);
          // const access = Edbox.Access // 访问类型 1-模板 2-个人库 3-体验库
          // if(access === 2) { // 判断是否个人库
            try {
              Edbox.Editor.LoadDatas(
                datas[0], 
                LoadDatas => {
                  messageThis.dealInitDatas([LoadDatas], true)
                  messageThis.dealDatas(LoadDatas);
                },
                err => {
                  message.error(err);
                  messageThis.dealInitDatas(datas, false)
                  messageThis.dealDatas(datas[0]);
                },
              ); // 读取Package数据包的数据到Datas对象中
              
            } catch (e) {
              message.error(e.message);
              
            }
          // }else {
           
            // messageThis.dealInitDatas(datas, false)
          // }
        }
      });

      //添加
      Edbox.Message.AddMessageHandler('Add', function(datas, com) {
        if (messageCom === com) {
          const { edit } = messageThis.props;
          const { dataSource = {}, currentData = {} } = edit;
          const { Datas = [], StaticData = [] } = dataSource;
          const type = datas[0].Type;
          const dealData = type === 'StaticData' ? StaticData : Datas; //判断StaticData数据
          let data;
          
          if (type !== 'StaticData') {
            data = dealData.map(i => messageThis.dealDataSource(i, datas[0].ID, datas[1], 'Add'));
            data.map(i => messageThis.updateCurrentData(i, currentData.ID));
            messageThis.dealDatas({ Datas: data });
          }
          data = type === 'StaticData' ? { StaticData: datas[0] } : { Datas: data };
          
          dispatch({
            type: 'edit/setData',
            payload: {
              dataSource: {
                ...dataSource,
                ...data,
              },
            },
          });
        }
      });


      //更新
      Edbox.Message.AddMessageHandler('Update', function(datas, com) {
        const { edit } = messageThis.props;
        let { dataSource = {}, currentData = {}, dataSourceIndex = {} } = edit;
        const { Datas = [], StaticData = [] } = dataSource;
        const { Type:type, Datas: updateDatas = [] } = datas[0]
        const dealData = type === 'StaticData' ? StaticData : Datas;
        let data 
        let newCurrentData
          
        if (type !== 'StaticData') {
          const updateIndex = dataSourceIndex[datas[0].ID];
          const updateCurrentDataIndex = dataSourceIndex[currentData.ID];
          const newDealData = JSON.parse(JSON.stringify(dealData));
          //更新dataSource
          if(!updateIndex)  return;
          // eslint-disable-next-line
          let newData = eval('newDealData'+ updateIndex.index);
          Object.assign(newData, datas[0])
          data = newDealData;
          
          //更新currentData
          // eslint-disable-next-line
          newCurrentData = eval('newDealData'+ updateCurrentDataIndex.index);
          //更新节点索引
          if(updateDatas.length)
            messageThis.dealDatas({ Datas: data });
        }

        data = type === 'StaticData' ? { StaticData: datas[0] } : { Datas: data };
        dispatch({
          type: 'edit/updateValue',
          payload: {
            dataSource: {
              ...dataSource,
              ...data,
            },
            currentData: !!newCurrentData?newCurrentData: currentData
          },
        });
        if (messageCom !== com) {
          window.Edbox.Message.Broadcast('Update', datas);
        }
      });

      //还原
      Edbox.Message.AddMessageHandler('Restore', function(datas, com) {
        if (messageCom === com) {
          const { edit } = messageThis.props;
          let { dataSource = {}, currentData = {}, dataSourceIndex = {} } = edit;
          const { Datas = [], StaticData = [] } = dataSource;
          const { Type:type, Datas: updateDatas = [] } = datas[1]
          const dealData = type === 'StaticData' ? StaticData : Datas;
          const { Class } = currentData;
          let data 
          let newCurrentData
          if (type !== 'StaticData') {
            const updateIndex = dataSourceIndex[datas[1].ID];
            const updateCurrentDataIndex = dataSourceIndex[currentData.ID];
            const newDealData = JSON.parse(JSON.stringify(dealData));
            //更新dataSource
            if(!updateIndex)  return;
            // eslint-disable-next-line
            let newData = eval('newDealData'+ updateIndex.index);
            Object.assign(newData, datas[1])
            data = newDealData;
            
            //更新currentData
            // eslint-disable-next-line
            newCurrentData = eval('newDealData'+ updateCurrentDataIndex.index);
            //更新节点索引
            if(updateDatas.length)
              messageThis.dealDatas({ Datas: data });
          }
          data = type === 'StaticData' ? { StaticData: datas[1] } : { Datas: data };
          dispatch({
            type: 'edit/setDataControls',
            payload: {
              dataSource: {
                ...dataSource,
                ...data,
              },
              currentData: !!newCurrentData?newCurrentData: currentData,
              controls: undefined,
              xMax: 400
            },
          });

          if(Class === "Ranking" || Class === "Loading" || Class === "Share" ) {
            const ownIframe = document.getElementById('LoadFrame');
            ownIframe.onload = () => {
              const windowOwnIframe = ownIframe.contentWindow;
              Edbox.Message.Get(windowOwnIframe, function(ownCom) {
                if(Class === "Share") {
                  com.Send("Init", [dataSource]);
                }else {
                  com.Send("Init", [newCurrentData]);
                }
              });
            }
          }
        }
      });

      //删除

      Edbox.Message.AddMessageHandler('Delete', function(datas, com) {
        if (messageCom === com) {
          if(!datas){
            return;
          }
          const { edit, dispatch } = messageThis.props;
          const { dataSource = {}, currentData = {} } = edit;
          const { Datas = [], StaticData = [] } = dataSource;
          const type = datas[0].Type;
          const dealData = type === 'StaticData' ? StaticData : Datas;
          let data
          let deData = [];
          if (type !== 'StaticData') {
            data = dealData.map(i =>
              messageThis.dealDataSource(i, datas[0].ID, datas[1], 'Delete'),
            );
            for (let i = 0; i < data.length; i++) {
              data[i] !== undefined && deData.push(messageThis.filterData(data[i]));
            }
            deData.map(i => messageThis.updateCurrentData(i, currentData.ID));
            messageThis.dealDatas({ Datas: deData });
          }
          deData = type === 'StaticData' ? { StaticData: datas[0] } : { Datas: deData };
          dispatch({
            type: 'edit/setData',
            payload: {
              dataSource: {
                ...dataSource,
                ...deData,
              },
            },
          });
        }
      });

      //tab点击
      Edbox.Message.AddMessageHandler('TabClick', function(datas, com) {
        if (messageCom === com) {
          const { edit } = messageThis.props;
          const { dataSource = {} } = edit;
          const { Datas = [] } = dataSource;
          Datas.map(i => messageThis.tabClick(i, datas[0].ID, []));
        }
      });

      //关闭控件
      Edbox.Message.AddMessageHandler('CloseWidgetPage', function(datas, com) {
        const { dispatch } = messageThis.props;
        dispatch({
          type: 'edit/setControlsData',
          payload: {
            controls: undefined,
            xMax: 400
          },
        });
      });
      
       //Message
      Edbox.Message.AddMessageHandler("Message", function (datas, com) {
        const { dispatch } = messageThis.props;
        dispatch({
          type: 'edit/setModalMessage',
          payload: {
            modalMessage: {
              modalVisible: true,
              messageData: datas[0]
            },
          },
        });
      });

      //ObjectClick点击定位
      Edbox.Message.AddMessageHandler('ObjectClick', function(datas, com) {
        if (messageCom === com) {
        }else {
          const { Datas = [] } = datas[0];
          const { edit } = messageThis.props;
          const { currentData = {}, dataSourceIndex = {}, dataSource = {} } = edit;
          // eslint-disable-next-line
          const { Datas: sourceDatas = [], StaticData = [] } = dataSource;
          const objectClickDataIndex = dataSourceIndex[datas[0].ID].index;
          const splitIndex = objectClickDataIndex.split(".");
          const { Class } = currentData;
          let tabActive = "";
          let tabActiveId = undefined;
          
          for(let i = 0; i < splitIndex.length; i++) {  //拿到当前index进行处理获取到tab02
            // eslint-disable-next-line
            const newData = eval('sourceDatas'+ tabActive + splitIndex[i]);
            if(newData.Type === "Tab02") {
              tabActiveId = newData.ID;
            }
            tabActive = tabActive + splitIndex[i] + "."
            
          }
          dispatch({
            type: 'edit/setAllActiveKey',
            payload: {
              collapseKey: {
                ketPach : Datas.length ? [Datas[0].ID, datas[0].ID] : [datas[0].ID], 
                id: tabActiveId ? tabActiveId : currentData.ID
              },
              tabActiveKey: tabActiveId ? tabActiveId : currentData.ID //点击时选中tab02
            },
          });

          if (Class === "Ranking") {
            dispatch({
              type: 'edit/setCollapseDeleteData',
              payload: {
                collapseDeleteData: datas,
              },
            });
          }
        }
      })
      //OpenToolWindow
      Edbox.Message.AddMessageHandler("OpenToolWindow", function (datas, com) {
        const { dispatch } = messageThis.props;
        toolMessageCom = com;
        dispatch({
          type: 'edit/setToolDatas',
          payload: {
            toolDatas: {
              toolModalVisible: true,
              toolData: datas
            },
          },
        });
        
      });

      //ToolWindowCallback
      Edbox.Message.AddMessageHandler("ToolWindowCallback", function (datas, com) {
        const { dispatch } = messageThis.props;
        dispatch({
          type: 'edit/setToolDatas',
          payload: {
            toolDatas: undefined
          },
        });
        toolMessageCom.Send("ToolWindowCallback",datas);
      });
      //Message
      Edbox.Message.AddMessageHandler("StopAudio", function (datas, com) {
        pauseAudios("all");
      });

      
      //超时提醒
      setTimeout(()=> {
        if(!isInt){
          messageThis.overTime()
        }
      },30000)
    };
  };

  //处理初始化数据
  dealInitDatas = (datas, isPersonal) => {
    const LoadDatas = datas[0];
    const initData = LoadDatas.Datas;
    const { edit, dispatch } = this.props;
    const { currentData = {} } = edit;
    const dealThis= this;
    //获取Guid
    let GuidList = []
    for (var index = 0; index < initData.length; index++) {
      var element = getGuidData(initData[index], false);
      if(element.length > 0) {
        GuidList.push(...element)
      }
    }
    //批量获取图片
    if(GuidList.length) { //有图片未获取
      Edbox.NDR.GetList(
        [...new Set(GuidList)],
        data => {
          const newDataSource = dealThis.setDatasValue(data, LoadDatas);
          const isCurrentData = newDataSource.map(i =>
            dealThis.currentOpenKey(i, [currentData.ID], undefined),
          );
          const hasData = isCurrentData.includes(true);
          if (!hasData) {
            // const ddd= initData.map((item, i) =>messageThis.defaultKey(item, undefined));
            dealThis.defaultOpenKey(newDataSource[0], [newDataSource[0].ID], undefined);
          }
          LoadDatas.Datas = newDataSource;
          //非个人库的编辑把Datas返回来，不要把静态数据带上
          // if(!isPersonal){
          //   Edbox.Message.Broadcast('Update', [{Datas: initData}]);
          // }else {
            
            Edbox.Message.Broadcast('Update', [LoadDatas]);
          // }
          dispatch({
            type: 'edit/setData',
            payload: {
              dataSource: LoadDatas,
            },
          });
        },
        err => {
          message.error(JSON.stringify(err))
        },
        null,
        true,
      );
    }else {  //图片都已获取
      const isCurrentData = initData.map(i =>
        this.currentOpenKey(i, [currentData.ID], undefined),
      );
      const hasData = isCurrentData.includes(true);
      if (!hasData) {
        this.defaultOpenKey(initData[0], [initData[0].ID], undefined);
      }
      //非个人库的编辑把Datas返回来，不要把静态数据带上
      // if(!isPersonal){
      //   Edbox.Message.Broadcast('Update', [{Datas: initData}]);
      // }else {
        Edbox.Message.Broadcast('Update', [LoadDatas]);
      // }
      
      dispatch({
        type: 'edit/setData',
        payload: {
          dataSource: LoadDatas,
        },
      });
    }
    
  }

  /**
   * 更新currentData和dataSource
   * @param {Object} guidList 获取回来的图片和音频地址
   * 
   */
  setDatasValue = (guidList = {}, initData) => {
    const result = setSourceValue(guidList, initData) || {}
    const {dataSource} = result;
    
    return dataSource.Datas;
  }


  //错误提醒
  overTime = () => {
    message.error(formatMessage({ id: 'error_address' }),0); 
  }

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


  //tab点击触发数据更新
  tabClick = (item, itemIdx, openKey) => {
    const { Datas = [], ID } = item;
    // const hasChild = Datas[0].Type === "Tab01" ;
    const hasCurrent = itemIdx === ID;
    const { dispatch, edit = {} } = this.props;
    const { navOpenKey } = edit
    if (hasCurrent) {
      const arr = [...openKey, item];
      const openMenuKeyData = arr.filter(item => item.Type === 'Tab01'); //菜单
      const openTabKeyData = arr.filter(item => item.Type === 'Tab02'); //tab
      // const openCollapseKeyData = arr.filter(item => item.Type==="Tab03" );  //collapse
      dispatch({
        type: 'edit/setTabClick',
        payload: {
          navOpenKey: navOpenKey,
          currentData: openMenuKeyData[openMenuKeyData.length - 1],
          tabActiveKey:
            openTabKeyData.length > 0
              ? openTabKeyData[0].ID
              : openMenuKeyData[openMenuKeyData.length - 1].Datas[0].ID,
          controls: undefined,
          xMax: 400
        },
      });
      return true;
    }
    if (Datas.length > 0) {
      let list = [];
      for (var i of Datas) {
        list.push(this.tabClick(i, itemIdx, [...openKey, item]));
      }
    }
    return false;
  };

  //更新当前数据
  updateCurrentData = (item, id) => {
    const { Datas = [], ID } = item;
    const { dispatch, edit = {} } = this.props;
    const { currentData } = edit;
    if (ID === id) {
      if (currentData !== item) {
        dispatch({
          type: 'edit/setCurrentData',
          payload: {
            currentData: item,
          },
        });
      }
      return true;
    }
    if (Datas.length > 0) {
      for (var i of Datas) {
        this.updateCurrentData(i, id);
      }
    }
  };

  //初始化默认menu选项
  defaultKey = (item, activeKey) => {
    let vdom = [];
    const { Datas = [] , ID, Type } = item;
    const hasChild = Datas.length> 0 && Datas[0].Type === 'Tab01';
    if (Datas.length> 0 && Datas[0].Type === 'Tab02') {
      activeKey = Datas[0].ID;
    }
    if (Type === 'Tab01') {
      vdom.push(ID);
    }
    if (hasChild && Datas[0].Type !== 'Tab02') {
      Datas.map(i => this.defaultOpenKey(i, activeKey));
    }
    return vdom;
  };

  defaultOpenKey = (item, itemIdx, activeKey) => {
    const { Datas = [], ID } = item;
    const hasChild = Datas.length > 0 && Datas[0].Type === 'Tab01';
    const { dispatch, edit = {} } = this.props;
    const { navOpenKey } = edit
    // if (Datas.length > 0 && Datas[0].Type === 'Tab02') {
    //   activeKey = Datas[0].ID;
    // }
    
    if (hasChild) {
      let list = [];
      list.push(this.defaultOpenKey(Datas[0], [...itemIdx, ID]), activeKey);
    } else {
      // console.log(item, navOpenKey, activeKey, edit)
      // const tabKey = "0-0";
      try {
        dispatch({
          type: 'edit/setCurrentOpen',
          payload: {
            currentData: item,
            navOpenKey: navOpenKey,
            tabActiveKey: activeKey,
          },
        });
      } catch (err) {
        // console.log(1552335, err)
      }
      
      return true;
    }
    
  };

  //初始化已有打开menu选项
  currentOpenKey = (item, itemIdx, activeKey) => {
    if(!itemIdx[0]) {
      return;
    }
    const { Datas =[], ID } = item;
    const hasChild = Datas.length> 0 && Datas[0].Type === 'Tab01';
    const hasCurrent = itemIdx[0] === ID;
    const { dispatch } = this.props;
    if (Datas.length> 0 && Datas[0].Type === 'Tab02') {
      activeKey = Datas[0].ID;
    }
    if (hasChild) {
      let list = [];
      for (var i of Datas) {
        list.push(this.currentOpenKey(i, [...itemIdx, ID], activeKey));
      }
    } else {
      if (hasCurrent) {
        dispatch({
          type: 'edit/setCurrentOpen',
          payload: {
            currentData: item,
            navOpenKey: itemIdx,
            tabActiveKey: activeKey,
          },
        });
        return true;
      }
    }
    return false;
  };

  //去掉空数据
  filterData = item => {
    let vdom = [];
    if (item) {
      const { Datas = [] } = item;
      if (Datas.length > 0) {
        let list = [];
        for (var i of Datas) {
          i !== undefined && list.push(this.filterData(i));
        }
        vdom.push({
          ...item,
          Datas: list,
        });
      } else {
        vdom.push(item);
      }
      return { ...vdom[0] };
    }
  };

  //处理监听数据
  dealDataSource = (item, id, data, method) => {
    let vdom = [];
    if (item.ID === id) {
      
      switch (method) {
        case 'Add':
          item.Datas.push({ ...data });
          break;
        case 'Update':
          item = { ...data };

          break;
        case 'Delete':
          item = {};
          break;
        default:
          return item;
      }
    }
    const { Datas = [] } = item;
    if (Datas.length > 0) {
      let list = [];
      for (var i of Datas) {
        list.push(this.dealDataSource(i, id, data, method));
      }
      vdom.push({
        ...item,
        Datas: list.filter(item=>item),
      });
    } else {
      if (item.ID !== undefined) {
        vdom.push(item);
      }
    }
    return vdom.length > 0 ? { ...vdom[0] } : undefined;
  };

  render() {
    const { edit, iframeHeight } = this.props;
    const { urlIframe, isLogin, currentData = {} } = edit;
    const { PageType, Property = {} } = currentData;
    const { ShowRestoreButton = false, ShowAddButton = false, ShowDeleteButton = false, ShowPageControl = false } = Property;
    const defaultShowHandler = !ShowRestoreButton && !ShowAddButton && !ShowDeleteButton && !ShowPageControl;
    const isShowHandler = (PageType === 'Default' || PageType === 'FullGame' ) && !defaultShowHandler
    if (!isLogin) {
      return null;
    }
    return (
      <iframe
        src={urlIframe}
        className={ isShowHandler || iframeHeight ? styles.iframeH : styles.iframeHA}
        frameBorder="0"
        title="edbox"
        width="100%"
        id="GameFrame"
      />
    );
  }
}

export default IframeWindow;
