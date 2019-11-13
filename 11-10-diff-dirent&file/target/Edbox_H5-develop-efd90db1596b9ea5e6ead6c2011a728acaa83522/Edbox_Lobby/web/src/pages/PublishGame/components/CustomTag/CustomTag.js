import React, { Component } from 'react';
import { Tag } from 'antd';

const { CheckableTag } = Tag;
class CustomTag extends Component {
    constructor(props){
        super(props)
        this.state = {
            checked: this.props.checked
        }
    }

    handleChange = checked => {
        if(this.props.default){
            return;
        }
        this.setState({ checked });
        this.props.onChange(checked,this.props.id)
        
    };

    render() {
        return (
            <CheckableTag className={this.props.default ? 'default' : ''} {...this.props} checked={this.state.checked} onChange={this.handleChange} />
        );
    }
}

export default CustomTag;