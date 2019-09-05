const async = require('async');
async.series(
  [
    function(c) {
      console.log(1);
      c()
      
    },
    function() {
      console.log(2);
      
      
    }
  ]);
