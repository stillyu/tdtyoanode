(function($){

$.fn.upBox = function(options) {  

//参数
  var defaults = {    

    width : '35%',                //编辑框宽度
    height : '240px',             //编辑框高度
    border : '1px dashed grey',    //编辑框边框
  };    
  var opts = $.extend(defaults, options); 
  //主体功能
  this.each(function(){ 
    //获取当前元素
    var _this = $(this);
    //将div设置成可编辑状态

    _this.attr("contentEditable", "true");

    //设置样式
    _this.attr("style", "width:" + opts.width + ";"
    + "height:" + opts.height + ";" 
    + "border:" + opts.border + ";");

    //监听编辑框粘贴事件
    _this.on('paste', function(e) {
      //判断剪切板中Files类型的对象是否存在
      if(e.originalEvent.clipboardData.getData('Files') != undefined) {
      //获取剪切板内容中的对象
        var items = e.originalEvent.clipboardData.items;
        //逐个处理
        for(var i = 0; i < items.length; i++) {

          var file = items[i].getAsFile();  //获取文件

          var img = new Image();
          //获取图片文件的路径
          uploadFile($(this),file);
        }
      }
    });
});

 //XmlHttpRequest对象  
function createXmlHttpRequest(){  
  if(window.ActiveXObject){ //如果是IE浏览器  
    return new ActiveXObject("Microsoft.XMLHTTP");  
  }
  else if(window.XMLHttpRequest){ //非IE浏览器  
    return new XMLHttpRequest();  
  }
}  
  var POLICY_JSON = {"expiration": "2020-12-01T12:00:00.000Z",
                    "conditions": [
                    ["starts-with", "$key", ""],
                    {"bucket": 'tdtyoa'},
                    ["starts-with", "$Content-Type", ""],
                    ["content-length-range", 0, 524288000]
                    ]
                    };
  var secret = 'I92TX4GDVrcvzTGg7oLchusGYSIU9K';
  var policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));
  // console.log(policyBase64)
  var signature = b64_hmac_sha1(secret, policyBase64);
  // console.log(signature);

function uploadProgress(evt) {
  if (evt.lengthComputable) {
    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
    // document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
  }
  else {
    // document.getElementById('progressNumber').innerHTML = 'unable to compute';
  }
}
function uploadComplete(dom,key) {
  src = "http://i.bjtdty.com/" + key;
  htmlStr = "<img src = '" + src + "' width = '200' height = '200' id = 'imgPreview'><a href = '#' class = 'removePic'><span class='glyphicon glyphicon-remove'></span></a>";
  dom.html(htmlStr);
  dom.attr("contentEditable","false");
  dom.css("border","0");
/* This event is raised when the server send back a response */
// alert("Done - " + evt.target.responseText );
}
function uploadFailed(evt) {
  alert("上传失败" + evt);
}
function uploadCanceled(evt) {
  alert("链接断开,上传失败");
}
function uploadFile(dom,file) {
  var fd = new FormData();
  var d = new Date;
  var m = d.getMonth() + 1;
  var key = "order/" + d.getFullYear() + "/" + m + "/" + d.getDate() + "/" + d.getTime() + ".jpg";
  fd.append('key', key);
  fd.append('Content-Type', file.type);      
  fd.append('OSSAccessKeyId', 'N5fWJnQFrtKFQdhn');
  fd.append('policy', policyBase64)
  fd.append('signature', signature);
  fd.append("file",file);
  var xhr = createXmlHttpRequest()
  xhr.upload.addEventListener("progress", uploadProgress, false);
  xhr.addEventListener("load", uploadComplete(dom,key), false);
  xhr.addEventListener("error", uploadFailed, false);
  xhr.addEventListener("abort", uploadCanceled, false);

  xhr.open('POST', 'http://tdtyoa.oss-cn-beijing.aliyuncs.com', false); //MUST BE LAST LINE BEFORE YOU SEND 
  xhr.send(fd);
}
}
})( jQuery );
