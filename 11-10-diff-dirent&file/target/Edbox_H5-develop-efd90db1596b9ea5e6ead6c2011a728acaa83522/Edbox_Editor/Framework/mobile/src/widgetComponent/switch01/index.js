import React, { Component } from 'react'
import { Switch } from 'antd-mobile'
import styles from './index.less'

class Switch01 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      config: this.props.config
    }
  }

  handleChangeValue = (checked) => {
    const { config } = this.state
    config.Value = checked
    this.setState({
      config: {
        ...config
      }
    })
    this.props.onUpdate(config)
  }

  render() {
    const {
      config: { ReadOnly, Value, DefaultChecked }
    } = this.state

    return (
      <div className={styles['switch-box']}>
        <Switch
          disabled={ReadOnly}
          checked={Value}
          defaultChecked={DefaultChecked}
          onChange={this.handleChangeValue}
        />
      </div>
    )
  }
}

export default Switch01
