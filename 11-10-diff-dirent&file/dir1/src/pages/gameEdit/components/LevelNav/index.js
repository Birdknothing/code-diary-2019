import React, { Component } from 'react';
import { connect } from 'dva';
import { getActiveKey, reName, updateID, isVaildGuid } from '@/utils/helper'
import styles from './index.scss';
import Iconfont from '@/components/Iconfont';
import { Collapse, Icon, message } from 'antd';
import defaultBg from '@/assets/bg_img.png';
import { formatMessage } from 'umi/locale';

const { Panel } = Collapse;

const { Edbox } = window;
@connect(({ edit, loading }) => ({
  edit,
  loading: loading,
}))
class LevelNav extends Component {

  constructor(props) {
    super(props)
    this.state={
      activeCollapseKey: undefined
    }
  }

  componentWillMount() {
    this.getResource(this.props);
  }
  

  componentWillReceiveProps(nextProps) {
    
    const {currentData = {}, tabActiveKey} = nextProps.edit;
    const {currentData: currentDataO = {}, tabActiveKey:tabActiveKeyO} = this.props.edit;
    //重置activeLevelId
    if(currentData.ID !== currentDataO.ID || tabActiveKey !== tabActiveKeyO) {
      const { dispatch } = this.props;
      dispatch({
        type: 'edit/setActiveLevelDatas',
        payload: {
          activeLevelDatas: undefined,
          controls:undefined,
          xMax: 400,
        },
      });
    }

    if(nextProps.edit.currentData !== this.props.edit.currentData) {
      this.getResource(nextProps);
    }
  }

