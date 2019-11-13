import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Menu, Dropdown, Icon, Modal, Cascader} from 'antd';
import styles from './index.scss';
import { formatMessage } from 'umi/locale';
import {  parseLevelDatas, addSourceData, setNewDatasIndex } from '@/utils/helper'

const { SubMenu, Item } = Menu;
const { Edbox } = window;
@connect(({ edit, loading }) => ({
  edit,
  loading: loading,
}))
class ModalMessage extends Component {

  constructor(props){
    super(props)
    const { levelDatas = [] } = props
    const menuDate = levelDatas.length ? levelDatas.find( (item)=> {
      return item.Type === "Tab03"
    }) : undefined
    this.state={
      menuValue: !!menuDate   //ShowName显示优先级
                  ? menuDate.EditableContent 
                    ? menuDate.EditableContent 
                      : !!menuDate.ShowName_Override
                        ? menuDate.ShowName_Override
                        : menuDate.ShowName
                    : undefined,
      addLevelVisible: false,
      levelOptions: [],
      selectLevelValue: undefined,
      levelDatasP: [],
      showMsg: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.levelDatas !== this.props.levelDatas) {
      const { levelDatas = [] } = nextProps
      const menuDate = levelDatas.length ? levelDatas.find( (item)=> {
        return item.Type === "Tab03"
      }) : undefined
      this.setState({
        menuValue: !!menuDate  //ShowName显示优先级
                  ? menuDate.EditableContent 
                  ? menuDate.EditableContent 
                    : !!menuDate.ShowName_Override
                      ? menuDate.ShowName_Override
                      : menuDate.ShowName
                  : undefined,
      })
    }
    const { levelDatas = [] } = nextProps
    const options = levelDatas.map((i)=>parseLevelDatas(i))
    this.setState({
      levelOptions: options.filter(i => i)
    })
  }
  

  /**
   * 关卡下拉项渲染
   * @param {object} item tab03数据
   */
  renderMenu = ( item={} ) => {
    if( !item.ID || item.Type !== "Tab03") {
      return;
    }
    let vdom = []; 
    let { Datas = [], ID, SplitLine = undefined, ShowName, EditableContent, ShowName_Override } = item;
    const hasChild = Datas.length>0 && Datas[0].Type === "Tab03" ;
    ShowName = !!ShowName_Override ? ShowName_Override : ShowName; //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值
    if (hasChild) {
        let list = [];
        for (var i of Datas) {
            list.push(this.renderMenu(i));
        }
        vdom.push(
          <SubMenu  key={ID} title={<span title={EditableContent ? EditableContent : ShowName}><span>{EditableContent ? EditableContent : ShowName}</span></span>}  className={SplitLine ? 'borderTop' : null} >
            {list}
          </SubMenu>
        );
    } else {
        vdom.push(
          <Item key={ID} datasource={item} >
            <span title={EditableContent ? EditableContent : ShowName}>{EditableContent ? EditableContent : ShowName}</span>
          </Item>
        );
    }
    return vdom;
  }

  //关卡下拉选中
  handleClick = (e) => {
    const data = e.item.props.datasource;
    const { dispatch, levelId } = this.props;
    let  { ShowName, EditableContent, ShowName_Override } = data;
    ShowName = !!ShowName_Override ? ShowName_Override : ShowName; //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值
    dispatch({
      type: 'edit/setCollapseKey',
      payload: {
        collapseKey: {
          id: levelId,
          ketPach: e.keyPath
        }
      }
    })
    this.setState({
      menuValue: EditableContent ? EditableContent : ShowName
    })
  }

  //点击管理按钮
  handleClickManagement = (e) => {
    const { dispatch, edit  = {} } = this.props;
    const { managementTxt } = edit;
    dispatch({
      type: 'edit/setManagement',
      payload: {
        management: managementTxt === formatMessage({id: 'manage'}) ?  true : false, 
        managementTxt: managementTxt === formatMessage({id: 'manage'}) ?  formatMessage({id: 'finish'}) : formatMessage({id: 'manage'})
      }
    })
  }

