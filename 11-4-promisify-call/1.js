const prom = require("promisify-call");
function w(a, res) {
    setTimeout(() => {
        res(a);
    }, 1000);
}
async function m() {
    const t = await prom(this, w, "hello");
    console.log(t);
}
m();
