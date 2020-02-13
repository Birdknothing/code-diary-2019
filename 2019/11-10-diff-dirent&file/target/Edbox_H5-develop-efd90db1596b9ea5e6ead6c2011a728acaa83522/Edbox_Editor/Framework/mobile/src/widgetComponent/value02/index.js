import React, { Component } from 'react'
import { Stepper } from 'antd-mobile'
import styles from './index.less'

class Value02 extends Component {
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
    const { ChangeValue, MaxValue, MinValue, UnitText, Value } = config

    return (
      <div className={styles['stepper-box']}>
        <Stepper
          showNumber
          step={ChangeValue}
          max={MaxValue}
          min={MinValue}
          value={Value}
          onChange={this.handleChange}
        />
        <span className={styles['unit-text']}>{UnitText}</span>
      </div>
    )
  }
}

export default Value02
