const express = require("express");
const app = express();
app.listen(3000);
app.use(express.static("./dist", { index: "index.html" }));
// app.use("*", (req, res) => {
//   console.log(req.baseUrl);
  
//   if (req.baseUrl.indexOf(".") !== -1){
//     console.log('here');
    
//   }
  
//   res.sendFile("/dist/index.html", { root: __dirname }); 
// });
