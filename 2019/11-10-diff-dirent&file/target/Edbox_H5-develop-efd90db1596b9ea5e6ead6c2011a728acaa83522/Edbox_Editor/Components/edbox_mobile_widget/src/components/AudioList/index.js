import React, { Component } from 'react';
//import { getLocale } from 'umi/locale';
//import { Button } from 'antd-mobile';

import Iconfont from '@/components/Iconfont';
import noResultImg from '@/assets/no-result.png';
import styles from './index.scss';

// 音频列表
class AudioList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selcetedItem: null,
        };
    }

    // 选择列表
    selectedItem = item => {
        const { onSelect } = this.props;
        let temItem = item;

        this.setState(prevState => {
            const oldItem = prevState.selcetedItem;
            if (!oldItem || (oldItem&&oldItem.id !== item.id)) {
                temItem = item;
            }
            if (oldItem && oldItem.id === item.id) {
                temItem = null;
            }

            onSelect && onSelect(temItem);
            return {
                selcetedItem: temItem,
            };
        });
    };

    render() {
        const { data } = this.props;
        const { selcetedItem } = this.state;
        return (
            <div className={!data.length?styles['audio-result-wrap']:''}>
                {data && data.length ? (
                    <div className={styles['audio-list-wrap']}>
                        {data.map(item => {
                            return (
                                <div
                                    className={styles['audio-list-item']}
                                    key={item.id}
                                    onClick={() => this.selectedItem(item)}
                                >
                                    <span className={styles['title']}>{item.name}</span>
                                    <i className={styles['time']}>{item.time}</i>
                                    <Iconfont
                                        className={styles['icon']}
                                        type={
                                            selcetedItem && item.id === selcetedItem.id
                                                ? 'icon-success'
                                                : null
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles['no-result-wrap']}>
                        <img className={styles['img']} src={noResultImg} alt='' />
                        <p>Sorry,there is no search result,you can try</p>
                        <p className={styles['em']}>1.Check spelling or change keywords</p>
                        <p className={styles['em']}>2.Switch the search scope</p>
                    </div>
                )}
            </div>
        );
    }
}

export default AudioList;
