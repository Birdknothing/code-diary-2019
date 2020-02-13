// let arr: string[] = ['1', '2'];
// interface m<Object extends n> {
//   (x: Object): string;
//   (x: string): object;
// }
// interface n {
//   length: number;
// }
// interface k {
//   o: new () => void;
// }
// // console.log(w(12));
// let z: k = { o: class zz {} };
// console.log(w({ length: 1 }));
// interface a1 {
//   color?: string;
//   num?: number;
//   [props: string]: number | string;
// }
// let b1: a1 = { color: 'a', numb: 2 };
// interface a2 {
//   name: string;
//   num: number;
// }
// let b2: keyof a2;
// let b3: a2 = { name: 'aa', num: 2 };
// for (let key in b3) {
//   console.log(key);
// }
// type readonl = {
//   readonly [P in keyof a2]?: a2[P];
// };
// let b4: readonl = { name: 'haha' };
// interface Map1<T> {
//   [key: string]: T;
// }
// let keys1: keyof Map1<number>; // string
// keys1 = 12;
// // let value: Map1<number>['foo']; // number
