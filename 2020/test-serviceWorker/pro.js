const a = new Promise(res => {
  res("hello");
})
  .then(msg => {
    return {
      then(res) {
        return res("funck");
      }
    };
  })
  .then(msg => {
    console.log(msg);
    return new Promise(res => {
      res("end");
    });
  })
  .then(console.log);
(async () => {
  console.log(
    await {
      then(res) {
        res("what");
      }
    }
  );
})();
