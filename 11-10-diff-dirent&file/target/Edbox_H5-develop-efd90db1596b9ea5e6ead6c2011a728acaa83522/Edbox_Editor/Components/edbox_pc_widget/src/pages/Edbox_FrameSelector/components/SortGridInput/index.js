import React, { Component } from 'react';
import { Input } from 'antd';
import styles from './index.scss';

class SortGridInput extends Component {
    constructor(props){
        super(props)
        this.state = {
            time: this.props.time,
            origin: this.props.time
        }
    }
    
    handleInputChange = (e) =>{
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '') {
            this.setState({
                time: value
            })
        }
    }

    handleInputBlur = (e) =>{
        const { time, origin } = this.state;
        if(time !== origin){
            if(time < 0.01){
                this.setState({
                    time:  0.01
                },()=>{
                    this.props.onChange(0.01)
                })
            }else if(time > 10){
                this.setState({
                    time: (10).toFixed(2)
                },()=>{
                    this.props.onChange((10).toFixed(2))
                })
            }else{
                this.setState({
                    time: (time*1).toFixed(2)
                },()=>{
                    this.props.onChange((time*1).toFixed(2))
                })
            }
        }
    }

    handleInputEnter = e =>{
        e.target.blur();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.time){
            this.setState({
                time: nextProps.time,
                origin: nextProps.time
            })
        }
    }

    render() {
        const { time } = this.state
        return (
            <p className={`${styles['time']} ignore-elements`}>
                <Input
                value={time}
                size="small"
                onChange={this.handleInputChange}
                onBlur={this.handleInputBlur}
                onPressEnter={this.handleInputEnter}
                suffix='s'
                // onFocus={this.props.focus}
                />
                {/* <input 
                value={time}
                onChange={this.handleInputChange}
                onBlur={this.handleInputBlur}
                onFocus={this.props.focus}
                /> */}
            </p>
        );
    }
}

export default SortGridInput;