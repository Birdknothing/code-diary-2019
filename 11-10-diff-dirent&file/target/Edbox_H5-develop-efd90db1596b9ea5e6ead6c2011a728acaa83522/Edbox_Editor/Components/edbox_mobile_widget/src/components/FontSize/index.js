import React, {Component} from 'react';
import {Slider} from 'antd-mobile';
import InputNumber from '@/components/InputNumber';
import styles from './index.scss';

class FontSize extends Component {
    handleChange(val) {
        const {onChange} = this.props;
        onChange(val);
    }
    render() {
        const {size, min, max} = this.props;
        return (
            <div className={`${styles['font-size']} font-size`} onTouchMove={e => e.stopPropagation()}>
                <Slider className={styles['slider']} value={size} min={min} max={max} onChange={this.handleChange.bind(this)}/>
                <InputNumber value={size} min={min} max={max} onChange={this.handleChange.bind(this)}/>
            </div>
        )
    }
}

export default FontSize;