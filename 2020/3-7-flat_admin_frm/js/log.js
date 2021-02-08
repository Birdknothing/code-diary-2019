// 登录页
$(function () {
  $('.btn.btn-block').click({ canClick: true }, async function (e) {
    e.preventDefault();
    const { data } = e;
    let ifCache = false;
    if (!data.canClick) {
      return
    }
    data.canClick = false;
    const { password, username } = document.forms[0];
    // 是否一小时内记住
    if (document.forms[0][2].checked) {
      ifCache = true;
    }
    const { pname, access } = await getUsrInfo(username.value, password.value, ifCache);
    console.log(pname, access);

    // 登录成功
    if (pname) {
      let tmp = Array.prototype.map.call(pname, ch => String.fromCharCode(ch.charCodeAt(0) + 1)).join('')
      location.href = '/index.html' + '?' + tmp;
      // history.pushState({ test: 1 }, "title", "index.html")
      return;
    }
    // 登录失败
    $('.wrongLog').html('账户不存在或密码错误！').css('color', 'red').css('opacity', 1).animate({ opacity: 0 }, {
      duration: 3000, complete() {
        data.canClick = true;
      }
    })
  })
})