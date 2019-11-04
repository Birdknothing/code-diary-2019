function sortKeysByKey(shortArr, longArr) {
    var res = [];
    var indexArr = [];
    for (var key in shortArr) {
        for (var skey in longArr) {
            if (shortArr[key] === longArr[skey]) {
                res.push(longArr[skey]);
                indexArr.push(skey);
                break;
            }
        }
        // res.push(arr.indexOf(shortArr[key])){
        //     break;
        // }
    }
    console.log(indexArr);
    var sortArr = indexArr.sort();
    console.log(sortArr);

    for (var n in sortArr) {
        longArr[sortArr[n]] = res[n];
    }
}
var sarr = [1, 2, 6];
var longarr = [2, 5, 1, 6];
sortKeysByKey(sarr, longarr);
console.log(longarr);
