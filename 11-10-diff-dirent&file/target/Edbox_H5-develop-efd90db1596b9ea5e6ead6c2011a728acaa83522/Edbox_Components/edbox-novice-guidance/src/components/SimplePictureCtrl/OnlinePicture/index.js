import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Empty, Spin, BackTop } from 'antd';
import { connect } from 'dva';
import styles from './index.scss';

import noResultMatchImage from '@/assets/components/simplepicturectrl/no_result_match.png';
// import IconFont from '@/components/iconfont';
import Search from '@/components/search';
import ImageBox from '../ImageBox';
// import Title from 'antd/lib/skeleton/Title';
import CtrlHeader from '@/components/CtrlHeader';
import DataOnlinePics from '@/data/DataOnlinePics';
import StepGuideModal from '@/components/StepGuideModal';

const { Edbox } = window;
@connect(({ global, simplePictureCtrl, loading }) => ({
  global,
  simplePictureCtrl,
  loading: loading.models.global,
}))
class OnlinePicture extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchEngineList: [
        {
          id: 1,
          englishName: 'NDR',
          chineseName: 'NDR',
          icon: 'icon-layers',
        },
      ],
      searchEngine: 1,
      tag: 'c47b8182-4bb3-41b3-8af4-7559f1d0a6f2',
      keyword: '',
      currentPage: 1,
      pageSize: 30,
      total: 0,
      secondTagList: [
        {
          id: 'c47b8182-4bb3-41b3-8af4-7559f1d0a6f2',
          name: formatMessage({ id: 'all' }),
          parent_id: 'c47b8182-4bb3-41b3-8af4-7559f1d0a6f2',
        },
      ],
      pictureList: [],
      loading: false,
      isShowLoadMore: true,
      selectedImgURL: '',
      selectedImgGUID: '',
      selectedImgData: {
        name: '',
        data: '',
      },
    };
  }

  componentWillMount() {
    this.getSortTree();
    this.getResource();
  }
  getSortTree = () => {
    const { tag, secondTagList } = this.state;

    Edbox.FrontendLib.GetSortTree(
      tag,
      result => {
        const tempArr = [...secondTagList, ...result];
        this.setState({
          secondTagList: tempArr,
        });
      },
      error => {
        console.log(error);
      },
    );
  };
  getResource = page => {
    const {
      tag,
      keyword,
      currentPage,
      pageSize,
      // pictureList
    } = this.state;

    this.setState(
      {
        loading: true,
        currentPage: page || currentPage,
      },
      () => {
        Edbox.FrontendLib.GetResources(
          tag,
          keyword,
          page ? page : currentPage,
          pageSize,
          result => {
            // const tempArr = [...pictureList, ...result.items];
            const tempArr = [...DataOnlinePics.online_pic_list];
            console.log('获取回来的在线图片数据：', tempArr);
            this.setState({
              total: result.total_count,
              pictureList: tempArr,
              loading: false,
              isShowLoadMore: (page || currentPage) * pageSize < result.total_count,
            });
          },
          error => {
            console.log(error);
            this.setState({
              loading: false,
            });
          },
        );
      },
    );
  };
  handleClickSort = data => {
    const { tag } = this.state;
    const curTag = data.id === 'all' ? data.parent_id : data.id;

    if (tag === curTag) {
      return false;
    }

    this.setState(
      {
        tag: curTag,
        currentPage: 1,
        pictureList: [],
        selectedImgURL: '',
        selectedImgGUID: '',
      },
      () => {
        this.getResource();
      },
    );
  };
  handleOK = () => {
    const { dispatch } = this.props;
    const { selectedImgURL, selectedImgTitle, selectedImgGUID } = this.state;
    dispatch({
      type: 'simplePictureCtrl/setSelectedImgData',
      payload: {
        selectedImgData: {
          name: selectedImgTitle,
          url: selectedImgURL,
          source: 'online',
          guid: selectedImgGUID,
        },
      },
    });

    dispatch({
      type: 'simplePictureCtrl/setNowOprTab',
      payload: { nowOprTab: 1 },
    });
    this.goToStep(6);
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


  handleClickImg = data => {
    // console.log('选中图片：', data);
    const { cover, id, title } = data;
    const { selectedImgGUID } = this.state;

    if (id === selectedImgGUID) {

      this.setState({
        selectedImgURL: undefined,
        selectedImgGUID: undefined,
        selectedImgTitle: undefined,
      },()=>{
        // 选中图片前往上一步
        this.goToStep(4);
      });
    } else {
      this.setState({
        selectedImgGUID: id,
        selectedImgURL: cover,
        selectedImgTitle: title,
      },()=>{
        // 选中图片前往下一步
        this.goToStep(5);
      });

    }

  };
  goBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'simplePictureCtrl/setNowOprTab',
      payload: {
        nowOprTab: 1,
      },
    });
  };
  // 关闭事件
  closeWidget = () => {
    const {
      simplePictureCtrl: { onClose },
      dispatch,
    } = this.props;
    onClose();
    dispatch({
      type: 'simplePictureCtrl/setNowOprTab',
      payload: {
        nowOprTab: 1,
      },
    });
  };
  render() {
    const {
      searchEngineList,
      searchEngine,
      secondTagList,
      tag,
      pictureList,
      loading,
      total,
      selectedImgGUID,
    } = this.state;
    return (
      <div className={styles['picture-page-wrap']}>
        <div className={styles['picture-page-head']}>
          <CtrlHeader className="header" isBack onClose={this.closeWidget} goBack={this.goBack} />
        </div>
        <div className={styles['picture-page-body']}>
          <div className={styles['filter-panel']}>
            <Search
              searchEngineList={searchEngineList}
              defaultEngine={searchEngine}
              placeholder={formatMessage({ id: 'search_word' })}
              onSearchChange={() => {}}
              onSearch={() => {}}
            />
            <div className={styles['filter-list']}>
              {secondTagList.map(item => (
                <span
                  className={
                    item.id === tag
                      ? `${styles['filter-list-item']} ${styles['active']}`
                      : styles['filter-list-item']
                  }
                  key={item.id}
                  onClick={() => this.handleClickSort(item)}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
          <div className={styles['result-list']} id="scrollContainer" onScroll={this.handleScroll}>
            <div id="scrollContent">
              {/* 新手引导- 选择在线图片7  */}
              {total ? (
                <StepGuideModal
                  isFixed
                  step={4} // 7-3
                  // handStyle={{ right: '127px', top: '356px', left: 'auto' }}
                  // popStyle={{ right: '316px', top: '280px', left: 'auto' }}
                  // placement="LB"
                  width={240}
                  title={formatMessage({ id: 'g_tip_game_cover_online_sel' })}
                >
                  <ul className={`${styles['list']} clearfix`}>
                    {pictureList.map(item => (
                      <ImageBox
                        key={item.id}
                        data={item}
                        selectedImgGUID={selectedImgGUID}
                        onSelectedImageBox={this.handleClickImg}
                      />
                    ))}
                  </ul>
                </StepGuideModal>
              ) : null}
              {!total && !loading ? (
                <Empty
                  className={styles['empty']}
                  description={formatMessage({ id: 'no_result_match' })
                    .split('<br>')
                    .map((str, i) => (
                      <span key={i}>
                        {str}
                        <br />
                      </span>
                    ))}
                  image={noResultMatchImage}
                />
              ) : null}
              {loading ? (
                <div className={styles['loading-block']}>
                  <Spin size="large" />
                  <p className={styles['loading-text']}>
                    {formatMessage({ id: 'loading_search_result' })}
                  </p>
                </div>
              ) : null}
              <BackTop
                className={styles['go-top']}
                target={() => document.getElementById('scrollContainer')}
              />
            </div>
          </div>
        </div>
        <div className={styles['picture-page-foot']}>
          {/* 新手引导- 选择在线图片点击确定8 */}
          <StepGuideModal
            isFixed
            isNeedModal={false}
            step={5} // 8-3
            handDirection="down"
            title={''}
            className={styles['btn-ok-wrap']}
          >
            <Button type="primary" disabled={!selectedImgGUID} onClick={() => this.handleOK()}>
              {formatMessage({ id: 'ok' })}
            </Button>
          </StepGuideModal>
        </div>
      </div>
    );
  }
}

export default OnlinePicture;
