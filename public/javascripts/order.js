$(function(){
    $("#progressModal").hide();
    var uploader = WebUploader.create({

        // swf文件路径
        swf: '/H/js/plugins/webuploader/Uploader.swf',

        // 文件接收服务端。
        server: '/fileUpload',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker',

        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,

        dnd : "#uploadDiv",

        auto : true,

        accept : {
            title: 'corelDrawFile',
            extensions: 'cdr',
            mimeTypes: 'image/x-coreldraw'
        },
    });

    uploader.on("error",function(error){
        if(error == "Q_TYPE_DENIED"){
            alert("请选择正确的cdr文件");
        }
    })

    uploader.on( 'uploadProgress', function( file, percentage ) {
        $("#progressModal").show();
        percentage = percentage.toString();
        var fix2 = percentage.substr(0,percentage.indexOf(".")+3);   
        var precent = fix2 * 100 + "%";
        $("#progressModal h1").text(precent);
    });

    uploader.on( 'uploadComplete', function( file ) {
        $("#progressModal").removeAttr('class').attr('class', '');
        $("#progressModal").addClass("animated");
        $("#progressModal").addClass("bounceOut");
        $("#uploadDiv").addClass("animated").addClass("bounceOut");
        setTimeout("$('#uploadDiv').remove();",800);
    });

    var step = 1;
    function btnStatusCkeck(step){
        if(step == 1){
            $("#addBtn").show();
            $("#resetBtn").hide();
            $("#previousBtn").attr("disabled",true);
            $(".stepNav li").removeClass("active");
            $(".stepNav li:eq(0)").addClass("active");
            $("#step1").show();
            $("#step2").hide();
            $("#step3").hide();
            $("#step4").hide();
        }
        else if(step == 2){
            $("#addBtn").hide();
            $("#resetBtn").hide();
            $("#previousBtn").attr("disabled",false);
            $(".stepNav li").removeClass("active");
            $(".stepNav li:eq(1)").addClass("active");
            $("#step1").hide();
            $("#step2").show();
            $("#step3").hide();
            $("#step4").hide();
        }
        else if(step == 3){
            $("#addBtn").hide();
            $("#resetBtn").show();
            $("#previousBtn").attr("disabled",false);
            $(".stepNav li").removeClass("active");
            $(".stepNav li:eq(2)").addClass("active");
            $("#nextBtn").text("下一步");
            $("#step1").hide();
            $("#step2").hide();
            $("#step3").show();
            $("#step4").hide();
        }
        else if(step == 4){
            $("#addBtn").hide();
            $("#resetBtn").hide();
            $("#previousBtn").attr("disabled",false);
            $("#nextBtn").text("确定下单");
            $(".stepNav li").removeClass("active");
            $(".stepNav li:eq(3)").addClass("active");
            $("#step1").hide();
            $("#step2").hide();
            $("#step3").hide();
            $("#step4").show();
        }
    }
    btnStatusCkeck(step);
    $("#previousBtn").click(function(){
        if(step == 1)
            return 0;
        step--;
        btnStatusCkeck(step);
    });
    $("#nextBtn").click(function(){
        if(step == 4)
            return 0;
        step++;
        btnStatusCkeck(step);
    });

    $("#addBtn").click(function(){
        $("#productModal").modal("show");
    })

    $("#pic").upBox({
        width : "200px",
        height : "200px",
        uploadUrl : "action/picUpload.php",
    })
    $(document).on("click",".removePic",function(){
        var parent = $(this).parent();
        parent.empty();
        parent.attr("contentEditable","true");
        parent.css("border","1px dashed grey");
    })
    //总价自动变化    
    $("#price").change(function(){
        $("#sum").val( $("#price").val() * $("#count").val() );
    })

    $("#count").change(function(){
        $("#sum").val( $("#price").val() * $("#count").val() );
    })
    //置图片输入框为待输入状态
    function setPicDivEdit(){
        $("#pic").empty();
        $("#pic").attr("contentEditable","true");
        $("#pic").css("border","1px dashed grey");
    }
    //置modal中各项input的value为空
    function setModalEmpty(){
        $(".detailClass").each(function(){
            $(this).val("");
        })
        setPicDivEdit();
    }
    $("#itemAddSubmitBtn").click(function(){
        var htmlStr = "";
        htmlStr += "<tr>";
        htmlStr +=      "<td>";
        htmlStr +=          "<img src = '" + $("#pic img").attr("src") + "' width = '200' class = 'img-item'>";
        htmlStr +=      "</td><td class = 'productInfoTd'>";
        htmlStr +=          "<span>" + $("#itemName").val(); + "</span><br/><span>" + $("#specification").val(); + "</span><br/><span>" + $("#glossiness").val(); + "</span>"
        htmlStr +=      "</td><td>";
        htmlStr +=          $("#price").val();
        htmlStr +=      "</td><td>";
        htmlStr +=          $("#count").val();
        htmlStr +=      "</td><td class = 'itemSum'>";
        htmlStr +=          $("#sum").val();
        htmlStr +=      "</td><td>";
        htmlStr +=          $("#remark").val();
        htmlStr +=      "</td><td>";
        htmlStr +=          "<a href = '#' class = 'btn btn-info btn-sm itemEdit'><span class = 'glyphicon glyphicon-edit'>&nbsp;修改</span></a> <a href = '#' class = 'btn btn-warning btn-sm itemRemove'><span class = 'glyphicon glyphicon-remove'>&nbsp;删除</span></a>";
        htmlStr +=      "</td>";
        htmlStr +=  "</tr>";
        $(".orderTable tbody").append(htmlStr);
        $("#productModal").modal("hide");
        setModalEmpty();
    })

    //外部js调用
    laydate({
        elem: '#expectedDate', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
        event: 'focus', //响应事件。如果没有传入event，则按照默认的click
    });

    $("#drag")[0].ondragstart = function (event){  
        console.log("dragStart");  
        event.dataTransfer.setData("Text", event.target.id);  
    };
    $("#canvasDiv")[0].ondrop = function (event)  
            {  
             /*   for (var p in event.dataTransfer) 
                { 
                    console.log(p + " = " + event.dataTransfer[p] + " @@"); 
                } 
            */  
                console.log("onDrop");  
                var id = event.dataTransfer.getData("Text");  
                $(this).append($("#" + id).clone().text($(this).find("div").length));  
                event.preventDefault();  
            };  
            $("#canvasDiv")[0].ondragover = function (event)  
            {  
                console.log("onDrop over");  
                event.preventDefault();  
            }  
  
            $("#canvasDiv")[0].ondragenter = function (event)  
            {  
                console.log("onDrop enter");  
            }  
  
            $("#canvasDiv")[0].ondragleave = function (event)  
            {  
                console.log("onDrop leave");  
            }  
  
            $("#canvasDiv")[0].ondragend = function (event)  
            {  
                console.log("onDrop end");  
            }  
})