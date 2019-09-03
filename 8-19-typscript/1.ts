type m<T> = {
  [P in keyof T]: T[P];
}[keyof T];
const c: m<{b:string,c:string}> = 'b';
interface M {
  x: string;
  y: number;
}
type N = Pick<M, 'x' | 'y'>;
const a: N = { x: '1',y:2 };
