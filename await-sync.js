const M = async function() {
    const n = await new Promise((res, rej) => {
        setTimeout(res, 2000, "hi world");
    });
    console.log(n);

    console.log("inside M sync");
};
M();
console.log("outerside M sync");
