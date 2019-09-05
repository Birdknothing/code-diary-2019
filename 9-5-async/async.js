var async = require('async');

// Promise.all([
//   new Promise(res => {
//     console.log('1');
//     setTimeout(res, 2000, 1);
//   }),
//   new Promise(res => {
//     console.log('2');
//     setTimeout(res, 2000, 2);
//   }),
//   new Promise(res => {
//     console.log('3');
//     setTimeout(res, 2000, 3);
//   })
// ]);
const arr = [
  () =>
    new Promise(res => {
      console.log('1');
      setTimeout(res, 2000, 1);
    }),
  () =>
    new Promise(res => {
      console.log('2');
      setTimeout(res, 2000, 2);
    }),
  () =>
    new Promise(res => {
      console.log('3');
      setTimeout(res, 2000, 3);
    })
];
// arr.forEach(async f => {
//   await f();
// });
(async () => {
  for (f of arr) {
    await f();
  }
})();
// (async function() {
//   await new Promise(res => {
//     console.log('1');
//     setTimeout(res, 2000, 1);
//   });
//   await new Promise(res => {
//     console.log('2');
//     setTimeout(res, 2000, 1);
//   });
//   await new Promise(res => {
//     console.log('3');
//     setTimeout(res, 2000, 1);
//   });
// })();
