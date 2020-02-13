const express = require('express')
const app = express();
app.listen(3001);
app.use(express.static('./', { index: 'index2.html' }))
// http://192.168.31.218:3001