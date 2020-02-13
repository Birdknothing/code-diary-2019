const a = [{ x: 1 }, { x: 2 }, { x: 3 }];

function insertBeforeByIndex(arr, from, to) {
    if (from < to) {
        if (from + 1 === to) {
            return;
        }
        arr.splice(to, 0, arr[from]);
        arr.splice(from, 1);
    } else {
        arr.splice(to, 0, arr[from]);
        arr.splice(from + 1, 1);
    }
}
insertBeforeByIndex(a, 2, 1);
console.log(a);
console.log([2,1,4].sort());

