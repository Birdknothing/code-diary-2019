import React, { PureComponent } from 'react';
import { Input, Button, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import shortid from 'shortid';
import styles from './index.scss';

const { Edbox } = window;

@connect(({ edit, loading }) => ({
  edit,
  loading: true,
}))
class Text03 extends PureComponent {
  constructor(props) {
    super(props);
    const {
      config: { Value },
    } = props;
    const strValue = this.toTextValue(Value);

    this.state = {
      initialValue: strValue,
      config: this.props.config,
      controls: this.props.controls,
    };
    this.dataKeys = this.state.config.Value.map(v => shortid.generate());
  }

  toTextValue = (value, mySymbolValue) => {
    let {
      config: { SymbolValue = '' },
    } = this.props;
    SymbolValue = mySymbolValue || SymbolValue;
    const regTopSymbol = new RegExp('^' + SymbolValue);
    let strValue = [];

    if (SymbolValue) {
      strValue = value.map(item => {
        return item.replace(regTopSymbol, '');
      });
    } else {
      strValue = value;
    }

    return strValue;
  };

  handleChangeValue = (e, index) => {
    const { config } = this.state;
    const { Value = [], SymbolValue = '' } = config;
    const value = e.target.value;
    let newValue = this.toTextValue(Value);

    newValue[index] = value;
    // config.Value = newValue;
    // config.TextValue=newValue;
    config.Value = newValue.map(item => {
      return item ? SymbolValue + item : item;
    });

    // 必须时候，至少一个有值(需求要求去掉非空提示)
    // if(IsRequired){
    //   const hasValue = newValue.some(item=>{
    //     return item.length>0;
    //   });
    //   if(hasValue){
    //     config.ErrorText = '';
    //   }else{
    //     config.ErrorText = formatMessage({ id: 'required_text' });
    //   }
    // }

    this.setState({
      config: {
        ...config,
      },
    });
    this.props.onUpdate(config);
  };

  handleBlur = (e, index) => {
    const { dispatch, edit } = this.props;
    const { hasError } = edit;
    const { config } = this.state;
    const { Value = '' } = config;
    const { ErrorText = '' } = config;
    const sensitiveText = formatMessage({ id: 'sensitive_text' });
    const value = e.target.value;

    const strValue = this.toTextValue(Value);

    if (value) {
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
      // if(IsRequired){
      //   const hasValue = config.Value.some(item=>{
      //     return item.length>0;
      //   });
      //   if(hasValue){
      //     config.ErrorText = '';
      //   }else{
      //     config.ErrorText = formatMessage({ id: 'required_text' });
      //   }
      // }

      this.setState({
        config: { ...config },
      });

      this.props.onUpdate(config);
    }
  };

  /**
   * 删除当前文本输入控件
   *
   * @param {Number} index 当前文本输入控件索引
   */
  handleDelete = (e, index) => {
    const { config } = this.props;
    const { Value = [], SymbolValue = '' } = config;
    let newValue = this.toTextValue(Value);

    newValue.splice(index, 1);

    // 遍历数组提示是否有空值存在
    // if(IsRequired){
    //   const hasValue = config.Value.some(item=>{
    //     return item.length>0;
    //   });
    //   if(hasValue){
    //     config.ErrorText = '';
    //   }else{
    //     config.ErrorText = formatMessage({ id: 'required_text' });
    //   }
    // }

    // config.Value = newValue;
    // config.TextValue=newValue;
    config.Value = newValue.map(item => {
      return item ? SymbolValue + item : item;
    });

    this.setState({
      config: { ...config },
    });
    this.props.onUpdate(config);
  };

  /**
   * 添加文本输入控件（最多 5 个）
   */
  handleAdd = () => {
    const { config } = this.props;
    const { Value = [], SymbolValue = '' } = config;
    let newValue = this.toTextValue(Value);

    newValue.push('');

    // 遍历数组提示是否有空值存在
    // if(IsRequired){
    //   const hasValue = config.Value.some(item=>{
    //     return item.length>0;
    //   });
    //   if(hasValue){
    //     config.ErrorText = '';
    //   }else{
    //     config.ErrorText = formatMessage({ id: 'required_text' });
    //   }
    // }

    // config.Value = newValue;
    // config.TextValue=newValue;
    config.Value = newValue.map(item => {
      return item ? SymbolValue + item : item;
    });

    this.setState({
      config: { ...config },
    });

    this.props.onUpdate(config);
  };

  handleEdit = () => {
    const { config } = this.state;
    this.props.onArouse(config);
  };

  componentWillReceiveProps(nextProps) {
    const { config } = nextProps;
    const { Length, SymbolValue = '', Value = [] } = config;
    const strValue = this.toTextValue(Value, SymbolValue);
    let newValue = [];

    for (let i = 0; i < strValue.length; i++) {
      newValue[i] =
        Length && this.getStrLength(strValue[i]) > Length
          ? this.subStrLen(strValue[i], Length)
          : strValue[i];
    }

    config.Value = newValue.map(item => {
      return item ? SymbolValue + item : item;
    });

    this.setState({
      initialValue: newValue,
      config: { ...config },
      controls: { ...nextProps.controls },
    });
  }

  componentDidMount() {
    const { config } = this.props;
    const { Value = [], Length, SymbolValue = '' } = config;
    const strValue = this.toTextValue(Value);
    let newValue = [];

    for (let i = 0; i < strValue.length; i++) {
      newValue[i] =
        Length && this.getStrLength(strValue[i]) > Length
          ? this.subStrLen(strValue[i], Length)
          : strValue[i];
    }

    // config.TextValue=newValue;
    config.Value = newValue.map(item => {
      return item ? SymbolValue + item : item;
    });

    this.setState({
      initialValue: config.Value,
    });
  }

  // 获取字节长度
  getStrLength = str => {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      //单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        len++;
      } else {
        len += 2;
      }
    }
    return len;
  };

  // 截取字节
  subStrLen = (str, len) => {
    // eslint-disable-next-line
    var r = /[^\x00-\xff]/g;
    var m;

    if (str.replace(r, '**').length > len) {
      m = Math.floor(len / 2);

      for (var i = m, l = str.length; i <= l; i++) {
        if (str.substr(0, i).replace(r, '**').length > len) {
          str = str.substr(0, i - 1);
          break;
        }
      }
    }
    return str;
  };

  render() {
    const {
      config: {
        ID,
        Value = [],
        Length,
        ReadOnly = false,
        StyleEdit = true,
        IsRequired = false,
        InputHintText_Override,
        ErrorText_Override,
        MaxCount = 0,
        SymbolValue = '',
      },
      controls,
    } = this.state;

    let {
      config: { InputHintText = '', ErrorText = '' },
    } = this.state;

    InputHintText = InputHintText_Override || InputHintText;
    ErrorText = ErrorText_Override || ErrorText;

    const strValue = this.toTextValue(Value);

    return (
      <div>
        <div
          className={Length ? `${styles['input-box']} ${styles['length']}` : styles['input-box']}
        >
          {strValue.map((item, index) => (
            <div
              className={styles['input-box-item']}
              key={this.dataKeys[index] ? this.dataKeys[index] : index}
            >
              <Input
                className={controls && controls.ID === ID ? `${styles['active']}` : null}
                prefix={SymbolValue}
                value={item}
                placeholder={InputHintText}
                disabled={ReadOnly}
                maxLength={Length ? Length : null}
                onChange={e => this.handleChangeValue(e, index)}
                onBlur={e => this.handleBlur(e, index)}
              />

              {Length ? (
                <div className={styles['max-mun-box']}>
                  <span className={styles['cur-num']}>{this.getStrLength(item)}</span>
                  <span>/{Length}</span>
                </div>
              ) : null}

              <Button
                disabled={IsRequired && Value.length <= 1}
                className={styles['input-box-minus-button']}
                icon="minus"
                onClick={e => this.handleDelete(e, index)}
              />
            </div>
          ))}

          <Button
            icon="plus"
            disabled={MaxCount === 0 ? false : Value.length >= MaxCount}
            onClick={this.handleAdd}
          />

          {StyleEdit && Value.length > 0 ? (
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

export default Text03;
