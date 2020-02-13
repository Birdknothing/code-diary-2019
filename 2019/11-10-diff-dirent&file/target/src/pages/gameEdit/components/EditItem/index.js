import React, { PureComponent  } from 'react';
import { connect } from 'dva';
import { Tabs, Collapse, Empty, Icon, Modal, message, Row, Col , Input } from 'antd';
import Widgets from '@/widgetComponents/widgets';
import WidgetItem from '@/widgetComponents/widgetItem';
import styles from './index.scss';
import { getGuidData,  getActiveKey, updateSourceData, getStrLength, setSourceValue, isVaildGuid } from '@/utils/helper'
import Level from './../Level';
import { formatMessage } from 'umi/locale';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const { Edbox } = window;
@connect(({ edit, edbox, loading }) => ({
  edit,
  loading: loading,
}))
class EditItem extends PureComponent  {

  constructor(props){
    super(props)
    this.state={
      collapseActiveKey: undefined,
      showEditModel: false,
      editDatas: undefined,
      editErrorTxt: undefined
    }
  }

  componentWillMount() {
    this.getResource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { currentData = {}} = nextProps.edit;
    const { currentData: tCurrentData = {}} = this.props.edit;
    if(currentData !== tCurrentData) {
      this.getResource(nextProps);
      this.setAnimateValue(nextProps); //切页时下载帧动画数据
    }
    if(nextProps.edit.collapseKey !== this.props.edit.collapseKey) {  //快速选择展开功能

      const { collapseKey = {} } = nextProps.edit;
      const { collapseActiveKey = {} } = this.state
      let { ketPach = [], id } = collapseKey
      ketPach = ketPach.reverse();
      let changeKey = JSON.parse(JSON.stringify(collapseActiveKey));
      changeKey[id] = ketPach[0];
      if(ketPach.length > 1) {
        for(let i =0; i < ketPach.length-1; i ++ ){
          const index = ketPach[i]
          changeKey[index] = ketPach[i+1]
        }
      }
      this.setState({
        collapseActiveKey: !id ? undefined: changeKey
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.edit.collapseKey !== this.props.edit.collapseKey) {  //快速选择定位功能
      setTimeout(function(){
        const scrollDiv = document.getElementsByClassName('widgets-content')
        const scrollTo = document.getElementsByClassName('scroll-position')
        const hasScrollTab = document.getElementsByClassName('scroll-tab')
        const offsetNum = hasScrollTab.length ? 156 : 99;
        if(scrollDiv.length > 0 && scrollTo.length > 0){
          scrollDiv[0].scrollTop = scrollTo[0].offsetTop-offsetNum
        }
      }, 200)

    }
  }


  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

   /**
   * 获取GUID
   * @param {Object} item获取GUID
   */
  setAnimateValue = (nextProps) => {
    const { edit = {} } = nextProps;
    const { currentData = {}, dataSourceIndex = [], dataSource ={} } = edit;
    const { Datas = [] } = currentData;
     // eslint-disable-next-line
    const { Datas: sDatas  = [] } = dataSource;
    let GuidList = []
    for (var index = 0; index < Datas.length; index++) {
      var element = this.getAnimateGuid(Datas[index], false);
      if(element.length > 0) {
        GuidList.push(...element)
      }
    }

    //获取帧动画数据
    if(GuidList.length) {
      GuidList.map((item) => {
        Edbox.FrameAnimation.Get(item.GUID, function(data){
          const updateIndex = dataSourceIndex[item.ID].index;
           // eslint-disable-next-line
          let updateDatas = eval('sDatas'+ updateIndex);
          updateDatas.Value = data
          Edbox.Message.Broadcast('Update', [updateDatas]);
        },function(err){
            console.log(err);
        });
        return null;
      })
      
    }
  }

    /**
   * 获取帧动画GUID
   * @param {Object} item获取GUID
   */
  getAnimateGuid = (item, GetAll) => {
    let vdom = []
    let { Datas=[], GUID, Type, Value, ID  } = item;
    const hasChild = Datas.length > 0 ;
    if(!!GUID) {
      if(Type === "Animation01") {
        if(isVaildGuid(GUID) && ( !Value || Value.length < 1)){
          vdom.push({GUID: GUID, ID: ID});
        }
      }
      
    }
    if(hasChild) {
      let list = []
      for (var i of Datas) {
        if(!!i) {
          list.push(...this.getAnimateGuid(i, GetAll));
        }
      }
      vdom = [...vdom, ...list];
    }
    return vdom;
  }

  /**
   * 批量获取图片
   */
  getResource=(nextProps)=> {
    const { edit = {} } = nextProps;
    const { currentData = {} } = edit;
    const { Datas = [] } = currentData;
    let GuidList = []
    for (var index = 0; index < Datas.length; index++) {
      var element = getGuidData(Datas[index], false);
      if(element.length > 0) {
        GuidList.push(...element)
      }
    }
    //批量获取图片
    if(GuidList.length) {
      Edbox.NDR.GetList(
        [...new Set(GuidList)],
        data => {
          this.setDatasValue(data);
        },
        err => {
        },
        null,
        true,
      );
    }
  }

  /**
   * 更新currentData和dataSource
   * @param {Object} guidList 获取回来的图片和音频地址
   *
   */
  setDatasValue = (guidList = {}) => {
    const { edit = {}, dispatch } = this.props;
    let { currentData = {}, dataSource = {} } = edit;
    const result = setSourceValue(guidList, dataSource, currentData) || {}
    const { currentData: rCurrentData, dataSource: rDataSource} = result;
    Edbox.Message.Broadcast('Update', [rCurrentData]);
    dispatch({
      type: 'edit/updateValue',
      payload: {
        currentData: rCurrentData,
        dataSource: rDataSource
      },
    });
  }



  /**
   * 管理删除
   * @param {object} item 当前数据
   */
  genExtra = (item = {}, pid, ClassType, Editable, management) => {
    return <div>
      { Editable ? management ?
        <Icon
          type="minus-circle"
          theme="filled"
          className={styles.deleteIcon}
          title={formatMessage({id: 'delete'})}
          onClick={event => {
            event.stopPropagation();
            const { dispatch } = this.props;
            dispatch({
              type: 'edit/setDeleteModelData',
              payload: {
                deleteModelData: {
                  deleteModelVisible: true,
                  deleteData: item,
                  pid: pid
                }
              }
            });
          }}
        />
        :null : null
      }
      { ClassType === "ResouceManage" && Editable
        ?<Icon type="form" onClick={event => {
          event.stopPropagation();
          this.setState({
            showEditModel: true,
            editDatas: item
          })
        }}
         />
        :null
      }
    </div>
  }

  /**
   * 渲染控件
   * @param {object} item 当前数据
   * @param {boolean} Editable 是否可管理数据
   * @param {string} pid 父id
   */
  renderWidgets = ( item = {}, tabEditable, pid, ClassType ) => {
    if( !item.ID ) {
      return;
    }
    let vdom = [];
    const { edit = {} } = this.props;
    const { management, collapseKey = {} } = edit;  //管理删除
    let { Datas = [], ID, Type, ShowName, Editable, EditableContent, ShowName_Override  } = item;
    const hasChild = Type === "Tab03" ;
    const { ketPach = [] } = collapseKey
    const ketPachLastId = ketPach.length ? ketPach[ketPach.length-1] : null
    const hasMoreLevel = Datas.length ? Datas[0].Type === "Tab03" : false;
    ShowName = !!ShowName_Override ? ShowName_Override : ShowName; //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值
    if (hasChild) { //判断是否tab03
        if(hasMoreLevel) { //判断是否有多级tab03
          let Level = [];
          const { collapseActiveKey = {} } = this.state;
          const activeKey = collapseActiveKey[ID]? collapseActiveKey[ID] : tabEditable ? Datas.length && Datas[0].ID : getActiveKey(Datas);
          for (let i of Datas) {
            Level.push(this.renderWidgets(i, Editable, ID, ClassType));
          }
          vdom.push(
            <Panel header={EditableContent ? EditableContent : ShowName} key={ID} panelData={item} extra={ this.genExtra(item, pid, ClassType, Editable, management)} className = {`${ketPachLastId === ID ? "scroll-position": ""} ${ClassType === "ResouceManage" ? "" : "only-delete"} `}>
              <Collapse bordered={false}  className="collapse-con" activeKey={activeKey} onChange={(i)=>this.onChangeCollapse(i, ID)} accordion={ tabEditable ? true: false}>
                {Level}
              </Collapse>
            </Panel>
          );

        }else {
          let list = [];
          for (let i of Datas) {
              list.push(this.renderWidgets(i, Editable, ID, ClassType));
          }
          vdom.push(
            <Panel 
              header={EditableContent ? EditableContent : ShowName} 
              key={ID} 
              panelData={item} 
              extra={this.genExtra(item, pid, ClassType, Editable, management)} 
              className = {`${ketPachLastId === ID ? "scroll-position": ""} ${ClassType === "ResouceManage" ? "" : "only-delete"} `}
            >
              {list}
            </Panel>
          );
        }
    } else {
        if (!Widgets[item.Type]) {
          return;
        }
        vdom.push(
          <WidgetItem key={`widget_item_${ID}`} data={item} />
        );
    }
    return vdom;
  }

  /**
   * tab渲染
   * @param {object} item tab数据
   * @param {num} itemIdx 当前数据条数
   */
  renderTab = (item, itemIdx) => {
    let vdom = [];
    const { edit } = this.props;
    let { Type, ID, Datas=[], ShowName, Editable, IsLevelEdit, Class = "Default", ShowName_Override } = item;
    let { PageType} = item;
    const hasChild = Type === 'Tab02';
    const { collapseActiveKey = {} } = this.state;
    const activeKey = collapseActiveKey[ID]  //collapseActiveKey为操作过的key, getActiveKeyw为默认key
                      ? collapseActiveKey[ID] 
                      : Editable 
                        ? Datas.length && Datas[0].ID 
                        : getActiveKey(Datas); 

    const { tabActiveKey } = edit;
    ShowName = !!ShowName_Override ? ShowName_Override : ShowName; //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值
    //兼容v0.1数据配置
    if(IsLevelEdit) {
      PageType = "Default"
    }else if( IsLevelEdit === false) {
      PageType = "FullPage"
    }
    const showLevel =  Editable && PageType === "FullPage" && (Class === "Default" || Class === "LevelEdit" || Class === "ResouceManage") //是否显示非可视化编辑
    if (hasChild) {
      vdom.push(
        <TabPane tab={ShowName} key={ID}>
          { showLevel 
            ? <Level  
                levelDatas={Datas} 
                levelId = {ID} 
                ClassData = {Class} 
              /> 
            : null
          }
          { tabActiveKey === ID && Datas.length > 0 
            ? <div className={`widgets-content ${(Editable && PageType === "FullPage") ? "Editable-widgets-content" : ""}` }>
                <Collapse 
                  bordered={false} 
                  activeKey={activeKey}  
                  className="collapse-con" 
                  onChange={(i)=>this.onChangeCollapse(i, ID)} 
                  accordion={ Editable ? true: false}
                >
                  {Datas.map((item)=>this.renderWidgets(item,Editable, ID, Class ))}
                </Collapse>
              </div>
            : null
          }
        </TabPane>,
      );
    }
    return vdom;
  };
 
  //切换Collapse时调用
  onChangeCollapse = (activeKey, id ) => {
    const { collapseActiveKey ={} } = this.state
    const { edit, dispatch } = this.props;
    const { currentData={}  } = edit;
    const { Class } = currentData;
    const isA = Array.isArray(activeKey)
    const collapseItemd = this.getCurrentCollapseData(currentData, isA ? activeKey : activeKey ? [activeKey]: undefined, []);
    let changeKey = JSON.parse(JSON.stringify(collapseActiveKey));
    changeKey[id] = activeKey ? activeKey : [];
    this.setState({
      collapseActiveKey : changeKey
    })
    const { Datas = [] } = collapseItemd.length ? collapseItemd[0] : {};
    
    if (Class === "Ranking" && Datas.length > 0 && Datas[0].Type === "Tab03" ) {
      dispatch({
        type: 'edit/setCollapseDeleteData',
        payload: {
          collapseDeleteData: collapseItemd,
        },
      });
    }
    Edbox.Message.Broadcast("TabClick", collapseItemd);
  }

  //切换tab是调用
  onChangeTab = (activeKey, item ) => {
    const { edit, dispatch } = this.props;
    const { dataSourceIndex = {}, dataSource = {}  } = edit;
    const tabIndex = dataSourceIndex[activeKey];
    if(!!tabIndex) {
      // eslint-disable-next-line
      const { Datas:SDatas = [] } = dataSource;
      // eslint-disable-next-line
      const tabData = eval('SDatas'+ tabIndex.index) || {};
      dispatch({
        type: 'edit/setTabActiveKey',
        payload: {
          tabActiveKey: activeKey,
          controls: undefined,
          management: false,
          xMax: 400,
          managementTxt: formatMessage({id: 'manage'})
        }
      });
      Edbox.Message.Broadcast("TabClick", [tabData]);
    }
  }

  /**
   * 获取点击手风琴时的数据
   */
  getCurrentCollapseData = (item, activeKey=[], vdom) => {
    const { Datas=[], ID } = item;
    const hasChild = Datas.length > 0 ;
    if(!activeKey.length){
      return []
    }

    if(hasChild) {
      let list = []
      for (var i of Datas) {
        if(!!i) {
          list.push(...this.getCurrentCollapseData(i, activeKey, vdom));
        }
      }
      if(activeKey.length > 1 ? activeKey.includes(ID) : activeKey[0] === ID) {

        vdom = [...vdom, item];
      }else{
        vdom = [...vdom, ...list];
      }

    }else {
      if(activeKey.length > 1 ? activeKey.includes(ID) : activeKey[0] === ID) {

        vdom = [...vdom, item];
      }
    }
    return vdom;
  }

  /**
   * 关闭删除弹窗
   */
  hideNameModal = () => {
    const { dispatch, } = this.props;
    dispatch({
      type: 'edit/setDeleteModelData',
      payload: {
        deleteModelData: {
          deleteModelVisible: false,
          deleteData: undefined,
          pid:undefined
        }
      }
    });
  }

  /**
   * 确认删除
   */
  deleteModelClick = () => {
    const { edit, dispatch } = this.props;
    const { currentData = {}, dataSource = {}, deleteModelData= {}, dataSourceIndex= {}, activeLevelDatas = {}, collapseKey, tabActiveKey } = edit;
    const { deleteData = {}, pid } = deleteModelData;
    const { activeLevelId } = activeLevelDatas;
    let isActiveD;
    const deleteIndexp = dataSourceIndex[pid];
    const deleteIndex = dataSourceIndex[deleteData.ID];
    const activeIndex = !activeLevelId ? {} :  dataSourceIndex[activeLevelId];
    let { Datas: cDatas = [], Class, MinCount = 0 } = currentData;
    let tabCurrent
    const { Datas = [] } = dataSource;
    const newSourceD = JSON.parse(JSON.stringify(Datas));
    //当前无数据时直接返回
    if(!cDatas.length) return;

    //没有找到要删除的数据时直接返回
    if(!deleteIndexp && !deleteIndex) return;

      //判断是否tab02
    if( cDatas.length && cDatas[0].Type === "Tab02" ) {
      
      // eslint-disable-next-line
      tabCurrent = eval('newSourceD'+ dataSourceIndex[tabActiveKey].index);
      if(tabCurrent && tabCurrent.Class === "ResouceManage") {
        Class = tabCurrent.Class;
        MinCount = tabCurrent.MinCount;
        cDatas = tabCurrent.Datas || [];
      }
      
    }else {
      tabCurrent = currentData;
    }

    //判断是否操作关卡最小数
    if(Class === "ResouceManage" || Class === "LevelEdit" ) {
      if(cDatas.length <= MinCount ) {
        message.error(formatMessage({ id: 'min_count' })+ MinCount); 
        return;
      }
    }

    // eslint-disable-next-line
    let newData = eval('newSourceD'+ deleteIndexp.index);
    // eslint-disable-next-line
    let deleteDataS = eval('newSourceD'+ deleteIndex.index); 

    // 判断是否有选中数据被删除
    if(!!activeLevelId){
      // eslint-disable-next-line
      let activeData = eval('newSourceD'+ activeIndex.index);
      let { Datas: dDatas = []} = deleteDataS;
      const activeDIndex = dDatas.indexOf(activeData) //是否有选中数据的索引
      isActiveD = activeLevelId === deleteData.ID ? true :  activeDIndex > -1 ? true: false;
    }else {
      isActiveD = false
    }

    let { Datas: nDatas = []} = newData;
    const index = nDatas.indexOf(deleteDataS) //找出删除数据的索引
    nDatas.splice(index, 1) //删除数据
    const activeLD = index === 0 ? nDatas[index] || {} :nDatas[index-1] || {}; // 删除后选中
    const { Datas: activeLDatas =[]} = activeLD
    const hasChildL =  activeLDatas.length ? activeLDatas[0].Type === "Tab03" : false;
    // eslint-disable-next-line
    const newCurrentData = eval('newSourceD'+ dataSourceIndex[currentData.ID].index); //更新当前数据

    this.dealDatas({Datas:newSourceD})
    dispatch({
      type: 'edit/setDeleteData',
      payload: {
        dataSource: {
          ...dataSource,
          Datas:newSourceD
        },
        currentData: newCurrentData,
        deleteModelData: {
          deleteModelVisible: false,
          deleteData: undefined,
          pid: pid
        },
        activeLevelDatas:  isActiveD ? {
          pid: hasChildL ? activeLD.ID :  pid ===  currentData.ID ? activeLD.ID : pid , //是否显示删除等操作
          activeLevelId: hasChildL ? activeLDatas[0].ID : activeLD.ID,
          changeNum:  hasChildL ? 1 : index === 0 ? 1 : index,
          Editable: hasChildL ? activeLDatas[0].ID : activeLD.Editable,
          CanRestore: hasChildL ? activeLDatas[0].ID : activeLD.CanRestore,
        } : activeLevelDatas,
        collapseKey:  isActiveD ? {
          id: hasChildL ? activeLD.ID :  pid,
          ketPach: hasChildL ? [activeLDatas[0].ID, activeLD.ID, pid] : [activeLD.ID, pid]
        } : collapseKey,
      },
    });
    // {
    //   id:  pid,
    //   ketPach: [hasChildL ? activeLDatas[0].ID : activeLD.ID, hasChildL ? activeLD.ID :  pid ===  currentData.ID ? activeLD.ID : pid]
    // }
    const {Datas: newCDatas = []} = newCurrentData;
    if(nDatas.length === 0 && newCDatas.length !== 0 ) {  //把子关卡全部都删除时执行
      if( newCDatas[0].Type === "Tab03") {
        dispatch({
          type: 'edit/setDeleteModelData',
          payload: {
            deleteModelData: {
              deleteModelVisible: false,
              deleteData: newData,
              pid: currentData.ID
            }
          }
        });
        setTimeout(()=>{this.deleteModelClick()}, 10)
        return;
      }
    }
    // 如果删除选中广播上一条tab选中
    if(isActiveD){
      const tabClickId = hasChildL ? activeLDatas[0].ID : activeLD.ID
      const tabClickIndex = dataSourceIndex[tabClickId].index;
      // eslint-disable-next-line
      const tabClickData = eval('newSourceD'+ tabClickIndex);
      Edbox.Message.Broadcast("TabClick",[tabClickData]);
    } 
    //广播Delete消息
    Edbox.Message.Broadcast("Delete",[deleteData]);

    //删除成功
    message.success(formatMessage({id: 'delete_success'}));

    //内嵌页面时删除操作
    if (Class === "Ranking") {
      dispatch({
        type: 'edit/setCollapseDeleteData',
        payload: {
          collapseDeleteData: [activeLD],
        },
      });
      Edbox.Message.Broadcast("TabClick",[activeLD]);
    }
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

  //隐藏编辑弹窗
  hideEditModal = e => {
    this.setState({
      showEditModel: false,
      editErrorTxt: ""
    });
  }

  //编辑名称
  editNameChange = e => {
    let { value } = e.target;
    const { editDatas } = this.state;
    value = getStrLength(value, 30);
    this.setState({
      editDatas: {
        ...editDatas,
        EditableContent: value
      },
      editErrorTxt: ""
    })
  }

  editClick = e => {
    const { editDatas } = this.state;
    const value = getStrLength(editDatas.EditableContent, 30)
    const sensitiveText = formatMessage({ id: 'sensitive_text' });
    const parentThis = this
    const { edit, dispatch } = this.props;
    const { currentData, dataSource, dataSourceIndex = {} } = edit;
    const { Datas = [] } = dataSource;
    
    if(value.length > 0) {
      Edbox.Editor.IsSensitive(
        value,
        flag => {
          if (flag.is_sensitive) {
            parentThis.setState({
              editErrorTxt: sensitiveText
            })
          }else {
            parentThis.setState({
              showEditModel: false,
              editErrorTxt: ""
            });
            const newData =  updateSourceData(dataSourceIndex, editDatas.ID, currentData.ID, Datas, editDatas);
            dispatch({
              type: 'edit/updateData',
              payload: {
                dataSource: {
                  ...dataSource,
                  Datas: newData.data
                },
                currentData: newData.newCurrentData
              },
            });
            Edbox.Message.Broadcast("Update",[editDatas]);
            message.success(formatMessage({id: 'edit_success'}));
          }
        }
      )
    }else {
      parentThis.setState({
        editErrorTxt: formatMessage({ id: 'required_text' })
      })
    }
  }

  render() {
    const { edit } = this.props;
    const { currentData = {}, tabActiveKey, deleteModelData = {}, management} = edit;
    const { Datas = [], Editable = false, ID, IsLevelEdit, Class = "Default" } = currentData;
    let { PageType} = currentData;
    const { collapseActiveKey = {}, showEditModel, editDatas = {}, editErrorTxt } = this.state;
    const { deleteModelVisible, deleteData={}, numName } = deleteModelData;
    let { ShowName, EditableContent, ShowName_Override } = deleteData;
    let { ShowName : eShowName, EditableContent:eEditableContent , ShowName_Override: eShowName_Override} = editDatas
    const activeKey = collapseActiveKey[ID]? collapseActiveKey[ID] : Editable ? Datas.length && Datas[0].ID : getActiveKey(Datas);
    //兼容v0.1数据配置
    if(IsLevelEdit) {
      PageType = "Default"
    }else if( IsLevelEdit === false) {
      PageType = "FullPage"
    }

    const showLevel =  Editable && PageType === "FullPage" && (Class === "Default" || Class === "LevelEdit" || Class === "ResouceManage") //是否显示非可视化编辑
    let showLevelNav //是否显示可视化编辑
    const hasTab = Datas.length? Datas[0].Type === "Tab02": false ;
    ShowName = !!ShowName_Override ? ShowName_Override : ShowName; //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值
    eShowName = !!eShowName_Override ? eShowName_Override : eShowName; //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值

    if (!hasTab) {
      showLevelNav = Editable && PageType === "Default" && (Class === "Default" || Class === "LevelEdit" || Class === "ResouceManage")
    }else {
      showLevelNav = false
    }
    return (
      <div  className={`${styles.editItem} ${showLevelNav ? "view-edit": ""} ${management ? "management-icon" : ""} `} >
        {
          Datas.length > 0
            ?Datas[0].Type === 'Tab02'
              ? <Tabs
                  activeKey={tabActiveKey}
                  className="widgets-container scroll-tab"
                  onChange={this.onChangeTab}
                  // animated={false}
                >
                {Datas.map((item, index) => this.renderTab(item, index, showLevel))}
              </Tabs>
              : <div  className="widgets-container boxShadow widgets-scroll" >
                    {showLevel ? <Level levelDatas={Datas} levelId = {ID} ClassData = {Class} /> : null}
                    <div className={`widgets-content ${(Editable && PageType === "FullPage") ? "Editable-widgets-content" : ""}` }>

                      <Collapse bordered={false} activeKey={activeKey?activeKey:[]}  className="collapse-con" onChange={(i)=>this.onChangeCollapse(i, ID)} accordion={ Editable ? true: false}>
                        {Datas.map((item)=>this.renderWidgets(item, Editable, ID, Class))}
                      </Collapse>
                    </div>
                  </div>

            : <div>
              { showLevel ? <Level  levelDatas={Datas} levelId = {ID} ClassData = {Class} /> : null}
              <Empty className={styles.empty} />
            </div>

        }
        <Modal
          title={formatMessage({id: 'tips'})}
          centered
          visible = {deleteModelVisible}
          onOk={this.deleteModelClick}
          onCancel={this.hideNameModal}
          okText={formatMessage({id: 'model_sure'})}
          cancelText={formatMessage({id: 'model_cancel'})}
          className='model_style'
          width={286}
        >
        
          <p>{formatMessage({id: 'confirm_deletion'})}“{numName === undefined ? (EditableContent ? EditableContent : ShowName) : numName}”？</p>
        </Modal>

        {/* 重命名tab03 */}
        {
          showEditModel
          ? <Modal
              title={formatMessage({id: 'edit'})}
              visible={showEditModel}
              onOk={this.editClick}
              onCancel={this.hideEditModal}
              okText={formatMessage({id: 'model_save'})}
              cancelText={formatMessage({id: 'model_cancel'})}
              centered
              className='model_style'
              width= {400}
            >
              <Row >
                <Col span={3}>
                  <p className={styles.gameName} >{formatMessage({id: 'edit_name'})}</p>
                </Col>
                <Col span={21}>
                  <Input  value={eEditableContent !== undefined ? eEditableContent.substring(0, 30) : eShowName.substring(0, 30)} onChange={this.editNameChange} />
                  { editErrorTxt 
                    ? <span className={styles.errorText}>{editErrorTxt}</span>
                    : <span className={styles.msgTxt}>{formatMessage({id: 'msg_edit'})}</span>
                  }
                </Col>
              </Row>
            </Modal>
          : null
        }
      </div>
    );
  }
}

export default EditItem;
