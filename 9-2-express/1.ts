type M = 'x' | 'y';
const a: A = {
  x: { x1: 1, x2: 2 },
  y: { y1: 1, y2: 2 }
};
interface A {
  x: { x1: number; x2: number };
  y: { y1: number; y2: number };
}
type A1 = keyof A;
type A2 = {
  [P in A1]: A[P];
};
type Fa<T extends keyof A = keyof A,M extends keyof A[T] = keyof A[T]> = {
  test: T;
  tt: M;
};

const w: M = 'y';
const b = pathFor<A>()(
  'x',
  'x1'
);
type Foo = {
  outer: {
      inner: any;
  }
  outer2: {
      inner2: any;
  }
}
type PropertyList<T, K1 extends keyof T = keyof T, K2 extends keyof T[K1] = keyof T[K1]> = [K1, K2];
 
// Usage 
// let myList = pathFor<Foo>()("outer", "inner"); // typed as ["outer, "inner"]
// let myList2 = pathFor<Foo>()("outer2", "inner"); // error, inner is not part of outer2
// let myList3 = pathFor<Foo>()("outer2", "inner2"); // typed as ["outer2, "inner2"]
