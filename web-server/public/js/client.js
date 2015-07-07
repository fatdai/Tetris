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

                if(data.code == consts.MESSAGE.ERR){
                    alert(name + "    already exsit!");
                    pomelo.disconnect();
                    return;
                }

                app.createCanvas();
                app.msgHandler();
                app.start();

                console.log("----------------------------------");
                if(data.code == consts.MESSAGE.STARTGAME){

                    // 隐藏输入名字的地方
                    $('#inputdiv').hide();

                    // 可以开始游戏
                    var room = new Room(data.room);
                    room.player = new Player({
                        name : data.room.opponent.name,
                        id : data.room.opponent.id
                    });
                    room.opponent = new Player({
                        name : data.room.player.name,
                        id : data.room.player.id,
                        host : true
                    });

                    app.room = room;
                    app.state = State.READY;

                    // 告诉服务器准备好了
                    // 服务端发现两边都准备好了后,服务端开始
                    room.player.ready();

                }else if(data.code == consts.MESSAGE.RES){

                    $('#inputdiv').hide();

                    var room = new Room(data.player);
                    room.player = new Player({
                        name : data.player.name,
                        id : data.player.id,
                        host : true
                    });

                    app.room = room;

                    // 等待玩家
                    app.state = State.WAITING;
                }
            });
        });
    };
}