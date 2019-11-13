import React, { PureComponent } from 'react';
import { Switch } from 'antd';
import styles from './index.scss';

class Switch01 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
    };
  }

  handleChangeValue = checked => {
    const { config } = this.state;
    config.Value = checked;
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
      config: { ReadOnly = false, Value = false, ErrorText = '' },
    } = this.state;

    return (
      <div>
        <Switch
          className={styles['switch-box']}
          disabled={ReadOnly}
          checked={Value}
          onChange={this.handleChangeValue}
        />
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Switch01;
