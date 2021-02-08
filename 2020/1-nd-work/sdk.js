const express = require('express');
const app = express();
app.listen(3006);
app.use("/libs",express.static('/Users/shaofeibo/Desktop/nd-work/Edbox_SKD/Edbox_Client/H5SDK/libs/'));
