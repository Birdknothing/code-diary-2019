import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect(({loading}) => ({
  loading: loading.models.global,
}))
class Lobby extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() {
    return (<div>大厅页面内容</div>);
  }
}

export default Lobby;
