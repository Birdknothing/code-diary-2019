const M = async function() {
    const n = await new Promise((res, rej) => {
        setTimeout(res, 2000, "hi world");
    });
    console.log(n);

    console.log("inside M sync");
};
const map = new Map([
    ["1", new Promise(res => setTimeout(res, 2000, "1"))],
    ["2", new Promise(res => setTimeout(res, 4000, "2"))],
    ["3", new Promise(res => setTimeout(res, 2000, "3"))]
]);
const N = async function() {
    // map.forEach(async (val, key) => {
    //     return console.log(await val);
    // });
    for(let value of map){
        const [key,val] = value;
        console.log(await val);
    }
    return;
};
(async () => {
    await N();
    console.log("N ends");
})();
