import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Empty, message, Spin, BackTop } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import IconFont from '@/components/iconfont';
import Search from '@/components/search';
import ImageBox from './components/imageBox';
import noResultMatchImage from '@/assets/no_result_match.png';
import styles from './index.scss';

const { Edbox } = window;

@connect(({ imageSelector, loading }) => ({
  imageSelector,
  loading: loading.models.imageSelector
}))
class OnlinePictures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchEngineList: [
        {
          id: 1,
          englishName: 'NDR',
          chineseName: 'NDR',
          icon: 'icon-layers'
        },
        {
          id: 2,
          englishName: 'baidu',
          chineseName: '百度',
          icon: 'icon-baidu'
        },
        {
          id: 3,
          englishName: 'google',
          chineseName: '谷歌',
          icon: 'icon-google_plus'
        }
      ], // 搜搜引擎数组
      searchEngine: 1, // 当前的搜索引擎的 id
      tag: 'c47b8182-4bb3-41b3-8af4-7559f1d0a6f2', // 前端分类的 tag
      keyword: '', // 搜索关键字
      currentPage: 1, // 页码
      pageSize: 40, // 每页数量
      total: 0, // 总数
      secondTagList: [
        {
          id: 'c47b8182-4bb3-41b3-8af4-7559f1d0a6f2',
          name: formatMessage({ id: 'all' }),
          parent_id: 'c47b8182-4bb3-41b3-8af4-7559f1d0a6f2'
        }
      ], // 二级分类数组
      pictureList: [], // 图片数据
      loading: false, // 是否加载中
      isShowLoadMore: true, // 是否可以加载更多
      selectedImgURL: '', // 选中图片的 url
      selectedImgGUID: '' // 选中图片的 GUID
    };
  }

  /**
   * 返回上一个地址
   * online 图库有两个入口，一个在 index ，一个在 text_picture 中
   */
  goBack = () => {
    const { imageSelector } = this.props;
    const { isSelectForTextImg } = imageSelector;

    if (isSelectForTextImg) {
      router.push('/Edbox_ImageSelector/text_picture');
    } else {
      router.push('/Edbox_ImageSelector');
    }
  };

  /**
   * 关闭图片编辑区域
   */
  closeWidget = () => {
    Edbox.Message.Broadcast('Close', []);
  };

  /**
   * 搜索处理
   * 基于关键词，优先校验是否含有敏感词
   */
  handleSearch = () => {
    const { keyword } = this.state;

    if (keyword) {
      Edbox.MMO.IsSensitive(
        keyword,
        flag => {
          if (flag.is_sensitive) {
            message.error(formatMessage({ id: 'sensitive_words' }));
            return false;
          } else {
            this.setState(
              {
                currentPage: 1,
                pictureList: [],
                selectedImgURL: '',
                selectedImgGUID: ''
              },
              () => {
                this.getResource();
              },
            );
          }
        },
        error => {
          console.log(error);
        },
      );
    } else {
      this.setState(
        {
          currentPage: 1,
          pictureList: [],
          selectedImgURL: '',
          selectedImgGUID: ''
        },
        () => {
          this.getResource();
        },
      );
    }
  };

  handleEngineChange = EngineID => {
    this.setState(
      {
        searchEngine: EngineID,
        pictureList: []
      },
      () => {
        this.handleMainHeight();
        this.getResource();
      },
    );
  };

  /**
   * 关键词改变
   *
   * @param e object event对象
   */
  handleSearchChange = e => {
    const value = e.target.value;
    this.setState({
      keyword: value
    });
  };

  /**
   * 获取前端分类
   */
  getSortTree = () => {
    const { tag, secondTagList } = this.state;

    Edbox.FrontendLib.GetSortTree(
      tag,
      result => {
        const tempArr = [...secondTagList, ...result];
        this.setState(
          {
            secondTagList: tempArr
          },
          () => {
            this.handleMainHeight();
          },
        );
      },
      error => {
        console.log(error);
      },
    );
  };

  /**
   * 选中二级分类
   *
   * @param data object 二级分类对象
   */
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
        selectedImgGUID: ''
      },
      () => {
        this.getResource();
      },
    );
  };

  /**
   * 获取数据
   *
   * @param page number 页码
   */
  getResource = page => {
    const { searchEngine, currentPage } = this.state;

    this.setState(
      {
        loading: true,
        currentPage: page || currentPage
      },
      () => {
        switch (searchEngine) {
          case 1:
            this.handleSearchByNDR();
            break;
          case 2:
            this.handleSearchByBaiDu();
            break;
          case 3:
            this.handleSearchByGoogle();
            break;
          default:
            break;
        }
      },
    );
  };

  /**
   * NDR 搜索
   */
  handleSearchByNDR = () => {
    const { tag, keyword, currentPage, pageSize, pictureList } = this.state;

    Edbox.FrontendLib.GetResources(
      tag,
      keyword,
      currentPage,
      pageSize,
      result => {
        const tempArr = currentPage === 1 ? [...result.items] : [...pictureList, ...result.items];
        this.setState({
          total: result.total_count,
          pictureList: tempArr,
          loading: false,
          isShowLoadMore: currentPage * pageSize < result.total_count
        });
      },
      error => {
        console.log(error);
        this.setState({
          loading: false
        });
      },
    );
  };

  /**
   * 百度搜索
   */
  handleSearchByBaiDu = () => {
    const { currentPage, keyword } = this.state;
    const BAIDU_PAGESIZE = 30;
    const searchBaiDuImage = async pageIndex => {
      await Edbox.EbService.SearchBaiduImage(
        {
          taskId: Edbox.GetGUID(),
          word: keyword,
          pageIndex: pageIndex
        },
        success => {
          if (success.Code === 'SUCCESS') {
            const { total, imageDatas } = success.Message;
            const { pictureList } = this.state;
            const tempArr = [];

            imageDatas.map(item => {
              return tempArr.push({
                id: Edbox.GetGUID(),
                cover: item,
                title: keyword,
                isCopyright: true
              });
            });
            this.setState(
              {
                currentPage: pageIndex,
                pictureList: [...pictureList, ...tempArr],
                total: total,
                loading: pageIndex < 2 ? true : false,
                isShowLoadMore: currentPage * BAIDU_PAGESIZE < total
              },
              () => {
                if (pageIndex < 2) {
                  searchBaiDuImage(pageIndex + 1);
                }
              },
            );
          }
        },
        error => {
          message.error(error.Message);
          this.setState({
            loading: false
          });
          return false;
        },
      );
    };

    if (keyword !== '') {
      searchBaiDuImage(currentPage);
    } else {
      this.setState({
        loading: true
      });

      message.info(formatMessage({ id: 'search_word' }), 2, () => {
        this.setState({
          loading: false
        });
      });
    }
  };

  /**
   * google 搜索
   */
  handleSearchByGoogle = () => {
    const { currentPage, keyword } = this.state;
    const BAIDU_PAGESIZE = 10;
    const searchGoogleImage = async pageIndex => {
      await Edbox.EbService.SearchGoogleImage(
        {
          taskId: Edbox.GetGUID(),
          word: keyword,
          pageIndex: pageIndex
        },
        success => {
          if (success.Code === 'SUCCESS') {
            const { total, imageDatas } = success.Message;
            const { pictureList } = this.state;
            const tempArr = [];

            imageDatas.map(item => {
              return tempArr.push({
                id: Edbox.GetGUID(),
                cover: item,
                title: keyword,
                isCopyright: true
              });
            });
            this.setState(
              {
                currentPage: pageIndex,
                pictureList: [...pictureList, ...tempArr],
                total: total,
                loading: pageIndex < 5 ? true : false,
                isShowLoadMore: currentPage * BAIDU_PAGESIZE < total
              },
              () => {
                if (pageIndex < 5) {
                  searchGoogleImage(pageIndex + 1);
                }
              },
            );
          }
        },
        error => {
          message.error(error.Message);
          this.setState({
            loading: false
          });
          return false;
        },
      );
    };

    if (keyword !== '') {
      searchGoogleImage(currentPage);
    } else {
      this.setState({
        loading: true,
        pictureList: []
      });

      message.info(formatMessage({ id: 'search_word' }), 2, () => {
        this.setState({
          loading: false
        });
      });
    }
  };

  /**
   * 计算滚动加载区域高度
   *
   */
  handleMainHeight = () => {
    const BODY = document.getElementById('body');
    const FILTER_BLOCK = document.getElementById('filter');
    const SEARCH_TIP = document.getElementById('searchTip');
    const SCROLL_CONTAINER = document.getElementById('scrollContainer');
    const bodyH = BODY.offsetHeight;
    const filterH = FILTER_BLOCK.offsetHeight;
    const searchTipH = SEARCH_TIP ? SEARCH_TIP.offsetHeight : null;
    const scrollContainerH = SEARCH_TIP ? bodyH - filterH - searchTipH : bodyH - filterH;
    SCROLL_CONTAINER.style.height = `${scrollContainerH}px`;
  };

  /**
   * 点击选中图片
   *
   * @param data object 图片对象
   */
  handleClickImg = data => {
    const { cover, id } = data;
    const { selectedImgGUID } = this.state;

    if (id === selectedImgGUID) {
      this.setState({
        selectedImgURL: undefined,
        selectedImgGUID: undefined
      });
    } else {
      this.setState({
        selectedImgURL: cover,
        selectedImgGUID: id
      });
    }
  };

  /**
   * 滚动事件
   */
  handleScroll = () => {
    const { loading, isShowLoadMore } = this.state;
    const oScrollContainer = document.getElementById('scrollContainer');
    const oScrollContent = document.getElementById('scrollContent');
    const containerHeight = oScrollContainer.clientHeight;
    const containerScrollTop = oScrollContainer.scrollTop;
    const contentHeight = oScrollContent.clientHeight;
    const canTriggerLoading = contentHeight - containerHeight - containerScrollTop < 50;

    if (!loading && isShowLoadMore && canTriggerLoading) {
      this.handleLoadingMore();
    }
  };

  /**
   * 加载更多
   */
  handleLoadingMore = () => {
    const { currentPage } = this.state;
    const nextPage = currentPage + 1;
    this.getResource(nextPage);
  };

  /**
   * 确定操作
   */
  handleOK = () => {
    const { selectedImgURL, selectedImgGUID } = this.state;
    const { imageSelector, dispatch } = this.props;
    const { isSelectForTextImg, textImageData } = imageSelector;

    if (isSelectForTextImg) {
      textImageData.backgroundColor = 'transparent';
      textImageData.coverURL = selectedImgURL;

      dispatch({
        type: 'imageSelector/setTextImageData',
        payload: {
          ...textImageData
        }
      });

      router.push('/Edbox_ImageSelector/text_picture');
    } else {
      const selectingImg = {
        GUID: selectedImgGUID,
        coverURL: selectedImgURL,
        name: undefined
      };

      dispatch({
        type: 'imageSelector/setSelectingImg',
        payload: selectingImg
      });

      router.push('/Edbox_ImageSelector');
    }
  };

  componentWillMount() {
    this.getSortTree();
    this.getResource();
  }

  render() {
    const { imageSelector } = this.props;
    const { imageConfig } = imageSelector;
    const { IsShowCloseButton = true } = imageConfig;
    const {
      searchEngineList,
      searchEngine,
      tag,
      total,
      secondTagList,
      pictureList,
      loading,
      selectedImgGUID
    } = this.state;

    return (
      <div className={styles['picture-page-wrap']}>
        <div className={styles['picture-page-head']}>
          <div className={styles['header']}>
            <IconFont
              type="icon-arrow-go-back-fill"
              className={styles['ico-back']}
              onClick={this.goBack}
            />
            {IsShowCloseButton ? (
              <IconFont
                type="icon-close"
                className={styles['ico-close']}
                onClick={this.closeWidget}
              />
            ) : null}
          </div>
        </div>
        <div className={styles['picture-page-body']} id="body">
          <div className={styles['filter-panel']} id="filter">
            <Search
              searchEngineList={searchEngineList}
              defaultEngine={searchEngine}
              placeholder={formatMessage({ id: 'search_word' })}
              onEngineChange={this.handleEngineChange}
              onSearchChange={this.handleSearchChange}
              onSearch={this.handleSearch}
            />
            <div className={searchEngine === 1 ? styles['filter-list'] : styles['hide']}>
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
          <div
            className={searchEngine !== 1 ? styles['search-warn-block'] : styles['hide']}
            id="searchTip"
          >
            <IconFont type="icon-warning" className={styles['icon-warning']} />
            {formatMessage({ id: 'img_search_statement' })}
          </div>
          <div className={styles['result-list']} id="scrollContainer" onScroll={this.handleScroll}>
            <div id="scrollContent">
              {total ? (
                <ul className={styles['list']}>
                  {pictureList.map(item => (
                    <ImageBox
                      key={item.id}
                      data={item}
                      selectedImgGUID={selectedImgGUID}
                      onSelectedImageBox={this.handleClickImg}
                    />
                  ))}
                </ul>
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
          <Button type="primary" disabled={!selectedImgGUID} onClick={() => this.handleOK()}>
            {formatMessage({ id: 'ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default OnlinePictures;
