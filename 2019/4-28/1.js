const o = {
  x:1,
  f:function() {
    return this.x
  }
}
// o.f = function(...arg) {
//   return o.f.apply(o,arg)
// }
const cg = console.log
const ff = function(...arg) {
  return o.f.apply(this,arg)
}
global.x = 2

cg(ff())