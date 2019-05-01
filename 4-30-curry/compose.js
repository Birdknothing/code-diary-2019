let {curry} = require('./curry.js')
// const compose = require('lodash/fp/compose')
// const curry = require('lodash/fp/curry')
const add1 = curry((a,b) => a+b)
const add2 = curry((a,b) => a+b)
const add3 = curry((a,b) => a+b)
// const compose = function (...args) {
//   return function(data) {
//     return args.reduceRight((acc,f)=>(acc = f(acc)),data)
//   }
// }
const compose = (...args) => x => args.reduceRight((acc,f) => f(acc),x)
const c = compose(add1(15),add2(10),add3(5))
console.log(c(1))