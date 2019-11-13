import React, { Component } from 'react';
import { Popover } from 'antd';
import IconFont from '@/components/iconfont';
import styles from './index.scss';

class IconButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.selected
    });
  }

  handleClick() {
    const { selected } = this.state;
    const noSelected = this.props.noSelected;

    if (!noSelected) {
      this.setState({
        selected: !selected
      });
    }

    if (this.props.onClick && typeof (this.props.onClick === 'function')) {
      this.props.onClick();
    }
  }
  render() {
    const { selected } = this.state;
    const { className, iconfont, children, toolTip, placement } = this.props;
    const dom = (
      <div
        className={
          styles['btn'] +
          (className ? ' ' + className : '') +
          (selected ? ' ' + styles['selected'] : '')
        }
        onClick={this.handleClick.bind(this)}
      >
        {iconfont ? <IconFont type={iconfont} /> : children}
      </div>
    );
    return toolTip ? (
      <Popover placement={placement ? placement : 'bottom'} content={toolTip}>
        {dom ? dom : null}
      </Popover>
    ) : (
      dom
    );
  }
}

export default IconButton;
