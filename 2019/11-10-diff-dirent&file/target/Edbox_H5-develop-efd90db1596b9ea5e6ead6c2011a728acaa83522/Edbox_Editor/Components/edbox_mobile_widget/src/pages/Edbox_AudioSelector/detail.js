import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Button } from 'antd-mobile';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';
import AudioSearch from '@/components/AudioSearch';
import AudioListview from '@/components/AudioListview';
import Iconfont from '@/components/Iconfont';
import styles from './index.scss';

class EditAudioDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowSearch: false, // 是否显示搜索栏
            musicList: [  // 音频列表数据
                {
                    id: 1,
                    name: '11Hospital-Warning all Hospital-Warning all Hospital-Warning allHospital-Warning all Hospital-Warning all Hospital-Warning allHospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '04:02',
                    status: 1 // 已下载
                },
                {
                    id: 2,
                    name: '22Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '03:02',
                    status: 2 // 未下载 
                },
                {
                    id: 3,
                    name: '33Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '03:28',
                    status: 3 // 下载中
                },
                {
                    id: 4,
                    name: '44Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '02:11',
                    status: 4 // 缓存失败或者已删除
                },
                {
                    id: 5,
                    name: '55Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '01:11',
                    status: 1
                },
                {
                  id: 6,
                  name: '11Hospital-Warning all Hospital-Warning all Hospital-Warning allHospital-Warning all Hospital-Warning all Hospital-Warning allHospital-Warning all Hospital-Warning all Hospital-Warning all',
                  time: '04:02',
                  status: 1 // 已下载
              },
              {
                  id: 7,
                  name: '22Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                  time: '03:02',
                  status: 2 // 未下载 
              },
              {
                  id: 8,
                  name: '33Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                  time: '03:28',
                  status: 3 // 下载中
              },
              {
                  id: 9,
                  name: '44Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                  time: '02:11',
                  status: 4 // 缓存失败或者已删除
              },
              {
                  id: 10,
                  name: '55Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                  time: '01:11',
                  status: 1
              },
            ],
            selcetedItem: null, // 选择中的音频
            isSearchStatus: false, // 控制是否是搜索结果的状态
            musicType: [
              {
                  id: '1',
                  englishName: 'All',
                  chineseName: '全部',
                  subType: [
                      {
                          id: '1_1',
                          englishName: 'All',
                          chineseName: '全部',
                      },
                      {
                          id: '1_2',
                          englishName: 'Animal',
                          chineseName: '动物',
                      },
                      {
                          id: '1_3',
                          englishName: 'Person',
                          chineseName: '人物',
                      },
                      {
                          id: '1_4',
                          englishName: 'Build',
                          chineseName: '建筑',
                      },
                      {
                          id: '1_5',
                          englishName: 'Plant',
                          chineseName: '植物',
                      },
                      {
                          id: '1_6',
                          englishName: 'Biology',
                          chineseName: '生物',
                      },
                      {
                          id: '1_7',
                          englishName: 'Bird',
                          chineseName: '鸟',
                      },
                      {
                          id: '1_8',
                          englishName: 'Bird',
                          chineseName: '鸟',
                      },
                      {
                          id: '1_9',
                          englishName: 'Bird',
                          chineseName: '鸟',
                      }
                  ]
              },
              {
                  id: '2',
                  englishName: 'Acoustics',
                  chineseName: 'xxx',
                  subType: [
                      {
                          id: '2_1',
                          englishName: 'All',
                          chineseName: '全部',
                      },
                      {
                        id: '2_2',
                        englishName: 'Test2-2',
                        chineseName: '测试2-2',
                    }
                  ]
              },
              {
                  id: '3',
                  englishName: 'Backdrop',
                  chineseName: 'xxx',
                  subType: [
                      {
                          id: '3_1',
                          englishName: 'All',
                          chineseName: '全部',
                      }
                  ]
              },
              {
                  id: '4',
                  englishName: 'Acoustics',
                  chineseName: 'xxx',
                  subType: [
                      {
                          id: '4_1',
                          englishName: 'All',
                          chineseName: '全部',
                      }
                  ]
              },
              {
                  id: '5',
                  englishName: 'Test',
                  chineseName: '测试',
                  subType: [
                      {
                          id: '5_1',
                          englishName: 'All',
                          chineseName: '全部',
                      }
                  ]
              }
          ],
        };
    }
    
    // 切换搜索栏
    switchSearch = () => {
        this.setState({
            isShowSearch: true,
        });
    };
    // 关闭搜索栏
    closeSearch = () => {
        this.setState({
            isShowSearch: false,
            isSearchStatus: false,
            musicList: [  // 更新为当前的数据
                {
                    id: 1,
                    name: '11Hospital-Warning all Hospital-Warning all Hospital-Warning allHospital-Warning all Hospital-Warning all Hospital-Warning allHospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '04:02',
                    status: 1 // 已下载
                },
                {
                    id: 2,
                    name: '22Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '03:02',
                    status: 2 // 未下载 
                },
                {
                    id: 3,
                    name: '33Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '03:28',
                    status: 3 // 下载中
                },
                {
                    id: 4,
                    name: '44Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '02:11',
                    status: 4 // 缓存失败或者已删除
                },
                {
                    id: 5,
                    name: '55Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '01:11',
                    status: 1
                },
            ],
        });
    };
    // 选中的音频
    selecteItem = (item)=>{
        this.setState({
            selcetedItem: item,
        });
    }
    // 搜索结果
    searchResult = (data) =>{
        this.setState({
            musicList: data,
            isSearchStatus: true,
        });
    }
    render() {
        const { isShowSearch, musicList,selcetedItem, isSearchStatus, musicType } = this.state;
        return (
            <div className="page-wrap audio-page-wrap">
                <Header
                    className={styles['top-header']}
                    back="true"
                    theme="white"
                    confirmBtn={
                        isShowSearch ? null : (
                            <Iconfont type="icon-success" className={styles['icon-success']} />
                        )
                    }
                    children={
                        isShowSearch ? (
                            <AudioSearch onClose={this.closeSearch} onSearch={this.searchResult} />
                        ) : (
                            <div className={styles['header-children']}>
                                <div className={styles['btns-wrap']}>
                                    <Button className={styles['btns-active']} type="primary">
                                        {formatMessage({ id: 'music' })}
                                    </Button>
                                    <Button className={styles['btns-normal']} type="default">
                                        {formatMessage({ id: 'effects' })}
                                    </Button>
                                </div>
                                <Iconfont
                                    className={styles['icon']}
                                    type="icon-search"
                                    onClick={this.switchSearch}
                                />
                            </div>
                        )
                    }
                />
                <AudioListview musicType={musicType} data={musicList} onSelect={this.selecteItem} isSearchStatus={isSearchStatus}/>
                {selcetedItem&&selcetedItem.id? <AudioPlayer data={selcetedItem} />:null }
            </div>
        );
    }
}

export default EditAudioDetail;
