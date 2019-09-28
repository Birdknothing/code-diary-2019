let { x, ...k } = { x: 1, y: 2, z: 3 };
console.log(k);
const m = function({ x, y } = { x: 1, y: 2, z: 3 }) {
  console.log(arguments);
};
m();
