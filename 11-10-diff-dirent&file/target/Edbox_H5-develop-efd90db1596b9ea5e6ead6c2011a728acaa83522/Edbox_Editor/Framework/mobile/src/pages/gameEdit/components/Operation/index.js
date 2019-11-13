import React, { Component } from 'react';
import styles from "./index.less";
import { connect } from "dva";
import close from 'images/close.png';   
import { formatMessage } from 'umi/locale';
import { ServerKey } from '@/utils/common'
import {  Toast } from "antd-mobile";

const { Edbox } = window;
Edbox.ServerKey = ServerKey;

@connect(({ edit }) => ({
  edit: edit
}))

class GameMenu extends Component {
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

  //试玩
  trialHandleClick = e => {
    const { edit = {} } = this.props;
    const { dataSource ={} } = edit;
    try {
      Edbox.Editor.Play(
        dataSource,
        function(e){
          Toast.success(formatMessage({id: 'trial_skip'}));
        },
        function(e){
          Toast.fail(e, 3);
        }
      )
    } catch(e) {
      Toast.fail(e.message, 3);
    }
  }

  //保存
  saveHandleClick = e => {
    const { edit = {} } = this.props;
    const { dataSource ={} } = edit;
    try {
      Edbox.Editor.Save(
        dataSource,
        function(e){
          Toast.success(formatMessage({id: 'save_success'}));
        },
        function(e){
          Toast.fail(e, 3);
        }
      );
    } catch(e) {
      Toast.fail(e.message, 3);
    }
  }

  //另保存
  saveAsHandleClick = e => {
    const { edit = {} } = this.props;
    const { dataSource ={}} = edit;
    const baseInfo = dataSource.Datas.filter(item => item.Name === 'BaseInfo');
    let gameName = !!baseInfo[0].Datas[0] ?  baseInfo[0].Datas.filter(item => item.Name === 'GameName') : [0];
    if(!!gameName[0]) {
      const valueNum = gameName[0].Value.match(/[1-9]\d*$/);
      const value = !!valueNum ?  gameName[0].Value.replace(/[1-9]\d*$/, valueNum[0]*1+1 ) : gameName[0].Value + '1';
      gameName[0].Value = value;
    }
    try {
      Edbox.Editor.Save(
        dataSource,
        function(e){
          Toast.success(formatMessage({id: 'save_as_success'}));
        },
        function(e){
          Toast.fail(e, 3);
        }
      );
    } catch(e) {
      Toast.fail(e.message, 3);
    }
    
  }

  render() {
    const { edit } = this.props;
    const { showOperation } = edit;
    return (
      <div className={`${styles.menuItem}  ${showOperation ? styles.active : null }`}  onClick={this.handleClick}>
        <div className={styles.menu}>
          <div className={styles.header}>
            <span>{formatMessage({id: 'moreOperations'})} </span>
            <span className={styles.close} style={{backgroundImage: `url(${close})`}} onClick={this.closeMenu}></span>
          </div>
          <ul className={styles.operationList}  >
            <li className={styles.save} onClick={this.saveHandleClick}>
              <span>{formatMessage({id: 'save'})}</span>
            </li>
            <li className={styles.saveAs} onClick={this.saveAsHandleClick}>
              <span>{formatMessage({id: 'saveAs'})}</span>
            </li>
            <li className={styles.play} onClick={this.trialHandleClick}>
              <span>{formatMessage({id: 'play'})}</span>
            </li>
          </ul>
        </div>
    </div>
    );
  }
}

export default GameMenu;


