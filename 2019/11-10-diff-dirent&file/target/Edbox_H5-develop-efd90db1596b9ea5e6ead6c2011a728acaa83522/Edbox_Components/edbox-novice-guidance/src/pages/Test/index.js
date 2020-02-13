import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect(({loading}) => ({
  loading: loading.models.global,
}))
class Test extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() {
    return (<div>测试页面内容</div>);
  }
}

export default Test;
