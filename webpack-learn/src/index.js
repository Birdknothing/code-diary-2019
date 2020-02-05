import React from 'react';
import ReactDOM from 'react-dom'
import '@babel/polyfill'
import pic from '../test.jpg';
import test from './test';
import { add } from './util';
import './test.scss';
console.log(add(1, 2));
const m = new Promise((res) => {
  setTimeout(res, 'a', 2000)
})
test.log();
function getJQ() {
  return import(/* webpackPrefetch: true */'./async.js').then(({ default: _ }) => {
    _.test();
  })
}
function getJQ2() {
  return import(/* webpackChunkName: "async11" */'./async2.js').then(({ default: _ }) => {
    _.test();
  })
}
const W = () => <div className="test" onClick={() => {
  getJQ();
  getJQ2();

}}>abc</div>
console.log('this is no to a');
console.log('fi');


ReactDOM.render(<W />, app)
