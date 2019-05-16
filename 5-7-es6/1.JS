async function a() {
  console.log('a')
  await setTimeout(()=>{},1000,1);
  console.log('b')
  await 2;
}
const curry = (f,length) => (...args) => {length = length || f.length;return length - args.length > 0 ? curry(function(){return f.call(this,...args,...arguments)},length - args.length) : f.call(this,...args)}
const compose = (...args) => x => args.reduceRight((acc,f) => f(acc),x)
const w = (a,b,c) => console.log(a+b+c)
const ww = curry(w)
ww(1,2)(3)
const first = curry((x,cb) => {setTimeout(() => {cb(x)},2000)})
const second = curry((x,cb) => {setTimeout(() => {cb(x)},2000)})
const print = compose(second,first)
// function k(){
//   var m = b('hello')
//   m(data => console.log(data))
// }
// k()
// async function c(){
//   var d = await b
//   console.log('haha')
//   d(data => console.log(data))
// }
// c()
// console.log(c().next())
// const e = c()
// e.next().value(data => {e.next(data)})