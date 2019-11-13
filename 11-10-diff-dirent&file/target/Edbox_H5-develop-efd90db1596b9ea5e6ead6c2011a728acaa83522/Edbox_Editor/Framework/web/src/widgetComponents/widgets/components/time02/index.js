import React, { PureComponent } from 'react';
import { TimePicker, Button } from 'antd';
import moment from 'moment';
import styles from './index.scss';
import { formatMessage } from 'umi/locale';

class Time02 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
      selectedVal: this.props.config.Value,
      open: false,
    };
    // 控制只有点击确定按钮和清除按钮才可以更新保存数据，其余点击空白和取消都是取消不保存数据
    this.clickObj = '';
  }

  /**
   * 返回指定范围的数组
   *
   * @param {Number} start 开始值
   * @param {Number} end 结束值
   * @return {Array} 返回指定范围的数组
   */
  range = (start, end) => {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  /**
   * 禁用小时选项
   *
   * @return {Array} 被禁用的小时集合
   */
  handleDisabledHours = () => {
    const { config } = this.state;

    if (config.Property && config.Property.Hour === false) {
      return this.range(1, 24);
    } else {
      return [];
    }
  };

  /**
   * 禁用分钟选项
   *
   * @return {Array} 被禁用的分钟集合
   */
  handleDisabledMinutes = selectedHour => {
    const { config } = this.state;

    if (config.Property && config.Property.Minute === false) {
      return this.range(1, 59);
    } else {
      return [];
    }
  };

  /**
   * 禁用秒选项
   *
   * @return {Array} 被禁用的秒集合
   */
  handleDisabledSeconds = (selectedHour, selectedMinute) => {
    const { config } = this.state;

    if (config.Property && config.Property.Second === false) {
      return this.range(1, 59);
    } else {
      return [];
    }
  };

  handleChangeValue = (date, dateString) => {
    this.setState(
      {
        selectedVal: dateString,
      },
      () => {
        // 清除按钮点击
        if (dateString === '') {
          this.handleOk();
        }
      },
    );
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      config: { ...nextProps.config },
    });
  }

  handleOpenChange = open => {
    this.setState({ open });
    // 点击空白默认取消
    if (!open && !this.clickObj) {
      this.handleCancle();
    }
  };

  // 取消
  handleCancle = () => {
    this.clickObj = 'btn';
    const { config } = this.state;
    this.props.onUpdate(config);
    this.setState(
      {
        selectedVal: config.Value,
        open: false,
      },
      () => {
        this.clickObj = '';
      },
    );
  };

  // 确定
  handleOk = () => {
    this.clickObj = 'btn';
    this.setState(
      prevState => ({
        config: {
          ...prevState.config,
          Value: prevState.selectedVal,
        },
        open: false,
      }),
      () => {
        const { config } = this.state;
        this.props.onUpdate(config);
        this.clickObj = '';
      },
    );
  };

  render() {
    const {
      config: { ReadOnly = false, ErrorText_Override },
      open,
      selectedVal,
    } = this.state;

    const format = 'HH:mm:ss';

    let {
      config: {  ErrorText = '' },
    } = this.state;

    ErrorText = ErrorText_Override||ErrorText;

    return (
      <div>
        <TimePicker
          open={open}
          className={styles['time-box']}
          disabled={ReadOnly}
          value={selectedVal ? moment(selectedVal, format) : null}
          format={format}
          defaultOpenValue={moment()}
          disabledHours={this.handleDisabledHours}
          disabledMinutes={this.handleDisabledMinutes}
          disabledSeconds={this.handleDisabledSeconds}
          hideDisabledOptions={true}
          onChange={this.handleChangeValue}
          onOpenChange={this.handleOpenChange}
          addon={() => (
            <div className={styles['time-footer']}>
              <Button disabled={!selectedVal} size="small" type="primary" onClick={this.handleOk}>
                {formatMessage({ id: 'time_ok' })}
              </Button>
            </div>
          )}
        />
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Time02;
