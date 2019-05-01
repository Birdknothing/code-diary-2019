function* a(x) {
  console.log('haha')
  console.log((yield x))
  console.log('heihiehie')
  yield x;
  console.log(x*3)
  yield x*9;
}
const cg = console.log
let aa = a(1)
aa.next(5)
aa.next(10)
// cg(aa.next(10).value+7)
// aa.next(false)
// function* b() {
//   yield* [[[1,2],3],4]
// }
// let bb = b()
// for(key of bb) {
//   cg(key)
// }
// cg(aa.next())