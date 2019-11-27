const m = new Map([
    [1, /12/gi],
    [2, 3]
]);

const mm = [...m];
const replacer = (key, val) => {
    if (val.constructor.name === "RegExp") {
        return val.toString();
    }
    return val;
};
const n = JSON.stringify(mm, replacer);
const nn = new Map(eval(n));
console.log(new RegExp(nn.get(1)).test('123'));

// console.log(nn.get(1).test("123"));

// const w = new Map(eval(n))
// console.log(JSON.stringify([...w]));
// console.log(/12/gi.toString);
