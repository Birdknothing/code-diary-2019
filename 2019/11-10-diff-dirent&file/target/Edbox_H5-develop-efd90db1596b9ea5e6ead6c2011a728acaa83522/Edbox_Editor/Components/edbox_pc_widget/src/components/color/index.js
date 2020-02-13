import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import { formatMessage } from 'umi/locale';
import { Icon } from 'antd';
import Label from '@/components/label';
import styles from './index.scss';

class Color extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.color,
      displayColorPicker: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', () => {
      this.setState({ displayColorPicker: false });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      color: nextProps.color,
    });
  }

  handlePickerClick(e) {
    this.stopPropagation(e);

    if (this.picker.classList.contains('ant-select-open')) {
      this.picker.classList.remove('ant-select-open');
      this.picker.classList.remove('ant-select-focused');
    } else {
      this.picker.classList.add('ant-select-open');
      this.picker.classList.add('ant-select-focused');
    }

    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  handleChangeColor(event) {
    const color = this.rgbaToHex(event.rgb);
    this.setState({
      color: color,
      rgbColor: event.rgb,
    });
    this.props.onUpdate(color);
  }

  //颜色值转化为RGBA值
  hexToRgba(hex) {
    const rgb = [];
    hex = hex.substr(1); //去除前缀 # 号

    if (hex.length === 3) {
      // 处理 "#abc" 成 "#aabbcc"
      hex = hex.replace(/(.)/g, '$1$1');
    }

    if (hex.length === 6) {
      // 处理颜色值，加上透明度，默认为"FF"
      hex = hex + 'FF';
    }

    hex.replace(/../g, function(color) {
      rgb.push(parseInt(color, 0x10).toString()); //按16进制将字符串转换为数字
    });

    const rgba = { r: rgb[0], g: rgb[1], b: rgb[2], a: (rgb[3] / 255).toFixed(2) };
    return rgba;
  }

  //RGBA转化为颜色值
  rgbaToHex(rgba) {
    let color = Object.values(rgba);
    const alpha = parseInt(color[3] * 255);
    color.splice(3, 1, alpha);
    let hex = '#';
    for (var i = 0; i < 4; i++) {
      // 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
      // 'color[i]' 是数组，要转换成字符串.
      // 如果结果是一位数，就在前面补零。例如： A变成0A
      hex += ('0' + Number(color[i]).toString(16)).slice(-2);
    }
    return hex;
  }

  //阻止冒泡
  stopPropagation(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const pickerDisplay = {
      display: 'block',
    };
    // const cover = {
    //     position: 'fixed',
    //     top: '0px',
    //     right: '0px',
    //     bottom: '0px',
    //     left: '0px',
    // }

    const rgba = this.hexToRgba(this.state.color);
    return (
      <div className={this.props.className ? this.props.className : null}>
        <Label name={formatMessage({ id: 'color' })} />
        <div className={styles['color-box']}>
          <div
            className={styles['picker']}
            onClick={this.handlePickerClick.bind(this)}
            ref={picker => (this.picker = picker)}
          >
            <div className={styles['selection'] + ' ant-select-selection'}>
              <div
                className={styles['selected']}
                style={this.state.color ? { backgroundColor: this.state.color } : null}
              />
              <div className={styles['ico-arrow'] + ' ant-select-arrow'}>
                <Icon type="down" className="ant-select-arrow-icon" />
              </div>
            </div>
          </div>
          <div
            className={styles['color-picker']}
            style={this.state.displayColorPicker ? pickerDisplay : null}
            onClick={this.stopPropagation.bind(this)}
          >
            <SketchPicker onChange={this.handleChangeColor.bind(this)} color={rgba} />
          </div>
        </div>
      </div>
    );
  }
}

export default Color;

//<div style={ cover } onClick={ this.handlePickerClick.bind(this)}/>
