const y = 2;
const m = Date.now();
const M = () => {
  const x = 1;
  const n = Date.now();
  return () => () => () => {
    const mm = 2;
    return () => {
      const z = 1;
      return () => {
        console.log('%c %s', 'color:red', 'timespan');
        // console.log(x, Date.now() - n);
        console.log(y, Date.now() - m);
      };
    };
  };
};
M()()()()()();
const K = new Map();
const zz = Symbol({ x: 1 });
const mm = Symbol({ x: 1 });
K.set(zz, 2);
K.set(mm, 3);
console.log(K.get(mm));
console.log(1 > 2);
