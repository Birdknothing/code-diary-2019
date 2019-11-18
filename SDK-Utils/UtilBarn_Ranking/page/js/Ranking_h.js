UtilBarn.Start(function (isLogin) {
    UtilBarn.Ranking.Page = 1;
    UtilBarn.Ranking.Size = 40;
    UtilBarn.Ranking.RequestSucceed = true;

    UtilBarn.Ranking.Get(UtilBarn.Ranking.Page, UtilBarn.Ranking.Size, function (data) {
        ajax(data);
    }, function (err) {
        console.log(err);
    });
});

function ajax(data) {
    var jsonObj = data;
    var jsonlist = jsonObj.items;
    var phbList = '';
    $(".phbh_my").html("我的名次：" + jsonObj.my_ranking);
    for (var i in jsonlist) {
        phbList += '<tr>' +
            '<td>' + jsonlist[i].ranking + '</td>' +
            '<td style="background-image:url(' + jsonlist[i].player_avatar + ');">' + (jsonlist[i].player_name) + '</td>' +	//自己从后台数据加载头像路径
            '<td>' + jsonlist[i].score + '</td>' +		//后台数据加载分数
            '</tr>';
    }
    if (jsonObj.total_count > UtilBarn.Ranking.Size * UtilBarn.Ranking.Page) {
        UtilBarn.Ranking.RequestSucceed = true;
    }
    $(".jiazai").remove();
    $(".phbh_list").append(phbList);
}

$("#phbh_off").click(function () {
    window.parent.postMessage("UtilBarn.Ranking.Hide", '*');
});

$(".phbh_r").scroll(function () {
    var scrollTop = $(this).scrollTop();    			//滚动条距离顶部的高度
    var scrollHeight = $(".phbh_r")[0].scrollHeight * 0.8;   	//当前页面的总高度
    var clientHeight = $(this).height();    			//当前可视的页面高度
    if (scrollTop > 10 && scrollTop + clientHeight >= scrollHeight) {   //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 count++;   //每次滑动page加1
        if (UtilBarn.Ranking.RequestSucceed) {
            UtilBarn.Ranking.RequestSucceed = false;
            UtilBarn.Ranking.Page += 1;	//滚动条到达底部  页数+1
            UtilBarn.Ranking.Get(UtilBarn.Ranking.Page, UtilBarn.Ranking.Size, function (data) {
                ajax(data);
            }, function (err) {
                if (UtilBarn.Ranking.Page > 1) {
                    UtilBarn.Ranking.Page -= 1;
                }
                console.log(err);
            });			//然后再执行一遍ajax
        }
    } else if (scrollTop < 0) {
        //滚动条距离顶部的高度小于等于0 TODO
    }
});