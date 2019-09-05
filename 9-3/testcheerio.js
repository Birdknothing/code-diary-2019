const fs = require('fs');
const path = require('path');
const Cheerio = require('cheerio');
const str = `<div>123</div><link rel="stylesheet" href="abc.css" data-test="123"/><link rel="stylesheet" href="/345.css"/><script src="/123.js"></script>`;
const $ = Cheerio.load(str);
$('link').each(function() {
  console.log($(this).prop('href'));
});
console.log(
  $('link')
    .data('test', 456)
    .prop('data-test')
);
console.log('abc.html'.includes('.'));
