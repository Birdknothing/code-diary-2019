import React, { PureComponent, Fragment } from 'react';
import { Tooltip, Popover } from 'antd';
import { connect } from 'dva';
import { isVaildGuid } from '@/utils/helper';
import common from './index.scss';
import Widget from '../Widget';
import StepGuideModal from '@/components/StepGuideModal';

const { Edbox } = window;
@connect(({ global, edit, loading }) => ({
  global,
  edit,
  loading: loading.models.global,
}))
class EditItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getResource(this.props);
  }

  /**
   * 批量获取图片
   */
  getResource = nextProps => {
    const { edit = {} } = nextProps;
    const { currentData = {} } = edit;
    const { Datas = [] } = currentData;
    let GuidList = [];
    for (var index = 0; index < Datas.length; index++) {
      var element = this.getGuidData(Datas[index], false);
      if (element.length > 0) {
        GuidList.push(...element);
      }
    }
    //批量获取图片
    if (GuidList.length) {
      Edbox.NDR.GetList(
        [...new Set(GuidList)],
        data => {
          this.setDatasValue(data);
        },
        err => {},
        null,
        true,
      );
    }
  };

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
        let { GUID, Value, Type, ResourceName } = item;
        if (Type === 'Image02') {
          if (!!GUID) {
            let guidValueList = [];
            GUID.map((g, i) => {
              guidValueList.push(!guidList[g] ? '' : guidList[g].Url);
              return true;
            });
            item.Value = guidValueList;
          }
        } else {
          if (!!GUID && (!ResourceName || !Value)) {
            item.Value = !guidList[GUID] ? '' : guidList[GUID].Url;
            item.ResourceName = !guidList[GUID] ? '' : guidList[GUID].Name;
          } else {
            if ((Type === 'Image01' || Type === 'Audio01') && !ResourceName && !!Value) {
              const Rname = Value.substring(Value.lastIndexOf('/') + 1);
              const Sname = Rname.split('.');
              item.ResourceName = Sname.length > 1 ? Sname[0] : '';
            }
          }
        }
        if (item.Datas && item.Datas.length) {
          item.Datas = updateLoop(item.Datas);
        }
        return item;
      });
    };
    const computeData = updateLoop(currentData.Datas);
    const computeDataSource = updateLoop(dataSource.Datas);
    currentData.Datas = computeData;
    dataSource.Datas = computeDataSource;
    Edbox.Message.Broadcast('Update', [currentData]);
    dispatch({
      type: 'edit/updateValue',
      payload: {
        currentData: currentData,
        dataSource: dataSource,
      },
    });
  };

  /**
   * 获取GUID
   * @param {Object} item获取GUID
   */
  getGuidData = (item, GetAll) => {
    let vdom = [];
    let { Datas = [], GUID, Type, ResourceName, Value } = item;
    const hasChild = Datas.length > 0;
    if (GetAll) {
      if (!!GUID && Type !== 'Image02') {
        if (isVaildGuid(GUID)) {
          vdom.push(GUID);
        }
      }
    } else {
      if (!!GUID) {
        if (Type === 'Image02') {
          GUID.map(i => {
            if (isVaildGuid(i)) {
              vdom.push(i);
            }
            return true;
          });
        } else {
          if (isVaildGuid(GUID) && (!ResourceName || !Value)) {
            vdom.push(GUID);
          }
        }
      }
    }

    if (hasChild) {
      let list = [];
      for (var i of Datas) {
        if (!!i) {
          list.push(...this.getGuidData(i, GetAll));
        }
      }
      vdom = [...vdom, ...list];
    }
    return vdom;
  };
  render() {
    const { config, controls, onUpdate, onArouse, mainStep, editorStep, tipStep } = this.props;
    const { ShowName, IsRequired = false, HelpText, ID, HintText = '', Type = 'Text01' } = config;
    const Comp = Widget[Type];

    return (
      <div className={common['widget-item-block']}>
        <div
          className={
            IsRequired
              ? `${common['widget-item-head']} ${common['required']}`
              : `${common['widget-item-head']}`
          }
        >
          <label className={common['widget-item-label']}>{ShowName}</label>
          {HelpText ? (
            <Fragment>
              {/* 新手引导-玩法规则tip 11 */}
              {tipStep ? (
                <StepGuideModal
                  isFixed
                  step={tipStep.step}
                  handStyle={tipStep.handStyle}
                  popStyle={tipStep.popStyle}
                  width= {tipStep.width}
                  isNeedLeftRightByArrow={tipStep.isNeedLeftRightByArrow}
                  placement={tipStep.placement}
                  className={common['tooltip-wrap']}
                  title={tipStep.title}
                  footer={tipStep.footer}
                >
                  <Tooltip
                    overlayClassName="widget-item-tooltip-wrap"
                    placement="bottomLeft"
                    title={HelpText}
                    arrowPointAtCenter
                  >
                    <span className={common['widget-item-tip']} />
                  </Tooltip>
                </StepGuideModal>
              ) : (
                <Tooltip
                  overlayClassName="widget-item-tooltip-wrap"
                  placement="bottomLeft"
                  title={HelpText}
                  arrowPointAtCenter
                >
                  <span className={common['widget-item-tip']} />
                </Tooltip>
              )}
            </Fragment>
          ) : null}
        </div>
        <div>
          <Comp
            key={ID}
            config={config}
            controls={controls}
            onUpdate={onUpdate}
            onArouse={onArouse}
            mainStep={mainStep}
            editorStep={editorStep}
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

export default EditItem;
