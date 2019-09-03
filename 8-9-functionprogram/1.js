const { store, makeStatic } = require('./2.js');
makeStatic(['map', 'split', 'reverse', 'join', 'concat']);
const { curry, compose, map, split, reverse, join, concat } = store;
console.log(
  compose(
    x => x + 'world',
    x => x + 'hello '
  )('')
);
console.log(map(x => x + 1)([1, 2, 3]));
const replace = curry((exp, str) => str.replace(exp, '_'));
console.log(replace(/\s/g)('1 2 3'));
const m = compose(
  join(''),
  map(w => w[0]),
  concat(['不悔初衷寻旧梦', '改天换地意难摇']),
  reverse(''),
  split(' ')
);
console.log(m('心系前盟魂欲消 痴眸望断楚江遥'));
const a = x => (y, z) => x + y + z;
const b = x => y => z => x + y + z;
console.log(typeof a(1, 2));
console.log(typeof b(1, 2));
console.log(a(1)(2, 3), b(1)(2)(3));
const prop = curry((pr, obj) => obj[pr]);
const gethead = arr => arr[0];
const log = x => console.log(x);
const trace = curry((tag, x) => {
  console.log(tag, x);
  return x;
});
const streetName = compose(
  log,
  trace('s3'),
  prop('street'),
  trace('s2'),
  gethead,
  trace('s1'),
  prop('addresses')
);
streetName({ addresses: [{ street: 'Shady Ln.', number: 4201 }] });
// streetName({ addresses: [] });
