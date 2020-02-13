import React, { Component } from 'react';
import styles from "./index.less";
import { connect } from "dva";
import { NavBar, Toast } from "antd-mobile";
import router from "umi/router";
import next from 'images/next.png';   
import { ServerKey } from '@/utils/common'
import { formatMessage } from 'umi/locale';

const { Edbox } = window;
Edbox.ServerKey = ServerKey;
let isNext = false;
@connect(({ edit, global }) => ({
  edit: edit
}))


class Header extends Component {

  showMenu = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/setShowMenu',
      payload: {
        showMenu: true
      }
    });
  }

  showOperation = (e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/setShowOperation',
      payload: {
        showOperation: true
      }
    });
  }

  nextRecommend = () => {
    const { edit } = this.props;
    const { currentData = {}, dataSource = {} } = edit;
    const { Datas } = dataSource;
    const { ID } = currentData;
    const nextData = Datas.find((item)=>this.recommendData(ID, item));
    if(!nextData) {
      
      isNext = true;
      Datas.find((item)=>this.recommendData(ID, item));
    }
    isNext = false;
  }

  recommendData = (id, item = {}) => {
    const { dispatch } = this.props;
    const { Datas, ID, Recommend } = item;
    const hasChild = Datas[0].Type === "Tab01" ;
    if( isNext && Recommend && !hasChild ) {
      dispatch({
        type: 'edit/setNextData',
        payload: {
          currentData: item
        }
      });
      isNext = false;
      Edbox.Message.Broadcast("TabClick", [item]);
      return true;
    }
    if( id === ID ) {
      isNext = true;
    }
    if(hasChild) {
       return Datas.find((item)=>this.recommendData(id, item));
    }
    return false;
    
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

  render() {
    const { pathname, edit } = this.props;
    const { currentData = {}, showOperation , percentRecommend = [], recommendList = []} = edit;
    const percent = recommendList.length > 0 ? (recommendList.length) / (percentRecommend.length) * 100 : 0;
    const {  PageType = 'FullPage' } = currentData
    return (
      <NavBar
        mode="dark"
        className={`${PageType === 'Default'  ?  styles.barColorDark : '' } ${styles.barColor}`}
        icon={
          ( pathname === "/") ?null: (
            <span className={styles.back} ></span>
          ) 
        }
        onLeftClick={() => {
          router.go(-1);
        }}
      >
        <span className={styles.title} onClick={this.showMenu}>{currentData[`ShowName`]}</span>
        <span className={styles.bar}><i style={{width: percent+'%'}}></i></span>
        <span className={`${styles.more} ${ showOperation ? styles.moreActive : null }`} onClick={this.showOperation} ></span>
        {percent === 100 || percentRecommend.length < 1 ?
          <span  className={styles.play} onClick={this.trialHandleClick}></span>
          : <span  className={styles.next} style={{backgroundImage: `url(${next})`}} onClick={this.nextRecommend}></span>
        }
      </NavBar>
    );
  }
}

export default Header;


