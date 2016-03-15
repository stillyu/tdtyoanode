$(function(){
    //获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    customerSugg = $("#customer").bsSuggest({
        url : "api/getCustomer",
        showBtn: false,
        effectiveFields: ["realName","company"],
        keyField: "realName",
        idField : "_id",
        effectiveFieldsAlias : {"realName" : "姓名","company" : "公司"},
    }).on('onSetSelectValue', function (e, keyword) {
        $("#receiver").val(keyword.key);
        $("#receiver").data("id",keyword.id);
    });
    $('#timeLine').jplist({
        itemsBox: ".timeLineContent",
        itemPath: ".timeline-item",
        panelPath:"#panel",
    });
    $('.scroll').slimScroll({
        height: 610,
    });
    $("#searchBtn").click(function(){
        var year = $("#year").val();
        var month = $("#month").val();
        var customer = $("#customer").data("id");
        var realName = $("#customer").val();
        window.location.href = 'orderManage?year=' + year + '&month=' + month + '&customer=' + customer;
    });
    $("#year").val(getQueryString('year'));
    $("#month").val(getQueryString('month'));
    $(document).on("click",".viewBtn",function(e){
        e.preventDefault();
        var htmlStr = '<li><a class="J_menuItem" style = "display:none;" href="' + $(this).attr("href") + '" id = "append-' + $(this).data("id") + '">' + $(this).data("id") + '</a></li>';
        console.log(htmlStr);
        $("#subPageUl",window.parent.document).append(htmlStr);
        window.parent.subPage("#append-" + $(this).data('id'));
    })
    $(document).on("click",".deleteBtn",function(e){
        var orderId = $(this).data("id");
        if(confirm("确认删除" + orderId + "订单?")){
            $.ajax({
                url : "api/deleteOrder",
                data : {orderId : orderId},
                type : "post",
                success : function(data){
                    alert("删除成功");
                    window.location.reload();
                }
            })
        }
    })
})