import React, { PureComponent } from 'react';
import styles from './index.scss';
import imgTop from '@/assets/ico_top.png';

class HtmlDom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  componentWillUnmount() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    if (this.getElTimerClickId) {
      clearTimeout(this.getElTimerClickId);
    }
  }

  goToTop = () => {
    this.getElTimerClickId = setTimeout(() => {
      const { el = window } = this.props;
      let target = 0;
      this.timerId = setInterval(() => {
        target = el.scrollTop;
        target -= Math.ceil(target / 10); //做减速运动
        el.scrollTo(0, target);
        if (target === 0) {
          clearInterval(this.timerId);
        }
      }, 10);
    });
  };
  render() {
    const {visible} = this.props;
    return (
      <div
      className={`${styles['top']} ${visible ? styles['show'] : styles['leave']}`}
      onClick={this.goToTop}
      ref={el => {
        this.handEl = el;
      }}
    >
      <img src={imgTop} alt="" className="img" />
    </div>
    );
  }
}

export default HtmlDom;
