$(function(){
	$("#customer").bsSuggest({
        url : "api/getCustomer",
        showBtn: false,
        effectiveFields: ["realName","company"],
        keyField: "realName",
        idField : "_id",
        effectiveFieldsAlias : {"realName" : "姓名","company" : "公司"},
    });

	$("#nextBtn").click(function(){
		var customerId = $("#customer").data("id");
		$.ajax({
			type:'post',
			data : {customerId : customerId},
			url : 'api/getOrderDataByUserId',
			success : function(data){
				console.log(data);
			}
		})
	})
})