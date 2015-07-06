/**
 * Created by mac on 15/7/6.
 */




window.onload = function(){
    var startbtn = document.getElementById('loginbtn');
    startbtn.onclick = function(){
        var name = $('#name').val().trim();
        if(name.length < 1){
            alert("请输入名字");
            return;
        }

        // 进行连接服务器
        var address = {
            host : "127.0.0.1",
            port : 3010,
            log : true
        };

        pomelo.init(address,function(){
            console.log(name + "    connect to server success!!!");

            var route = "connector.entryHandler.login";
            var msg = { name : name };
            pomelo.request(route,msg,function(data){
                if(data.code == consts.MESSAGE.RES){
                    var playerId = data.playerId;
                    console.log("playerId:"+playerId);

                    // 创建 canvas
                    $('#user').append('<canvas id="mycanvas" width="640px" height="480px" style="border: 1px solid"></canvas>');
                    var canvas = document.getElementById('mycanvas');
                    var context = canvas.getContext('2d');
                    app.canvas = canvas;
                    app.context = context;
                    context.fillRect(0,0,canvas.width,canvas.height);
                    context.fillStyle = '#ff0000';
                    context.font = 20 + "px Arial";
                    context.fillText(name + "   login success!!!",canvas.width/2,canvas.height/2);
                }
            });
        });
    };
}