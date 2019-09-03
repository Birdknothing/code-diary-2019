import React from 'react';
export default class M {
  constructor(props) {
    super(props);
    this.state = {
      x: 1,
      y: 2
    };
  }
  render() {
    console.log(this.state.x);
    return this.state.x;
  }
}
