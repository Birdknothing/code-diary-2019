const curry = (f, l = f.length) => (...args) => l - args.length > 0 ? curry((...argsRest) => f.call(f, ...args, ...argsRest), l - args.length) : f.call(f, ...args);
const compose = (...args) => x => args.reduceRight((acc, f) => f(acc), x)
const a = (x, y, z) => console.log(x + y + z);
const b = curry(a)(1)(2, 3)
const s1 = x => x + 1;
const s2 = x => x * x;
const test = compose(s2, s1)
console.log(test(2));
const map = curry((f, x) => x.map(f))
// functor的作用
class B {
  constructor(x) {
    this._val = x;
  }
  isNone() {
    return Boolean(this._val);
  }
  map(f) {
    return new B(this._val ? f(this._val) : null)
  }
}
new B(null).map(x => {
  console.log(x + 1);
  return x
});
class Ok {
  constructor(x) {
    this._val = x;
  }
  map(f) {
    return new Ok(f(this._val))
  }
}
class Err {
  constructor(x) {
    this._val = x;
  }
  map(f) {
    return this;
  }
}
class Either {
  constructor(x) {
    this._val = x;
  }
  map(f) {
    return this._val ? new Ok(f(this._val)) : new Err(this._val)
  }
}
const withdraw = curry((num, ori) => ori - num)
const w = new Either(2).map(withdraw('1'))
console.log(w.constructor);
console.log(w._val);
class C {
  constructor(f) {
    this._val = f;
  }
  map(f) {
    return new C(compose(f, this._val))
  }
} ``
const aa = new C(x => 1)
const bb = aa.map(x => {
  console.log(x + 1);
  return x + 1

})
const cc = bb.map(x => {
  console.log(x + 2);
  return x + 2
})
console.log(cc._val());
const nn = (res) => {
  setTimeout(res, 2000, 'hello');
}
const map1 = f => x => x.map(f)
const test1 = x => new C(() => x + 1)
// const print = x => new C(() => {
//   console.log(x);
//   return x

// })
const join = fun => fun.join();
class Maybe {
  static of(x) {
    return new Maybe(x)

  }
  constructor(x) {
    this._val = x;
  }
  // of(x) {
  //   return new Maybe(x)
  // }
  map(f) {
    return Maybe.of(f(this._val))
  }
  join() {
    return this._val ? this._val : Maybe.of(null)
  }
}
// const mmm = compose(map(map(print)), test1);

// mmm(10)._val()._val()
var safeProp = curry(function (x, o) { return Maybe.of(o[x]); });
var user = {
  id: 2,
  name: "albert",
  address: {
    street: {
      number: 22,
      name: 'Walnut St'
    }
  }
};

var ex1 = undefined;
const getname = compose(join, join, map(safeProp('name')), join, map(safeProp('street')), safeProp('address'))
console.log(getname(user));
// console.log(compose(map(safeProp('street')), safeProp('address'))(user));
class IO {
  static of(f) {
    return new IO(f)
  }
  constructor(f) {
    this._val = f;
  }
  map(f) {
    return IO.of(compose(f, this._val))
  }
  join() {
    return this._val();
  }
}
var getFile = __filename => new IO(function () { return __filename; })

var pureLog = function (x) {
  return new IO(function () {
    console.log(x);
    return 'logged ' + x;
  });
}

var ex2 = undefined;
const print = compose(join, join, map(pureLog), getFile);
console.log(print('test'));
// console.log(compose(map(pureLog), getFile)());
// console.log(compose(map(pureLog),getFile)('test'));




