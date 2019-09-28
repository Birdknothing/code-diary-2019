interface aArg {
  x: string;
  y: string;
  [propName: string]: any;
}
enum color {
  green,
  red,
  yellow
}
function h(): never {
  throw new Error('ahh');
}
let { x, ...k } = { x: 1, y: 2, z: 3 };
console.log(k);
console.log(color[1]);
console.log(color['red']);
class W {
  cp: string;
  constructor(public x, public y, public z) {
    this.cp = x + y + z;
  }
}
console.log(new W(1, 2, 3).cp);
const a = function(x: aArg) {
  console.log(x);
};
a({ x: '2', y: '3', z: '4' });
