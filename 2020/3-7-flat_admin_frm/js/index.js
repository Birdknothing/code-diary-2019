// 图表已删
// $(function () {
//   var ctx, data, myLineChart, options;
//   Chart.defaults.global.responsive = true;
//   ctx = $('#jumbotron-line-chart').get(0).getContext('2d');
//   options = {
//     showScale: false,
//     scaleShowGridLines: false,
//     scaleGridLineColor: "rgba(0,0,0,.05)",
//     scaleGridLineWidth: 0,
//     scaleShowHorizontalLines: false,
//     scaleShowVerticalLines: false,
//     bezierCurve: false,
//     bezierCurveTension: 0.4,
//     pointDot: false,
//     pointDotRadius: 0,
//     pointDotStrokeWidth: 2,
//     pointHitDetectionRadius: 20,
//     datasetStroke: true,
//     datasetStrokeWidth: 4,
//     datasetFill: true,
//     legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
//   };
//   data = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//     datasets: [
//       {
//         label: "My Second dataset",
//         fillColor: "rgba(34, 167, 240,0.2)",
//         strokeColor: "#22A7F0",
//         pointColor: "#22A7F0",
//         pointStrokeColor: "#fff",
//         pointHighlightFill: "#fff",
//         pointHighlightStroke: "#22A7F0",
//         data: [28, 48, 40, 45, 76, 65, 90]
//       }
//     ]
//   };
//   myLineChart = new Chart(ctx).Line(data, options);
// });

// $(function () {
//   var ctx, data, myBarChart, option_bars;
//   Chart.defaults.global.responsive = true;
//   ctx = $('#jumbotron-bar-chart').get(0).getContext('2d');
//   option_bars = {
//     showScale: false,
//     scaleShowGridLines: false,
//     scaleBeginAtZero: true,
//     scaleShowGridLines: true,
//     scaleGridLineColor: "rgba(0,0,0,.05)",
//     scaleGridLineWidth: 1,
//     scaleShowHorizontalLines: false,
//     scaleShowVerticalLines: false,
//     barShowStroke: true,
//     barStrokeWidth: 1,
//     barValueSpacing: 7,
//     barDatasetSpacing: 3,
//     legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
//   };
//   data = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//     datasets: [
//       {
//         label: "My First dataset",
//         fillColor: "rgba(26, 188, 156,0.6)",
//         strokeColor: "#1ABC9C",
//         pointColor: "#1ABC9C",
//         pointStrokeColor: "#fff",
//         pointHighlightFill: "#fff",
//         pointHighlightStroke: "#1ABC9C",
//         data: [65, 59, 80, 81, 56, 55, 40]
//       }, {
//         label: "My Second dataset",
//         fillColor: "rgba(34, 167, 240,0.6)",
//         strokeColor: "#22A7F0",
//         pointColor: "#22A7F0",
//         pointStrokeColor: "#fff",
//         pointHighlightFill: "#fff",
//         pointHighlightStroke: "#22A7F0",
//         data: [28, 48, 40, 19, 86, 27, 90]
//       }
//     ]
//   };
//   myBarChart = new Chart(ctx).Bar(data, option_bars);
// });

