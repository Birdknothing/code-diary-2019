const curry = (fn) => aa = (...arg) => arg.length >= fn.length ? fn(...arg): aa.bind(null, ...arg);
const c = () => 'hahaha'
const m = (...a) => a.reduce((ac,ele) => ac+ele,0)
const cm = curry(m)
console.log(cm(1,2)(3,4,5)(7,8))
console.log(cm(1)(2,3))