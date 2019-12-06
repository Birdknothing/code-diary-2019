import React,{Component} from 'react';
import { connect } from 'dva';
import {withRouter} from 'dva/router';
import styles from './IndexPage.css';
const Test = withRouter(connect()(class extends Component{
  render(){
    console.log('test',this.props);
    return (
      <div><button onClick={()=>{
        // console.log(this.context.history);
        this.props.history.push('hist')
        
      }}>push</button></div>
      )
    }
}))
function IndexPage(props) {
  console.log(props);
  console.log(props.history.location === props.location);
  
  return (
    
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to dva!</h1>
      <div className={styles.welcome} />
      <Test />
      <ul className={styles.list}>
        <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
        <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
      </ul>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
