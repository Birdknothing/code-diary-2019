import React, { Component } from 'react';
import {getLocale} from 'umi/locale';
import PropsTypes from 'prop-types';
import Iconfont from '@/components/Iconfont';
import styles from './index.scss';

class AudioSearch extends Component {
    constructor(props) {
        super(props);
        const engineListData = [
            // 搜索引擎下拉数据
            {
                icon: 'icon-layers',
                englishName: 'NDR',
                chinesename: 'NDR',
            },
            {
                icon: 'icon-baidu',
                englishName: 'Baidu',
                chinesename: '百度',
            },
        ];
        this.state = {
            engineListData, // 下拉框数据
            selectedEngine: engineListData[0], // 选中值
            isShowEngineList: false, // 显隐下拉框
            searchKey: '', // 搜索关键字
        };
    }
    // 引擎下拉框显隐
    switchEngine = () => {
        this.setState(prevState => ({
            isShowEngineList: !prevState.isShowEngineList,
        }));
    };

    // 改变选择引擎
    engineChange = item => {
        this.setState(
            prevState => {
                const oldSelectedEngine = prevState.selectedEngine;
                if (item.icon !== oldSelectedEngine.icon) {
                    return {
                        selectedEngine: item,
                    };
                }
            },
            () => {
                this.setState(prevState => ({
                    isShowEngineList: !prevState.isShowEngineList,
                }));
            },
        );
    };

    // 关键词改变
    searchKeyChange = e => {
        this.setState({
            searchKey: e.target.value,
        });
    };
    
    // 回车搜索
    doSearch = e =>{
        const {searchKey, selectedEngine} = this.state;
        const {onSearch} = this.props;
        if(e.keyCode === 13) {
            
            // const data = [];
            const data = [
                {
                    id: 1,
                    name: 'ss1Hospital-Warning all Hospital-Warning all Hospital-Warning allHospital-Warning all Hospital-Warning all Hospital-Warning allHospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '04:02',
                    status: 1 // 已下载
                },
                {
                    id: 2,
                    name: 'ss22Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '03:02',
                    status: 2 // 未下载 
                },
                {
                    id: 3,
                    name: 'ss33Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '03:28',
                    status: 3 // 下载中
                },
                {
                    id: 4,
                    name: 'ss44Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '02:11',
                    status: 4 // 缓存失败或者已删除
                },
                {
                    id: 5,
                    name: 'ss55Hospital-Warning all Hospital-Warning all Hospital-Warning all',
                    time: '01:11',
                    status: 1
                },
            ];
            console.log(`当前搜索关键词为：${searchKey},当前的搜索引擎是：${selectedEngine.englishName}`)
            if(onSearch) {onSearch(data)}
        }
    }
    stopSubmit=(e)=>{
        e.preventDefault();
    }
    render() {
        const { engineListData, selectedEngine, isShowEngineList, searchKey } = this.state;
        const {onClose} = this.props;
        const engineListStyle = isShowEngineList
            ? `${styles[('audio-engine-list')]} ${styles[('on')]}`
            : styles['audio-engine-list'];
        const engineStyle = isShowEngineList? `${styles['audio-engine']} ${styles[('on')]}`: styles['audio-engine'];
         
        return (
            <div className={styles['audio-search-wrap']}>
                <form action="" onSubmit={this.stopSubmit}>
                    <div className={styles['audio-search']}>
                        <div className={engineStyle} onClick={this.switchEngine}>
                            <Iconfont type={selectedEngine.icon} />
                        </div>
                        <input
                            className={styles['audio-input']}
                            type="search"
                            placeholder="search"
                            value={searchKey}
                            onChange={this.searchKeyChange}
                            onKeyUp={this.doSearch}
                        />
                    </div>
                </form>
                <div className={engineListStyle}>
                    {engineListData.map((item, index) => (
                        <div
                            className={styles[('audio-engine-list-item')]}
                            key={index.toString()}
                            onClick={() => {
                                this.engineChange(item);
                            }}
                        >
                            <Iconfont className={styles['icon-engine']} type={item.icon} />
                            <span>{getLocale() === 'en-US' ? item.englishName : item.chineseName}</span>
                        </div>
                    ))}
                </div>
                <Iconfont className={styles['audio-close']} type="icon-close" onClick={onClose} />
            </div>
        );
    }
}
AudioSearch.PropsTypes = {
    onSearch: PropsTypes.func, // 搜索函数
    onClose: PropsTypes.func, // 关闭函数
}
export default AudioSearch;
