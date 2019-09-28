const express = require('express'),
  app = express();
app.listen(3010);
app.use('/a', (req, res) => {
  console.log(Object.keys(req));
  console.log(req.httpVersion);
  console.log(req.httpVersionMajor);
  console.log(req.httpVersionMinor);
  console.log('req.headers', req.headers);
  // res.header('Cache-Control', 'max-age:0');
  res.send('hello');
});
app.use(
  express.static('public', {
    lastModified: false,
    maxAge: '1d',
    etag: false,
    setHeaders: (res, path, stat) => {
      res.set('expires', new Date(Date.now() + 900000));
    }
  })
);
