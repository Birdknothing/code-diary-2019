const n = new Promise((res) => {
  setTimeout(res, 2000, 'hello')
})
  ; (async () => {
    console.log(await n);

  })()