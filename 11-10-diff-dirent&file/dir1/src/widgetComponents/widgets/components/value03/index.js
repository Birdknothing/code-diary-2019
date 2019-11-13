import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { InputNumber } from 'antd';
import styles from './index.scss';

class Value03 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
    };
  }

  handleChangeValue = (value, position) => {
    const { config } = this.state;
    const { Value, MaxValue = [9999, 9999], MinValue = [0, 0] } = config;
    const reg = /^-?(0|[1-9][0-9]*)?$/;

    let realValue = Value;
    if (position === 'start') {
      if (!reg.test(value) || (!value && value !== 0)) {
        realValue[0] = MinValue[0];
        config.ErrorText = `${formatMessage({
          id: 'int_number_tip_start',
        })} ${MinValue[0]}~${MaxValue[0]} ${formatMessage({ id: 'int_number_tip_end' })}`;
      } else {
        value = parseInt(value);
        value = value >= MaxValue[0] ? MaxValue[0] : value;
        value = value <= MinValue[0] ? MinValue[0] : value;
        realValue[0] = value;
        config.ErrorText = '';
      }
    } else {
      if (!reg.test(value) || (!value && value !== 0)) {
        realValue[1] = MinValue[1];
        config.ErrorText = `${formatMessage({
          id: 'int_number_tip_start',
        })} ${MinValue[1]}~${MaxValue[1]} ${formatMessage({ id: 'int_number_tip_end' })}`;
      } else {
        value = parseInt(value);
        value = value >= MaxValue[1] ? MaxValue[1] : value;
        value = value <= MinValue[1] ? MinValue[1] : value;
        realValue[1] = value;
        config.ErrorText = '';
      }
    }

    config.Value = realValue;
    this.setState({
      config: {
        ...config,
      },
    });
  };

  handleBlur = position => {
    const { config } = this.state;
    const { Value, ErrorText = '', MaxValue = [9999, 9999], MinValue = [0, 0] } = config;
    let errorText;

    if (position === 'start') {
      errorText = `${formatMessage({
        id: 'int_number_tip_start',
      })} ${MinValue[0]}~${MaxValue[0]} ${formatMessage({ id: 'int_number_tip_end' })}`;
    } else {
      errorText = `${formatMessage({
        id: 'int_number_tip_start',
      })} ${MinValue[1]}~${MaxValue[1]} ${formatMessage({ id: 'int_number_tip_end' })}`;
    }

    if ((Value[0] === MinValue[0] || Value[1] === MinValue[1]) && ErrorText === errorText) {
      config.ErrorText = '';
    }

    if (ErrorText && ErrorText !== errorText) {
      return false;
    }

    const startVal = Value[0];
    const endVal = Value[1];
    if (startVal > endVal) {
      config.Value = [startVal, startVal];
    }

    this.setState({
      config: {
        ...config,
      },
    });

    this.props.onUpdate(config);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      config: { ...nextProps.config },
    });
  }

  render() {
    const {
      config: {
        MaxValue = [9999, 9999],
        MinValue = [0, 0],
        UnitText_Override,
        Value = [],
        ToText = '',
        ReadOnly = false,
        ChangeValue = 1,
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
        <div className={styles['number-range-box']}>
          <InputNumber
            className={styles['number-input']}
            min={MinValue[0]}
            max={MaxValue[0]}
            disabled={ReadOnly}
            value={parseInt(Value[0])}
            step={ChangeValue}
            onChange={val => this.handleChangeValue(val, 'start')}
            onBlur={() => this.handleBlur('start')}
          />
          <span className={styles['to-text']}>{ToText}</span>
          <InputNumber
            className={styles['number-input']}
            min={MinValue[1]}
            max={MaxValue[1]}
            disabled={ReadOnly}
            value={parseInt(Value[1])}
            step={ChangeValue}
            onChange={val => this.handleChangeValue(val, 'end')}
            onBlur={() => this.handleBlur('end')}
          />
          <span className={styles['unit-text']}>{UnitText}</span>
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Value03;
