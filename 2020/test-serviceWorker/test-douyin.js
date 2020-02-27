$(document).ready(function() {
  getCaptcha();
  ck = getCookie("vtool-token");
  if (ck != null) {
    $(".vauth").remove();
    $(".my").html('<span class="glyphicon glyphicon-user"></span>个人中心');
  }
});
function getCaptcha() {
  $.get("/v3/captcha/code", function(result) {
    if (result.code == 0) {
      $(".captcha img").attr("src", result.data.url + "?reload=1");
      $(".captcha input[name='captcha_id']").attr("value", result.data.id);
    } else {
      alert(result.message);
    }
  }).fail(function() {
    alert("系统繁忙, 请稍后再试");
  });
}
$(".switch-captcha").click(function() {
  var e = $("#captcha-img");
  var src = e.attr("src");
  var p = src.indexOf("?");
  if (p >= 0) {
    src = src.substr(0, p);
  }
  e.attr("src", src + "?reload=" + new Date().getTime());
});
$(".submit-btn").on("click", function() {
  url = $("input[name='url']").val();
  platform = $("input[name='platform']").val();
  capid = $("input[name='captcha_id']").val();
  capvalue = $("input[name='value']").val();
  if (url == "") {
    $("#result-box").empty();
    $("#result-box").append(
      `<div class="alert alert-danger">地址不能为空</div>`
    );
    return;
  }
  $("#loadingModal").modal("show");
  ck = getCookie("vtool-token");
  addr = $("form").attr("action");
  $.ajax({
    url: addr,
    method: "POST",
    headers: { Authorization: ck },
    data: { url: url, platform: platform, captcha_id: capid, value: capvalue }
  })
    .done(function(result) {
      $("#result-box").empty();
      if (result.code == 0) {
        $("#result-box").append(result.data.html);
      } else {
        $("#result-box").append(result.message);
      }
      $("#loadingModal").modal("hide");
      getCaptcha();
    })
    .fail(function() {
      alert("系统繁忙, 请稍后再试");
      $("#loadingModal").modal("hide");
      getCaptcha();
    });
});
function getCookie(name) {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.download = factory();
  }
})(this, function() {
  return function download(data, strFileName, strMimeType) {
    var self = window,
      defaultMime = "application/octet-stream",
      mimeType = strMimeType || defaultMime,
      payload = data,
      url = !strFileName && !strMimeType && payload,
      anchor = document.createElement("a"),
      toString = function(a) {
        return String(a);
      },
      myBlob = self.Blob || self.MozBlob || self.WebKitBlob || toString,
      fileName = strFileName || "download",
      blob,
      reader;
    myBlob = myBlob.call ? myBlob.bind(self) : Blob;
    if (String(this) === "true") {
      payload = [payload, mimeType];
      mimeType = payload[0];
      payload = payload[1];
    }
    if (url && url.length < 2048) {
      fileName = url
        .split("/")
        .pop()
        .split("?")[0];
      anchor.href = url;
      if (anchor.href.indexOf(url) !== -1) {
        var ajax = new XMLHttpRequest();
        ajax.open("GET", url, true);
        ajax.responseType = "blob";
        ajax.onload = function(e) {
          download(e.target.response, fileName, defaultMime);
        };
        setTimeout(function() {
          ajax.send();
        }, 0);
        return ajax;
      }
    }
    if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {
      if (payload.length > 1024 * 1024 * 1.999 && myBlob !== toString) {
        payload = dataUrlToBlob(payload);
        mimeType = payload.type || defaultMime;
      } else {
        return navigator.msSaveBlob
          ? navigator.msSaveBlob(dataUrlToBlob(payload), fileName)
          : saver(payload);
      }
    }
    blob =
      payload instanceof myBlob
        ? payload
        : new myBlob([payload], { type: mimeType });
    function dataUrlToBlob(strUrl) {
      var parts = strUrl.split(/[:;,]/),
        type = parts[1],
        decoder = parts[2] == "base64" ? atob : decodeURIComponent,
        binData = decoder(parts.pop()),
        mx = binData.length,
        i = 0,
        uiArr = new Uint8Array(mx);
      for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);
      return new myBlob([uiArr], { type: type });
    }
    function saver(url, winMode) {
      if ("download" in anchor) {
        anchor.href = url;
        anchor.setAttribute("download", fileName);
        anchor.className = "download-js-link";
        anchor.innerHTML = "downloading...";
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        setTimeout(function() {
          anchor.click();
          document.body.removeChild(anchor);
          if (winMode === true) {
            setTimeout(function() {
              self.URL.revokeObjectURL(anchor.href);
            }, 250);
          }
        }, 66);
        return true;
      }
      if (
        /(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(
          navigator.userAgent
        )
      ) {
        url = url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
        if (!window.open(url)) {
          if (
            confirm(
              "Displaying New Document\n\nUse Save As... to download, then click back to return to this page."
            )
          ) {
            location.href = url;
          }
        }
        return true;
      }
      var f = document.createElement("iframe");
      document.body.appendChild(f);
      if (!winMode) {
        url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
      }
      f.src = url;
      setTimeout(function() {
        document.body.removeChild(f);
      }, 333);
    }
    if (navigator.msSaveBlob) {
      return navigator.msSaveBlob(blob, fileName);
    }
    if (self.URL) {
      saver(self.URL.createObjectURL(blob), true);
    } else {
      if (typeof blob === "string" || blob.constructor === toString) {
        try {
          return saver("data:" + mimeType + ";base64," + self.btoa(blob));
        } catch (y) {
          return saver("data:" + mimeType + "," + encodeURIComponent(blob));
        }
      }
      reader = new FileReader();
      reader.onload = function(e) {
        saver(this.result);
      };
      reader.readAsDataURL(blob);
    }
    return true;
  };
});
$(document).on("click", ".download-btn", function() {
  $(".thumbnail img").each(function(i) {
    var src = $(this).attr("src");
    download(src);
  });
});