// $(function () {
//   var ctx, data, myLineChart, options;
//   Chart.defaults.global.responsive = true;
//   ctx = $('#jumbotron-line-2-chart').get(0).getContext('2d');
//   options = {
//     showScale: false,
//     scaleShowGridLines: false,
//     scaleGridLineColor: "rgba(0,0,0,.05)",
//     scaleGridLineWidth: 0,
//     scaleShowHorizontalLines: false,
//     scaleShowVerticalLines: false,
//     bezierCurve: false,
//     bezierCurveTension: 0.4,
//     pointDot: false,
//     pointDotRadius: 0,
//     pointDotStrokeWidth: 2,
//     pointHitDetectionRadius: 20,
//     datasetStroke: true,
//     datasetStrokeWidth: 3,
//     datasetFill: true,
//     legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
//   };
//   data = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//     datasets: [
//       {
//         label: "My First dataset",
//         fillColor: "rgba(26, 188, 156,0.2)",
//         strokeColor: "#1ABC9C",
//         pointColor: "#1ABC9C",
//         pointStrokeColor: "#fff",
//         pointHighlightFill: "#fff",
//         pointHighlightStroke: "#1ABC9C",
//         data: [65, 59, 80, 81, 56, 55, 40]
//       }, {
//         label: "My Second dataset",
//         fillColor: "rgba(34, 167, 240,0.2)",
//         strokeColor: "#22A7F0",
//         pointColor: "#22A7F0",
//         pointStrokeColor: "#fff",
//         pointHighlightFill: "#fff",
//         pointHighlightStroke: "#22A7F0",
//         data: [28, 48, 40, 19, 86, 27, 90]
//       }
//     ]
//   };
//   myLineChart = new Chart(ctx).Line(data, options);
// });
// 功能列表
const Flist = {
  0: {
    name: '功能概览', dom: '<div class="row overview">{{}}</div>', tmplt: `<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
  <a href="#">
      <div class="card blue summary-inline bgShadow">
          <div class="card-body">
              <i class="icon fa fa-share-alt fa-4x"></i>
              <div class="content">
                  <div class="title">{{}}</div>
                  <!-- <div class="sub-title">Share</div> -->
              </div>
              <div class="clear-both"></div>
          </div>
      </div>
  </a>
</div>` },
  1: {
    name: '一键扒站', dom: `请输入网站地址：<input type="text" /><br>
    <button>确认</button>
  ` },
  2: { name: '敬请期待' },
  3: { name: '敬请期待' },
  4: { name: '敬请期待' },
}
// 各试图区的jq对象
const jqDom = {
  // 右侧主视图
  $rightBody: $('.side-body.padding-top'),
  // 左侧所有导航项目
  $leftNavItems: $('.navitems li'),
  // 退出登录按钮
  $logoutBtn: $('.logout')
}
// 用户信息
const User = {
  name: '',
  login: false,
  _access: {},
  get access() { return this._access; },
  set access(val) {
    this._access = (val | 0).toString().split('').reduce((acc, ele) => {
      if (Flist[ele]) {
        acc[ele] = Flist[ele];
      }
      return acc;
    }, {})
  },
  setName(n) {
    this.login = true;
    n && $('.whoami').html(n)
  },
  setAccess(a) {
    a && (this.access = a);
  }
};

// 页面
const Page = {
  setUser: async function () {
    // 看是否有cookie保存，尝试登录
    const { pname: uname, access } = await getUsrInfo();
    const reqName = uname;
    const urlName = Utils.tsUrlName(location.search);
    if (urlName) {
      // 隐藏url上的参数
      window.history.replaceState('', document.title, '/')
    }
    const u_name = reqName || urlName;
    if (u_name) {
      User.setName(u_name);
      User.setAccess(access);
      return
    }
    location.href = 'login.html'
  },
  initUI: function () {
    // var con = c || User.login;
    User.login && $('body').removeClass('invisible');
    // 左侧选项根据权限部分显示ui
    Object.keys(User.access).forEach(ch => {
      jqDom.$leftNavItems.eq(ch | 0).removeClass('hidden')
    })
    // 初始化侧边栏所有选项的模板
    Object.entries(Flist).forEach(([key, val]) => {
      // 有模版tmplt才触发替换，否则取默认dom
      if (val.tmplt) {
        // 概览项body
        if (key | 0 === 0) {
          let tmpDom = ''
          Object.values(Flist).forEach((x, i) => i !== 0 && (tmpDom += Utils.fillTmplt(val.tmplt, x.name)))
          val.dom = Utils.fillTmplt(val.dom, tmpDom)
        }
      }
    })
    // 事件绑定
    PageEvent.initBind();
  }
}
// 页面方法
const Utils = {
  // url中解析出pname
  tsUrlName(urlname) {
    if (!urlname) { return false }
    urlname = urlname + ''
    return Array.prototype.map.call(urlname.substring(1, 6), ch => String.fromCharCode(ch.charCodeAt(0) - 1)).join('')
  },
  fillTmplt(tplt, val) {
    return tplt.replace(/{{}}/, val)
  }
}
// 页面事件
const PageEvent = {
  initBind() {
    // 退出登录
    jqDom.$logoutBtn.click(function () {
      $.ajax({
        type: "POST",
        url: "/user/log",
        data: { noCache: 1 }
      })
      location.href = 'login.html'
    })
    // 左侧菜单栏切换
    jqDom.$leftNavItems.click(function () {
      let $div = $(this);
      $div.addClass('active').siblings().removeClass('active')
      Router.tab($div.index())
    }).eq(0).click()
    // 禁止hash在url显示
    $('a').click(function (e) { e.preventDefault() })
  }
}
const Router = {
  // 右侧主体显示,i表示显示第几个导航项的dom内容
  tab(i) {
    jqDom.$rightBody.html(Flist[i].dom)
  }
}
Page.setUser().then(Page.initUI);