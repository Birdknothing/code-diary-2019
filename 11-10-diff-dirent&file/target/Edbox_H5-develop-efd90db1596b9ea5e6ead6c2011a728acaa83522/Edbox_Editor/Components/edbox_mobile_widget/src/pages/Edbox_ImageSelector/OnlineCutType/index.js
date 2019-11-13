import React, {Component} from 'react';
import {formatMessage} from 'umi/locale';
import {connect} from 'dva';
import {Flex} from 'antd-mobile';
import Header from '@/components/Header';
import Search from '@/components/Search';
import Iconfont from '@/components/Iconfont';
import styles from './index.scss';

@connect(({onlineImage}) => ({onlineImage}))

class OnlineCutType extends Component {
    /**
     * 处理搜索引擎变更
     */
    handleSearchEngineChange(id) {
        const {dispatch} = this.props;
        dispatch({
            type: 'onlineImage/changeSearchEngine',
            payload: id
        })
    }
    /**
     * 处理搜索
     */
    handleSearch() {

    }

    render() {
        const {onlineImage} = this.props;
        const {searchEngineList, searchEngineId, imageCutTypeList} = onlineImage;
        return (
            <div className={`${styles['page-wrap']} page-wrap`}>
                <Header className={styles['header']} back confirmTxt={formatMessage({id: 'select'})} title={formatMessage({id: 'online_picture'})} theme="white"/>
                <div className={styles['fixed-hd']}>
                    <Search className={styles['search']} engineList={searchEngineList} engineId={searchEngineId} onEngineChange={this.handleSearchEngineChange.bind(this)} onSearch={this.handleSearch.bind(this)} theme="gray"/>
                    <Iconfont type="icon-close" className={styles['ico-close']}/>
                </div>
                <Flex className={styles['list']} wrap="wrap">
                    {imageCutTypeList && imageCutTypeList.length ? 
                        imageCutTypeList.map(item => 
                            <div className={styles['item']} key={item.id} style={{backgroundImage: `url(${item.url})`}}>
                                {
                                    (() => {
                                        let icon = null;
                                        switch (item.status) {
                                            case 0:
                                                icon = <Iconfont type="icon-download" className={styles['ico-download']}/>;
                                                break;
                                            case 1:
                                                icon = <Iconfont type="icon-loading" className={styles['ico-loading']}/>;
                                                break;
                                            default:
                                                break;
                                        }
                                        return icon;
                                    })()
                                }
                            </div>
                        )
                        : null
                    }
                </Flex>
            </div>
        );
    }
}

export default OnlineCutType;