const express = require('express');

const app = express();

app.listen(3002);
// app.use("/test",(req,res)=>{

// });
//   const zipo = new jszip()
//   const zip = zipo.folder('test');
//   zip.file('1.txt','123')
//   zip.file('2.txt','456')
//   const target =await zipo.generateAsync({
//             type: "nodebuffer",
//             compression: "DEFLATE",
//             compressionOptions: {
//                 level: 9
//             }
//         });
//         fs.writeFileSync('./abc.zip',target)
//   res.send(target)
// })
app.use(express.static('./'));
// http://127.0.0.1:3002
