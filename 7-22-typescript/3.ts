/// <reference  path="3.d.ts"/>
const h: Test = {
  x: 1,
  y: 2
};
class K {
  x: string;
  constructor(x: string) {
    this.x = x;
  }
}
class K0 extends K {}
class K1 extends K0 {
  x: string;
  y: string;
  constructor(x: string, y: string) {
    super(x);
    this.x = x;
    this.y = y;
  }
}
class K2 extends K0 {
  x: string;
  y?: number;
  constructor(x: string, y?: number) {
    super(x);
    this.x = x;
    this.y = y;
  }
}
class K3 extends K1 {}
class K4 extends K1 {}
class M {
  x: string;
  y: string;
  z: string;
  constructor(x: string, z: string) {
    this.x = x;
    this.z = z;
    this.y = '12';
  }
}
let k = [K1, K2];
k = [K3, K4, M];
type w<T> = T extends (...args: number[]) => infer R ? R : any;
function jj(x: number):w<string> {
  return x;
}
type kk = w<string>;
type bb = string;
