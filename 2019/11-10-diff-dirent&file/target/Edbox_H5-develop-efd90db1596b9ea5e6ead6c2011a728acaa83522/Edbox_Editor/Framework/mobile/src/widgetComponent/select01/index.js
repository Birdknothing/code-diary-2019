import React, { Component } from 'react'
import { List, Radio } from 'antd-mobile'

const RadioItem = Radio.RadioItem

class Select01 extends Component {
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
    const { Items, Value } = config
    return (
      <List>
        {Items.map((val, index) => (
          <RadioItem
            key={index}
            checked={Value === val}
            onChange={() => this.handleChange(val)}>
            {val}
          </RadioItem>
        ))}
      </List>
    )
  }
}

export default Select01
