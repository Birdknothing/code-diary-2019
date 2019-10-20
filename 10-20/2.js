setTimeout(() => {
    console.log("child");
}, 2000);
process.on("beforeExit", () => {
    console.log("before exit");
});
process.on("exit", () => {
    console.log("exit");
});
process.on('message')
