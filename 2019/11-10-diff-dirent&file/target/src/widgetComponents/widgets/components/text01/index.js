import React, { PureComponent } from 'react';
import { Input, Button, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './index.scss';

const { Edbox } = window;

@connect(({ edit, loading }) => ({
  edit,
  loading: true,
}))
class Text01 extends PureComponent {
  constructor(props) {
    super(props);

    const {
      config: { SymbolValue, Value },
    } = props;
    const regTopSymbol = new RegExp('^' + SymbolValue);
    const strValue = SymbolValue ? Value.replace(regTopSymbol, '') : Value;

    this.state = {
      valueLength: 0,
      initialValue: strValue,
      config: this.props.config,
      controls: this.props.controls,
    };
  }

  handleChangeValue = e => {
    const { config } = this.state;
    const { IsRequired = false, Length, SymbolValue = '' } = config;
    const value = e.target.value;
    let valueLength;

    if (!value && IsRequired) {
      config.ErrorText = formatMessage({ id: 'required_text' });
    } else {
      config.ErrorText = '';
    }

    if (Length) {
      Edbox.MMO.GetStrLen(
        value,
        len => {
          valueLength = len > Length ? Length : len;
          Edbox.MMO.SubStrLen(
            value,
            valueLength,
            data => {
              config.Value = data ? SymbolValue + data : data;
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
      config.Value = value ? SymbolValue + value : value;
    }

    this.setState({
      valueLength: valueLength,
      config: {
        ...config,
      },
    });
  };

  handleBlur = () => {
    const { dispatch, edit } = this.props;
    const { hasError } = edit;
    const { initialValue, config } = this.state;
    const { IsRequired = false, Value = '', SymbolValue = '' } = config;
    // const requiredText = formatMessage({ id: 'required_text' });
    let { ErrorText = '' } = config;
    const sensitiveText = formatMessage({ id: 'sensitive_text' });
    const regTopSymbol = new RegExp('^' + SymbolValue);
    const strValue = SymbolValue ? Value.replace(regTopSymbol, '') : Value;


    if (strValue) {
      Edbox.Editor.IsSensitive(
        strValue,
        flag => {
          if (flag.is_sensitive) {
            config.ErrorText = sensitiveText;

            this.setState({
              config: { ...config },
            });

            this.props.onUpdate(config);

            if (!hasError) {
              dispatch({
                type: 'edit/setGlobalError',
                payload: {
                  hasError: true,
                },
              });
            }

            return false;
          } else {
            if (ErrorText === sensitiveText || ErrorText === '') {
              config.ErrorText = '';

              if (hasError) {
                dispatch({
                  type: 'edit/setGlobalError',
                  payload: {
                    hasError: false,
                  },
                });
              }
            } else {
              if (!hasError) {
                dispatch({
                  type: 'edit/setGlobalError',
                  payload: {
                    hasError: true,
                  },
                });
              }
            }

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
    } else {
      if (IsRequired) {
        // config.Value = initialValue;
        // config.TextValue = initialValue;
        config.Value = initialValue ? SymbolValue + initialValue : initialValue;
      }
      config.ErrorText = '';

      if (hasError) {
        dispatch({
          type: 'edit/setGlobalError',
          payload: {
            hasError: false,
          },
        });
      }
      this.setState({
        config: { ...config },
      });

      this.props.onUpdate(config);
    }
  };

  handleEdit = () => {
    const { config } = this.state;
    this.props.onArouse(config);
  };

  componentDidMount() {
    const { config } = this.props;
    const { SymbolValue, Value } = config;
    const regTopSymbol = new RegExp('^' + SymbolValue);
    const strValue = SymbolValue ? Value.replace(regTopSymbol, '') : Value;

    Edbox.MMO.GetStrLen(
      strValue,
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
    const { config } = nextProps;
    const { SymbolValue, Value } = config;
    const regTopSymbol = new RegExp('^' + SymbolValue);
    const strValue = SymbolValue ? Value.replace(regTopSymbol, '') : Value;

    Edbox.MMO.GetStrLen(
      strValue,
      len => {
        this.setState({
          valueLength: len,
          initialValue: strValue,
          config: { ...config },
          controls: { ...nextProps.controls },
        });
      },
      err => {
        console.log(err);
      },
    );
  }

  render() {
    const {
      valueLength,
      config: {
        ID,
        Length,
        ReadOnly = false,
        StyleEdit = true,
        InputHintText_Override,
        ErrorText_Override,
        SymbolValue = '',
        Value = '',
      },
      controls,
    } = this.state;

    let {
      config: { InputHintText = '', ErrorText = '' },
    } = this.state;

    InputHintText = InputHintText_Override || InputHintText;
    ErrorText = ErrorText_Override || ErrorText;

    const regTopSymbol = new RegExp('^' + SymbolValue, 'g');
    const strValue = SymbolValue ? Value.replace(regTopSymbol, '') : Value;

    return (
      <div>
        <div
          className={Length ? `${styles['input-box']} ${styles['length']}` : styles['input-box']}
        >
          <Input
            className={controls && controls.ID === ID ? `${styles['active']}` : null}
            prefix={SymbolValue}
            value={strValue}
            placeholder={InputHintText}
            disabled={ReadOnly}
            maxLength={Length ? Length : null}
            onChange={e => this.handleChangeValue(e)}
            onBlur={this.handleBlur}
          />
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

export default Text01;
