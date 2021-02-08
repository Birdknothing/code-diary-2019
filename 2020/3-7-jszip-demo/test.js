const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// 拷贝 `arr` 的内容。
const buf1 = Buffer.from(arr);
// 与 `arr` 共享内存。
const buf2 = Buffer.from(arr.buffer);
const m = 4000;
const n = Buffer.from(["a".charCodeAt(0),+"b".charCodeAt(0)])
console.log("a".charCodeAt(0));
console.log(Buffer.from("\n").toString().charCodeAt(0));

console.log(n);
console.log(JSON.stringify(n));
console.log(Buffer.from('aGVsbG8gd29ybGQ=', 'base64'));
const z =new Uint16Array(2);
z[0]=1;
console.log(Buffer.from(z.buffer));
console.log(Buffer.from('fhqwhgads', 'utf16le'));
console.log(Buffer.from(Number(0xfeedfac).toString()));




