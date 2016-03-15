var path = './jsPDF/';
jsPDF = require(path+'jspdf');

//Load all the plugins
var plugins = ['addhtml', 'addimage', 'annotations', 'autoprint', 'cell', 'context2d', 'from_html', 'javascript', 'outline', 'png_support', 'split_text_to_size', 'standard_fonts_metrics', 'svg', 'total_pages'];
plugins.map(function(plugin){
    require(path+'/plugins/'+plugin+'.js');
});

//Modify the save function to save to disk
var fs = require('fs');
jsPDF.API.save = function(filename, callback){
    fs.writeFile(filename, this.output(), callback);
}



//顺丰 216*140mm
//韵达 230*127mm
option = {
            orientation : 'L',
            unit : 'mm',
            format : 'shunfeng',
        };
var doc = new jsPDF(option);
doc.addFont("Microsoft YaHei","Microsoft YaHei",'Normal','Unicode');
font = doc.getFontList();
font = doc.setFont("Microsoft Yahei","Normal");
doc.text(28, 40.5, '北京');
doc.save('test.pdf');