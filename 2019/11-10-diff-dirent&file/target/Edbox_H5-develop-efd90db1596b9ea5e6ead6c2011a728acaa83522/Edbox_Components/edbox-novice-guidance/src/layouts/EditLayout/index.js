import React, { PureComponent } from 'react';
import { Layout} from 'antd';
import { connect } from 'dva';
import styles from './index.scss';

import EditorHeader from '@/components/EditorHeader';
import EditorNav from '@/components/EditorNav';
import SimplePictureCtrl from '@/components/SimplePictureCtrl';

const { Sider } = Layout;
@connect(({ global,edit, loading }) => ({
  global,
  edit,
  loading: loading.models.global,
}))
class EditLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/getDataSource',
      callback: originData => {
        dispatch({
          type: 'edit/setData',
          payload: {
            dataSource: originData,
          },
        });
      },
    });

    // 设置游戏id数据对象
    dispatch({
      type: 'edit/getDataGameId',
    });
  }

  // 关闭图片编辑器
  closeEditorPlane = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/setIsShowEditorPlane',
      payload: {
        isShowEditorPlane: false,
      },
    });
  };

  handleAcceptImg = data => {
    const {
      edit: { nowImgEditorObj, dataSource, currentData },
      dispatch,
    } = this.props;

    console.log('接受到的图片数据：',data);

    // 遍历树形数据改数据
    const changeValueByLeafId = (leafId, nodes, targetObj) => {
      for (var i = 0; i < nodes.length; i++) {
        if (leafId === nodes[i].ID) {
          nodes[i].Value = targetObj.url;
          nodes[i].GUID = targetObj.guid;
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
    changeValueByLeafId(nowImgEditorObj.ID, dataSource.Datas, data);
    changeValueByLeafId(nowImgEditorObj.ID, currentData, data);
    // console.log('处理后的数据：',dataSource,currentData);

    dispatch({
      type: 'edit/updateValue',
      payload: {
        dataSource: { ...dataSource },
        currentData: { ...currentData },
      },
    });
  };
  render() {
    const {
      children,
      edit: { isShowEditorPlane = false, nowImgEditorObj = {} },
    } = this.props;

    return (
      <Layout className={`edit-wrap ${styles.layout}`}>
        <EditorHeader />
        <Layout className={styles.edit}>
          <Sider breakpoint="lg" collapsed={false} collapsedWidth="0" className="sider-nav">
            <EditorNav />
          </Sider>
          <Layout>
            <div className={styles.main} id="main">
              <div className={`content ${!isShowEditorPlane ? 'defaultPage' : 'resizeMe'}`}>
                <div className="item-page">{children}</div>
                <div className="item-editor">
                  {isShowEditorPlane ? (
                    <SimplePictureCtrl
                      onOk={this.handleAcceptImg}
                      imageSelector={{ imageConfig: nowImgEditorObj }}
                      onClose={this.closeEditorPlane}
                      // gameCoverStep={[6,7,8,9]}
                      // gameImgStep={[14,15]}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default EditLayout;
