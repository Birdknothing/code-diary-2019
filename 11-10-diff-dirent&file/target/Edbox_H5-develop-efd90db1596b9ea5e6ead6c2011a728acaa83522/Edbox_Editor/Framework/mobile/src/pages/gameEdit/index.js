import React, { Component } from 'react'
import styles from './index.less'
import { connect } from 'dva'
import Menu from './components/Menu'
import Header from './components/Header'
import EditItem from './components/EditItem'
import Operation from './components/Operation'
import { ServerKey } from '@/utils/common'
import { ActivityIndicator, Toast } from 'antd-mobile';
import { formatMessage } from 'umi/locale';

const { Edbox } = window;
Edbox.ServerKey = ServerKey;

@connect(({ edit }) => ({
  edit: edit
}))
class Layout extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    
    Edbox.HideLogin();
    Edbox.Start(isLogin=>{
      const url = Edbox.GetQueryString("Page");
      const pageurl = Edbox.SetQueryString("EdboxArgs", Edbox.GetLoginInfo(), url)+'&d=1';
      dispatch({
        type: 'edit/setLogin',
        payload: {
          isLogin: true,
          urlIframe: !!url ? pageurl : undefined
        }
      })
    })
    this.messageHandler();
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
    if (!isLogin) {
      return;
    }
    let messageCom = null;
    const iframe = document.getElementById('GameFrame');
    
    iframe.onload = () => {
      const windowIframe = iframe.contentWindow;
      Edbox.Message.Get(windowIframe, function(com) {
        com.Stop();
      });

      Edbox.Message.Get(windowIframe, function(com) {
        com.Start();
        messageCom = com;
      })

      Edbox.Message.AddMessageHandler('Disconnect', function(datas, com) {
        if (messageCom === com) {
          Toast.fail(formatMessage({id: 'tip_msg'}), 1);
        }
      });

      //初始化
      Edbox.Message.AddMessageHandler('Init', function(datas, com) {
        if (messageCom === com) {
          const initData = datas[0].Datas;
          const { edit } = messageThis.props;
          const { currentData = {} } = edit;
          let recommendIds = []
          try {
            Edbox.Editor.LoadDatas(datas[0]); // 读取Package数据包的数据到Datas对象中
          } catch (e) {
            Toast.fail(e.message, 1);
          }
          const isCurrentData = initData.map(i =>
            messageThis.currentOpenKey(i, [currentData.ID], undefined),
          );
          const hasData = isCurrentData.includes(true);
          if (!hasData) {
            // const ddd= initData.map((item, i) =>messageThis.defaultKey(item, undefined));
            messageThis.defaultOpenKey(initData[0], [initData[0].ID], undefined);
          }
          
          initData.map((item) => {  //取得全部推荐的ID
            const itemID = messageThis.recommendDatas(item);
            recommendIds.push(...itemID);
            return itemID;
          });
          
          dispatch({
            type: 'edit/setPercentRecommend',
            payload: {
              percentRecommend: recommendIds,
              dataSource: datas[0],
            }
          })
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
          let data = dealData.map(i => messageThis.dealDataSource(i, datas[0].ID, datas[1], 'Add'));
          if (type !== 'StaticData') {
            data.map(i => messageThis.updateCurrentData(i, currentData.ID));
          }
          data = type === 'StaticData' ? { StaticData: data } : { Datas: data };
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
        if (messageCom === com) {
          const { edit } = messageThis.props;
          const { dataSource = {}, currentData = {} } = edit;
          const { Datas = [], StaticData = [] } = dataSource;
          const type = datas[0].Type;
          const dealData = type === 'StaticData' ? StaticData : Datas;
          let data = dealData.map(i =>
            messageThis.dealDataSource(i, datas[0].ID, datas[0], 'Update'),
          );

          if (type !== 'StaticData') {
            data.some(i => messageThis.updateCurrentData(i, currentData.ID));
          }
          data = type === 'StaticData' ? { StaticData: data } : { Datas: data };

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

      //删除
      Edbox.Message.AddMessageHandler('Delete', function(datas, com) {
        if (messageCom === com) {
          const { edit, dispatch } = messageThis.props;
          const { dataSource = {}, currentData = {} } = edit;
          const { Datas = [], StaticData = [] } = dataSource;
          const type = datas[0].Type;
          const dealData = type === 'StaticData' ? StaticData : Datas;
          const data = dealData.map(i =>
            messageThis.dealDataSource(i, datas[0].ID, datas[1], 'Delete'),
          );
          let deData = [];

          for (let i = 0; i < data.length; i++) {
            data[i] !== undefined && deData.push(messageThis.filterData(data[i]));
          }

          if (type !== 'StaticData') {
            deData.map(i => messageThis.updateCurrentData(i, currentData.ID));
          }

          deData = type === 'StaticData' ? { StaticData: deData } : { Datas: deData };
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

      //监听游戏点击事件
      Edbox.Message.AddMessageHandler("ObjectClick", function (datas, com) {
        if( messageCom === com ) {
          dispatch({
            type: 'edit/setCurrentEditData',
            payload: {
              currentEditData: datas[0]
            }
          });
        }
      });
    };
  };

  //所有推荐ID
  recommendDatas = (item) => {
    let vdom = [];
    const { Datas, ID , Recommend } = item;
    const hasChild = Datas[0].Type === "Tab01";
    if( Recommend && !hasChild ) {
      vdom.push(ID);
    }
    if (hasChild) {
      let recommendD
      for (var i of Datas) {
         recommendD =  this.recommendDatas(i);
         vdom.push(...recommendD);
      }
    }
    return vdom;
  }

  //初始化已有打开menu选项
  currentOpenKey = (item, itemIdx, activeKey) => {
    const { Datas, ID } = item;
    const hasChild = !!Datas[0] && Datas[0].Type === 'Tab01';
    const hasCurrent = itemIdx[0] === ID;
    const { dispatch } = this.props;
    if (!!Datas[0] && Datas[0].Type === 'Tab02') {
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

  //初始化默认menu选项
  defaultOpenKey = (item, itemIdx, activeKey) => {
    const { Datas, ID } = item;
    const hasChild = !!Datas[0] && Datas[0].Type === 'Tab01';
    const { dispatch } = this.props;
    if (!!Datas[0] && Datas[0].Type === 'Tab02') {
      activeKey = Datas[0].ID;
    }
    if (hasChild) {
      let list = [];
      list.push(this.defaultOpenKey(Datas[0], [...itemIdx, ID]), activeKey);
    } else {
      dispatch({
        type: 'edit/setCurrentOpen',
        payload: {
          currentData: item,
          navOpenKey: itemIdx,
          tabActiveKey: activeKey,
        },
      });
    }
  };


  //更新当前数据
  updateCurrentData = (item, id) => {
    const { Datas = [], ID } = item;
    const { dispatch, edit = {} } = this.props;
    const { currentData } = edit;
    if (ID === id) {
      if (currentData !== item) {
        dispatch({
          type: 'edit/setNextData',
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
        Datas: list,
      });
    } else {
      if (item.ID !== undefined) {
        vdom.push(item);
      }
    }
    return vdom.length > 0 ? { ...vdom[0] } : undefined;
  };

  render() {
    const { edit } = this.props;
    const { isLogin, currentData = {} } = edit;
    if (!isLogin) {
      return null;
    }
    return (
      <div className={styles.main}>
        { !currentData.ID ? 
          <div className={styles.activityIndicator}>
            <ActivityIndicator animating={true} />
          </div>
        : null}
        <Header />
        <EditItem />
        <Menu />
        <Operation />
      </div>
    )
  }
}

export default Layout
