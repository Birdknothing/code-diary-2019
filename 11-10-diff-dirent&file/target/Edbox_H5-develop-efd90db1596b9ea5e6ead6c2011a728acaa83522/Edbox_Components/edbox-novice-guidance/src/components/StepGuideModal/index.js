import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import styles from './index.scss';

@connect(({ global,lobby, loading }) => ({
  global,
  lobby,
  loading: loading.models.global,
}))
/*
 * 步数弹窗组件（有箭头绝对定位和fixed定位）
 * @param {String} placement(12种)：绝对定位和fixed定位的箭头指向，必填
 *   absolute定位上左方：TL；
 *   absolute定位上方：Top；
 *   absolute定位上右方：TR；
 *   absolute定位左上方：LT；
 *   absolute定位左方：Left；
 *   absolute定位左下方：LB；
 *   absolute定位下左方：BL；
 *   absolute定位下方：Bottom；
 *   absolute定位下右方：BR；
 *   absolute定位右下方：RB；
 *   absolute定位右下方：RB；
 *   absolute定位右方：Right；
 *   absolute定位右上方：RT；
 * @param {Array} footer：底部按钮对象，选填
 * @param {String} title：文本提示文本内容，选填
 * @param {String} className:想单独控制的类名，选填
 * @param {Number} step：第几步，从1开始，必填
 * @param {Number} width:弹窗的宽度，选填，默认292
 * @param {Boolean} isFixed:是否需要fixed定位，选填，默认false
 * @param {Object} handStyle:手势定位，当isFixed为真必填，否则选填
 * @param {Object} popStyle: 弹窗定位，当isFixed为真必填，否则选填
 * @param {Number} delay: 延迟毫秒数，选填
 * @param {Boolean} isNeedModal: 是否需要弹窗，选填，默认true
 * @param {Boolean} isNeedHand: 是否需要手型，选填，默认true
 * @param {String} handDirection: 手型指向，选填，默认空字符向上，如果向下传down
 * @param {Boolean} isNeedLeftRightByArrow: 是否需要左右对齐的时候按照箭头对齐，选填，默认false，也就是按照弹窗边界左右对齐
 */
class StepGuideModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRenderFixed: false, // 感知
      modalStyle: {
        width: `${props.width}px`,
      },
      canClick: false,
    };
  }

  componentDidMount() {
    if (!this.props.isFixed) {
      this.setAbsoluteModalStyle();
    }

    this.renderFixed();
  }

  componentWillUnmount() {
    this.clearMyTimeout();
  }
  // 清除定时器
  clearMyTimeout = () => {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    if (this.timerId2) {
      clearTimeout(this.timerId2);
    }
    if (this.timerId3) {
      clearTimeout(this.timerId3);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.global.activeStep !== nextProps.global.activeStep||
      this.props.global.isCanOpr !== nextProps.global.isCanOpr||
      this.props.lobby.layoutShow !== nextProps.lobby.layoutShow
    ) {
      if (!this.props.isFixed) {
        this.setAbsoluteModalStyle();
      }
      this.renderFixed(nextProps);
    }
  }

  // 绝对定位是设置弹窗样式
  setAbsoluteModalStyle = cb => {
    const { placement } = this.props;

    this.clearMyTimeout();
    this.timerId = setTimeout(() => {
      if (this.wrapEl && this.modalEl) {
        const nowModalStyle = this.calculateModalStyle(placement);
        this.setState(
          prevState => ({
            modalStyle: { ...prevState.modalStyle, ...nowModalStyle },
          }),
          () => {
            if (cb) {
              cb();
            }
          },
        );
      }
    });
  };

  // fixed定位时候可视区判断
  adjustVisualArea = (ref, cb) => {
    const { step, global } = this.props;
    const visible = global.activeStep === step ? true : false;
    if(ref){
      if (ref.getBoundingClientRect().top+70 < window.innerHeight) {
        if (cb) {
          cb();
        }
      } else {
        const container = document.getElementById('editorContainer');

        const scrollLen = ref.getBoundingClientRect().top - window.innerHeight / 2;
        // 只有在可见的情况下做滚动
        if (visible && container) {
          container.scrollTop = scrollLen;
        }
        if (cb) {
          cb();
        }
      }
    }

  };

  // 弹窗定位类型的确定(el:主体位置)
  calculateModalPos = el => {
    let modalPlacement = ''; // 弹窗定位位置
    const pos = {
      left: el.getBoundingClientRect().left,
      top: el.getBoundingClientRect().top,
      right: window.innerWidth - el.getBoundingClientRect().left - el.clientWidth,
      bottom: window.innerHeight - el.getBoundingClientRect().top - el.clientHeight,
    };

    const posArr = [pos.left, pos.top, pos.right, pos.bottom];

    const max = Math.max.apply(null, posArr);
    let firstPosDir = ''; // 弹窗整体放在主体位置的哪一个方向
    for (let key in pos) {
      if (pos[key] === max) {
        firstPosDir = key;
        break;
      }
    }

    let secPosArr = [];
    let secMax = 0;
    let secPosDir = ''; // 弹窗整体放在主体位置的偏向哪一个方向
    if (firstPosDir === 'left' || firstPosDir === 'right') {
      secPosArr = [pos.top, pos.bottom];
      secMax = Math.max.apply(null, secPosArr);
    }
    if (firstPosDir === 'top' || firstPosDir === 'bottom') {
      secPosArr = [pos.left, pos.right];
      secMax = Math.max.apply(null, secPosArr);
    }

    for (let secKey in pos) {
      if (pos[secKey] === secMax) {
        secPosDir = secKey;
        break;
      }
    }
    let lastSecPosDir = '';
    switch (secPosDir) {
      case 'left':
        lastSecPosDir = 'right';
        break;
      case 'right':
        lastSecPosDir = 'left';
        break;
      case 'top':
        lastSecPosDir = 'bottom';
        break;
      case 'bottom':
        lastSecPosDir = 'top';
        break;
      default:
        lastSecPosDir = secPosDir;
    }

    modalPlacement =
      firstPosDir.slice(0, 1).toUpperCase() + lastSecPosDir.slice(0, 1).toUpperCase();
    // console.log('最终确定的弹窗位置：', el, modalPlacement, pos);
    return modalPlacement;
  };

  // 返回弹窗样式(绝对定位)
  calculateModalStyle = nowModalPos => {
    const { width, isNeedLeftRightByArrow } = this.props;
    const wrapH = this.wrapEl.clientHeight;
    const wrapW = this.wrapEl.clientWidth;
    const modalH = this.modalEl.offsetHeight;
    const modalW = this.props.width;
    const selfIsNeedLeftRightByArrow = isNeedLeftRightByArrow
      ? isNeedLeftRightByArrow
      : wrapW <= 40
      ? true
      : false;

    let modalStyle = {};
    switch (nowModalPos) {
      case 'Top':
        modalStyle = {
          bottom: `${wrapH + 14}px`,
          left: '50%',
          marginLeft: `${-modalW / 2}px`,
        };
        break;
      case 'TL':
        modalStyle = {
          bottom: `${wrapH + 14}px`,
          left: `${selfIsNeedLeftRightByArrow ? wrapW / 2 - 43 + 'px' : '0'}`,
        };
        break;
      case 'TR':
        modalStyle = {
          bottom: `${wrapH + 14}px`,
          right: `${selfIsNeedLeftRightByArrow ? wrapW / 2 - 43 + 'px' : '0'}`,
        };
        break;
      case 'LT':
        modalStyle = {
          top: '-20px',
          left: `${-modalW - 14}px`,
        };
        break;
      case 'Left':
        modalStyle = {
          top: '50%',
          marginTop: `${-modalH / 2}px`,
          left: `${-modalW - 14}px`,
        };
        break;
      case 'LB':
        modalStyle = {
          bottom: '-20px',
          left: `${-modalW - 14}px`,
        };
        break;
      case 'Bottom':
        modalStyle = {
          top: `${wrapH + 14}px`,
          left: '50%',
          marginLeft: `${-modalW / 2}px`,
        };
        break;
      case 'BL':
        modalStyle = {
          top: `${wrapH + 14}px`,
          left: `${selfIsNeedLeftRightByArrow ? wrapW / 2 - 43 + 'px' : '0'}`,
        };
        break;
      case 'BR':
        modalStyle = {
          top: `${wrapH + 14}px`,
          right: `${selfIsNeedLeftRightByArrow ? wrapW / 2 - 43 + 'px' : '0'}`,
        };
        break;
      case 'RT':
        modalStyle = {
          top: '-20px',
          right: `${-modalW - 14}px`,
        };
        break;
      case 'Right':
        modalStyle = {
          top: '50%',
          marginTop: `${-modalH / 2}px`,
          right: `${-modalW - 14}px`,
        };
        break;
      case 'RB':
        modalStyle = {
          bottom: '-20px',
          right: `${-modalW - 14}px`,
        };
        break;
      default:
        modalStyle = {
          bottom: `${wrapH + 14}px`,
          left: '50%',
          marginLeft: `${-width / 2}px`,
        };
    }

    return { ...modalStyle, width: `${width}px` };
  };

  // 返回弹窗样式(fixed定位)
  calculateFixedModalStyle = nowModalPos => {
    const { width, isNeedLeftRightByArrow } = this.props;
    const wrapH = this.wrapEl.clientHeight;
    const wrapW = this.wrapEl.clientWidth;
    const wrapPos = {
      left: this.wrapEl.getBoundingClientRect().left,
      top: this.wrapEl.getBoundingClientRect().top,
      right: window.innerWidth - this.wrapEl.getBoundingClientRect().left - wrapW,
      bottom: window.innerHeight - this.wrapEl.getBoundingClientRect().top - wrapH,
    };
    const modalH = this.modalEl.offsetHeight;
    const modalW = this.props.width;
    const selfIsNeedLeftRightByArrow = isNeedLeftRightByArrow
      ? isNeedLeftRightByArrow
      : wrapW <= 40
      ? true
      : false;

    let modalStyle = {};
    switch (nowModalPos) {
      case 'Top':
        modalStyle = {
          bottom: `${wrapPos.bottom + wrapH + 14}px`,
          left: `${wrapPos.left + wrapW / 2 - modalW / 2}px`,
        };
        break;
      case 'TL':
        modalStyle = {
          bottom: `${wrapPos.bottom + wrapH + 14}px`,
          left: `${
            selfIsNeedLeftRightByArrow ? wrapPos.left + wrapW / 2 - 43 + 'px' : wrapPos.left + 'px'
          }`,
        };
        break;
      case 'TR':
        modalStyle = {
          bottom: `${wrapPos.bottom + wrapH + 14}px`,
          right: `${
            selfIsNeedLeftRightByArrow
              ? wrapPos.right + wrapW / 2 - 43 + 'px'
              : wrapPos.right + 'px'
          }`,
        };
        break;
      case 'LT':
        modalStyle = {
          top: `${wrapPos.top - 20}px`,
          left: `${wrapPos.left - modalW - 14}px`,
        };
        break;
      case 'Left':
        modalStyle = {
          top: `${wrapPos.top + wrapH / 2 - modalH / 2}px`,
          left: `${wrapPos.left - modalW - 14}px`,
        };
        break;
      case 'LB':
        modalStyle = {
          bottom: `${wrapPos.bottom - 20}px`,
          left: `${wrapPos.left - modalW - 14}px`,
        };
        break;
      case 'Bottom':
        modalStyle = {
          top: `${wrapPos.top + wrapH + 14}px`,
          left: `${wrapPos.left + wrapW / 2 - modalW / 2}px`,
        };
        break;
      case 'BL':
        modalStyle = {
          top: `${wrapPos.top + wrapH + 14}px`,
          left: `${
            selfIsNeedLeftRightByArrow ? wrapPos.left + wrapW / 2 - 43 + 'px' : wrapPos.left + 'px'
          }`,
        };
        break;
      case 'BR':
        modalStyle = {
          top: `${wrapPos.top + wrapH + 14}px`,
          right: `${
            selfIsNeedLeftRightByArrow
              ? wrapPos.right + wrapW / 2 - 43 + 'px'
              : wrapPos.right + 'px'
          }`,
        };
        break;
      case 'RT':
        modalStyle = {
          top: `${wrapPos.top - 20}px`,
          right: `${wrapPos.right - modalW - 14}px`,
        };
        break;
      case 'Right':
        modalStyle = {
          top: `${wrapPos.top + wrapH / 2 - modalH / 2}px`,
          right: `${wrapPos.right - modalW - 14}px`,
        };
        break;
      case 'RB':
        modalStyle = {
          bottom: `${wrapPos.bottom - 20}px`,
          right: `${wrapPos.right - modalW - 14}px`,
        };
        break;
      default:
        modalStyle = {
          bottom: `${wrapPos.bottom + wrapH + 14}px`,
          left: `${wrapPos.left + wrapW / 2 - modalW / 2}px`,
        };
    }

    return { position: 'fixed', ...modalStyle, width: `${width}px`, zIndex: 1010 };
  };

  // 返回手型样式(fixed定位)
  calculateFixedHandStyle = direction => {
    const { handStyle, handDirection } = this.props;
    const wrapH = this.wrapEl.clientHeight;
    const wrapW = this.wrapEl.clientWidth;
    const wrapPos = {
      left: this.wrapEl.getBoundingClientRect().left,
      top: this.wrapEl.getBoundingClientRect().top,
      right: window.innerWidth - this.wrapEl.getBoundingClientRect().left - wrapW,
      bottom: window.innerHeight - this.wrapEl.getBoundingClientRect().top - wrapH,
    };

    if (handDirection === 'down'|| wrapPos.bottom < 62) {
      direction = 'B';
    }

    let selfHandStyle = {};
    if (direction === 'B') {
      selfHandStyle = {
        bottom: 'auto',
        top: `${wrapPos.top - 54}px`,
        marginLeft: 0,
        left: `${wrapPos.left + wrapW / 2 - 25}px`,
      };
    } else {
      selfHandStyle = {
        bottom: `${wrapPos.bottom - 54}px`,
        top: `auto`,
        marginLeft: 0,
        left: `${wrapPos.left + wrapW / 2 - 25}px`,
      };
    }
    return { position: 'fixed', ...selfHandStyle, ...handStyle, zIndex: 1011 };
  };

  // 删除元素
  deleteModalDom = () => {
    // 生成之前要把非当前的弹窗删除掉
    const old = document.getElementsByClassName('ReactModal');
    if (old && old.length) {
      for (let i = 0, n = old.length; i < n; i++) {
        const temDom = old[i];
        if (parseInt(temDom.getAttribute('compentStep')) !== global.activeStep) {
          temDom.innerHTML = '';
        }
      }
    }
  };

  // 四个遮罩面的样式
  fixedFourMaskStyle = () => {
    const wrapW = this.wrapEl.clientWidth;
    const wrapH = this.wrapEl.clientHeight;
    const wrapPos = {
      left: this.wrapEl.getBoundingClientRect().left,
      top: this.wrapEl.getBoundingClientRect().top,
      right: window.innerWidth - this.wrapEl.getBoundingClientRect().left - wrapW,
      bottom: window.innerHeight - this.wrapEl.getBoundingClientRect().top - wrapH,
    };
    // 左下右上
    const maskArr = [
      {
        position: 'fixed',
        top: 0,
        left: 0,
        width: wrapPos.left + wrapW + 'px',
        height: wrapPos.top + 'px',
        // background: 'rgba(0,0,0,0.4)',
      },
      {
        position: 'fixed',
        top: wrapPos.top + 'px',
        left: 0,
        width: wrapPos.left + 'px',
        height: wrapPos.bottom + wrapH + 'px',
        // background: 'rgba(0,0,0,0.3)',
      },
      {
        position: 'fixed',
        top: wrapPos.top + wrapH + 'px',
        left: wrapPos.left + 'px',
        width: wrapW + wrapPos.right + 'px',
        height: wrapPos.bottom + 'px',
        // background: 'rgba(0,0,0,0.2)',
      },
      {
        position: 'fixed',
        top: 0,
        left: wrapPos.left + wrapW + 'px',
        width: wrapPos.right + 'px',
        height: wrapPos.top + wrapH + 'px',
        // background: 'rgba(0,0,0,0.1)',
      },
    ];

    return maskArr;
  };

  // 设置激活设置步骤
  activeSetStepPower = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/setIsCanBeSetStep',
      payload: {
        isCanBeSetStep: true,
      },
    });
  };

  // 设置全页面可以操作
  activeSetIsCanOpr = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/setIsCanOpr',
      payload: {
        isCanOpr: true,
      },
    });
  };


  // 渲染fixed定位方法
  renderFixed = nextProps => {
    const { modalStyle } = this.state;
    const {
      handStyle,
      isFixed,
      step,
      title,
      footer,
      global,
      isNeedModal,
      placement,
      popStyle,
      handDirection,
      isNeedHand,
    } = nextProps ? nextProps : this.props;
    const visible = global.activeStep === step ? true : false;

    // console.log('当前全局的步数：', global.activeStep, '当前传入的步数：', step);
    if (visible) {
      this.activeSetStepPower();
      this.activeSetIsCanOpr();
    }


    this.timerId2 = setTimeout(() => {
      this.adjustVisualArea(this.wrapEl, () => {
        const HtmlDom = () => {
          return (
            <Fragment>
              {visible && this.wrapEl ? (
                <Fragment>
                  <div
                    className="mask0"
                    ref={el => {
                      this.maskEl0 = el;
                    }}
                  />
                  <div
                    className="mask1"
                    ref={el => {
                      this.maskEl1 = el;
                    }}
                  />
                  <div
                    className="mask2"
                    ref={el => {
                      this.maskEl2 = el;
                    }}
                  />
                  <div
                    className="mask3"
                    ref={el => {
                      this.maskEl3 = el;
                    }}
                  />
                  {isNeedHand?(
                    <span
                      className={`${styles['hand-pointer']} ${
                        handDirection ? 'down-hand' : ''
                      } toppest`}
                      style={handStyle}
                      alt=""
                      ref={el => {
                        this.handEl = el;
                      }}
                    />
                  ):null}
                  {isNeedModal ? (
                    <div
                      className={`${styles['guide-modal']} toppest`}
                      style={{ ...modalStyle }}
                      ref={el => {
                        this.modalEl = el;
                      }}
                    >
                      <div className={styles['modal-content']}>
                        <p className={styles['tip-txt']}>{title}</p>
                      </div>
                      {footer.length ? (
                        <div className={`${styles['modal-footer']} toppest`}>{footer}</div>
                      ) : null}
                    </div>
                  ) : null}
                </Fragment>
              ) : null}
            </Fragment>
          );
        };

        if (visible && isFixed) {
          // 生成之前要把非当前的弹窗删除掉
          this.deleteModalDom();
          // 从无到有
          this.node = document.createElement('div'); // 创建 DOM
          this.node.className = 'ReactModal'; // 给上 ClassName
          this.node.setAttribute('compentStep', step); // 标记一下是属于第一步的弹窗
          this.node.style.opacity = '0'; // 防止插入dom的时候页面抖动被看到，dom操作完之后再显示
          document.getElementsByTagName('body')[0].appendChild(this.node);
          // document.getElementById('root').appendChild(this.node);// 给 body 加上刚才的 带有 className 的 div
          // 这个时候创建了 Modal 的虚拟 Dom
          let allClass = document.getElementsByClassName('ReactModal');
          ReactDOM.render(<HtmlDom />, allClass[allClass.length - 1]);

          this.timerId3 = setTimeout(() => {
            if (
              this.wrapEl &&
              ((this.modalEl && isNeedModal) || !isNeedModal) &&
              ((this.handEl && isNeedHand) || !isNeedHand) &&
              this.maskEl0 &&
              this.maskEl1 &&
              this.maskEl2 &&
              this.maskEl3
            ) {
              // 计算四个遮罩面样式
              const maskStyles = this.fixedFourMaskStyle();

              for (let maskI = 0, makslen = maskStyles.length; maskI < makslen; maskI++) {
                const dom = this['maskEl' + maskI];
                const domStyle = maskStyles[maskI];
                for (let maskKey in domStyle) {
                  dom.style[maskKey] = domStyle[maskKey];
                }
              }

              // 计算当前位置类名(有指定就用特殊指定)
              const nowModalPos = placement ? placement : this.calculateModalPos(this.wrapEl);
              // const nowModalPos = 'RB';
              if (isNeedModal) {
                const classNameArr = this.modalEl.className.split(' ').slice(0, 2);
                classNameArr.push(styles[nowModalPos]);
                this.modalEl.className = classNameArr.join(' ');

                // 计算当前定位样式
                const nowModalStyle = this.calculateFixedModalStyle(nowModalPos);
                this.modalEl.setAttribute('style', '');
                for (let key in { ...nowModalStyle, ...popStyle }) {
                  this.modalEl.style[key] = { ...nowModalStyle, ...popStyle }[key];
                }
              }
              this.node.style.opacity = '1';

              // 设置手型方向
              if(isNeedHand){
                let nowHandStyles = {};
                const wrapElToBtm = window.innerHeight - this.wrapEl.getBoundingClientRect().top - this.wrapEl.clientHeight;
                if (handDirection || (this.handEl && nowModalPos[0] === 'B')||wrapElToBtm<62) {
                  this.handEl.className = `${styles['hand-pointer']} toppest down-hand`;
                  nowHandStyles = this.calculateFixedHandStyle('B');
                } else {
                  this.handEl.className = `${styles['hand-pointer']} toppest`;
                  nowHandStyles = this.calculateFixedHandStyle('T');
                }
                for (let handKey in nowHandStyles) {
                  this.handEl.style[handKey] = nowHandStyles[handKey];
                }
              }


              window.onresize = () => {
                this.node.style.opacity = '0';
                if (
                  this.wrapEl &&
                  ((this.modalEl && isNeedModal) || !isNeedModal) &&
                  this.maskEl0 &&
                  this.maskEl1 &&
                  this.maskEl2 &&
                  this.maskEl3
                ) {
                  // 滚动条位置判断
                  this.adjustVisualArea(this.wrapEl, () => {
                    // 计算四个遮罩面样式
                    const maskStyles = this.fixedFourMaskStyle();

                    for (let maskI = 0, makslen = maskStyles.length; maskI < makslen; maskI++) {
                      const dom = this['maskEl' + maskI];
                      const domStyle = maskStyles[maskI];
                      for (let maskKey in domStyle) {
                        dom.style[maskKey] = domStyle[maskKey];
                      }
                    }

                    // 计算当前位置类名(有指定就用特殊指定)

                    const nowModalPos = placement ? placement : this.calculateModalPos(this.wrapEl);
                    // const nowModalPos = 'TR';
                    if (isNeedModal) {
                      const classNameArr = this.modalEl.className.split(' ').slice(0, 2);
                      classNameArr.push(styles[nowModalPos]);
                      this.modalEl.className = classNameArr.join(' ');

                      // 计算当前定位样式
                      const nowModalStyle = this.calculateFixedModalStyle(nowModalPos);
                      this.modalEl.setAttribute('style', '');
                      for (let key in { ...nowModalStyle, ...popStyle }) {
                        this.modalEl.style[key] = { ...nowModalStyle, ...popStyle }[key];
                      }
                    }
                    this.node.style.opacity = '1';

                    // 设置手型方向
                    if(isNeedHand){
                      let nowHandStyles = {};
                      const wrapElToBtm = window.innerHeight - this.wrapEl.getBoundingClientRect().top - this.wrapEl.clientHeight;
                      if (handDirection || (this.handEl && nowModalPos[0] === 'B')||wrapElToBtm<62) {
                        this.handEl.className = `${styles['hand-pointer']} toppest down-hand`;
                        nowHandStyles = this.calculateFixedHandStyle('B');
                      } else {
                        this.handEl.className = `${styles['hand-pointer']} toppest`;
                        nowHandStyles = this.calculateFixedHandStyle('T');
                      }
                      for (let handKey in nowHandStyles) {
                        this.handEl.style[handKey] = nowHandStyles[handKey];
                      }
                    }
                  });
                }
              };
            }
          }, 100);
        }
        if (!visible && this.node) {
          // 从有到无
          this.node.innerHTML = '';
          this.clearMyTimeout();
          // ReactDOM.unmountComponentAtNode(this.node); // 调用 react-dom unmountComponentAtNode方法，将Modal解除。
          // 或者可以写下面的方法，将整个创建的div删除，这样多次打开就不会有很多个div残留在body中，但是并不是很正规的做法。
          // document.getElementsByTagName('body')[0].removeChild(document.getElementsByClassName('ReactModal')[0])
        }
      });
    }, 0);
  };

  render() {
    const {
      placement,
      className,
      children,
      footer,
      title,
      step,
      global,
      isFixed,
      handStyle,
      popStyle,
      isNeedModal,
      isNeedHand,
    } = this.props;

    const { modalStyle } = this.state;
    const nowPopstyle = popStyle ? { ...modalStyle, ...popStyle } : modalStyle;
    const visible = global.activeStep === step ? true : false;
    // console.log('----------当前步数：', global.activeStep, step);
    return (
      <div
        className={`${styles['guide-modal-wrap']} ${className ? className : ''}`}
        ref={el => {
          this.wrapEl = el;
        }}
      >
        {children}
        {!isFixed && visible ? (
          <Fragment>
            {isNeedHand?(<span className={`${styles['hand-pointer']}`} style={handStyle} alt="" />):null}
            {isNeedModal ? (
              <div
                className={`${styles['guide-modal']} ${styles[placement]}`}
                style={nowPopstyle}
                ref={el => {
                  this.modalEl = el;
                }}
              >
                <div className={styles['modal-content']}>
                  <p className={styles['tip-txt']}>{title}</p>
                </div>
                {footer.length ? (
                  <div className={`${styles['modal-footer']} toppest`}>{footer}</div>
                ) : null}
              </div>
            ) : null}
          </Fragment>
        ) : null}
      </div>
    );
  }
}
StepGuideModal.defaultProps = {
  footer: [],
  title: '',
  width: 292,
  placement: '',
  isFixed: false,
  isNeedModal: true,
  isNeedHand: true,
  isNeedLeftRightByArrow: false,
  handDirection: '',
};

export default withRouter(StepGuideModal);
