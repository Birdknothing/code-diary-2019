const aa = require('./2')
setTimeout(() => {
  console.log('first', aa.x);

}, 2000);
const bb = require('./2')
setTimeout(() => {
  console.log('second', bb.x);

}, 2000);
bb.x = 'bb';
console.log(aa.x);
