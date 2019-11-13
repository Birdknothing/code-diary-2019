import React, { Component } from 'react'
import { InputItem } from 'antd-mobile'

class Text01 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      config: this.props.config
    }
  }

  handleChange = (val) => {
    const { config } = this.state
    config.Value = val
    this.setState({
      config: { ...config }
    })
    this.props.onUpdate(config)
  }

  render() {
    const { config } = this.state
    const { InputHintText, Value, Length } = config
    return (
      <InputItem
        placeholder={InputHintText}
        value={Value}
        maxLength={Length ? Length : null}
        clear
        onChange={this.handleChange}
      />
    )
  }
}

export default Text01
