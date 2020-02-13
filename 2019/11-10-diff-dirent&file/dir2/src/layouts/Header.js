import React from 'react';
import styles from './index.scss';
import Logo from '../assets/logo.png';
import Bg from '../assets/topbar.png';
import { Row, Col,Icon   } from 'antd';

export default () => {
  return (
   <header className={styles.header} style={{backgroundImage: `url(${Bg})`}}>
      <h1 className={styles.logo}><img src={Logo} alt=""/></h1>
      <Row className={styles.handle}>
        <Col span={6}><Icon type="minus" /></Col>
        <Col span={6}  offset={2}><i className={styles.big}></i></Col>
        <Col span={6}  offset={2}><Icon type="close" /></Col>
      </Row>
   </header>
  );
};
