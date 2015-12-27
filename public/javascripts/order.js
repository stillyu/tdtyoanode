$(function(){
    $("#progressModal").hide();
    $("#fileDiv").hide();
    $("#steps").hide();
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
        $(".fileName").text(file.name);
        setTimeout("$('#uploadDiv').remove();",800);
        setTimeout("$('#fileDiv').show();",800);
        setTimeout("$('#steps').show();",800);
        setTimeout("$('#productModal').modal('show');",1000);
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
        if(step == 4)
            savePic();
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
        $("#glossiness").val("半光");
        setPicDivEdit();
    }
    $(document).on("click",".itemAddSubmitBtn",function(){
        var htmlStr = "";
        htmlStr += "<tr>";
        htmlStr +=      "<td>";
        htmlStr +=          "<img src = '" + $("#pic img").attr("src") + "' width = '200' class = 'img-item'>";
        htmlStr +=      "</td><td class = 'productInfoTd'>";
        htmlStr +=          "<span>" + $("#itemName").val() + "</span><br/><span>" + $("#specification").val() + "</span><br/><span>" + $("#glossiness").val() + "</span>"
        htmlStr +=      "</td><td>";
        htmlStr +=          $("#price").val();
        htmlStr +=      "</td><td>";
        htmlStr +=          $("#count").val();
        htmlStr +=      "</td><td class = 'itemSum'>";
        htmlStr +=          $("#sum").val();
        htmlStr +=      "</td><td>";
        htmlStr +=          "<a href = '#' class = 'btn btn-info btn-sm itemEdit'><span class = 'glyphicon glyphicon-edit'>&nbsp;修改</span></a> <a href = '#' class = 'btn btn-warning btn-sm itemRemove'><span class = 'glyphicon glyphicon-remove'>&nbsp;删除</span></a>";
        htmlStr +=      "</td>";
        htmlStr +=  "</tr>";
        console.log(htmlStr);
        $(".orderTable tbody").append(htmlStr);
        $("#productModal").modal("hide");
        setModalEmpty();
    })
    $(document).on("click",".itemEdit",function(){
        var tr = $(this).parent().parent();
        $("#pic").html("<img src = '" + tr.find("td:eq(0)").find("img").attr("src") + "' width = '200' height = '200' id = 'imgPreview'><a href = '#' class = 'removePic'><span class='glyphicon glyphicon-remove'></span></a>");
        $("#itemName").val(tr.find("td:eq(1)").find("span:eq(0)").text());
        $("#specification").val(tr.find("td:eq(1)").find("span:eq(1)").text());
        $("#glossiness").val(tr.find("td:eq(1)").find("span:eq(2)").text());
        $("#price").val(tr.find("td:eq(2)").text());
        $("#count").val(tr.find("td:eq(3)").text());
        $("#sum").val(tr.find("td:eq(4)").text());
        $("#productModal").modal("show");
        tr.addClass("inEdit");
        $("#itemAddSubmitBtn").addClass("inEditBtn");
        $("#itemAddSubmitBtn").removeClass("itemAddSubmitBtn");
    })
    $(document).on("click",".inEditBtn",function(){
        var tr = $(".inEdit");
        tr.find("td:eq(0)").find("img").attr("src",$("#pic img").attr("src"));
        tr.find("td:eq(1)").find("span:eq(0)").text($("#itemName").val());
        tr.find("td:eq(1)").find("span:eq(1)").text($("#specification").val());
        tr.find("td:eq(1)").find("span:eq(2)").text($("#glossiness").val());
        tr.find("td:eq(2)").text($("#price").val());
        tr.find("td:eq(3)").text($("#count").val());
        tr.find("td:eq(4)").text($("#sum").val());
        $("#productModal").modal("hide");
        tr.removeClass("inEdit");
        $("#itemAddSubmitBtn").removeClass("inEditBtn");
        $("#itemAddSubmitBtn").addClass("itemAddSubmitBtn");
        setModalEmpty();
        console.log(tr.attr("class"));
    })

    //外部js调用
    laydate({
        elem: '#expectedDate', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
        event: 'focus', //响应事件。如果没有传入event，则按照默认的click
    });

    var canvas = this.__canvas = new fabric.Canvas('myCanvas');

    $(".itemPic").click(function(){
        var src = $(this).attr("src");
        var newSrc = getLocalImg(src);
        var img = new Image;
        img.src = src;
        displayWidth = 200;
        displayHeight = displayWidth * img.naturalHeight / img.naturalWidth;
        addImage(newSrc,displayWidth,displayHeight);
    })
    function addImage(src,displayWidth,displayHeight){
        fabric.Image.fromURL(src, function(img) {
            var oImg = img.set({
                left: 0,
                top: 0,
                angle: 0,
                width : displayWidth,
                height : displayHeight,
                hasRotatingPoint : false,
            }).scale(0.9);
            canvas.add(oImg).renderAll();
            canvas.setActiveObject(oImg); 
        },{
            crossOrigin : "anonymous",
        });
    }

    function savePic(){
        var c = document.getElementById('myCanvas');
        var str = c.toDataURL("image/png").replace("image/png", "image/octet-stream");
        console.log(str);
    }
    function getLocalImg(src){
        var newSrc = "";
        $.ajax({
            async : false,
            type : "post",
            url : "api/imgDownload",
            data : {"imgSrc" : src},
            success : function(data){
                newSrc = data;
            }
        })
        return newSrc;
    }

    var typeSuggest = $("#customer").bsSuggest({
        url : "api/getCustomer",
        showBtn: false,
        effectiveFields: ["realName","company"],
        keyField: "realName",
        idField : "_id",
        effectiveFieldsAlias : {"realName" : "姓名","company" : "公司"},
    })
});

(function() {
  fabric.util.addListener(fabric.window, 'load', function() {
    var canvas = this.__canvas || this.canvas,
        canvases = this.__canvases || this.canvases;

    canvas && canvas.calcOffset && canvas.calcOffset();

    if (canvases && canvases.length) {
      for (var i = 0, len = canvases.length; i < len; i++) {
        canvases[i].calcOffset();
      }
    }
  });
})();