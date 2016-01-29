$(function(){
	$("#submitBtn").click(function(event){
		event.preventDefault();
		$.ajax({
			type : 'post',
			url : 'api/loginCheck',
			data : {
				userName : $("#userName").val(),
				password : $("#password").val(),
			},
			success : function(data){
				if(data == "success")
					window.location.href = '/';
				else
					alert("用户名或密码错误,请重新输入");
			}
		})
	})
})