  /**
   * 处理添加关卡数据
   * @param {String} levelId 父关卡ID
   */
  dealWithDatas = (levelId) => {
    const { edit = {}, dispatch, levelId: levelTabId } = this.props;
    const { currentData = {}, dataSource = {}} = edit;
    const { NewCount} = currentData
    const dealDatas = addSourceData(edit, levelId, NewCount );
    if(!dealDatas) {
      return;
    }
    const { newSourceD, newCurrentData, newData, newTemplate, newId } = dealDatas;
    newCurrentData.NewCount = (NewCount ? NewCount : 1) * 1 + 1;
    const newTabData = setNewDatasIndex({Datas:newSourceD});
    dispatch({
      type: 'edit/setAddData',
      payload: {
        currentData: newCurrentData,
        dataSource: {
          ...dataSource,
          Datas: newSourceD
        },
        collapseKey: {
          id: levelTabId,
          ketPach: [newId, levelId]
        },
        dataSourceIndex: newTabData
      },
    });

    //关播添加数据
    Edbox.Message.Broadcast("Add",[newData,newTemplate]);
  }

  /**
   * 添加关卡与子关卡
   * @param {num} key 1-关卡 2-子关卡
   */
  handleMenuClick = e => {
    //添加关卡
    if(e.key*1 === 1) {
      const {levelId } = this.props;
      this.dealWithDatas(levelId);
    }else{
     
      this.setState({
        addLevelVisible: true
      });
      
    }
  }

  //添加子关卡
  addChildLevel = () => {
    const {selectLevelValue } = this.state;
    if(selectLevelValue) {
      this.dealWithDatas(selectLevelValue);
      this.setState({
        addLevelVisible: false
      });
    }else {
      this.setState({
        showMsg: true
      });
    }
    
  }

  //选择子关卡
  selectLevel = (value, selectedOptions) => {
    this.setState({
      selectLevelValue: value[0],
      showMsg: false
    });
  }

  //关闭子关卡选择弹窗
  hideNameModal = () => {
    this.setState({
      addLevelVisible: false
    });
  }

  render() {
    const { levelDatas, edit = {}, ClassData } = this.props;
    const { menuValue, addLevelVisible, levelOptions = [], showMsg, selectLevelValue } = this.state;
    const { managementTxt } = edit;
    const menu = (
      <Menu
      style={{ width: 150, height: '100%' }}
      theme="light"
      className="menu-con"
      onClick={(e)=>this.handleClick(e)}
      >
        {levelDatas.map(this.renderMenu)}
      </Menu>
    );
    
    const menuBtn = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">{formatMessage({id: 'level'})}</Menu.Item>
        {levelOptions.length 
          ? <Menu.Item key="2">{formatMessage({id: 'level_child'})}</Menu.Item>
          : null
        }
      </Menu>
    );
    
    return (
        <section className={styles.level}>
          <div className={styles.level_btn}>
           {  ClassData === "ResouceManage" //资源管理添加
            ?<Button type="primary"  className={styles.level_btn_add} onClick={() => this.handleMenuClick({ key: 1})}><Icon type="plus" />{formatMessage({id: 'add'})}</Button>
            : <Dropdown overlay={menuBtn} className="level_add">
                <Button type="primary"  className={styles.level_btn_add} ><Icon type="plus" />{formatMessage({id: 'add'})} <Icon type="down" /></Button>
            </Dropdown>
            }
           
            
            <Button  icon="appstore" className="level_btn_management" onClick={(e)=>this.handleClickManagement(e)} >{managementTxt}</Button>
          </div>
          <div>
            <span>{formatMessage({id: 'fast_select'})}</span>
            <Dropdown overlay={menu}>
              <span className={styles.dropdown} >
                {menuValue} <Icon type="down" />
              </span>
            </Dropdown>
          </div>
          { 
            addLevelVisible
            ? <Modal
                title={formatMessage({id: 'prompt'})}
                visible={addLevelVisible}
                onOk={this.addChildLevel}
                onCancel={this.hideNameModal}
                okText={formatMessage({id: 'model_save'})}
                cancelText={formatMessage({id: 'model_cancel'})}
                okButtonProps={{ disabled: !addLevelVisible }}
                width= {400}
                className='model_style'
                centered
              >
                <p className={styles.gameName} >{formatMessage({id: 'select_level'})}</p>
                <Cascader 
                  options={levelOptions} 
                  onChange={this.selectLevel} 
                  placeholder={formatMessage({id: 'please_select'})}
                  className={styles.cascader}
                  defaultValue = { !selectLevelValue ?  [] :[selectLevelValue]}
                />
                {showMsg ?<span className={styles.error}>{formatMessage({id: 'required_text'})}</span> : null}
              </Modal>
            : null 
          }
        </section>
    );
  }
}

export default ModalMessage;

