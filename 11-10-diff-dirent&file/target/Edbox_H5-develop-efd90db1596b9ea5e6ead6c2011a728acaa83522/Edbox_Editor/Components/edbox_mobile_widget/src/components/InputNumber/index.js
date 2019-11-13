import React, {Component} from 'react';
import {Button} from 'antd-mobile';
import Iconfont from '@/components/Iconfont';
import styles from './index.scss';

class InputNumber extends Component {
    constructor(props) {
        super(props);
        const {step} = this.props;
        this.state = {
            step: step ? step : 1
        }
    }
    handleMinus() {
        const {step} = this.state;
        const {min, onChange} = this.props;
        let value = parseInt(this.input.value);
        value = value - step >= min ? value - step : min;
        onChange(value);
    }
    handlePlus() {
        const {step} = this.state;
        const {max, onChange} = this.props;
        let value = parseInt(this.input.value);
        value = value + step <= max ? value + step : max;
        onChange(value);
    }
    handleChange(e) {
        const {onChange} = this.props;
        onChange(parseInt(e.target.value));
    }
    render() {
        const {value, min, max} = this.props;
        return (
            <div className={styles['input-number']}>
                <Button onClick={this.handleMinus.bind(this)}>
                    <Iconfont type="icon-minus" />
                </Button>
                <input type="number" min={min} max={max} value={value} onChange={this.handleChange.bind(this)} ref={input => this.input = input}/>
                <Button onClick={this.handlePlus.bind(this)}>
                    <Iconfont type="icon-plus" />
                </Button>
            </div>
        )
    }
}

export default InputNumber;