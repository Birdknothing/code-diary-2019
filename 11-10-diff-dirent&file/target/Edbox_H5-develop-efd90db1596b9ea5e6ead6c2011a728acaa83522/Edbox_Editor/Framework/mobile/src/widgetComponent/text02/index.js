import React, { Component } from 'react'
import { TextareaItem } from 'antd-mobile'

class Text02 extends Component {
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
      <TextareaItem
        placeholder={InputHintText}
        value={Value}
        count={Length ? Length : null}
        rows={5}
        onChange={this.handleChange}
      />
    )
  }
}

export default Text02
