//  尝试登录，成功返回用户名，失败为false
async function getUsrInfo(pname, pswd, ifCache = false) {
  // if (testMap.get(uname) === pswd) {
  //   return true;
  // }
  ifCache = ifCache ? 1 : 0;
  return new Promise(res => {
    $.ajax({
      type: "POST",
      url: "/user/log",
      data: { pname, pswd, ifCache }
    }).done(result => {
      console.log(result, typeof result);
      if (result === '0') {
        res(false)
        return;
      }
      // try {
      //   result = JSON.parse(result);
      // } catch (e) {
      //   res(false)
      //   return
      // }
      res(result)
    })
  })
}
