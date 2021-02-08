const express = require('express');
const cors = require('cors');
const path = require("path");
const app = express();
app.listen(3009);
app.use(cors());
app.use(express.static('./', { index: 'index.html' }));
app.use('/library',express.static(path.resolve(__dirname,'../../my-min-library')));
console.log(path.resolve(__dirname,'../../my-min-library'));

