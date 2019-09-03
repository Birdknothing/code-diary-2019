interface t {
  length: number;
}
function Test(arg: any[] | { length: number }) {
  console.log(arg.length);
}
Test([1, 2]);
Test({ length: 2 });
class F {
  x: string;
  constructor(n: string) {
    this.x = n;
  }
  move(t) {
    console.log('f', t);
  }
}
class N extends F {
  constructor(n: string) {
    super(n);
  }
  move(w) {
    super.move(w);
  }
  smove(w) {
    this.move(w);
  }
}
class K implements F {
  x: string;
  move() {
    console.log('k');
  }
}
new N('2').smove('sonson');
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let wf: (x: string, y: string) => boolean = (x, y) => x > y;
// let wf: SearchFunc = (x, y) => x > y;
// wf('2', '3');]
let yf: (x: string, ...res) => boolean = (x, arr) => arr.includes(x);
console.log(yf('1', [2, 3]));
function db(x: number): string;
function db(x: string): number;
function db(x: any): any {
  return x === 1 ? '1' : 2;
}
console.log(db('1'));

interface dm<T> {
  (x: T): string;
  (x: string): T;
}
let kkk: dm<number> = (x): any => (x === 1 ? '1' : 2);
console.log(kkk(1));
let tft: new () => void = class {
  x: 1;
};

class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) {
  return x + y;
};
function mmm<T extends { x: number }>(y: T): void {
  console.log(y.x);
}
mmm({ x: 2 });
// interface bbb
