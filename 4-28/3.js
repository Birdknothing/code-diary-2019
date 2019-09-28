const f = (a,b) => a+b
const f0 = a => (b,d) => a+b+d
const f00 = (a,b) => d => a+b+d()
const f1 = a => b => c => a() + b() +c()
const ff = (a,b) => c => (a+b)*c
// const f0 = function(a) {return function(b){return a + b}}
console.log(f(1,2))
console.log(f0(1)(2,3))
console.log(f00(1,2)(()=>100))
console.log(f1(()=>1)(()=>2)(()=>3))
function g1() {
  return this.name
}
function g2(...args) {
  return function() {
    g1.call(this,...args)
  }
}
const store = {}
function mem(...arg) {
  console.log(typeof arg)
  let argStr = arg.join(',')
    return argStr in store ? 'getfrom cahche'+store[argStr] : (store[argStr] = argStr)
  
}
const memerize = f => {
  let store = {}
  return (...args) => {
    let argStr = args.join(',')
    return store[argStr] = store[argStr] || f.apply(f,args)
  }
}
const test = memerize(mem)
console.log(test(0,1))
console.log(test(0,1))