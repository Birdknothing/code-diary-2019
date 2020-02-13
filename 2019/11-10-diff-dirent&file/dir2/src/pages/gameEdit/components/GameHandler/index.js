import React, { Component } from 'react';
import { connect } from 'dva';
import {addSourceData, updateSourceData } from '@/utils/helper'
import styles from './index.scss';
import Iconfont from '@/components/Iconfont';
import { formatMessage } from 'umi/locale';

const { Edbox } = window;
@connect(({ edit, loading }) => ({
  edit,
  loading: loading,
}))
class GameHandler extends Component {

  constructor(props) {
    super(props)
    this.state = {
      changeNum: 1
    }
  }

  

  /**
   * 向左切换
   * @param {String} pid 父id
   * @param {Boolean} isDefault是否通用按钮，只需做广播处理
   */
  arrowLeft = (pid, isDefault) => {
    if(isDefault) { //通用处理
      const { edit = {}, dispatch } = this.props;
      const { currentData = {}, dataSource = {}, dataSourceIndex = {} } = edit
      const { Datas = [] } = dataSource;
      const { Property={}, ID} = currentData;
      let { PageIndex = 1 } = Property;
      if(PageIndex > 1 ) {
        const updateCurrent = {
          ...currentData, 
          Property: {
            ...Property,
            PageIndex: PageIndex - 1
          }
        }
        const newData =  updateSourceData(dataSourceIndex, ID, ID, Datas, updateCurrent);
        dispatch({
          type: 'edit/updateData',
          payload: {
            dataSource: {
              ...dataSource,
              Datas: newData.data
            },
            currentData:updateCurrent
          },
        });
        Edbox.Message.Broadcast("PageDownButtonClick", [updateCurrent]);
        
      }
      return;
    }
    const { edit = {}, dispatch } = this.props;
    const { activeLevelDatas = {}, dataSource = {}, dataSourceIndex = {} } = edit;
    const { changeNum=1 } = activeLevelDatas;
    if(changeNum > 1 ) {
      // eslint-disable-next-line
      const { Datas = [] } = dataSource;
      //判断添加关卡的位置
      const pidIndex = dataSourceIndex[pid];
      if(!pidIndex) return;
      // eslint-disable-next-line
      const pidData = eval('Datas'+ pidIndex.index);
      const { Datas: nDatas = [] } = pidData;
      dispatch({
        type: 'edit/setActiveLevelDatas',
        payload: {
          activeLevelDatas: {
            ...activeLevelDatas,
            activeLevelId: nDatas.length ? nDatas[changeNum-2].ID : undefined,
            changeNum: changeNum-1, 
            Editable: nDatas.length ? nDatas[changeNum-2].Editable : undefined,
            CanRestore: nDatas.length ? nDatas[changeNum-2].CanRestore : undefined,
          },
          collapseKey: {
            id: pid,
            ketPach: [nDatas.length ? nDatas[changeNum-2].ID : undefined, pid]
          },
          controls:undefined,
          xMax: 400,
        },
      });
      Edbox.Message.Broadcast("TabClick",[nDatas[changeNum-2]]);
    }

  }

