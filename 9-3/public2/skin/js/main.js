// JavaScript Document
$(function(){
	//slide弹出层
	$('.slideBtn').each(function(){
		$(this).hover(function(){
			$(this).children('.slideBox').slideDown(300);
		}, function(){
			$(this).children('.slideBox').hide();
		})
	})

	/*头部搜索下拉框筛选*/
$(function () {
    var filter = $('#header_filter');
    filter.find('.selected_type').bind('click',function () {
        if (filter.hasClass('search_filter_selected')){
            filter.removeClass('search_filter_selected');
        }else {
            filter.addClass('search_filter_selected');
        }
    });
    filter.find('.search_type dd').bind('click',function () {
        var search_name = $(this).html();
        var search_type = $(this).attr('data-type');
        $('#header_search_type').val(search_type);
        filter.find('.selected_type').html(search_name);
        filter.removeClass('search_filter_selected');
    });
});
    //头部搜索调用栏目ID  
	$(function(){
	$(".search_type dd").click(function(){
		var type_id = $(this).attr("rel");
		$("#type_id").val(type_id);
		
    });
	
});
	$(function(){$('.other').hover(function(){$(this).children('.colmore').slideToggle();});$('#wix').hover(function(){$('.erweima').toggle();});});
	//头部提醒
	$('.messageBox > dd:first').show();
	$('.messageBox .inboxDt > a').click(function(){
		index = $(this).index('.messageBox .inboxDt > a');
		$(this).addClass('current').siblings("a").removeClass('current');
		$('.messageBox > dd').eq(index).show().siblings('dd').hide();
	})

	//保存二维码
	$("#qrcodesettingBtn").click(function(){
		var ele = $(this);
		var qrcode = $("#qrcode_input").val();
		var qrcodetype = $("#qrcodetype").val();
		
		ele.val('保存中……').attr('disabled', true);
		$.post('/User/saveqrcodesetting', {qrcode:qrcode, qrcodetype:qrcodetype}, function(result){
			if (result.status == 100) {
          	  	
          	    putNotice(result.msg);
			}
			ele.val('保存').attr('disabled', false);
		});
	});
	
});

//定时跳转
function jump(count, target) {    
    window.setTimeout(function(){    
        count--;    
        if(count > 0) {   
            jump(count, target);    
        } else {  
            location.href = target;    
        }    
    }, 1000);    
}


function urlencode(clearString) 
{
    var output = '';
    var x = 0;
     
    clearString = utf16to8(clearString.toString());
    var regex = /(^[a-zA-Z0-9-_.]*)/;
 
    while (x < clearString.length) 
    {
        var match = regex.exec(clearString.substr(x));
        if (match != null && match.length > 1 && match[1] != '') 
        {
            output += match[1];
            x += match[1].length;
        } 
        else
        {
            if (clearString[x] == ' ')
                output += '+';
            else
            {
                var charCode = clearString.charCodeAt(x);
                var hexVal = charCode.toString(16);
                output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
            }
            x++;
        }
    }
 
    function utf16to8(str) 
    {
        var out, i, len, c;
 
        out = "";
        len = str.length;
        for(i = 0; i < len; i++) 
        {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) 
            {
                out += str.charAt(i);
            } 
            else if (c > 0x07FF) 
            {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } 
            else
            {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }
 
    return output;
}

//获取字符长度，中文2，英文1
function strlen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) { 
        var c = str.charCodeAt(i); 
       //单字节加1 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
            len++; 
        } else { 
            len+=2; 
        } 
    } 
    return len;
}
