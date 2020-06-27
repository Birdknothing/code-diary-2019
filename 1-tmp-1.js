const curry = (f) => {
    let argArr = [];
    const concatArgs = (...argsLeft) => {
        const leftLen = f.length - argArr.length;
        return argsLeft.length < leftLen
            ? (argArr = argArr.concat(argsLeft)) && concatArgs
            : f(...argArr, ...argsLeft.slice(0, leftLen));
    };
    return concatArgs;
};
const lineup = (...args) => (x) => args.reduceRight((acc, f) => f(acc), x);
const test = (x, y, z) => console.log(x + y + z);
const map = (f) => (ele) => ele.map(f);
class IO {
    constructor(f) {
        this._f = f;
    }
    static of(f) {
        return new IO(f);
    }
    map(f) {
        return IO.of(lineup(this._f, f));
    }
}
const add = curry((x, y) => x + y);
const minus = curry((y, x) => x - y);

console.log(IO.of(add(2)).map(minus(3))._f(8));

const m = {
    x: {
        y: 1,
    },
};12
const prop = curry((o, p) => p in o ? prop(o[p]) : prop({}));
console.log(prop(m)('x')('y'));