  componentDidUpdate(prevProps, prevState) {  //添加时定位到相应关卡
    const { edit = {} } = prevProps;
    const { edit: thisEdit  = {} } = this.props;
    const { activeLevelDatas  = {}, currentData } = edit;
    const { activeLevelDatas: thisActiveLevelDatas  = {}, currentData: thisCurrentData } = thisEdit;
    const { activeLevelId } = activeLevelDatas;
    const { activeLevelId: thisActiveLevelId } = thisActiveLevelDatas;
    if(activeLevelId !== thisActiveLevelId && currentData !== thisCurrentData ) {
      const navCollapse = document.getElementsByClassName("level-active")[0]
      const levelNav = document.getElementsByClassName("level-nav")[0]
      navCollapse && levelNav && setTimeout(function(){levelNav.scrollTop = (navCollapse.offsetTop * 1 -  120)}, 100)
    }
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
      var element = this.getGuidData(Datas[index], false);
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
   * 获取GUID
   * @param {Object} item获取GUID
   */
  getGuidData = (item) => {
    let vdom = []
    let { Datas=[], LevelPreviewGUID, Type } = item;
    const hasChild = Datas.length ? true : false ;
    if(!!LevelPreviewGUID && Type === "Tab03") {
      
      if(isVaildGuid(LevelPreviewGUID)){
        vdom.push(LevelPreviewGUID);
      }
    }
    if(hasChild) {
      let list = []
      
      for (var i of Datas) {
        if(!!i) {
          list.push(...this.getGuidData(i));
        }
      }
      vdom = [...vdom, ...list];
    }
    return vdom;
  }

   /**
   * 更新currentData和dataSource
   * @param {Object} guidList 获取回来的图片和音频地址
   * 
   */
  setDatasValue = (guidList = {}) => {
    const { edit = {}, dispatch } = this.props;
    let { currentData = {}, dataSource = {} } = edit;
    const updateLoop = (oldData = []) => {
      return oldData.map(item => {
        let { LevelPreviewGUID, Datas = [], Type } = item;
        if(Type === "Tab03") {
          if (!!LevelPreviewGUID) {
            item.LevelPreview = !guidList[LevelPreviewGUID] ? '' : guidList[LevelPreviewGUID].Url
          }
        }
        if (Datas.length) {
          item.Datas = updateLoop(item.Datas);
        }
        return item;
      });
    };
    const computeData = updateLoop(currentData.Datas);
    const computeDataSource = updateLoop(dataSource.Datas);
    currentData.Datas = computeData;
    dataSource.Datas = computeDataSource;
    dispatch({
      type: 'edit/updateValue',
      payload: {
        currentData: currentData,
        dataSource: dataSource
      },
    });
  }
  

  //关卡子关卡渲染判断
  renderLevel = (item = {}, lNum, parentID) => {
    let { Datas = [], Editable, ShowName, ShowName_Override} = item;
    const hasLevel = Datas.length ? Datas[0].Type === "Tab03" : false;
    const { edit = {} } = this.props;
    const { activeLevelDatas = {} } = edit;
    const { activeLevelId } = activeLevelDatas;
    const isActive = !activeLevelId ?  lNum === 0 ? true : false : activeLevelId === item.ID ? true: false;
    ShowName = !!ShowName_Override ? ShowName_Override : ShowName; //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值

    return  <Panel header={<span title={ShowName}>{ShowName}</span>} key={item.ID} className={ ` ${  hasLevel ? styles.hidden_delete :  ` hidden-header  `}  ` } extra = { Editable 
      ? <Iconfont className={styles['icon-handler']} type="icon-trash" onClick={(e)=> {this.deleteLevel(lNum, parentID, item)}}  /> 
      : null } >
      { hasLevel
        ?<div  > 
          
            {Datas.map((items, num)=>{
              const isActive = !activeLevelId ? num === 0 && lNum === 0 ? true : false : activeLevelId === items.ID ? true: false;
              return <div className={`${styles.row_item} ${isActive ? `level-active ${styles.active}` : ""}`} key={items.ID}>
                <span className={styles.name}>{num+1}</span>
                <span className={styles.img_item } style={{ backgroundImage: `url("${defaultBg}")` }} onClick = {()=>this.clickLevel(items, item.ID, num)}><img src={items.LevelPreview} alt="" /></span>
              </div>
            })}
          </div>
        : <div className={styles.oneLevel}>
            <div className={`${styles.header} ${isActive ? "level-active" : ""}`}>
              <p className={styles.level_name}>{ShowName} </p>
              {Editable ? <Iconfont className={styles['icon-handler']} type="icon-trash" onClick={(e)=> {this.deleteLevel(lNum, parentID, item)}}  /> : null }
            </div>
            <div>
              <span className={`${styles.img_item} ${isActive ? styles.active : ""}`} style={{ backgroundImage: `url("${defaultBg}")` }} onClick = {()=>this.clickLevel(item, item.ID, lNum)}><img src={item.LevelPreview} alt="" /></span>
            </div>
          </div>
        }
      </Panel>
  }

  //有tab02时关卡渲染判断
  renderTab = (item = []) => {
    
    const { edit } = this.props;
    const { activeCollapseKey } = this.state;
    const { tabActiveKey} = edit;
    const {ID, Datas = []} = item;
        
    if(ID === tabActiveKey ) {
      const activeKey =  activeCollapseKey ? activeCollapseKey : getActiveKey(Datas);
      return <Collapse 
                bordered={false}
                activeKey={activeKey?activeKey:[]}
                expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                key={ID}
                onChange={this.collapseChange}
                className="nav-collapse"
              >
                {Datas.map((item, i)=>this.renderLevel(item, i, ID))}
            </Collapse>
    }else {
      return null
    }
  }

  //点击关卡 
  clickLevel = (item = {}, pid, num) => {
    // this.setState({
    //   activeLevelId:"55222"
    // })
    //判断是否显示可视化关卡编辑
    const { edit =　{} } = this.props;
    const { currentData = {},  dataSourceIndex = {}, dataSource = {}, tabActiveKey } = edit;
    const { Datas= [], ID  } = currentData;
    let showPId
    const hasTab = Datas.length? Datas[0].Type === "Tab02": false ;
    if (hasTab) {
      const tabIndex = dataSourceIndex[tabActiveKey];
      if(!!tabIndex) {
        // eslint-disable-next-line
        const { Datas:SDatas = [] } = dataSource;
        // eslint-disable-next-line
        const tabData = eval('SDatas'+ tabIndex.index) || {};
        const { ID } = tabData;
        showPId = ID
      }else {
        showPId = ID
      }
    }else {
      showPId = ID
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/setActiveLevelDatas',
      payload: {
        activeLevelDatas: {
          pid: pid,
          activeLevelId: item.ID,
          changeNum: num +1,
          Editable: item.Editable,
          CanRestore: item.CanRestore,
        },
        collapseKey: {
          id: showPId,
          ketPach: [item.ID, pid]
        },
        controls:undefined,
        xMax: 400,
      },
    });
    Edbox.Message.Broadcast("TabClick",[item]);
  }