  /**
   * 向右切换
   * @param {String} pid 父id
   * @param {Number} num 总数
   * @param {Boolean} isDefault是否通用按钮，只需做广播处理
   */
  arrowRight = (num,pid, isDefault) => {

    if(isDefault) { //通用处理
      const { edit = {}, dispatch } = this.props;
      const { currentData = {}, dataSource = {}, dataSourceIndex = {} } = edit
      const { Datas = [] } = dataSource;
      const { Property={}, ID} = currentData;
      let { PageIndex = 1 } = Property;
      if(PageIndex < num  ) {
        const updateCurrent = {
          ...currentData, 
          Property: {
            ...Property,
            PageIndex: PageIndex + 1
          }
        }
        const newData =  updateSourceData(dataSourceIndex, ID, currentData.ID, Datas, updateCurrent);
        dispatch({
          type: 'edit/updateData',
          payload: {
            dataSource: {
              ...dataSource,
              Datas: newData.data
            },
            currentData: updateCurrent
          },
        });
        Edbox.Message.Broadcast("PageUpButtonClick", [updateCurrent]);
        
      }
      return;
    }
    //修改其它联动
    const { edit = {}, dispatch } = this.props;
    
    const { activeLevelDatas = {}, dataSource = {}, dataSourceIndex = {} } = edit;
    const { changeNum=1 } = activeLevelDatas;
    if(changeNum < num ) {
      // eslint-disable-next-line
      const { Datas = [] } = dataSource;
      //判断添加关卡的位置
      const pidIndex = dataSourceIndex[pid];
      if(!pidIndex) return;
     // eslint-disable-next-line
      const pidData = eval('Datas'+ pidIndex.index);
      const { Datas: nDatas = [] } = pidData;
      
      dispatch({
        type: 'edit/setActiveLevelDatas',
        payload: {
          activeLevelDatas: {
            ...activeLevelDatas,
            activeLevelId: nDatas.length ? nDatas[changeNum].ID : undefined,
            changeNum: changeNum+1,
            Editable: nDatas.length ? nDatas[changeNum].Editable : undefined,
            CanRestore: nDatas.length ? nDatas[changeNum].CanRestore : undefined,
          },
          collapseKey: {
            id: pid,
            ketPach: [nDatas.length ? nDatas[changeNum].ID : undefined, pid]
          },
          controls:undefined,
          xMax: 400,
        },
      });
      Edbox.Message.Broadcast("TabClick",[nDatas[changeNum]]);
    }
  }

  /**
   * 添加子关卡
   * @param {String} pid 父id
   * @param {Boolean} isDefault是否通用按钮，只需做广播处理
   */
  addChildLevel = (pid, isDefault) => {

    if(isDefault) { //通用处理
      Edbox.Message.Broadcast("AddButtonClick");
      return;
    }

    const { edit = {}, dispatch } = this.props;
    const { currentData = {}, dataSource = {}} = edit;
    const { NewCount} = currentData
    const dealDatas = addSourceData(edit, pid, NewCount ); //处理添加数据
    const { newSourceD, newCurrentData, newData, newTemplate, newId } = dealDatas;

    this.dealDatas({Datas: newSourceD}); //重新获取数组索引

    dispatch({
      type: 'edit/setAddUpdateDatas',
      payload: {
        dataSource: {
          ...dataSource,
          Datas:newSourceD
        } ,
        currentData: newCurrentData,
        activeLevelDatas: {
          pid: pid,
          activeLevelId: newId,
          changeNum: newData.Datas.length ? newData.Datas.length : 1,
          Editable: true,
          CanRestore: true,
        },
        collapseKey: {
          id: newData.ID,
          ketPach: [newId, newData.ID]
        },
        controls:undefined,
        xMax: 400,
      },
    });
    Edbox.Message.Broadcast("Add",[newData,newTemplate]);
  }

  /**
   * 删除子关卡
   * @param {String} activeLevelId 选中id
   * @param {String} pid 父id
   * @param {Number} changeNum 当前页码
   * @param {Boolean} isDefault是否通用按钮，只需做广播处理
   */
  deleteLevel = (activeLevelId, pid, changeNum, isDefault) => {
    if(isDefault) { //通用处理
      Edbox.Message.Broadcast("DeleteButtonClick");
      return;
    }
    const { edit = {}, dispatch } = this.props;
    const {  dataSource = {}, dataSourceIndex = {}, currentData={} } = edit;
    const { Class = "Default", Editable  } = currentData;
    const LevelIndex = dataSourceIndex[activeLevelId];
    if(!LevelIndex) return;
    // eslint-disable-next-line
    const { Datas = [] } = dataSource;
    // eslint-disable-next-line
    const LevelData = eval('Datas'+ LevelIndex.index);
    const defaultClass = Class === "Default" && Editable;
    dispatch({
      type: 'edit/setDeleteModelData',
      payload: {
        deleteModelData: {
          deleteModelVisible: true,
          deleteData: LevelData, 
          pid: pid,
          numName: (Class === "LevelEdit" || defaultClass) ? changeNum : undefined
        }
      }
    });
  }

