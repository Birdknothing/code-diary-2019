import React, { PureComponent } from 'react';
import { Input, Button, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { trim } from '@/utils/helper.js';
import styles from './index.scss';
import StepGuideModal from '@/components/StepGuideModal';
const { TextArea } = Input;

const { Edbox } = window;

@connect(({ global, edit, loading }) => ({
  global,
  edit,
  loading: true,
}))
class Text02 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      valueLength: 0,
      initialValue: this.props.config.Value,
      config: this.props.config,
      controls: this.props.controls,
    };
    this.isChecking = false;
  }

  handleChangeValue = e => {
    const { config } = this.state;
    const { IsRequired = false,Length } = config;
    const value = e.target.value;
    let valueLength;


    if (!value && IsRequired) {
      config.ErrorText = formatMessage({ id: 'required_text' });
    } else {
      config.ErrorText = '';
    }
    // if(value){
    //   this.setStepPower(true);
    // }

    // config.Value = value;
    if (Length) {
      Edbox.MMO.GetStrLen(
        value,
        len => {
          valueLength = len > Length ? Length : len;
          Edbox.MMO.SubStrLen(
            value,
            valueLength,
            data => {
              config.Value = data;
            },
            err => {
              console.log(err);
            },
          );
        },
        err => {
          console.log(err);
        },
      );
    } else {
      valueLength = 0;
      config.Value = value;
    }
    this.setState({
      valueLength: valueLength,
      config: {
        ...config,
      },
    });
  };

  // 设置激活/冻锁设置步骤
  setStepPower = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/setIsCanBeSetStep',
      payload: {
        isCanBeSetStep: val,
      },
    });
  };

  handleBlur = () => {
    // const { dispatch,} = this.props;
    const { initialValue, config } = this.state;
    const { Value, IsRequired = false } = config;
    // const requiredText = formatMessage({ id: 'required_text' });
    const sensitiveText = formatMessage({ id: 'sensitive_text' });

    this.setStepPower(false);

    config.Value = trim(Value);
    if(!Value) {
      if (IsRequired) {
        config.Value = initialValue;
        // this.setStepPower(true);
      }
    }

    this.isChecking = true;
    if (config.Value){
    Edbox.Editor.IsSensitive(
      config.Value,
      flag => {
        this.isChecking = false;
        if (flag.is_sensitive) {
          config.ErrorText = sensitiveText;

          this.setStepPower(false);

          this.setState({
            config: { ...config },
          });

          this.props.onUpdate(config);

          return false;
        } else {
          config.ErrorText = '';

          this.setStepPower(true);

          this.setState({
            config: { ...config },
          });

          this.props.onUpdate(config);
        }
      },
      error => {
        console.log(error);
      },
    );
  }
  };

  handleEdit = () => {
    const { config } = this.state;
    this.props.onArouse(config);
  };

  componentDidMount(){
    const { config } = this.props;

    Edbox.MMO.GetStrLen(
      config.Value,
      len => {
        this.setState({
          valueLength: len,
        });
      },
      err => {
        console.log(err);
      },
    );
  }

  componentWillReceiveProps(nextProps) {
    const { config,mainStep,global:{activeStep} } = nextProps;
    // const { Value, Length } = config;

    // config.Value = Length && Value.length > Length ? Value.substring(0, Length) : Value;
    // this.setState({
    //   initialValue: config.Value,
    //   // config: { ...config },
    //   controls: { ...nextProps.controls },

    // });
    Edbox.MMO.GetStrLen(
      config.Value,
      len => {
        this.setState({
          valueLength: len,
          initialValue: config.Value,
          // config: { ...config },
          controls: { ...nextProps.controls },
        });
      },
      err => {
        console.log(err);
      },
    );
    if(mainStep&&this.textarea){
      if(mainStep.step===activeStep){
        this.textarea.focus();
      }else{
        this.textarea.blur();
      }
    }

  }

  guideGoToNext = () => {
    // const { isTriggerBlur } = this.state;
    // if (!isTriggerBlur) {
      const loop = () => {
        if (this.isChecking) {
          return requestAnimationFrame(loop)
        }

        const {
          dispatch,
          global: {  isCanBeSetStep },
        mainStep:{step},
        } = this.props;
        console.log('guideGoToNext isCanBeSetStep >>>>>', isCanBeSetStep)
        if (isCanBeSetStep) {
          dispatch({
            type: 'global/setStep',
            payload: {
              activeStep: step + 1,
            },
          });
          dispatch({
            type: 'global/setIsCanOpr',
            payload: {
              isCanOpr: true,
            },
          });
        }
      }
      loop()
    // }
  };
  render() {
    const {
      valueLength,
      config: {
        ID,
        Value = '',
        Length,
        ReadOnly = false,
        StyleEdit = true,
        InputHintText = '',
        ErrorText = '',
      },
      controls,
    } = this.state;

    const { mainStep} = this.props;

    const footer = [
      <Button key="setname" type="primary" onClick={this.guideGoToNext}>
        {formatMessage({ id: 'g_tip_ok_game_intro_next' })}
      </Button>,
    ];

    return (
      <div>
        <div
          className={
            controls && controls.ID === ID
              ? `${styles['textarea-box']} ${styles['active']}`
              : styles['textarea-box']
          }
        >
          {mainStep ? (
            <StepGuideModal
              step={mainStep.step}
              isFixed
              handStyle={mainStep.handStyle}
              popStyle={mainStep.popStyle}
              placement={mainStep.placement}
              width={mainStep.width}
              title={mainStep.title}
              isNeedHand={mainStep.isNeedHand}
              footer={footer}
            >
              <TextArea
                className={Length ? styles['textarea'] : null}
                value={Value}
                placeholder={InputHintText}
                disabled={ReadOnly}
                rows={4}
                maxLength={Length ? Length : null}
                onChange={e => this.handleChangeValue(e)}
                onBlur={this.handleBlur}
                ref={el=>this.textarea =el}
              />
            </StepGuideModal>
          ) : (
            <TextArea
              className={Length ? styles['textarea'] : null}
              value={Value}
              placeholder={InputHintText}
              disabled={ReadOnly}
              rows={4}
              maxLength={Length ? Length : null}
              onChange={e => this.handleChangeValue(e)}
              onBlur={this.handleBlur}
            />
          )}
          {Length ? (
            <div className={styles['max-mun-box']}>
              <span className={styles['cur-num']}>{valueLength}</span>
              <span>/{Length}</span>
            </div>
          ) : null}
          {StyleEdit ? (
            <Popover placement="bottom" content={formatMessage({ id: 'text_edit_tip' })}>
              <Button
                className={
                  controls && controls.ID === ID
                    ? `${styles['btn-edit']} ${styles['active']}`
                    : styles['btn-edit']
                }
                shape="circle"
                onClick={() => this.handleEdit()}
              >
                <span className={styles.editIcon} />
              </Button>
            </Popover>
          ) : null}
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Text02;
