// const a = '010';
const a = Number('010')
a[Symbol.toPrimitive] = c => {
  console.log(c);
  
  switch (c) {
    case 'number':return 1;
    case 'string':return 2;
    case 'default':return 3;
  }
}
const b = a | 0;
console.log(typeof b,b);
