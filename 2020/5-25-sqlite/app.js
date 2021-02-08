const sqlite3 = require("sqlite3");
sqlite3.verbose();
const log = ({ type, msg }) => console.log(msg);
let db = null;
const connect = (dbs) =>
    new Promise((res) => {
        db = new sqlite3.Database(
            dbs,
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            (err) => {
                console.log(err);
                log({ type: "err", msg: err });
                res(!err ? "success" : "fail");
            }
        );
    });
(async () => {
    const s = await connect("test.db");
    db.all("select * from test;", [], (err, row) => {
        console.log(row);
    });
})();
