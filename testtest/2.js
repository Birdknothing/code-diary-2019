const fs = require("fs");
// fs.readFile('./bg.jpg',{encoding:'binary'},(err,data)=>{

//     console.log(data.toString());
// })
const rs = fs.createReadStream("./111.png", { encoding: "binary" });
rs.on("data", data => {
    console.log(data);
});
