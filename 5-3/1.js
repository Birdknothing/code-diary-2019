const curry = (f,length) => {length = length || f.length;return (...args) => length - args.length > 0 ? curry(function(){return f.call(this,...args,...arguments)},length - args.length) :  f.call(this,...args)}
const compose = (...args) => x => args.reduceRight((acc,f) => f(acc),x)
class Maybe {
  constructor(x){
    this._val = x
  }
  static of(y){
    return new Maybe(y)
  }
  isNothing() {
    return this._val === null || this._val === undefined
  }
  map(f) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this._val))
  }  
}
class IO {
  constructor(f) {
    this._val = f
  }
  static of(x) {
    return new IO(function(){return x})
  }
  map(f) {
    return new IO(compose(f,this._val))
  }
}
const map = curry((f,x) => x.map(f))
const prop = curry(function(key,obj){return obj[key]})
const a = {x:{x:1}}
const b = () => ({y:1})
const bb = {y:1}
const h = () => ({y:1})
const w = {y:1}
const n = IO.of(w)
console.log(n._val())
const g = compose(prop('y'),n._val)
// console.log(IO.of(b).map(prop('y'))._val)
console.log(n.map(prop('y'))._val());
console.log(compose(map(prop('y')),IO.of)({y:1})._val());