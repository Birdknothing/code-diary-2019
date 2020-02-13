let a = 1;
const ck = setInterval(() => {
    console.log("a");
    a++;
    a === 3 && clearInterval(ck);
}, 1000);
console.log("ff");
const b = [1,2,3]
// b.splice(3,0,4)
b.splice(1,0,4)
console.log(b);

