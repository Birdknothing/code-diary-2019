import React, { PureComponent } from 'react';
import { Radio } from 'antd';
import styles from './index.scss';

const RadioGroup = Radio.Group;

class Select01 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
    };
  }

  handleChangeValue = e => {
    const value = e.target.value;
    const { config } = this.state;
    const { Keys, Items_Override } = config;
    let { Items = [] } = config;

    Items = Items_Override||Items;

    if (Keys) {
      const valueIndex = Keys.findIndex(item => item === value);
      config.Value = valueIndex > -1 ? Items[valueIndex] : Items[0];
      config.Key = value;
    } else {
      config.Value = value;
      config.Key = value;
      config.Keys = [...Items];
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
        ReadOnly = false,
        Keys,
        VerticalLayout = false,
        Value = '',
        Key,
        Items_Override,
        ErrorText_Override,
      },
    } = this.state;

    let {
      config: {
        Items = [],
        ErrorText = '',
      },
    } = this.state;

    //定义垂直样式
    const verticalRadio = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    let checkedValue;
    if (Key) {
      if (Keys) {
        if (Keys.includes(Key)) {
          checkedValue = Key;
        } else {
          checkedValue = Key[0];
        }
      } else {
        if (Items.includes(Key)) {
          checkedValue = Key;
        } else {
          checkedValue = Items[0];
        }
      }
    } else {
      if (Keys) {
        if (Keys.includes(Value)) {
          checkedValue = Value;
        } else {
          checkedValue = Keys[0];
        }
      } else {
        if (Items.includes(Value)) {
          checkedValue = Value;
        } else {
          checkedValue = Items[0];
        }
      }
    }

    Items = Items_Override||Items;
    ErrorText = ErrorText_Override||ErrorText;

    return (
      <div>
        <div className={styles['input-box']}>
          <RadioGroup
            value={checkedValue}
            disabled={ReadOnly}
            onChange={e => this.handleChangeValue(e)}
          >
            {Items.map((item, index) => {
              return (
                <Radio
                  value={Keys ? Keys[index] : item}
                  style={VerticalLayout ? verticalRadio : null}
                >
                  {item}
                </Radio>
              );
            })}
          </RadioGroup>
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Select01;
