(async () => {
    await new Promise((res) => {
        setTimeout(res, 2000, "hello");
    });
})();
