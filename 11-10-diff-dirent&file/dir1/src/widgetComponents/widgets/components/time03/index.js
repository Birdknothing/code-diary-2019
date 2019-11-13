import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './index.scss';

const { RangePicker } = DatePicker;

class Time03 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
      selectedVal: this.props.config.Value,
      open:false,
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

  handleChangeValue = (date, dateString) => {
    this.setState(
      {
        selectedVal: dateString,
      },
      () => {
        // 清除按钮点击
        if (dateString.join('') === '') {
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
  handleOk=()=>{
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
  }

  render() {
    const {
      config: { ReadOnly = false, Property, ErrorText_Override },
      selectedVal,
      open,
    } = this.state;
    const format = 'YYYY.MM.DD HH:mm:ss';
    let {
      config: {  ErrorText = '' },
    } = this.state;
    let showTime = true;

    if(Property && Property.Time === false) {
      showTime = false
    }

    ErrorText = ErrorText_Override||ErrorText;

    return (
      <div>
        <RangePicker
          value={selectedVal[0] ? [moment(selectedVal[0], format), moment(selectedVal[1], format)] :null}
          defaultOpenValue={moment()}
          disabled={ReadOnly}
          format={format}
          showTime={showTime}
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

export default Time03;
