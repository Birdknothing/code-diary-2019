const curry = (f, l = f.length) => (...args) =>
    l - args.length > 0
        ? curry((...argsLeft) => f(...args, ...argsLeft), l - args.length)
        : f(...args);
const compose = (...args) => input =>
    args.reduceRight((acc, f) => f(acc), input);
class Maybe {
    constructor(val) {
        this._val = val;
    }
    static of(val) {
        return new Maybe(val);
    }
    isNull() {
        return this._val == null;
    }
    map(f) {
        return this.isNull() ? Maybe.of(null) : Maybe.of(f(this._val));
    }
    join() {
        return this.isNull() ? Maybe.of(null) : this._val;
    }
}
class IO {
    constructor(f) {
        this._val = f;
    }
    static of(f) {
        return new IO(f);
    }
    map(f) {
        return IO.of(compose(f, this._val));
    }
    ap(io) {
        return IO.of(compose(io._val, this._val));
    }
}
const target = { x: "test" };

const target0 = { x: { y: "test" } };

const behavior1 = obj => obj.x;
const behavior2 = obj => obj.y;

const getYofX = IO.of(behavior1).ap(IO.of(behavior2));
console.log(getYofX._val(target0));

const prop = prop => obj => obj[prop];
const map = f => target => target.map(f);
const join = target => target.join();
const m = Maybe.of(target);

const test = (x, y, z) => x + y + z;
// compose(console.log, curry(test)(1, 2))(3);

// compose(console.log, join, map(prop("x")))(m);
