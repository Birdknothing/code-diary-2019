//@ts-ignore
const express = require('express');
//@ts-ignore
const app = express();
app.listen(3003);
app.use(express.static('./', { index: 'index.html' }));
process.on("SIGINT",function() {
  console.log('log out');
  process.exit();
})
