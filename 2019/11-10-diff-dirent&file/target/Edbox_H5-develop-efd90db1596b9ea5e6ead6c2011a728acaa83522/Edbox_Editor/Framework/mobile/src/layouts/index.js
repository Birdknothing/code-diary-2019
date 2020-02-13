import React, { Component } from 'react';
import { setLocale } from 'umi/locale';
import styles from "./index.less";


class Layout extends Component {

  componentDidMount () {
    const { Edbox } = window;
    const { Language } = Edbox;
    setLocale(Language === 'English'? 'en-US':'zh-CN');
    document.body.addEventListener('touchstart', function (){});
  }

  render() {
    const { children } = this.props;
    return <div className={styles.layout}> {children}</div>;
  }
}

export default Layout;


