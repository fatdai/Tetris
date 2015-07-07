/**
 * Created by mac on 15/7/6.
 */


(function(){

    var Player = function(opts){
        opts = opts || {};
        this.name = opts.name || 'default name';
        this.id = opts.id || 0;
        this.map = [];
        this.host = opts.host || false;
        for(var i = 0; i < 20; ++i){
            this.map[i] = [];
            for(var j = 0; j < 10; ++j){
                this.map[i][j] = 0;
            }
        }
    }


    Player.prototype.drawMap = function(context){
        context.save();
        context.strokeStyle = "#000000";
        context.lineWidth = 1;

        if(!this.host){
            context.translate(app.canvas.width/2,0);
        }

        // 绘制背景格子
        var y = 80;
        var endX =  Config.WIDTH * 10;
        context.beginPath();
        context.moveTo(0,y);
        for(var i = 0; i < 21; ++i){
            context.lineTo(endX,y)
            y += Config.HEIGHT;
            context.moveTo(0,y);
        }

        var x = 0;
        var endY = Config.HEIGHT * 20 + 80;
        context.moveTo(x,80);
        for(var i = 0; i < 11; ++i){
            context.lineTo(x,endY);
            x += Config.WIDTH;
            context.moveTo(x,80);
        }
        context.stroke();

        // 绘制下一个形状出现的位置
        context.strokeRect(260-50,140 - 50,100,100);

        // 绘制名字
        if(this.host){
            context.fillText("主机:"+this.name,app.canvas.width/4,25);
        }else{
            context.fillText(this.name,app.canvas.width/4,25);
        }

        context.restore();
    };


    Player.prototype.drawMiddleLine = function(context){
        context.save();
        context.fillStyle = "#000000";
        context.fillRect(app.canvas.width/2-1,0,2,app.canvas.height);
        context.restore();
    };

    Player.prototype.ready = function(){
        var route = 'connector.entryHandler.ready';

        console.log("app.room.player.name:"+app.room.player.name);
        console.log("app.player.opponent.name:"+app.room.opponent.name);

        var roomname = app.room.player.host?app.room.player.name:app.room.opponent.name;
        var msg = {
            roomname : roomname,
            playerId : app.room.player.id
        };
        pomelo.request(route,msg,function(data){
            if(data.code == consts.MESSAGE.READY){
                console.log("-------切换为Gaming State");
                app.state = State.GAMING;
            }
        });
    }

    window.Player = Player;

})();