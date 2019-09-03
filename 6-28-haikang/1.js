/* 浠ｇ爜鏁寸悊锛氭噿浜轰箣瀹� www.lanrenzhijia.com */
function SlideShow(c) {
  const a = document.getElementById('slideContainer'),
    f = document.getElementById('slidesImgs').getElementsByTagName('li'),
    h = document.getElementById('slideBar'),
    n = h.getElementsByTagName('li'),
    d = n.length;
  let e = (lastI = 0),
    j,
    m;
  function b() {
    m = setInterval(function() {
      e = e + 1 >= d ? e + 1 - d : e + 1;
      g();
    }, c);
  }
  function k() {
    clearInterval(m);
  }
  function g() {
    f[lastI].style.display = 'none';
    // f[lastI].style.visibility = 'hidden';
    n[lastI].className = '';
    f[e].style.display = 'block';
    // f[lastI].style.visibility = 'visible';
    n[e].className = 'on';
    lastI = e;
  }
  f[e].style.display = 'block';
  a.onmouseover = k;
  a.onmouseout = b;
  h.onmouseover = function(i) {
    j = i ? i.target : window.event.srcElement;
    if (j.nodeName === 'LI') {
      e = parseInt(j.innerHTML, 10) - 1;
      g();
    }
  };
  b();
}
/* 浠ｇ爜鏁寸悊锛氭噿浜轰箣瀹� www.lanrenzhijia.com */
