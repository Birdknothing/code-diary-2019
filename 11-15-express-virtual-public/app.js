const express = require("express");
const app = express();
app.listen(3100);
app.use('/p2',express.static("E:\\code-diary-2019\\11-15-express-virtual-public\\public2"));
