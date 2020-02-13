const curry = (f, l = f.length) => (...args) => l - args.length > 0 ? curry((...argsRest) => f.call(f, ...args, ...argsRest), l - args.length) : f.call(f, ...args);
const compose = (...args) => x => args.reduceRight((acc, f) => f(acc), x)
class IO {
  constructor(f) {
    this._val = f;
  }
  static of(f) {
    return new IO(f)
  }
  map(f) {
    return IO.of(compose(f, this._val))
  }
  async join() {
    return await this._val();
  }
}
const m = (async x => await new Promise(res => {
  setTimeout(res, 2000, 'test');
}));
IO.of(m).map(async x => {
  console.log(await x);
}).join()