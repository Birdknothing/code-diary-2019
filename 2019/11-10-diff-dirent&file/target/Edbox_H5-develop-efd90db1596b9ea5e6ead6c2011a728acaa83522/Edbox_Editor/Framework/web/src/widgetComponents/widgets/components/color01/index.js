import React, { PureComponent } from 'react';
import { SketchPicker } from 'react-color';
import styles from './index.scss';

class Color01 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
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
      config: { ...nextProps.config },
    });
  }

  handleChangeValue = (color, evnet) => {
    const value = this.rgbaToHex(color.rgb);
    const { config } = this.state;
    config.Value = value;
    this.setState({
      config: {
        ...config,
      },
    });

    this.props.onUpdate(config);
  };

  handleClick = e => {
    this.stopPropagation(e);

    if (this.state.config.ReadOnly === false) {
      //只读时，不显示颜色选择框
      this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }
  };

  //阻止冒泡
  stopPropagation(e) {
    e.nativeEvent.stopImmediatePropagation();
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

  render() {
    const {
      config: { ReadOnly = false, Value = '#FFFFFF', ErrorText_Override },
      displayColorPicker,
    } = this.state;
    const pickerDisplay = {
      display: 'block',
    };
    let defaultColor = null;
    let { config: { ErrorText='' }} = this.state;

    ErrorText = ErrorText_Override||ErrorText;

    if (Value !== '') {
      defaultColor = {
        background: Value,
      };
    }

    const rgba = this.hexToRgba(Value);
    return (
      <div>
        <div className={styles['input-box']}>
          <div className={styles['input-color']}>
            <div className={styles['color-line']} onClick={this.handleClick.bind(this)}>
              <div className={styles['line-box']} style={defaultColor} />
            </div>
            <div className={styles['color-content']}>
              <div
                className={styles['color-picker']}
                style={displayColorPicker ? pickerDisplay : null}
                onClick={this.stopPropagation.bind(this)}
              >
                <SketchPicker
                  disabled={ReadOnly}
                  onChange={this.handleChangeValue.bind(this)}
                  color={rgba}
                />
              </div>
            </div>
          </div>
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Color01;
