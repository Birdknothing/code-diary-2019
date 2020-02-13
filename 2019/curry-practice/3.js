const curry = (f, l = f.length) => (...args) => l - args.length > 0 ? curry((...argsRest) => f.call(f, ...args, ...argsRest), l - args.length) : f.call(f, ...args);
const compose = (...args) => x => args.reduceRight((acc, f) => f(acc), x);
// const { task } = require('folktale/concurrency/task')
// var getPost = function (i) {
//   return task(function (rej, res) {
//     setTimeout(function () {
//       res({ id: i, title: 'Love them tasks' });
//     }, 300);
//   });
// }
// task.prototype.join = function () {
//   return this._val()
// }
// var getComments = function (i) {
//   return task(function (rej, res) {
//     setTimeout(function () {
//       res([
//         { post_id: i, body: "This book should be illegal" },
//         { post_id: i, body: "Monads are like smelly shallots" }
//       ]);
//     }, 300);
//   });
// }
// const map = curry((f, x) => x.map(f))

// const join = f => f._val()

// var ex3 = undefined;
// const test = compose(join, join, map(getComments), getPost);
// test(0).run().listen({
//   onRejected(err) { },
//   onResolved(val) {
//     console.log(val);

//   }
// })
const map = curry((f, x) => x.map(f))
const join = f => f._val();
class M {
  static of(f) {
    return new M(f)
  }
  constructor(x) {
    this._val = x;
  }
  map(f) {
    return M.of(compose(f, this._val))
  }
  join() {
    return this._val();
  }
  ap(fun) {
    return fun.map(this._val)
  }
}
const a = { b: { c: 1 } }
join(M.of(x => 1).map(console.log));
join(M.of(x => 1).ap(M.of(console.log)));