  /**
   * 重置按钮
   * @param {String} activeLevelId 选中id
   * @param {Boolean} isDefault是否通用按钮，只需做广播处理
   */
  refreshLevel = (activeLevelId, isDefault) => {
    if(isDefault) { //通用处理
      Edbox.Message.Broadcast("RestoreButtonClick");
      return;
    }
    const { edit = {} } = this.props;
    const { dataSource = {}, dataSourceIndex = {} } = edit;
    const LevelIndex = dataSourceIndex[activeLevelId];
    if(!LevelIndex) return;
    // eslint-disable-next-line
    const { Datas = [] } = dataSource;
    // eslint-disable-next-line
    const LevelData = eval('Datas'+ LevelIndex.index) || {};
    let {ShowName, ShowName_Override } = LevelData;
    ShowName = !!ShowName_Override ? ShowName_Override : ShowName; //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值
    const message = {
      "ID": "Message",
      "Name": "Message",
      "ShowName": `${formatMessage({id: 'reset_sure'})} ${ShowName}?`,          // 提示内容
      "Type": "Message",                 // 类型为Message固定
      "Switch": undefined,
      "Buttons":[
          {
            "ID": "Message_Buttons_NO",
            "Name": "OK",
            "ShowName": formatMessage({id: 'model_save'}),         // 按钮显示内容
            "Type": "MessageButton",  // 类型为MessageButton固定
            "Style": "Default",       // String类型，默认为基本样式，"Default"为基本样式(白色)、"Primary"为特殊样式（有颜色的）
          },
          {
            "ID": "Message_Buttons_OK",
            "Name": "OK",
            "ShowName": formatMessage({id: 'model_cancel'}),         // 按钮显示内容
            "Type": "MessageButton",  // 类型为MessageButton固定
            "Style": "Primary",       // String类型，默认为基本样式，"Default"为基本样式(白色)、"Primary"为特殊样式（有颜色的）
          }
      ]
    }
    Edbox.Message.Broadcast("RestoreButtonClick",[message]);
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

  render() {
    const { edit = {} } = this.props;
    const { currentData = {}, activeLevelDatas, dataSource = {}, dataSourceIndex = {} } = edit;
    const { Datas = [], Class, Property={}, IsLevelEdit } = currentData;
    const activeLDatas = !!activeLevelDatas   //默认选中关卡数据关卡没有tab02
                            ? activeLevelDatas 
                            : Datas.length 
                              ? !!Datas[0].Data && Datas[0].Datas.length 
                                ? Datas[0].Datas[0].Type === "Tab03" 
                                  ? Datas[0].Datas[0] 
                                  : Datas[0] 
                                : {} 
                              : {};  
    let { pid, changeNum=1 , activeLevelId, Editable, CanRestore} = activeLDatas;
    const hasTab = Datas.length? Datas[0].Type === "Tab02": false ;
    const isRmanage = Class === "ResouceManage";
    const { ShowRestoreButton = false, ShowAddButton = false, ShowDeleteButton = false, ShowPageControl = false,  PageTotal = 1, PageIndex = 1 } = Property;
    const defaultShowHandler = !ShowRestoreButton && !ShowAddButton && !ShowDeleteButton && !ShowPageControl;
    const isLevelHandler = Class === "LevelEdit" || Class === "ResouceManage"
    let num 
    // eslint-disable-next-line
    const { Datas:SDatas = [] } = dataSource;
    //判断添加关卡的位置
    if(isRmanage) {
      num = Datas.length
      pid = currentData.ID
      Editable = currentData.Editable
    }else {
      
     
      if(!!pid) { //用户操作选中关卡时且父级存在
        
        const pidIndex = dataSourceIndex[pid];
        // eslint-disable-next-line
        const pidData = eval('SDatas'+ pidIndex.index);
        if(!!pidData) {
          const { Datas: nDatas = [] } = pidData;
          if(nDatas.length) {
            num= nDatas[0].Type=== "Tab03" ? nDatas.length : 0;
          }
        }
        
      }else {
        if(!pid) { //默认选中
          if(Datas.length) {
            const { ID, Datas:cDatas = [] } = Datas[0]
            
            if(cDatas.length) {
              pid = ID
              activeLevelId = cDatas[0].Type=== "Tab03" ? cDatas.length ? cDatas[0].ID: ID : ID
              Editable = cDatas[0].Type=== "Tab03" ?  cDatas.length ? cDatas[0].Editable: false :false
              num= cDatas[0].Type=== "Tab03" ? cDatas.length : 0;
            }
          }
        }
      }
    }

    let showLevelNav
    if (!hasTab) {
      showLevelNav = IsLevelEdit
    }else {
      showLevelNav = false
    }
    return (
     
        <div className={`${styles.handler} ${ !isLevelHandler && defaultShowHandler ? styles.hide : "" }`}>
          { showLevelNav || Class === "LevelEdit" || Class === "ResouceManage" 
            ? <div>
                {num > 1 ?
                  <span className={styles['handler-num']}>
                    <Iconfont className={`${styles['icon']} ${changeNum === 1? styles.disable:""}`} type="icon-arrow-left" onClick = {()=>this.arrowLeft(pid)}/>
                    <span>{changeNum}/{num}</span>
                    <Iconfont className={`${styles['icon']} ${changeNum === num? styles.disable:""}`} type="icon-arrow-right" onClick = {()=>this.arrowRight(num, pid)} />
                  </span>
                  : null
                }
                { num > 0 && Editable && num <= 9999999  
                  ? <Iconfont className={styles['icon-handler']} type="icon-plus" onClick = {()=>this.addChildLevel(pid)} /> 
                  : null
                }
                {CanRestore 
                  ? <Iconfont className={styles['icon-handler']} type="icon-refresh" onClick = {()=>this.refreshLevel(activeLevelId)}  /> 
                  : null
                } 
                {num > 0 && Editable   
                  ? <Iconfont className={styles['icon-handler']} type="icon-trash" onClick = {()=>this.deleteLevel(activeLevelId, pid, changeNum)} /> 
                  : null
                }
              </div>
            : <div>
              { ShowPageControl ?
                <span className={styles['handler-num']}>
                  <Iconfont className={`${styles['icon']} ${PageIndex === 1? styles.disable:""}`} type="icon-arrow-left" onClick = {()=>this.arrowLeft(pid, true)}/>
                  <span>{PageIndex}/{PageTotal}</span>
                  <Iconfont className={`${styles['icon']} ${PageIndex === PageTotal? styles.disable:""}`} type="icon-arrow-right" onClick = {()=>this.arrowRight(PageTotal, pid, true)} />
                </span>
                : null
              }
              { ShowAddButton
                ? <Iconfont className={styles['icon-handler']} type="icon-plus" onClick = {()=>this.addChildLevel(pid, true)} /> 
                : null
              }
              { ShowRestoreButton
                ? <Iconfont className={styles['icon-handler']} type="icon-refresh" onClick = {()=>this.refreshLevel(activeLevelId, true)}  /> 
                : null
              } 
              { ShowDeleteButton 
                ? <Iconfont className={styles['icon-handler']} type="icon-trash" onClick = {()=>this.deleteLevel(activeLevelId, pid, changeNum, true)} /> 
                : null
              }
            </div>
          }
        </div>
        
    );
  }
}

export default GameHandler;

