import React, { PureComponent } from 'react';
import { Checkbox } from 'antd';
import styles from './index.scss';

const CheckboxGroup = Checkbox.Group;

class Select03 extends PureComponent {
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
      config.Value = value;
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
        Value = [],
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
      marginLeft: 0,
    };

    Items = Items_Override||Items;
    ErrorText = ErrorText_Override||ErrorText;

    return (
      <div>
        <div className={styles['input-box']}>
          <CheckboxGroup
            value={Key ? Key : Value}
            disabled={ReadOnly}
            onChange={value => this.handleChangeValue(value)}
          >
            {Items.map((item, index) => {
              return (
                <Checkbox
                  style={VerticalLayout ? verticalRadio : null}
                  value={Keys ? Keys[index] : item}
                >
                  {item}
                </Checkbox>
              );
            })}
          </CheckboxGroup>
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Select03;
