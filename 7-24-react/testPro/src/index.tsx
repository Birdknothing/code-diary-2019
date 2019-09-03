/// <reference path="index.d.ts"/>
import React, { Suspense } from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.scss';
import { ReactNodeLike, object } from 'prop-types';
const C3 = () => <div>abc</div>;
const C2 = React.lazy(
  () =>
    new Promise((res: (x: any) => void) => {
      setTimeout(() => {
        res({ default: C3 });
      }, 2000);
    })
);
class C1 extends React.Component {
  render() {
    console.log(Reflect.getOwnPropertyDescriptor(this, 'refs'));
    console.log(Reflect.isExtensible(this.refs));
    console.log('this1', this); // {...refs:{hh:input}...}
    console.log(this.refs); // {}
    console.log(Reflect.getOwnPropertyDescriptor(this, 'refs'));
    console.log(Reflect.getOwnPropertyDescriptor(this.refs, 'getter'));

    setTimeout(() => {
      console.log('this2', this); // {...refs:{hh:input}...}
      console.log(Reflect.getOwnPropertyDescriptor(this, 'refs'));
      console.log(this.refs); // {hh:input}
      console.log(this.refs.hh);
    }, 3000);
    return (
      <div>
        <input ref="hh" />
      </div>
    );
  }
}
console.log(ReactDOM.render(<C1 />, document.getElementById('app')));
