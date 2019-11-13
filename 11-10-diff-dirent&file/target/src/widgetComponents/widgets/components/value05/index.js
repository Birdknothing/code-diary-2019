import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { InputNumber } from 'antd';
import styles from './index.scss';

class Value05 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
    };
  }

  handleChangeValue = (value, position) => {
    const { config } = this.state;
    const {
      Value = [],
      MaxValue = [9999.0, 9999.0],
      MinValue = [0.0, 0.0],
      ChangeValue = 0.01,
    } = config;
    const precision = ChangeValue.toString().split('.')[1].length;

    let realValue = Value;

    if (position === 'start') {
      if (isNaN(value) || (!value && value !== 0)) {
        realValue[0] = MinValue[0];
        config.ErrorText = `${formatMessage({
          id: 'float_number_tip_start',
        })} ${MinValue[0]}~${MaxValue[0]} ${formatMessage({ id: 'float_number_tip_end' })}`;
      } else {
        value = value >= MaxValue[0] ? MaxValue[0] : parseFloat(value).toFixed(precision);
        value = value <= MinValue[0] ? MinValue[0] : parseFloat(value).toFixed(precision);
        realValue[0] = value;
        config.ErrorText = '';
      }
    } else {
      if (isNaN(value) || (!value && value !== 0)) {
        realValue[1] = MinValue[1];
        config.ErrorText = `${formatMessage({
          id: 'float_number_tip_start',
        })} ${MinValue[1]}~${MaxValue[1]} ${formatMessage({ id: 'float_number_tip_end' })}`;
      } else {
        value = value >= MaxValue[1] ? MaxValue[1] : parseFloat(value).toFixed(precision);
        value = value <= MinValue[1] ? MinValue[1] : parseFloat(value).toFixed(precision);
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
    const { Value, ErrorText = '', MaxValue = [9999.0, 9999.0], MinValue = [0.0, 0.0] } = config;
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
        MaxValue = [9999.0, 9999.0],
        MinValue = [0.0, 0.0],
        UnitText_Override,
        Value = [],
        ToText_Override,
        ReadOnly = false,
        ChangeValue = 0.01,
        ErrorText_Override,
      },
    } = this.state;

    let {
      config: {
        UnitText = '',
        ToText = '',
        ErrorText = '',
      },
    } = this.state;

    UnitText = UnitText_Override||UnitText;
    ToText = ToText_Override||ToText;
    ErrorText = ErrorText_Override||ErrorText;

    return (
      <div>
        <div className={styles['number-range-box']}>
          <InputNumber
            className={styles['number-input']}
            min={MinValue[0]}
            max={MaxValue[0]}
            disabled={ReadOnly}
            value={Value[0]}
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
            value={Value[1]}
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

export default Value05;
