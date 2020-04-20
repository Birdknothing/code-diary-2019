const express = require('express');
const app = express();
app.listen(3012);
app.use(express.static('./', { index: 'index.html' }));
// http://127.0.0.1:3012
