const fs = require('fs')
const compose = (...args) => x => args.reduceRight((acc,f) => f(acc),x)
class IO {
  constructor(f) {
    this.val = f
  }
  static of (x) {return new IO(()=>x)}
  map(f) {return new IO(compose(f,this.val))}
}
const map = f => x => x.map(f)
const rf = fname => new IO(()=>fs.readFileSync(fname,'utf-8'))
const print = x => new IO(() => {console.log(x);return x})
const rp = compose(map(print),rf)
console.log(rp('./2.txt').val().val())
console.log('http://www.baidu.com'.split('#')[0])
const m = {b:2,a:1}
let {a,b} = {...m}
console.log(a,b)

console.log(Array.prototype.sort.call(m,(a,b) => b-a))
class w {
  a() {
   return 1 
  }
}
console.log(new w().a())