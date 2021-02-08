const curry = (f, l = f.length) => (...args) =>
  l - args.length > 0
    ? curry((...argsRest) => f.call(f, ...args, ...argsRest), l - args.length)
    : f.call(f, ...args);
const compose = (...args) => x => args.reduceRight((acc, f) => f(acc), x);
export { curry, compose };
