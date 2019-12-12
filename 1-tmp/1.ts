const a = "8" as string | 0;
const b = "12" as string | 0;
const c = +"8";
const d = +"12";
console.log(a > b); // true
console.log(c > d); // false
export {};
