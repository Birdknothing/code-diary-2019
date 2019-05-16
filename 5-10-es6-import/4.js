var articlePage = $('#articlePage').val()
var articleList = $('#articleList').val()
var articlestr=JSON.stringify(articleSelectArray)  
var num = {
  "type":articlePage,
  "article_list_id":articleList,
  "articleall_id":articlestr,
  }
var jsonNum =JSON.stringify(num)
if(articleSelectArray.length!=0){
    saveall(jsonNum)
  }else{
    layui.layer.msg('请选择文章!', {
    icon: 0,
    time: 2000 //2秒关闭（如果不配置，默认是3秒）
    });
  }