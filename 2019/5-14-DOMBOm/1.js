const a = /(abc)(efg)/g
const b = 'abcefg'
b.replace(a,(all,d,e) => {
  console.log(all)
  console.log(d)
  console.log(e)
})