const fs = require("fs");
fs.watch('./',{encoding:'utf-8'},()=>{})
process.on("SIGINT",  function() {
    console.log("fk");
    fs.writeSync(2, "fk");
    setTimeout(() => {
        process.exit();
    }, 1000);
});
