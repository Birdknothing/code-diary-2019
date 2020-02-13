import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import HtmlDom from './htmlDom';

/*
 * 返回顶部组件
 * @param {Object} el：js dom元素，选填，默认window对象
 * @param {Number} toTopShowLen：滚动距离容器多少距离出现返回顶部，选填，默认100
 */
class ScrollTop extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.isBind = false;
  }

  componentDidMount() {
    this.renderScrollTopHtml();
  }

  componentWillUnmount() {
    if (this.getElTimerId) {
      clearTimeout(this.getElTimerId);
    }
    this.setState = (state,callback)=>{
      return;
    };
  }

  handleScroll = () => {
    this.getElTimerId = setTimeout(() => {
      const { el = window, toTopShowLen = 100 } = this.props;
      if (el) {
        el.onscroll = () => {
          if (el.scrollTop >= toTopShowLen) {
            this.setState({
              visible: true
            });
          } else {
            this.setState({
              visible: false
            });
          }
        };
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    const { el } = nextProps;
    if (el && !this.isBind) {
      this.handleScroll();
      this.isBind = true;
    }
  }
  componentDidUpdate() {
    this.renderScrollTopHtml();
  }

  renderScrollTopHtml = () => {
    const { visible } = this.state;
    const { el = window } = this.props;

    // 是否存在scrolltop类名节点
    this.node = document.getElementsByClassName('scrolltop');
    if (!this.node.length) {
      this.node = document.createElement('div'); // 创建 DOM
      this.node.className = 'scrolltop'; // 给上 ClassName
      this.node.setAttribute('ttttt', new Date().getTime());
      document.getElementsByTagName('body')[0].appendChild(this.node);
    }
    let allClass = document.getElementsByClassName('scrolltop');
    ReactDOM.render(<HtmlDom visible={visible} el={el} />, allClass[allClass.length - 1]);
  };

  render() {
    return null;
  }
}

export default ScrollTop;
