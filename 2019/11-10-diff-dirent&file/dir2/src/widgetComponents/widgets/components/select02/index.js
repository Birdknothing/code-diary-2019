import React, { PureComponent } from 'react';
import { Select } from 'antd';
import styles from './index.scss';

const Option = Select.Option;

class Select02 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
    };
  }

  handleChangeValue = value => {
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
      config: { ID, ReadOnly = false, Keys, Value = '', Key, Items_Override, ErrorText_Override, },
    } = this.state;

    let {
      config: {
        Items = [],
        ErrorText = '',
      },
    } = this.state;

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
        <div className={styles['select-box']} id={ID}>
          <Select
            className={styles['select-container']}
            value={checkedValue}
            disabled={ReadOnly}
            getPopupContainer={() => document.getElementById(ID)}
            onChange={e => this.handleChangeValue(e)}
          >
            {Items.map((item, index) => {
              return <Option key={Keys ? Keys[index] : item} value={Keys ? Keys[index] : item}>{item}</Option>;
            })}
          </Select>
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Select02;
