import React, { Component } from 'react';
import styles from "./index.less";
import { connect } from "dva";
import close from 'images/close.png';   


const { Edbox } = window;
@connect(({ edit }) => ({
  edit: edit
}))

class GameMenu extends Component {
  closeMenu = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/setShowMenu',
      payload: {
        showMenu: false
      }
    });
  }

  openMenu = (e) => {
    e.stopPropagation();
    const hasClass = e.currentTarget.classList.contains('closeMenu');
    if(!hasClass) {
      e.currentTarget.classList.add("closeMenu");
      e.currentTarget.nextElementSibling.classList.add("closeUl");
    }else {
      e.currentTarget.classList.remove("closeMenu");
      e.currentTarget.nextElementSibling.classList.remove("closeUl");
    }
  }

  renderMenu = ( item ) => {
    let vdom = [];
    const { Datas, ID, Recommend , SplitLine, ShowName  } = item;
    const hasChild = Datas[0].Type === "Tab01" ;
    const { edit } = this.props;
    const { currentData = {} } = edit;
    if (hasChild) {
        let list = [];
        for (var i of Datas) {
            list.push(this.renderMenu(i));
        }
        vdom.push(
          <li key={ID} datasource={ID} onClick={(e)=>this.openMenu(e, item)}  className={styles.hasChild} style={SplitLine ? {borderTop: "1px solid #e2e2e2"} : null} >
            <span  onClick={(e)=>this.openMenu(e, item)} >{ShowName}</span>
            <ul key={ID}>
              {list}
            </ul>
          </li>
        );
    } else {
      
      // if( item.Name === 'BaseInfo') {
      //   return;
      // }
      vdom.push(
        <li key={ID} datasource={ID} onClick={(e)=>this.handleClick(e, item)}  style={SplitLine ? {borderTop: "1px solid #e2e2e2"} : null}>
          <span className={ currentData.ID === ID ? styles.active : null} >{ShowName} { Recommend ?  <i className={styles.recommend}></i> : null} </span>
          
        </li>
      );
    }
    return vdom;
  }

  handleClick = (e, item) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/setCurrentData',
      payload: {
        currentData: item,
        showMenu: false
      }
    })
    Edbox.Message.Broadcast("TabClick", [item]);
  }

  render() {
    const { edit } = this.props;
    const { showMenu, dataSource = {} } = edit;
    const { Datas = [] } = dataSource;
    return (
      <div className={`${styles.menuItem}  ${showMenu ? styles.active : null}` }>
        <div className={styles.menu}>
          <div className={styles.menuHeader}>
            <span className={styles.close} style={{backgroundImage: `url(${close})`}} onClick={this.closeMenu}></span>
          </div>
          <ul className={styles.menuList} >
            {Datas.map(this.renderMenu)}
          </ul>
        </div>
    </div>
    );
  }
}

export default GameMenu;


