import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { InputNumber, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.scss';
import StepGuideModal from '@/components/StepGuideModal';


@connect(({ global }) => ({
  global,
}))
class Value02 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
    };
  }

  handleReduce = () => {
    const { config } = this.state;
    const { ChangeValue = 1, MinValue = 0, Value } = config;
    const stepValue = parseInt(ChangeValue);

    if (Value === MinValue) {
      return false;
    } else {
      if (Value - stepValue < MinValue) {
        config.Value = MinValue;
      } else {
        const realVal = Value - stepValue <= MinValue ? MinValue : Value - stepValue;
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
    const { MaxValue = 9999, MinValue = 0 } = config;
    const reg = /^-?(0|[1-9][0-9]*)?$/;

    if (!reg.test(value) || (!value && value !== 0)) {
      value = MinValue;
      config.ErrorText = `${formatMessage({
        id: 'int_number_tip_start',
      })} ${MinValue}~${MaxValue} ${formatMessage({ id: 'int_number_tip_end' })}`;
    } else {
      value = parseInt(value);
      value = value >= MaxValue ? MaxValue : value;
      value = value <= MinValue ? MinValue : value;
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
    const { Value, ErrorText = '', MaxValue = 9999, MinValue = 0 } = config;
    const errorText = `${formatMessage({
      id: 'int_number_tip_start',
    })} ${MinValue}~${MaxValue} ${formatMessage({ id: 'int_number_tip_end' })}`;

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
    const { ChangeValue = 1, MaxValue = 9999, Value } = config;
    const stepValue = parseInt(ChangeValue);

    if (Value === MaxValue) {
      return false;
    } else {
      if (Value + stepValue > MaxValue) {
        config.Value = MaxValue;
      } else {
        const realVal = Value + stepValue >= MaxValue ? MaxValue : Value + stepValue;
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
    const {
      config: { Value, MinValue, MaxValue },
      mainStep,
      global:{activeStep}
    } = nextProps;
    let relValue;

    // Value 不在 MinValue ~ MaxValue 范围时进行更新
    if (Value > MaxValue) {
      relValue = MaxValue;
    } else if (Value < MinValue) {
      relValue = MinValue;
    } else {
      relValue = Value;
    }

    nextProps.config.Value = relValue;

    this.setState({
      config: { ...nextProps.config },
    });

    if(this.inputEl&&mainStep){
      if(mainStep.step===activeStep){
        this.inputEl.focus();
      }else{
        this.inputEl.blur();
      }
    }

  }

  render() {
    const {
      config: {
        MaxValue = 9999,
        MinValue = 0,
        UnitText = '',
        Value = 0,
        ReadOnly = false,
        ChangeValue = 1,
        ErrorText = '',
      },
    } = this.state;
    const { mainStep} = this.props;
    // console.log(',,,,,,,,,,,,,,,,,,:',mainStep);

    return (
      <div>
        <div className={styles['number-box']}>
          <Button
            icon="minus"
            disabled={ReadOnly || Value <= MinValue}
            onClick={this.handleReduce}
          />
          {mainStep ? (
            <StepGuideModal
              step={mainStep.step}
              isFixed
              className={styles['input-wrap']}
              handStyle={mainStep.handStyle}
              popStyle={mainStep.popStyle}
              placement={mainStep.placement}
              width={mainStep.width}
              title={mainStep.title}
              isNeedHand={mainStep.isNeedHand}
              footer={mainStep.footer}
            >
              <InputNumber
                className={styles['number-input']}
                min={MinValue}
                max={MaxValue}
                disabled={ReadOnly}
                value={parseInt(Value)}
                step={ChangeValue}
                onChange={this.handleChangeValue}
                onBlur={this.handleBlur}
                ref={el=>this.inputEl=el}
              />
            </StepGuideModal>
          ) : (
            <InputNumber
              className={styles['number-input']}
              min={MinValue}
              max={MaxValue}
              disabled={ReadOnly}
              value={parseInt(Value)}
              step={ChangeValue}
              onChange={this.handleChangeValue}
              onBlur={this.handleBlur}
            />
          )}
          <Button icon="plus" disabled={ReadOnly || Value >= MaxValue} onClick={this.handleAdd} />
          <span className={styles['unit-text']}>{UnitText}</span>
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Value02;
