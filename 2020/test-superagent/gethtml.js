const sp = require("superagent-charset")(require("superagent"));
const path = require("path");
const fs = require("fs");
const header = {
    cookie:
        "_ga=GA1.2.1916785294.1585188321; processon_userKey=5e00c82fe4b0bb7c58c6ecf2; _sid=bfb0c851c424749e7136295f2152acf3; _gid=GA1.2.1908670608.1587792106; JSESSIONID=CEF2FD3954BBBA5AFB8C891BA911AA76.jvm1; zg_did=%7B%22did%22%3A%20%22171149638d01a8-0cb0100b63bd57-396b7407-13c680-171149638d1860%22%7D; zg_3f37ba50e54f4374b9af5be6d12b208f=%7B%22sid%22%3A%201587801214282%2C%22updated%22%3A%201587801214282%2C%22info%22%3A%201587633367513%2C%22superProperty%22%3A%20%22%7B%7D%22%2C%22platform%22%3A%20%22%7B%7D%22%2C%22utm%22%3A%20%22%7B%7D%22%2C%22referrerDomain%22%3A%20%22www.processon.com%22%2C%22cuid%22%3A%20%225e00c82fe4b0bb7c58c6ecf2%22%2C%22zs%22%3A%200%2C%22sc%22%3A%200%2C%22firstScreen%22%3A%201587801214282%7D"
};
const header1 = {}
const configSp = config => sp => {
    for (let key in config) {
        sp = sp.set(key, config[key]);
    }
    return sp;
};
const addHeader = configSp(header);
const getHtml = url =>
    addHeader(sp.get(encodeURI(url))).end(async (err, res) => {
        // Object.keys(res).forEach(ele => {
        //   console.log(ele,typeof res[ele]);

        // });

        fs.writeFileSync("./target.html", res.text.toString());
    });
const url = "https://www.processon.com/apps/5ea1a99cf346fb177b90855f";
getHtml(url);
