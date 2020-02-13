function push(array,...items) {
  array.push(...items)
  return array
}
const cg = console.log
let a = [1,2,3]
cg(push([],1,2,3))
cg(a.copyWithin(0,2))
let b = {a:1,c:2,d:{e:1}}
console.log(Reflect.ownKeys(Object))
console.log(Reflect.ownKeys(Object.prototype))
const c = {...b}
console.log(b.d.e === c.d.e)
function q(){}
q.prototype.test = 'test'
const m = new q()
m.w = function() {return this.test}
console.log(m.w())
const j = {x:1,y:2}
for(let w of Object.entries(j)) {
  console.log(w)
  console.log(typeof w)
}
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);

// String.prototype.match(regexp)
// // 等同于
// regexp[Symbol.match](this)

class MyMatcher {
  [Symbol.match](string) {
    return 'hello world'.indexOf(string);
  }
}

console.log('e'.match(new MyMatcher()))
const t = {x:'ha'}
t[Symbol.split] = function(str){console.log(this.x); return str.split(this.x)}
console.log('mhamha'.split(t))