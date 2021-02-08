const express = require("express");
const app = express();
let i = 0;
app.use("*", (req, res, next) => {
    if (++i % 5 === 0) {
        console.log(i / 5);
    }
    next();
});
app.listen(3010);
app.use(express.static("./", { index: "index.html" }));
app.use(
    "/libs",
    express.static(
        "./libs/"
    )
);
// app.use(
//     "/libs_release",
//     express.static(
//         "/Users/shaofeibo/Desktop/nd-work/Edbox_SKD/Edbox_Client/H5SDK/libs_release"
//     )
// );
app.use("/dev",express.static("./dist"))
// app.use("/dev",express.static("/Users/shaofeibo/Desktop/nd-work/Edbox/Edbox_H5/Edbox_Components/Library/source/dist"))
// http://192.168.31.218:3100
