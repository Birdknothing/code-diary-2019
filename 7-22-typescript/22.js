const a = [];
console.log(a);
a.splice(1, 0, 3, 4);
console.log(a);
const m = Object.create(null);
m.render = function(x) {
  console.log('11');
  console.log(this.w);
};
m.w = 2;
m.render(1);
const t1 = { x: 1 };
let { x } = t1;
x = 2;
console.log(t1.x);
