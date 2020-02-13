import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import EditItem from '@/components/EditItem';

const {Edbox} = window;

@connect(({ global, edit, loading }) => ({
  global,
  edit,
  loading: loading.models.global,
}))
class BaseInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageData: {},
    };
  }

  componentDidMount() {
    Edbox.Start();
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/getDataSource',
      callback: originData => {
        const { dataSource } = this.props;
        dispatch({
          type: 'edit/setCurrentData',
          payload: {
            currentData: originData.Datas[0],
          },
        });
        this.setState({
          pageData: dataSource ? dataSource.Datas[0] : originData.Datas[0],
        });
      },
    });
  }

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
        nowImgEditorObj: { ...Datas[2] },
      },
    });
  };

  render() {
    const { pageData } = this.state;
    const { Datas = [] } = pageData;

    return (
      <div className="edit-item-full-auto-wrap" id="editorContainer">
        {Datas.length ? (
          <Fragment>
            {/* 游戏名称 */}
            <EditItem
              mainStep={{
                isFixed:true,
                step: 0, // 3-3
                width: 245,
                title: formatMessage({ id: 'g_tip_set_game_name' }),
                isNeedHand: false,
              }}
              config={Datas[0]}
              onUpdate={this.updateData}
              onArouse={() => {}}
            />
            {/* 简介 */}
            <EditItem
              mainStep={{
                isFixed:true,
                step: 1, // 4-3
                width: 245,
                title: formatMessage({ id: 'g_tip_set_game_intro' }),
                isNeedHand: false,
              }}
              config={Datas[1]}
              onUpdate={this.updateData}
              onArouse={() => {}}
            />
            {/* 游戏封面 */}
            <EditItem
              editorStep={{
                isFixed:true,
                step: 2, // 5-3
                title: formatMessage({ id: 'g_tip_set_game_cover' }),
              }}
              config={Datas[2]}
              onUpdate={() => {}}
              onArouse={this.showEditGameCover}
            />
          </Fragment>
        ) : null}

        {/*
      <EditItem config={{Value:'测试',Length:15,InputHintText:'请输入',ID:'Game_Name',Width:230,ShowName:'标题',HelpText:'帮助',Type:'Text01'}} onUpdate={this.test}  onArouse={this.test}></EditItem>
        <EditItem config={{Value:'测试',Length:15,InputHintText:'请输入',ID:'Game_Name',Width:230,ShowName:'标题',HelpText:'帮助',IsRequired:true,Type:'Text02'}} onUpdate={this.test} onArouse={this.test}></EditItem>
        <EditItem config={{Value:'http://fz-cs.101.com/v0.1/static/edu_product/esp/assets/e49c7e68-7686-4e7a-8934-fc9f11e6c8af.pkg/c2a4ef535f394dba8ade33545889bb07.png?size=240',Length:15,InputHintText:'请输入',ID:'Game_Name',Width:647,Height:845,ShowName:'标题',HelpText:'帮助',IsRequired:true,Type:'Image01'}} onUpdate={this.test} onArouse={this.test}></EditItem>
        <EditItem config={{Value:2,Length:15,InputHintText:'请输入',ID:'Game_Name',Width:230,ShowName:'标题',HelpText:'帮助',UnitText:'s',MaxValue:20,Type:'Value02'}} onUpdate={this.test} onArouse={this.test}></EditItem>
        <EditItem config={{Value:true,Length:15,InputHintText:'请输入',ID:'Game_Name',Width:230,ShowName:'标题',HelpText:'帮助',UnitText:'s',MaxValue:20,Type:'Switch01'}} onUpdate={this.test} onArouse={this.test}></EditItem>
        */}
      </div>
    );
  }
}

export default BaseInfo;
