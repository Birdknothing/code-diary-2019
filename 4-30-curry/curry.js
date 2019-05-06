// function sub_curry(fn /*, variable number of args */) {
//   var args = [].slice.call(arguments, 1);
//   return function () {
//       return fn.apply(this, args.concat(...arguments));
//   };
// }
// function curry(fn, length) {
//   // capture fn's # of parameters
//   length = length || fn.length;
//   return function () {
//       if (arguments.length < length) {
//           // not all arguments have been specified. Curry once more.
//           var combined = [fn].concat(...arguments);
//           console.log(sub_curry.apply(this,combined))
//           return curry(sub_curry.apply(this, combined), length - arguments.length)
//               // : sub_curry.call(this, combined );
//       } else {
//           // all arguments have been specified, actually call function
//           return fn.call(fn, ...arguments);
//       }
//   };
// }

// function curry(f,length) {
//   length = length || f.length
//   return function(...args) {
//     if(length - args.length > 0) {
//       return curry(function(){return f.call(this,...[...args,...arguments])},length - args.length)
//     } else {
//       return f.call(f,...args)
//     }
//   }
// }

// function curry(f,length) {
//   length = length || f.length
//   return (...args) => length - args.length > 0 ? curry(function(){return f.call(this,...args,...arguments)},length - args.length) :  f.call(this,...args)
// }
const curry = (f,length) => {length = length || f.length;return (...args) => length - args.length > 0 ? curry(function(){return f.call(this,...args,...arguments)},length - args.length) :  f.call(this,...args)}
// const h = a => b => c => a+b+c
const h = (a,b,c,d,e) => a+b+c+d+e
const tp = curry(h)
// console.log(tp(1,2,3,4,5))
// console.log(tp(1,2,6)(4)(10))  
// console.log(tp(1,2)(3)(4))
// console.log(tp(1,2)(8))

// // global.x = 1
// exports.x = 1
// const t = () => {console.log(this.x)}
module.exports={curry}