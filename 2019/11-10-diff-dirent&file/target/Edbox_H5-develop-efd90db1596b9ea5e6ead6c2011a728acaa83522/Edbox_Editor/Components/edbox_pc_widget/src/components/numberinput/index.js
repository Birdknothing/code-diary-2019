import React, {Component} from 'react';
import {InputNumber} from 'antd';
import Label from '@/components/label';
import styles from './index.scss';

class NumberInput extends Component {
    render() {
        const {name, className, ...inputNumberProps} = this.props;
        return (
            <div className={styles['number-input']}>
                <Label name={name}/>
                <div className={`input-number  ${inputNumberProps.disabled ? 'disabled' : ''}`}>
                    <InputNumber {...inputNumberProps} />
                </div>
            </div>
        )
    }
}

export default NumberInput;