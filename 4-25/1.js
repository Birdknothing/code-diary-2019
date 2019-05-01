console.log(Array.prototype[Symbol.iterator])
const m = Array.prototype[Symbol.iterator]()
console.log(m.next())
const a = {x:1,y:2}
// console.log([Symbol.iterator])
const cg = console.log
cg(Reflect.ownKeys(Object))
let z = Symbol('k')
a.z=3
let gg = 1
a[Symbol.iterator] = function*(){
  yield 1;
  yield 2;
  yield 3;
}
cg(Object.getOwnPropertySymbols(a))
for(let key of Object.keys(a)) {
  cg(key)
}
const g = {a:1,b:2}
for(w of a)
{
  console.log(w)
}
let gk = 1
// let [a1,a2] = a[Symbol.iterator]()
// for(kk of {next:function(){return {value:gk++,done:gk<3 ? false : true}}})
// {
//   cg(kk)
// }
// let [a1,a2] = {next:function(){return {value:gk++,done:gk<3 ? false : true}}}
// cg('a1 ='+a1)
// cg('a2 ='+a2)
cg(1 && 2 && 4 - 1 > 0)