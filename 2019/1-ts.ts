const a = { x: { y: 1 } };
const c = undefined;
const d = false;
console.log(c ?? 'result');
console.log(d ?? 'result');
const n = function(){

}
class MM {
}
const m = new MM();
console.log(m instanceof Object);
console.log(m.constructor['name']);
