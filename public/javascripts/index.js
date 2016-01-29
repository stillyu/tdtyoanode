$(function(){
	$("#logoutBtn").click(function(){
		$.ajax({
			type : 'post',
			url : 'api/logout',
			success : function(data){
				window.location.reload();
			}
		})
	})
})