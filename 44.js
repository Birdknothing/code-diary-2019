let w = 12
const pro = new Promise(res => {
  setTimeout(res, 2000, 'hello')

  // res(w)
})
const pro1 = new Promise(res => {
  setTimeout(res, 2000, 'hello1')

  // res(w)
})
const m1 = async function() {
  return new Promise((res, rej) => {
    setTimeout(res, 2000, 'hello')
  })
  await setTimeout(() => {
    console.log('m1')
  }, 2000)
}
const m2 = async function() {
  await setTimeout(() => {
    console.log('m2')
  }, 2000)
}
async function a(x) {
  console.log(await m1())
  console.log('22')
  return 11
}
a('gg').then(z => {
  console.log(z)
  console.log(w + 1)
})
console.log({} instanceof Array)
console.log([] instanceof Array)
console.log(Object.prototype.toString.call([]).slice(8, -1))
console.log('hh' + [].join(':'))
