import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.scss';
import Iconfont from '@/components/Iconfont';
import { formatMessage } from 'umi/locale';
import { addSourceData, setNewDatasIndex } from '@/utils/helper'

const { Edbox } = window;
@connect(({ edit, loading }) => ({
  edit,
  loading: loading,
}))
class IframeHandler extends Component {

  constructor(props) {
    super(props)
    this.state = {
      changeNum: 1
    }
  }

  refreshLevel = (activeLevelId) => {
    const { edit = {}, dispatch } = this.props;
    const { dataSource = {}, dataSourceIndex = {} } = edit;
    const LevelIndex = dataSourceIndex[activeLevelId];
    if(!LevelIndex) return;
    // eslint-disable-next-line
    const { Datas = [] } = dataSource;
     // eslint-disable-next-line
    const LevelData = eval('Datas'+ LevelIndex.index) || {};
    let { ShowName, ShowName_Override } = LevelData;
    ShowName = !!ShowName_Override ? ShowName_Override : ShowName; //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值
    const message = {
      "ID": "Message",
      "Name": "Message",
      "ShowName": `${formatMessage({id: 'reset_sure'})} ${ShowName}?`,// 提示内容
      "Type": "Message", // 类型为Message固定
      "Switch": undefined,
      "Buttons":[
          {
            "ID": "Message_Buttons_NO",
            "Name": "OK",
            "ShowName": formatMessage({id: 'model_save'}), // 按钮显示内容
            "Type": "MessageButton",  // 类型为MessageButton固定
            "Style": "Default",  // String类型，默认为基本样式，"Default"为基本样式(白色)、"Primary"为特殊样式（有颜色的）
          },
          {
            "ID": "Message_Buttons_OK",
            "Name": "OK",
            "ShowName": formatMessage({id: 'model_cancel'}), // 按钮显示内容
            "Type": "MessageButton",  // 类型为MessageButton固定
            "Style": "Primary",  // String类型，默认为基本样式，"Default"为基本样式(白色)、"Primary"为特殊样式（有颜色的）
          }
      ]
    }
    dispatch({  //刷新时数据制空
      type: 'edit/setCollapseDeleteData',
      payload: {
        collapseDeleteData: undefined,
      },
    });
    Edbox.Message.Broadcast("RestoreButtonClick",[message]);
  }

  addChildLevel = () => {
    const { edit={}, dispatch } = this.props;
    const { currentData = {}, dataSource, dataSourceIndex } = edit;
    const { Datas = [] } = currentData;
    let pid = ""
    let NewCount = 0
    for(let i=0; i < Datas.length; i++) {  //循环获取Name为RankingList的tab02
      const dataName = Datas[i].Name
      if(dataName === "RankingList") {
        pid = Datas[i].ID
        NewCount = Datas[i].NewCount || 1
      }
    }
    const dealDatas = addSourceData(edit, pid, NewCount, pid ); //根据tab02数据进行处理
    if(!dealDatas) {
      return;
    }
    const { newSourceD, newCurrentData, newData, newTemplate, newId } = dealDatas;
    //更新currentData
    // eslint-disable-next-line
    const NewCountData = eval('newSourceD'+ dataSourceIndex[pid].index);
    NewCountData.NewCount = (NewCount ? NewCount : 1) * 1 + 1;
    const newTabData = setNewDatasIndex({Datas:newSourceD});
    dispatch({
      type: 'edit/setAddRankData',
      payload: {
        currentData: newCurrentData,
        dataSource: {
          ...dataSource,
          Datas: newSourceD
        },
        collapseKey: {
          id: pid,
          ketPach: [newId, pid]
        },
        dataSourceIndex: newTabData,
        tabActiveKey: pid,
        collapseDeleteData: [newTemplate],
      },
    });

    //关播添加数据
    Edbox.Message.Broadcast("Add",[newData,newTemplate]);
  }


  //删除
  deleteLevel = () => {
    const { edit = {}, dispatch } = this.props;
    const {  currentData = {},  collapseDeleteData = [] } = edit;
    const { Datas = [] } = currentData;
    let deleteData
    let pid
    for(let i=0; i < Datas.length; i++) {  //循环获取Name为RankingList的tab02
      const dataName = Datas[i].Name
      if(dataName === "RankingList") {
        pid = Datas[i].ID
        deleteData =  Datas[i].Datas[0]
      }
    }
    deleteData = collapseDeleteData.length ? collapseDeleteData[0]:deleteData
    if(!deleteData.ID) {
      return;
    }
    dispatch({
      type: 'edit/setDeleteModelData',
      payload: {
        deleteModelData: {
          deleteModelVisible: true,
          deleteData: deleteData, 
          pid: pid,
          numName: !!deleteData.ShowName_Override ? deleteData.ShowName_Override : deleteData.ShowName
        }
      }
    });
  }

  render() {
    const { edit = {} } = this.props;
    const { currentData = {}, collapseDeleteData = [] } = edit;
    const { Resetable, Class } = currentData;
    const hasCollapseDeleteData = collapseDeleteData.length ? !collapseDeleteData[0].ID ? true: false : false
    return (
        <div className={styles.handler}>
          { Class === "Ranking"?  <Iconfont className={styles['icon-handler']} type="icon-plus" onClick = {()=>this.addChildLevel()} /> : null }
          { Resetable ? <Iconfont className={styles['icon-handler']} type="icon-refresh" onClick = {()=>this.refreshLevel(currentData.ID)}  /> : null }
          { Class === "Ranking"? <Iconfont className={`${styles['icon-handler']} ${hasCollapseDeleteData? styles.disable:""}`} type="icon-trash" onClick = {()=>this.deleteLevel()} />: null }
        </div>
    );
  }
}

export default IframeHandler;

