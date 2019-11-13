import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { InputNumber, Button } from 'antd';
import styles from './index.scss';

class Value04 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
    };
  }

  handleReduce = () => {
    const { config } = this.state;
    const { ChangeValue = 0.01, MinValue = 0.0, Value } = config;
    const stepValue = parseFloat(ChangeValue);

    if (Value === MinValue) {
      return false;
    } else {
      const precision = stepValue.toString().split('.')[1].length;
      const result = parseFloat(Value) - stepValue;
      if (result.toFixed(precision) < MinValue) {
        config.Value = MinValue;
      } else {
        const realVal =
          result.toFixed(precision) <= MinValue ? MinValue : result.toFixed(precision);
        config.Value = realVal;
      }
      this.setState({
        config: {
          ...config,
        },
      });
      this.props.onUpdate(config);
    }
  };

  handleChangeValue = value => {
    const { config } = this.state;
    const { MaxValue = 9999.0, MinValue = 0.0, ChangeValue = 0.01 } = config;

    if (isNaN(value) || (!value && value !== 0)) {
      value = MinValue;
      config.ErrorText = `${formatMessage({
        id: 'float_number_tip_start',
      })} ${MinValue}~${MaxValue} ${formatMessage({ id: 'float_number_tip_end' })}`;
    } else {
      const precision = ChangeValue.toString().split('.')[1].length;
      value = value >= MaxValue ? MaxValue : parseFloat(value).toFixed(precision);
      value = value <= MinValue ? MinValue : parseFloat(value).toFixed(precision);
      config.ErrorText = '';
    }
    config.Value = value;
    this.setState({
      config: {
        ...config,
      },
    });
  };

  handleBlur = () => {
    const { config } = this.state;
    const { Value, ErrorText = '', MaxValue = 9999.0, MinValue = 0.0 } = config;
    const errorText = `${formatMessage({
      id: 'float_number_tip_start',
    })} ${MinValue}~${MaxValue} ${formatMessage({ id: 'float_number_tip_end' })}`;

    if (Value === MinValue && ErrorText === errorText) {
      config.ErrorText = '';
    }

    if (ErrorText && ErrorText !== errorText) {
      return false;
    }

    this.setState({
      config: {
        ...config,
      },
    });

    this.props.onUpdate(config);
  };

  handleAdd = () => {
    const { config } = this.state;
    const { ChangeValue = 0.01, MaxValue = 9999.0, Value } = config;
    const stepValue = parseFloat(ChangeValue);

    if (Value === MaxValue) {
      return false;
    } else {
      const precision = stepValue.toString().split('.')[1].length;
      const result = parseFloat(Value) + stepValue;
      if (result.toFixed(precision) > MaxValue) {
        config.Value = MaxValue;
      } else {
        const realVal =
          result.toFixed(precision) >= MaxValue ? MaxValue : result.toFixed(precision);
        config.Value = realVal;
      }
      this.setState({
        config: {
          ...config,
        },
      });
      this.props.onUpdate(config);
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      config: { ...nextProps.config },
    });
  }

  render() {
    const {
      config: {
        MaxValue = 9999.0,
        MinValue = 0.0,
        UnitText_Override,
        Value = 0,
        ReadOnly = false,
        ChangeValue = 0.01,
        ErrorText_Override,
      },
    } = this.state;

    let {
      config: {
        UnitText = '',
        ErrorText = '',
      },
    } = this.state;

    UnitText = UnitText_Override||UnitText;
    ErrorText = ErrorText_Override||ErrorText;

    return (
      <div>
        <div className={styles['number-box']}>
          <Button
            icon="minus"
            disabled={ReadOnly || Value <= MinValue}
            onClick={this.handleReduce}
          />
          <InputNumber
            className={styles['number-input']}
            min={MinValue}
            max={MaxValue}
            disabled={ReadOnly}
            value={Value}
            step={ChangeValue}
            onChange={this.handleChangeValue}
            onBlur={this.handleBlur}
          />
          <Button icon="plus" disabled={ReadOnly || Value >= MaxValue} onClick={this.handleAdd} />
          <span className={styles['unit-text']}>{UnitText}</span>
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Value04;
