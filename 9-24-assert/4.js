
const a = new Int8Array(8);
a[0] = 258;
console.log(a);
console.log(0xF);
console.log('t'.charCodeAt(0));
console.log(String.fromCharCode(0xc3));

console.log('😊'.codePointAt(0));

console.log(Buffer.from('tést'));
console.log(Buffer.from('tést', 'latin1'));
// 创建一个包含 UTF-8 字节 [0x74, 0xc3, 0xa9, 0x73, 0x74] 的 Buffer。
const buf5 = Buffer.from('tést');

// 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。
const buf6 = Buffer.from('tést', 'utf-8');
// console.log(Buffer.allocUnsafe(10).toString('latin1'));
// console.log(Buffer.alloc(10));
// console.log(Buffer.from('hello world','utf-8'));
// console.log(Buffer.from('hello world','hex'));
// console.log(Buffer.from('hello world','latin1'));
// console.log(Buffer.from('hello world','ascii'));
// console.log(Buffer.__proto__.name);
// console.log(Buffer.__proto__.__proto__.name);
// console.log(Buffer.__proto__.__proto__.__proto__);
const b1 = new Uint8Array(2)
const b2 = new Uint16Array(2)
// b1[0] = 256;
// b2[0] = 256;
// console.log(b1);
// console.log(b2);
// console.log(b1.length);
console.log(Buffer.byteLength(b1));
console.log(Buffer.byteLength(b2));
// const c1 = Buffer.from('abc')
// const c2 = Buffer.from(c1)
// c1[0]=98;
// console.log(c1.toString());
// console.log(c2.toString());
const buf9 = Buffer.from('tést')
// console.log(buf9);
// for(let key of buf9){
//   console.log(key);

// }
console.log([buf9, buf9]);
const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];
const m1 = [1, 2, 3]
const m2 = [4, 5, 6]
// console.log(arr.sort(Buffer.compare));
// console.log(arr.sort());
console.log(Buffer.concat([buf1, buf2]));
// console.log(Array.prototype.concat.apply(m1,m2));
console.log(ArrayBuffer.__proto__);
console.log(Reflect.ownKeys(ArrayBuffer.prototype));
console.log(new ArrayBuffer(10));
console.log(Symbol('12').toString() + '3');
console.log(Number(1) + '3');
const s1 = Symbol('123')
const s2 = Symbol('123')
console.log(s1 === Symbol.for('123'));
console.log(s2 === Symbol.for('123'));
const g = function* () {
  yield 1;
  yield 2;
  yield 3;

}
console.log(g().next());
console.log(g());
console.log(typeof Object.values({ x: 1, y: 2 }));
const aa = { x: 1, y: 2, c: 3 }
const bb = []
let i = 0;
// aa[Symbol.iterator] = function *() {
//   yield 1;
//   yield 2;
//   return 3;
// }
// ;console.log(Object.values(aa));

aa[Symbol.iterator] = function* () {
  for (let key in aa) {
    yield aa[key]
  }
}
for (bb[i++] of aa)/* */;
console.log([...Object.values(aa)]);
console.log(Array.from(Object.values(aa)));

console.log(bb);
const cc = [1, 2]
cc[Symbol.isConcatSpreadable] = true;
console.log(cc.concat([3, 4]));
const d1 = {0:4,1:2,2:'3',length:3,get [Symbol.species](){return Array}}
Object[Symbol.species] = Array
// d1[Symbol.species] = Array
class myObject extends Object{
  // static get [Symbol.species](){return Function}
  constructor(p){
    super(p)
  }
}
class mmyObject extends myObject{
  static get [Symbol.species](){return myObject}

}
const d2 = new mmyObject();
d2['0'] = 1;
d2['1'] = 2;
console.log(d2 instanceof mmyObject);

// console.log(d1.push(4))
// Array.prototype.push.call(d1,4)
// console.log(d1);



let obj = {
  [Symbol.toPrimitive](hint) {
    console.log(hint);
    switch (hint) {
      case 'number':
        return 123;
      case 'string':
        return 'str';
      case 'default':
        return 'default';
      default:
        throw new Error();
     }
   },
   valueOf(){return 100},
   toString(){return '100'}
};
console.log(2*obj);
console.log(3+obj);

console.log(obj == 'default') // true
console.log(String(obj));
const mn = 'hello world'
const tmp = Buffer.alloc(11);
Array.prototype.forEach.call(mn,(x,i) => (tmp[i] = x.charCodeAt(0)));
console.log(tmp.toString('utf8'));

const t = Buffer.from('tést');
console.log(Buffer.isEncoding());
const buf = Buffer.from([0, 5]);
console.log(buf.readInt16LE(0));
console.log(012+'a');

// console.log(Number(1280));
// console.log(parseInt('1280',2));
console.log(Number(1280).toString(2));
const buff = Buffer.from([0, 5]);
buff.swap16();
console.log(buff.readInt16BE(0));
// 打印: 5
// console.log(buff.readInt16LE(0));

// console.log(Number(0x10));









