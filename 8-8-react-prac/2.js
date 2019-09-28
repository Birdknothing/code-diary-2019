const curry1 = (f, length = f.length) => (...args) => (length - args.length > 0 ? curry((...argsRest) => f.call(f, ...args, ...argsRest), length - args.length) : f.call(f, ...args));
const c1 = curry1((x, y, z) => x + y + z);
const curry = (f, length = f.length) => (...args) => (length - args.length > 0 ? curry((...argsRest) => f.call(f, ...args, ...argsRest), length - args.length) : f.call(f, ...args));
const map1 = curry((arr, f) => arr.map(f));
console.log(map1([1, 2, 3])(x => x + 1));
// console.log([1, 2].map(x => x + 1));
console.log(c1(1, 2)(3));
console.log(c1(1)(2, 3));
console.log(c1(1)(2)(3));
