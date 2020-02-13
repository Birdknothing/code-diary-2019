import React, { Component } from 'react';
import { Tooltip, Popover } from 'antd';
import { connect } from 'dva';
import Widgets from './widgets';
import common from './common.scss';

@connect(({ edit, loading }) => ({
  edit,
  loading: loading.models.edit,
}))
class WidgetItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      controls: undefined,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { edit } = nextProps;
    this.setState({
      data: { ...nextProps.data },
      controls: { ...edit.controls },
    });
  }

  handleUpdate = widgetConfig => {
    const { edit, dispatch } = this.props;
    const { currentData, dataSource, controls = {}, dataSourceIndex = {} } = edit;
    const widgetConfigID = widgetConfig.ID;
    const { Datas = [] } = dataSource;
    let data
    let newCurrentData

    const updateIndex = dataSourceIndex[widgetConfigID];
    const updateCurrentDataIndex = dataSourceIndex[currentData.ID];
    const newDealData = JSON.parse(JSON.stringify(Datas));

    // 用于同步监听当前点击的哪一页的数据
    const nowTabId = document.getElementsByClassName("sider-nav")[0].getAttribute('tabId');
    //更新dataSource
    if(!updateIndex)  return;
    /* eslint-disable */
    let newData = eval('newDealData'+ updateIndex.index);
    /* eslint-disable */
    Object.assign(newData, widgetConfig)
    data = newDealData;

    //更新currentData
    newCurrentData = eval('newDealData'+ updateCurrentDataIndex.index);

    if (widgetConfigID === controls.ID) {
      dispatch({
        type: 'edit/setControlsData',
        payload: {
          controls: widgetConfig,
          xMax: 400,
        },
      });
    }
    if(!nowTabId || nowTabId === newCurrentData.ID){
      dispatch({
        type: 'edit/updateData',
        payload: {
          dataSource: {
            ...dataSource,
            Datas: data
          },
          currentData: newCurrentData
        },
      });
    } else{
      dispatch({
        type: 'edit/updateDataNoCurrent',
        payload: {
          dataSource: {
            ...dataSource,
            Datas: data
          },
        },
      });
    }
    window.Edbox.Message.Broadcast('Update', [widgetConfig]);
  };

  handleArouse = data => {
    const { edit, dispatch } = this.props;
    const { controls } = edit;

    if (controls && controls.ID === data.ID) {
      if (controls.EditIndex !== data.EditIndex) {
        dispatch({
          type: 'edit/setControlsData',
          payload: {
            controls: data,
            xMax: 400,
          },
        });
        return false;
      } else {
        dispatch({
          type: 'edit/setControlsData',
          payload: {
            controls: undefined,
            xMax: 400,
          },
        });
      }
    } else {
      dispatch({
        type: 'edit/setControlsData',
        payload: {
          controls: data,
          xMax: 400,
        },
      });
    }
  };

  render() {
    const { edit = {} } = this.props;
    const { controls: propsControls, currentData = {} } = edit;
    const { PageType="Default" } = currentData
    const { data, controls } = this.state;
    const { ID, Type, ShowName_Override, HelpText_Override, HintText_Override, IsRequired = false } = data;
    const WidgetComp = Widgets[Type] ? Widgets[Type] : null;

    // override覆盖
    let {ShowName = '', HelpText = '', HintText = '',} = data;
    ShowName = ShowName_Override||ShowName;
    HelpText = HelpText_Override||HelpText;
    HintText = HintText_Override||HintText;

    return (
      <div className={`${common['widget-item-block']} ${!!propsControls && PageType ==="Default" ? common['widget-item-small'] : ""}`}>
        <div
          className={
            IsRequired
              ? `${common['widget-item-head']} ${common['required']}`
              : `${common['widget-item-head']}`
          }
        >
          <label className={common['widget-item-label']}>{ShowName}</label>
          {HelpText ? (
            <Tooltip overlayClassName="widget-item-tooltip-wrap" placement="bottomLeft" title={HelpText} arrowPointAtCenter>
              <span className={common['widget-item-tip']} />
            </Tooltip>
          ) : null}

        </div>
        <div>
          <WidgetComp
            key={ID}
            config={data}
            controls={controls}
            onUpdate={this.handleUpdate}
            onArouse={this.handleArouse}
          />
        </div>
        {HintText ? (
          <Popover placement="bottomLeft" content={HintText}>
            <p className={common['widget-item-explain']}>{HintText}</p>
          </Popover>
        ) : null}
      </div>
    );
  }
}

export default WidgetItem;
