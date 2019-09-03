const express = require('express'),
  app = express();
app.listen(8011);
app.use(express.static('./dist'));
