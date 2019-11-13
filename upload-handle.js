const fs = require("fs");
const returnJson = url => JSON.parse(fs.readFileSync(url).toString());
// const orignjsonstr = fs.readFileSync('./SimplifiedChinese.test.json').toString();
const originjson = returnJson("./SimplifiedChinese.test.json");
const targetjson = returnJson("./upload.json");
const M = new Map([
  ["Edbox", "edbox"],
  ["99U", "nd"],
  ["Edmodo", "edmd"],
  ["Facebook", "fb"],
  ["Weixin", "wx"]
]);
const handle = function({ key, val }) {
  if (M.has(val.Name)) {
    val.Image = targetjson[M.get(val.Name)];
  }
};
function dealObj(obj, cb) {
  Object.entries(obj).forEach(([key, val]) => {
    if (typeof val === "object" && "Image" in val) {
        console.log({key,val});
        
      cb({ key, val });
    }
    if (typeof val === "object") {
      dealObj(val);
    }
  });
}
const writejson = (obj, url) =>
  fs.writeFileSync(url, JSON.stringify(obj, null, 3));
dealObj(originjson, handle);
writejson(originjson, "./result.json");
