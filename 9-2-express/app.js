var express = require('express');
var https = require('https');
var selfsigned = require('selfsigned');
var attrs = [{ name: 'commonName', value: '127.0.0.1' }];
// var pems = selfsigned.generate(attrs, { days: 365 });
var pems = selfsigned.generate(null, {
  keySize: 2048, // the size for the private key in bits (default: 1024)
  days: 30, // how long till expiry of the signed certificate (default: 365)
  algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
  extensions: [{ name: 'basicConstraints', cA: true }], // certificate extensions array
  pkcs7: true, // include PKCS#7 as part of the output (default: false)
  clientCertificate: true, // generate client cert signed by the original key (default: false)
  clientCertificateCN: 'jdoe' // client certificate's common name (default: 'John Doe jdoe123')
});
const { private: key, cert } = pems;
var http = require('http');
var app = express();

http.createServer(app).listen(80);
https.createServer({ key, cert }, app).listen(443);
app.use(express.static('public'));