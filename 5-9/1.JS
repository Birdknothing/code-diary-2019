const t1 = cb => cb(x)
const t0 = ()=>{setTimeout(function(x){return x},2000,'hello')}
const t2 = x => console.log(x+'world')
const compose = (...args) => x => args.reduceRight((acc,f) => f(acc),x)
const p1 = new Promise((res,rej)=>{
  setTimeout(res,2000,'hello');
})
async function a() {
  let b = await p1
  return b
  // t2('no')
}
const tt = compose(t2,t0)
// tt('hello')
// a().then(t2)
class test {
  constructor(f) {
    this.val = f
  }
  then(res,rej) {
    this.val(res)
  }
}
const pp = x => new test(cb => {setTimeout(cb,2000,x);})
async function m() {
     let ww = await pp('hellowww')
     console.log(ww)
     console.log('hah')
  console.log(await Promise.resolve('world'))
}
m()