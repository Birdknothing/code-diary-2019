import React, { Component } from 'react';
import router from 'umi/router';
import { Menu } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import withRouter from 'umi/withRouter';
// import { stringify } from 'qs';
import styles from './index.scss';

import StepGuideModal from '@/components/StepGuideModal';

const SubMenu = Menu.SubMenu;
// const {Edbox} =window;
@connect(({ global,edit, simplePictureCtrl, loading }) => ({
  global,
  edit,
  simplePictureCtrl,
  loading: loading,
}))
class EditorNav extends Component {
  componentWillReceiveProps(nextProps) {
    const { edit = {} } = nextProps;
    const { dataSource = {} } = edit;
    const { Datas = [] } = dataSource;
    const { dataSource: oldDataSource = {} } = this.props.edit;
    const { Datas: oldDataS = [] } = oldDataSource;

    if (oldDataS.length < 1 && Datas.length > 0) {
      const { edit, dispatch } = nextProps;
      const { dataSource = {} } = edit;
      const { Datas = [] } = dataSource;
      let navOpenKeys = [];
      Datas.length > 0 &&
        Datas.map(item => {
          const key = this.defaultOpenKey(item);
          key.length && navOpenKeys.push(...key);
          return key;
        });
      if (Datas.length) {
        dispatch({
          type: 'edit/setdefaultOpen',
          payload: {
            currentData: Datas[0],
            navOpenKey: navOpenKeys,
            tabActiveKey: Datas[0].Datas.length > 0 ? Datas[0].Datas[0].ID : undefined,
            management: false,
            managementTxt: formatMessage({ id: 'manage' }),
          },
        });
      }
    }
  }

  renderMenu = (item = {}) => {
    if (!item.ID) {
      return;
    }
    let vdom = [];
    const { Datas = [], ID, SplitLine = undefined, ShowName } = item;
    const hasChild = Datas.length > 0 && Datas[0].Type === 'Tab01';
    if (hasChild) {
      let list = [];
      for (var i of Datas) {
        list.push(this.renderMenu(i));
      }
      vdom.push(
        <SubMenu
          key={ID}
          title={
            <span title={ShowName}>
              <span>{ShowName}</span>
            </span>
          }
          className={SplitLine ? 'borderTop' : null}
        >
          {list}
        </SubMenu>,
      );
    } else {
      if (ID === 'Game_Rules_tab01') {
        // 引导层步数(新手引导-玩法规则点击10 (10-3))
        vdom.push(
          <Menu.Item key={ID} datasource={item} title={ShowName}>
            <StepGuideModal
              isFixed
              handStyle={{ top: '153px', left: '80px' }}
              popStyle={{ top: '86px', left: '125px' }}
              width={250}
              step={7} // 10-3
              placement="RB"
              title={formatMessage({ id: 'g_tip_game_nav' })}
            >
              <span>{ShowName}</span>
            </StepGuideModal>
          </Menu.Item>,
        );
      } else {
        vdom.push(
          <Menu.Item key={ID} datasource={item} title={ShowName}>
            <span>{ShowName}</span>
          </Menu.Item>,
        );
      }
    }
    return vdom;
  };

  defaultOpenKey = (item = {}, openKeys = []) => {
    const { Datas = [], ID } = item;
    const hasChild = Datas.length > 0 && Datas[0].Type === 'Tab01';
    openKeys.push(ID);
    if (hasChild) {
      let list = [];
      for (var i of Datas) {
        list.push(this.defaultOpenKey(i, openKeys));
      }
    }
    return openKeys;
  };

  // 去往某步
  goToStep = (val) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/setStep',
      payload: {
        activeStep:val,
      },
    });
    dispatch({
      type: 'global/setIsCanOpr',
      payload: {
        isCanOpr: false,
      },
    });
  };
  handleClick = (e, navOpenKey) => {
    const {
      dispatch,
      location,
      simplePictureCtrl: { onClose },
      edit: { nowGameIdObj = {} },
    } = this.props;
    const data = e.item.props.datasource;
    const { Datas = [] } = data;

    dispatch({
      type: 'edit/setMenuClick',
      payload: {
        currentData: data,
        tabActiveKey:
          Datas.length > 0 ? (Datas[0].Type === 'Tab02' ? Datas[0].ID : undefined) : undefined,
        controls: undefined,
        xMax: 320,
        management: false,
        managementTxt: formatMessage({ id: 'manage' }),
      },
    });

    // 跳转对应链接(写死)
    const tabActiveKey = e.key;
    let routerUrl = '/Editor/BaseInfo';

    switch (tabActiveKey) {
      case 'BaseInfo_tab01':
        routerUrl = '/Editor/BaseInfo';
        break;
      case 'Game_Rules_tab01':
        // 改变步数
        this.goToStep(8);
        routerUrl = '/Editor/GameRules';
        break;
      default:
        routerUrl = '/Editor/BaseInfo';
    }

    // 优化：重复路由不跳转
    if (location.pathname === routerUrl) {
      return;
    } else {
      // 路由切换，关闭图片编辑器
      onClose();
      dispatch({
        type: 'simplePictureCtrl/setNowOprTab',
        payload: {
          nowOprTab: 1,
        },
      });
      router.push(routerUrl);
      // router.push({
      //   pathname: routerUrl,
      //   query: nowGameIdObj,
      // });

      // window.location.href=window.location.protocol+'//'+window.location.host+'/?'+stringify(nowGameIdObj)+'#'+routerUrl;
      // window.location.href=window.location.protocol+'//'+window.location.host+'/#'+routerUrl;
      // window.location.href=Edbox.SetQueryString('EdboxArgs', Edbox.GetLoginInfo(), window.location.protocol+'//'+window.location.host+'/?'+stringify(nowGameIdObj)+'#'+routerUrl);

    }
  };

  onOpenChange = openKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/setNavOpenKey',
      payload: {
        navOpenKey: openKeys,
      },
    });
  };

  render() {
    const { edit } = this.props;
    const { dataSource = {}, currentData = {}, navOpenKey } = edit;
    const { Datas = [] } = dataSource;
    const { ID } = currentData;
    return (
      <div className={styles.nav}>
        {!ID ? null : (
          <Menu
            selectedKeys={[ID]}
            openKeys={navOpenKey}
            mode="inline"
            style={{ width: 200, height: '100%' }}
            theme="light"
            collapsed="false"
            className="menu-con"
            onClick={e => this.handleClick(e)}
            onOpenChange={this.onOpenChange}
          >
            {Datas.map(this.renderMenu)}
          </Menu>
        )}
      </div>
    );
  }
}

export default withRouter(EditorNav);
