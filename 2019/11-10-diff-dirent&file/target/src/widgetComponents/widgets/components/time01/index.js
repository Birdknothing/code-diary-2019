import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './index.scss';

class Time01 extends PureComponent {
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
  }

  handleDisabledTime = () => {
    const { config } = this.state;
    const fnObj = {};

    if(config.Property && config.Property.Hour === false) {
      fnObj.disabledHours = () => this.range(1, 24);
    }

    if(config.Property && config.Property.Minute === false) {
      fnObj.disabledMinutes = () => this.range(1, 24);
    }

    if(config.Property && config.Property.Second === false) {
      fnObj.disabledSeconds = () => this.range(1, 24);
    }

    return fnObj;
  }

  handleChangeValue = (date, dateString) => {
    // console.log('------ :',dateString);
    this.setState(
      {
        selectedVal: dateString,
      },
      () => {
        // 清除 按钮点击或此刻按钮
        if (dateString === ''|| dateString === moment().format('YYYY.MM.DD HH:mm:ss')) {
          this.handleOk(dateString);
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
  handleOk = (val) => {
    this.clickObj = 'btn';
    const nowVal = typeof val ===  'string' ? val: val.format('YYYY.MM.DD HH:mm:ss');
    this.setState(
      prevState => ({
        selectedVal:nowVal? nowVal:prevState.selectedVal,
        config: {
          ...prevState.config,
          Value: nowVal? nowVal :prevState.selectedVal,
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
      selectedVal,
      open,
    } = this.state;

    let {
      config: {  ErrorText = '' },
    } = this.state;

    ErrorText = ErrorText_Override||ErrorText;

    return (
      <div>
        <DatePicker
          className={styles['date-box']}
          disabled={ReadOnly}
          disabledTime={this.handleDisabledTime}
          hideDisabledOptions={true}
          defaultOpenValue={moment()}
          // defaultValue={selectedVal?moment(selectedVal):null}
          value={selectedVal?moment(selectedVal):null}
          format='YYYY.MM.DD HH:mm:ss'
          showTime={{
            hideDisabledOptions: true,
          }}
          open={open}
          onChange={this.handleChangeValue}
          onOpenChange={this.handleOpenChange}
          onOk={this.handleOk}
        />
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Time01;
