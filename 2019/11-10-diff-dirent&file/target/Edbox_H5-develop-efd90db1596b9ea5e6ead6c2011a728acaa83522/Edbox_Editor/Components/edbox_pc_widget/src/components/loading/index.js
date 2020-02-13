import React, {Component} from 'react';
import {Spin} from 'antd';
import styles from './index.scss';

class Loading extends Component {
    render() {
        const {loading, fullscreen} = this.props;

        return(
            loading ?
                <div className={`${styles['loading']} ${fullscreen === false ? '' : styles['fullscreen']}`}>
                    <div className={styles['spin']}>
                        <Spin size="large"/>
                    </div>
                </div>
            : null
        );
    }
}

export default Loading;