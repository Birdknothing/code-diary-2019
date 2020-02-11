const express = require("express");
const app = express();
app.listen(3002);
// app.use(express.static('./'));
app.use("/[^\.]*", (req, res) => {
    console.log('here');
    res.send('url')
});
