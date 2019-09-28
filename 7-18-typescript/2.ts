enum E {
  Foo,
  Bar
}

function f(x: E) {
  // if (x !== E.Foo || x !== E.Bar) {
  //   //             ~~~~~~~~~~~
  //   // Error! Operator '!==' cannot be applied to types 'E.Foo' and 'E.Bar'.
  // }
}
f(2);

let x = () => ({ name: 'Alice' });
let y = () => ({ name: 'Alice', location: 'Seattle' });

x = y; // OK
interface aa {
  x: number;
  y: string;
}
interface bb {
  z: number;
  y: string;
}
let u = (x: aa | bb): aa | bb => {
  return x;
};
u({ x: 1, y: '2' }).y;
type newAa<T> = {
  readonly [K in keyof T]: T[K];
};
type partial<T> = {
  [K in keyof T]?: T[K];
};
type sp = string | number;
interface w1 {
  x: sp;
  y: sp;
}
let tts: w1 = { x: 0, y: '2' };
interface SquareConfig {
  color?: string;
  width?: number;
  // [sv:string]:string;
}
let mySquare: SquareConfig = { height: '12' } as SquareConfig;
let pn = [1, 2, 3];
console.log(pn[0]);
let pets = new Set(['Cat', 'Dog', 'Hamster']);
for (let pet in pets) {
  console.log(pet); // "species"
}

for (let pet of pets) {
  console.log(pet); // "Cat", "Dog", "Hamster"
}
