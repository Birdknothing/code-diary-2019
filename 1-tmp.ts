const m = { x: 1, y: 2, z: 3 };
const { x, ...n } = m;
const k = { ...n, oo: 4 };
console.log(n, k);
