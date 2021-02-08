// function addMethod(object, name, f) {
//     var old = object[name];
//     object[name] = function() {
//         if (f.length === arguments.length) {
//             return f.apply(this, arguments);
//         } else if (typeof old === "function") {
//             return old.apply(this, arguments);
//         }
//     };
// }
// const Obj = {};
const f1 = () => {
    console.log("no prm");
};
const f2 = (x) => {
    console.log("one prm", x);
};
const f3 = (x, y) => {
    console.log("two prms", x, y);
};


const addMethod = (obj, type, f) => {
    obj[f.length] = f;
    obj[type] = (...args) => {
        console.log("span");
        return obj[args.length](...args);
    };
};
const Obj = {};
addMethod(Obj, "find", f1);
addMethod(Obj, "find", f2);
addMethod(Obj, "find", f3);
Obj.find("2");

// test.find()
// test.find(1)
// const mkLinks = function(obj) {
//     let res = "";
//     const o = [
//         (o) => (res += o.name),
//         (o) => (res += o.prov),
//         (o) => (res += o.birth),
//     ];
//     while (o.length) {
//         o.shift()(obj);
//     }
//     return res;
// };
// const x = {
//     name: "shao",
//     prov: "hunan",
//     birth: "1992-11-03",
// };
// console.log(mkLinks(x));
// // const curry = (f) => {
// //     let arr = [];
// //     const fn = (...args) => {
// //         for (let arg of args) {
// //             arr.push(arg);
// //             if (arr.length === f.length) {
// //                 return f(...arr);
// //             }
// //         }
// //         return fn;
// //     };
// //     return fn;
// // };
// const w = curry((a, b, c) => console.log(a + b + c));
// w(1)(2)(3);
