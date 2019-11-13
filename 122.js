const A = new Function(`{x,y}`, `console.log(x,y)`);
A({ x: 1, y: 2 });
console.log([].constructor.name);
console.log({}.constructor.name);
// let x = 'global'
const xx = { x: "global" };
// module.exports = { x: "haha" };

console.log(Reflect.ownKeys(module));

function b() {
  var x = "local";
  return function() {
    var x = "local";
    return function() {
      // console.log(x);
      var x = "local";
      with (xx) {
        // console.log(x);

        new Function("", `console.log(x)`)();
      }
    };
  };
}

// b()()()
const c = b()();
c();
