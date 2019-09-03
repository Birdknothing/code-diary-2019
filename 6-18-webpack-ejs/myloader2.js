const fs = require('fs');
module.exports = function(data, map, meta) {
  console.log(data);
  console.log(map);
  console.log(meta);
  fs.writeFileSync('./44.text', data);
  return data;
};
