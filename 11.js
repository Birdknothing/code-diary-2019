const a = [];
console.log(Object.prototype.toString.call(a).substring(-6, -1));
// function test (n){
//   n = n && n.toString && n.toString();
//   switch (true) {
//     case n === 'haha':
//       console.log('yes');

//       break;

//     default:
//       console.log('no haha');

//       break;
//   }
// }
function test(nv) {
    nv = nv && nv.toString && nv.toString();
    switch (true) {
        case nv === "US" || nv.toLowerCase() === "english":
            console.log("haha");

            return;

        default:
            console.log("no");
            return;
    }
}
const m = "str";
console.log(m.length || 0);
const ww = function() {
    console.log("haha");
};
const k = new Function("return 123");
console.log(k());
const w = "funcito(){var a ={} };";
const mmC = w
    .toString()
    .replace(/.*?{/, "").match(/.*}/)[0].slice(0,-1);
console.log(w.toString().replace(/.*?{/, ""));

console.log(mmC);
console.log("good1234good43good21bad".match(/(?<=good)((?!(good)).)*(?=(bad))/)[0]);

test(true);
test({});
test([]);
test("US");
test("English");
