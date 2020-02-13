import React, { PureComponent } from 'react';
import { Input, Button, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './index.scss';
const { TextArea } = Input;

const { Edbox } = window;

@connect(({ edit, loading }) => ({
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

    this.keyCode = '';
  }

  handleChangeValue = e => {
    const { config } = this.state;
    const { IsRequired = false, Length, SymbolValue = '' } = config;
    const value = e.target.value;
    const keyCode = this.keyCode;

    let valueLength;

    const regTopEmpty = new RegExp('^' + SymbolValue + '$', 'g'); // 第一行需要去掉特殊符号的情况:删到最后只有一个字
    const regMidEmpty = new RegExp('\\n' + SymbolValue + '(?=\\s*\\n\\w)', 'g'); // 中间行需要去掉特殊符号的情况：那一行是空值或者都是空格
    const regBtmEmpty = new RegExp('\\n' + SymbolValue + '\\s*$', 'g'); // 结尾行需要去掉特殊符号的情况：:删到最后只有一个字

    let strValue = '';
    if ((keyCode === 8 || keyCode === 46) && SymbolValue) {
      strValue = value
        .replace(regTopEmpty, '')
        .replace(regMidEmpty, '')
        .replace(regBtmEmpty, '')
        .replace(new RegExp(SymbolValue, 'g'), '');
    } else {
      strValue = value.replace(new RegExp(SymbolValue, 'g'), '');
    }

    if (!strValue && IsRequired) {
      config.ErrorText = formatMessage({ id: 'required_text' });
    } else {
      config.ErrorText = '';
    }

    if (Length) {
      Edbox.MMO.GetStrLen(
        strValue,
        len => {
          valueLength = len > Length ? Length : len;

          Edbox.MMO.SubStrLen(
            strValue,
            valueLength,
            data => {
              // config.Value = data;
              this.symbolToValue(keyCode, data);
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
      // config.Value = value;
      this.symbolToValue(keyCode, value);
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
    const { Value, ErrorText_Override, IsRequired = false } = config;
    // const requiredText = formatMessage({ id: 'required_text' });
    let { ErrorText = '' } = config;
    const sensitiveText = formatMessage({ id: 'sensitive_text' });

    ErrorText = ErrorText_Override || ErrorText;

    if (Value) {
      Edbox.Editor.IsSensitive(
        config.Value,
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
        config.Value = initialValue;
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

      // if (ErrorText === requiredText) {
      //   config.Value = initialValue;
      //   config.ErrorText = '';

      //   if (hasError) {
      //     dispatch({
      //       type: 'edit/setGlobalError',
      //       payload: {
      //         hasError: false,
      //       },
      //     });
      //   }
      // } else if (ErrorText === '') {
      //   if (hasError) {
      //     dispatch({
      //       type: 'edit/setGlobalError',
      //       payload: {
      //         hasError: false,
      //       },
      //     });
      //   }
      // } else {
      //   if (!hasError) {
      //     dispatch({
      //       type: 'edit/setGlobalError',
      //       payload: {
      //         hasError: true,
      //       },
      //     });
      //   }
      // }

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

  symbolToValue = (keyCode, str) => {
    const { config } = this.state;
    const { SymbolValue = '' } = config;

    const regEnterUnEmpty = /\n(?=\w+)/g; // 中间行有值加特殊符号
    const regFirstRow = /(?=^\w+)/; // 第一行必加特殊符号
    const regTopEmpty = new RegExp('^' + SymbolValue + '$', 'g'); // 第一行需要去掉特殊符号的情况:删到最后只有一个字
    const regMidEmpty = new RegExp('\\n' + SymbolValue + '(?=\\s*\\n\\w)', 'g'); // 中间行需要去掉特殊符号的情况：那一行是空值或者都是空格
    const regBtmEmpty = new RegExp('\\n' + SymbolValue + '\\s*$', 'g'); // 结尾行需要去掉特殊符号的情况：:删到最后只有一个字
    const newValue = str;

    if (SymbolValue) {
      // 只有删除的时候才做尾部去换行和空格
      if (keyCode === 8 || keyCode === 46) {
        config.Value = newValue
          .replace(regFirstRow, SymbolValue)
          .replace(regEnterUnEmpty, '\n' + SymbolValue)
          .replace(regMidEmpty, '\n')
          .replace(regTopEmpty, '')
          .replace(regBtmEmpty, '');
      } else {
        config.Value = newValue
          .replace(regFirstRow, SymbolValue)
          .replace(regEnterUnEmpty, '\n' + SymbolValue)
          .replace(regMidEmpty, '\n')
          .replace(regTopEmpty, '');
      }
    } else {
      config.Value = newValue;
    }
    this.setState(prevState => ({
      config: {
        ...prevState.config,
        ...config,
      },
    }));
  };

  componentDidMount() {
    const { config } = this.props;
    const { SymbolValue = '', Value = '' } = config;
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
    const { SymbolValue = '', Value = '' } = config;
    const regTopSymbol = new RegExp('^' + SymbolValue);
    const regMidSymbol = new RegExp('\\n' + SymbolValue, 'g');

    const strValue = SymbolValue
      ? Value.replace(regTopSymbol, '').replace(regMidSymbol, '\n')
      : Value;

    Edbox.MMO.GetStrLen(
      strValue,
      len => {
        this.setState({
          valueLength: len,
          initialValue: config.Value,
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
        Value = '',
        Length,
        ReadOnly = false,
        StyleEdit = true,
        InputHintText_Override,
        ErrorText_Override,
      },
      controls,
    } = this.state;

    let {
      config: { InputHintText = '', ErrorText = '', SymbolValue = '' },
    } = this.state;
    const strValue = SymbolValue ? (Value ? Value : SymbolValue) : Value;

    InputHintText = InputHintText_Override || InputHintText;
    ErrorText = ErrorText_Override || ErrorText;

    return (
      <div>
        <div
          className={
            controls && controls.ID === ID
              ? `${styles['textarea-box']} ${styles['active']}`
              : styles['textarea-box']
          }
        >
          <TextArea
            className={Length ? styles['textarea'] : null}
            value={strValue}
            placeholder={InputHintText}
            disabled={ReadOnly}
            rows={4}
            // maxLength={Length ? Length+3 : null}
            onChange={e => this.handleChangeValue(e)}
            onKeyDown={e => (this.keyCode = e.keyCode)}
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

export default Text02;
