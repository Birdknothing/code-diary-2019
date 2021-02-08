(async () => {
    // @ts-ignore
    await {
        then(cb) {
            setTimeout(() => {
                cb("hei");
            }, 2000);
        }
    };
})();
