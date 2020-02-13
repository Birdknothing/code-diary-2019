const a = [1,2]
const c = a
// const b = Array.prototype.concat.apply(a,[3,4])
Array.prototype.push.apply(a,[3,4])

console.log(a === c);
a.push(5,6)
a.length = 0
console.log(a);
