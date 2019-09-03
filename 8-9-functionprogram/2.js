const _myStaticFunctions = Object.assign(Object.create(null), {
  curry: function(f, l = f.length) {
    return (...args) => (l - args.length > 0 ? this.curry((...argsRes) => f.call(f, ...args, ...argsRes), l - args.length) : f.call(f, ...args));
  },
  compose: (...args) => x => args.reduceRight((acc, f) => f(acc), x),
  makeStatic: function(arr) {
    return arr.forEach(fname => (this[fname] = this.curry((f, target) => target[fname](f))));
  }
});
_myStaticFunctions.curry = _myStaticFunctions.curry.bind(_myStaticFunctions);
const makeStatic = _myStaticFunctions.makeStatic.bind(_myStaticFunctions);
module.exports = { makeStatic, store: _myStaticFunctions };
//   export { makeStatic };
//   export default _myStaticFunctions;
