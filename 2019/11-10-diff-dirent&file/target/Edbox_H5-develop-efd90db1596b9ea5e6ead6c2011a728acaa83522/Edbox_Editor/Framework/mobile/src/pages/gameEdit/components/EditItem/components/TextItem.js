import React, { Component } from 'react';
import styles from "../index.less";
import { connect } from "dva";
import { Flex } from 'antd-mobile';
import Iconfont from '@/components/Iconfont';

const FlexItem = Flex.Item;
@connect(({ edit }) => ({
  edit: edit
}))

class TypeItem extends Component {
  

  render() {
    return (
      <Flex className={styles['actions']}>
        <FlexItem>
            <Iconfont type="icon-keyboard" />
        </FlexItem>
        <FlexItem>
            <Iconfont type="icon-font-size" />
        </FlexItem>
        <FlexItem>
            <Iconfont type="icon-drop" />
        </FlexItem>
      </Flex>
    );
  }
}
export default TypeItem;


