const express = require("express");
const router = express.Router();
const apiMap = new Map([
  [
    "/test",
    {
      msg: "hello"
    }
  ]
]);
apiMap.forEach((msg, api) => {
  router.use(api, (req, res) => {
    res.send(JSON.stringify(msg));
  });
});
module.exports = router;
