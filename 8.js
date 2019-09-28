function formatObj(data) {
  const sheet = [];

  data.forEach(ele => {
    let client_time = 0;
    let { ext, page, click, time, st, commonParams } = ele;

    const type = click === 'debug-log' ? '调试日志' : '业务日志';
    client_time = time || st;

    if (ext) {
      client_time = ext.st || client_time;
      if (click === 'debug-log') {
        const { extMsg } = ext;
        if (extMsg) {
          if (typeof extMsg === 'object') {
            const { curPage, name } = extMsg;
            click = name;
            page = curPage ? curPage.substr(curPage.lastIndexOf('/') + 1) : '';
          } else {
            click = extMsg;
          }
        } else if (ext.name) {
          if (!page) {
            page = 'debug-log';
          }
          if (ext.name === 'navi') {
            page = '导航调试';
            click = ext.msg;
          } else {
            click = ext.name;
            ext = ext.msg || ext;
          }
        } else if (page === '[RouteLogic]--->' || page === '[navi]--->') {
          page = '探路调试';
          click = ext.msg;
          const re = /[,:]/;
          if (re.test(click)) {
            click = click.split(re)[0];
          }
        } else if (ext.msg) {
          // {},"page":"","click":"debug-log","time":1559832963568,"st":0,"ext":{"msg":"auto go trip","env":{"unfinishOrder":"190606345101280161","isBg":0,"netState":3,"driver":"online","device":"PBEM00","OS":"android","version":"8.1.0","localTime":"6-6 22:56:3"}}}
          if (!page) {
            page = 'debug-log';
          }
          click = ext.msg;
        }
      }
    }

    if (!client_time) {
      client_time = commonParams.ts;
    }

    sheet.push({
      tenantId: commonParams.tenantId,
      commonParams: JSON.stringify(commonParams),
      time: client_time,
      type: type,
      page: page,
      click: click,
      ext: JSON.stringify(ext)
    });
  });

  return sheet;
}
