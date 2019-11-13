import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { CSSTransition } from 'react-transition-group';
import styles from './index.scss';



@connect(({ loading }) => ({
  loading: loading.models.global,
}))
/*
  * 弹窗组件
  * @param {Boolean} visible：弹窗可见性
  * @param {String} children：标签内包含的元素
  * @param {Array} footer：底部按钮对象
  * @param {String} myClassName：想单独控制的类名
*/
class NormalModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { visible, children, footer,myClassName } = this.props;
    return (
      <Fragment>
          <CSSTransition in={visible}  timeout={500} classNames="fade" appear
          unmountOnExit >
          <div className={`${styles['normal-modal-wrap']} toppest`}>
            <div className={`${styles['normal-modal']} ${myClassName?myClassName:''}`}>
              <div className={styles['modal-content']}>{children}</div>
              <div className={styles['modal-footer']}>{footer}</div>
            </div>
          </div>
          </CSSTransition>
      </Fragment>
    );
  }
}

export default NormalModal;
