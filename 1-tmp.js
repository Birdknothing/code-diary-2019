const a = [1, 2, 3];
a.splice(0, 0, 0, 0.5);
console.log(a);
const b = [{ x: 4 }, { x: 3 }, { x: 2 }, { x: 1 }, { x: 0 }];
// const spliceIndex = 1;
// b.splice(b.length - 1 - spliceIndex, 1);
// console.log(b);

console.log(b.filter(ele => ele.x !== 1));
