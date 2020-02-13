const express = require("express");

const router = express.Router();
const apiMap = new Map([["/efg", "hello"]]);
apiMap.forEach((val, api) => {
    router.use(api, (req, res) => {
        res.send(JSON.stringify(val));
    });
});

module.exports = router;
