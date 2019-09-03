const m = require('./1');
setTimeout(() => {
  m.x = 2;
  console.log('2.js', m.x);
}, 3000);
(() => {
  const n = require('./1');
  setInterval(() => {
    console.log('2.jjjj', n.x);
  }, 1000);
})();
