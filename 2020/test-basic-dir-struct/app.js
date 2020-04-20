const express = require('express');
const app = express();
app.listen(3002);
app.use(express.static('./', { index: 'index.html' }));
// http://127.0.0.1:3002
