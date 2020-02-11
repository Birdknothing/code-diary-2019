const express = require('express')
const app = express();
app.listen(3005)
app.use(express.static('./', { index: '1.html' }))