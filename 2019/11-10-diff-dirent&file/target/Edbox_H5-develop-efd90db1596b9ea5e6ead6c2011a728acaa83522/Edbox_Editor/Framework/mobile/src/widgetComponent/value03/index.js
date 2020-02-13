import React, { Component } from 'react'
import { Stepper } from 'antd-mobile'
import styles from './index.less'

class Value03 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      config: this.props.config
    }
  }

  handleChange = (val, position) => {
    const { config } = this.state
    const { Value } = config
    const newValue = [...Value]
    if (position === 'start') {
      newValue[0] = val
    } else {
      newValue[1] = val
    }

    config.Value = newValue
    this.setState({
      config: { ...config }
    })
    this.props.onUpdate(config)
  }

  render() {
    const { config } = this.state
    const { ChangeValue, MaxValue, MinValue, ToText, UnitText, Value } = config

    return (
      <div className={styles['stepper-range-box']}>
        <Stepper
          showNumber
          step={ChangeValue}
          max={MaxValue[0]}
          min={MinValue[0]}
          value={Value[0]}
          onChange={(val) => this.handleChange(val, 'start')}
        />
        <span className={styles['to-text']}>{ToText}</span>
        <Stepper
          showNumber
          step={ChangeValue}
          max={MaxValue[1]}
          min={MinValue[1]}
          value={Value[1]}
          onChange={(val) => this.handleChange(val, 'end')}
        />
        <span className={styles['unit-text']}>{UnitText}</span>
      </div>
    )
  }
}

export default Value03
