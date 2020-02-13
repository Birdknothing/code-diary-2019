import React, { PureComponent } from 'react';
// import router from 'umi/router';
import { connect } from 'dva';
import { Tabs, Collapse, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import EditItem from '@/components/EditItem';
// import styles from './index.scss';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const {Edbox} = window;
@connect(({ global, edit, loading }) => ({
  global,
  edit,
  loading: loading.models.global,
}))
class GameRules extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageData: {},
    };
  }
  componentDidMount() {
    Edbox.Start();
    // 当页刷新重新回到第一个
    const {
      edit: { dataSource },
      dispatch,
    } = this.props;
    if (!dataSource) {
      // router.push('/Editor/');
    }

    dispatch({
      type: 'edit/getDataSource',
      callback: originData => {
        const { dataSource } = this.props;
        dispatch({
          type: 'edit/setCurrentData',
          payload: {
            currentData: originData.Datas[1],
          },
        });
        this.setState({
          pageData: dataSource ? dataSource.Datas[1] : originData.Datas[1],
        });
      },
    });
  }

  test = () => {};

  // 去往某步
  goToStep = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/setStep',
      payload: {
        activeStep: val,
      },
    });
    dispatch({
      type: 'global/setIsCanOpr',
      payload: {
        isCanOpr: false,
      },
    });
  };

  // 更新数据
  updateData = config => {
    if (!config.Errortext) {
      const {
        edit: { dataSource, currentData },
        dispatch,
      } = this.props;
      // 遍历树形数据改数据
      const changeValueByLeafId = (leafId, nodes, targetObj) => {
        for (var i = 0; i < nodes.length; i++) {
          if (leafId === nodes[i].ID) {
            nodes[i] = config;
            return;
          }
          if (nodes[i].Datas) {
            var findResult = changeValueByLeafId(leafId, nodes[i].Datas, targetObj);
            if (findResult) {
              return findResult;
            }
          }
        }
      };

      changeValueByLeafId(config.ID, dataSource.Datas, config);
      changeValueByLeafId(config.ID, currentData, config);

      dispatch({
        type: 'edit/updateValue',
        payload: {
          dataSource: { ...dataSource },
          currentData: { ...currentData },
        },
      });
    }
  };

  // 调出图片编辑器
  showEditGameCover = () => {
    const { dispatch } = this.props;
    const { pageData } = this.state;
    const { Datas = [] } = pageData;
    dispatch({
      type: 'edit/setIsShowEditorPlane',
      payload: {
        isShowEditorPlane: true,
      },
    });
    //  console.log('5655656:',Datas[2]);
    dispatch({
      type: 'edit/setNowImgEditorObj',
      payload: {
        nowImgEditorObj: { ...Datas[0].Datas[2].Datas[0] },
      },
    });
    this.goToStep(11);
  };

  render() {
    const { pageData } = this.state;
    const { Datas = [] } = pageData;
    return (
      <div className="edit-item-list-wrap">
        {Datas.length ? (
          <Tabs defaultActiveKey="1" className="widgets-container scroll-tab" onChange={() => {}}>
            <TabPane tab={Datas[0].ShowName} key="1" id="editorContainer">
              <div className="edit-item-cont">
                <div className="widgets-content">
                  <Collapse defaultActiveKey={['1']} className="collapse-con">
                    <Panel header={Datas[0].Datas[0].ShowName} key="1">
                      {/* 数量  新手引导-数量提示11,输入数字12*/}
                      <EditItem
                        config={Datas[0].Datas[0].Datas[0]}
                        onUpdate={this.updateData}
                        onArouse={() => {}}
                        tipStep={{
                          isFixed: true,
                          placement: 'TL',
                          width: 360,
                          step: 8, // 11-3
                          title: formatMessage({ id: 'g_tip_game_rule_tip' }),
                          footer: [
                            <Button
                              key="setname"
                              type="primary"
                              onClick={() => {
                                this.goToStep(9);
                              }}
                            >
                              {formatMessage({ id: 'g_tip_game_rule_next' })}
                            </Button>,
                          ],
                        }}
                        mainStep={{
                          step: 9, // 12-3
                          width: 350,
                          title: formatMessage({ id: 'g_tip_set_game_rule_num' }),
                          isNeedHand: false,
                          footer: [
                            <Button
                              key="setname"
                              type="primary"
                              onClick={() => {
                                this.goToStep(10);
                              }}
                            >
                              {formatMessage({ id: 'g_tip_set_game_rule_num_next' })}
                            </Button>,
                          ],
                        }}
                      />
                      {/* 列 */}
                      <EditItem
                        config={Datas[0].Datas[0].Datas[1]}
                        onUpdate={this.test}
                        onArouse={() => {}}
                      />
                      {/* 碎片需要重新排位置的比例 */}
                      <EditItem
                        config={Datas[0].Datas[0].Datas[2]}
                        onUpdate={this.test}
                        onArouse={() => {}}
                      />
                    </Panel>
                  </Collapse>
                </div>
                <div className="widgets-content">
                  <Collapse defaultActiveKey={['2']} className="collapse-con">
                    <Panel header={Datas[0].Datas[1].ShowName} key="2">
                      {/* 游戏时间 */}
                      <EditItem
                        config={Datas[0].Datas[1].Datas[0]}
                        onUpdate={this.test}
                        onArouse={() => {}}
                      />
                      {/* 时长限制 */}
                      <EditItem
                        config={Datas[0].Datas[1].Datas[1]}
                        onUpdate={this.test}
                        onArouse={() => {}}
                      />
                      {/* 原图显示时间 */}
                      <EditItem
                        config={Datas[0].Datas[1].Datas[2]}
                        onUpdate={this.test}
                        onArouse={() => {}}
                      />
                    </Panel>
                  </Collapse>
                </div>
                <div className="widgets-content">
                  <Collapse defaultActiveKey={['3']} className="collapse-con">
                    <Panel header={Datas[0].Datas[2].ShowName} key="3">
                      {/* 游戏图片 新手引导-选择游戏图片13 */}
                      <EditItem
                        config={Datas[0].Datas[2].Datas[0]}
                        onUpdate={this.test}
                        onArouse={this.showEditGameCover}
                        editorStep={{
                          isFixed: true,
                          step: 10, // 13-3
                          title: formatMessage({ id: 'g_tip_set_game_img' }),
                        }}
                      />
                    </Panel>
                  </Collapse>
                </div>
              </div>
            </TabPane>
          </Tabs>
        ) : null}
      </div>
    );
  }
}

export default GameRules;
