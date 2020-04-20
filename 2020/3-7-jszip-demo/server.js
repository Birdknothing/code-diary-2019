const express = require('express');
const app = express();
app.listen(3002);
app.use(express.static('./', { index: 'index.html' }));
// http://localhost:3002