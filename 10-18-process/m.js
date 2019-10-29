const x = 0 || null;
console.log(x);
function j(x) {
    switch (x) {
        case 1:
            console.log(1);

            return;
        case 2:
            console.log(2);
            return;
        default:
            console.log("no");
    }
}
j(2);
