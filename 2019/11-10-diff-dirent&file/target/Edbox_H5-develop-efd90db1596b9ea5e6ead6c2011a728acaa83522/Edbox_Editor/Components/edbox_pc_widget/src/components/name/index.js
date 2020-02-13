import React, {Component} from 'react';
import {Input} from 'antd';
import {formatMessage} from 'umi/locale';
import styles from './index.scss';
import Label from '@/components/label';

class Name extends Component {
    render() {
        const {className, ...inputProps} = this.props;
        return (
            <div className={this.props.className ? this.props.className : null}>
                <Label name={formatMessage({id: 'name'})}/>
                <Input className={styles['input']} {...inputProps}/>
            </div>
        )
    }
}

export default Name;