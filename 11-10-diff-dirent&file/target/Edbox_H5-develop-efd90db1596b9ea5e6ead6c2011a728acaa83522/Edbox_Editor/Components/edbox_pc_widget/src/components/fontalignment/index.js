import React, {Component} from 'react';
import {Radio} from 'antd';
import Label from '@/components/label';
import Iconfont from '@/components/iconfont';
import {formatMessage} from 'umi/locale';
import styles from './index.scss';

class FontAlignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            value: nextProps.value
        });
    }

    /**
     * 处理切换变化事件
     * @param {object} e 事件对象
     */
    handleChange(e) {
        const {onChange} = this.props;
        const value = e.target.value;
        this.setState({
            value: value
        });
        if (typeof onChange === 'function') {
            onChange(value);
        }

        this.props.onUpdate(value);
    }

    render() {
        const className = this.props.className ? `${this.props.className} widget` : 'widget';
        const { disabled, value } = this.props;
        const disabledClass = disabled ? 'disabled' : '';

        return (
            <div className={`font-alignment ${className} ${disabledClass}`}>
                <Label name={formatMessage({id: 'alignment'})}/>
                <Radio.Group value={value} disabled={disabled} onChange={this.handleChange.bind(this)}>
                    <Radio.Button value="left">
                        <Iconfont type="icon-align-left"/>
                    </Radio.Button>
                    <Radio.Button value="center">
                        <Iconfont type="icon-align-center"/>
                    </Radio.Button>
                    <Radio.Button value="right">
                        <Iconfont type="icon-align-right"/>
                    </Radio.Button>
                </Radio.Group>
            </div>
        );
    }
}

export default FontAlignment;