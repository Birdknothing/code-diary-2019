function* b() {
  console.log((yield))
}
function wrap(b) {
  return function (...arg) {
    const tmp = b(...arg)
    tmp.next()
    return tmp
  }
}
function times(x,y) {
  return x * y
}
function copyTimes(times) {
//  return (function (times) {
    return function (...arg) {
     return times(...arg)
    }
  // })(times)
}
console.log(copyTimes(times)(10,100))
const aa = wrap(b)   
aa().next("haha")
let [m1,m2] = (function*(){yield 1;yield 2;})()
console.log(m1,m2)