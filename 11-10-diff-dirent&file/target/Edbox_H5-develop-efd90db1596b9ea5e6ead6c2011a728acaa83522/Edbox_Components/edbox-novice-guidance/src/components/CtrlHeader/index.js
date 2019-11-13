import React, { Component } from 'react';
import IconFont from '@/components/iconfont';
import styles from './index.scss';

// 三大控件头部
class CtrlHeader extends Component {
  goBack = () => {
    const { goBack } = this.props;
    if (goBack) {
      goBack();
    }
  };

  handleClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  render() {
    const { title, isBack } = this.props;
    return (
      <div className={styles['header']}>
        {isBack ? (
          <IconFont
            type="icon-arrow-go-back-fill"
            className={styles['ico-back']}
            onClick={this.goBack}
          />
        ) : null}
        {title ? <h3 className={styles['tit']}>{title}</h3> : null}
        <IconFont type="icon-close" className={styles['ico-close']} onClick={this.handleClose} />
      </div>
    );
  }
}

export default CtrlHeader;
