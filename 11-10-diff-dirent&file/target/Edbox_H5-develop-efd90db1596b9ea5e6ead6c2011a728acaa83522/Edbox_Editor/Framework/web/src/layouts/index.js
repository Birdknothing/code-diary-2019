

import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.scss';
// import Header from './Header';



@connect(({  edbox, loading }) => ({
  edbox,
  loading: loading.models.edbox,
}))
class BasicLayout extends Component {
  
  render() {
    return (
      <div className={styles.normal} id= "normal">
      {/*<Header />*/}
      <div className={styles.content}>
        {this.props.children}
      </div>
    </div>
    );
  }
}

export default BasicLayout;

