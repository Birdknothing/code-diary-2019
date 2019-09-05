function Dologin(){
	var fmdo = $("input[name='fmdo']").val();
	var dopost = $("input[name='dopost']").val();
	var keeptime = $("input[name='keeptime']").val();
	
	var userid = $("input[name='userid']").val();
	var pwd = $("input[name='pwd']").val();
	var vdcode = $("input[name='vdcode']").val();
	$.ajax({
		type:'post',
		url:'/user/login_ajax.php',
		data:{
			fmdo:fmdo,
			myset:'ajax',
			dopost:dopost,
			keeptime:keeptime,
			userid:userid,
			pwd:pwd,
			vdcode:vdcode
		},
		success:function(data,status){
			if(data=='0'){
				alert('验证码错误！');
			}else if(data=='1'){
				alert('用户名不合法！');
			}else if(data=='6'){
				alert('用户名不能为空！');
			}else if(data=='2'){
				alert('密码不能为空！');
			}else if(data=='3'){
				alert('用户名不存在！');
			}else if(data=='4'){
				alert('密码错误！');
			}else if(data=='5'){
				alert('管理员帐号不允许从前台登录！');
			}else if(data=='7'){
				//alert('登录成功！');
				location.reload();
				CheckLogin();
				Indexlogin();
			}else{
				alert('未知错误！');
			}
			return false;
		}
	});
	return false;
}
function liuyanlogin(){
	var fmdo = $("input[name='fmdo1']").val();
	var dopost = $("input[name='dopost1']").val();
	var keeptime = $("input[name='keeptime1']").val();
	
	var userid = $("input[name='userid1']").val();
	var pwd = $("input[name='pwd1']").val();
	var vdcode = $("input[name='vdcode1']").val();
	$.ajax({
		type:'post',
		url:'/user/login_ajax.php',
		data:{
			fmdo:fmdo,
			myset:'ajax',
			dopost:dopost,
			keeptime:keeptime,
			userid:userid,
			pwd:pwd,
			vdcode:vdcode
		},
		success:function(data,status){
			if(data=='0'){
				alert('验证码错误！');
			}else if(data=='1'){
				alert('用户名不合法！');
			}else if(data=='6'){
				alert('用户名不能为空！');
			}else if(data=='2'){
				alert('密码不能为空！');
			}else if(data=='3'){
				alert('用户名不存在！');
			}else if(data=='4'){
				alert('密码错误！');
			}else if(data=='5'){
				alert('管理员帐号不允许从前台登录！');
			}else if(data=='7'){
				//alert('登录成功！');
				location.reload();
				CheckLogin();
				Indexlogin();
			}else{
				alert('未知错误！');
			}
			return false;
		}
	});
	return false;
}
function Doexit(){
	var userid = $("input[name='userid']").val();
	var pwd = $("input[name='pwd']").val();
	var vdcode = $("input[name='vdcode']").val();
	$.ajax({
		type:'post',
		url:'/user/login_ajax.php',
		data:{
			fmdo:'ajaxlogin',
			myset:'ajax',
			dopost:'exit',
		},
		success:function(data,status){
			if(data=='7'){
				//alert('退出成功！');
				location.reload();
			}else{
				alert('未知错误！');
			}
			return false;
		}
	});
	return false;
}