$(function(){
    $("#progressModal").hide();
    $("#fileDiv").hide();
    $("#steps").hide();
    $("#imgHide").hide();
    var fabricItem = 1;
    var uploader = WebUploader.create({

        // swf文件路径
        swf: '/H/js/plugins/webuploader/Uploader.swf',

        // 文件接收服务端。
        server: 'http://192.168.1.14/fileUpload.php',

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
        $(".fileName span").text(file.name);
        var myDate = new Date();
        var ymd = myDate.getFullYear() + '/' + myDate.getMonth() + 1 + '/' + myDate.getDate() + '/';
        $(".fileName").parent().attr("href","mycdr://192.168.1.14/ftp/" + ymd + file.name);
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
            $("#nextBtn").removeClass("orderSubmitBtn");
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
            $("#nextBtn").addClass("orderSubmitBtn");
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
        uploadUrl : "/api/imgUpload",
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
        $("#count").val("1");
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
    })

    //外部js调用
    laydate({
        elem: '#expectedTime', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
        event: 'focus', //响应事件。如果没有传入event，则按照默认的click
    });

    var canvas = this.__canvas = new fabric.Canvas('myCanvas');
    canvas.setBackgroundColor('rgba(255, 255, 255, 1)');

    $(document).on("click",".picToDesign",function(){
        var src = $(this).attr("src");
        var img = new Image();
        img.src = src;
        displayWidth = 200;
        displayHeight = displayWidth * img.naturalHeight / img.naturalWidth;
        addImage(src,displayWidth,displayHeight);
        fabricItem++;
    });
    $(document).on("click",".tagLabel",function(){
        $(this).remove();
    })
    $("#tagsAddBtn").click(function(){
        $(".tags p").append("<span class = 'label label-primary tagLabel'><span>"+ $("#tags").val() + "</span>&nbsp;&nbsp;&nbsp;&nbsp;&times;</span>&nbsp;&nbsp;&nbsp;&nbsp;");
        $("#tags").val("");
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
            }).scale(1);
            canvas.add(oImg).renderAll();
            canvas.setActiveObject(oImg); 
        });
    }

    function savePic(){
        canvas.forEachObject(function(item,key){
            item['hasControls'] = false;
            item['hasBorders'] = false;
        });
        canvas.renderAll();
        orderDataJson = getOrderJson();
        json = JSON.stringify(orderDataJson);
        console.log(json);
        $.ajax({
            async : false,
            type : 'post',
            url : '/api/generatePdf',
            data : {"jsonStr" : json},
            success : function(data){
                $("#pdfPrview").attr("src",data);
            }
        })
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

    receiverSugg = $("#receiver").bsSuggest({
        url : "api/getReceiver",
        showBtn: false,
        effectiveFields: ["realName","address"],
        keyField: "realName",
        idField : "_id",
        effectiveFieldsAlias : {"realName" : "姓名","address" : "地址"},
    });

    $(".stepLabel").click(function(){
        $(this).toggleClass("label-primary");
    })

    $("#resetBtn").click(function(){
        designResourceLoad();
    })

    function designResourceLoad(){
        canvas.forEachObject(function(item,key){
            item.remove();
        });
        $("#imgToDesign").html("");
        var htmlStr = "";
        var itemCount = 0;
        $(".orderTable tbody tr").each(function(){
            src = $(this).find("td").find("img").attr("src");
            htmlStr += "<img src = '" + src + "' width = '200' class = 'picToDesign'>";
            itemCount++;
        })
        $("#myCanvas").attr("height",603-21*itemCount);
        $("#myCanvas").css("height",603-21*itemCount + "px");
        $("#imgToDesign").append(htmlStr);
    }
//点击添加新客户
    $("#addNewCustomerBtn").click(function(){
        $("#addNewUserModal").modal("show");
        $("#userSubmitBtn").data("userType","customer");
        $(".addNewUserModalHeader").text("增加新客户");
    })
//点击添加新收货人
    $("#addNewReceiverBtn").click(function(){
        $("#addNewUserModal").modal("show");
        $("#userSubmitBtn").data("userType","receiver");
        $(".addNewUserModalHeader").text("增加收货人");
    })
    $(document).on("click","#userSubmitBtn",function(){
        $.ajax({
            type : 'post',
            data : {
                "realName" : $("#realName").val(),
                "company" : $("#company").val(),
                "phone" : $("#phone").val(),
                "mobilePhone" : $("#mobilePhone").val(),
                "address" : $("#address").val(),
                "userType" : $("#userSubmitBtn").data("userType"),
            },
            url : 'api/addNewUser',
            success : function(data){
                if(data == "fail")
                    alert("该姓名已存在!");
                $("#addNewUserModal").modal("hide");
                $("#customer").bsSuggest("destroy");
                $("#receiver").bsSuggest("destroy");
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

                receiverSugg = $("#receiver").bsSuggest({
                    url : "api/getReceiver",
                    showBtn: false,
                    effectiveFields: ["realName","address"],
                    keyField: "realName",
                    idField : "_id",
                    effectiveFieldsAlias : {"realName" : "姓名","address" : "地址"},
                });
            },
        })
    })
//点击确定下单
    $(document).on("click",".orderSubmitBtn",function(){
        
    })

    function getOrderJson(){
        var tags = [];
        $(".tagLabel").each(function(){
            tags.push($(this).find("span").text());
        })
        orderSum = 0;
        $(".itemSum").each(function(){
            orderSum += parseInt($(this).text());
        })
        var step = [];
        $(".stepLabel").each(function(){
            if($(this).hasClass("label-primary")){
                var stepDetail = {
                    name : $(this).text(),
                    complete : false,
                }
                step.push(stepDetail);
            }
        })
        var detail = [];
        $(".orderTable tbody tr").each(function(){
            var itemJson = {
                pic : $(this).find("td:eq(0)").find("img").attr("src"),
                itemName : $(this).find("td:eq(1)").find("span:eq(0)").text(),
                specification : $(this).find("td:eq(1)").find("span:eq(1)").text(),
                glossiness : $(this).find("td:eq(1)").find("span:eq(2)").text(),
                price : $(this).find("td:eq(2)").text(),
                count : $(this).find("td:eq(3)").text(),
                sum : $(this).find("td:eq(4)").text(),
            }
            detail.push(itemJson);
        })
        var img = [];
        var canvasDataJson = JSON.stringify(canvas);
        canvasDataJson = JSON.parse(canvasDataJson);
        for(var i = 0; i < canvasDataJson.objects.length; i++){
            imgJson = {
                        imgSrc :  canvasDataJson.objects[i].src,
                        left : canvasDataJson.objects[i].left,
                        top : canvasDataJson.objects[i].top,
                        width : canvasDataJson.objects[i].width * canvasDataJson.objects[i].scaleX,
                        height : canvasDataJson.objects[i].height * canvasDataJson.objects[i].scaleY,
            };
            img.push(imgJson);
        }
        var orderJson = {
            customer : $("#customer").data("id"),
            file : $(".fileName").parent().attr("href").substr(8),
            tags : tags,
            time : (new Date()).valueOf() / 1000,
            expectedTime : Date.parse(new Date($("#expectedTime").val().replace(/-/g,'/'))) / 1000,
            receiver : $("#receiver").data("id"),
            sum : orderSum,
            paid : 0,
            unpaid : orderSum,
            remark : $("#remark").val(),
            step : step,
            expectLogisticsWay : $("#logisticsWay").val(),
            detail : detail,
            print : img,
        };
        return orderJson;
    }//end of getOrderJson
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