  //添加关卡
  addLevel = () => {
    const { edit = {}, dispatch } = this.props;
    const { currentData = {}, tabActiveKey, dataSourceIndex= {}, dataSource = {}} = edit;
    const { Datas = [] } = currentData;
    const { activeCollapseKey = [] } = this.state;
    const { Datas : sourceD  = [] } = dataSource;
    const hasTab =  Datas.length ? Datas[0].Type === 'Tab02' : false;
    let updateIndex
    const navCollapse = document.getElementsByClassName("nav-collapse")[0]
    const levelNav = document.getElementsByClassName("level-nav")[0]

    //判断添加关卡的位置
    if (hasTab) {
      updateIndex = dataSourceIndex[tabActiveKey];
    } else {
      updateIndex = dataSourceIndex[currentData.ID];
    }
    if(!updateIndex) return;
    const newId = Edbox.GetGUID();
    const newSourceD = JSON.parse(JSON.stringify(sourceD));
    // eslint-disable-next-line
    let newData = eval('newSourceD'+ updateIndex.index);
    
    let { Template = {}, Template_Override, Datas: nDatas = [], ID } = newData;
    Template = !!Template_Override ? Template_Override : Template //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值
    if(!Template) {
      message.error(formatMessage({ id: 'tip_level_template' })); 
      return true;
    }
    //模板子关卡ID重置
    const { Datas: TemplateDatas = [] } = Template;
    const newDatas = TemplateDatas.length ? TemplateDatas.map(updateID) : []

    //新关卡命名
    const lastName = nDatas.length 
                        ? !! nDatas[nDatas.length - 1].ShowName_Override 
                          ? nDatas[nDatas.length - 1].ShowName_Override 
                          : nDatas[nDatas.length - 1].ShowName
                        : ""
    const value = reName(lastName);  
    const newTemplate = {
      ...Template,
      ShowName: value,
      ID: newId,
      Editable: true,
      CanRestore: true,
      Datas: newDatas,
      Type: "Tab03"
    }
    newData.Datas.push(newTemplate)
    this.dealDatas({Datas:newSourceD})
    //更新currentData
    // eslint-disable-next-line
    const newCurrentData = eval('newSourceD'+ dataSourceIndex[currentData.ID].index);

    if(activeCollapseKey.length) {
      this.setState({
        activeCollapseKey: [...activeCollapseKey , newId]
      })
    }
    dispatch({
      type: 'edit/setAddUpdateDatas',
      payload: {
        dataSource: {
          ...dataSource,
          Datas:newSourceD
        } ,
        currentData: newCurrentData,
        activeLevelDatas: {
          pid: newId,
          activeLevelId: newDatas.length && newDatas[0].Type ==="Tab03" ? newDatas[0].ID : newId,
          changeNum: 1,
          Editable: true,
          CanRestore: true,
        },
        collapseKey: {
          id: ID,
          ketPach: [newId, ID]
        },
        controls:undefined,
        xMax: 400,
      },
    });
    Edbox.Message.Broadcast("Add",[newData,newTemplate]);
    navCollapse && levelNav && setTimeout(function(){levelNav.scrollTop = navCollapse.scrollHeight}, 100)
  }

  //删除关卡
  deleteLevel = (index, parentID, item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/setDeleteModelData',
      payload: {
        deleteModelData: {
          deleteModelVisible: true,
          deleteData: item, 
          pid: parentID
        }
      }
    });

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

  collapseChange = (key) => {
    this.setState({
      activeCollapseKey: key
    })
  }

  render() {
    const { edit } = this.props;
    const { activeCollapseKey } = this.state;
    const { currentData = {}} = edit;
    const { Datas = [], ID } = currentData;
    const activeKey = activeCollapseKey ? activeCollapseKey : getActiveKey(Datas);
    return (
        <div className={`${styles.level_nav} `}>
          <div className = "level-nav"> 
          {
            Datas.length > 0 
              ? Datas[0].Type === 'Tab02' 
                ? Datas.map((item)=>this.renderTab(item))
                : Datas.length > 0 && Datas[0].Type === 'Tab03' 
                ? <Collapse 
                    bordered={false}
                    activeKey={activeKey ? activeKey : []}
                    expandicon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                    onChange={this.collapseChange}
                    className="nav-collapse"
                  >
                   {Datas.map((item, i)=>this.renderLevel(item, i, ID))}
                </Collapse> 
              :null
            :null}
          </div>
          <div className={styles.add}>
            <span className={styles.add_btn} onClick={(e)=>this.addLevel(e)}><Iconfont type="icon-plus" /></span>
          </div>
        </div>
    );
  }
}

export default LevelNav;

