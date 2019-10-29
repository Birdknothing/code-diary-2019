let a = 1;
const ck = setInterval(() => {
    console.log("a");
    a++;
    a === 3 && clearInterval(ck);
}, 1000);
console.log("ff");
