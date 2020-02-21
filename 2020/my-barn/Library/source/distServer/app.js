const express = require("express");
const app = express();
app.listen(3015);
app.use(express.static("../../dist"));
app.use("/libs", express.static("E:\\git-client\\Edbox_Client\\H5SDK\\libs"));
app.use("/coms/Library", express.static("E:\\git-project-library\\Edbox_H5\\Edbox_Components\\Library\\dist"));
app.use("/coms/_Library_Gallery", express.static("E:\\git-project-library\\Edbox_H5\\Edbox_Components\\Library\\dist"));
// http://192.168.211.46:3015
