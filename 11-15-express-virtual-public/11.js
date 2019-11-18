const libs = {
    strIsDisabled(allstr, str) {
        return allstr.match(new RegExp(`// disableOneLine ${str}`));
    },
    disableOneLine(str) {
        return `// disableOneLine ${str}`;
    },
    enableDisabledLines(str) {
        return str.replace(/\/\/ disableOneLine (.*)/gm, "$1");
    },
    strHasTestLine(allstr, str) {
        const exp = new RegExp(`// testLine-- \n${str}\n// --testLine`);
        console.log(exp);

        return allstr.match(exp);
    },
    addTestLine(str) {
        return `\n// testLine-- \n${str}\n// --testLine\n`;
    },
    delAllTestLines(str) {
        return str.replace(/\n\/\/ testLine--.*?\/\/ --testLine\n/gs, "");
    }
};
const b = `testDisableOneline`;
const s = `// disableOneLine abcd edf
// disableOneLineabcd
// disableOneLine haha`;
const ss = `// testLine-- 
hah
// --testLine`;

// console.log(libs.enableDisabledLines(s));
// console.log(libs.delAllTestLine(libs.addTestLine(libs.addTestLine("hahaha"))));
const r1 = libs.addTestLine("abc") + libs.addTestLine("abc");
console.log(libs.strIsDisabled(s, "hah"));

if (libs.strHasTestLine(s, "abcd edf")) {
    console.log("isTestLine");
}
