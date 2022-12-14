function uploadRec() {
    //停止录音，得到了录音文件blob二进制对象，想干嘛就干嘛
    rec.stop(function(blob, duration) {
        /*
        blob文件对象，可以用FileReader读取出内容
        ，或者用FormData上传，本例直接上传二进制文件
        ，对于普通application/x-www-form-urlencoded表单上传
        ，请参考github里面的例子
        */
        var form = new FormData();
        form.append("upfile", blob, "recorder.mp3"); //和普通form表单并无二致，后端接收到upfile参数的文件，文件名为recorder.mp3

        //直接用ajax上传
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://baidu.com/修改成你的上传地址"); //这个假地址在控制台network中能看到请求数据和格式，请求结果无关紧要
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                alert(xhr.status == 200 ? "上传成功" : "测试请先打开浏览器控制台，然后重新录音，在network选项卡里面就能看到上传请求数据和格式了");
            }
        }
        xhr.send(form);
    }, function(msg) {
        alert("录音失败:" + msg);
    });
};
export default uploadRec