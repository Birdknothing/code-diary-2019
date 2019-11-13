import React, { Component } from 'react';
import styles from './index.scss';
import { Menu } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';

const { Edbox } = window;

const SubMenu = Menu.SubMenu;
@connect(({ edit, loading }) => ({
  edit,
  loading: loading,
}))
class Nav extends Component {

  componentWillReceiveProps(nextProps) {
    const { edit ={} } = nextProps;
    const { dataSource = {} } = edit;
    const { Datas = []} = dataSource;
    const { dataSource:oldDataSource = {}} = this.props.edit;
    const { Datas:oldDataS = []} = oldDataSource;

    if(oldDataS.length < 1  && Datas.length > 0) {
      const { edit, dispatch } = nextProps;
      const { dataSource = {} } = edit;
      const { Datas = [] } = dataSource;
      let navOpenKeys = []
      Datas.length > 0 && Datas.map(item => {
        const key = this.defaultOpenKey(item)
        key.length && navOpenKeys.push( ...key );
        return key;
      });
      if(Datas.length) {
        dispatch({
          type: 'edit/setdefaultOpen',
          payload: {
            currentData: Datas[0],
            navOpenKey: navOpenKeys,
            tabActiveKey: Datas[0].Datas.length > 0 ? Datas[0].Datas[0].ID : undefined,
            management: false,
            managementTxt: formatMessage({id: 'manage'})
          }
        });
      }
    }
  }

  renderMenu = ( item={} ) => {
    if( !item.ID ) {
      return;
    }
    let vdom = [];
    let { Datas = [], ID, SplitLine = undefined, ShowName, ShowName_Override } = item;
    const hasChild = Datas.length>0 && Datas[0].Type === "Tab01" ;
    ShowName = !!ShowName_Override ? ShowName_Override : ShowName; //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值
    if (hasChild) {
        let list = [];
        for (var i of Datas) {
            list.push(this.renderMenu(i));
        }
        vdom.push(
          <SubMenu  key={ID} title={<span title={ShowName} ><span>{ShowName}</span></span>}  className={SplitLine ? 'borderTop' : null} >
            {list}
          </SubMenu>
        );
    } else {
        vdom.push(
          <Menu.Item key={ID} datasource={item} title={ShowName}>
            <span>{ShowName}</span>
          </Menu.Item>
        );
    }
    return vdom;
  }


  defaultOpenKey = ( item={}, openKeys = [] ) => {

    const { Datas = [], ID } = item;
    const hasChild = Datas.length > 0  && Datas[0].Type === "Tab01" ;
    openKeys.push(ID);
    if(hasChild) {
      let list = [];
      for (var i of Datas) {
        list.push(this.defaultOpenKey(i, openKeys));
      }
    }
    return openKeys;

  }


  handleClick = (e, navOpenKey) => {
    const { dispatch } = this.props;
    const data = e.item.props.datasource;
    const { Datas = [], ID } = data;

    document.getElementsByClassName("sider-nav")[0].setAttribute('tabId', ID);
    dispatch({
      type: 'edit/setMenuClick',
      payload: {
        currentData: data,
        tabActiveKey: Datas.length > 0 ? Datas[0].Type === "Tab02" ? Datas[0].ID : undefined : undefined,
        controls: undefined,
        xMax: 400,
        management: false,
        managementTxt: formatMessage({id: 'manage'}),
        activeLevelDatas: undefined,
        collapseKey: undefined,
      }
    });
    Edbox.Message.Broadcast("TabClick", [data]);
  }

  onOpenChange = (openKeys) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'edit/setNavOpenKey',
      payload: {
        navOpenKey: openKeys
      }
    });
  }


  render() {
    const { edit } = this.props;
    const { dataSource = {}, currentData ={}, navOpenKey } = edit;
    const { Datas = [] } = dataSource;
    const { ID } = currentData;
    return (
      <div className={styles.nav}>
      {
        !ID ?
        null
        : <Menu
          selectedKeys={[ID]}
          openKeys={navOpenKey}
          mode="inline"
          style={{ width: 220, height: '100%' }}
          theme="light"
          // collapsed={false}
          className="menu-con"
          onClick={(e)=>this.handleClick(e)}
          onOpenChange={this.onOpenChange}
        >
          {Datas.map(this.renderMenu)}
        </Menu>
      }
    </div>
    );
  }
}

export default Nav;

