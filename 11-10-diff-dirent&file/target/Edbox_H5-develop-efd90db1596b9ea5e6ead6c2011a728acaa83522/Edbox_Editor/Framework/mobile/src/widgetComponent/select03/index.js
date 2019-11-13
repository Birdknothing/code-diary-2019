import React, { Component } from 'react'
import { List, Checkbox } from 'antd-mobile'

const CheckboxItem = Checkbox.CheckboxItem

class Select03 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      config: this.props.config
    }
  }

  handleChecked = (value) => {
    const { config } = this.state
    const { Value = [] } = config
    return Value.findIndex((i) => i === value)
  }

  handleChange = (val) => {
    const { config } = this.state
    const { Value } = config
    const newValue = [...Value]
    const index = this.handleChecked(val)
    if (index > -1) {
      newValue.splice(index, 1)
    } else {
      newValue.push(val)
    }
    config.Value = newValue
    this.setState({
      config: { ...config }
    })
    this.props.onUpdate(config)
  }

  render() {
    const { config } = this.state
    const { Items } = config
    return (
      <List>
        {Items.map((val, index) => (
          <CheckboxItem
            key={index}
            checked={this.handleChecked(val) > -1}
            onChange={() => this.handleChange(val)}>
            {val}
          </CheckboxItem>
        ))}
      </List>
    )
  }
}

export default Select03
