const w = {};
const a = new WeakMap([[w, "y"]]);
console.log(a.get(w));
const b = new Map([['hh', "test"]]);
console.log(b.get('hhh·'));

