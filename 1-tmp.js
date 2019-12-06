const a = (x, res) => {
    setTimeout(() => {
        res(x);
    }, 2000);
};
const promisify = (f, l = f.length) => (...args) =>
    new Promise((res, rej) => {
        try {
            if (l === 0) {
                res(Error("no callback"));
            }
            if (l === 1) {
                f.call(f, data => {
                    res(data);
                });
            }
            const argsAll = args.slice(args.length - 1);
            f.call(f, ...argsAll, data => {
                res(data);
            });
        } catch (error) {
            rej(error);
        }
    });
const c = promisify(() => {});
const b = promisify(a);
(async () => {
    console.log(await b('x'));
})();
