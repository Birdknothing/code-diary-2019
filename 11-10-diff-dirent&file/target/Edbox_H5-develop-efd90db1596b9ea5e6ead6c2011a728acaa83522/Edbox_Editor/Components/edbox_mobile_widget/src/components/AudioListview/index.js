import React, { Component } from 'react';
import { getLocale } from 'umi/locale';
import { Tabs } from 'antd-mobile';
import styles from './index.scss';
import AudioFoldTab from '../AudioFoldTab';
import AudioList from '../AudioList';

class AudioListview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thirdLayerData: [],
        };
    }

    componentDidMount() {
        // 默认二级tab的第一个
        this.setState({
            thirdLayerData: this.getSecTypeData()[0].subType,
        });
    }

    // 选择tab项目
    chooseTabItem = value => {
        console.log('选中的三级tab数据', value);
    };

    // 选择列表
    selectedItem = item => {
        const { onSelect } = this.props;
        onSelect && onSelect(item);
        this.setState({
          selcetedItem: item,
        });
    };

    // 获取二级tab数据
    getSecTypeData = () => {
        const { musicType } = this.props;
        const temArr = musicType.map(item => {
            item.title = getLocale() === 'en-US' ? item.englishName : item.chineseName;
            return item;
        });
        return temArr;
    };

    // 二级tab改变
    secTabChange = val => {
        console.log('二级菜单变化：', val);
        this.setState({
            thirdLayerData: [...val.subType],
        });
    };

    render() {
        const { data, isSearchStatus } = this.props;
        const { thirdLayerData } = this.state;
        return (
            <div style={{height:'100%'}}>
                {/* 非搜索状态 、搜索状态的列表*/}
                {!isSearchStatus ? (
                    <Tabs
                        tabs={this.getSecTypeData()}
                        onChange={this.secTabChange}
                        tabBarUnderlineStyle={{
                            transform: 'scaleX(0.3)',
                            borderWidth: '0.05rem',
                            boxShadow: '0 0.04rem 0.1rem rgba(207, 1, 1, 0.8)',
                        }}
                        renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
                    >
                        <div style={{ height: '100%' }}>
                            <AudioFoldTab data={thirdLayerData} onSelect={this.chooseTabItem} />
                            <AudioList data={data} onSelect={this.selectedItem}/>
                        </div>
                    </Tabs>
                ) : (
                    <div className={styles['search-result-wrap']}>
                        {data.length ?  (
                            <div >
                                <div className={styles['related-wrap']}>
                                    <div className={styles['top']}>
                                        <span className={styles['tit']}>Related search:</span>
                                        <div className={styles['list']}>
                                            <span className={styles['tag']}>111</span>
                                            <span className={styles['tag']}>222</span>
                                            <span className={styles['tag']}>222</span>
                                            <span className={styles['tag']}>222</span>
                                        </div>
                                    </div>
                                    <p className={styles['tip']}>
                                        Audio from the network, in order to avoid possible
                                        infringememt,Don't commercial!
                                    </p>
                                </div>
                            </div>
                        ):null}
                        <AudioList data={data} onSelect={this.selectedItem}/>
                    </div>
                )}
            </div>
        );
    }
}

export default AudioListview;
