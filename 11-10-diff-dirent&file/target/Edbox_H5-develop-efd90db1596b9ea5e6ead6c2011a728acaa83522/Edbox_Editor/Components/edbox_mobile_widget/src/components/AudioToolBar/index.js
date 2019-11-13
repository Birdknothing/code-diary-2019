import React, {Component} from 'react';
import router from 'umi/router';
import PropsTypes from 'prop-types';
import {Button, TabBar, Grid} from 'antd-mobile';
import Iconfont from '@/components/Iconfont';
import styles from './index.scss';

const data = Array.from(new Array(9)).map((_val, i) => ({
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    text: `name${i}`,
}));

class AudioToolbar extends Component {
    render() {
        return (
            <div>
                <div className={styles['card-box']}>
                    <span className={styles['card-box-change-btn']}></span>
                    <Grid data={data} hasLine={false} />
                </div>

                <TabBar
                    unselectedTintColor="#666666"
                    noRenderContent="true"
                >
                    <TabBar.Item
                        icon = {
                            <Iconfont type="icon-keyboard"/>
                        }
                    >
                    </TabBar.Item>  
                    <TabBar.Item
                        icon = {
                            <Iconfont type="icon-picture"/>
                        }
                    >
                    </TabBar.Item>
                </TabBar>
            </div>
        )
    }
}

export default AudioToolbar;